/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import CustomField from "../../../support/POM/KXIModule/CustomField";
import kxiCustomField from "../../../fixtures/KXIModule/KXICustomField.json";
import KXIDataEdit from "../../../support/POM/KXIModule/KXIData/KXIDataEdit.js";
const kxiDataEdit = new KXIDataEdit();
describe(
  "Custom Field(s) Audit Log for KxI Data",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd23313",
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
        kxiDataEdit.addKXIDefinition_KXIDataEdit(withoutRM_PEER.username);
      });

      it("Verify Audit Log should be shown when user add custom field 'Text Field' from Kxi Data on Kxi Data screen", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.textField,
          false,
          false
        );
        custom.verifyAddedCustomFieldonAuditLog(withoutRM_PEER.username);
      });
      it("Verify Audit Log should be shown when user add custom field 'Text Area' from Kxi Data on Kxi Data screen", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.textArea,
          false,
          false
        );
        custom.verifyAddedCustomFieldonAuditLog(withoutRM_PEER.username);
      });
      it("Verify Audit Log should be shown when user add custom field 'Unique Value Field' from Kxi Data on Kxi Data screen", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.uniqueField,
          false,
          false
        );
        custom.verifyAddedCustomFieldonAuditLog(withoutRM_PEER.username);
      });
      it("Verify Audit Log should be shown when user add custom field 'Number Field' from Kxi Data on Kxi Data screen", () => {
        custom.customFieldMenu();
        custom.addCustomField(
          kxiCustomField.datascreen,
          kxiCustomField.numberField,
          false,
          false
        );
        custom.verifyAddedCustomFieldonAuditLog(withoutRM_PEER.username);
      });
    });
  }
);
