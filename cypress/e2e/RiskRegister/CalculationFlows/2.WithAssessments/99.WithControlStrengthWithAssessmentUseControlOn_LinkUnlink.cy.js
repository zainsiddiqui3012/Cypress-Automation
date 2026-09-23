import locators from "../../../../fixtures/locators.json";
import RiskRegister_PO from "../../../../support/POM/RiskModule_PO/RiskRegister_PO";

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

    context("Test With Link Control (Avg Controls)", () => {
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
      it("Link (Preventative) Controls woth Control Strength in Risk Definition", () => {
        cy.readFile(riskRegisterData).then((data) => {
          // static wait is required because of DOM new state
          cy.wait(1500);
          riskRegister_PO.linkControlToRisk(allControlsToAdd, "Preventative");
          allControlsToAdd.forEach(($control) => {
            riskRegister_PO.searchControlInSubGrid($control);
            riskRegister_PO.verifyAddedControl($control);
            riskRegister_PO.addControlWeight(1, 50);
          });
          cy.get(locators.general.closeSubGrid).click({ force: true });
          //Select Calculated in Grid
          riskRegister_PO.selectControlStrength(
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .calculatedControlStrength
          );
          loc.forEach(($Locator) => {
            riskRegister_PO.verifyImpactLikelihoodValue(
              $Locator,
              "55" // "55" Average Values of Both Controls
            );
          });
          riskRegister_PO.verifyGridWeight();
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.currentLabel,
            locators.risk.riskRegister.currentRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.residualLabel,
            locators.risk.riskRegister.residualRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.inherentLabel,
            locators.risk.riskRegister.inherentRisk
          );

          riskRegister_PO.openControlFlyover();
          riskRegister_PO.verifyStatsTableValuesWithControlStrength(
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .selectedControlStrengthValue, // "25.0000"
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .residualRiskValue, // "18.7500"
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .avgCurrentRiskValue // "23.0938" current Risk Decreased from 23.4375 due to average of both controls
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
