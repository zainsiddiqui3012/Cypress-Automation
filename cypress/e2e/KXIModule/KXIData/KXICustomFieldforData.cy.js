/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import CustomField from "../../../support/POM/KXIModule/CustomField";
import kxiCustomField from "../../../fixtures/KXIModule/KXICustomField.json";
import data from "../../../fixtures/KXIModule/FredQuery.json";
const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
describe(
  "Add custom fields to KxI Data Entries",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd21970",
      "@release5.19",
      "@predict",
      "@customer",
    ],
  },
  () => {
    context("custom fields", { tags: ["@withRM"] }, () => {
      const kxi = new KXI_POM();
      const custom = new CustomField();
      const withoutRM_PEER = Cypress.env("kxi").customer.withRM;
      beforeEach(() => {
        cy.loginWithSession(
          "login - custom fields",
          withoutRM_PEER.username,
          withoutRM_PEER.password,
          withoutRM_PEER.key
        );
        custom.customFieldMenu();
        kxi.verifyDefaultLayout();
      });

      it("Verify KxI Data should be added into the For drop down list on Add/Edit custom field form.", () => {
        custom.customFieldMenu();
        custom.verifykxiDefinionInForDropdown(kxiCustomField.datascreen);
      });
      it("Verify custom field 'Text Field' should reflect on  KxI Data popup as defined on custom fields", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.textField,
          false,
          false
        );
        custom.verifyCustomFieldsONKxiData(withoutRM_PEER.username);
      });
      it("Verify custom field 'Text Area' should reflect on KxI Data popup form as defined on custom fields", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.textArea,
          false,
          false
        );
        custom.verifyCustomFieldsONKxiData(withoutRM_PEER.username);
      });
      it("Verify custom field 'Radio button' should reflect on KxI Data popup form as defined on custom fields", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.radioButton,
          false,
          true
        );
        custom.verifyCustomFieldsONKxiData(withoutRM_PEER.username);
      });
      it("Verify custom field 'Checkbox' should reflect on KxI Data popup form as defined on custom fields", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.checkbox,
          false,
          true
        );
        custom.verifyCustomFieldsONKxiData(withoutRM_PEER.username);
      });
      it("Verify custom field 'Date picker' should reflect on KxI Data popup form as defined on custom fields", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.datePicker,
          false,
          false
        );
        custom.verifyDateCustomFieldsONKxiData(withoutRM_PEER.username);
      });
      it("Verify custom field 'File Field' should reflect on KxI Data popup form as defined on custom fields", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.fileField,
          false,
          false
        );
        // the verification is under the addCustomField method
      });
      it("Verify custom field 'Unique Value Field' should reflect on KxI Data popup form as defined on custom fields", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.uniqueField,
          false,
          false
        );
        custom.verifyCustomFieldsONKxiData(withoutRM_PEER.username);
      });
      it("Verify custom field 'Number Field' should reflect on KxI Data popup form as defined on custom fields", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.numberField,
          false,
          false
        );
        custom.verifyCustomFieldsONKxiData(withoutRM_PEER.username);
      });
      it("Verify custom field 'Single Select List' should reflect on KxI Data popup form as defined on custom fields", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.singleSelectList,
          false,
          false,
          true
        );
      });
      it("Verify custom field 'Multi Select List' should reflect on KxI Data popup form as defined on custom fields", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.multiSelectList,
          false,
          false,
          true
        );
      });

      it("Verify mandatory field validation message should display or field should be highlighted and Kxi Data must not save if custom field is set to required.", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.textArea,
          true,
          false
        );
        cy.visitkxiDef();
        kxi.addKxiDefinition(
          data.kxiValue,
          data.Left1,
          data.Left2,
          data.Left3,
          data.Right1,
          data.Right2,
          data.Right3,
          withoutRM_PEER.username
        );
        cy.readFile(writeDataFilePath).then((file) => {
          kxi.addKxiData(file.kxiName, data.kxiValue);
        });
        kxi.verifyCustomFieldValidationMsg(kxiCustomField.errorMsg);
      });
      it("Verify custom field shouldn't display on KxI Data popup form if its deleted from custom field screen.", () => {
        custom.deleteCustomField();
        custom.verifyDeletedCustomFieldsONKxiData();
      });
    });
  }
);
