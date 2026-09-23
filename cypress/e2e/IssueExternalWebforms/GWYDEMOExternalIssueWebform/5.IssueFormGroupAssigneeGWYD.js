import LoginDetails_PO from "../../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import GWYDGroupAssignee from "../../../support/POM/CMSModule_PO/GWYDGroupAssignee";

const customerProfile = require('../../../fixtures/CMSIssueExternalWebforms/GWYDGroupAssigneCustomerProfile.json');
const fillIssueForm = require('../../../fixtures/CMSIssueExternalWebforms/GWYDGroupAssignee.json');
const dataValidation = require('../../../fixtures/CMSIssueExternalWebforms/GWYDDataValidationGroupAssignee.json');
const validateRequiredFields = require('../../../fixtures/CMSIssueExternalWebforms/GWYDRequiredFieldsValidation.json');
const workflowProcessGroupAssignee = require('../../../fixtures/CMSIssueExternalWebforms/GWYDWorkflowGroupAssignee.json');
const subTaskProcessGroupAssignee = require('../../../fixtures/CMSIssueExternalWebforms/subTaskWorkflowGWYDGroup.json');
const workflowProcessGroupAssigneeCompletion = require('../../../fixtures/CMSIssueExternalWebforms/workflowCompletionGroupGWYD.json')
const rejectIssue = require('../../../fixtures/CMSIssueExternalWebforms/RejectIssueGroupGWYD.json')
const reopenIssue = require('../../../fixtures/CMSIssueExternalWebforms/reopenIssueGroupGWYD.json')
const returnToOwner = require('../../../fixtures/CMSIssueExternalWebforms/returntoOwnerGroupGWYD.json')


describe("GWY DEMO Group Assignee : Submit, Reopen, Reject,Return to owner and Close an Issue Management External WebForm and It's Subtask with Complete workflow process.",
  {tags:["@regression", "@cms", "@external-webform","@gwyd","@group-assignee"] }, () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const GWYDIssueForm = new GWYDGroupAssignee();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  customerProfile.forEach((test) => {
    it(test.name,{tags:"@smoke"}, () => {
      cy.log(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.adminModuleGWYD();
      predictMenu_PO.customerProfileGWYD();
      GWYDIssueForm.setCustomerProfile(test.issueOwnerType, test.issueOwnerTypeName, test.customerProfileUpdatemsg);
    });

  });

  fillIssueForm.forEach((test) => {
    it(test.name,{tags:"@smoke"}, () => {
      cy.log(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      GWYDIssueForm.fillIssueExternalForm(test.summaryForm, test.submitterName, test.responsibleDept, test.issueType, test.issueDescription, test.agencyEntities, test.severityForm, test.assignee_owner, test.issueSource, test.successMessage)

    })
  });
  dataValidation.forEach((test) => {
    it(test.name,{tags:"@smoke"}, () => {
      cy.log(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.advanceSearch();
      cy.wait(20000);
      GWYDIssueForm.openTicket(test.assigneeName);
      cy.wait(20000);
      GWYDIssueForm.issueFormDataValidation(test.summaryForm, test.submitterName, test.responsibleDept, test.issueType, test.issueDescription, test.agencyEntities, test.severityForm, test.assignee_owner, test.issueSource, test.issueFormType, test.issueStatus, test.assigneeName, test.groupAssignee)

    })
  });
  workflowProcessGroupAssignee.forEach((test) => {
    it(test.name,{tags:"@smoke"}, () => {
      cy.log(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.advanceSearch();
      GWYDIssueForm.issueFormGroupWorkflowProcess(test.acceptanceComment, test.statusAfterAccept, test.Subtasksummary, test.Description, test.prioritySubtask, test.orgHeirarchy, test.subjectArea)
      cy.wait(4000);
    })
  });
  subTaskProcessGroupAssignee.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.clickOn_LoginButton();
      GWYDIssueForm.validateDataSubtask(test.issueType, test.issueSubtaskNewStatus, test.orgHeirarchy, test.Description, test.assigneeName)
      GWYDIssueForm.subTaskWorkflowProcess(test.subtasksubmitButton, test.statusSubtask, test.actionPlanStatus, test.submittedStatus, test.acceptComment, test.subtaskcloseStatus)
      GWYDIssueForm.reopenSubtask(test.reopenStatus, test.submittedStatus, test.acceptComment, test.subtaskcloseStatus);
    })
  });
  workflowProcessGroupAssigneeCompletion.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.clickOn_LoginButton();
      GWYDIssueForm.workflowGroupAssigneeProcessAfterSubtask(test.resolveComment, test.issueResolveStatus, test.acceptedComment, test.issueAcceptedStatus)
      cy.wait(3000);
    })
  })
  rejectIssue.forEach((test) => {
    it(test.name, () => {

      cy.log(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      GWYDIssueForm.fillIssueExternalForm(test.summaryForm, test.submitterName, test.responsibleDept, test.issueType, test.issueDescription, test.agencyEntities, test.severityForm, test.assignee_owner, test.issueSource, test.successMessage)
      predictMenu_PO.advanceSearch();
      cy.wait(20000);
      GWYDIssueForm.openTicket(test.assigneeName);
      cy.wait(5000);
      GWYDIssueForm.rejectIssueForm(test.rejectComment, test.rejectStatus)

    })
  })

});
describe("GWY DEMO : Reopen an Issue management form with Group Assignee",
  {tags:["@regression", "@cms", "@external-webform","@gwyd","@group-assignee"] }, () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const GWYDIssueForm = new GWYDGroupAssignee();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  reopenIssue.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.advanceSearch();
      GWYDIssueForm.reopenIssueForm(test.reopenButton, test.reopenComment, test.reopenStatus)

    })
  })
});

