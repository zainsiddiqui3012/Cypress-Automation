import locators from "../../../fixtures/locators.json";
import * as XLSX from "xlsx";
import "cypress-file-upload";
const importFileName = "ImportTemplate_RiskRegister";
const sampleFileName = "ImportTemplate_RiskRegister.xlsx";
import FileHelper from "../../../support/POM/RiskAndControlRegister/Administration/helpers/FileHelper";
import DateHelper from "../../../support/POM/RiskAndControlRegister/Administration/helpers/DateHelper";
import ImportHelper from "../../../support/POM/RiskAndControlRegister/Administration/helpers/ImportHelper";
import dataFile from "../../../fixtures/RiskAndControlRegister/ImportExport.json";
const defImport = `cypress/fixtures/Examples/Data/myExportData/RiskRegister.json`;
const writeDataFilePath = "cypress/fixtures/RiskModule/RiskDefintionName.json";
export default class ImportExpot {
  addriskImportJSON() {
    const uniqueImportName =
      DateHelper.generateUniqueNameWithTimestamp("Risk ");

    // Update the JSON file
    FileHelper.updateImportJSONFileSections(
      defImport,
      dataFile.riskRegister,
      0,
      {
        "Risk Name*": uniqueImportName,
      }
    ).then(() => {
      // Read the updated file and convert to XLSX
      cy.readFile(defImport).then((updatedJsonData) => {
        cy.convertXlsxtoJson(updatedJsonData, false, true);
        // Use the writeControlTaxonomyName method from ControlTaxonomy class
        cy.readFile(writeDataFilePath).then((file) => {
          file.RiskDefinitionSearch = uniqueImportName;
          cy.writeFile(writeDataFilePath, file);
        });
      });
    });
  }

  /**
   * convertXlsxToJson will convert the JSONFILE to XLSX
   * @param {String,JSON} jsonfile will be the jsonfile that we want to convert
   */
  convertXlsxtoJson(jsonfile, csv = false, qb = false) {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Iterate through each key in the jsonfile (each key represents a sheet)
    Object.keys(jsonfile).forEach((sheetName) => {
      const sheetData = jsonfile[sheetName];
      const sheet = XLSX.utils.json_to_sheet(sheetData);

      if (qb) {
        // Post-process the sheet to ensure the "Id" column is blank and formatted as a number
        Object.keys(sheet).forEach((cell) => {
          if (cell.startsWith("A") && sheet[cell].v === 0) {
            sheet[cell].v = ""; // Set the value to blank
            sheet[cell].t = "n"; // Set the type to number
            sheet[cell].z = "0"; // Explicitly set the format to number
          }
        });
      }

      // Append the sheet to the workbook with the sheet name from the JSON file
      XLSX.utils.book_append_sheet(wb, sheet, sheetName);
    });
    // Write the workbook to a CSV file
    csv
      ? XLSX.writeFile(wb, importFileName + ".csv")
      : XLSX.writeFile(wb, importFileName + ".xlsx");
  }

  restoreDefaultLayout() {
    cy.get(locators.risk.riskRegister.ellipsesBtn).trigger("mouseover");
    cy.get(locators.risk.riskRegister.restoreLayoutOption).click();
  }

  /**
   * Wait for the default layout restoration message to disappear
   * @param {string} text - Text to wait for disappearance
   */
  waitForDefaultLayout(text = "Restored default layout") {
    cy.contains(text).should("be.visible");
    cy.contains(text, { timeout: 10000 }).should("not.exist");
  }

  openImportModal() {
    cy.get(locators.risk.riskRegister.ellipsesBtn).trigger("mouseover");
    cy.get(locators.risk.riskRegister.importBtn).click();
  }
  /**
   * uploadImportFile will upload the Data and definition file from the import Modal
   */
  uploadImportFile() {
    this.openImportModal();
    cy.get(locators.risk.riskRegister.fileInput).selectFile(
      dataFile.importFile
    );
    cy.get(locators.risk.riskRegister.importSubmitBtn)
      .should("be.visible")
      .click({
        force: true,
      });
  }

  /**
   * downloadExportFile will download the recent export from KXI Definition screen
   */
  downloadExportFile() {
    //
    cy.get(locators.kxi.kxiData.threeElepsis).click({ force: true });
    cy.get(locators.risk.riskRegister.exportBtn).click({ force: true });
    cy.get(locators.risk.riskRegister.modalExportButton).click({ force: true });
  }

  searchRiskDefinition(riskDefinitionName) {
    cy.get(locators.risk.riskRegister.riskGridSearchInput, { timeout: 100000 })
      .should("be.visible")
      .click()
      .clear()
      .wait(500)
      .invoke("val", "") // Ensure field is completely empty
      .type(riskDefinitionName)
      .should("have.value", riskDefinitionName); // Verify the value is set

    // Wait for the grid to load and show results
    cy.waitForTopMsgLoaderToDisappear(300000);
    cy.waitForMyGridLoaderToDisappear(300000);
  }

  validateRiskOnGrid(riskDefinitionName) {
    cy.get(locators.risk.riskRegister.gridRow)
      .should("be.visible")
      .and("contain.text", riskDefinitionName);
  }

  /**
   * Download sample file and verify download
   */
  downloadSampleFile() {
    ImportHelper.downloadSampleFile(sampleFileName);
  }

  /**
   * Import invalid file format
   * @param {string} filePath - Path to invalid format file
   */
  importInvalidFileFormat(filePath = dataFile.invalidFile) {
    ImportHelper.performInvalidImport(
      filePath,
      locators.risk.administration.importOperations.importRiskRegister
    );
  }
}
