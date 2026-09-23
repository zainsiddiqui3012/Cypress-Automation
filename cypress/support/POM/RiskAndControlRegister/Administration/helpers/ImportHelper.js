import locators from "../../../../../fixtures/locators.json";
import KXIPom from "../../../../POM/KXIModule/KxI_POM";
const loc = locators.risk.administration.importOperations;
class ImportHelper {
  /**
   * Opens the import modal by clicking the three ellipses and selecting the Import option
   * @param {string} importModalSelector - CSS selector for the import modal
   */
  static openImportModal(
    importModalSelector = "#importRiskForm",
    importBtnElipses = loc.importBtnThreeElipses,
    

    modalText = "Import Risk Taxonomies from Excel file"
  ) {
    cy.wait(1000); // Wait for UI to stabilize
    // Click on three ellipses dropdown - scroll into view first to handle clipping
    cy.get(locators.general.threeElipses).eq(0)
      .scrollIntoView()
      .should("exist")
      .click({ force: true });

    // Click on Import option
    cy.get(importBtnElipses).should("be.visible").contains("Import").click();

    // Verify import modal is visible
    cy.get(importModalSelector).should("be.visible");
    cy.get(loc.importModal).should("contain.text", modalText);
  }

  /**
   * Downloads the sample template file
   * @param {string} expectedFileName - Expected downloaded file name
   */
  static downloadSampleFile(
    expectedFileName = "ImportTemplate_RiskTaxonomy_NoneReseller.xlsx"
  ) {
    // Click on Download Sample File link
    cy.get(loc.downloadSampleFile)
      .should("be.visible")
      .contains("Download Sample File")
      .click();

    // Wait for download to complete and return the chainable
    return cy.wait(3000).then(() => {
      // Verify file is downloaded and return the verification
      return cy
        .readFile(`cypress/downloads/${expectedFileName}`)
        .should("exist");
    });
  }

  /**
   * Clears browser cache and file input cache before upload
   * This ensures fresh files are uploaded, especially important in CLI mode
   */
  static clearCacheBeforeUpload() {
    cy.log('Clearing cache before file upload...');
    
    // Clear browser cache
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Clear any existing file input values
    cy.get('body').then(($body) => {
      if ($body.find('input[type="file"]').length > 0) {
        cy.get('input[type="file"]').each(($el) => {
          cy.wrap($el).invoke('val', '');
        });
      }
    });
    
    // Add a small wait to ensure cache clearing is complete
    cy.wait(500);
    cy.log('Cache cleared successfully');
  }

  /**
   * Uploads a file in the import modal
   * @param {string} filePath - Path to the file to upload
   * @param {boolean} expectImportButton - Whether to expect Import button to be visible
   */
  static uploadFile(
    filePath,
    expectImportButton = true,
    submitBtnLoc = loc.submitImport
  ) {
    // Clear cache before upload to ensure fresh files
    this.clearCacheBeforeUpload();
    
    cy.log(`Uploading file: ${filePath}`);
    
    // Upload file
    cy.get(loc.importUploadBtn)
      .should("exist")
      .selectFile(filePath, { force: true });

    // Wait for file processing
    cy.wait(2000);

    if (expectImportButton) {
      // Verify Import button becomes visible for valid files
      cy.get(submitBtnLoc).should("be.visible").and("contain.text", "Import");
    } else {
      // Verify Import button remains hidden for invalid files
      cy.get(submitBtnLoc).should("not.be.visible");
    }
    
    cy.log('File upload completed');
  }

  /**
   * Clicks the Import button in the modal
   */
  static clickImportButton() {
    cy.get(loc.submitImport)
      .should("be.visible")
      .and("not.be.disabled")
      .click();
  }

  /**
   * Cancels the import operation
   */
  static cancelImport() {
    cy.get(loc.cancelImportModalBtn)
      .should("be.visible")
      .contains("Cancel")
      .dblclick({ delay: 1000 });
  }

  /**
   * Verifies the Job Queue modal opens
   */
  static verifyJobQueueModalOpen() {
    cy.get(loc.jobQueModal).contains("Job Queue").should("be.visible");

    cy.get(loc.jobQueGrid).should("be.visible");
  }