describe("GWY DEMO : Reopen an Issue management Workflow form with Group Assignee",
  {tags:["@regression", "@cms", "@external-webform","@gwyd","@group-assignee"] }, () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const GWYDIssueForm = new GWYDGroupAssignee();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  reopenIssue.forEach((test) => {
    it("GWY DEMO : Reopen an Issue management Workflow form with Group Assignee", () => {
      cy.log(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.clickOn_LoginButton();
      GWYDIssueForm.workflowGroupAssigneeProcessReopen(test.acceptanceComment, test.statusAfterAccept, test.Subtasksummary, test.Description, test.prioritySubtask, test.orgHeirarchy, test.subjectArea, test.actionPlan)


    })
  })
});

describe("GWY DEMO : Reopen an Issue management Reject Sub task form with Group Assignee",
  {tags:["@regression", "@cms", "@external-webform","@gwyd","@group-assignee"] }, () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const GWYDIssueForm = new GWYDGroupAssignee();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  reopenIssue.forEach((test) => {
    it("GWY DEMO : Reopen an Issue management Reject Sub task form with Group Assignee", () => {
      cy.log(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.clickOn_LoginButton();
      GWYDIssueForm.rejectSubTask(test.statusSubtaskreject, test.submittedStatus, test.rejectSubtaskButton, test.rejectSubtaskStatus)


    })
  })
});

describe("GWY DEMO : Reopen an Issue management Sub Task Workflow Process After Reject Sub task form with Group Assignee",
  {tags:["@regression", "@cms", "@external-webform","@gwyd","@group-assignee"] }, () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const GWYDIssueForm = new GWYDGroupAssignee();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  reopenIssue.forEach((test) => {
    it("GWY DEMO : Reopen an Issue management Sub Task Workflow Process After Reject Sub task form with Group Assignee", () => {
      cy.log(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameGWYD"),
        Cypress.env("passwordGWYD"),
        Cypress.env("keyGWYD")
      );
      loginDetails_PO.clickOn_LoginButton();
      GWYDIssueForm.subTaskWorkflowProcessAfterReject(test.subtasksubmitButton, test.statusSubtask, test.acceptComment, test.subtaskcloseStatus)

    })
  })
});
