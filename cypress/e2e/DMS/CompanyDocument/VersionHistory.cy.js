import CompanyDocument from "../../../support/POM/DMS/CompanyDocument/CompanyDocument";
import MyDocumentsHelpers from "../../../support/POM/DMS/helpers/MyDocumentsHelper";
import data from "../../../fixtures/DMS/CompanyDocument/CompanyDocument.json";
import EditCompanyDocuments from "../../../support/POM/DMS/CompanyDocument/EditCompanyDocuments.js";
import dayjs from "dayjs";

const companyDocumentsPage = new CompanyDocument();
const myDocumentsHelpers = new MyDocumentsHelpers();
const editCompanyDocuments = new EditCompanyDocuments();

describe(
  "Version History - Company Documents - Document Management System",
  { tags: ["@regression", "@dms", "@company-documents", "@pd46115"] },
  () => {
    const rootFolderFilePath = "cypress/attachment/";
    const dmsUser = Cypress.env("decisionManagement").dmsUser;
    const session = () => {
      cy.loginWithSession(
        "login with Document Management User",
        dmsUser.username,
        dmsUser.password,
        dmsUser.key
      );
      cy.visitMyCompanyDocument();
    };
    context("Version History", { tags: "@version-history" }, () => {
      beforeEach(() => {
        // Login and navigate to Company Documents Page
        session();
        myDocumentsHelpers.switchToIframe();
        myDocumentsHelpers.clickAddButton();
      });
      it(
        "Verify that after updating a document, a new version is created without changing the name",
        { tags: ["@pd46117", "@pd46119", "@pd46128", "@pd46136", "@smoke"] },
        () => {
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.xlsxFile}`
          );
          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          editCompanyDocuments.clickEllipses();
          editCompanyDocuments.clickDropdownOption(
            data.testData.threeDotMenuOptions.edit
          );
          editCompanyDocuments.createNewWithApproval();

          companyDocumentsPage.clickVersionHistory();
          cy.wait(1500); //wait for version history to load
          myDocumentsHelpers.switchToIframe();

          companyDocumentsPage.validateCurrentVersion(
            data.testData.versionHistory.version1
          );
          companyDocumentsPage.validateVersionCount(
            data.testData.versionHistory.expectedVersionCount
          );
          companyDocumentsPage.validateNewVersion({
            versionNumber: data.testData.versionHistory.version1,
            name: data.testData.files.xlsx,
            status: data.testData.statuses.approved2,
            type: data.testData.fileType.xlsx,
            isCurrent: true,
          });
          companyDocumentsPage.validateNewVersion({
            versionNumber: data.testData.versionHistory.version2,
            name: data.testData.files.xlsx,
            status: data.testData.statuses.draft,
            type: data.testData.fileType.xlsx,
            isCurrent: false,
          });

          // Verify versions are in descending order
          companyDocumentsPage.validateVersionOrder();

          // Alternative: Verify specific order
          companyDocumentsPage.validateSpecificVersionOrder([
            data.testData.versionHistory.version2,
            data.testData.versionHistory.version1,
          ]);

          companyDocumentsPage.validateBookmark();
          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify that the Bookmark button is available in Version History",
        { tags: ["@pd46120", "@pd46119", "@smoke"] },
        () => {
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.xlsxFile}`
          );
          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          editCompanyDocuments.clickEllipses();
          editCompanyDocuments.clickDropdownOption(
            data.testData.threeDotMenuOptions.edit
          );
          editCompanyDocuments.createNewWithApproval();

          companyDocumentsPage.clickVersionHistory();
          cy.wait(1500); //wait for version history to load
          myDocumentsHelpers.switchToIframe();

          companyDocumentsPage.validateSpecificVersionOrder([
            data.testData.versionHistory.version2,
            data.testData.versionHistory.version1,
          ]);
          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify that clicking on Update File opens the Add Document flyer",
        { tags: "@pd46121" },
        () => {
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.xlsxFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          editCompanyDocuments.clickEllipses();
          editCompanyDocuments.clickDropdownOption(
            data.testData.threeDotMenuOptions.edit
          );
          editCompanyDocuments.createNewWithApproval();

          companyDocumentsPage.clickVersionHistory();
          cy.wait(3000); //wait for version history to load
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickUnlockButton();
          companyDocumentsPage.validateUpdateFile();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify that Draft status documents have additional options",
        { tags: ["@pd46122", "@pd46137"] },
        () => {
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.xlsxFile}`
          );
          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          editCompanyDocuments.clickEllipses();
          editCompanyDocuments.clickDropdownOption(
            data.testData.threeDotMenuOptions.edit
          );
          editCompanyDocuments.createNewWithApproval();

          companyDocumentsPage.clickVersionHistory();
          cy.wait(3000); //wait for version history to load
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickUnlockButton();
          companyDocumentsPage.validateActionButton();

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify that each column has a filter section",
        { tags: ["@pd46123", "@pd46130"] },
        () => {
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.xlsxFile}`
          );
          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          editCompanyDocuments.clickEllipses();
          editCompanyDocuments.clickDropdownOption(
            data.testData.threeDotMenuOptions.edit
          );
          editCompanyDocuments.createNewWithApproval();

          companyDocumentsPage.clickVersionHistory();
          cy.wait(3000); //wait for version history to load
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickUnlockButton();
          companyDocumentsPage.verifyEachColumnHasFilterSection([
            data.testData.gridColumns.workflow,
            data.testData.gridColumns.action,
          ]);
          companyDocumentsPage.verifyVersionHistoryColumns(
            data.testData.versionHistory.columnsOrder
          );

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify that the View Log option is available and displays the version history log correctly",
        { tags: ["@pd46125", "@pd46126", "@pd46134"] },
        () => {
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.xlsxFile}`
          );
          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          editCompanyDocuments.clickEllipses();
          editCompanyDocuments.clickDropdownOption(
            data.testData.threeDotMenuOptions.edit
          );
          editCompanyDocuments.createNewWithApproval();

          companyDocumentsPage.clickVersionHistory();
          cy.wait(3000); //wait for version history to load
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickUnlockButton();

          companyDocumentsPage.clickSendForApprovalButton(
            data.testData.versionHistory.version1
          );
          companyDocumentsPage.fillAndSendForApprovalModal({
            assignTo: data.testData.statuses.user,
            expiryNote: data.testData.workflow.approval.expiryNote,
            message: data.testData.workflow.approval.message,
          });
          cy.wait(5000); //wait for status to update
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickViewLogButton();
          const logEntries = data.testData.workflowActivityLog.logEntries;
          companyDocumentsPage.validateWorkflowActivityLog(logEntries);

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify that clicking on a document downloads the file",
        { tags: ["@pd46124", "@download"] },
        () => {
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.csvFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.csv);
          editCompanyDocuments.clickEllipses();
          editCompanyDocuments.clickDropdownOption(
            data.testData.threeDotMenuOptions.edit
          );
          editCompanyDocuments.createNewWithApproval();

          companyDocumentsPage.clickVersionHistory();
          cy.wait(3000); // wait for version history to load
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickUnlockButton();

          companyDocumentsPage.clickDocumentNameAndVerifyDownload(
            data.testData.versionHistory.version2,
            data.testData.files.csvFile
          );

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.csv);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify that clicking Bookmark opens the Bookmark flyer",
        { tags: "@pd46131" },
        () => {
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.docxFile}`
          );
          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.docx);
          editCompanyDocuments.clickEllipses();
          editCompanyDocuments.clickDropdownOption(
            data.testData.threeDotMenuOptions.edit
          );
          editCompanyDocuments.createNewWithApproval();

          companyDocumentsPage.clickVersionHistory();
          cy.wait(3000); // wait for version history to load
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickUnlockButton();

          companyDocumentsPage.clickBookmarkAndDownload(1);

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.docx);
          companyDocumentsPage.removeCreatedFile();
        }
      );
      it.skip(
        "Verify that clicking on the In-Review status opens the Workflow Status flyer",
        { tags: "@pd46131" },
        () => {
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.xlsxFile}`
          );
          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          editCompanyDocuments.clickEllipses();
          editCompanyDocuments.clickDropdownOption(
            data.testData.threeDotMenuOptions.edit
          );
          editCompanyDocuments.createNewWithApproval();

          companyDocumentsPage.clickVersionHistory();
          cy.wait(3000); // wait for version history to load
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickUnlockButton();
          companyDocumentsPage.clickSendForApprovalButton(
            data.testData.versionHistory.version1
          );
          companyDocumentsPage.fillAndSendForApprovalModal({
            assignTo: data.testData.statuses.user,
            expiryNote: data.testData.workflow.approval.expiryNote,
            message: data.testData.workflow.approval.message,
          });
          cy.wait(5000); //wait for status to update
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickInReviewButton(
            data.testData.statuses.inReview
          );
          companyDocumentsPage.validateWorkflowStatusModal({
            recipientName: data.testData.statuses.user,
            status: data.testData.workflowStatus.statuses.assigned,
          });

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          companyDocumentsPage.removeCreatedFile();
        }
      );
    });
  }
);
