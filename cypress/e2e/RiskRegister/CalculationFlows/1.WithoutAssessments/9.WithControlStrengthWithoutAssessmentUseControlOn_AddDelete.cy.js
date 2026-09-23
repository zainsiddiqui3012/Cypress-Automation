import locators from "../../../../fixtures/locators.json";
import RiskRegister_PO from "../../../../support/POM/RiskModule_PO/RiskRegister_PO";

import RiskCategory_PO from "../../../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../../../support/POM/RiskModule_PO/RiskDefinition_PO";

import riskCatData from "../../../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json";
import riskDefData from "../../../../fixtures/RiskModule/Risk_Process_Taxonomy/riskDefinition.json";
import { time } from "console";

const riskRegisterData = "cypress/fixtures/RiskRegister/RiskRegister.json";

describe(
  "Calculate All Risks When Assessment is OFF, Manage Detail Control is ON, Use Control Strength is ON",
  {
    tags: [
      "@smoke",
      "@without-assessment",
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
    const allControlsToAdd = [
      "Control Definition (preventative)",
      "updated_ctrl_taxanomy",
    ];
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
            data.threeElipsesOptions.riskApplicability.riskDefinitionWithAssessment,
            true
          );
          loc.forEach((selector) => {
            riskRegister_PO.clearImpactLikelihoodValue(selector);
          });
        });
      });
      it("<Add Control>. Calculate All Risks when Control is Added and Control Strength (Calculated) 25% is applied to Risk Definition with 100% weight CR should not be same with RR", () => {
        cy.readFile(riskRegisterData).then((data) => {
          const allControlsToAdd = ["Control Definition (Corrective)"];
          riskRegister_PO.addControlToRisk(allControlsToAdd);
          riskRegister_PO.verifyAddedControl(
            data.calculations.withControlStrength.updatedLikelihoodImpact
              .controlToAdd
          );
          riskRegister_PO.scrollSubGridToRight();
          cy.get(locators.administration.toastMsg, { timeout: 30000 }).click({
            force: true,
            multiple: true,
          });
          riskRegister_PO.selectSubGridControlStrength("High");
          riskRegister_PO.addControlWeight();
          cy.get(locators.general.closeSubGrid).should("be.visible").click({ force: true });
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
            "Moderate", 
            locators.risk.riskRegister.residualRisk
          );
          riskRegister_PO.verifyCalculatedRiskLabel(
            testScenario.currentLabel, // "High"
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
            data.threeElipsesOptions.riskApplicability.riskDefinitionWithAssessment,
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
