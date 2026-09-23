import SubGridControlInstance from "../../../../../support/POM/RiskRegister/Add_Link_Control_Instance/WithSubgrid.js";
import WithSubgridData from "../../../../../fixtures/RiskRegister/Add_Link_Control_Instance/WithSubgrid.json";
import locators from "../../../../../fixtures/locators.json";

describe(
  "Risk Register - Add/Link Control Instance with Subgrid",
  {
    tags: [
      "@regression",
      "@add-control-instance",
      "@risk-register",
      "@pd36742",
    ],
  },
  () => {
    const testData = WithSubgridData;
    const loc = locators.risk.riskRegister.subGridControlInstance;
    const subGridControl = new SubGridControlInstance();
    const invalidData = testData.addControlInstance;

    context("Add Control Instance - Negative Scenarios", () => {
      context("Testcases verifying validation error", () => {
        beforeEach(() => {
          subGridControl.loginSubgridUser();
        });
        afterEach(() => {
          subGridControl.verifyValidationError();
        });

        it(
          "Leave Control Name empty",
          { tags: ["@pd42826", "@pd42892"] },
          () => {
            subGridControl.controlInstanceClickSaveCancel(
              testData.save,
              loc.saveLabel
            );
          }
        );

        it(
          "Leave Control Types empty",
          { tags: ["@pd42846", "@pd42920"] },
          () => {
            subGridControl.controlInstanceClickSaveCancel(
              testData.save,
              loc.saveLabel
            );
          }
        );

        it(
          "Click Save with missing required fields",
          { tags: ["@pd42768", "@pd42869"] },
          () => {
            subGridControl.controlInstanceClickSaveCancel(
              testData.save,
              loc.saveLabel
            );
          }
        );
      });

      context("Testcases verifying validation error message", () => {
        beforeEach(() => {
          subGridControl.loginSubgridUser();
        });

        it(
          "Enter Effectiveness (%) with invalid number",
          { tags: ["@pd42771", "@pd42870"] },
          () => {
            subGridControl.enterEffectiveness(
              invalidData.invalidEffectiveness.effectivenessPercent
            );
            subGridControl.scrollDown(0, 1400, { timeout: 50000 });
            subGridControl.controlInstanceClickSaveCancel(
              testData.save,
              loc.saveLabel
            );
            subGridControl.verifyValidationError(
              testData.validationMessages.effectivenessRange
            );
          }
        );

        it(
          "Enter Weight (%) exceeding 100",
          { tags: ["@pd42778", "@pd42931"] },
          () => {
            subGridControl.enterWeight(invalidData.invalidWeight.weightPercent);
            subGridControl.scrollDown(0, 1400, { timeout: 50000 });
            subGridControl.controlInstanceClickSaveCancel(
              testData.save,
              loc.saveLabel
            );
            subGridControl.verifyValidationError(
              testData.validationMessages.weightExceeds
            );
          }
        );

        it(
          "Enter Implemented (%) with invalid number",
          { tags: ["@pd42769", "@pd42897"] },
          () => {
            subGridControl.enterImplemented(
              invalidData.invalidImplemented.implementedPercent
            );
            subGridControl.scrollDown(0, 1600, { timeout: 50000 });
            subGridControl.controlInstanceClickSaveCancel(
              testData.save,
              loc.saveLabel
            );
            subGridControl.verifyValidationError(
              testData.validationMessages.implementedRange
            );
          }
        );
      });
    });
  }
);
