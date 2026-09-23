import Reseller from "../../support/POM/Administration/Reseller";
import Assessment from "../../support/POM/Administration/Assessment";
import assessments from "../../fixtures/Administration/Assessments_PAP.json";
import resellers from "../../fixtures/Administration/Resellers.json";
import locators from "../../fixtures/locators.json";

const reseller = new Reseller();
const assessment = new Assessment();


describe(
  "E2E Automation of Reseller from None Space",
  {
    tags: [
      "@pd28270",
      "@predict",
      "@administration",
      "@reseller",
      "@none-space-reseller",
      "@none-space",
      "@regression"
    ]
  },
  () => {
    context(
      "Create Reseller and update its Summary from the Administration Panel",
      { tags: ["@smoke","@create-reseller","@add","@edit","@listing"] },
      () => {
        before(()=>{
          assessment.updateAssessmentFile("Assessments_PAP.json")
        })
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("kxi").none.username,
            Cypress.env("kxi").none.password,
            Cypress.env("kxi").none.key
          );
        });
        it(
          "Check for the Mendatory fields in Reseller Creation form",
          {
            tags: [
              "@smoke",
              "@pd28075",
              "@pd30425",
              "@pd30432",
              "@pd30436",
              "@pd30502",
              "@pd30431",
              "@pd30511",
              "@pd30387",
              "@pd30388",
              "@pd30433"
            ]
          },
          () => {
            cy.visitReseller();
            reseller.clickResellerFormCloseBtn();
            reseller.checkForDisabledTabs();
            reseller.checkForMandatoryFields();
          }
        );
        it(
          "check and verify that new resellers are created in Administration",
          {
            tags: [
              "@smoke",
              "@pd28076",
              "@pd30426",
              "@pd30386",
              "@pd30389",
              "@pd30391",
              "@pd30392",
              "@pd30396",
              "@pd30481",
              "@pd30397",
              "@pd30398",
              "@pd30430",
              "@pd30400",
              "@pd30428",
              "@pd30429",
              "@pd30395",
              "@pd30434",
              "@pd30445",
              "@pd30510",
              "@pd30390",
              "@pd30401"
            ]
          },
          () => {
            cy.visitReseller();
            reseller.addReseller();
          }
        );

        it("verify the details of created reseller",()=>{
          cy.visitReseller()
          reseller.verifyAddedReseller("addReseller");
        })

        it(
          "Verify that User can Update the Summary fields of the Reseller Profile",
          {
            tags: [
              "@smoke",
              "@update-reseller",
              "@pd28317",
              "@pd30440",
              "@pd30441",
              "@pd30442",
              "@pd30444",
              "@pd30449",
              "@pd30452",
              "@pd30453",
              "@pd30455",
              "@pd30456",
              "@pd30500",
              "@pd30501",
              "@pd30503",
              "@pd30447",
              "@pd30446",
              "@pd30451",
              "@pd30450",
              "@pd30443"
            ]
          },
          () => {
            reseller.editResellerSummary();
          }
        );

        it("verify the details of Updated reseller",()=>{
          cy.visitReseller()
          reseller.verifyAddedReseller("updateReseller");
        })
      }
    );
    context(
      "verify the Filters on Reseller Page",
      { tags: ["@filters", "@verify-filters"] },
      () => {
        before(()=>{
          assessment.updateAssessmentFile("Assessments_PAP.json")
        })
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("kxi").none.username,
            Cypress.env("kxi").none.password,
            Cypress.env("kxi").none.key
          );
          cy.visitReseller();
          assessment.openFilterPopup();
          cy.waitForTopMsgLoaderToDisappear(30000);
        });
        it(
          "Verify if the Cancel button closes the filter popup without applying filters.",
          { tags: "@pd30761" },
          () => {
            assessment.closeFilter();
          }
        );

        it(
          "Verify if the Clear button resets all filters.",
          { tags: "@pd30762" },
          () => {
            assessment.resetFilter();
          }
        );

        it(
          "Verify if filters persist after navigating between pages.",
          { tags: "@pd30763" },
          () => {
            assessment.verifyFiltersPersist();
          }
        );

        it(
          "Verify if clearing filters resets pagination and sorting.",
          { tags: "@pd30764" },
          () => {
            assessment.sortingPaginationReset();
          }
        );

        it(
          "Verify if users can filter by valid Name.",
          { tags: "@pd30765" },
          () => {
            assessment.filterByValidName(true);
          }
        );

        it(
          "Verify if users can not filter by invalid Name.",
          { tags: "@pd30766" },
          () => {
            assessment.filterByInvalidName(false);
          }
        );
        /**
         * skipping this test case as it was causing issue when running on headless mode as discussed,
         */
        it.skip(
          "Verify if users can filter by Created Date.",
          { tags: "@pd30767" },
          () => {
            assessment.filterByDate(true);
          }
        );

        /**
         * skipping this test case as it was causing issue when running on headless mode as discussed,
         */
        it.skip(
          "Verify if users can not filter by invalid Date.",
          { tags: "@pd30768" },
          () => {
            assessment.filterByInvalidDate();
          }
        );

        it(
          "Verify if users can filter by Is Consultant (Yes).",
          { tags: "@pd30769" },
          () => {
            assessment.applyFilter(true, true, "Consultant", "Yes");
          }
        );

        it(
          "Verify if users can filter by Is Consultant (All).",
          { tags: "@pd30770" },
          () => {
            assessment.applyFilter(true, true, "Consultant", "All");
          }
        );

        it(
          "Verify if users can filter by Is Consultant (No).",
          { tags: "@pd30771" },
          () => {
            assessment.applyFilter(false, true, "Consultant", "No");
          }
        );

        it(
          "Verify if users can filter by Status (Active).",
          { tags: "@pd30772" },
          () => {
            assessment.applyFilter(true, true, "Status", "false", "Active");
          }
        );

        it(
          "Verify if users can filter by Status (Inactive).",
          { tags: "@pd30773" },
          () => {
            assessment.applyFilter(false, true, "Status", "false", "InActive");
          }
        );
      }
    );
    context(
      "verify that User can select the Assessments from None Space and added to the Reseller",
      { tags: ["@assessments", "@questionbanks", "@assign-assessments"] },
      () => {
        before(()=>{
          assessment.updateAssessmentFile("Assessments_PAP.json")
        })
        if (!assessments.assessmentRequired) return;
        const qbSummaryForm = assessments.questionBank.qbSummaryForm;
        const qbSurveyForm = assessments.questionBank.qbSurveyForm;
        const templateSurveyForm = assessments.template.templateSurveyForm;
        const templateSections = assessments.template.sections;

        beforeEach(() => {
          if (Cypress.browser.isHeadless) {
            cy.clearCookies();
            cy.clearLocalStorage();
          }
          
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("kxi").none.username,
            Cypress.env("kxi").none.password,
            Cypress.env("kxi").none.key
          );
        });

        it("Add new content source, content library to the reseller",()=>{
          assessment.contentSource(qbSummaryForm.add.type.addContentLibrary);

          assessment.contentLibrary(qbSummaryForm.add.type.addContentLibrary);
        })

        it(
          "Add new QB from the Administration and publish Question Bank Template",
          { tags: ["@pd28319", "@add-questionbanks"] },
          () => {
            cy.visitMyQuestionBank();
            cy.waitForTopMsgLoaderToDisappear(100000);

            //Add Question Bank Summary
            assessment.addQBSummaryForm(qbSummaryForm,"add");
            cy.waitForElementToVisible(locators.administration.toastMsg, 50000);
            cy.reload();
            cy.visitMyQuestionBank();
            cy.waitForTopMsgLoaderToDisappear(100000);
            cy.waitForLoaderToDisappear("qb", 600000)
            assessment.searchQB("add");
            assessment.clickSavedQBLink("add");
            //Update Question Bank Summary
            assessment.addQBSummaryForm(qbSummaryForm, "update");

            //Add Question Surveys
            assessment.addQBSurvey(qbSummaryForm.add, qbSurveyForm);

            //publishing Question Bank Template..
            assessment.publishQB("update", false, "Assessments_PAP");
          }
        );

        it(
          "Create a New Template in the Administration Section, Associate a Questionnaire with the Template, and Publish It",
          { tags: ["@pd28320", "@pd30606"] },
          () => {
            assessment.addTemplate(templateSurveyForm);

            assessment.addSection(templateSections);
            assessment.publishTemplate();
          }
        );

        it(
          "Add a Newly Created Assessment to a Reseller",
          {
            tags: [
              "@pd28231",
              "@pd30607",
              "@pd30608",
              "@pd30609",
              "@pd30611",
              "@pd30612",
              "@pd30613",
              "@pd30614",
              "@pd30615"
            ]
          },
          () => {
            reseller.searchWithFilter("updateReseller")
            assessment.addAssessmentReseller(resellers, true);
          }
        );

        it(
          "assign newly created Questionaire to the reseller",
          {
            tags: [
              "@pd30627",
              "@pd30628",
              "@pd30629",
              "@pd30630",
              "@pd30631",
              "@pd30632",
              "@pd30633",
              "@pd30646",
              "@pd30648",
              "@pd30650"
            ]
          },
          () => {
            reseller.searchWithFilter("updateReseller")
            assessment.addQuestionaireReseller(resellers, true);
          }
        );

        it(
          "Assign Content Library to a Reseller",
          {
            tags: [
              "@pd28231",
              "@assign-content-library",
              "@pd30638",
              "@pd30639",
              "@pd30640",
              "@pd30641",
              "@pd30642",
              "@pd30643",
              "@pd30644",
              "@pd30645",
              "@pd30647",
              "@pd30649",
              "@pd30727"
            ]
          },
          () => {
            if (!qbSummaryForm.add.type.addContentLibrary.isRequired) return;
            reseller.searchWithFilter("updateReseller");
            assessment.assignContentLibraryReseller(7);
          }
        );

        it(
          "Assign Regulations & Standard to the reseller adn verify that the standards are deleted from the reseller",
          {
            tags: [
              "@pd30744",
              "@pd30745",
              "@pd30746",
              "@pd30747",
              "@pd30748",
              "@pd30749",
              "@pd30750",
              "@pd30751",
              "@pd30752",
              "@pd30753",
              "@pd30754"
            ]
          },
          () => {
            reseller.searchWithFilter("updateReseller");
            assessment.assignRegulationsStandard();
            assessment.deleteRegulationsStandard()
          }
        );

        it("Assign Regulations & Standard to reseller and saved for the customer",()=>{
          reseller.searchWithFilter("updateReseller");
          assessment.assignRegulationsStandard();
          assessment.saveRegulationsStandard();
        })

        it("Verify if the user is able to see the assigned content Library on KXI Category Tab",{tags:"@pd32517"}, ()=>{
          reseller.searchWithFilter("updateReseller");
          assessment.assignKxiCategory();
        })

        it("Verify if the user is able to see the assigned content Library on KXI Definition tab",{tags:"@pd32518"}, ()=>{
          reseller.searchWithFilter("updateReseller");
          assessment.assignKxiDefinition();
        })
      }
    );
  }
);
