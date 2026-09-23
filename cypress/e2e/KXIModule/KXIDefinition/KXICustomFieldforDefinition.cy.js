/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import CustomField from "../../../support/POM/KXIModule/CustomField";
import kxiCustomField from "../../../fixtures/KXIModule/KXICustomField.json";
import data from "../../../fixtures/KXIModule/FredQuery.json";

const status = "cypress/fixtures/KXIModule/TaskStatus.json";
const taskFilePath = "cypress/fixtures/KXIModule/KXITaskWriteUpdate.json";
const regulartaskFilePath = "cypress/fixtures/KXIModule/KXITaskRegular.json";
describe(
  "Add custom fields to KxI Definitions",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@define-kxis",
      "@pd21969",
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
        `login - ${withoutRM_PEER.username}`,
        withoutRM_PEER.username,
        withoutRM_PEER.password,
        withoutRM_PEER.key
      );
          custom.customFieldMenu();
          custom.clickDelete();
        });
    
      it("Verify KxI Definition should be added into the For drop down list on Add/Edit custom field form.", () => {
        custom.customFieldMenu();
        custom.verifykxiDefinionInForDropdown(kxiCustomField.screenName);
      });
      it("Verify custom field 'Text Field' should reflect on add/edit KxI Definition form as defined on custom fields", () => {
        custom.addCustomField(
          kxiCustomField.screenName,
          kxiCustomField.textField,
          false,
          false,
          kxiCustomField.customField
        );
      });
      it("Verify custom field 'Text Area' should reflect on add/edit KxI Definition form as defined on custom fields", () => {
        custom.addCustomField(
          kxiCustomField.screenName,
          kxiCustomField.textArea,
          false,
          false,
          kxiCustomField.customField
        );
      });
      it("Verify custom field 'Radio button' should reflect on add/edit KxI Definition form as defined on custom fields", () => {
        custom.addCustomField(
          kxiCustomField.screenName,
          kxiCustomField.radioButton,
          false,
          true,
          kxiCustomField.customField
        );
      });
      it("Verify custom field 'Checkbox' should reflect on add/edit KxI Definition form as defined on custom fields", () => {
        custom.addCustomField(
          kxiCustomField.screenName,
          kxiCustomField.checkbox,
          false,
          true,
          kxiCustomField.customField
        );
      });
      it("Verify custom field 'Date picker' should reflect on add/edit KxI Definition form as defined on custom fields", () => {
        custom.addCustomField(
          kxiCustomField.screenName,
          kxiCustomField.datePicker,
          false,
          false,
          kxiCustomField.customField
        );
      });
      it("Verify custom field 'File Field' should reflect on add/edit KxI Definition form as defined on custom fields", () => {
        custom.addCustomField(
          kxiCustomField.screenName,
          kxiCustomField.fileField,
          false,
          false,
          kxiCustomField.customField
        );
      });
      it("Verify custom field 'Unique Value Field' should reflect on add/edit KxI Definition form as defined on custom fields", () => {
        custom.addCustomField(
          kxiCustomField.screenName,
          kxiCustomField.uniqueField,
          false,
          false,
          kxiCustomField.customField
        );
      });
      it("Verify custom field 'Number Field' should reflect on add/edit KxI Definition form as defined on custom fields", () => {
        custom.addCustomField(
          kxiCustomField.screenName,
          kxiCustomField.numberField,
          false,
          false,
          kxiCustomField.customField
        );
      });
      it("Verify custom field 'Single Select List' should reflect on add/edit KxI Definition form as defined on custom fields", () => {
        custom.addCustomField(
          kxiCustomField.screenName,
          kxiCustomField.singleSelectList,
          false,
          false,
          true,
          kxiCustomField.customField
        );
      });
      it("Verify custom field 'Multi Select List' should reflect on add/edit KxI Definition form as defined on custom fields", () => {
        custom.addCustomField(
          kxiCustomField.screenName,
          kxiCustomField.multiSelectList,
          false,
          false,
          true,
          kxiCustomField.customField
        );
      });
      it("Verify mandatory field validation message should display or field should be highlighted and Kxi Definition must not save if custom field is set to required.  and check Verify custom field shouldn't display on Add/Edit KxI Definition form if its deleted from custom field screen.", () => {
        custom.addCustomField(
          kxiCustomField.screenName,
          kxiCustomField.textArea,
          true,
          false,
          kxiCustomField.customField
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
          withoutRM_PEER.username,
          null,
          false,
          false,
          true,
          kxiCustomField.errorMsg
        );

        custom.deleteCustomField();
      });
    });
  }
);
