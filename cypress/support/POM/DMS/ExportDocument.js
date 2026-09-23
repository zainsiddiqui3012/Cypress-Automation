import ExportDocumentHelper from "./helpers/ExportDocumentHelper";

const exportDocumentHelper = new ExportDocumentHelper();

class ExportDocument {
  /**
   * Test: Delete and re-upload a document
   * @description Deletes a document, verifies it's gone, then re-uploads it
   * @param {string} documentName - Name of the document to delete and re-upload
   * @param {string} filePath - Path to the file for re-upload
   * @returns {void}
   */
  testDeleteAndReuploadDocument(documentName, filePath) {
    // Search for the document
    exportDocumentHelper.searchDocument(documentName);

    // Verify document exists before deletion
    exportDocumentHelper.verifyDocumentExists(documentName);

    // Delete the document
    exportDocumentHelper.deleteDocument(documentName);

    exportDocumentHelper.verifyDocumentDoesNotExist(documentName);

    // Re-upload the document
    exportDocumentHelper.uploadFile(filePath);

    // Verify document is re-uploaded
    exportDocumentHelper.searchDocument(documentName);
    exportDocumentHelper.verifyDocumentExists(documentName);
  }

  /**
   * Test: Verify Export button is present
   * @description Checks that the Export button is visible on the page
   * @returns {void}
   */
  testExportButtonPresence() {
    exportDocumentHelper.verifyExportButtonVisible();
  }

  /**
   * Test: Export a single document
   * @description Selects a single document and exports it
   * @param {string} documentName - Name of the document to export
   * @returns {void}
   */
  testExportSingleDocument(filePartialName, documentName) {
    // Search for the document
    exportDocumentHelper.searchDocument(documentName);

    // Verify document exists
    exportDocumentHelper.verifyDocumentExists(documentName);

    // Select the document
    exportDocumentHelper.selectDocument(documentName);

    // Click Export button
    exportDocumentHelper.clickExportButton();

    // Verify export was initiated
    exportDocumentHelper.verifyExportSuccess(
        filePartialName
    );
  }

  /**
   * Test: Export a folder with contents
   * @description Selects a folder and exports it with all its contents
   * @param {string} folderName - Name of the folder to export
   * @returns {void}
   */
  testExportFolder(filePartialName,folderName) {
    // Search for the folder
    exportDocumentHelper.searchDocument(folderName);

    // Verify folder exists
    exportDocumentHelper.verifyDocumentExists(folderName);

    // Select the folder
    exportDocumentHelper.selectFolder(folderName);

    // Click Export button
    exportDocumentHelper.clickExportButton();

    // Verify export was initiated
    exportDocumentHelper.verifyExportSuccess(filePartialName);
  }

  /**
   * Test: Export multiple documents
   * @description Selects multiple documents and exports them
   * @param {Array<string>} documentNames - Array of document names to export
   * @returns {void}
   */
  testExportMultipleDocuments(filePartialName, documentNames) {
    // Select all documents
    exportDocumentHelper.selectMultipleItems(documentNames);

    // Click Export button
    exportDocumentHelper.clickExportButton();

    // Verify export was initiated
    exportDocumentHelper.verifyExportSuccess(filePartialName);
  }

  /**
   * Test: Export documents with different statuses
   * @description Verifies that documents with different statuses can be exported
   * @param {string} documentName - Name of the document
   * @param {string} expectedStatus - Expected status of the document
   * @returns {void}
   */
  testExportDocumentWithStatus(filePartialName, documentName, expectedStatus) {
    // Search for the document
    exportDocumentHelper.searchDocument(documentName);

    // Verify document exists and has the correct status
    exportDocumentHelper.verifyDocumentExists(documentName);
    exportDocumentHelper.verifyDocumentStatus(documentName, expectedStatus);

    // Select the document
    exportDocumentHelper.selectDocument(documentName);

    // Click Export button
    exportDocumentHelper.clickExportButton();

    // Verify export was initiated
    exportDocumentHelper.verifyExportSuccess(filePartialName);
  }
}

export default ExportDocument;