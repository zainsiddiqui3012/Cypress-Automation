import MyDocumentsHelpers from "../helpers/MyDocumentsHelper";
import data from "../../../../fixtures/DMS/MyDocuments/MyDocuments.json";
const helpers = new MyDocumentsHelpers();
class MyDocumentsPage {
  /**
   * Test: Bookmark a folder
   * @description Bookmarks an existing folder using three-dot menu
   * @param {string} folderName - Name of the folder to bookmark
   * @returns {void}
   */
  testBookmarkFolder(folderName) {
    helpers.bookmarkFolder(folderName);
    helpers.verifyBookMarkFolder(folderName);
  }

  /**
   * Test: Pin a file
   * @description Pins an uploaded file using three-dot menu
   * @param {string} fileName - Name of the file to pin
   * @returns {void}
   */
  testPinFile(fileName) {
    this.ensureItemIsVisible(fileName);
    helpers.pinFile(fileName);
    helpers.validateSuccessMessage(data.toastMsgs.docPin);
  }

  /**
   * Test: UnPin a file
   * @description UnPins an uploaded file using three-dot menu
   * @param {string} fileName - Name of the file to unpin
   * @returns {void}
   */
  testUnpinFile(fileName) {
    this.ensureItemIsVisible(fileName);
    helpers.unpinFile(fileName);
    helpers.validateSuccessMessage(data.toastMsgs.docUnpin);
  }

  /**
   * Test: Rename a folder
   * @description Renames a folder using three-dot menu
   * @param {string} oldName - Current folder name
   * @param {string} newName - New folder name
   * @returns {void}
   */
  testRenameFolder(oldName, newName) {
    helpers.renameFolder(oldName, newName);
    cy.reload(true);
    helpers.switchToIframe();
    helpers.gridFullyLoaded();
    helpers.scrollGridToBottom(newName);
    helpers.validateItemExists(newName);
    helpers.validateItemDoesNotExist(oldName);
  }

  /**
   * Test: Delete folder, subfolder, and files
   * @description Deletes a folder/subfolder/file using three-dot menu
   * @param {string} itemName - Name of the item to delete
   * @returns {void}
   */
  testDeleteItem(itemName, file = false) {
    helpers.deleteItem(itemName, file);
    cy.visitMyDocument();
    helpers.switchToIframe();
    helpers.validateItemDoesNotExist(itemName);
  }

  /**
   * Test: Move a document
   * @description Moves a document to a different folder
   * @param {string} documentName - Name of the document
   * @param {string} destinationFolder - Destination folder name
   * @param {string} expandFolder - Folder to expand before moving
   * @returns {void}
   */
  testMoveDocument(documentName, destinationFolder, expandFolder) {
    helpers.clickUploadFileBtn();
    helpers.uploadFile(`cypress/attachment/${documentName}.txt`);
    helpers.closeUploadModal();
    helpers.validateSuccessMessage(data.toastMsgs.fileUploaded);
    helpers.expandParentFolder(expandFolder);
    helpers.moveDocument(documentName, destinationFolder, true);
    helpers.validateSuccessMessage(data.toastMsgs.docMove);
  }

  /**
   * Test: Create a subfolder
   * @description Creates a subfolder within an existing folder
   * @param {string} parentFolder - Parent folder name
   * @param {string} subfolderName - New subfolder name
   * @returns {void}
   */
  testCreateSubfolder(parentFolder, subfolderName) {
    helpers.createSubfolder(parentFolder, subfolderName);
    cy.reload(true);
    helpers.switchToIframe();
    helpers.gridFullyLoaded();
    helpers.scrollGridToBottom(parentFolder);
    helpers.expandParentFolder(parentFolder);
    helpers.validateItemExists(subfolderName);
  }

  /**
   * Test: Delete uploaded file
   * @description Deletes an uploaded file using three-dot menu
   * @param {string} fileName - Name of the file to delete
   * @returns {void}
   */
  testDeleteFile(fileName) {
    this.ensureItemIsVisible(fileName);
    this.testDeleteItem(fileName, true);
  }

