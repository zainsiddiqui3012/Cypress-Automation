import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import Assessment_PO from "../../support/POM/CMSModule_PO/Assessment_PO";

/// <reference types= "cypress" />

////Data Provider ///
// const controlDefinition = require('../../fixtures/RiskModule/Control_Taxonomy/controlDefinition.json')
const assessment = require("../../fixtures/CMSModule/AssessmentsSingleAssigneeTemplate1.json");
const Workflow = require("../../fixtures/CMSModule/WorkflowTemplate1.json");
const assessmentTemplate2 = require("../../fixtures/CMSModule/AssessmentSingleAssigneeTemplate2.json");
const WorkflowTemplate2 = require("../../fixtures/CMSModule/Workflow_Template2.json");
const assessmentTemplate3 = require("../../fixtures/CMSModule/AssessmentSingleAssigneeTemplate3.json");
const WorkflowTemplate3 = require("../../fixtures/CMSModule/Workflow_Template3.json");
//const JiraTicket = require('../../fixtures/CMSModule/TicketId.json')
// const validateDataTemplate2 = require('../../fixtures/CMSModule/validateDataSingleTemp2.json')
// const validateDataTemplate3 = require('../../fixtures/CMSModule/validateDataSingleTemp3.json')

describe("Single Assignee Assessment Workflow Automation", () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const assessment_PO = new Assessment_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  assessment.forEach((test) => {
    it(test.name, () => {
      //login
      //cy.session('login', () => {
      cy.log(
        Cypress.env("cmsusername"),
        Cypress.env("cmspassword"),
        Cypress.env("cmskey")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("cmsusername"),
        Cypress.env("cmspassword"),
        Cypress.env("cmskey")
      );
      loginDetails_PO.clickOn_LoginButton();
      //  })
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      predictMenu_PO.tasksDropdownClick();
      predictMenu_PO.assessmentSelectClick();
      cy.wait(40000);

      assessment_PO.fillForm(
        test.summary,
        test.assessmentTemplate,
        test.assessmentCategory,
      );
      cy.wait(40000);
      assessment_PO.editDetails(test.description);
      cy.wait(30000);
      assessment_PO.validateDataEdit(
        test.description,
        test.singleAssigneename,
        test.Recurrence
      );
      cy.wait(30000);
      //cy.visit('https://stage.360factors.com/predict360/casemanagement.do?key=BCUS-24127');
    });

    //workflow and submit template
    Workflow.forEach((test) => {
      it(test.name, () => {
       
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(
          Cypress.env("cmsusername"),
          Cypress.env("cmspassword"),
          Cypress.env("cmskey")
        );
        loginDetails_PO.clickOn_LoginButton();
        predictMenu_PO.menuClick();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.cmsAdministrationModuleClick();
        cy.wait(30000);
        assessment_PO.advanceSearchClick();
       cy.wait(40000);
        assessment_PO.workflowProcessTemplate1(
          test.statusInprogress,
          test.q1Response,
          test.q2Response,
          test.templateDraft_status,
          test.templateSubmit_status
        );
        cy.wait(50000);
        assessment_PO.reviewAssessment(
          test.reviewMessage,
          test.reviewComment,
          test.reviewStatus,
          test.q1Response,
          test.q2Response
        );
        cy.wait(40000);
        assessment_PO.completeAssessment(
          test.statusComplete,
          test.Close_Reopen
        );
      });
    });
  });


  assessmentTemplate2.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("cmsusername"),
        Cypress.env("cmspassword"),
        Cypress.env("cmskey")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("cmsusername"),
        Cypress.env("cmspassword"),
        Cypress.env("cmskey")
      );
      loginDetails_PO.clickOn_LoginButton();

      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      predictMenu_PO.tasksDropdownClick();
      predictMenu_PO.assessmentSelectClick();
      cy.wait(40000);
      assessment_PO.fillForm(
        test.summary,
        test.assessmentTemplate,
        test.assessmentCategory
      );
      cy.wait(30000);
      assessment_PO.editDetails(test.description);
      cy.wait(30000);
      assessment_PO.validateDataEdit(
        test.description,
        test.singleAssigneename,
        test.Recurrence
      );
      cy.wait(30000);
    });
    WorkflowTemplate2.forEach((test) => {
      it(test.name, () => {
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(
          Cypress.env("cmsusername"),
          Cypress.env("cmspassword"),
          Cypress.env("cmskey")
        );
        loginDetails_PO.clickOn_LoginButton();
        predictMenu_PO.menuClick();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.cmsAdministrationModuleClick();
        cy.wait(40000);
        assessment_PO.workflowProcessTemplate2(
          test.statusInprogress,
          test.q1Response,
          test.q2Response,
          test.q3Response,
          test.q4Response,
          test.templateSubmit_status
        );
        cy.wait(20000);
        assessment_PO.reviewAssessmentTemplate2(
          test.reviewMessage,
          test.reviewComment,
          test.reviewStatus
        );
        cy.wait(40000);
        assessment_PO.completeAssessment(test.statusComplete, test.Close_Reopen);
        cy.wait(40000);
        //reopened assessment workflow again
        assessment_PO.reopenAssessment(test.statusReopen);
        cy.wait(40000);
        assessment_PO.workflowProcessAfterReopen(
          test.statusInprogress,
          test.templateSubmit_status
        );
        cy.wait(40000);
        assessment_PO.reviewAssessmentTemplate2(
          test.reviewMessage,
          test.reviewComment,
          test.reviewStatus
        );
        cy.wait(40000);
        assessment_PO.closeAfterReopen(test.statusComplete, test.CloseTemplate2);
      });
    });
  });
  assessmentTemplate3.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("cmsusername"),
        Cypress.env("cmspassword"),
        Cypress.env("cmskey")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("cmsusername"),
        Cypress.env("cmspassword"),
        Cypress.env("cmskey")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      predictMenu_PO.tasksDropdownClick();
      predictMenu_PO.assessmentSelectClick();
      cy.wait(40000);
      assessment_PO.fillForm(
        test.summary,
        test.assessmentTemplate,
        test.assessmentCategory
      );
      cy.wait(30000);
      assessment_PO.editDetails(test.description);
      cy.wait(30000);
      assessment_PO.validateDataEdit(
        test.description,
        test.singleAssigneename,
        test.Recurrence
      );
      cy.wait(30000);
      //assessment_PO.submitTemplate3(test.statusInprogress,test.q1Response,test.q2Response,test.q2Response2,test.q3Response,test.q4Response,test.q5Response,test.q6Response,test.q7Response,test.q8Response)
    });
    WorkflowTemplate3.forEach((test) => {
      it(test.name, () => {
        cy.log(
          Cypress.env("cmsusername"),
          Cypress.env("cmspassword"),
          Cypress.env("cmskey")
        );
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(
          Cypress.env("cmsusername"),
          Cypress.env("cmspassword"),
          Cypress.env("cmskey")
        );
        loginDetails_PO.clickOn_LoginButton();
        predictMenu_PO.menuClick();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.cmsAdministrationModuleClick();
        cy.wait(40000);
        assessment_PO.workflowProcessTemplate3(
          test.statusInprogress,
          test.q1Response,
          test.q2Response,
          test.q2Response2,
          test.q3Response,
          test.q4Response,
          test.q5Response,
          test.q6Response,
          test.q7Response,
          test.q8Response,
          test.templateSubmit_status
        );
        cy.wait(40000);
        assessment_PO.reviewAssessmentTemplate2(
          test.reviewMessage,
          test.reviewComment,
          test.reviewStatus
        );
        cy.wait(40000);
        assessment_PO.completeAssessment(
          test.statusComplete,
          test.Close_Reopen
        );
      });
    });
  });
  assessment.forEach((test) => {
    it(test.name2, () => {
      //login
      //cy.session('login', () => {
      cy.log(
        Cypress.env("cmsusername"),
        Cypress.env("cmspassword"),
        Cypress.env("cmskey")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("cmsusername"),
        Cypress.env("cmspassword"),
        Cypress.env("cmskey")
      );
      loginDetails_PO.clickOn_LoginButton();
      //  })
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      predictMenu_PO.tasksDropdownClick();
      predictMenu_PO.assessmentSelectClick();
      cy.wait(40000);

      assessment_PO.fillFormUnassignee(test.Unassignee, test.errorMessage);
      cy.wait(40000);
    });
  });
});
