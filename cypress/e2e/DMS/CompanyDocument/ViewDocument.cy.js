import CompanyDocuments from "../../../support/POM/DMS/CompanyDocument/CompanyDocument";
import MyDocumentsHelpers from "../../../support/POM/DMS/helpers/MyDocumentsHelper";
import data from "../../../fixtures/DMS/CompanyDocument/CompanyDocument.json";

import dayjs from "dayjs";
import locators from "../../../fixtures/locators.json";
const companyDocumentsPage = new CompanyDocuments();
const myDocumentsHelpers = new MyDocumentsHelpers();
const loc = locators.myDocuments;

describe(
  "View Documents Test Suite",
  {
    tags: ["@regression", "@dms", "@company-documents", "@pd46051"],
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

    context("File Operations", { tags: "@file-operations" }, () => {
      beforeEach(() => {
        session();
        myDocumentsHelpers.switchToIframe();
      });

      it(
        "Verify MS Viewer setting does not affect PDF, JPG, JPEG, PNG, CSV files",
        { tags: ["@pd46056", "@pd46058", "@smoke"] },
        () => {
          cy.visitCustomerProfile();
          companyDocumentsPage.disableMicrosoftDocumentViewer();
          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.csvFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.csv);
          companyDocumentsPage.assertViewIconVisible();
          companyDocumentsPage.removeCreatedFile();

          cy.waitForToastMessageToDisappear(60000);
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pptxFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.pptx);
          companyDocumentsPage.assertViewIconVisible(false);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify PPTX file viewing through all three options",
        { tags: ["@pd46054", "@smoke"] },
        () => {
          cy.visitCustomerProfile();
          companyDocumentsPage.enableMicrosoftDocumentViewer();
          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pptxFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.pptx);
          companyDocumentsPage.assertViewIconVisible(true);
          myDocumentsHelpers.renameFile(data.testData.files.pptx, renamedFile);
          cy.wait(5000);
          companyDocumentsPage.searchInGrid(renamedFile);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );
          companyDocumentsPage.removeFile(renamedFile);
        }
      );
      it(
        "Verify PPT file viewing through all three options",
        { tags: ["@pd46052", "@smoke"] },
        () => {
          cy.visitCustomerProfile();
          companyDocumentsPage.enableMicrosoftDocumentViewer();
          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pptFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.ppt);
          companyDocumentsPage.assertViewIconVisible(true);
          myDocumentsHelpers.renameFile(data.testData.files.ppt, renamedFile);
          cy.wait(5000);
          companyDocumentsPage.searchInGrid(renamedFile);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );
          companyDocumentsPage.removeFile(renamedFile);
        }
      );
      it(
        "Verify JPG file viewing in My Document And Assigned to Me page",
        { tags: ["@pd46053", "@pd46066", "@smoke"] },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.jpgFile}`
          );

          companyDocumentsPage.closeUploadModal();
          cy.wait(5000);
          companyDocumentsPage.searchInGrid(data.testData.files.jpg);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.imagePreview
          );

          cy.visitAssignToMe();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickFileName(data.testData.files.jpg);
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.imagePreview
          );

          companyDocumentsPage.removeFile(data.testData.files.jpg);
        }
      );

      it(
        "Verify PNG file viewing in My Document And Assigned to Me page",
        { tags: ["@pd46074", "@pd46075", "@smoke"] },
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
          cy.wait(5000);
          companyDocumentsPage.searchInGrid(data.testData.files.png);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.imagePreview
          );

          cy.wait(3000);
          cy.visitAssignToMe();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickFileName(data.testData.files.png);
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.imagePreview
          );

          companyDocumentsPage.removeFile(data.testData.files.png);
        }
      );
      it(
        "Verify DOCX file viewing through all three options",
        { tags: ["@pd46055", "@smoke"] },
        () => {
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.docxFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.docx);
          myDocumentsHelpers.renameFile(data.testData.files.docx, renamedFile);
          cy.wait(5000);
          companyDocumentsPage.searchInGrid(renamedFile);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );

          companyDocumentsPage.removeFile(renamedFile);
        }
      );

      it(
        "Verify DOC file viewing through all three options",
        { tags: ["@pd46060", "@smoke"] },
        () => {
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.docFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.doc);
          myDocumentsHelpers.renameFile(data.testData.files.doc, renamedFile);
          cy.wait(5000);
          companyDocumentsPage.searchInGrid(renamedFile);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );

          companyDocumentsPage.removeFile(renamedFile);
        }
      );

      it(
        "Verify document viewing in different statuses",
        { tags: ["@pd46057", "@pd46072", "@smoke"] },
        () => {
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.docxFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.docx);
          const renamedFile2 = renamedFile + "DocxApproved";
          myDocumentsHelpers.renameFile(data.testData.files.docx, renamedFile2);
          cy.wait(5000);
          companyDocumentsPage.searchInGrid(renamedFile2);
          companyDocumentsPage.verifyStatus(data.testData.statuses.approved2);

          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pptxFile}`
          );

          companyDocumentsPage.closeUploadModal();

          companyDocumentsPage.searchInGrid(data.testData.files.pptx);

          companyDocumentsPage.verifyStatus(data.testData.statuses.inReview);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify MS Viewer in Trash  when disabled",
        { tags: ["@pd46059", "@smoke"] },
        () => {
          cy.visitCustomerProfile();
          companyDocumentsPage.disableMicrosoftDocumentViewer();
          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pptxFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.pptx);
          companyDocumentsPage.assertViewIconVisible(false);
          companyDocumentsPage.removeCreatedFile();

          cy.visitTrash();
          companyDocumentsPage.searchInTrash(data.testData.files.pptx);
          companyDocumentsPage.assertViewIconVisible(false);
        }
      );

      it(
        "Verify MS Viewer in Trash  when enabled",
        { tags: ["@pd46061", "@smoke"] },
        () => {
          cy.visitCustomerProfile();
          companyDocumentsPage.enableMicrosoftDocumentViewer();
          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pptxFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.pptx);
          companyDocumentsPage.assertViewIconVisible();
          companyDocumentsPage.removeCreatedFile();

          cy.visitTrash();
          companyDocumentsPage.searchInTrash(data.testData.files.pptx);
          companyDocumentsPage.assertViewIconVisibleOnTrash();
        }
      );
      it(
        "Verify PDF file viewing through all three options",
        { tags: ["@pd46062", "@smoke"] },
        () => {
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pdfFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.pdf);
          const renamedFile2 = renamedFile + "PDF";
          myDocumentsHelpers.renameFile(data.testData.files.pdf, renamedFile2);
          cy.wait(5000);
          companyDocumentsPage.searchInGrid(renamedFile2);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );
          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(renamedFile2);
          companyDocumentsPage.removeCreatedFile();
        }
      );
      it(
        "Verify PDF file viewing in Assigned to Me page",
        { tags: ["@pd46073", "@smoke"] },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.pdfFile}`
          );

          companyDocumentsPage.closeUploadModal();

          cy.visitAssignToMe();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickFileName(data.testData.files.pdf);
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );
          cy.visitMyCompanyDocument();
          companyDocumentsPage.searchInGrid(data.testData.files.pdf);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify XLSX file viewing through all three options",
        { tags: ["@pd46069", "@smoke"] },
        () => {
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.xlsxFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);

          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );

          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          companyDocumentsPage.removeCreatedFile();
        }
      );
      it(
        "Verify XLSX file viewing in Assigned to Me page",
        { tags: ["@pd46068", "@smoke"] },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.xlsxFile}`
          );

          companyDocumentsPage.closeUploadModal();

          cy.visitAssignToMe();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickFileName(data.testData.files.xlsx);
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );
          cy.visitMyCompanyDocument();
          companyDocumentsPage.searchInGrid(data.testData.files.xlsx);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify CSV file viewing through all three options",
        { tags: ["@pd46074", "@smoke"] },
        () => {
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.csvFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.csv);
          const renamedFile2 = renamedFile + "forCSV";
          myDocumentsHelpers.renameFile(data.testData.files.csv, renamedFile2);
          cy.wait(5000);
          companyDocumentsPage.searchInGrid(renamedFile2);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );
          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(renamedFile2);
          companyDocumentsPage.removeCreatedFile();
        }
      );
      it(
        "Verify CSV file viewing in Assigned to Me page",
        { tags: ["@pd46070", "@smoke"] },
        () => {
          myDocumentsHelpers.clickAddButton();
          companyDocumentsPage.applyWorkflow(
            data.testData.statuses.approved,
            data.testData.statuses.user
          );
          myDocumentsHelpers.uploadFile(
            `${rootFolderFilePath}${data.testData.files.csvFile}`
          );

          companyDocumentsPage.closeUploadModal();

          cy.visitAssignToMe();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.clickFileName(data.testData.files.csv);
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );
          cy.visitMyCompanyDocument();
          companyDocumentsPage.searchInGrid(data.testData.files.csv);
          companyDocumentsPage.removeCreatedFile();
        }
      );

      it(
        "Verify Non-Customer Admin with read permission can view documents",
        { tags: ["@pd46064", "@smoke"] },
        () => {
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.docxFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.docx);
          const renamedFile2 = renamedFile + "forRead";
          myDocumentsHelpers.renameFile(data.testData.files.docx, renamedFile2);
          cy.wait(5000);
          companyDocumentsPage.searchInGrid(renamedFile2);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );

          cy.clearAllSessionStorage();
          Cypress.session.clearAllSavedSessions();
          const dmUser2 = Cypress.env("decisionManagement").dmsRead;
          cy.loginWithSession(
            "login with DMS Read User",
            dmUser2.username,
            dmUser2.password,
            dmUser2.key
          );
          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(renamedFile2);
          companyDocumentsPage.assertViewIconVisible();
        }
      );
      it(
        "Verify Customer Admin can view documents without read/create permission",
        { tags: ["@pd46065", "@smoke"] },
        () => {
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.docxFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.docx);
          const renamedFile2 = renamedFile + "forCustomerAdmin";
          myDocumentsHelpers.renameFile(data.testData.files.docx, renamedFile2);
          companyDocumentsPage.searchInGrid(renamedFile2);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );

          const dmsCustomerAdmin =
            Cypress.env("decisionManagement").dmsCustomerAdmin;
          cy.clearAllSessionStorage();
          Cypress.session.clearAllSavedSessions();
          cy.loginWithSession(
            "login with DMS Customer Admin User",
            dmsCustomerAdmin.username,
            dmsCustomerAdmin.password,
            dmsCustomerAdmin.key
          );

          cy.visitMyCompanyDocument();
          cy.wait(3000);
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(renamedFile2);
          companyDocumentsPage.assertViewIconVisible();
        }
      );

      it(
        "Verify Non-Customer Admin without read permission cannot view documents",
        { tags: ["@pd46063", "@smoke"] },
        () => {
          companyDocumentsPage.uploadFile(
            `${rootFolderFilePath}${data.testData.files.docxFile}`
          );

          companyDocumentsPage.closeUploadModal();
          companyDocumentsPage.searchInGrid(data.testData.files.docx);
          const renamedFile2 = renamedFile + "forNonCustomer";
          myDocumentsHelpers.renameFile(data.testData.files.docx, renamedFile2);
          cy.wait(5000);
          companyDocumentsPage.searchInGrid(renamedFile2);
          companyDocumentsPage.clickHierarchyThreeEllipses(1, 1);
          companyDocumentsPage.selectFromThreeDotMenu(
            "View",
            loc.itemActions.view
          );
          companyDocumentsPage.previewDocument(
            locators.companyDocuments.uploadModal.previewDocument
          );

          cy.clearAllSessionStorage();
          Cypress.session.clearAllSavedSessions();
          const dmsOnly = Cypress.env("decisionManagement").dmsOnly;
          cy.loginWithSession(
            "login with DMS Only User",
            dmsOnly.username,
            dmsOnly.password,
            dmsOnly.key
          );
          cy.visitMyCompanyDocument();
          myDocumentsHelpers.switchToIframe();
          companyDocumentsPage.searchInGrid(renamedFile2);
          companyDocumentsPage.assertViewIconVisible(false);
        }
      );
    });
  }
);