  /**
   * Test: Rename uploaded file
   * @description Renames an uploaded file using three-dot menu
   * @param {string} oldName - Current file name
   * @param {string} newName - New file name
   * @returns {void}
   */
  testRenameFile(oldName, newName) {
    this.ensureItemIsVisible(oldName);
    helpers.renameFile(oldName, newName);
    helpers.validateItemExists(newName);
    helpers.validateItemDoesNotExist(oldName);
  }

  /**
   * Test: Upload files when creating a folder
   * @description Uploads files to a newly created folder
   * @param {string} folderName - Name of the new folder
   * @param {Array} filePaths - Array of file paths to upload
   * @returns {void}
   */
  testUploadFilesInNewFolder(folderName, filePaths, fileNames) {
    helpers.switchToIframe();
    this.testCreateFolder(folderName);
    helpers.clickUploadFileBtn();
    helpers.uploadMultipleFiles(filePaths);
    helpers.closeUploadModal();
    helpers.validateSuccessMessage(data.toastMsgs.fileUploaded);
    helpers.expandParentFolder(folderName);
    helpers.validateItemExists(fileNames[0]);
    helpers.validateItemExists(fileNames[1]);
  }

  /**
   * Test: Set expiration on uploaded file
   * @description Sets an expiration date on a file
   * @param {string} fileName - Name of the file
   * @param {string} expirationDate - Expiration date
   * @returns {void}
   */
  testSetFileExpiration(fileName, expirationDate) {
    this.ensureItemIsVisible(fileName);
    helpers.setFileExpiration(fileName, expirationDate);
    helpers.validateSuccessMessage(data.toastMsgs.expirationSet);
  }

  /**
   * Test: Bookmark uploaded file
   * @description Bookmarks an uploaded file using three-dot menu
   * @param {string} fileName - Name of the file to bookmark
   * @returns {void}
   */
  testBookmarkFile(fileName) {
    this.ensureItemIsVisible(fileName);
    helpers.bookmarkFolder(fileName);
    helpers.verifyBookMarkFolder(fileName);
  }

  /**
   * Test: unBookmark uploaded file
   * @description unBookmarks an uploaded file using three-dot menu
   * @param {string} fileName - Name of the file to unbookmark
   * @returns {void}
   */
  testUnBookmarkFile(fileName) {
    this.ensureItemIsVisible(fileName);
    helpers.unBookmarkFolder(fileName);
    helpers.verifyUnBookMarkFolder(fileName);
  }

  /**
   * Test: Tag uploaded file
   * @description Adds tags to an uploaded file
   * @param {string} fileName - Name of the file
   * @param {string} tagFile - File to upload and tag
   * @param {Array} tags - Array of tags to add
   * @returns {void}
   */
  testTagFile(fileName, tagFile, tags) {
    helpers.clickUploadFileBtn();
    helpers.uploadFile(`cypress/attachment/${tagFile}.txt`);
    helpers.closeUploadModal();
    helpers.validateSuccessMessage(data.toastMsgs.fileUploaded);
    helpers.expandParentFolder(fileName);
    helpers.tagFile(fileName, tags);
  }

  /**
   * Test: Create folder via three-dot button
   * @description Creates a new folder using three-dot menu
   * @param {string} folderName - Name for the new folder
   * @returns {void}
   */
  testCreateFolder(folderName) {
    helpers.switchToIframe();
    helpers.gridFullyLoaded();
    helpers.createFolderViaThreeEllipses(folderName);
    helpers.gridFullyLoaded();
    helpers.scrollGridToBottom(folderName);
    helpers.validateItemExists(folderName);
  }

  /**
   * Test: Move folder
   * @description Moves a folder to a different location
   * @param {string} folderName - Name of the folder to move
   * @param {string} destinationFolder - Destination folder name
   * @returns {void}
   */
  testMoveFolder(folderName, destinationFolder) {
    helpers.moveFolder(folderName, destinationFolder);
    helpers.validateSuccessMessage(data.toastMsgs.folderMoved);
  }

  /**
   * Helper: Ensure item is visible in grid
   * @description Switches to iframe, waits for grid to load, and scrolls to item
   * @param {string} itemName - Name of the item to make visible
   * @returns {void}
   */
  ensureItemIsVisible(itemName) {
    helpers.switchToIframe();
    helpers.gridFullyLoaded();
    helpers.scrollGridToBottom(itemName);
  }
}

export default MyDocumentsPage;
