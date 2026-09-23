import CompanyDocuments from "../../../support/POM/DMS/CompanyDocument/EditCompanyDocuments.js";
import MyDocumentsPage from "../../../support/POM/DMS/MYDocuments/MyDocumentsPage.js";
import "cypress-file-upload";
import MyDocumentsHelpers from "../../../support/POM/DMS/helpers/MyDocumentsHelper.js";
const helpers = new MyDocumentsHelpers();
const myDocumentsPage = new MyDocumentsPage();

describe(
  "Company Documents - Customer Space",
  {
    tags: [
      "@pd46028",
      "@dms",
      "@company-documents",
      "@customer",
      "@regression",
    ],
  },
  () => {
    const companyDocuments = new CompanyDocuments();
    const dataFilePath =
      "cypress/fixtures/DMS/CompanyDocument/EditCompanyDocuments.json";
    let data;
    const user = Cypress.env("kxi").customer.withRM4;
    before(() => {
      cy.readFile(dataFilePath).then((testData) => {
        data = testData;
      });
    });

    context("click Checkbox and create Folders", () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login with ${user.username}`,
          user.username,
          user.password,
          user.key
        );
        cy.visitMyCompanyDocument();
        helpers.switchToIframe();
      });

      it(
        "Verify that a checkbox is added in the folder creation Flyer to tag a folder as containing 'Policies & Procedures'",
        { tags: ["@pd46031", "@pd46032", "@smoke"] },
        () => {
          companyDocuments.openNewFolderFlyer();
          companyDocuments.validateCheckbox();
        }
      );

      it(
        "Check the checkbox and create the folder",
        { tags: ["@pd46033", "@smoke"] },
        () => {
          companyDocuments.writeDataInFile({
            filePath: dataFilePath,
            type: data.folder,
            types: data.types,
          });
          cy.readFile(dataFilePath).then((data) => {
            companyDocuments.openNewFolderFlyer();
            companyDocuments.clickCheckbox();
            companyDocuments.createFolder(data.folderName);
            helpers.clickToastMsg();
            companyDocuments.searchDocument(data.folderName);
            companyDocuments.validateFolder(data.folderName);
          });
        }
      );
    });

    context("delete previous uploaded File and Re-upload again", () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login with ${user.username}`,
          user.username,
          user.password,
          user.key
        );
        cy.visitMyCompanyDocument();
        cy.waitForTopMsgLoaderToDisappear(100000);
        helpers.switchToIframe();
      });

      it(
        "Ensure that the user can delete a folder, subfolder and files using the three-dot button.",
        { tags: ["@pd45985", "@smoke"] },
        () => {
          myDocumentsPage.ensureItemIsVisible(data.documentName);
          helpers.deleteItem(data.documentName, true);
          cy.visitMyCompanyDocument();
          helpers.switchToIframe();
          helpers.validateItemDoesNotExist(data.documentName);
        }
      );

      it(
        "Ensure that Document File is Uploaded in Company Document Screen.",
        { tags: "@smoke" },
        () => {
          helpers.clickAddButton();
          helpers.uploadFile(`cypress/attachment/${data.documentName}.xlsx`);
          helpers.closeUploadModal();
          myDocumentsPage.ensureItemIsVisible(data.documentName);
        }
      );
    });

    context("Initiate workflow and Approved Basic Workflow", () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login with ${user.username}`,
          user.username,
          user.password,
          user.key
        );
        cy.visitMyCompanyDocument();
        cy.waitForTopMsgLoaderToDisappear(100000);
        helpers.switchToIframe();
      });

      it(
        "Verify that the approval flyer contains the required fields",
        { tags: ["@pd46035", "@smoke"] },
        () => {
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.clickEllipses();
          companyDocuments.clickDropdownOption(data.initiateWorkflow);
          companyDocuments.validateFlyerOptions();
        }
      );

      it(
        "Verify that all users are listed in the 'Assign To' field in the approval flyer",
        { tags: ["@pd46037", "@smoke"] },
        () => {
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.clickEllipses();
          companyDocuments.clickDropdownOption(data.initiateWorkflow);
          companyDocuments.validateAllUsersShown();
        }
      );

      it(
        "Verify that an approved edited document is visible and marked as 'Current Version' in version history",
        { tags: ["@pd46030", "@smoke"] },
        () => {
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.clickEllipses();
          companyDocuments.clickDropdownOption(data.versionHistory);
          companyDocuments.verifyCurrentVersion();
        }
      );

      it(
        "Verify that the approval request appears in the 'Assigned to Me' page for the assigned user",
        { tags: ["@pd46029", "@smoke"] },
        () => {
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.clickEllipses();
          companyDocuments.clickDropdownOption(data.initiateWorkflow);
          // companyDocuments.initiateWorkflow();
          companyDocuments.assignToUser();
          cy.visitAssignedToMe();
          helpers.switchToIframe();
          companyDocuments.verifyAssignedDocument(data.documentName);
        }
      );

      it(
        "Verify that approving a document updates its status to 'Approved'",
        { tags: ["@pd46050", "@smoke"] },
        () => {
          cy.visitAssignedToMe();
          helpers.switchToIframe();
          companyDocuments.clickEllipses(0);
          companyDocuments.approve();

          cy.visitMyCompanyDocument();
          helpers.switchToIframe();
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.validateDocumentApproved();
        }
      );
    });

    context("Clone Documents - Create New and Create New with Approval", () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login with ${user.username}`,
          user.username,
          user.password,
          user.key
        );
        cy.visitMyCompanyDocument();
        cy.waitForTopMsgLoaderToDisappear(100000);
        helpers.switchToIframe();
      });

      it(
        "Verify that clicking 'Create New' clones the document and publishes it as 'Approved'",
        { tags: ["@pd46034"] },
        () => {
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          // Prevent file dialog
          cy.window().then((win) => {
            cy.stub(win, "open").returns(null);
          });
          companyDocuments.createNew();
          companyDocuments.closeModal();
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.clickEllipses();
          companyDocuments.clickDropdownOption(data.versionHistory);
          companyDocuments.verifyCurrentVersionAndStatus(data.approved);
        }
      );

      it(
        "Verify that clicking 'Create New with Approval' clones the document and publishes it as 'Draft'",
        { tags: ["@pd46040"] },
        () => {
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.unlockDocument();
          helpers.clickToastMsg();
          // Prevent file dialog
          cy.window().then((win) => {
            cy.stub(win, data.open).returns(null);
          });
          companyDocuments.createNewWithApproval();
          companyDocuments.closeModal();
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.clickEllipses();
          companyDocuments.clickDropdownOption(data.versionHistory);
          companyDocuments.verifyCurrentVersionAndStatus2(data.draft);
        }
      );

      it(
        "Verify that unavailable actions are not shown for 'Draft' documents",
        { tags: ["@pd46038"] },
        () => {
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.unlockDocument();
          helpers.clickToastMsg();
          companyDocuments.clickEllipses();
          companyDocuments.validateOptionNotPresent();
        }
      );
    });

    context("Send for Approval, Approved and Reject Flow", () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login with ${user.username}`,
          user.username,
          user.password,
          user.key
        );
        cy.visitMyCompanyDocument();
        cy.waitForTopMsgLoaderToDisappear(100000);
        helpers.switchToIframe();
      });

      it(
        "Verify that the 'Send for Approval' button is available for documents in 'Draft' status",
        { tags: ["@pd46045"] },
        () => {
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.clickEllipses();
          companyDocuments.validateSendForApproval();
        }
      );

      it(
        "Verify that 'Send For Approval' is available after creating draft document",
        { tags: ["@pd46041"] },
        () => {
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.clickEllipses();
          companyDocuments.clickDropdownOption(data.sendForApproval);
          companyDocuments.verifyApprovalFlyer();
        }
      );

      it(
        "Verify that after assigning a user and clicking 'Apply,' the approval request is sent",
        { tags: ["@pd46046"] },
        () => {
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.clickEllipses();
          companyDocuments.clickDropdownOption(data.sendForApproval);
          companyDocuments.verifyApprovalFlyer();
          companyDocuments.assignToUser(true);
          helpers.switchToIframe();
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocument(data.documentName);
          companyDocuments.validateStatus(data.inReview);
        }
      );

      it(
        "Verify that approving a document updates its status to 'Approved'",
        { tags: ["@pd46050"] },
        () => {
          cy.visitAssignedToMe();
          helpers.switchToIframe();
          companyDocuments.clickEllipses(0);
          companyDocuments.approve();

          cy.visitMyCompanyDocument();
          helpers.switchToIframe();
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.validateDocumentApproved();
        }
      );

      it(
        "Verify that rejecting an approval request updates the document status to 'Rejected'",
        { tags: ["@pd46039"] },
        () => {
          companyDocuments.searchDocument(data.documentName);
          companyDocuments.clickEllipses();
          companyDocuments.clickDropdownOption(data.initiateWorkflow);
          companyDocuments.assignToUser();

          cy.visitAssignedToMe();
          helpers.switchToIframe();
          companyDocuments.clickEllipses(0);
          companyDocuments.reject();
        }
      );
    });
  }
);
