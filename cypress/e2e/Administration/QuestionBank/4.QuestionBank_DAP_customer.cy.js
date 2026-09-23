import QuestionBank from "../../../support/POM/Administration/QuestionBank/QuestionBank";
import assessmentData from "../../../fixtures/Administration/Assessments_DAP.json";
const assessmentDataString = "cypress/fixtures/Administration/Assessments_DAP.json"
import Assessment from "../../../support/POM/Administration/Assessment";
import ContentLibrary from "../../../support/POM/Administration/ContentLibary";
import testData from "../../../fixtures/Administration/QuestionBank/QuestionBank.json";
const jsonFilePath =
  "cypress/fixtures/Administration/QuestionBank/QuestionBank.json";
let qbSummaryForm = assessmentData.questionBank.qbSummaryForm;
let qbSurveyForm = assessmentData.questionBank.qbSurveyForm;
const questionBank = new QuestionBank();
const assessment = new Assessment();
const contentLibrary = new ContentLibrary();

describe(
  "Question Bank Form DAP Assessment- Test Scenarios (Customer Space) Filter and Import Functionality",
  {
    tags: [
      "@pd32055",
      "@question-bank",
      "@dap-assessment",
      "@customer-space",
      "@administration",
      "@regression",
    ],
  },
  () => {
    before(() => {
      cy.loginWithSession(
        "login with Customer User",
        Cypress.env("kxi").customer.withRM.username,
        Cypress.env("kxi").customer.withRM.password,
        Cypress.env("kxi").customer.withRM.key
      );
      assessment.updateAssessmentFile("Assessments_DAP.json");
      questionBank.updateAssessmentDataFile("Assessments_DAP.json");
      cy.readFile(assessmentDataString).then((dataFile) => {
        qbSummaryForm = dataFile.questionBank.qbSummaryForm;
        qbSurveyForm = dataFile.questionBank.qbSurveyForm;
      });
    });

    context("Filter QB", () => {
      before(() => {
        questionBank.updateAssessmentDataFile("Assessments_DAP.json");
      });
      beforeEach(() => {
        cy.loginWithSession(
          "login with Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitMyQuestionBank();
        cy.waitForTopMsgLoaderToDisappear(100000);
        questionBank.verifyQAGridList();
      });

      it(
        "verify filter with Framework ",
        { tags: ["@pd34243", "@pd34244", "@pd34544", "@pd34550"] },
        () => {
          questionBank.verifyWithFilter(9, "add");
        }
      );

      it("verify filter with Name", { tags: ["@pd34545", "@pd34551"] }, () => {
        questionBank.verifyWithFilter(10, "update");
      });

      it(
        "Verify filtering with multiple criteria",
        { tags: ["@pd34546", "@pd34552", "@pd34553"] },
        () => {
          questionBank.verifyWithFilter(9, "add");
          questionBank.verifyWithFilter(10, "update");
        }
      );

      it(
        "Verify behavior when no records match the filters",
        { tags: ["@pd34554", "@pd34556"] },
        () => {
          questionBank.verifyFilterNoValue(9);
          questionBank.verifyFilterNoValue(9, true);
        }
      );
    });

    context("verify Import Functionality..", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitMyQuestionBank();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Verify that the Cancel button closes the modal",
        { tags: ["@pd34563"] },
        () => {
          contentLibrary.openImportModal(true);
          contentLibrary.closeImportModal(true);
        }
      );

      it(
        "Verify that the Import Question Bank modal opens correctly",
        { tags: ["@pd34557"] },
        () => {
          contentLibrary.openImportModal(true);
        }
      );

      it(
        "Validate the Download Sample File link",
        { tags: ["@pd34558", "@smoke"] },
        () => {
          contentLibrary.openImportModal(true);
          contentLibrary.checkForDownloadFileLink(true, false, true);
        }
      );

      it(
        "Verify uploading a file with an unsupported format",
        { tags: ["@pd34559", "@pd34562", "@smoke"] },
        () => {
          contentLibrary.openImportModal(true);
          contentLibrary.uploadFileImportModal(
            testData.invalidFormatFile,
            true
          );
        }
      );

      //Bug: https://360factors.atlassian.net/browse/PD-36006
      it(
        "Verify if large files (e.g., > 10 MB) are handled correctly during import.",
        { tags: ["@pd34566"] },
        () => {
          contentLibrary.openImportModal(true);
          contentLibrary.uploadFileImportModal(
            testData.exceedSizeFileName,
            true
          );
        }
      );

      it(
        "Validate uploading a valid Excel file",
        { tags: ["@pd34560", "@smoke"] },
        () => {
          questionBank.addUsersDataImportJson(true, true);
          questionBank.writeImportNameToAssessment("Assessments_DAP");
        }
      );

      it("verify that imported QB should be added in the grid", { tags: ["@smoke"] }, () => {
        questionBank.verifyQAGridList();
        assessment.searchQB("update");
      });
    });
  }
);