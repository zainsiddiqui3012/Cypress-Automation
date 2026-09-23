import locators from "../../../../fixtures/locators.json";
import RiskRegister_PO from "../../../../support/POM/RiskModule_PO/RiskRegister_PO";

import RiskCategory_PO from "../../../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../../../support/POM/RiskModule_PO/RiskDefinition_PO";
import Customer from "../../../../support/POM/Administration/Customer";

import riskCatData from "../../../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json";
import riskDefData from "../../../../fixtures/RiskModule/Risk_Process_Taxonomy/riskDefinition.json";

const riskRegisterData =
  "cypress/fixtures/RiskRegister/RiskRegister.json";

describe(
  "Calculate All Risks With Assessments Within Risk Register When Assessment is ON, Manage Detail Control is ON, Use Control Strength is ON",
  {
    tags: [
      "@smoke",
      "@with-assessment",
      "@calculations",
      "@risk-register",
      "@risk-register-calculations",
      "@with-control-strength",
    ],
  },
  () => {
    const riskCategory_PO = new RiskCategory_PO();
    const riskDefinition_PO = new RiskDefinition_PO();
    const riskRegister_PO = new RiskRegister_PO();
    const rmUser = Cypress.env("riskManagement").rmUserA;
    const loc = [
      locators.risk.riskRegister.implementedValue,
      locators.risk.riskRegister.efficacyValue,
    ];
    // Define likelihood and impact arrays with their values
    const likelihoodArray = [
      { label: "Likely", value: 4 },
      { label: "Almost Certain", value: 5 },
    ];

    const impactArray = [
      { label: "Major", value: 4 },
      { label: "Catastrophic", value: 5 },
    ];

    // Define risk magnitude mapping based on calculated values
    const riskMagnitudeMapping = {
      16: "Moderate", // 4x4 = 16 (> 12.0, ≤ 19.0)
      20: "High", // 4x5, 5x4 = 20 (> 19.0, ≤ 25.0)
      25: "High", // 5x5 = 25 (> 19.0, ≤ 25.0)
    };
    const testScenario = {
      likelihood: { label: "Almost Certain", value: 5 },
      impact: { label: "Catastrophic", value: 5 },
      inherentCalculation: 25, // 5 x 5 = 25
      inherentLabel: "High",
      residualLabel: "Moderate",
      currentLabel: "High",
    };
    const allControlsToAdd = ["Control Definition (Corrective)"];

    before(() => {
      // Login with None Space Super Admin and Filter the Customer to disable Use Control Strength to Calculate Risk (SunModule).
      const customerUser = Cypress.env("kxi").none;
      cy.loginWithSession(
        `login with ${customerUser.username}`,
        customerUser.username,
        customerUser.password,
        customerUser.key
      );
      cy.visitCustomer();
      riskRegister_PO.filterCustomer("riskcustomerA", false);
      riskRegister_PO.toggleControlStrengthSetting(true);
      riskRegister_PO.clickSaveBtn();

      // Clear all sessions, caches, and storage
      cy.clearAllBrowserData();
    });
    //blocker: https://360factors.atlassian.net/browse/PD-40834
    //if new Risk category/definition is created it should be added with risk applicability flyover every time
    context.skip(
      "create Risk Category and Risk Definitions from Taxonomies Screen",
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            `login with ${rmUser.username}`,
            rmUser.username,
            rmUser.password,
            rmUser.key
          );
          cy.visitRiskTaxonomies();
        });

        it("create new Risk Category", () => {
          riskCategory_PO.clickOnMyTaxonomiesTab();
          riskCategory_PO.addCategoryButton();
          riskCategory_PO.addCategoryInfo(
            riskCatData[0].riskCategoryID,
            riskCatData[0].riskName,
            riskCatData[0].description,
            true
          );
          riskCategory_PO.savebutton();
        });

        it("create new Risk Definition", () => {
          riskCategory_PO.clickOnMyTaxonomiesTab();
          riskDefinition_PO.addDefinitionButton();
          riskDefinition_PO.addDefinitionInfo(
            riskDefData[0].riskDefinitionId,
            riskDefData[0].definitionName,
            riskDefData[0].description,
            true
          );
          riskDefinition_PO.savebutton();
        });
      }
    );

    //blocker: https://360factors.atlassian.net/browse/PD-40834
    context.skip(
      "add and verify Risk Category, Definition in Risk Register Grid",
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            `login with ${rmUser.username}`,
            rmUser.username,
            rmUser.password,
            rmUser.key
          );
          cy.visitRiskRegister();
          cy.waitForTopMsgLoaderToDisappear(300000);
          cy.waitForMyGridLoaderToDisappear(300000);
        });

        /////*****Applicable flyer - Marked Applicable */
        it("save Risk Category, definition with Applicable in Risk Applicability Flyover", () => {
          cy.readFile(riskRegisterData).then((data) => {
            data.threeElipsesOptions.riskApplicability.applicabilityStatus.status.forEach(
              (status) => {
                riskRegister_PO.threeEllipsisMenu();
                riskRegister_PO.riskTaxonomyclick();
                riskRegister_PO.markRiskTaxonomy(
                  data.threeElipsesOptions.riskApplicability.businessUnit
                    .selectedBU,
                  data.threeElipsesOptions.riskApplicability.riskCategory,
                  status
                );
                riskRegister_PO.saveRiskTaxonomy();
              }
            );
          });
        });

        it("Verify That Risk Category and Definition is added in Risk Register Grid ", () => {
          cy.readFile(riskRegisterData).then((data) => {
            riskRegister_PO.verifyRiskCategoryInGrid(
              data.threeElipsesOptions.riskApplicability.riskCategory
            );
            riskRegister_PO.expandRiskCategoryInGrid(
              data.threeElipsesOptions.riskApplicability.riskCategory
            );
            riskRegister_PO.verifyRiskDefinitionInGrid(
              data.threeElipsesOptions.riskApplicability.riskDefinition
            );
          });
        });
      }
    );

    context("Test With No Control", () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitRiskRegister();
        cy.waitForStableGrid(300000);
        cy.readFile(riskRegisterData).then((data) => {
          cy.waitUntilVerifyControlStrengthWithReload(
            data.threeElipsesOptions.riskApplicability
              .riskDefinitionWithAssessment,
            true
          );
          loc.forEach((selector) => {
            riskRegister_PO.clearImpactLikelihoodValue(selector);
          });
        });
      });
      it("<No Control>. This test will calculate All Risks with Likelihood and impact dimensions with 50% impact/efficacy", () => {
        cy.readFile(riskRegisterData).then((data) => {
          // Now apply control strength to Zero (0%)
          riskRegister_PO.selectControlStrength(
            data.calculations.withDimensions.defaultControlStrength
          );
          //verify that Effectiveness and implemented are 50
          loc.forEach((selector) => {
            riskRegister_PO.editImpactLikelihoodValue(
              selector,
              data.calculations.withDimensions.likelihoodImpactValue
            );
          });
          likelihoodArray.forEach((likelihood) => {
            impactArray.forEach((impact) => {
              const calculatedValue = likelihood.value * impact.value;
              const expectedRiskLabel = riskMagnitudeMapping[calculatedValue];
              riskRegister_PO.scrollToHorizontalCenter();
              riskRegister_PO.selectLikelihoodValueViaAssessment(
                likelihood.label
              );
              riskRegister_PO.openImpactAssessmentForm();
              riskRegister_PO.selectImpactValueViaAssessment(impact.label);
              //verify Inherent Risk Label
              riskRegister_PO.verifyCalculatedRiskLabel(
                expectedRiskLabel,
                locators.risk.riskRegister.inherentRisk
              );
              //verify Residual Risk Label
              riskRegister_PO.verifyCalculatedRiskLabel(
                expectedRiskLabel,
                locators.risk.riskRegister.residualRisk
              );
              //verify Current Risk Label
              riskRegister_PO.verifyCalculatedRiskLabel(
                expectedRiskLabel,
                locators.risk.riskRegister.currentRisk
              );
              //opening the control Flyover to verify the Risk Values in Digit
              riskRegister_PO.openControlFlyover();
              riskRegister_PO.verifyStatsTableValues(calculatedValue);
              riskRegister_PO.closeTheFlyover();
              cy.waitForTopMsgLoaderToDisappear(300000);
              cy.waitForMyGridLoaderToDisappear(300000);
            });
          });
        });
      });

      it("<No Control>. This test will calculate All Risks with Likelihood and impact dimensions with 100% impact/efficacy", () => {
        cy.readFile(riskRegisterData).then((data) => {
          loc.forEach((selector) => {
            riskRegister_PO.clearImpactLikelihoodValue(selector);
          });
          loc.forEach((selector) => {
            riskRegister_PO.editImpactLikelihoodValue(
              selector,
              data.calculations.withDimensions.maxLikelihoodImpactValue
            );
          });
          likelihoodArray.forEach((likelihood) => {
            impactArray.forEach((impact) => {
              const calculatedValue = likelihood.value * impact.value;
              const expectedRiskLabel = riskMagnitudeMapping[calculatedValue];
              riskRegister_PO.scrollToHorizontalCenter();
              riskRegister_PO.selectLikelihoodValueViaAssessment(
                likelihood.label
              );
              riskRegister_PO.openImpactAssessmentForm();
              riskRegister_PO.selectImpactValueViaAssessment(impact.label);
              //verify Inherent Risk Label
              riskRegister_PO.verifyCalculatedRiskLabel(
                expectedRiskLabel,
                locators.risk.riskRegister.inherentRisk
              );
              //verify Residual Risk Label
              riskRegister_PO.verifyCalculatedRiskLabel(
                expectedRiskLabel,
                locators.risk.riskRegister.residualRisk
              );
              //verify Current Risk Label
              riskRegister_PO.verifyCalculatedRiskLabel(
                expectedRiskLabel,
                locators.risk.riskRegister.currentRisk
              );
              //opening the control Flyover to verify the Risk Values in Digit
              riskRegister_PO.openControlFlyover();
              riskRegister_PO.verifyStatsTableValues(calculatedValue);
              riskRegister_PO.closeTheFlyover();
              cy.waitForTopMsgLoaderToDisappear(300000);
              cy.waitForMyGridLoaderToDisappear(300000);
            });
          });
        });
      });
    });
  }
);
