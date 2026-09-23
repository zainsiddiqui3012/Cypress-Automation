import Template from "../../../support/POM/Administration/Template/Template";
import assessmentData from "../../../fixtures/Administration/Assessments_SPA.json";
const assessmentDataString =
  "cypress/fixtures/Administration/Assessments_SPA.json";
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
  "Assessment Template SPA- Test Scenarios from Customer Space Add / Update Template",
  {
    tags: [
      "@pd32047",
      "@assessment",
      "@single-party-assessment",
      "@customer-space",
      "@administration",
      "@regression",
    ],
  },
  () => {
    const template = new Template();

    context("Mandatory & Character Limit cases", () => {
      before(() => {
        assessment.updateAssessmentFile("Assessments_SPA.json");
        template.updateAssessmentDataFile("Assessments_SPA.json");
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
        "Should show an error when Template Form is empty",
        { tags: ["@smoke","@pd33408", "@pd33412", "@pd33413", "@pd34947"] },
        () => {
          template.clickAddBtn();
          template.verifyMandatoryFieldsError();
        }
      );

      it(
        "Validate Assessment ID max length, should not be more than 255 char",
        { tags: ["@pd33414"] },
        () => {
          template.verifySurveyIDCharLimit();
          template.verifyLibrarySurveyIdNonEditable(true);
        }
      );
    });

    context("add and update Template from Administration", () => {
      before(() => {
          assessment.updateAssessmentFile("Assessments_SPA.json");
          template.updateAssessmentDataFile("Assessments_SPA.json");
        cy.readFile(assessmentDataString).then((dataFile) => {
          qbSummaryForm = dataFile.questionBank.qbSummaryForm;
          qbSurveyForm = dataFile.questionBank.qbSurveyForm;
        });
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
        "Should fill out the form and submit successfully",
        {
          tags: [
            "@add",
            "@smoke",
            "@pd33412",
            "@pd33410",
            "@pd33411",
            "@pd33415",
            "@pd33416",
            "@pd33417",
            "@pd33418",
            "@pd33419",
            "@pd33420",
            "@pd33421",
          ],
        },
        () => {
          assessment.addTemplate(templateSurveyForm, true, true);
          assessment.addTemplate(templateSurveyForm, false, true);
        }
      );

      it(
        "should add the section in newly created Template",
        { tags: ["@smoke","@pd33404","@pd33407"] },
        () => {
          template.verifyTemplateGridList();
          template.searchTemplate();
          template.clickSavedTemplateLink();
          template.clickSectionTab();
          assessment.addSection(templateSections, true, true);
          template.clickSectionTab();
          assessment.addSection(templateSections, false, true);
        }
      );
    });

    context("Publish Template Functionality...", { tags: ["@pd33421"] }, () => {
      before(() => {
        assessment.updateAssessmentFile("Assessments_SPA.json");
        template.updateAssessmentDataFile("Assessments_SPA.json");
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
          template.searchFrameWork(true);
          template.verifyTemplateTags();
        }
      );

      it(
        "Verify the Publish action",
        { tags: ["@publish", "@pd33428", "@pd33429","@smoke"] },
        () => {
          assessment.publishTemplate(true);
        }
      );

      it(
        "Verify the Un-Publish action",
        { tags: ["@un-publish", "@pd36028", "@pd36029"] },
        () => {
          template.searchTemplate();
          template.searchFrameWork(true);
          template.clickUnpublishTemplate();
          template.searchTemplate();
          template.searchFrameWork(true);
          template.verifyUnpublishTemplate();
        }
      );

      it(
        "should Publish the Template again after set as Un-Published",
        { tags: ["@publish", "@pd36028", "@pd36029"] },
        () => {
          assessment.publishTemplate(true);
        }
      );

      it(
        "Validate New Version option in ellipsis menu",
      { tags: ["@publish", "@new-version", "@pd33432","@smoke"] },
        () => {
          template.searchTemplate();
          template.searchFrameWork(true);
          template.clickNewVersionTemplate();
          template.verifyNewVersionTemplate();
        }
      );
    });
  })