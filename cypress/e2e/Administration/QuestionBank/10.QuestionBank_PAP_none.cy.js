import QuestionBank from "../../../support/POM/Administration/QuestionBank/QuestionBank";
import assessmentData from "../../../fixtures/Administration/Assessments_PAP.json";
const assessmentDataString = "cypress/fixtures/Administration/Assessments_PAP.json"
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
  "Question Bank Form PAP Assessment Template- Test Scenarios from (NoneSpace) Filter Import Functionality",
  {
    tags: [
      "@pd32038",
      "@question-bank",
      "@pap-assessment",
      "@none-space",
      "@administration",
      "@regression",
    ],
  },
  () => {
    const questionBank = new QuestionBank();

    before(() => {
      cy.loginWithSession(
        "login with Risk Management User",
        Cypress.env("kxi").none.username,
        Cypress.env("kxi").none.password,
        Cypress.env("kxi").none.key
      );
      assessment.updateAssessmentFile("Assessments_PAP.json")
      questionBank.updateAssessmentDataFile("Assessments_PAP.json")
      // assessment.contentLibrary(qbSummaryForm.add.type.addContentLibrary);
      cy.readFile(assessmentDataString).then((dataFile)=>{
        qbSummaryForm = dataFile.questionBank.qbSummaryForm;
        qbSurveyForm = dataFile.questionBank.qbSurveyForm;
      })
    });

    //***********<<<<<<<<<<  Filter Cases >>>>>**************** */

  context("Filter QB",()=>{
    before(()=>{
      questionBank.updateAssessmentDataFile("Assessments_PAP.json")
    })
    beforeEach(() => {
      cy.loginWithSession(
        "login with Risk Management User",
        Cypress.env("kxi").none.username,
        Cypress.env("kxi").none.password,
        Cypress.env("kxi").none.key
      );
      cy.visitMyQuestionBank();
      cy.waitForTopMsgLoaderToDisappear(100000);
      questionBank.verifyQAGridList();
    });
    // we are temporarily skipping this test because it consistently fails when all template jenkins builds run in parallel. The test expects its framework to be positioned in the first row of the QB Grid. It is working, but we are temporarily skipping it.
    it.skip(
      "verify filter with Framework ",
      { tags: ["@filter", "@pd36034", "@pd36035", "@pd36038"] },
      () => {
        questionBank.verifyWithFilter(9, "add");
      }
    );

    it(
      "verify filter with Name",
      { tags: ["@filter", "@pd36036", "@pd36039"] },
      () => {
        questionBank.verifyWithFilter(10, "update");
      }
    );

    it(
      "Verify filtering with multiple criteria",
      { tags: ["@filter", "@pd36026", "@pd36040"] },
      () => {
        questionBank.verifyWithFilter(9, "add");
        questionBank.verifyWithFilter(10, "update");
      }
    );

    it(
      "Verify behavior when no records match the filters",
      { tags: ["@filter", "@pd36041", "@pd36042"] },
      () => {
        questionBank.verifyFilterNoValue(9);
        questionBank.verifyFilterNoValue(9, true);
      }
    );
  })
    //************<<<< import Cases >>>>>>************** */
  context("verify Import Functionality..",()=>{
    beforeEach(() => {
      cy.loginWithSession(
        "login with Risk Management User",
        Cypress.env("kxi").none.username,
        Cypress.env("kxi").none.password,
        Cypress.env("kxi").none.key
      );
      cy.visitMyQuestionBank();
      cy.waitForTopMsgLoaderToDisappear(100000);
    });

    it(
      "Verify that the Cancel button closes the modal",
      { tags: ["@import", "@pd36048"] },
      () => {
        contentLibrary.openImportModal(true);
        contentLibrary.closeImportModal(true);
      }
    );

    it(
      "Verify that the Import Question Bank modal opens correctly",
      { tags: ["@import", "@pd36043"] },
      () => {
        contentLibrary.openImportModal(true);
      }
    );

    it(
      "Validate the Download Sample File link",
      { tags: ["@import", "@pd36044"] },
      () => {
        contentLibrary.openImportModal(true);
        contentLibrary.checkForDownloadFileLink(true);
      }
    );

    it(
      "Verify uploading a file with an unsupported format",
      { tags: ["@import", "@pd36047"] },
      () => {
        contentLibrary.openImportModal(true);
        contentLibrary.uploadFileImportModal(testData.invalidFormatFile, true);
      }
    );

    //Bug: https://360factors.atlassian.net/browse/PD-36006
    it(
      "Verify if large files (e.g., > 10 MB) are handled correctly during import.",
      {
        tags: ["@import"],
      },
      () => {
        contentLibrary.openImportModal(true);
        contentLibrary.uploadFileImportModal(testData.exceedSizeFileName, true);
      }
    );

    it(
      "Validate uploading a valid Excel file",
      { tags: ["@import", "@pd36046"] },
      () => {
        questionBank.addUsersDataImportJson(true);
        questionBank.writeImportNameToAssessment("Assessments_PAP")
      }
    );

    it("verify that imported QB should be added in the grid",()=>{
      questionBank.verifyQAGridList();
      assessment.searchQB("update");
    })
  })
  }
);
