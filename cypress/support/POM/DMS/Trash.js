import TrashHelper from "../../../support/POM/DMS/helpers/TrashHelper";

const trashHelper = new TrashHelper();

class Trash {
  /**
   * Navigate to Trash section and verify grid is loaded
   */
  navigateToTrash() {
    trashHelper.switchToTrashIframe();
    trashHelper.verifyTrashGridDisplayed();
  }

  /**
   * Click on Trash field to open Trash page
   */
  clickTrashField() {
    trashHelper.clickTrashField();
  }

  /**
   * Verify Trash field is displayed in Document Management module
   */
  verifyTrashFieldDisplayed() {
    trashHelper.verifyTrashFieldVisible();
  }

  /**
   * Verify Trash grid columns with Action column
   */
  verifyTrashGridColumns() {
    trashHelper.verifyTrashGridColumns();
  }

  /**
   * Restore document from Action column
   * @param {string} documentName
   */
  restoreDocumentFromActionColumn(documentName) {
    this.verifyDocumentInTrash(documentName);
    trashHelper.clickRestoreDocumentAction(documentName);
    trashHelper.clickRestoreConfirmBtn();
  }

  /**
   * View document using Eye icon in Action column
   * @param {string} documentName
   */
  viewDocumentFromActionColumn(documentName) {
    trashHelper.searchDocument(documentName);
    trashHelper.waitForTrashGridToLoad(30000);
    trashHelper.clickViewDocument(documentName);
  }

  /**
   * Delete document permanently from Action column
   * @param {string} documentName
   */
  deleteDocumentFromActionColumn(documentName) {
    this.verifyDocumentInTrash(documentName);
    trashHelper.clickDeleteDocumentAction(documentName);
    trashHelper.clickDeleteConfirmBtn();
  }

  /**
   * Select all documents and verify
   */
  selectAllDocuments() {
    trashHelper.clickSelectAll();
    trashHelper.verifyAllDocumentsSelected();
    trashHelper.verifyUnselectAllButtonDisplayed();
  }

  /**
   * Deselect all documents and verify
   */
  deselectAllDocuments() {
    trashHelper.clickUnselectAll();
    trashHelper.verifyAllDocumentsDeselected();
    trashHelper.verifySelectAllButtonDisplayed();
  }

  /**
   * Verify Select All button is available
   */
  verifySelectAllButtonAvailable() {
    trashHelper.verifySelectAllButtonVisible();
  }

  /**
   * Verify Restore and Delete buttons are present
   */
  verifyRestoreAndDeleteButtonsPresent() {
    trashHelper.verifyRestoreAndDeleteButtonsPresent();
  }

  /**
   * Verify document is in Trash
   * @param {string} documentName
   */
  verifyDocumentInTrash(documentName) {
    trashHelper.searchDocument(documentName);
    trashHelper.waitForTrashGridToLoad(30000);
    trashHelper.verifyDocumentPresentInTrash(documentName);
  }

  /**
   * Verify document is not in Trash (permanently deleted or restored)
   * @param {string} documentName
   */
  verifyDocumentNotInTrash(documentName) {
    cy.reload();
    trashHelper.switchToTrashIframe();
    trashHelper.waitForTrashGridToLoad(30000);
    trashHelper.searchDocument(documentName);
    trashHelper.verifyDocumentNotPresentInTrash(documentName);
  }

  /**
   * Select a document and restore using bulk Restore button
   * @param {string} documentName
   */
  selectAndRestoreDocument(documentName) {
    trashHelper.selectDocument(documentName);
    trashHelper.clickRestoreButton();
    trashHelper.clickRestoreConfirmBtn();
  }

  /**
   * Select a document and delete using bulk Delete button
   * @param {string} documentName
   */
  selectAndDeleteDocument(documentName) {
    this.verifyDocumentInTrash(documentName);
    trashHelper.selectDocument(documentName);
    trashHelper.clickDeleteButton();
    trashHelper.clickDeleteConfirmBtn();
  }

  /**
   * Verify document viewer opens
   */
  verifyDocumentViewerOpens() {
    trashHelper.verifyDocumentViewerOpens();
  }
}

export default Trash;
