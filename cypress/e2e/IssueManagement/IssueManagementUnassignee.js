import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import IssueManagementUnassignee_PO from "../../support/POM/CMSModule_PO/IssueManagementUnassignee_PO";
import IssueWorkflowUnAssignee_PO from "../../support/POM/CMSModule_PO/IssueWorkflowUnassignee";
const customerProfile = require("../../fixtures/CMSIssue/customerProfileUnassignee.json");
const createIssueForm = require("../../fixtures/CMSIssue/issueFormUnassignee.json");
const validateFields = require("../../fixtures/CMSIssue/validateFieldsUnassignee.json");
const validateData = require("../../fixtures/CMSIssue/dataValidationUnassignee.json");
const workflowProcessUnAssignee = require("../../fixtures/CMSIssue/workflowUnassignee.json");
const subTaskProcessUnAssignee = require("../../fixtures/CMSIssue/subTaskWorkflowUnassignee.json");
const workflowProcessUnAssigneeCompletion = require("../../fixtures/CMSIssue/workflowCompletionUnassignee.json");
const rejectIssue = require("../../fixtures/CMSIssue/rejectIssueUnassignee.json");
const reopenIssue = require("../../fixtures/CMSIssue/reopenIssueformUnassignee.json");
const returnToOwner = require("../../fixtures/CMSIssue/returnToOwnerUnassignee.json");
describe("Un Assignee : Create, Reopen, Reject,Return to owner and Close an Issue Management Form and It's Subtask with Complete workflow process.", () => {
    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const issueManagement_PO = new IssueManagementUnassignee_PO();
    const workflowUnassignee_PO = new IssueWorkflowUnAssignee_PO();
    
    before(function () {
      cy.clearLocalStorage();
      cy.clearCookies();
    });
    
    customerProfile.forEach((test)=> {
        it(test.name, () => {
            cy.log(
                Cypress.env("username"),
                Cypress.env("password"),
                Cypress.env("key")
              );
              loginDetails_PO.visitUrl();
              loginDetails_PO.loginDetails(
                Cypress.env("username"),
                Cypress.env("password"),
                Cypress.env("key")
              );
              loginDetails_PO.clickOn_LoginButton();
              predictMenu_PO.menuClick();
              predictMenu_PO.administrationModuleClick();
              predictMenu_PO.customerProfileClick();
              issueManagement_PO.setCustomerProfile(test.issueOwnerType,test.customerProfileUpdatemsg);
        });
        
    });
    validateFields.forEach((test)=> {
            it(test.name, () => {
                cy.log(
                    Cypress.env("username"),
                    Cypress.env("password"),
                    Cypress.env("key")
                  );
                  loginDetails_PO.visitUrl();
                  loginDetails_PO.loginDetails(
                    Cypress.env("username"),
                    Cypress.env("password"),
                    Cypress.env("key")
                  );
                  loginDetails_PO.clickOn_LoginButton();
                  predictMenu_PO.menuClick();
                  predictMenu_PO.activitiesAndTasksClick();
                  predictMenu_PO.cmsAdministrationModuleClick();
                  cy.wait(3000);
                  predictMenu_PO.incidentDropdownClick();
                  predictMenu_PO.issueManagementClick();
                  cy.wait(30000);
                  issueManagement_PO.validateMandatoryFields(test.errorMessageSummary,test.errorMessageIssueType,test.errorMessageSubName,test.errorMessageIssueIdenDate,test.errorMessageIssueDescrp,test.errorMessageIssueSource,test.errorMessageAgency,test.errorMessageOwner)
                  cy.wait(4000);
                });
         });
    createIssueForm.forEach((test) => {
        it(test.name, () => {
            cy.log(
                Cypress.env("username"),
                Cypress.env("password"),
                Cypress.env("key")
              );
              loginDetails_PO.visitUrl();
              loginDetails_PO.loginDetails(
                Cypress.env("username"),
                Cypress.env("password"),
                Cypress.env("key")
              );
              loginDetails_PO.clickOn_LoginButton();
              cy.wait(3000);
              predictMenu_PO.menuClick();
              predictMenu_PO.activitiesAndTasksClick();
              predictMenu_PO.cmsAdministrationModuleClick();
              cy.wait(3000);
              predictMenu_PO.incidentDropdownClick();
              predictMenu_PO.issueManagementClick();
              cy.wait(30000);
              issueManagement_PO.fillIssueForm(test.summary,test.IssueSource,test.Agency_Entities,test.typeOfIssue,test.issueDescription,test.audit_exam,test.issueOwner,test.rootCause,test.rootCauseDescription,test.submitterName, test.repeatFinding, test.priority, test.projectNumber, test.subjectArea, test.severity)          
              cy.wait(20000);
              issueManagement_PO.editIssueForm(test.description,test.comment);
              cy.wait(20000);
            });
    });
    validateData.forEach((test) => {
        it(test.name, () => {
            cy.log(
                Cypress.env("username"),
                Cypress.env("password"),
                Cypress.env("key")
              );
              loginDetails_PO.visitUrl();
              loginDetails_PO.loginDetails(
                Cypress.env("username"),
                Cypress.env("password"),
                Cypress.env("key")
              );
              loginDetails_PO.clickOn_LoginButton();
              cy.wait(3000);
              predictMenu_PO.menuClick();
              predictMenu_PO.activitiesAndTasksClick();
              predictMenu_PO.cmsAdministrationModuleClick();
              cy.wait(3000);
              issueManagement_PO.validateData(test.taskType,test.assigneeName,test.reporter,test.IssueSource,test.Agency_Entities,test.typeOfIssue,test.issueDescription,test.audit_exam,test.issueOwner,test.rootCause,test.rootCauseDescription,test.submitterName,test.repeatFinding,test.priority,test.projectNumber,test.subjectArea,test.severity)
        })
    })
    workflowProcessUnAssignee.forEach((test) => {
      it(test.name, () => {
        cy.log(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.clickOn_LoginButton();
        cy.wait(3000);
        predictMenu_PO.menuClick();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.cmsAdministrationModuleClick();
        cy.wait(3000);
        workflowUnassignee_PO.workflowUnAssigneeProcess(test.acceptanceComment,test.statusAfterAccept,test.Subtasksummary,test.Description,test.prioritySubtask,test.site,test.subjectArea)
        cy.wait(3000);
        })
    })
    subTaskProcessUnAssignee.forEach((test) => {
      it(test.name,() => {
        cy.log(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.clickOn_LoginButton();
        cy.wait(3000);
        predictMenu_PO.menuClick();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.cmsAdministrationModuleClick();
        cy.wait(3000);  
        workflowUnassignee_PO.validateDataSubtask(test.issueType,test.issueSubtaskNewStatus,test.site,test.Description,test.assigneeName)
        workflowUnassignee_PO.subTaskWorkflowProcess(test.subtasksubmitButton,test.statusSubtask,test.actionPlanStatus,test.submittedStatus,test.acceptComment,test.subtaskcloseStatus)
        workflowUnassignee_PO.reopenSubtask(test.reopenStatus,test.submittedStatus,test.acceptComment,test.subtaskcloseStatus);
      })
    })
    workflowProcessUnAssigneeCompletion.forEach((test) => {
      it(test.name, () => {
        cy.log(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.clickOn_LoginButton();
        cy.wait(3000);
        predictMenu_PO.menuClick();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.cmsAdministrationModuleClick();
        cy.wait(3000);
        workflowUnassignee_PO.workflowUnAssigneeProcessAfterSubtask(test.resolveComment,test.issueResolveStatus,test.acceptedComment,test.issueAcceptedStatus)
        cy.wait(3000);
        })
    })
    rejectIssue.forEach((test) => {
      it(test.name, () => {
        cy.log(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.clickOn_LoginButton();
        cy.wait(3000);
        predictMenu_PO.menuClick();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.cmsAdministrationModuleClick();
        cy.wait(3000);
        predictMenu_PO.incidentDropdownClick();
        predictMenu_PO.issueManagementClick();
        cy.wait(30000);
        issueManagement_PO.fillIssueForm(test.summary,test.IssueSource,test.Agency_Entities,test.typeOfIssue,test.issueDescription,test.audit_exam,test.issueOwner,test.rootCause,test.rootCauseDescription,test.submitterName, test.repeatFinding, test.priority, test.projectNumber, test.subjectArea, test.severity)          
        cy.wait(20000);
        issueManagement_PO.rejectIssueForm(test.rejectComment,test.rejectStatus)
        
        })
    })
    reopenIssue.forEach((test) => {
      it(test.name, () => {
        cy.log(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.clickOn_LoginButton();
        cy.wait(3000);
        predictMenu_PO.menuClick();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.cmsAdministrationModuleClick();
        cy.wait(30000);
        issueManagement_PO.reopenIssueForm(test.reopenButton,test.reopenStatus)
        workflowUnassignee_PO.workflowUnAssigneeProcessReopen(test.acceptanceComment,test.statusAfterAccept,test.Subtasksummary,test.Description,test.prioritySubtask,test.site,test.subjectArea)
        cy.wait(3000);
        workflowUnassignee_PO.validateDataSubtask(test.issueType,test.issueSubtaskNewStatus,test.site,test.Description,test.assigneeName)
        issueManagement_PO.rejectSubTask(test.statusSubtaskreject,test.submittedStatus,test.rejectSubtaskButton,test.rejectSubtaskStatus)        
        workflowUnassignee_PO.subTaskWorkflowProcessAfterReject(test.subtasksubmitButton,test.statusSubtask,test.acceptComment,test.subtaskcloseStatus)
        workflowUnassignee_PO.workflowUnAssigneeProcessAfterSubtask(test.resolveComment,test.issueResolveStatus,test.acceptedComment,test.issueAcceptedStatus)
        cy.wait(3000);
      })
    })
    returnToOwner.forEach((test) => {
      it(test.name, () => {
        cy.log(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );
        loginDetails_PO.clickOn_LoginButton();
        cy.wait(3000);
        predictMenu_PO.menuClick();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.cmsAdministrationModuleClick();
        cy.wait(3000);
        predictMenu_PO.incidentDropdownClick();
        predictMenu_PO.issueManagementClick();
        cy.wait(30000);
        issueManagement_PO.fillIssueForm(test.summary,test.IssueSource,test.Agency_Entities,test.typeOfIssue,test.issueDescription,test.audit_exam,test.issueOwner,test.rootCause,test.rootCauseDescription,test.submitterName, test.repeatFinding, test.priority, test.projectNumber, test.subjectArea, test.severity)          
        cy.wait(20000);
        workflowUnassignee_PO.workflowUnAssigneeProcess(test.acceptanceComment,test.statusAfterAccept,test.Subtasksummary,test.Description,test.prioritySubtask,test.site,test.subjectArea)
        cy.wait(3000);
        workflowUnassignee_PO.validateDataSubtask(test.issueType,test.issueSubtaskNewStatus,test.site,test.Description,test.assigneeName)
        workflowUnassignee_PO.subTaskWorkflowProcess(test.subtasksubmitButton,test.statusSubtask,test.actionPlanStatus,test.submittedStatus,test.acceptComment,test.subtaskcloseStatus)
        workflowUnassignee_PO.workflowUnAssigneeProcessReturnToOwner(test.resolveComment,test.issueResolveStatus,test.returntoOwnerButton,test.returntoownerComment,test.returnToOwnerStatus,test.resolveAfterRTO,test.acceptedComment,test.issueAcceptedStatus);
        cy.wait(3000);
      })
    })
      
})