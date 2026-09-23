/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import kxiDef from "../../../fixtures/KXIModule/FredQuery.json";

describe(
  "Manual Data Entry Grid for KXI Data management Screen -  Improvement ",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@data-entry",
      "@pd23555",
      "@release5.19",
      "@predict",
      "@customer",
    ],
  },
  () => {
    context("KXI Manual Data Entry", { tags: ["@withRM"] }, () => {
      const kxiData = new KXI_POM();
      const predictMenu_PO = new PredictMenu_PO();
      const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
      const withoutRM_PEER = Cypress.env("kxi").customer.withRM;
      beforeEach(() => {
        cy.loginWithSession(
          `login - ${withoutRM_PEER.username}`,
          withoutRM_PEER.username,
          withoutRM_PEER.password,
          withoutRM_PEER.key
        );

        predictMenu_PO.menuClick();
        kxiData.kxiManagement();
        kxiData.defineKxi();

        kxiData.addKxiDefinition(
          kxiDef.kxiValue,
          kxiDef.Left1,
          kxiDef.Left2,
          kxiDef.Left3,
          kxiDef.Right1,
          kxiDef.Right2,
          kxiDef.Right3,
          withoutRM.username
        );
      });

      it(
        "Verify when user clicks 'Entry Data' button the grid should be opened and kxi value,Sample date and comment fields should be blank.",
        { tags: ["@pd26057"] },
        () => {
          kxiData.verifyEmptyFields(kxiDef.dataEntry);
        }
      );
      it(
        "Verify kri Value and Sample Date are mandatory field",
        { tags: ["@pd26062"] },
        () => {
          kxiData.verifyEmptyFields(kxiDef.dataEntry);

          kxiData.verifyMandatoryField(kxiDef.kxiValue);
        }
      );
      it("Verify kri values are saved successfully.", () => {
        kxiData.verifyKriValueSavedSuccessfully(kxiDef.kxiValue);
      });
      it(
        "Verify when user gives same Sample date to same definition it should display validation message",
        { tags: ["@pd26063"] },
        () => {
          kxiData.verifyExistingRecord(kxiDef.kxiValue);
        }
      );
      it("Verify Data Entry Button can be exit", () => {
        cy.visitkxiData();

        kxiData.verifyDataEntrybtnExit(
          kxiDef.exitDataEntry,
          kxiDef.dataModalText
        );
      });

      it(
        "Verify the grid should remove individual row-level 'Save' buttons and disable auto-saving of values when navigating rows via tab",
        { tags: ["@pd25270", "@pd26064"] },
        () => {
          kxiData.verifyEmptyFields(kxiDef.dataEntry);
          kxiData.verifyIndividualRowSaveBtn();
        }
      );

      it(
        "Verify Users should be able to enter data for Value, Date, and Comment fields for multiple KXI definitions in a single action and retain the changes until saved",
        { tags: ["@pd25270", "@pd26060"] },
        () => {
          cy.visitkxiData();

          kxiData.verifyMultipleDataSaved(kxiDef.kxiValue);

          cy.wait(3000);
          kxiData.validatedAddedMultipleDataSaved(kxiDef.kxiValue);
        }
      );
    });
  }
);
