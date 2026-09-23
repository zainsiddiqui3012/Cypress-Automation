import SubGridControlInstance from "../../../../../support/POM/RiskRegister/Add_Link_Control_Instance/WithSubgrid.js";
import WithSubgridData from "../../../../../fixtures/RiskRegister/Add_Link_Control_Instance/WithSubgrid.json";

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
    const subGridControl = new SubGridControlInstance();
    const category = testData.controlDefinitionSelection.categories[0];
    const controlDefinition = testData.controlDefinition;
    const validData = testData.addControlInstance.valid;

    context("Add Control Instance - Positive Scenarios 14-26", () => {
      context("Test Cases Ensuring No Validation Errors Occur", () => {
        beforeEach(() => {
          subGridControl.loginSubgridUser();
        });
        afterEach(() => {
          subGridControl.verifyNoValidationError();
        });

        it(
          "Select Control Owner dropdown",
          { tags: ["@pd42875", "@pd42772"] },
          () => {
            subGridControl.selectControlOwner(validData.controlOwner);
          }
        );

        it(
          "Select Control Tester dropdown",
          { tags: ["@pd42830", "@pd42903"] },
          () => {
            subGridControl.selectControlTester(validData.controlTester);
          }
        );

        it(
          "Select Control Operations dropdown",
          { tags: ["@pd42790", "@pd42902"] },
          () => {
            subGridControl.selectControlOperations(validData.controlOperations);
          }
        );

        it(
          "Select Control Execution dropdown",
          { tags: ["@pd42792", "@pd42899"] },
          () => {
            subGridControl.selectControlExecution(validData.controlExecution);
          }
        );

        it(
          "Select Control Definition Categories dropdown",
          { tags: ["@pd42776", "@pd42888"] },
          () => {
            subGridControl.selectControlDefinitionCategories(
              validData.controlDefinitionCategory
            );
          }
        );

        it(
          "Enter Effectiveness (%) with valid number",
          { tags: ["@pd42851", "@pd42918"] },
          () => {
            subGridControl.enterEffectiveness(validData.effectivenessPercent);
          }
        );

        it(
          "Enter Weight (%) with valid number",
          { tags: ["@pd42867", "@pd42806"] },
          () => {
            subGridControl.enterWeight(validData.weightPercent);
          }
        );

        it(
          "Enter Implemented (%) with valid number",
          { tags: ["@pd42786", "@pd42890"] },
          () => {
            subGridControl.enterImplemented(validData.implementedPercent);
          }
        );

        it(
          "Select Control Strength dropdown",
          { tags: ["@pd42802", "@pd42862"] },
          () => {
            subGridControl.selectControlStrength(validData.controlStrength);
          }
        );
      });

      context("Add Control Instance Testcases", () => {
        beforeEach(() => {
          subGridControl.loginSubgridUser();
        });

        it("Click Cancel", { tags: ["@pd42797", "@pd42898"] }, () => {
          subGridControl.enterControlName(validData.controlName);
          subGridControl.verifyModalIsClosed();
        });

        it(
          "Click Save with all valid inputs",
          { tags: ["@pd42880", "@pd42831", "@smoke"] },
          () => {
            subGridControl.selectControlCategoryFromTree(category);
            subGridControl.selectControlDefinitionFromTree(controlDefinition);
            subGridControl.saveWithValidData(validData);
            subGridControl.verifySuccessMessage(
              testData.validationMessages.successSave
            );
          }
        );

        it(
          "Verify the added control instance is linked with risk risk register / instance",
          { tags: ["@pd42860", "@pd42911"] },
          () => {
            subGridControl.verifyLinkedToRiskRegister(validData.controlName);
          }
        );

        it(
          "Verify the added control instance is showing on control flyout",
          { tags: ["@pd42883", "@pd42813"] },
          () => {
            subGridControl.openControlFlyover();
          }
        );
      });
    });
  }
);
