import KXIDataFREDImport from "../../../support/POM/KXIModule/KXIDataFREDImport";
import kxiDataFile from "../../../fixtures/KXIModule/KXIDataFREDImport/KXIDataFREDImport.json";
import KxiData from "../../../support/POM/KXIModule/KxIData";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import kxiDef from "../../../fixtures/KXIModule/FredQuery.json";

describe(
  "User is able to import KXI data for FRED",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd22373",
      "@release5.17",
      "@predict",
      "@customer",
    ],
  },
  () => {
    const kXIDataFREDImport = new KXIDataFREDImport();
    const kxiDataManagement = new KxiData();
    const withRM = Cypress.env("kxi").customer.withRM3;
    beforeEach(() => {
      cy.loginWithSession(
        `login - ${withRM.username}`,
        withRM.username,
        withRM.password,
        withRM.key
      );
    });

    it("Verify that user is able to download the import template", () => {
      cy.task("isFileExist", {
        fileName: Cypress.config("downloadsFolder"),
      }).then(() => {
        cy.deleteDownloadsFolder();
      });
      cy.visit(Cypress.env("kri_Data_Grid_Url"));
      cy.get("h3.m-subheader__title")
        .should("be.visible")
        .and("include.text", "Data Management");

      kXIDataFREDImport.clickImportBtn();
      kXIDataFREDImport.clickDownloadSampleFile();
      kXIDataFREDImport.verifyDownloadFile();
    });

    kxiDataFile.kriType.forEach((kriType) => {
      it(kriType.statement, () => {
        cy.visit(Cypress.env("kri_Data_Grid_Url"));
        cy.get("h3.m-subheader__title")
          .should("be.visible")
          .and("include.text", "Data Management");
        kxiDataManagement.waitForKXIDATALoaderToDisappear();
        kXIDataFREDImport.deleteKXIDAtaImport(kriType.defName);
        kXIDataFREDImport.clickImportBtn();
        kXIDataFREDImport.uploadImportFile(kriType.name);
        kXIDataFREDImport.verifyUploadFile(kriType);
      });
    });

    kxiDataFile.kriType.forEach((kriType) => {
      it(kriType.statement2, () => {
        cy.visit(Cypress.env("kri_Data_Grid_Url"));
        cy.get("h3.m-subheader__title")
          .should("be.visible")
          .and("include.text", "Data Management");
        kxiDataManagement.waitForKXIDATALoaderToDisappear();
        kXIDataFREDImport.searchDefination(kriType.defName);
        kXIDataFREDImport.verifyEnteredByValue(kriType.enterBy);
      });
    });
  }
);
