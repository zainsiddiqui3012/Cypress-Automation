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

    context("Test With Add Control", () => {
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
      it("<Add Control>. Calculate All Risks when Control is Added and Control Strength (Calculated) 25% is applied to Risk Definition with 100% weight CR should not be same with RR", () => {
        cy.readFile(riskRegisterData).then((data) => {
          const allControlsToAdd = ["Control Definition (Corrective)"];
          // static wait is required because of DOM new state
          cy.wait(1500);
          riskRegister_PO.addControlToRisk(allControlsToAdd);
          riskRegister_PO.verifyAddedControl(
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .controlToAdd
          );
          riskRegister_PO.scrollSubGridToRight();
          riskRegister_PO.addControlWeight();
          cy.wait(1500);
          riskRegister_PO.selectSubGridControlStrength("High");
          cy.get(locators.general.closeSubGrid).click({ force: true });
          //Select Calculated in Grid
          riskRegister_PO.selectControlStrength(
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .calculatedControlStrength
          );

          // verify the likelihood and impact Values they should be copied from the Added Control
          loc.forEach(($implementEfficacy) => {
            riskRegister_PO.verifyImpactLikelihoodValue(
              $implementEfficacy,
              data.calculations.withControlStrength.updatedLikelihoodImpact
                .likelihoodImpactValue // "50"
            );
          });

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
    });
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

      it("Verify that CR and RR values are same when control is deleted", () => {
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