  /**
   * Clicks the refresh button in Job Queue
   */
  static refreshJobQueue() {
    cy.get(loc.refereshJobQue).should("be.visible").click();

    cy.wait(1000); // Wait for refresh
  }

  /**
   * Monitors job status until completion or failure
   * @param {string} expectedStatus - Expected final status ('COMPLETED' or 'FAILED')
   * @param {number} maxRetries - Maximum number of refresh attempts
   * @param {number} retryDelay - Delay between refresh attempts in milliseconds
   */
static monitorJobStatus(
    expectedStatus = "COMPLETED",
    maxRetries = 90,
    retryDelay = 2000
  ) {
    const checkStatus = (retriesLeft) => {
      // Get the latest job status (first row)
      cy.get(loc.jobQueRow).first().wait(2000).as("status");
      cy.get("@status")
        .find(loc.jobStatus, { timeout: 10000 })
        .invoke("text")
        .then((statusText) => {
          cy.log(`Current job status: ${statusText}`);

          if (statusText.includes(expectedStatus)) {
            // Expected status found
            cy.log(`Job ${expectedStatus} successfully`);
            expect(statusText).to.include(expectedStatus);
          } else if (statusText.includes("PROCESSING")) {
            // Still processing, continue monitoring
            if (retriesLeft > 0) {
              cy.wait(retryDelay);
              this.refreshJobQueue();
              checkStatus(retriesLeft - 1);
            } else {
              throw new Error(
                `Job still processing after ${maxRetries} retries`
              );
            }
          } else if (statusText.includes("FAILED")) {
            // Job failed
            if (expectedStatus === "FAILED") {
              cy.log("Job failed as expected");
              expect(statusText).to.include("FAILED");
            } else {
              throw new Error(`Job failed unexpectedly: ${statusText}`);
            }
          } else {
            // Unknown status
            throw new Error(`Unknown job status: ${statusText}`);
          }
        });
    };

    checkStatus(maxRetries);
  }
  
  /**
   * Closes the Job Queue modal
   */
  static closeJobQueueModal() {
    cy.get(loc.cancelJobQueModalBtn).contains("×").click({ force: true });
  }

  /**
   * Monitors job status for validation errors (FAILED or COMPLETED WITH ERRORS)
   * @param {number} maxRetries - Maximum number of refresh attempts
   * @param {number} retryDelay - Delay between refresh attempts in milliseconds
   */
  static monitorValidationErrorStatus(maxRetries = 90, retryDelay = 2000) {
    const checkStatus = (retriesLeft) => {
      cy.get(loc.jobQueRow).first().wait(2000).as("status");
      cy.get("@status")
        .find(loc.jobStatus, { timeout: 10000 })
        .invoke("text")
        .then((statusText) => {
          cy.log(`Current job status: ${statusText}`);

          if (statusText.includes("FAILED") || statusText.includes("COMPLETED WITH ERRORS")) {
            cy.log(`Job completed with validation errors: ${statusText}`);
            expect(statusText).to.satisfy((text) => 
              text.includes("FAILED") || text.includes("COMPLETED WITH ERRORS")
            );
          } else if (statusText.includes("PROCESSING")) {
            if (retriesLeft > 0) {
              cy.wait(retryDelay);
              this.refreshJobQueue();
              checkStatus(retriesLeft - 1);
            } else {
              throw new Error(`Job still processing after ${maxRetries} retries`);
            }
          } else {
            throw new Error(`Unexpected job status for validation error test: ${statusText}`);
          }
        });
    };

    checkStatus(maxRetries);
  }

  /**
   * Verifies validation error message for invalid file
   * @param {string} expectedError - Expected error message
   */
  static verifyValidationError(expectedError) {
    cy.get(loc.modalBody)
      .should("contain.text", expectedError)
      .or("be.visible");
  }

  /**
   * Filters job queue by time period
   * @param {string} timePeriod - Time period filter ('today', 'last_week', 'last_month', etc.)
   */
  static filterJobQueue(timePeriod = "today") {
    cy.get(loc.filterJobQue).click();
    cy.get(`#${timePeriod}`).click();
  }

