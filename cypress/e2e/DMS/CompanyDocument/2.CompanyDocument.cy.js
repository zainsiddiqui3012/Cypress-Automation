import CompanyDocument from "../../../support/POM/DMS/CompanyDocument/CompanyDocument";
import CompanyDocumentData from "../../../fixtures/DMS/CompanyDocument/CompanyDocument.json";

describe(
  "Company Documents - Document Management System",
  { tags: ["@regression", "@dms", "@company-documents", "@pd45990"] },
  () => {
    const rootFolderFilePath = "cypress/attachment/";
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
      companyDocument.searchInGrid(parentFolderName);
    });
    context("File/Document Operations", () => {
      it(
        "Validate that the user must be seen to bookmark file via the three-dot button.",
        { tags: ["@pd46002", "@pd46010"] },
        () => {
          companyDocument.expandFolder(parentFolderName);
          companyDocument.bookmarkFile();
          companyDocument.unbookmarkFile();
        }
      );

      it(
        "Validate that the user must be able to view version history the uploaded file via the three-dot button.",
        { tags: "@pd46004" },
        () => {
          companyDocument.expandFolder(parentFolderName);
          companyDocument.viewVersionHistory();
        }
      );

      // blocker: https://360factors.atlassian.net/browse/PD-49651
      it.skip(
        "Validate that the user must be able to set expiration on uploaded file via the three-dot button",
        { tags: "@pd46005" },
        () => {
          companyDocument.expandFolder(parentFolderName);
          companyDocument.setExpiration();
        }
      );

      it(
        "Validate that the user must be able to Document move of uploaded file via the three-dot button.",
        { tags: "@pd46006" },
        () => {
          companyDocument.expandFolder(parentFolderName);
          companyDocument.moveDocument();
          companyDocument.verifyDocument();
          companyDocument.moveDocumentAgain();
        }
      );

      it(
        "Verify that the user clicks the 'Add' Button and must be able to add document without applying workflows.",
        { tags: ["@pd46008", "@smoke"] },
        () => {
          companyDocument.openAddBtn();
          companyDocument.uploadFile(
            `${rootFolderFilePath}${testData.files.imagesFile}`
          );
        }
      );

      it(
        "Validate that the user must be able to delete the uploaded file via the three-dot button.",
        { tags: ["@pd46009", "@smoke"] },
        () => {
          cy.reload();
          companyDocument.searchInGrid(testData.files.images);
          companyDocument.removeCreatedFile();
        }
      );

      it(
        "Verify that the user clicks the 'Add' button and the 'Apply Workflow' checkbox works as expected, ensuring workflow options appear and the workflow initiates correctly during the document upload process.",
        { tags: "@pd46003" },
        () => {
          companyDocument.openAddBtn();
          companyDocument.fileUpload(
            `${rootFolderFilePath}${testData.files.imagesFile}`
          );
          companyDocument.clickWorkFlow();
          companyDocument.verifyFileUploaded();
          companyDocument.searchInGrid(testData.files.images);
          companyDocument.removeCreatedFile();
        }
      );
    });
  }
);
