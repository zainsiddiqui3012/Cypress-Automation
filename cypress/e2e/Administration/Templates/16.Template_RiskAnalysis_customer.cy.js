import Template from "../../../support/POM/Administration/Template/Template";
import assessmentData from "../../../fixtures/Administration/Assessments.json";
const assessmentDataString =
  "cypress/fixtures/Administration/Assessments.json";
import Assessment from "../../../support/POM/Administration/Assessment";
import ContentLibrary from "../../../support/POM/Administration/ContentLibary";
import testData from "../../../fixtures/Administration/Template/Template.json";
const jsonFilePath = "cypress/fixtures/Administration/Template/Template.json";
let qbSummaryForm = assessmentData.questionBank.qbSummaryForm;
let qbSurveyForm = assessmentData.questionBank.qbSurveyForm;
let templateSurveyForm = assessmentData.template.templateSurveyForm;
let templateSections = assessmentData.template.sections;
const assessment = new Assessment();
const contentLibrary = new ContentLibrary();


describe(
  "Assessment Template RISK ANALYSIS- Test Scenarios from Customer Space Filter Import Functionality",
  {
    tags: [
      "@pd32047",
      "@assessment",
      "@risk-analysis",
      "@customer-space",
      "@administration",
      "@regression",
    ],
  },
  () => {
    const template = new Template();

    context("Filter QB", () => {
      before(() => {
        assessment.updateAssessmentFile("Assessments.json");
        template.updateAssessmentDataFile("Assessments.json");
      });
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitTemplate();
        cy.waitForTopMsgLoaderToDisappear(100000);
        template.verifyTemplateGridList();
      });
      // we are temporarily skipping this test because it consistently fails when all template jenkins builds run in parallel. The test expects its framework to be positioned in the first row of the QB Grid. It is working, but we are temporarily skipping it.
      it.skip(
        "verify filter with Framework ",
        { tags: ["@filter", "@pd33422"] },
        () => {
          template.verifyWithFilter(0, qbSummaryForm.add.framework);
        }
      );

      // it was failing on jenkins build temporary skipping this step
      it(
        "verify filter with Template Name",
        { tags: ["@filter", "@pd33423"] },
        () => {
          template.verifyWithFilter(1, templateSurveyForm.templateName);
        }
      );

      it("Validate the Type filter", { tags: ["@filter", "@pd33425"] }, () => {
        template.verifyWithFilter(3, templateSurveyForm.type.typeName);
      });

      //it was failing on jenkins builf temporary skipping this step
      it(
        "Verify the Status filter functionality",
        { tags: ["@filter", "@pd33427"] },
        () => {
          template.verifyWithFilter(1, templateSurveyForm.templateName);
          template.verifyWithFilter(8, templateSurveyForm.unSelectStatus, true);
        }
      );
    });
    
    context("verify Import Functionality..", () => {
      before(() => {
        assessment.updateAssessmentFile("Assessments.json");
        template.updateAssessmentDataFile("Assessments.json");
        template.writeFrameworkCustomerImport();
      });
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitTemplate();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Verify that the Cancel button closes the modal",
        { tags: ["@import", "@pd36048", "@pd33443"] },
        () => {
          contentLibrary.openImportModal(true);
          contentLibrary.closeImportModal();
        }
      );

      it(
        "Verify that the Import Question Bank modal opens correctly",
        { tags: ["@import", "@pd33437"] },
        () => {
          contentLibrary.openImportModal(true);
        }
      );

      it(
        "Validate the Download Sample File link",
        { tags: ["@import", "@pd33438"] },
        () => {
          contentLibrary.openImportModal(true);
          contentLibrary.checkForDownloadFileLink(false, true, true);
        }
      );

      it(
        "Verify uploading a file with an unsupported format",
        { tags: ["@import", "@pd33439", "@pd33442"] },
        () => {
          contentLibrary.openImportModal(true);
          contentLibrary.uploadFileImportModal(
            testData.invalidFormatFile,
            false,
            true
          );
        }
      );

      it(
        "Verify if large files (e.g., > 10 MB) are handled correctly during import.",
        {
          tags: ["@import", "@pd33439", "@pd33446"],
        },
        () => {
          contentLibrary.openImportModal(true);
          contentLibrary.uploadFileImportModal(
            testData.exceedSizeFileName,
            false,
            true
          );
        }
      );

      it(
        "Validate uploading a valid Excel file",
        { tags: ["@import", "@pd33439", "@pd33440"] },
        () => {
          template.addUsersDataImportJson(true);
          template.uploadValidFile(true);
          template.writeImportNameToAssessment("Assessments");
        }
      );

      it("verify that imported Template should be added in the grid", () => {
        template.verifyTemplateGridList();
        template.searchTemplate();
      });
    });
  }
);