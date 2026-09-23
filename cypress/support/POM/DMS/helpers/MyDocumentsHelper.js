const data = require("../../../../fixtures/DMS/MyDocuments/MyDocuments.json");
import locators from "../../../../fixtures/locators.json";
const loc = locators.myDocuments;

class MyDocumentsHelpers {
  /**
   * Switches to DMS iframe context
   * @description Switches Cypress context to the DMS iframe
   * @returns {void}
   */
  switchToIframe() {
    cy.frameLoaded(loc.iframe);
    cy.iframe(loc.iframe).as("dmsFrame");
    cy.wait(1000); // Wait for iframe content to load
  }

  /**
   * Helper method to execute code within DMS iframe context
   * @description Wraps the callback execution within cy.get("@dmsFrame").within()
   * @param {Function} callback - The callback function to execute within iframe context
   * @returns {void}
   */
  withinDmsFrame(callback) {
    cy.get("@dmsFrame", { timeout: 30000 }).within(callback);
  }

  /**
   * Clicks the three ellipses button
   * @description Opens the main menu with Create Folder and Bookmarks options
   * @returns {void}
   */
  clickThreeEllipses(index = 0) {
    this.withinDmsFrame(() => {
      cy.get(locators.general.threeElipses)
        .eq(index)
        .should("be.visible")
        .click();

      cy.get(loc.threeEllipsesMenu.dropdown).should("be.visible");
    });
  }

  /**
   * Creates a folder via three ellipses menu
   * @description Opens create folder modal and creates a new folder
   * @param {string} folderName - Name for the new folder
   * @param {string} description - Optional folder description
   * @returns {void}
   */
  createFolderViaThreeEllipses(folderName, description = "") {
    this.clickThreeEllipses();

    this.withinDmsFrame(() => {
      cy.get(loc.threeEllipsesMenu.createFolder)
        .eq(0)
        .should("be.visible")
        .click();

      cy.get(loc.createFolderModal.modal).should("be.visible");

      cy.get(loc.createFolderModal.folderNameInput)
        .should("be.visible")
        .clear()
        .type(folderName);

      if (description) {
        cy.get(loc.createFolderModal.descriptionInput)
          .should("be.visible")
          .type(description);
      }

      cy.get(loc.createFolderModal.createButton).should("be.visible").click();
      cy.get(loc.createFolderModal.createButton).should("not.be.visible");
    });
  }

  /**
   * Opens bookmarks via three ellipses menu
   * @description Clicks on Bookmarks option in three ellipses menu
   * @returns {void}
   */
  openBookmarks() {
    this.clickThreeEllipses();

    this.withinDmsFrame(() => {
      cy.get(loc.threeEllipsesMenu.bookmarks).should("be.visible").click();

      cy.get(loc.bookmarkModal.modal).should("be.visible");
    });
  }

  /**
   * Clicks the Add button to open upload modal
   * @description Opens the file upload modal
   * @returns {void}
   */
  clickAddButton() {
    this.withinDmsFrame(() => {
      cy.get(locators.general.clickAddBtn, { timeout: 30000 })
        .should("be.visible")
        .click({ force: true });

      cy.get(loc.uploadModal.modal).should("be.visible");
    });
  }

  /**
   * Uploads a single file
   * @description Uploads a file using the file input
   * @param {string} filePath - Path to the file to upload
   * @returns {void}
   */
  uploadFile(filePath, errorMessage = false) {
    this.withinDmsFrame(() => {
      cy.get(loc.uploadModal.fileInput)
        .should("exist")
        .scrollIntoView()
        .selectFile(filePath, { force: true });

      cy.wait(1000); //wait For file to be loaded in DMS Modal

      // Click upload button
      cy.get(loc.uploadModal.uploadButton).should("be.visible").click();
      if (errorMessage === true) {
        cy.verifyToastMessageText(data.errorMessages.emptyField, 30000);
      }
    });

    cy.wait(2000); // wait was needed here Upload Btn would not be visible until Files are loaded and Uploaded in DMS Modal
  }

