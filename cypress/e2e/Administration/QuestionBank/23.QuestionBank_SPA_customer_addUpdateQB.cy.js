import QuestionBank from "../../../support/POM/Administration/QuestionBank/QuestionBank";
import assessmentData from "../../../fixtures/Administration/Assessments_SPA.json";
const assessmentDataString = "cypress/fixtures/Administration/Assessments_SPA.json"
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
  "Question Bank Form Single Party Assessment- Test Scenarios (Customer Space) Add / Update QB",
  {
    tags: [
      "@pd32055",
      "@question-bank",
      "@risk-analysis",
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
      assessment.updateAssessmentFile("Assessments_SPA.json");
      questionBank.updateAssessmentDataFile("Assessments_SPA.json");
      cy.readFile(assessmentDataString).then((dataFile) => {
        qbSummaryForm = dataFile.questionBank.qbSummaryForm;
        qbSurveyForm = dataFile.questionBank.qbSurveyForm;
      });
    });

    context("add and update Question Bank from Administration", () => {
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
        "Should show an error when Question Bank Name is empty",
        { tags: ["@pd34202", "@pd34203", "@pd34206","@smoke"] },
        () => {
          questionBank.clickAddBtn();
          questionBank.verifyMandatoryFieldsError();
        }
      );

      it(
        "Should show an error when Question Bank Name exceeds 255 characters",
        { tags: ["@pd34204", "@smoke"] },
        () => {
          questionBank.verifyQBNameCharLimit();
        }
      );

      it(
        "Should show an error when description exceeds 1000 characters",
        { tags: ["@pd34207", "@smoke"] },
        () => {
          questionBank.verifyDescriptionCharLimit();
        }
      );

      it(
        "Should fill out the form and submit successfully",
        { tags: ["@pd34205", "@pd34208", "@pd34209", "@pd34210", "@pd34211", "@smoke"] },
        () => {
          assessment.addQBSummaryForm(qbSummaryForm, "add", true, true);
          assessment.addQBSummaryForm(qbSummaryForm, "add", false, true);
        }
      );

      it(
        "Verify that only Active Question Banks can be published",
        { tags: ["@pd34251"] },
        () => {
          questionBank.verifyQAGridList();
          assessment.searchQB("add");
          questionBank.verifyInactiveQBPublish();
        }
      );

      //We're temporarily skipping this test because it consistently fails when all template jenkins builds run in parallel. The test expects its framework to be positioned in the first row of the QB Grid. It is working, but we are temporarily skipping it.
      it.skip("sort FrameWork column", { tags: ["@pd34245"] }, () => {
        questionBank.verifyQAGridList();
        questionBank.sortFrameWork("Assessments_SPA");
      });

      it(
        "should Delete the created QB unPublished Template",
        { tags: ["@pd34249"] },
        () => {
          questionBank.verifyQAGridList();
          assessment.searchQB("add");
          questionBank.deleteQB();
        }
      );

      it("Should fill out the form again and submit successfully as deleted in previous test", () => {
        assessment.addQBSummaryForm(qbSummaryForm, "add", true, true);
        assessment.addQBSummaryForm(qbSummaryForm, "add", false, true);
      });

      it(
        "should update the details of created QB Form",
        {
          tags: [
            "@pd34212",
            "@pd34213",
            "@pd34214",
            "@pd34204",
            "@pd34216",
            "@pd34217",
            "@pd34207",
            "@pd34208",
            "@pd34220",
            "@pd34210",
            "@pd34211",
            "@pd34212",
            "@pd34224",
            "@pd34225",
            "@smoke"
          ],
        },
        () => {
          questionBank.verifyQAGridList();
          assessment.searchQB("add");
          assessment.clickSavedQBLink("add");
          assessment.addQBSummaryForm(qbSummaryForm, "update", true, true);
          assessment.searchQB("add");
          assessment.clickSavedQBLink("add");
          assessment.addQBSummaryForm(qbSummaryForm, "update", false, true);
        }
      );

      it(
        "should add Questions in newly Created QuestionBank",
        {
          tags: [
            "@pd34226",
            "@pd34227",
            "@pd34228",
            "@pd34229",
            "@pd34230",
            "@pd34231",
            "@pd34232",
            "@pd34233",
            "@pd34236",
            "@pd34237",
            "@pd34238",
            "@pd34239",
            "@pd34210",
            "@pd34211",
            "@pd34242",
            "@pd34542",
            "@smoke"
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
        { tags: ["@pd34536", "@pd34537", "@smoke"] },
        () => {
          questionBank.verifyQAGridList();
          assessment.publishQB("update", false, "Assessments_SPA", true);
        }
      );

      it(
        "verify the publish of new QB Version template after creating new version from previous published template",
        { tags: ["@pd34538", "@smoke"] },
        () => {
          questionBank.verifyQAGridList();
          assessment.publishQB("update", true, "Assessments_SPA", true);
        }
      );
    });
})