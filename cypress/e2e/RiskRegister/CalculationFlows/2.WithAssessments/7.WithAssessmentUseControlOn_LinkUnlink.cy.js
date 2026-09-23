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
      it("When Without Control Strength Control is Linked it will not effect CR and RR of Risk Definition", () => {
        cy.readFile(riskRegisterData).then((data) => {
          const allControlsToAdd = ["Control Definition (Corrective)"];
          cy.wait(1500);
          riskRegister_PO.linkControlToRisk(allControlsToAdd);
          riskRegister_PO.clickLinkBtn();
          riskRegister_PO.clickYesBtnOnUnlinkControl();
          riskRegister_PO.verifyAddedControl(allControlsToAdd[0]);
          riskRegister_PO.addControlWeight();
          cy.get(locators.general.closeSubGrid).click({ force: true });
          loc.forEach(($Locator) => {
            //static wait is required because of DOM new state
            // cy.wait(1500)
            // riskRegister_PO.clearImpactLikelihoodValue($Locator);
            // riskRegister_PO.editImpactLikelihoodValue(
            //   $Locator,
            //   data.calculations.withDimensions.maxLikelihoodImpactValue
            // );
            riskRegister_PO.verifyGridWeight();
          });
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.currentLabel, // "High"
            locators.risk.riskRegister.currentRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.residualLabel, // "High"
            locators.risk.riskRegister.residualRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.inherentLabel, // "High"
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
        });
      });
    });
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
        });
      });
    });
  }
);