  /**
   * Uploads multiple files
   * @description Uploads multiple files using the file input
   * @param {Array} filePaths - Array of file paths to upload
   * @returns {void}
   */
  uploadMultipleFiles(filePaths) {
    this.withinDmsFrame(() => {
      cy.get(loc.uploadModal.fileInput)
        .should("exist")
        .selectFile(filePaths, { force: true });
      cy.get(loc.uploadModal.uploadButton).should("be.visible").click();
    });
  }

  /**
   * Closes the upload modal
   * @description Closes the file upload modal
   * @returns {void}
   */
  closeUploadModal() {
    this.withinDmsFrame(() => {
      cy.get(loc.uploadModal.cancelButton).should("be.visible").click();
    });
  }

  /**
   * Finds a folder by name
   * @description Locates a folder in the grid by its name
   * @param {string} folderName - Name of the folder to find
   * @returns {Cypress.Chainable} Cypress chainable element
   */
  findFolder(folderName) {
    return this.withinDmsFrame(() => {
      cy.contains(loc.grid.rows, folderName).should("be.visible");
    });
  }

  // Clicks the upload file button in the last row of the grid
  clickUploadFileBtn() {
    this.withinDmsFrame(() => {
      cy.get(loc.grid.addFileButton).should("be.visible").click();
    });
  }
  /**
   * Finds a file by name
   * @description Locates a file in the grid by its name
   * @param {string} fileName - Name of the file to find
   * @returns {Cypress.Chainable} Cypress chainable element
   */
  findFile(fileName) {
    return this.withinDmsFrame(() => {
      cy.contains(loc.grid.rows, fileName).should("be.visible");
    });
  }

  /**
   * Opens three-dot menu for an item (folder/file)
   * @description Clicks the three-dot menu for a specific folder or file
   * @param {string} itemName - Name of the folder or file
   * @returns {void}
   */
  openItemThreeDotMenu(itemName) {
    this.withinDmsFrame(() => {
      cy.contains(loc.grid.rows, itemName, { timeout: 30000 })
        .should("be.visible")
        .then(() => {
          cy.get(loc.grid.threeElipsesButton).should("be.visible").click();
        });

      cy.get(loc.itemActions.actionMenu).should("be.visible");
    });
  }

  gridFullyLoaded() {
    this.withinDmsFrame(() => {
      // Check if the grid container has more than 2 direct row children
      cy.get(loc.grid.rows, { timeout: 15000 })
        .should("be.visible")
        .children('div[role="row"]')
        .should("have.length.greaterThan", 30)
        .and("be.visible");
    });
  }
  /**
   * Scrolls the grid to the bottom
   * @description Scrolls the document grid to the bottom to load all items
   * @returns {void}
   */
  scrollGridToBottom(fileName) {
    this.withinDmsFrame(() => {
      cy.get(locators.general.searchIcon, { timeout: 10000 })
        .should("be.visible")
        .click({ delay: 1000 })
        .then(() => {
          cy.get(locators.general.searchTextBox, { timeout: 10000 })
            .should("be.visible")
            .clear()
            .type("{selectall}{backspace}") // Clear search to refresh grid
            .type(fileName + "{enter}");

          cy.waitForTopMsgLoaderToDisappear(15000);
        });
    });
  }