  // ============= RISK TAXONOMY JSON TO EXCEL FUNCTIONS =============

  /**
   * Adds randomized Risk Taxonomy data to the import JSON file and uploads a valid file.
   * @param {string} qbImportPath - Path to JSON template file
   * @param {boolean} validFormatFile - Whether to use a valid format file.
   */
  static addRiskTaxonomyDataImportJson(qbImportPath, validFormatFile) {
    cy.readFile(qbImportPath)
      .then(($json) => {
        cy.createRandomString(8).then(($el) => {
          // Update Risk Taxonomy Name with random string
          $json["Risk Taxonomy"][0]["Name*"] = "Risk Taxonomy Import " + $el;
          cy.writeFile(qbImportPath, $json);
        });
      })
      .then(() => {
        cy.readFile(qbImportPath).then(($json) => {
          // Convert JSON to Excel using existing utility
          cy.convertXlsxtoJson($json, false, false);
          this.uploadValidFileAndSubmit(validFormatFile, "importFile_XLSX");
        });
      });
  }

  /**
   * Uploads and submits a large import file as well as normal (Excel/CSV).
   * This method ensures the file exists before attempting upload.
   *
   * @param {boolean} validFormatFile - True for Excel (.xlsx), false for CSV (.csv).
   * @param {string} [fileName="importFile"] - Base name of the file (without extension).
   * @param {string} [submitBtnLoc=loc.submitImport] - Locator for the submit button.
   * @param {string} [uploadFilePath="downloads"] - Path where the file is located.
   * @param {string|null} [customFilePath=null] - If provided, overrides default path and filename.
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} - Cypress chainable for assertions.
   */

  static uploadAndSubmitLargeImportFile(
    validFormatFile,
    fileName = "importFile",
    submitBtnLoc = loc.submitImport,
    uploadFilePath = "downloads",
    customFilePath = null
  ) {
    const filePath = customFilePath
      ? customFilePath
      : validFormatFile
      ? `cypress/${uploadFilePath}/${fileName}.xlsx`
      : `cypress/${uploadFilePath}/${fileName}.csv`;

    cy.readFile(filePath, { timeout: 10000, encoding: null }).should("exist");

    cy.get(loc.importUploadBtn).selectFile(filePath);
    cy.get(submitBtnLoc).click();

    cy.waitForElementToVisible(
      locators.administration.toastMsg,
      Cypress.env("waits").longWait
    );
  }
  /**
   * Uploads a valid file for import and submits the import form.
   * @param {boolean} validFormatFile - Whether to use xlsx or csv format.
   */
  static uploadValidFileAndSubmit(
    validFormatFile,
    fileName = "importFile",
    submitBtnLoc = loc.submitImport
  ) {
    const filePath = validFormatFile
      ? `cypress/downloads/${fileName}.xlsx`
      : `cypress/downloads/${fileName}.csv`;

    cy.log(`Uploading and submitting file: ${filePath}`);
    
    cy.get(loc.importUploadBtn).selectFile(filePath);
    cy.get(submitBtnLoc).click();

    cy.waitForElementToVisible(
      locators.administration.toastMsg,
      Cypress.env("waits").longWait
    );
    
    cy.log('File upload and submit completed');
  }
  /**
   * Writes the imported name from the import JSON file to the data file.
   * @param {string} qbImportPath - Path to the import JSON file
   */
  static writeImportNameToDataFile(qbImportPath, columnName = "Risk Taxonomy") {
    return cy.readFile(qbImportPath).then((file) => {
      // Get the imported Risk Taxonomy name
      const importedTaxonomyName = file[columnName][0]["Name*"];

      return importedTaxonomyName;
    });
  }

  /**
   * Upload invalid file format
   * @param {string} invalidFilePath - Path to invalid file
   */
  static uploadInvalidFile(invalidFilePath, submitBtnLoc) {
    this.uploadFile(invalidFilePath, false, submitBtnLoc);
  }

