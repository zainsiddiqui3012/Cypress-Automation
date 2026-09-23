import CompanyDocuments from "../../../support/POM/DMS/CompanyDocument/CompanyDocument";
import MyDocumentsHelpers from "../../../support/POM/DMS/helpers/MyDocumentsHelper";
import data from "../../../fixtures/DMS/CompanyDocument/CompanyDocument.json";

import dayjs from "dayjs";
import locators from "../../../fixtures/locators.json";
const companyDocumentsPage = new CompanyDocuments();
const myDocumentsHelpers = new MyDocumentsHelpers();
const loc = locators.myDocuments;

describe(
  "Initiate Workflow Test Suite",
  {
    tags: ["@regression", "@dms", "@company-documents", "@pd46076"],
  },
  () => {
    const rootFolderFilePath = "cypress/attachment/";
    let timestamp = dayjs().format("YYYY_MM_DD_HH_mm_ss_SSS");

    let random = Math.random().toString(36).substring(2, 8);
    let renamedFile = `aRenamedFile_${timestamp}_${random}`;
    const dmUser1 = Cypress.env("decisionManagement").dmsUser;
    const session = () => {
      cy.loginWithSession(
        "login with Document Management User",
        dmUser1.username,
        dmUser1.password,
        dmUser1.key
      );
      cy.visitMyCompanyDocument();
    };

    context("Workflow Initiation", { tags: "@workflow-initiation" }, () => {
      beforeEach(() => {
        session();
        myDocumentsHelpers.switchToIframe();
      });

      it(
        'Verify that when the assigned user rejects the approval, the document status changes to "Rejected" and is reassigned to the workflow initiator',
        { tags: ["@pd46077", "@pd46093"] },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            data.testData.threeDotMenuOptions.view,
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.imagePreview
          );

        
          cy.visitAssignToMe();
          companyDocumentsPage.searchInTrash("PNG", 2);
          companyDocumentsPage.clickActionsDropdown();
          companyDocumentsPage.selectTakeActionOption(
            data.testData.initiateWorkflow.reject
          );
          companyDocumentsPage.enterMessage(
            data.testData.initiateWorkflow.message
          );
          companyDocumentsPage.clickSaveButton();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.verifyStatus(data.testData.statuses.rejected);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        'Verify that validation messages appear if mandatory fields are missing for "Approval" workflow',
        { tags: ["@pd46079", "@pd46058", "@smoke"] },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user,
            true
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`,
            true
          );
        }
      );

      it(
        'Verify that initiating "Acknowledgment" workflow updates document status to "Waiting for Acknowledgment"',
        { tags: ["@pd46080", "@pd46084", "@pd46087", "@pd46089", , "@smoke"] },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.acknowledgement,
            data.testData.statuses.readUser
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.verifyStatus(data.testData.statuses.approved2);
          companyDocumentsPage.initiateWorkflowForDocument();
          data.testData.statuses.workflowStatuses.forEach((workflow) => {
            companyDocumentsPage.validateWorkflowProcessDropdownOptions(
              workflow
            );
          });
          companyDocumentsPage.applyWorkflowForAcknowledgement(
            data.testData.statuses.acknowledgement,
            data.testData.statuses.user
          );
          companyDocumentsPage.verifyStatus(
            data.testData.statuses.awaitingAcknowledgement
          );
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        'Verify that initiating "Approval" workflow updates document status to "In-Review"',
        { tags: ["@pd46082"] },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );
          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);

          companyDocumentsPage.verifyStatus(data.testData.statuses.inReview);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        'Verify that users selecting "Approve" must enter a mandatory message',
        { tags: "@pd46083" },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
          data.testData.threeDotMenuOptions.view,
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.imagePreview
          );

       
          cy.visitAssignToMe();
          companyDocumentsPage.searchInTrash("PNG", 2);
          companyDocumentsPage.clickActionsDropdown();
          companyDocumentsPage.selectTakeActionOption(
            data.testData.initiateWorkflow.approve
          );
          companyDocumentsPage.clickSaveButton();
          companyDocumentsPage.validateMessageValidation();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        'Verify that when the assigned user reassigns the document, its status remains "In Review" in the Company Document page',
        { tags: "@pd46085" },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);

          companyDocumentsPage.verifyStatus(data.testData.statuses.inReview);

          cy.visitAssignToMe();
          companyDocumentsPage.searchInTrash("PNG", 2);
          companyDocumentsPage.clickActionsDropdown();
          companyDocumentsPage.enterMessage(
            data.testData.initiateWorkflow.message
          );
          companyDocumentsPage.clickSaveButton();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.verifyStatus(data.testData.statuses.inReview);
          companyDocumentsPage.removeCreatedFile();
        }
      );
      it(
        'Verify that users selecting "Reject" must enter a mandatory message',
        { tags: "@pd46091" },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            data.testData.threeDotMenuOptions.view,
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.imagePreview
          );


          cy.visitAssignToMe();
          companyDocumentsPage.searchInTrash("PNG", 2);
          companyDocumentsPage.clickActionsDropdown();
          data.testData.initiateWorkflow.dropdownOptions.forEach((option) => {
            companyDocumentsPage.verifyTakeActionOption(option);
          });
          companyDocumentsPage.selectTakeActionOption(
            data.testData.initiateWorkflow.reject
          );
          companyDocumentsPage.clickSaveButton();
          companyDocumentsPage.validateMessageValidation();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.removeCreatedFile();
        }
      );
      it(
        'Verify that validation messages appear if mandatory fields are missing for "Acknowledgement" workflow',
        { tags: ["@pd46088", "@pd46094", "@pd46090"] },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.acknowledgement,
            data.testData.statuses.user,
            true
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`,
            true
          );
        }
      );
      it(
        'Verify that users selecting "Revise" must enter a mandatory message and new assignee',
        { tags: ["@pd46095", "@pd46096", "@smoke"] },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);

          companyDocumentsPage.verifyStatus(data.testData.statuses.inReview);

          cy.visitAssignToMe();
          companyDocumentsPage.searchInTrash("PNG", 2);
          companyDocumentsPage.verifyFileName(data.testData.files.png);
          companyDocumentsPage.clickActionsDropdown();
          companyDocumentsPage.selectTakeActionOption(
            data.testData.initiateWorkflow.dropdownOptions[1]
          );
          companyDocumentsPage.enterMessage(
            data.testData.initiateWorkflow.message
          );
          companyDocumentsPage.clickSaveButton();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.verifyStatus(data.testData.statuses.inReview);
          companyDocumentsPage.removeCreatedFile();
        }
      );
      it(
        'Verify that when the assigned user approves the document, its status changes to "Approved" in the Company Document page',
        { tags: "@pd46097" },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);

          companyDocumentsPage.verifyStatus(data.testData.statuses.inReview);

          cy.visitAssignToMe();
          companyDocumentsPage.searchInTrash("PNG", 2);
          companyDocumentsPage.clickActionsDropdown();
          companyDocumentsPage.selectTakeActionOption(
            data.testData.initiateWorkflow.dropdownOptions[2]
          );
          companyDocumentsPage.enterMessage(
            data.testData.initiateWorkflow.message
          );
          companyDocumentsPage.clickSaveButton();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.verifyStatus(data.testData.statuses.approved2);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        'Verify that when the assigned user declines the document, its status changes to "Approved" in the Company Document page',
        { tags: ["@pd46078", "@pd46086"] },
        () => {
          myDocumentsHelpers.clickAddButton();

          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.initiateWorkflowForDocument();
          companyDocumentsPage.applyWorkflowForAcknowledgement(
            data.testData.statuses.acknowledgement,
            data.testData.statuses.user
          );

    
          cy.visitAssignToMe();
          companyDocumentsPage.searchInTrash("PNG", 2);
          companyDocumentsPage.clickActionsDropdown();
          data.testData.initiateWorkflow.acknowledgementOptions.forEach(
            (option) => {
              companyDocumentsPage.verifyTakeActionOption(option);
            }
          );
          companyDocumentsPage.selectTakeActionOption(
            data.testData.initiateWorkflow.acknowledgementOptions[1]
          );
          companyDocumentsPage.enterMessage(
            data.testData.initiateWorkflow.message
          );
          companyDocumentsPage.clickSaveButton();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.verifyStatus(data.testData.statuses.approved2);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        'Verify that when the assigned user declines the document, its status changes to "Approved" in the Company Document page',
        { tags: ["@pd46081", "@pd46098"] },
        () => {
          myDocumentsHelpers.clickAddButton();

          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.initiateWorkflowForDocument();
          companyDocumentsPage.applyWorkflowForAcknowledgement(
            data.testData.statuses.acknowledgement,
            data.testData.statuses.user
          );

     
          cy.visitAssignToMe();
          companyDocumentsPage.searchInTrash("PNG", 2);
          companyDocumentsPage.clickActionsDropdown();
          data.testData.initiateWorkflow.acknowledgementOptions.forEach(
            (option) => {
              companyDocumentsPage.verifyTakeActionOption(option);
            }
          );
          companyDocumentsPage.selectTakeActionOption(
            data.testData.initiateWorkflow.acknowledgementOptions[0]
          );
          companyDocumentsPage.enterMessage(
            data.testData.initiateWorkflow.message
          );
          companyDocumentsPage.clickSaveButton();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.verifyStatus(data.testData.statuses.approved2);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        'Verify that users selecting "Acknowledge" must enter a mandatory message',
        { tags: "@pd46091" },
        () => {
          myDocumentsHelpers.clickAddButton();

          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.initiateWorkflowForDocument();
          companyDocumentsPage.applyWorkflowForAcknowledgement(
            data.testData.statuses.acknowledgement,
            data.testData.statuses.user
          );

         
          cy.visitAssignToMe();
          companyDocumentsPage.searchInTrash("PNG", 2);
          companyDocumentsPage.clickActionsDropdown();

          companyDocumentsPage.selectTakeActionOption(
            data.testData.initiateWorkflow.acknowledgementOptions[0]
          );
          companyDocumentsPage.clickSaveButton();
          companyDocumentsPage.validateMessageValidation();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        'Verify that users selecting "Reassign" must enter a mandatory message and new assignee',
        { tags: "@pd46101" },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pngFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.png);

          companyDocumentsPage.verifyStatus(data.testData.statuses.inReview);

          cy.visitAssignToMe();
          companyDocumentsPage.searchInTrash("PNG", 2);
          companyDocumentsPage.clickActionsDropdown();

          companyDocumentsPage.clickSaveButton();
          companyDocumentsPage.validateMessageValidation();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.removeCreatedFile();
        }
      );
    });
  }
);
