import kxiData from "../../../fixtures/KXIModule/KXIDataFREDImport/KXIDataFREDImport.json";
import locators from "../../../fixtures/locators.json";
const path = require("path");
const locKxi = locators.kxi.kxiData;

class KXIDataFREDImport {
  /**
   * clickThreeElipses will click on Three Elipses icon on the Top left of the KXI Data screen
   */
  clickThreeElipses() {
    cy.get(locKxi.threeElepsis).click({ force: true });
  }

  /**
   * clickImportBtn will first click on Three Elipses and then click on Import Button in the sub-menu of elipses
   * then it will verify import modal title is visible and title is 'Import KxI Data from Excel file'
   */
  clickImportBtn() {
    this.clickThreeElipses();
    cy.get(locKxi.importBtn).click();
    cy.get(locKxi.importModal.modalTitle)
      .should("be.visible")
      .should("have.text", kxiData.importModalTitle);
  }

  /**
   * clickDownloadSampleFile will click on download sample file link on Import modal after verifying it's visibility
   */
  clickDownloadSampleFile() {
    cy.get(locKxi.importModal.downloadSampleFile).should("be.visible").click();
  }

  /**
   * verifyDownloadFile will verify template file is downloaded in downloads folder
   */
  verifyDownloadFile() {
    const downloadsFolder = Cypress.config("downloadsFolder");
    cy.readFile(path.join(downloadsFolder, "KRI_Data_Template.xlsx")).should(
      "exist"
    );
  }

  /**
   * searchDefination will search the definition in the grid
   */
  searchDefination(definationName) {
    const FREDTYPE = "Real M2 Money Stock"
    if(definationName!=FREDTYPE){
    cy.get(locKxi.defSearchInput)
      .wait(kxiData.timeout.min)
      .clear({ force: true })
      .wait(kxiData.timeout.min)
      .type(definationName)
      .wait(kxiData.timeout.min)
      .blur()
      .wait(kxiData.timeout.min);
  }
}

  /**
   * deleteKXIDAtaImport will search the defination name and delete it
   * @param {string} definationName Name of the definition to be deleted
   */
  deleteKXIDAtaImport(definationName) {
    const FREDTYPE = "Real M2 Money Stock"
    if(definationName!=FREDTYPE){
    this.searchDefination(definationName);
                cy.get(locKxi.firstRowDelete)
                    .click({ force: true })
                    .wait(kxiData.timeout.min);

    cy.get(locKxi.deleteModal.deleteBtn).should("be.visible").click();

    cy.verifyToastMessageText(kxiData.deleteToastMsg, kxiData.timeout.defualt);
    }

}

  /**
   * uploadImportFile will select the import file from fixture folder
   * then intercept the import API
   * then click on import btn
   * @param {string} name Name of the KXI type e.g. FRED
   */
  uploadImportFile(name) {
    cy.get(locKxi.importModal.chooseFile).selectFile(
      `cypress/fixtures/KXIModule/KXIDataFREDImport/Attachments/${name}_KRI_DATA.xlsx`
    );

    cy.intercept("/predict360/web/kriDataManagment/importKriData").as(
      "import_API"
    );

    cy.get(locKxi.importModal.importBtn).click();
  }

  /**
   * verifyUploadFile will verify the import API response and toast message
   * @param {object} kriType type of the object from data file
   */
  verifyUploadFile(kriType) {
    cy.wait("@import_API");
    cy.get("@import_API").its("response.statusCode").should("eq", 200);
    cy.get("@import_API")
      .its("response.body.saved")
      .should("eq", kriType.saved);
    cy.get("@import_API")
      .its("response.body.rejected")
      .should("eq", kriType.rejected);
    cy.get("@import_API")
      .its("response.body.totalSize")
      .should("eq", kriType.totalSize);
    cy.get("@import_API")
      .its("response.body.message")
      .should("eq", kriType.message);
  }

  /**
   * verifyEnteredByValue will verify the value of Entered By column
   * @param {string} enterBy text to be verified
   */
  verifyEnteredByValue(enterBy) {
    cy.get(locKxi.enterByCell).should("be.visible").and("have.text", enterBy);
  }
}
export default KXIDataFREDImport;
