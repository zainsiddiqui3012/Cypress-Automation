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

    const testScenario = {
      likelihood: { label: "Almost Certain", value: 5 },
      impact: { label: "Catastrophic", value: 5 },
      inherentCalculation: 25, // 5 x 5 = 25
      inherentLabel: "High",
      residualLabel: "Moderate",
      currentLabel: "High",
    };

    const allControlsToAdd = [
      "Control Definition (preventative)",
      "updated_ctrl_taxanomy",
    ];

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
      it("<No Control>. Calculate All Risks When no Control Definition is Linked, Likelihood, impact/efficacy are 50 and Control Strength set 25% ", () => {
        cy.readFile(riskRegisterData).then((data) => {
          loc.forEach((selector) => {
            riskRegister_PO.editImpactLikelihoodValue(
              selector,
              data.calculations.withControlStrength.updatedLikelihoodImpact
                .likelihoodImpactValue
            );
          });
          // Step 2: Now apply control strength
          riskRegister_PO.selectControlStrength(
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .selectedControlStrength
          );

          // Step 3: First select likelihood and impact labels to establish inherent risk
          // Based on your JSON data, we need to determine which likelihood x impact gives us the expected results
          // Let's use Almost Certain (5) x Catastrophic (5) = 25 as the base scenario
          // Select likelihood and impact labels first
          riskRegister_PO.selectLikelihoodValueViaAssessment(
            testScenario.likelihood.label
          );
          riskRegister_PO.openImpactAssessmentForm();
          riskRegister_PO.selectImpactValueViaAssessment(
            testScenario.impact.label
          );

          // Verify inherent risk is calculated correctly (should be "High" = 25)
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.inherentLabel,
            locators.risk.riskRegister.inherentRisk
          );

          // At this point, residual and current should not match inherent (no controls applied yet)
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.residualLabel,
            locators.risk.riskRegister.residualRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.currentLabel,
            locators.risk.riskRegister.currentRisk
          );

          // Step 4: Verify risk labels after control strength application
          // Inherent should remain the same (High)
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.inherentLabel,
            locators.risk.riskRegister.inherentRisk
          );

          // Residual and Current should change based on control strength
          riskRegister_PO.verifyCalculatedRiskLabel(
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .residualRiskLabel, // "Moderate"
            locators.risk.riskRegister.residualRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .currentRiskLabel, // "High"
            locators.risk.riskRegister.currentRisk
          );

          // Step 5: Verify Stats values with control strength applied
          riskRegister_PO.openControlFlyover();
          riskRegister_PO.verifyStatsTableValuesWithControlStrength(
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .selectedControlStrengthValue, // "25.0000"
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .residualRiskValue, // "18.7500"
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .currentRiskValue // "23.4375"
          );
          riskRegister_PO.closeTheFlyover();

          cy.waitForTopMsgLoaderToDisappear(300000);
          cy.waitForMyGridLoaderToDisappear(300000);
        });
      });
      it("<No Control>. Calculate All Risks When no Control Definition is Linked, Likelihood, impact/efficacy are 100 and Control Strength set 25% ", () => {
        cy.readFile(riskRegisterData).then((data) => {
          loc.forEach((selector) => {
            riskRegister_PO.editImpactLikelihoodValue(
              selector,
              data.calculations.withControlStrength.maxLikelihoodImpact
                .likelihoodImpactValue
            );
          });
          // Step 2: Now apply control strength
          riskRegister_PO.selectControlStrength(
            data.calculations.withControlStrength.maxLikelihoodImpact
              .selectedControlStrength
          );
          // Step 3: First select likelihood and impact labels to establish inherent risk
          // Based on your JSON data, we need to determine which likelihood x impact gives us the expected results
          // Let's use Almost Certain (5) x Catastrophic (5) = 25 as the base scenario
          // Select likelihood and impact labels first
          riskRegister_PO.selectLikelihoodValueViaAssessment(
            testScenario.likelihood.label
          );
          riskRegister_PO.openImpactAssessmentForm();
          riskRegister_PO.selectImpactValueViaAssessment(
            testScenario.impact.label
          );

          // Step 4: Verify risk labels after control strength application
          // Inherent should remain the same (High)
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.inherentLabel,
            locators.risk.riskRegister.inherentRisk
          );

          // Residual and Current should change based on control strength
          riskRegister_PO.verifyCalculatedRiskLabel(
            data.calculations.withControlStrength.maxLikelihoodImpact
              .residualRiskLabel, // "Moderate"
            locators.risk.riskRegister.residualRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            data.calculations.withControlStrength.maxLikelihoodImpact
              .currentRiskLabel, // "High"
            locators.risk.riskRegister.currentRisk
          );

          // Step 5: Verify Stats values with control strength applied
          riskRegister_PO.openControlFlyover();
          riskRegister_PO.verifyStatsTableValuesWithControlStrength(
            data.calculations.withControlStrength.maxLikelihoodImpact
              .selectedControlStrengthValue, // "25.0000"
            data.calculations.withControlStrength.maxLikelihoodImpact
              .residualRiskValue, // "18.7500"
            data.calculations.withControlStrength.maxLikelihoodImpact
              .currentRiskValue // "18.7500"
          );
          riskRegister_PO.closeTheFlyover();

          cy.waitForTopMsgLoaderToDisappear(300000);
          cy.waitForMyGridLoaderToDisappear(300000);
        });
      });
    });
  }
);