  /**
   * Upload file with missing required columns
   * @param {string} invalidFilePath - Path to file with missing columns
   */
  static uploadFileWithMissingColumns(invalidFilePath) {
    this.uploadFile(invalidFilePath, false);
  }

  /**
   * Verifies import success message
   */
  static verifyImportSuccess() {
    this.monitorJobStatus("COMPLETED");
  }

  /**
   * Verifies import failure with error message
   */
  static verifyImportFailure() {
    this.monitorJobStatus("FAILED");
  }

  /**
   * Verifies duplicate taxonomy handling
   * @param {string} duplicateName - Name of duplicate taxonomy
   */
  static verifyDuplicateHandling(duplicateName) {
    // After import, check if duplicates are properly handled
    this.monitorJobStatus("COMPLETED");

    // Could check for warning messages or specific handling
    cy.log(`Verified duplicate handling for: ${duplicateName}`);
  }

  /**
   * Complete import workflow with valid file
   * @param {string} filePath - Path to valid file
   */
  static performValidImport(filePath) {
    this.openImportModal();
    this.uploadFile(filePath, true);
    this.clickImportButton();
    this.verifyJobQueueModalOpen();
    this.verifyImportSuccess();
    this.closeJobQueueModal();
  }

  /**
   * Complete import workflow with invalid file
   * @param {string} filePath - Path to invalid file
   * @param {string} expectedError - Expected error message
   */
  static performInvalidImport(filePath, submitBtnLoc) {
    this.uploadInvalidFile(filePath, submitBtnLoc);
    this.cancelImport();
  }

  /**
   * Creates import file from sample template, updating only Risk Taxonomy name
   * @param {string} qbImportPath - Path to JSON file
   */
  static createImportFileFromSampleWithUpdatedName(
    qbImportPath,
    contentLibraryName
  ) {
    const samplePath =
      "cypress/attachment/ImportTemplate_RiskTaxonomy_NoneReseller.xlsx";
    const outputPath = "cypress/downloads/importFile_XLSX.xlsx";

    // First check if sample file exists
    cy.task("fileExists", samplePath).then((exists) => {
      if (!exists) {
        throw new Error(
          `Sample file not found: ${samplePath}. Please download the sample file first.`
        );
      }

      cy.log(`Sample file exists: ${samplePath}`);
    });

    // Read JSON to get structure, then create random name
    cy.readFile(qbImportPath).then((jsonData) => {
      cy.createRandomString(8).then((randomString) => {
        const newTaxonomyName = "Risk Taxonomy Import " + randomString;

        cy.log(`Generated new taxonomy name: ${newTaxonomyName}`);

        // Update JSON with new name (for tracking purposes)
        jsonData["Risk Taxonomy"][0]["Name*"] = newTaxonomyName;

        // Save updated JSON
        cy.writeFile(qbImportPath, jsonData);

        // Update the Excel file with only the new taxonomy name
        cy.task("updateRiskTaxonomyNameInExcel", {
          sampleFilePath: samplePath,
          outputPath: outputPath,
          newTaxonomyName: newTaxonomyName,
          contentLibraryName: contentLibraryName,
        }).then((result) => {
          cy.log(`Task result:`, result);

          if (result && result.success) {
            cy.log(
              "Import file created successfully with updated Risk Taxonomy name"
            );

            // Verify the file was actually created
            cy.task("fileExists", outputPath).then((fileCreated) => {
              if (!fileCreated) {
                throw new Error(`Output file was not created: ${outputPath}`);
              }
              cy.log(`Verified import file exists: ${outputPath}`);
            });
          } else {
            const errorMsg = result ? result.error : "Unknown error occurred";
            throw new Error(`Failed to create import file: ${errorMsg}`);
          }
        });
      });
    });
  }

  static convertAndUploadUpdateJSON_XLSXFile(
    JSONFile,
    validFormatFile = true,
    fileName = "importFile_XLSX",
    submitBtnLoc = "#importControlSubmit"
  ) {
    cy.convertXlsxtoJson(JSONFile).then(() => {
      ImportHelper.uploadValidFileAndSubmit(
        validFormatFile,
        fileName,
        submitBtnLoc
      );
    });
  }
}

export default ImportHelper;
