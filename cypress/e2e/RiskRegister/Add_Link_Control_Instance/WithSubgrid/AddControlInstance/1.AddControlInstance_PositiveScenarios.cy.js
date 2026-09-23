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
    const loc = locators.risk.riskRegister;
    const subGridControl = new SubGridControlInstance();
    const category = testData.controlDefinitionSelection.categories[0];
    const controlDefinition = testData.controlDefinition;
    const validData = testData.addControlInstance.valid;

    context("Add Control Instance - Positive Scenarios", () => {
      beforeEach(() => {
        subGridControl.loginSubgridUser();
      });
      afterEach(() => {
        subGridControl.verifyNoValidationError();
      });
      it(
        "Open Add Control Instance screen",
        { tags: ["@pd42878", "@pd42914"] },
        () => {
          subGridControl.verifyModalIsOpen();
          const requiredFields = [
            loc.subGridControlInstance.controlInstanceIdField,
            loc.subGridControlInstance.controlNameField,
            loc.subGridControlInstance.controlTypesDropdown,
            loc.subGridControlInstance.weightField,
            loc.subGridControlInstance.implementedField,
          ];

          requiredFields.forEach((field) => {
            subGridControl.verifyRequiredField(field);
          });
        }
      );

      it(
        "Verify on selecting control definition from the tree, the selected definition data should auto populate in fields (where necessary)",
        { tags: ["@pd42863", "@pd42928"] },
        () => {
          const expectedData =
            testData.controlDefinitionSelection.autoPopulateFields;

          subGridControl.selectControlCategoryFromTree(category);
          subGridControl.selectControlDefinitionFromTree(controlDefinition);
          subGridControl.verifyAutoPopulatedData(expectedData);
        }
      );

      it("Enter valid Control Name", { tags: ["@pd42874", "@pd42925"] }, () => {
        const maxCharData = testData.addControlInstance.maxCharacters;

        subGridControl.enterControlName(maxCharData.controlName);
        subGridControl.verifyControlNameValue(maxCharData.controlName);
        subGridControl.verifyCharacterCount(
          loc.subGridControlInstance.controlNameField,
          maxCharData.maxCharCount
        );
      });

      it(
        "Use rich text editor in Control Description",
        { tags: ["@pd42852", "@pd42907"] },
        () => {
          subGridControl.formatDescriptionWithRichText();
        }
      );

      it(
        "Select Control Types dropdown",
        { tags: ["@pd42814", "@pd42932"] },
        () => {
          subGridControl.selectControlTypes(validData.controlTypes);
        }
      );

      it(
        "Set Primary Control as Yes",
        { tags: ["@pd42817", "@pd42927"] },
        () => {
          subGridControl.selectPrimaryControl(validData.primaryControl);
        }
      );

      it(
        "Set Primary Control as No",
        { tags: ["@pd42835", "@pd42908"] },
        () => {
          subGridControl.selectPrimaryControl(validData.primaryControlNo);
        }
      );

      it(
        "Set Prevents Fraud as Yes",
        { tags: ["@pd42882", "@pd42789"] },
        () => {
          subGridControl.selectPreventsFraud(validData.preventsFraud);
        }
      );

      it("Set Prevents Fraud as No", { tags: ["@pd42845", "@pd42909"] }, () => {
        subGridControl.selectPreventsFraud(validData.preventsFraudNo);
      });

      it("Select Control Frequency", { tags: ["@pd42791", "@pd42889"] }, () => {
        subGridControl.selectControlFrequency(validData.controlFrequency);
      });

      it(
        "Leave Control Frequency empty",
        { tags: ["@pd42820", "@pd42912"] },
        () => {
          subGridControl.verifyControlFrequencyNoValidationError();
        }
      );

      it("Enter Optimal Role/Title", { tags: ["@pd42825", "@pd42871"] }, () => {
        subGridControl.enterOptimalRole(validData.optimalRole);
      });
    });
  }
);
