import locators from "../../../../fixtures/locators.json";
import kxiData from "../../../../fixtures/KXIModule/KXIDataFREDImport/KXIDataFREDImport.json";
const path = require("path");
require("cypress-file-upload");

const locKxi = locators.kxi.kxiData;

/**
 * Page Object class for handling actions related to KXI Data Import functionality.
 */
export class KXIDataImport {
  /**
   * Clicks on the Three Ellipses icon on the top-left of the KXI Data screen.
   */
  clickThreeElipses() {
    cy.get(locKxi.threeElepsis).click({ force: true });
  }

  /**
   * Clicks the Import button in the Three Ellipses dropdown and verifies the modal title.
   */
  clickImportBtn() {
    this.clickThreeElipses();
    cy.get(locKxi.importBtn).click();
    cy.get(locKxi.importModal.modalTitle)
      .should("be.visible")
      .should("have.text", kxiData.importModalTitle);
  }

  /**
   * Clicks the "Download Sample File" link in the Import modal.
   */
  clickDownloadSampleFile() {
    cy.get(locKxi.importModal.downloadSampleFile).should("be.visible").click();
  }

  /**
   * Verifies that the sample Excel file has been downloaded successfully.
   */
  verifyDownloadFile() {
    cy.readFile("cypress/attachment/KRI_Data_Template.xlsx").should("exist");
  }

  /**
   * Uploads the given file and submits the import form. Intercepts the API call and assigns alias.
   *
   * @param {string} fileName - Name of the file to upload (from downloads folder)
   * @param {string} aliasName - Alias to assign to the intercepted API request
   */
  uploadFileAndIntercept(fileName, aliasName) {
    const filePath = `attachments/${fileName}`;
    cy.intercept("POST", kxiData.importKxiApi).as(aliasName);
    cy.get(locKxi.importModal.chooseFile).attachFile(filePath);
    cy.get(locKxi.importModal.importBtn)
      .if("exist")
      .click()
      .else()
      .should("not.exist");
  }
  uploadInvalidFile(fileName, aliasName) {
    const filePath = `attachments/${fileName}`;
    cy.intercept("POST", kxiData.importKxiApi).as(aliasName);
    cy.get(locKxi.importModal.chooseFile).attachFile(filePath);
    cy.get(locKxi.importModal.importBtn).should("not.be.visible");
  }

  /**
   * Waits for the intercepted API call and validates the response.
   *
   * @param {string} aliasName - Alias for the intercepted request
   * @returns {Cypress.Chainable<Response>} The intercepted API response
   * @throws Will throw an error if the status code is 500
   */
  validateInterceptResponse(aliasName) {
    return cy.wait(`@${aliasName}`).then(({ response }) => {
      if (response.statusCode === 500) {
        Cypress.log({
          name: kxiData.name,
          message: [kxiData.bugText],
          consoleProps: () => ({
            status: response.statusCode,
            statusText: response.statusMessage,
            body: response.body,
            headers: response.headers,
          }),
        });

        throw new Error(kxiData.exceptionError);
      }

      expect(response.statusCode).to.eq(200);
      return response;
    });
  }

  /**
   * Validates the appearance and content of the success toast message.
   */
  verifyToastMessage() {
    cy.get(locKxi.toastMessage).should(
      "contain.text",
      kxiData.uploadSuccessMsg
    );
  }

  /**
   * Validates the appearance and content of the error toast message for unsupported files.
   */
  verifyErrorToastMessage() {
    cy.get(locKxi.toastMessage).should("contain.text", kxiData.unsupportedFile);
  }

  /**
   * Searches the KRI data grid and asserts that the given text is not present.
   *
   * @param {string} searchText - The text to search for
   * @param {number} [timeout=3000] - Optional timeout before searching
   */
  searchAndVerifyRecordNotPresent(searchText, timeout = 3000) {
    cy.get(locKxi.defSearchInput)
      .wait(timeout)
      .clear({ force: true })
      .type(searchText);

    cy.get(locKxi.importModal.kriDataGridDiv).should("not.contain", searchText);
  }
}
