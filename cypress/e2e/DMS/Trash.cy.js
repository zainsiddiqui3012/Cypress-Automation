import Trash from "../../support/POM/DMS/Trash";
import TrashHelper from "../../support/POM/DMS/helpers/TrashHelper";
import MyDocumentsPage from "../../support/POM/DMS/MYDocuments/MyDocumentsPage";
import MyDocumentsHelpers from "../../support/POM/DMS/helpers/MyDocumentsHelper";
import myDocumentsData from "../../fixtures/DMS/MyDocuments/MyDocuments.json";
const trash = new Trash();
const trashHelper = new TrashHelper();
const myDocumentsPage = new MyDocumentsPage();
const myDocumentsHelpers = new MyDocumentsHelpers();
const testDocument = "TestTrashDoc"; // Test file that exists in Trash from My Documents
const testDocumentCompany = "TestTrashCompanyDoc"; // Test file that exists in Trash from Company Documents

describe(
  "Trash Test Cases",
  {
    tags: ["@regression", "@dms", "@trash", "@pd46011"],
  },
  () => {
    const session = () => {
      const dmUser1 = Cypress.env("documentManagement").dmUser;
      // Login and navigate to DMS Trash
      cy.loginWithSession(
        "login with Document Management User",
        dmUser1.username,
        dmUser1.password,
        dmUser1.key
      );
      cy.visitTrash();
      trashHelper.switchToTrashIframe();
      trashHelper.waitForTrashGridToLoad(20000);
    };
    beforeEach(() => {
      session();
    });

    it(
      "Verify that the Trash field is displayed in the Document Management module",
      { tags: ["@smoke", "@pd46015"] },
      () => {
        // Step: Navigate to the Document Management module
        // Expected: The Trash field should be visible in the module's menu
        cy.visitProfile();
        trashHelper.clickAndVerifyModuleNav();
        trashHelper.switchToTrashIframe();
        trashHelper.waitForTrashGridToLoad(20000);
        trash.verifyTrashFieldDisplayed();
      }
    );

    it(
      "Verify that clicking on the Trash field opens the Trash page",
      { tags: ["@smoke", "@pd46025"] },
      () => {
        // Expected: The Trash page should open, displaying all deleted documents
        trash.verifyTrashGridColumns();
      }
    );

    it(
      "Verify that the Trash page displays the correct columns",
      { tags: ["@smoke", "@pd46018"] },
      () => {
        // Step: Observe the grid on the Trash page
        // Expected: The following columns should be available: Name, Size, Type, Deleted By, Deleted On, and an Action column
        trash.verifyTrashGridColumns();
      }
    );

    it(
      "Verify that the Select All button is available on the Trash page",
      { tags: ["@smoke", "@pd46017"] },
      () => {
        // Step: Look for the "Select All" button at the top of the grid
        // Expected: The "Select All" button should be visible and available for use
        trash.verifySelectAllButtonAvailable();
      }
    );

    it(
      "Verify that Restore and Delete buttons are available on the Trash page",
      { tags: ["@smoke", "@pd46012"] },
      () => {
        // Step: Look for the "Restore" and "Delete" buttons at the top of the Trash page
        // Expected: Both buttons should be present and enabled for document actions
        trash.verifyRestoreAndDeleteButtonsPresent();
      }
    );

    it(
      "Verify that clicking Select All selects all documents",
      { tags: ["@smoke", "@pd46014"] },
      () => {
        // Step: Click on the "Select All" button
        // Expected: All documents should be selected, and the button text should change to "Deselect All"
        trash.selectAllDocuments();
      }
    );

    it(
      "Verify that clicking Deselect All removes all selections",
      { tags: ["@smoke", "@pd46020"] },
      () => {
        // Step 1: Select all documents first
        trash.selectAllDocuments();

        // Step 2: Click on the "Deselect All" button
        // Expected: All previously selected documents should be deselected
        trash.deselectAllDocuments();
      }
    );

    context("Company Document Trash Cases", () => {
      beforeEach(() => {
        session();
      });
      it(
        "Upload Trash file in Company Documents and delete to verify Delete/Restore functionality from Trash",
        { tags: ["@smoke"] },
        () => {
          // Upload file
          cy.visitCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          myDocumentsHelpers.clickAddButton();
          myDocumentsHelpers.uploadFile(
            myDocumentsData.uploadFilepaths.trashCompanyFilePath
          );
          myDocumentsHelpers.closeUploadModal();

          // Delete file
          myDocumentsPage.testDeleteFile(
            myDocumentsData.files.trashCompanyFile
          );
        }
      );

      it(
        "Verify that deleted documents from Company Documents appear in Trash",
        { tags: ["@smoke", "@pd46019"] },
        () => {
          // Step: Delete a document from the Company Documents section
          // Expected: The document should now be listed in the Trash grid
          trash.verifyDocumentInTrash(testDocumentCompany);
        }
      );

      it(
        "Verify that a document can be restored from the Action column",
        { tags: ["@pd46026"] },
        () => {
          // Step: Click on "Restore" in the Action column of a document in the Trash grid
          trash.restoreDocumentFromActionColumn(testDocumentCompany);

          // Expected: The document should be restored and visible again in Company Documents
          trash.verifyDocumentNotInTrash(testDocumentCompany);
          // Note: Additional verification needed to check if document is back in original location
          cy.visitCompanyDocument();
          myDocumentsPage.ensureItemIsVisible(testDocumentCompany);
          myDocumentsHelpers.openItemThreeDotMenu(testDocumentCompany);
        }
      );

      it("Delete a file from Company Documents so that it appears in Trash Screen", () => {
        cy.visitCompanyDocument();
        // Delete file
        myDocumentsPage.testDeleteFile(myDocumentsData.files.trashCompanyFile);
      });

      it(
        "Verify that a document can be restored from Trash",
        { tags: "@pd46024" },
        () => {
          // Step 1: Select a document from the Trash grid
          // Step 2: Click the "Restore" button
          trashHelper.searchDocument(testDocumentCompany);
          trashHelper.waitForTrashGridToLoad(30000);
          trash.selectAndRestoreDocument(testDocumentCompany);

          // Expected: The document should be restored and reappear in the Company Documents section
          trash.verifyDocumentNotInTrash(testDocumentCompany);
          // Note: Additional verification needed to check if document is back in original location
          cy.visitCompanyDocument();
          myDocumentsPage.ensureItemIsVisible(testDocumentCompany);
          myDocumentsHelpers.openItemThreeDotMenu(testDocumentCompany);
        }
      );

      it(
        "Delete a file from Company Documents so that it appears in Trash Screen",
        { tags: ["@pd45980"] },
        () => {
          cy.visitCompanyDocument();
          // Delete file
          myDocumentsPage.testDeleteFile(
            myDocumentsData.files.trashCompanyFile
          );
        }
      );

      it(
        "Verify that a document can be permanently deleted from Trash",
        { tags: ["@smoke", "@pd46016"] },
        () => {
          // Step 1: Select a document from the Trash grid
          // Step 2: Click the "Delete" button
          trash.selectAndDeleteDocument(testDocumentCompany);

          // Expected: The selected document should be removed from the Trash grid permanently
          trash.verifyDocumentNotInTrash(testDocumentCompany);
        }
      );
    });

    context("My Document Trash Cases", () => {
      beforeEach(() => {
        session();
      });
      it(
        "Upload Trash file in My Documents and delete to verify Delete/Restore functionality from Trash",
        { tags: ["@smoke"] },
        () => {
          // Upload file
          cy.visitMyDocument();
          myDocumentsHelpers.switchToIframe();
          myDocumentsHelpers.clickAddButton();
          myDocumentsHelpers.uploadFile(
            myDocumentsData.uploadFilepaths.trashFilePath
          );
          myDocumentsHelpers.closeUploadModal();

          // Delete file
          myDocumentsPage.testDeleteFile(myDocumentsData.files.trashFile);
        }
      );

      it(
        "Verify that deleted documents from My Documents appear in Trash",
        { tags: ["@pd46013", "@smoke"] },
        () => {
          // Step: Delete a document from My Documents
          // Expected: The deleted document should now be available in the Trash grid
          trash.verifyDocumentInTrash(testDocument);
        }
      );

      it(
        "Verify that restoring a document places it back in its original location",
        { tags: ["@pd46023"] },
        () => {
          // Step: Restore a document from Trash
          trash.restoreDocumentFromActionColumn(testDocument);

          // Expected: The document should reappear in the exact location where it was deleted from
          trash.verifyDocumentNotInTrash(testDocument);
          // Note: Additional verification needed to check if document is back in original location
          cy.visitMyDocument();
          myDocumentsPage.ensureItemIsVisible(testDocument);
          myDocumentsHelpers.openItemThreeDotMenu(testDocument);
        }
      );

      it("Delete a file from My Documents so that it appears in Trash Screen", () => {
        cy.visitMyDocument();
        // Delete file
        myDocumentsPage.testDeleteFile(myDocumentsData.files.trashFile);
      });

      it(
        "Verify that the document preview function works in Trash",
        { tags: ["@pd46022", "@smoke"] },
        () => {
          // Step: Click on the "View" (Eye) icon in the Action column
          trash.viewDocumentFromActionColumn(testDocument);

          // Expected: The document viewer should open, displaying supported file formats (DOC, DOCX, PPT, PPTX, XLSX, CSV, PNG, JPG, PDF)
          trash.verifyDocumentViewerOpens();
        }
      );

      it(
        "Verify that clicking Delete in the Action column permanently removes a document from Trash",
        { tags: ["@pd46021"] },
        () => {
          // Step: Click on "Delete" in the Action column of a document in the Trash grid
          trash.deleteDocumentFromActionColumn(testDocument);

          // Expected: The document should be permanently deleted from Trash and no longer recoverable
          trash.verifyDocumentNotInTrash(testDocument);
        }
      );

      it("Upload Trash file in My Documents and delete to verify Delete functionality from Trash", () => {
        // Upload file
        cy.visitMyDocument();
        myDocumentsHelpers.switchToIframe();
        myDocumentsHelpers.clickAddButton();
        myDocumentsHelpers.uploadFile(
          myDocumentsData.uploadFilepaths.trashFilePath
        );
        myDocumentsHelpers.closeUploadModal();

        // Delete file
        myDocumentsPage.testDeleteFile(myDocumentsData.files.trashFile);
      });

      it(
        "Verify that a document can be permanently deleted from Trash",
        { tags: ["@smoke", "@pd46016"] },
        () => {
          // Step 1: Select a document from the Trash grid
          // Step 2: Click the "Delete" button
          trash.selectAndDeleteDocument(testDocument);

          // Expected: The selected document should be removed from the Trash grid permanently
          trash.verifyDocumentNotInTrash(testDocument);
        }
      );
    });
  }
);
