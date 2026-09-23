import QuestionBank from "../../../support/POM/Administration/QuestionBank/QuestionBank";
import assessmentData from "../../../fixtures/Administration/Assessments_OEP.json";
const assessmentDataString = "cypress/fixtures/Administration/Assessments_OEP.json"
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
  "Question Bank Form OEP Assessment- Test Scenarios from (NoneSpace) Add / Update QB",
  {
    tags: [
      "@pd32038",
      "@question-bank",
      "@oep-assessment",
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
      assessment.updateAssessmentFile("Assessments_OEP.json")
      questionBank.updateAssessmentDataFile("Assessments_OEP.json")
      assessment.contentLibrary(qbSummaryForm.add.type.addContentLibrary);
      cy.readFile(assessmentDataString).then((dataFile)=>{
        qbSummaryForm = dataFile.questionBank.qbSummaryForm;
        qbSurveyForm = dataFile.questionBank.qbSurveyForm;
      })
    });

    context("add and update Question Bank from Administration",()=>{
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
    // Negative Scenarios
    it(
      "Should show an error when Question Bank Name is empty",
      { tags: ["@pd35586", "@pd35587", "@pd36024", "@pd35590"] },
      () => {
        questionBank.clickAddBtn();
        questionBank.verifyMandatoryFieldsError();
      }
    );

    it(
      "Should show an error when Question Bank Name exceeds 255 characters",
      { tags: ["@pd35588"] },
      () => {
        questionBank.verifyQBNameCharLimit();
      }
    );

    it(
      "Should show an error when description exceeds 1000 characters",
      { tags: ["@pd35602", "@pd35591", "@pd30364"] },
      () => {
        questionBank.verifyDescriptionCharLimit();
      }
    );

    // Positive Scenarios
    it(
      "Should fill out the form and submit successfully",
      {
        tags: [
          "@smoke",
          "@add",
          "@pd35589",
          "@pd35603",
          "@pd35592",
          "@pd35593",
          "@pd35594",
          "@pd35605",
          "@pd36022",
          "@pd35595",
          "@pd35606",
          "@pd36033",
        ],
      },
      () => {
        assessment.addQBSummaryForm(qbSummaryForm, "add", true);
        assessment.addQBSummaryForm(qbSummaryForm, "add");
      }
    );

    it(
      "Verify that only Active Question Banks can be published",
      { tags: ["@pd36032"] },
      () => {
        questionBank.verifyQAGridList();
        assessment.searchQB("add");
        questionBank.verifyInactiveQBPublish();
      }
    );

     //We're temporarily skipping this test because it consistently fails when all template jenkins builds run in parallel. The test expects its framework to be positioned in the first row of the QB Grid. It is working, but we are temporarily skipping it.
    it.skip("sort FrameWork column", { tags: ["@sort", "@pd36027"] }, () => {
      questionBank.verifyQAGridList();
      questionBank.sortFrameWork("Assessments_OEP");
    });

    it(
      "should Delete the created QB unPublished Template",
      { tags: ["@delete", "@pd36031"] },
      () => {
        questionBank.verifyQAGridList();
        assessment.searchQB("add");
        questionBank.deleteQB();
      }
    );

    // Positive Scenarios
    it(
      "Should fill out the form again and submit successfully as deleted in previous test",
      { tags: "@add" },
      () => {
        assessment.addQBSummaryForm(qbSummaryForm, "add", true);
        assessment.addQBSummaryForm(qbSummaryForm, "add");
      }
    );

    it(
      "should update the details of created QB Form",
      {
        tags: [
          "@edit",
          "@pd35596",
          "@pd35597",
          "@pd35597",
          "@pd35598",
          "@pd35600",
          "@pd35601",
          "@pd35604",
          "@pd36022",
          "@pd36023",
          "@pd35607",
          "@pd36037",
        ],
      },
      () => {
        questionBank.verifyQAGridList();
        assessment.searchQB("add");
        assessment.clickSavedQBLink("add");
        assessment.addQBSummaryForm(qbSummaryForm, "update", true);
        assessment.searchQB("add");
        assessment.clickSavedQBLink("add");
        assessment.addQBSummaryForm(qbSummaryForm, "update");
      }
    );

    it(
      "should add Questions in newly Created QuestionBank",
      {
        tags: [
          "@edit",
          "@pd35608",
          "@pd35609",
          "@pd35610",
          "@pd35611",
          "@pd35612",
          "@pd35613",
          "@pd36015",
          "@pd36016",
          "@pd36017",
          "@pd36018",
          "@pd36019",
          "@pd36020",
          "@pd36021",
          "@pd35605",
          "@pd35606",
          "@pd36025",
        ],
      },
      () => {
        questionBank.verifyQAGridList();
        assessment.searchQB("update");
        assessment.clickSavedQBLink("update");
        assessment.addQBSurvey(qbSummaryForm.add, qbSurveyForm, true);
        assessment.addQBSurvey(qbSummaryForm.add, qbSurveyForm);
      }
    );

    it(
      "Verify the Publish action",
      { tags: ["@publish", "@pd36028", "@pd36029"] },
      () => {
        questionBank.verifyQAGridList();
        assessment.publishQB("update", false, "Assessments_OEP");
      }
    );

    it(
      "verify the publish of new QB Version template after creating new version from previous published template",
      { tags: ["@publish", "@new-version", "@pd36030"] },
      () => {
        questionBank.verifyQAGridList();
        assessment.publishQB("update", true, "Assessments_OEP");
      }
    );
  })
})