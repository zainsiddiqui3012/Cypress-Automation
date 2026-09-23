import locators from "../../../../fixtures/locators.json";
import MyDocumentsHelpers from "./MyDocumentsHelper";
const loc = locators.companyDocuments;
const general = locators.general;
const helpers = new MyDocumentsHelpers();

class ExportDocumentHelper {

  /**
   * Searches for a document/folder by name
   * @description Uses the search functionality to find a specific document or folder
   * @param {string} searchTerm - Name of the document/folder to search
   * @returns {void}
   */
  searchDocument(searchTerm) {
    helpers.withinDmsFrame(() => {
      // Click search icon if needed
      cy.get(general.searchIcon, { timeout: 10000 })
        .should("be.visible")
        .click({ delay: 500 });

      // Clear and type search term
      cy.get(general.searchTextBox, { timeout: 10000 })
        .should("be.visible")
        .clear()
        .type("{selectall}{backspace}")
        .type(searchTerm + "{enter}");

      // Wait for search results to load
      cy.waitForTopMsgLoaderToDisappear(15000);
    });
  }

  /**
   * Clears the search to show all documents
   * @description Resets the search filter to display all documents
   * @returns {void}
   */
  clearSearch() {
    helpers.withinDmsFrame(() => {
      cy.get(general.searchIcon, { timeout: 10000 })
        .should("be.visible")
        .click({ delay: 500 });

      cy.get(general.searchTextBox, { timeout: 10000 })
        .should("be.visible")
        .clear()
        .type("{selectall}{backspace}{enter}");

      cy.waitForTopMsgLoaderToDisappear(15000);
    });
  }

  /**
   * Verifies document exists in grid
   * @description Checks if a document with the given name is visible in the grid
   * @param {string} documentName - Name of the document to verify
   * @returns {void}
   */
  verifyDocumentExists(documentName) {
    helpers.withinDmsFrame(() => {
      cy.contains(loc.grid.leftPinnedRows, documentName, {
        timeout: 10000,
      }).should("be.visible");
    });
  }

  /**
   * Verifies document does not exist in grid
   * @description Checks if a document with the given name is not in the grid
   * @param {string} documentName - Name of the document to verify
   * @returns {void}
   */
  verifyDocumentDoesNotExist(documentName) {
    helpers.withinDmsFrame(() => {
      cy.contains(loc.grid.rows, documentName).should("not.exist");
    });
  }

  /**
   * Selects a document by clicking its checkbox
   * @description Clicks the checkbox for a specific document
   * @param {string} documentName - Name of the document to select
   * @returns {void}
   */
  selectDocument(documentName) {
    helpers.withinDmsFrame(() => {
      cy.contains(loc.grid.leftPinnedRows, documentName, {
        timeout: 10000,
      })
        .should("be.visible")
        .closest(".ag-row")
        .find(".ag-selection-checkbox")
        .click({ delay: 800 });
    });
  }

  /**
   * Selects a folder by clicking its checkbox
   * @description Clicks the checkbox for a specific folder
   * @param {string} folderName - Name of the folder to select
   * @returns {void}
   */
  selectFolder(folderName) {
    this.selectDocument(folderName); // Same mechanism for folders
  }

  /**
   * Selects multiple documents/folders
   * @description Selects multiple items by checking their checkboxes
   * @param {Array<string>} itemNames - Array of document/folder names to select
   * @returns {void}
   */
  selectMultipleItems(itemNames) {
    itemNames.forEach((itemName) => {
      this.selectDocument(itemName);
    });
  }

  /**
   * Clicks the Export button
   * @description Clicks the main Export button to export selected documents
   * @returns {void}
   */
  clickExportButton() {
    helpers.withinDmsFrame(() => {
      cy.contains("a", "Export", { timeout: 10000 })
        .should("be.visible")
        .click();

      /* Wait Required here because we are downloading the file after clicking on Export button
      so its not about the element its system behavior that it needs time to download the file */
      cy.wait(2000);
    });
  }

  /**
   * Verifies Export button is visible
   * @description Checks if the Export button is present on the page
   * @returns {void}
   */
  verifyExportButtonVisible() {
    helpers.withinDmsFrame(() => {
      cy.contains("a", "Export", { timeout: 10000 }).should("be.visible");
    });
  }

  /**
   * Verifies Export button is disabled
   * @description Checks if the Export button is disabled (no selection)
   * @returns {void}
   */
  verifyExportButtonDisabled() {
    helpers.withinDmsFrame(() => {
      cy.contains("a", "Export").parent().should("have.class", "disabled");
    });
  }

  /**
   * Opens three-dot menu for a document
   * @description Clicks the three-dot menu for a specific document
   * @param {string} documentName - Name of the document
   * @returns {void}
   */
  openDocumentThreeDotMenu(documentName) {
    helpers.withinDmsFrame(() => {
      cy.contains(loc.grid.rows, documentName, { timeout: 10000 })
        .should("be.visible")
        .within(() => {
          cy.get(".actionDropDWrap button", { timeout: 5000 })
            .should("be.visible")
            .click({ force: true });
        });

      cy.get(loc.actions.threeDotMenu, { timeout: 5000 }).should("be.visible");
    });
  }

  /**
   * Deletes a document using three-dot menu
   * @description Deletes a document via the three-dot menu
   * @param {string} documentName - Name of the document to delete
   * @returns {void}
   */
  deleteDocument(documentName) {
    this.openDocumentThreeDotMenu(documentName);

    helpers.withinDmsFrame(() => {
      cy.get(loc.actions.deleteMenuItem, { timeout: 5000 })
        .should("be.visible")
        .click();

      // Confirm deletion
      cy.get(loc.actions.deleteFile, { timeout: 5000 })
        .should("be.visible")
        .click();

      cy.waitForTopMsgLoaderToDisappear(10000);
    });
  }

  /**
   * Verifies document status
   * @description Checks the status of a document in the grid
   * @param {string} documentName - Name of the document
   * @param {string} expectedStatus - Expected status (e.g., "Approved", "Pending")
   * @returns {void}
   */
  verifyDocumentStatus(documentName, expectedStatus) {
    helpers.withinDmsFrame(() => {
      cy.contains(loc.grid.leftPinnedRows, documentName, { timeout: 10000 })
        .should("be.visible");
      cy.get(loc.grid.statusColumn)
        .should("contain.text", expectedStatus);
    });
  }

  /**
   * Expands a folder to view its contents
   * @description Double-clicks a folder to expand and view contents
   * @param {string} folderName - Name of the folder to expand
   * @returns {void}
   */
  expandFolder(folderName) {
    helpers.withinDmsFrame(() => {
      cy.contains(loc.grid.rows, folderName, { timeout: 10000 })
        .should("be.visible")
        .dblclick({ delay: 1000 });
      cy.get(loc.grid.rows)
      .should('have.length.greaterThan', 1);
    });
  }

  /**
   * Verifies export was successful
   * @description Checks for success message after export
   * @returns {void}
   */
  verifyExportSuccess(filePartialName) {
    cy.task("checkFileExists", {
      folder: "cypress/downloads",
      filePrefix: filePartialName,
    }).should("be.true");
  }

  /**
   * Waits for document grid to load
   * @description Ensures the document grid has fully loaded
   * @returns {void}
   */
  waitForGridToLoad() {
    helpers.withinDmsFrame(() => {
      cy.get(loc.grid.container, { timeout: 15000 }).should("be.visible");
      cy.waitForTopMsgLoaderToDisappear(15000);
    });
  }
}

export default ExportDocumentHelper;
