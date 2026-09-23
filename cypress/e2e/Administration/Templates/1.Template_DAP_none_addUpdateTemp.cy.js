import Template from "../../../support/POM/Administration/Template/Template";
import assessmentData from "../../../fixtures/Administration/Assessments_DAP.json";
const assessmentDataString =
  "cypress/fixtures/Administration/Assessments_DAP.json";
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
  "Assessment Template DAP- Test Scenarios from (None Space) Add / Update Template",
  {
    tags: [
      "@pd32038",
      "@assessment",
      "@dap-assessment",
      "@none-space",
      "@administration",
      "@regression",
    ],
  },
  () => {
    const template = new Template();

    context("Mandatory & Character Limit cases", () => {
      before(() => {
        assessment.updateAssessmentFile("Assessments_DAP.json");
        template.updateAssessmentDataFile("Assessments_DAP.json");
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
        "Should show an error when Template Form is empty",
        { tags: ["@pd34938", "@pd34941", "@pd34943", "@pd34947", "@pd34951"] },
        () => {
          template.clickAddBtn();
          template.verifyMandatoryFieldsError();
        }
      );

      it(
        "Validate Assessment ID max length, should not be more than 255 char",
        { tags: ["@pd34944", "@pd34947"] },
        () => {
          template.verifySurveyIDCharLimit();
          template.verifyLibrarySurveyIdNonEditable();
        }
      );

      it(
        "Verify Guidance rich text editor accepts input",
        { tags: ["@pd34948"] },
        () => {
          template.clickAddBtn();
          template.enterGuidanceText();
        }
      );
    });

    context("add and update Template from Administration", () => {
      before(() => {
          assessment.updateAssessmentFile("Assessments_DAP.json");
          template.updateAssessmentDataFile("Assessments_DAP.json");
        cy.readFile(assessmentDataString).then((dataFile) => {
          qbSummaryForm = dataFile.questionBank.qbSummaryForm;
          qbSurveyForm = dataFile.questionBank.qbSurveyForm;
        });
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
        "Should fill out the form and submit successfully",
        {
          tags: [
            "@add",
            "@pd34941",
            "@pd34942",
            "@pd35592",
            "@pd349453",
            "@pd35594",
            "@pd34950",
            "@pd34952",
            "@pd34953",
            "@pd34954",
            "@pd34955",
            "@smoke",
          ],
        },
        () => {
          assessment.addTemplate(templateSurveyForm, true);
          assessment.addTemplate(templateSurveyForm);
        }
      );

      it(
        "should add the section in newly created Template",
        { tags: ["@pd36032"] },
        () => {
          template.verifyTemplateGridList();
          template.searchTemplate();
          template.clickSavedTemplateLink();
          template.clickSectionTab();
          assessment.addSection(templateSections, true);
          template.clickSectionTab();
          assessment.addSection(templateSections);
        }
      );
    });

    context("Publish Template Functionality...", { tags: ["@pd33421"] }, () => {
      before(() => {
        assessment.updateAssessmentFile("Assessments_DAP.json");
        template.updateAssessmentDataFile("Assessments_DAP.json");
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

      it(
        "Validate Preview option in ellipsis menu",
        { tags: ["@publish", "@preview", "@pd33430", "@pd33429"] },
        () => {
          template.searchTemplate();
          template.searchFrameWork();
          template.verifyTemplatePreview();
        }
      );

      it(
        "Validate Tags option in ellipsis menu",
        { tags: ["@publish", "@pd33433", "@pd33429"] },
        () => {
          template.searchTemplate();
          template.searchFrameWork();
          template.verifyTemplateTags();
        }
      );

      it(
        "Verify the Publish action",
        { tags: ["@publish", "@pd33428", "@pd33429"] },
        () => {
          assessment.publishTemplate();
        }
      );

      it(
        "Verify the Un-Publish action",
        { tags: ["@un-publish", "@pd36028", "@pd36029"] },
        () => {
          template.searchTemplate();
          template.searchFrameWork();
          template.clickUnpublishTemplate();
          template.searchTemplate();
          template.searchFrameWork();
          template.verifyUnpublishTemplate();
        }
      );

      it(
        "should Publish the Template again after set as Un-Published",
        { tags: ["@publish", "@pd36028", "@pd36029"] },
        () => {
          assessment.publishTemplate();
        }
      );

      it(
        "Validate New Version option in ellipsis menu",
        { tags: ["@publish", "@new-version", "@pd33432"] },
        () => {
          template.searchTemplate();
          template.searchFrameWork();
          template.clickNewVersionTemplate();
          template.verifyNewVersionTemplate();
        }
      );
    });
})