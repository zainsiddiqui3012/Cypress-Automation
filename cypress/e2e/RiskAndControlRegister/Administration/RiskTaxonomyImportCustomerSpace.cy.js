/**
 * @file RiskTaxonomyCustomerSpace.cy.js
 * @description Cypress test suite for Risk Taxonomy functionality in Customer Space.
 */

import {RiskTaxonomy, RiskTaxonomyImportOperations } from '../../../support/POM/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.js';
import locators from '../../../fixtures/locators.json';
import fileData from "../../../fixtures/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.json"
const importOperations = new RiskTaxonomyImportOperations();
const data = "cypress/fixtures/Examples/RiskTaxonomyImportCustomerSpace.json";

// Import operation locators for easier reference
const importDialog = locators.risk.administration.importOperations.importDialog;
const importBtnModal = locators.risk.administration.importOperations.importBtnModal;

describe('Risk Taxonomy Import',   
  {
    tags: [
      "@risk-management",
      "@customer",
      "@regression",
      "@risk-taxonomy",
      "@risk-taxonomy-Import",
      "@pd36730"
    ],
  },
  
  () => {

  const riskTaxonomy = new RiskTaxonomy();
  context('Import - Export Cases', () => {
  const rmUser = Cypress.env("riskManagement").rmUser;
    beforeEach(() => {
      // Clear all caches before each import test to ensure fresh file uploads
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.window().then((win) => {
        win.sessionStorage.clear();
      });
      
      cy.loginWithSession(
        "login - with Risk Management",
        rmUser.username,
        rmUser.password,
        rmUser.key
      );
      cy.visitRiskTaxonomies();
      cy.clearAllFileUploadCache();
      
      // Additional cache clearing after page load
      cy.log('Cache cleared for fresh import test');
    });
     /**
       * @test Open Import Risk Taxonomies modal
       * @description Verify that import modal opens correctly with proper title and elements
       * @tags @pd41769 @smoke
       */
      it("Open Import Risk Taxonomies modal", { tags: ["@pd41769", "@smoke"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel);
      });

      /**
       * @test Click "Download Sample File"
       * @description Verify sample file download functionality
       * @tags @pd41825 @smoke
       */
      it('Click "Download Sample File"', { tags: ["@pd41825", "@smoke"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.downloadSampleFile();
      });

      /**
       * @test Upload file with missing required columns
       * @description Verify validation when required columns are missing
       * @tags @pd41805 @negative
       */
      it("Upload file with missing required columns", { tags: ["@pd41805"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.createImportFileWithMissingColumns();
        importOperations.uploadValidConvertedFile();
        importOperations.verifyImportValidationError();
      });

      /**
       * @test Upload Excel with duplicate risk categories
       * @description Verify handling of duplicate risk categories in import file
       * @tags @pd41794 @negative
       */
      it("Upload Excel with duplicate risk categories", { tags: ["@pd41794"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.createImportFileWithDuplicates();
        importOperations.uploadValidConvertedFile();
        importOperations.verifyImportValidationError();
      });

      /**
       * @test Upload a valid Excel file with correct structure
       * @description Test successful import of valid Excel file
       * @tags @pd41872 @smoke
       */
      it("Upload a valid Excel file with correct structure", { tags: ["@pd41872", "@smoke"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.updateRiskTaxonomyImportJSON();
        importOperations.uploadValidConvertedFile();
        importOperations.monitorJobQueue("COMPLETED");
      });

       /*
       * @test Verify that the imported Risk Taxonomy is Added & present in Grid
       * @description Confirm imported data appears correctly in the main grid
       * @tags @pd42393 @verification
       */
      it(
        "Verify that the imported Risk Taxonomy is Added & present in Grid",
        { tags: ["@pd41773", "@smoke"] },
        () => {
          // Read the JSON file and search for the Risk Definition name
          cy.readFile(data).then((readData) => {
            const importedName = readData["Risk Definition"][0]["Name*"];
            riskTaxonomy.searchRiskTaxonomy(importedName);
          });
        }
      );

      /**
       * @test Upload Excel file with empty rows
       * @description Verify handling of Excel files containing empty rows
       * @tags @pd41761 @negative
       */
      it("Upload Excel file with empty rows", { tags: ["@pd41761"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.createImportFileWithEmptyRows();
        importOperations.uploadValidConvertedFile();
        importOperations.verifyImportValidation();
      });

      /**
       * @test Upload Excel with invalid characters in IDs
       * @description Verify validation of special characters and invalid symbols in ID fields
       * @tags @pd41764 @negative
       */
      it("Upload Excel with invalid characters in IDs", { tags: ["@pd41764"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.createImportFileWithInvalidCharacters();
        importOperations.uploadValidConvertedFile();
        importOperations.verifyImportValidation();
      });

      /**
       * @test Upload a non-Excel file
       * @description Verify validation when uploading non-Excel file formats
       * @tags @pd41804 @negative
       */
      it("Upload a non-Excel file", { tags: ["@pd41804"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.importInvalidFileFormat();
      });

      /**
       * @test Upload large Excel file with 1000+ rows
       * @description Test performance and handling of large Excel files
       * @tags @pd41813 @performance
       */
      it("Upload large Excel file with 1000+ rows", { tags: ["@pd41813"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.createLargeImportFile();
        importOperations.uploadValidConvertedFile();
        importOperations.monitorJobQueue("COMPLETED");
      });

      /**
       * @test Click "Cancel" after selecting file
       * @description Verify cancel functionality works correctly after file selection
       * @tags @pd41781 @ui
       */
      it('Click "Cancel" after selecting file', { tags: ["@pd41781"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.cancelImport();
      });

      /**
       * @test Click "Browse" but cancel file selection in dialog
       * @description Verify behavior when file dialog is canceled
       * @tags @pd41786 @ui
       */
      it('Click "Browse" but cancel file selection in dialog', { tags: ["@pd41786"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.testCancelFileDialog();
      });

      /**
       * @test Upload file with HTML/script tags in description fields
       * @description Verify security validation for HTML/script injection attempts
       * @tags @pd41772 @security @negative
       */
      it("Upload file with HTML/script tags in description fields", { tags: ["@pd41772"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.createImportFileWithHtmlTags();
        importOperations.uploadValidConvertedFile();
        importOperations.verifyImportValidation();
      });

      /**
       * @test Try importing while system is busy with another import
       * @description Verify system handles concurrent import attempts properly
       * @tags @pd41762 @concurrency @negative
       * @pd44408 This is a bug ticket we found while running this case, so I’ve also added the bug tag.
       */
      it.skip("Try importing while system is busy with another import", { tags: ["@pd41762", "@bug-pd44408"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.testBusySystemImport();
      });

      /**
       * @test Upload with mixed valid and invalid records
       * @description Verify handling of files containing both valid and invalid records
       * @tags @pd41780 @mixed-data
       */
      it("Upload with mixed valid and invalid records", { tags: ["@pd41780"] }, () => {
        importOperations.openImportModal(
          importDialog,
          importBtnModal,
          fileData.modalTexts.importRiskTaxonomiesFromExcel
        );
        importOperations.createImportFileWithMixedRecords();
        importOperations.uploadValidConvertedFile();
        importOperations.verifyPartialImportSuccess();
      });

      /**
       * @test Verify import audit log is generated
       * @description Verify that import operations are properly logged for audit purposes
       * @tags @pd41819 @audit
       * @pd44409 This is a bug ticket we found while running this case, so I’ve also added the bug tag.
       */
      it.skip("Verify import audit log is generated", { tags: ["@pd41819", "@smoke", "@bug-pd44409"] }, () => {
        importOperations.verifyAuditLogGenerated();
      });
    });
  });
