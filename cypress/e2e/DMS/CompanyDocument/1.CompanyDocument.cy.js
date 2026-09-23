import CompanyDocument from "../../../support/POM/DMS/CompanyDocument/CompanyDocument";
import CompanyDocumentData from "../../../fixtures/DMS/CompanyDocument/CompanyDocument.json";

describe(
  "Company Documents - Document Management System",
  { tags: ["@regression", "@dms", "@company-documents", "@pd45990"] },
  () => {
    const companyDocument = new CompanyDocument();
    const testData = CompanyDocumentData.testData;
    const parentFolderName = testData.parentFolder.name;

    const session = () => {
      const dmsUser = Cypress.env("decisionManagement").dmsUser;
      cy.loginWithSession(
        "login with Document Management User",
        dmsUser.username,
        dmsUser.password,
        dmsUser.key
      );
      cy.visitMyCompanyDocument();
    };

    beforeEach(() => {
      // Login and navigate to Company Documents Page
      session();
      companyDocument.waitForGridLoad();
    });

    context("Folder Operations", () => {
      it(
        "Validate that the user must be able to create a folder via the three-dot button",
        { tags: ["@pd45993", "@smoke"] },
        () => {
          companyDocument.clickThreeEllipses(0);
          companyDocument.createFolder();
          companyDocument.verifyCreatedFolder();
          companyDocument.removeCreatedFolder();
        }
      );

      it(
        "Validate that the user can search for a folder name or document name using the search Bar.",
        { tags: ["@pd45997", "@smoke"] },
        () => {
          companyDocument.searchInGrid(parentFolderName);
          companyDocument.verifyFolderExists(parentFolderName);
        }
      );
    });

    context("Document Operations", () => {
      it(
        "Validate that the user must be able to Tag the uploaded file via the three-dot button",
        { tags: ["@pd45992", "@pd46007"] },
        () => {
          companyDocument.searchInGrid(parentFolderName);
          companyDocument.expandFolder(parentFolderName);
          companyDocument.clickHierarchyThreeEllipses(1, 1);
          companyDocument.addTag(testData.tags.tagName);
          companyDocument.removeTag();
        }
      );

      it(
        "Validate that the user must be able to rename the uploaded file via the three dot-button.",
        { tags: "@pd45994" },
        () => {
          companyDocument.searchInGrid(parentFolderName);
          companyDocument.expandFolder(parentFolderName);
          companyDocument.clickThreeEllipses(1);
          companyDocument.renameDocument();
          companyDocument.verifyRenameDocument();
        }
      );

      it(
        "Validate that the user must be able to access setting of uploaded document via the three-dot button.",
        { tags: "@pd45995" },
        () => {
          companyDocument.searchInGrid(parentFolderName);
          companyDocument.expandFolder(parentFolderName);
          companyDocument.clickThreeEllipses(1);
          companyDocument.accessSettings();
        }
      );

      it(
        "Validate that the user must be able to download the upload file via the three-dot button.",
        { tags: ["@pd45996", "@smoke"] },
        () => {
          companyDocument.searchInGrid(parentFolderName);
          companyDocument.expandFolder(parentFolderName);
          companyDocument.clickThreeEllipses(1);
          companyDocument.downloadFile(
            testData.testScenarios.downloadFilename.prevFileName
          );
        }
      );
      it(
        "Validate that the user must be able to Watchers the uploaded file via the three-dot button.",
        { tags: "@pd45998" },
        () => {
          companyDocument.searchInGrid(parentFolderName);
          companyDocument.expandFolder(parentFolderName);
          companyDocument.clickThreeEllipses(1);
          companyDocument.addWatchers();
          companyDocument.removeWatchers();
        }
      );

      it(
        "Validate that the user must be able to view the upload file via the three-dot button",
        { tags: "@pd45999" },
        () => {
          companyDocument.searchInGrid(parentFolderName);
          companyDocument.expandFolder(parentFolderName);
          companyDocument.viewDocIcon();
        }
      );

      it(
        "Validate that the user must be able to filter workflow status via the three-dot button.",
        { tags: "@pd46001" },
        () => {
          companyDocument.filterWorkflowStatus();
          companyDocument.unfilterWorkflowStatus();
        }
      );

      it(
        "Validate that the user must be able to Pin the uploaded file via the three-dot button.",
        { tags: "@pd46000" },
        () => {
          companyDocument.searchInGrid(parentFolderName);
          companyDocument.expandFolder(parentFolderName);
          companyDocument.pinDoc();
          companyDocument.unsearchInGrid();
          companyDocument.unpinDoc();
        }
      );
    });
  }
);
