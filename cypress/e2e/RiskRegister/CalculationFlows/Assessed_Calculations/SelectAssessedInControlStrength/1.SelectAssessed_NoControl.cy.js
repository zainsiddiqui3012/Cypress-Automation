import locators from "../../../../../fixtures/locators.json";
import RiskRegister_PO from "../../../../../support/POM/RiskModule_PO/RiskRegister_PO";

import RiskCategory_PO from "../../../../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../../../../support/POM/RiskModule_PO/RiskDefinition_PO";

import riskCatData from "../../../../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json";
import riskDefData from "../../../../../fixtures/RiskModule/Risk_Process_Taxonomy/riskDefinition.json";
import assessedCalculations from "../../../../../fixtures/RiskRegister/AssessedCalculations.json";

const riskRegisterData =
  "cypress/fixtures/RiskRegister/RiskRegister.json";

describe(
  "Calculate all Risks with Assessed% Option When No Control is Added or Link in Risk Definition",
  {
    tags: [
      "@smoke",
      "@pd45690",
      "@with-assessment",
      "@calculations",
      "@risk-register",
      "@risk-register-calculations",
      "@with-assessed-no-control",
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

    const assessedArray = [
      { label: "Moderate", value: "18.7500" },
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

    context("Test With No Control",{tags:"@pd45691"}, () => {
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
          //verify that Effectiveness and implemented are 50
          loc.forEach((selector) => {
            riskRegister_PO.editImpactLikelihoodValue(
              selector,
              data.calculations.withDimensions.likelihoodImpactValue
            );
          });

          // Get calculation scenarios for 50% efficacy and implementation
          const calculationScenarios = assessedCalculations.efficacy50Implementation50;

          assessedArray.forEach((assessed) => {
            const assessedKey = `Assessed (${assessed.value}%)`;
            const scenario = calculationScenarios[assessedKey];

            // Add safety check
            if (!scenario) {
              throw new Error(`Missing calculation scenario for ${assessedKey}. Available keys: ${Object.keys(calculationScenarios).join(', ')}`);
            }

            // Select Control Strength (Assessed percentage)
            riskRegister_PO.selectControlStrength(assessedKey);
            riskRegister_PO.selectImpactValueViaAssessment(assessed.label);
            likelihoodArray.forEach((likelihood) => {
              impactArray.forEach((impact) => {
                const calculationKey = `${likelihood.label}-${impact.label}`;
                const expectedValues = scenario.calculations[calculationKey];

                riskRegister_PO.scrollToHorizontalCenter();
                riskRegister_PO.selectLikelihoodValueViaAssessment(likelihood.label);
                riskRegister_PO.openImpactAssessmentForm();
                riskRegister_PO.selectImpactValueViaAssessment(impact.label);

                //verify Inherent Risk Label
                riskRegister_PO.verifyCalculatedRiskLabel(
                  expectedValues.labels.inherent,
                  locators.risk.riskRegister.inherentRisk
                );
                //verify Residual Risk Label
                riskRegister_PO.verifyCalculatedRiskLabel(
                  expectedValues.labels.residual,
                  locators.risk.riskRegister.residualRisk
                );
                //verify Current Risk Label
                riskRegister_PO.verifyCalculatedRiskLabel(
                  expectedValues.labels.current,
                  locators.risk.riskRegister.currentRisk
                );

                //opening the control Flyover to verify the Risk Values in Digit
                riskRegister_PO.openControlFlyover();
                riskRegister_PO.verifyStatsTableValuesWithControlStrength(
                  scenario.controlStrength,
                  expectedValues.residual,
                  expectedValues.current,
                  expectedValues.inherent
                );
                riskRegister_PO.closeTheFlyover();
                cy.waitForTopMsgLoaderToDisappear(300000);
                cy.waitForMyGridLoaderToDisappear(300000);
              });
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

          // Get calculation scenarios for 100% efficacy and implementation
          const calculationScenarios = assessedCalculations.efficacy100Implementation100;

          assessedArray.forEach((assessed) => {
            const assessedKey = `Assessed (${assessed.value}%)`;
            const scenario = calculationScenarios[assessedKey];

            // Add safety check
            if (!scenario) {
              throw new Error(`Missing calculation scenario for ${assessedKey}. Available keys: ${Object.keys(calculationScenarios).join(', ')}`);
            }
            
            likelihoodArray.forEach((likelihood) => {
              impactArray.forEach((impact) => {
                const calculationKey = `${likelihood.label}-${impact.label}`;
                const expectedValues = scenario.calculations[calculationKey];

                riskRegister_PO.scrollToHorizontalCenter();
                riskRegister_PO.selectLikelihoodValueViaAssessment(likelihood.label);
                riskRegister_PO.openImpactAssessmentForm();
                riskRegister_PO.selectImpactValueViaAssessment(impact.label);

                //verify Inherent Risk Label
                riskRegister_PO.verifyCalculatedRiskLabel(
                  expectedValues.labels.inherent,
                  locators.risk.riskRegister.inherentRisk
                );
                //verify Residual Risk Label
                riskRegister_PO.verifyCalculatedRiskLabel(
                  expectedValues.labels.residual,
                  locators.risk.riskRegister.residualRisk
                );
                //verify Current Risk Label
                riskRegister_PO.verifyCalculatedRiskLabel(
                  expectedValues.labels.current,
                  locators.risk.riskRegister.currentRisk
                );

                //opening the control Flyover to verify the Risk Values in Digit
                riskRegister_PO.openControlFlyover();
                riskRegister_PO.verifyStatsTableValuesWithControlStrength(
                  scenario.controlStrength,
                  expectedValues.residual,
                  expectedValues.current,
                  expectedValues.inherent
                );
                riskRegister_PO.closeTheFlyover();
                cy.waitForTopMsgLoaderToDisappear(300000);
                cy.waitForMyGridLoaderToDisappear(300000);
              });
            });
          });
        });
      });
    });
  }
);