  /**
   * Bookmarks a folder via item's three-dot menu
   * @description Bookmarks a folder using the item's three-dot menu
   * @param {string} folderName - Name of the folder to bookmark
   * @returns {void}
   */
  bookmarkFolder(folderName) {
    this.openItemThreeDotMenu(folderName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.bookmark).should("be.visible").click();
    });
  }

  /**
   * unBookmarks a folder via item's three-dot menu
   * @description unBookmarks a folder using the item's three-dot menu
   * @param {string} folderName - Name of the folder to unbookmark
   * @returns {void}
   */
  unBookmarkFolder(folderName) {
    this.openItemThreeDotMenu(folderName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.unBookmark).should("be.visible").click();
    });
  }

  verifyBookMarkFolder(folderName) {
    this.openItemThreeDotMenu(folderName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.unBookmark).eq(0).should("be.visible");
    });
  }

  verifyUnBookMarkFolder(folderName) {
    this.openItemThreeDotMenu(folderName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.bookmark).eq(0).should("be.visible");
    });
  }
  /**
   * Bookmarks a file via item's three-dot menu
   * @description Bookmarks a file using the item's three-dot menu
   * @param {string} fileName - Name of the file to bookmark
   * @returns {void}
   */
  bookmarkFile(fileName) {
    this.openItemThreeDotMenu(fileName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.bookmark).should("be.visible").click();
    });
  }

  /**
   * Pins a file
   * @description Pins a file using the item's three-dot menu
   * @param {string} fileName - Name of the file to pin
   * @returns {void}
   */
  pinFile(fileName) {
    this.openItemThreeDotMenu(fileName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.pin).should("be.visible").click();
    });
  }

  /**
   * UnPins a file
   * @description UnPins a file using the item's three-dot menu
   * @param {string} fileName - Name of the file to unpin
   * @returns {void}
   */
  unpinFile(fileName) {
    this.openItemThreeDotMenu(fileName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.unpin).should("be.visible").click();
    });
  }

  /**
   * Renames a folder
   * @description Renames a folder using the item's three-dot menu
   * @param {string} oldName - Current name of the folder
   * @param {string} newName - New name for the folder
   * @returns {void}
   */
  renameFolder(oldName, newName) {
    this.openItemThreeDotMenu(oldName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.rename).should("be.visible").click();

      cy.get(loc.renameModal.modal).should("be.visible");

      cy.get(loc.renameModal.nameInput)
        .should("be.visible")
        .clear()
        .type("{selectall}{backspace}") // Clear existing text
        .type(newName);

      cy.get(loc.renameModal.saveButton).should("be.visible").click();
    });
  }

  /**
   * Renames a file
   * @description Renames a file using the item's three-dot menu
   * @param {string} oldName - Current name of the file
   * @param {string} newName - New name for the file
   * @returns {void}
   */
  renameFile(oldName, newName) {
    this.openItemThreeDotMenu(oldName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.rename).should("be.visible").click();

      cy.get(loc.renameModal.modalFile).should("be.visible");

      cy.get(loc.renameModal.nameInputFile)
        .should("be.visible")
        .clear()
        .type("{selectall}{backspace}") // Clear existing text
        .type(newName);

      cy.get(loc.renameModal.saveButtonFile).should("be.visible").click();
    });
  }

  /**
   * Deletes an item (folder/file/subfolder)
   * @description Deletes a folder, subfolder, or file using the item's three-dot menu
   * @param {string} itemName - Name of the item to delete
   * @returns {void}
   */
  deleteItem(itemName, file = false) {
    const fileModal = file
      ? loc.deleteConfirmation.fileModal
      : loc.deleteConfirmation.modal;
    this.openItemThreeDotMenu(itemName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.delete).should("be.visible").click();

      cy.get(fileModal).should("be.visible");
      this.confirmDeleteFileBtn(file);
    });
  }

  confirmDeleteFileBtn(file) {
    const confirmBtn = file
      ? loc.deleteConfirmation.confirmButtonFile
      : loc.deleteConfirmation.confirmButton;
    cy.get(confirmBtn).should("be.visible").click();
  }
  /**
   * Moves a document
   * @description Moves a document to a different folder
   * @param {string} documentName - Name of the document to move
   * @param {string} destinationFolder - Name of the destination folder
   * @returns {void}
   */
  moveDocument(documentName, destinationFolder, file = false) {
    this.openItemThreeDotMenu(documentName);
    const movedFile = file ? loc.itemActions.moveFile : loc.itemActions.move;
    this.withinDmsFrame(() => {
      cy.get(movedFile).should("be.visible").click();

      cy.get(loc.moveModal.modalFile).should("be.visible");

      cy.get(loc.moveModal.destinationSelector, { timeout: 10000 })
        .contains(destinationFolder, { timeout: 10000 })
        .scrollIntoView()
        .should("exist")
        .click();

      cy.get(loc.moveModal.moveButton).should("be.visible").click();
    });
  }

  /**
   * Moves a folder
   * @description Moves a folder to a different location
   * @param {string} folderName - Name of the folder to move
   * @param {string} destinationFolder - Name of the destination folder
   * @returns {void}
   */
  moveFolder(folderName, destinationFolder) {
    this.moveDocument(folderName, destinationFolder);
  }

  /**
   * Creates a subfolder
   * @description Creates a subfolder within an existing folder using item's three-dot menu
   * @param {string} parentFolder - Name of the parent folder
   * @param {string} subfolderName - Name for the new subfolder
   * @returns {void}
   */
  createSubfolder(parentFolder, subfolderName) {
    this.openItemThreeDotMenu(parentFolder);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.createSubfolder).should("be.visible").click();

      cy.get(loc.createFolderModal.modal).should("be.visible");

      cy.get(loc.createFolderModal.folderNameInput)
        .should("be.visible")
        .clear()
        .type(subfolderName);

      cy.get(loc.createFolderModal.createButton).should("be.visible").click();
      cy.get(loc.createFolderModal.modal).should("not.be.visible");
    });
  }

  /**
   * Sets expiration date on a file
   * @description Sets an expiration date for a file
   * @param {string} fileName - Name of the file
   * @param {string} expirationDate - Expiration date in YYYY-MM-DD format
   * @returns {void}
   */
  setFileExpiration(fileName, expirationDate) {
    this.openItemThreeDotMenu(fileName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.setExpiration).should("be.visible").click();

      cy.get(loc.expirationModal.modal).should("be.visible");

      cy.get(loc.expirationModal.dateInput)
        .should("be.visible")
        .type(expirationDate);

      cy.get(loc.expirationModal.saveButton).should("be.visible").click();
      cy.get(loc.expirationModal.saveButton).should("be.visible").click();
    });
  }

  /**
   * Tags a file
   * @description Adds tags to a file
   * @param {string} fileName - Name of the file
   * @param {Array} tags - Array of tags to add
   * @returns {void}
   */
  tagFile(fileName, tags) {
    this.openItemThreeDotMenu(fileName);

    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.tag).should("be.visible").click();

      cy.get(loc.tagModal.modal).should("be.visible");

      tags.forEach((tag) => {
        cy.get(loc.tagModal.tagInput)
          .should("be.visible")
          .click()
          .type(tag, { duration: 150, force: true });

        cy.get(loc.tagModal.addTagButton).should("be.visible").click();
      });

      cy.get(loc.tagModal.saveButton).should("be.visible").click();
    });
  }

  /**
   * Validates success message
   * @description Checks for a success notification message
   * @param {string} expectedMessage - Expected success message text
   * @returns {void}
   */
  validateSuccessMessage(expectedMessage) {
    this.withinDmsFrame(() => {
      cy.get(loc.notifications.success, { timeout: 10000 })
        .should("be.visible")
        .and("contain.text", expectedMessage);
    });
  }

  /**
   * Validates item exists
   * @description Verifies that a folder or file exists in the grid
   * @param {string} itemName - Name of the item to verify
   * @returns {void}
   */
  validateItemExists(itemName) {
    this.withinDmsFrame(() => {
      cy.contains(loc.grid.rows, itemName).should("be.visible");
    });
  }

  expandParentFolder(folderName) {
    this.withinDmsFrame(() => {
      cy.contains(folderName).scrollIntoView().dblclick({ delay: 1500 });
    });
  }
  /**
   * Validates item does not exist
   * @description Verifies that a folder or file does not exist in the grid
   * @param {string} itemName - Name of the item to verify
   * @returns {void}
   */
  validateItemDoesNotExist(itemName) {
    this.withinDmsFrame(() => {
      cy.contains(loc.grid.rows, itemName).should("not.exist");
    });
  }

  /**
   * Validates bookmark modal is open
   * @description Verifies that the bookmark modal is displayed
   * @returns {void}
   */
  validateBookmarkModalOpen() {
    this.withinDmsFrame(() => {
      cy.get(loc.bookmarkModal.modal).should("be.visible");
    });
  }

  clickToastMsg() {
    this.withinDmsFrame(() => {
      cy.get(locators.administration.toastMsg, { timeout: 25000 })
        .should("be.visible")
        .click({ multiple: true, force: true });
    });
  }
}
export default MyDocumentsHelpers;
