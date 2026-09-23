import locators from "../../../../../fixtures/locators.json";
import RiskRegister_PO from "../../../../../support/POM/RiskModule_PO/RiskRegister_PO";

import RiskCategory_PO from "../../../../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../../../../support/POM/RiskModule_PO/RiskDefinition_PO";
import Customer from "../../../../../support/POM/Administration/Customer";

import riskCatData from "../../../../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json";
import riskDefData from "../../../../../fixtures/RiskModule/Risk_Process_Taxonomy/riskDefinition.json";

const riskRegisterData = "cypress/fixtures/RiskRegister/RiskRegister.json";

describe(
  "Calculate all Risks with Assessed% Option When Control is Added and Grid Control Strength reverted to (Calculated%) and then to (Medium%)",
  {
    tags: [
      "@smoke",
      "@pd45690",
      "@with-assessment",
      "@calculations",
      "@risk-register",
      "@risk-register-calculations",
      "@with-assessed-add-delete-control",
    ],
  },
  () => {
    const riskRegister_PO = new RiskRegister_PO();
    const rmUser = Cypress.env("riskManagement").rmUserA;
    const loc = [
      locators.risk.riskRegister.implementedValue,
      locators.risk.riskRegister.efficacyValue,
    ];

    const testScenario = {
      likelihood: { label: "Almost Certain", value: 5 },
      impact: { label: "Catastrophic", value: 5 },
      inherentCalculation: 25, // 5 x 5 = 25
      inherentLabel: "High",
      residualLabel: "Moderate",
      currentLabel: "High",
    };
    const assessedArray = [{ label: "Moderate", value: "18.7500" }];

    context("Test with Add Control", () => {
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
        });
        // Select likelihood and impact labels first
        riskRegister_PO.scrollToHorizontalCenter();
        riskRegister_PO.selectLikelihoodValueViaAssessment(
          testScenario.likelihood.label
        );
        riskRegister_PO.openImpactAssessmentForm();
        riskRegister_PO.selectImpactValueViaAssessment(
          testScenario.impact.label
        );
      });

      it("<Add Control>. This test will ensure that without Control Strength if any Control is added and implemented no changes will be observed CR will be Equal to RR as Usual", () => {
        cy.readFile(riskRegisterData).then((data) => {
          const allControlsToAdd = ["Control Definition (Corrective)"];
          cy.wait(1500);
          riskRegister_PO.addControlToRisk(allControlsToAdd);
          riskRegister_PO.addControlWeight();
          cy.wait(1500);
          riskRegister_PO.selectSubGridControlStrength(
            data.calculations.withAssessed.addControl.subgridControlStrength
          );
          cy.get(locators.general.closeSubGrid)
            .should("be.visible")
            .click({ force: true });
          loc.forEach(($Locator) => {
            //static wait is required because of DOM new state
            cy.wait(1500);
            riskRegister_PO.verifyGridWeight();
          });
          riskRegister_PO.verifyCalculatedRiskLabel(
            data.calculations.withAssessed.addControl.riskLabel,
            locators.risk.riskRegister.currentRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            data.calculations.withAssessed.addControl.riskLabel,
            locators.risk.riskRegister.residualRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            data.calculations.withAssessed.addControl.riskLabel,
            locators.risk.riskRegister.inherentRisk
          );
          //opening the control Flyover to verify the Risk Values in Digit
          riskRegister_PO.openControlFlyover();
          riskRegister_PO.verifyStatsTableValuesWithControlStrength(
            data.calculations.withAssessed.assessedControlStrengthValue,
            data.calculations.withAssessed.addControl.residualRiskValue,
            data.calculations.withAssessed.addControl.currentRiskValue,
            data.calculations.withAssessed.addControl.inherentRiskValue
          );
          riskRegister_PO.closeTheFlyover();
          cy.waitForTopMsgLoaderToDisappear(300000);
          cy.waitForMyGridLoaderToDisappear(300000);
        });
      });
    });

    context(
      "Select (Calculated 25%) from (Assessed 18.7500%) and verify the values calculated from Added Control",
      {tags:"@pd45693"},() => {
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
          });
        });

        it("Change Control Strength to (Calculated 25%) from (Assessed 18.7500%) in RiskRegister Grid", () => {
          cy.readFile(riskRegisterData).then((data) => {
            riskRegister_PO.deselectAssessedOptionControlStrength(
              data.calculations.withAssessed.addControl.calculated
                .selectedControlStrength
            );
            cy.waitForElementToVisible(locators.administration.toastMsg, 15000);
          });
        });

        it("Verify that Control Risk Labels and Values are Calculated from the Added Control Values Calculations", () => {
          cy.readFile(riskRegisterData).then((data) => {
            const dataObj =
              data.calculations.withAssessed.addControl.calculated;
            loc.forEach(($Locator) => {
              riskRegister_PO.verifyImpactLikelihoodValue(
                $Locator,
                data.calculations.withDimensions.likelihoodImpactValue
              );
            });
            riskRegister_PO.verifyCalculatedRiskLabel(
              dataObj.currentRiskLabel,
              locators.risk.riskRegister.currentRisk
            );
            riskRegister_PO.verifyCalculatedRiskLabel(
              dataObj.residualRiskLabel,
              locators.risk.riskRegister.residualRisk
            );
            riskRegister_PO.verifyCalculatedRiskLabel(
              dataObj.inherentRiskLabel,
              locators.risk.riskRegister.inherentRisk
            );
            //opening the control Flyover to verify the Risk Values in Digit
            riskRegister_PO.openControlFlyover();
            riskRegister_PO.verifyStatsTableValuesWithControlStrength(
              dataObj.controlStrengthValue,
              dataObj.residualRiskValue,
              dataObj.currentRiskValue,
              dataObj.inherentRiskValue
            );
            riskRegister_PO.closeTheFlyover();
            cy.waitForTopMsgLoaderToDisappear(300000);
            cy.waitForMyGridLoaderToDisappear(300000);
          });
        });
      }
    );

    context(
      "Select (Medium 12%) from (Calculated 25%) and verify the values calculated from Added Control and selected grid Control Strength",
      {tags:"@pd45692"},() => {
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
          });
        });

        it("Change Control Strength to (Medium 12%) from (Calculated 25%) in RiskRegister Grid", () => {
          cy.readFile(riskRegisterData).then((data) => {
            const dataObj = data.calculations.withAssessed.addControl.medium;
            riskRegister_PO.selectControlStrength(
              dataObj.selectedControlStrength
            );
            cy.waitForElementToVisible(locators.administration.toastMsg, 15000);
          });
        });

        it("Verify that Control Risk Labels and Values are Calculated from the Added Control Values and Selected Grid Control Strength (Medium 12%) Calculations", () => {
          cy.readFile(riskRegisterData).then((data) => {
            const dataObj = data.calculations.withAssessed.addControl.medium;
            loc.forEach(($Locator) => {
              riskRegister_PO.verifyImpactLikelihoodValue(
                $Locator,
                data.calculations.withDimensions.likelihoodImpactValue
              );
            });
            riskRegister_PO.verifyCalculatedRiskLabel(
              dataObj.currentRiskLabel,
              locators.risk.riskRegister.currentRisk
            );
            riskRegister_PO.verifyCalculatedRiskLabel(
              dataObj.residualRiskLabel,
              locators.risk.riskRegister.residualRisk
            );
            riskRegister_PO.verifyCalculatedRiskLabel(
              dataObj.inherentRiskLabel,
              locators.risk.riskRegister.inherentRisk
            );
            //opening the control Flyover to verify the Risk Values in Digit
            riskRegister_PO.openControlFlyover();
            riskRegister_PO.verifyStatsTableValuesWithControlStrength(
              dataObj.controlStrengthValue,
              dataObj.residualRiskValue,
              dataObj.currentRiskValue,
              dataObj.inherentRiskValue
            );
            riskRegister_PO.closeTheFlyover();
            cy.waitForTopMsgLoaderToDisappear(300000);
            cy.waitForMyGridLoaderToDisappear(300000);
            riskRegister_PO.selectControlStrength(
              data.calculations.withAssessed.addControl.calculated
                .selectedControlStrength
            );
          });
        });
      }
    );

    context("Delete Control From Risk Definition in Risk Register", () => {
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
        });
      });

      it("should delete the control from the risk definition", () => {
        cy.readFile(riskRegisterData).then((data) => {
          riskRegister_PO.openControlFlyover();
          riskRegister_PO.verifyControlInFlyover(
            data.calculations.withDimensions.controlToAdd,
            false
          );
          riskRegister_PO.clickAskDeleteBtn();
          riskRegister_PO.verifyControlInFlyover(
            data.calculations.withDimensions.controlToAdd,
            true
          );
          cy.waitForTopMsgLoaderToDisappear(300000);
        });
      });

      it("Verify that CR and RR values are same and does not affected when control is deleted", () => {
        cy.readFile(riskRegisterData).then((data) => {
          loc.forEach(($Locator) => {
            riskRegister_PO.verifyImpactLikelihoodValue(
              $Locator,
              data.calculations.withDimensions.maxLikelihoodImpactValue
            );
          });
          riskRegister_PO.verifyCalculatedRiskLabel(
            data.calculations.withDimensions.riskLabel,
            locators.risk.riskRegister.currentRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            data.calculations.withDimensions.riskLabel,
            locators.risk.riskRegister.residualRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            data.calculations.withDimensions.riskLabel,
            locators.risk.riskRegister.inherentRisk
          );
          //opening the control Flyover to verify the Risk Values in Digit
          riskRegister_PO.openControlFlyover();
          riskRegister_PO.verifyStatsTableValues(
            data.calculations.withDimensions.riskValue
          );
          riskRegister_PO.closeTheFlyover();
          cy.waitForTopMsgLoaderToDisappear(300000);
          cy.waitForMyGridLoaderToDisappear(300000);
          assessedArray.forEach((assessed) => {
            const assessedKey = `Assessed (${assessed.value}%)`;
            // Select Control Strength (Assessed percentage)
            riskRegister_PO.selectControlStrength(assessedKey);
            riskRegister_PO.selectImpactValueViaAssessment(assessed.label);
          });
        });
      });
    });
  }
);
