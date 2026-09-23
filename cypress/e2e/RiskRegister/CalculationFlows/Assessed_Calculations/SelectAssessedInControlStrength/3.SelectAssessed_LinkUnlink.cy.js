import locators from "../../../../../fixtures/locators.json";
import RiskRegister_PO from "../../../../../support/POM/RiskModule_PO/RiskRegister_PO";

import RiskCategory_PO from "../../../../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../../../../support/POM/RiskModule_PO/RiskDefinition_PO";

const riskRegisterData = "cypress/fixtures/RiskRegister/RiskRegister.json";

describe(
  "Calculate all Risks with Assessed% Option When Control is Link/Unlink and Grid Control Strength reverted to (Calculated%) and then to (Medium%)",
  {
    tags: [
      "@smoke",
      "@regression",
      "@pd45690",
      "@with-assessment",
      "@calculations",
      "@risk-register",
      "@risk-register-calculations",
      "@with-control-strength",
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
      residualLabel: "High",
      currentLabel: "High",
    };
    const allControlsToAdd = ["Control Definition (Corrective)"];

    context("Test with Linked Control", () => {
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
      it("When With Assessed%, Control is Linked it will Calculate Risk Values From Linked Controls", () => {
        cy.readFile(riskRegisterData).then((data) => {
          const dataObj = data.calculations.withAssessed.linkControl;
          const allControlsToAdd = ["Control Definition (Corrective)"];
          cy.wait(1500);
          riskRegister_PO.linkControlToRisk(allControlsToAdd);
          riskRegister_PO.clickLinkBtn();
          riskRegister_PO.clickYesBtnOnUnlinkControl();
          riskRegister_PO.verifyAddedControl(allControlsToAdd[0]);
          riskRegister_PO.addControlWeight();
          cy.get(locators.general.closeSubGrid).click({ force: true });
          loc.forEach(($Locator) => {
            riskRegister_PO.verifyGridWeight();
          });
          riskRegister_PO.verifyCalculatedRiskLabel(
            dataObj.riskLabel,
            locators.risk.riskRegister.currentRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            dataObj.riskLabel,
            locators.risk.riskRegister.residualRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            dataObj.riskLabel,
            locators.risk.riskRegister.inherentRisk
          );
          //opening the control Flyover to verify the Risk Values in Digit
          riskRegister_PO.openControlFlyover();
          riskRegister_PO.verifyStatsTableValuesWithControlStrength(
            data.calculations.withAssessed.assessedControlStrengthValue,
            dataObj.residualRiskValue,
            dataObj.currentRiskValue,
            dataObj.inherentRiskValue
          );
          riskRegister_PO.closeTheFlyover();
          cy.waitForTopMsgLoaderToDisappear(300000);
          cy.waitForMyGridLoaderToDisappear(300000);
        });
      });
    });

    context(
      "Select (Calculated 25%) from (Assessed 18.7500%) and verify the values calculated from Linked Control",
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
              data.calculations.withAssessed.linkControl.calculated
                .selectedControlStrength
            );
            cy.waitForElementToVisible(locators.administration.toastMsg, 15000);
          });
        });

        it("Verify that Control Risk Labels and Values are Calculated from the Linked Control Values Calculations", () => {
          cy.readFile(riskRegisterData).then((data) => {
            const dataObj =
              data.calculations.withAssessed.linkControl.calculated;
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
      "Select (Medium 12%) from (Calculated 25%) and verify the values calculated from Linked Control and selected grid Control Strength",
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
            const dataObj = data.calculations.withAssessed.linkControl.medium;
            riskRegister_PO.selectControlStrength(
              dataObj.selectedControlStrength
            );
            cy.waitForElementToVisible(locators.administration.toastMsg, 15000);
          });
        });

        it("Verify that Control Risk Labels and Values are Calculated from the Linked Control Values and Selected Grid Control Strength (Medium 12%) Calculations", () => {
          cy.readFile(riskRegisterData).then((data) => {
            const dataObj = data.calculations.withAssessed.linkControl.medium;
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
              data.calculations.withAssessed.linkControl.calculated
                .selectedControlStrength
            );
          });
        });
      }
    );

    context("Unlink the Linked Control Definitions on Risk Definition", () => {
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
      it("should Un-Link the controls from the risk definition", () => {
        cy.readFile(riskRegisterData).then((data) => {
          // Select likelihood and impact labels first
          riskRegister_PO.scrollToHorizontalCenter();
          riskRegister_PO.selectLikelihoodValueViaAssessment(
            testScenario.likelihood.label
          );
          riskRegister_PO.openImpactAssessmentForm();
          riskRegister_PO.selectImpactValueViaAssessment(
            testScenario.impact.label
          );
          riskRegister_PO.openControlFlyover();
          allControlsToAdd.forEach(($control) => {
            riskRegister_PO.verifyControlInFlyover($control, false, "Unlink");
            riskRegister_PO.clickAskUnlinkBtn($control);
          });
          riskRegister_PO.verifyControlInFlyover(
            data.calculations.withDimensions.controlToAdd,
            true
          );
          cy.waitForTopMsgLoaderToDisappear(300000);
        });
      });
      it("Verify that CR and RR values are same when controls are  Unlinked", () => {
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
          riskRegister_PO.selectControlStrength(
            data.calculations.withDimensions.defaultControlStrength
          );
        });
      });
    });
  }
);
