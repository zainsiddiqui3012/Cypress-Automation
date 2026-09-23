import Template from "../../../support/POM/Administration/Template/Template";
import assessmentData from "../../../fixtures/Administration/Assessments_VA.json";
const assessmentDataString =
  "cypress/fixtures/Administration/Assessments_VA.json";
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
  "Assessment Template VA- Test Scenarios from (None Space) Filter Import Functionality",
  {
    tags: [
      "@pd32038",
      "@assessment",
      "@internal-vendor-assessment",
      "@vendor-assessment",
      "@none-space",
      "@administration",
      "@regression",
    ],
  },
  () => {
    const template = new Template();
    
    context("Filter QB", () => {
      before(() => {
        assessment.updateAssessmentFile("Assessments_VA.json");
        template.updateAssessmentDataFile("Assessments_VA.json");
      });
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
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

      it(
        "Validate filter with Content Library",
        { tags: ["@filter", "@pd33426"] },
        () => {
          template.verifyWithFilter(4, templateSurveyForm.type.contentLibrary);
        }
      );

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
        assessment.updateAssessmentFile("Assessments_VA.json");
        template.updateAssessmentDataFile("Assessments_VA.json");
      });
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
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
          contentLibrary.checkForDownloadFileLink(false, true);
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
          template.writeImportNameToAssessment("Assessments_VA");
        }
      );

      it("verify that imported QB should be added in the grid", () => {
        template.verifyTemplateGridList();
        template.searchTemplate();
      });
    });
  }
);