/// <reference types= "cypress" />

const exportFileName = "exportFile";
const importFileName = "importFile";
const updatedImportFileName = "updatedImportFile";

const filePath = `../cypress/fixtures/Examples/myExportData/${exportFileName}.xlsx`;
const exportFileJsonPath = `cypress/fixtures/Examples/myExportData/${exportFileName}.json`;

const createImportJsonData = `cypress/fixtures/Examples/Data/myImportData/${importFileName}.json`;
const updateImportJsonData = `cypress/fixtures/Examples/Data/myImportData/${updatedImportFileName}.json`;

import * as XLSX from "xlsx";

import CustomField from "../../../support/POM/KXIModule/CustomField";
import kxiCustomField from "../../../fixtures/KXIModule/KXICustomField.json";
import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import kxiUpdateLogFields from "../../../fixtures/KXIModule/kxiUpdateLogFields.json";
import locators from "../../../fixtures/locators.json";

describe(
  "Custom Field(s) Audit Log for KxI Definition",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@define-kxis",
      "@pd23312",
      "@release5.19",
      "@predict",
      "@customer",
    ],
  },
  () => {
    const custom = new CustomField();
    const kxi = new KXI_POM();
    const withoutRM_PEER = Cypress.env("kxi").customer.withRM3;

    beforeEach(() => {
      cy.loginWithSession(
        `login - ${withoutRM_PEER.username}`,
        withoutRM_PEER.username,
        withoutRM_PEER.password,
        withoutRM_PEER.key
      );
    });

    context("custom fields", () => {
      it("Verify Audit Log should be shown when user add  custom field 'Text Field' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.textField,
          false,
          false,
          "add",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });
      it("Verify Audit Log should be shown when user edit custom field 'Text Field' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.textField,
          false,
          false,
          "edit",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });
      it("Verify Audit Log should be shown when user add  custom field 'Text Area' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.textArea,
          false,
          false,
          "add",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });
      it("Verify Audit Log should be shown when user edit custom field 'Text Area' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.textField,
          false,
          false,
          "edit",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });

      it("Verify Audit Log should be shown when user add  custom field 'Unique Value Field' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.uniqueField,
          false,
          false,
          "add",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });
      it("Verify Audit Log should be shown when user edit custom field 'Unique Value Field' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.textField,
          false,
          false,
          "edit",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });
      it("Verify Audit Log should be shown when user add  custom field 'Number Field' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.numberField,
          false,
          false,
          "add",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });
      it("Verify Audit Log should be shown when user edit custom field 'Number Field' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.textField,
          false,
          false,
          "edit",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });
      it("Verify Audit Log should be shown when user add  custom field 'Radio button' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.radioButton,
          false,
          true,
          "add",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });
      it("Verify Audit Log should be shown when user edit custom field 'Radio button' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.textField,
          false,
          false,
          "edit",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });
      it("Verify Audit Log should be shown when user add  custom field 'Date Picker' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.datePicker,
          false,
          false,
          "add",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });
      it("Verify Audit Log should be shown when user edit custom field 'Date Picker' from Kxi Data on Kxi Definitio screen", () => {
        custom.verifyAuditLogForCustomField(
          kxiCustomField.screenName,
          kxiCustomField.textField,
          false,
          false,
          "edit",
          withoutRM_PEER.username,
          kxiCustomField.editText
        );
      });
    });

    context(
      "verify All Audit Logs when create and update KXI Definition/KXI Data",
      () => {
        it("Verify that when KXI Definitions are created all the field values should be shown in audit logs", () => {
          custom.verifyAuditLogForCustomField(
            kxiCustomField.screenName,
            kxiCustomField.textField,
            false,
            false,
            "add",
            withoutRM_PEER.username,
            false,
            true
          );
        });

        it("verify that audit log should be shown to the user when KXI definiton is added in kxiData Screen", () => {
          kxi.addKxiDataForAuditLogs(
            kxiUpdateLogFields.kxiData.kxiDataValue,
            null,
            true,
            "add",
            withoutRM_PEER.username
          );
        });

        it("Verify that when values are edited in KXI Data all the updated field values should be shown in audit logs", () => {
          kxi.addKxiDataForAuditLogs(
            null,
            kxiUpdateLogFields.kxiData.kxiUpdatedDataValue,
            true,
            "edit"
          );
        });

        it("Verify Audit logs when KXI definitions created with import File", () => {
          kxi.addkxiImportJSON("kxiDefinition", "add");
          cy.visitkxiDef();
          kxi.uploadImportFile();
          kxi.verifyImportExportCompleted(true, false);
          kxi.validateAuditLog(false, true);
        });

        it("Verify Audit logs when KXI Data created with import File", () => {
          kxi.addkxiImportJSON("kxiData", "add");
          cy.visitkxiData();
          kxi.uploadImportFile();
          cy.fixture("KXIModule/KXITaskWrite.json").then((file) => {
            kxi.searchinKxiDef(file.kxiName);
            cy.validateKxiDataAuditLogs(
              locators.kxi.kxiData.auditLogButton,
              locators.kxi.kxiData.auditLogContent,
              file,
              file.sampleDate
            );
          });
        });

        it("Verify that when KXI Definitions are edited all the field values should be shown in audit logs", () => {
          custom.verifyAuditLogForCustomField(
            kxiCustomField.screenName,
            kxiCustomField.textField,
            false,
            false,
            "edit",
            withoutRM_PEER.username,
            kxiCustomField.editText,
            true
          );
        });
      }
    );
  }
);
