import ExportDocument from "../../support/POM/DMS/ExportDocument";
import ExportDocumentHelper from "../../support/POM/DMS/helpers/ExportDocumentHelper";
import MyDocumentsHelpers from "../../support/POM/DMS/helpers/MyDocumentsHelper";
import MyDocumentsPage from "../../support/POM/DMS/MYDocuments/MyDocumentsPage";
import data from "../../fixtures/DMS/ExportDocument.json";
import dayjs from "dayjs";

const exportDocument = new ExportDocument();
const exportDocumentHelper = new ExportDocumentHelper();
const myDocumentsHelpers = new MyDocumentsHelpers();
const myDocumentsPage = new MyDocumentsPage();

describe(
  "Export Document Test Suite",
  {
    tags: [
      "@regression",
      "@dms",
      "@export-document",
      "@company-documents",
      "@pd46116",
    ],
  },
  () => {
    const dmUser1 = Cypress.env("kxi").customer.withRM4;
    const testDoc = data.testDocuments.kriTemplate;
    const session = () => {
      cy.loginWithSession(
        "login with Document Management User",
        dmUser1.username,
        dmUser1.password,
        dmUser1.key
      );
      cy.visitMyCompanyDocument();
    };

    context(
      "Export Document Operations",
      {
        tags: "@export-operations",
      },
      () => {
        beforeEach(() => {
          session();
          myDocumentsHelpers.switchToIframe();
          exportDocumentHelper.waitForGridToLoad();
        });

        it(
          "Verify that the Export button is available on the Company Documents page",
          {
            tags: ["@smoke", "@export-button", "@pd46139"],
          },
          () => {
            // Verify Export button is visible
            exportDocument.testExportButtonPresence();
          }
        );

        it(
          "Ensure that the user can delete a folder, subfolder and files using the three-dot button.",
          { tags: ["@pd45985", "@smoke"] },
          () => {
            myDocumentsPage.ensureItemIsVisible(testDoc.name);
            myDocumentsHelpers.deleteItem(testDoc.name, true);
            cy.visitMyCompanyDocument();
            myDocumentsHelpers.switchToIframe();
            myDocumentsHelpers.validateItemDoesNotExist(testDoc.name);
          }
        );

        it(
          "Ensure that Document File is Uploaded in Company Document Screen.",
          { tags: "@smoke" },
          () => {
            myDocumentsHelpers.clickAddButton();
            myDocumentsHelpers.uploadFile(testDoc.path);
            myDocumentsHelpers.closeUploadModal();
            myDocumentsPage.ensureItemIsVisible(testDoc.name);
          }
        );

        it(
          "Should export a single document successfully",
          {
            tags: ["@smoke", "@export-single", "@pd46138"],
          },
          () => {
            // Export single document
            exportDocument.testExportSingleDocument(dmUser1.key, testDoc.name);
          }
        );

        it(
          "Should export a folder with all its contents",
          {
            tags: ["@smoke", "@export-folder", "@pd46138"],
          },
          () => {
            const testFolder = data.testFolders.qaFolder;

            // Export folder with contents
            exportDocument.testExportFolder(dmUser1.key, testFolder.name);
          }
        );

        it(
          "Should export multiple documents at once",
          {
            tags: ["@export-multiple", "@pd46138"],
          },
          () => {
            const documentsToExport = [
              data.testDocuments.testPdf.name,
              data.testDocuments.testText.name,
            ];

            // Export multiple documents
            exportDocumentHelper.searchDocument("Test_Automation_");
            exportDocument.testExportMultipleDocuments(
              dmUser1.key,
              documentsToExport
            );
          }
        );

        it(
          "Should export documents with Approved status",
          {
            tags: ["@export-status", "@pd46138"],
          },
          () => {
            // Export document with specific status
            exportDocument.testExportDocumentWithStatus(
              dmUser1.key,
              testDoc.name,
              testDoc.status
            );
          }
        );

        it(
          "Should verify export functionality for different document types",
          {
            tags: ["@export-types", "@pd46138"],
          },
          () => {
            const docsToTest = [
              data.testDocuments.testPdf,
              data.testDocuments.kriTemplate,
            ];

            docsToTest.forEach((doc) => {
              exportDocumentHelper.searchDocument(doc.name);
              exportDocumentHelper.verifyDocumentExists(doc.name);
              exportDocumentHelper.selectDocument(doc.name);
              exportDocumentHelper.clickExportButton();
              exportDocumentHelper.verifyExportSuccess(dmUser1.key);
            });
          }
        );

        it(
          "Should verify export button is functional after document selection",
          {
            tags: ["@export-button-state", "@pd46138"],
          },
          () => {
            // Verify export button is present
            exportDocumentHelper.verifyExportButtonVisible();

            // Search and select a document
            exportDocumentHelper.searchDocument(
              data.testDocuments.testText.name
            );
            exportDocumentHelper.selectDocument(
              data.testDocuments.testText.name
            );

            // Verify export button is still visible and clickable
            exportDocumentHelper.verifyExportButtonVisible();
            exportDocumentHelper.clickExportButton();
            exportDocumentHelper.verifyExportSuccess(dmUser1.key);
          }
        );

        it(
          "Should handle export of nested folder contents",
          {
            tags: ["@export-nested", "@pd46140", "@pd46142", "@pd46143"],
          },
          () => {
            const parentFolder = data.testFolders.automationFolder;

            // Search for parent folder
            exportDocumentHelper.searchDocument(parentFolder.name);
            exportDocumentHelper.verifyDocumentExists(parentFolder.name);

            // Select and export the folder
            exportDocumentHelper.selectFolder(parentFolder.name);
            exportDocumentHelper.clickExportButton();
            exportDocumentHelper.verifyExportSuccess(dmUser1.key);
          }
        );
      }
    );
  }
);
