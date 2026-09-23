import LoginDetails_PO from "../../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import GWYDSingleAssignee from "../../../support/POM/CMSModule_PO/GWYDSingleAssignee";

const customerProfile = require('../../../fixtures/CMSIssueExternalWebforms/GWYDSingleAssigneCustomerProfile.json');
const fillIssueForm = require('../../../fixtures/CMSIssueExternalWebforms/GWYDSingleAssignee.json');
const dataValidation = require('../../../fixtures/CMSIssueExternalWebforms/GWYDDataValidationSingleAssignee.json');
const validateRequiredFields = require('../../../fixtures/CMSIssueExternalWebforms/GWYDRequiredFieldsValidation.json');
const workflowProcessSingleAssignee = require('../../../fixtures/CMSIssueExternalWebforms/GWYDWorkflowSingleAssignee.json');
const subTaskProcessSingleAssignee = require('../../../fixtures/CMSIssueExternalWebforms/subTaskWorkflowGWYDSingle.json');
const workflowProcessSingleAssigneeCompletion = require('../../../fixtures/CMSIssueExternalWebforms/workflowCompletionSingleGWYD.json')
const rejectIssue = require('../../../fixtures/CMSIssueExternalWebforms/RejectIssueSingleGWYD.json')
const reopenIssue = require('../../../fixtures/CMSIssueExternalWebforms/reopenIssueSingleGWYD.json')
const returnToOwner = require('../../../fixtures/CMSIssueExternalWebforms/returntoOwnerSingleGWYD.json')


describe("GWY DEMO Single Assignee : Submit, Reopen, Reject,Return to owner and Close an Issue Management External WebForm and It's Subtask with Complete workflow process.",
  {tags:["@regression", "@cms", "@external-webform","@gwyd","@single-assignee"] }, () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const GWYDIssueForm = new GWYDSingleAssignee();

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

  validateRequiredFields.forEach((test) => {
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
      cy.visitCMSDashboard()
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      GWYDIssueForm.validateMandatoryFields(test.assigneeError, test.errorMessageSummary, test.errorMessageSubName, test.errorMessageIssueIdentificationDate, test.errorMessageIssueDescrp, test.errorMessageResDept, test.errorMessageOwners)
    })
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
      cy.visitCMSDashboard()
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      GWYDIssueForm.fillIssueExternalForm(test.summaryForm, test.responsibleDept, test.issueType, test.issueDescription, test.agencyEntities, test.severityForm, test.submitterName, test.assignee_owner, test.issueSource, test.successMessage)

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
      cy.visitCMSDashboard()
      predictMenu_PO.advanceSearch();
      cy.wait(20000);
      GWYDIssueForm.openTicket(test.assigneeName);
      cy.wait(20000);
      GWYDIssueForm.issueFormDataValidation(test.summaryForm, test.submitterName, test.responsibleDept, test.issueType, test.issueDescription, test.agencyEntities, test.severityForm, test.assignee_owner, test.issueSource, test.issueFormType, test.issueStatus)

    })
  });


  workflowProcessSingleAssignee.forEach((test) => {
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
      cy.visitCMSDashboard()
      cy.wait(30000);
      predictMenu_PO.advanceSearch();
      GWYDIssueForm.issueFormSingleWorkflowProcess(test.acceptanceComment, test.statusAfterAccept, test.Subtasksummary, test.Description, test.prioritySubtask, test.orgHeirarchy, test.subjectArea)
      cy.wait(4000);
    })
  });

  subTaskProcessSingleAssignee.forEach((test) => {
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
      cy.visitCMSDashboard()
      cy.wait(3000);
      GWYDIssueForm.validateDataSubtask(test.issueType, test.issueSubtaskNewStatus, test.orgHeirarchy, test.Description, test.assigneeName)
      GWYDIssueForm.subTaskWorkflowProcess(test.subtasksubmitButton, test.statusSubtask, test.actionPlanStatus, test.submittedStatus, test.acceptComment, test.subtaskcloseStatus)
      GWYDIssueForm.reopenSubtask(test.reopenStatus, test.submittedStatus, test.acceptComment, test.subtaskcloseStatus);
    })
  });

  workflowProcessSingleAssigneeCompletion.forEach((test) => {
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
      cy.visitCMSDashboard()
      GWYDIssueForm.workflowSingleAssigneeProcessAfterSubtask(test.resolveComment, test.issueResolveStatus, test.acceptedComment, test.issueAcceptedStatus)
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
      cy.visitCMSDashboard()
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      GWYDIssueForm.fillIssueExternalForm(test.summaryForm, test.responsibleDept, test.issueType, test.issueDescription, test.agencyEntities, test.severityForm, test.submitterName, test.assignee_owner, test.issueSource, test.successMessage)
      cy.wait(20000);
      predictMenu_PO.advanceSearch();
      cy.wait(20000);
      GWYDIssueForm.openTicket(test.assigneeName);
      cy.wait(5000);
      GWYDIssueForm.rejectIssueForm(test.rejectComment, test.rejectStatus)

    })
  })

  describe("GWY DEMO : Reopen an Issue management form with Single Assignee", () => {
    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const GWYDIssueForm = new GWYDSingleAssignee();

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
        cy.visitCMSDashboard()
        predictMenu_PO.advanceSearch();
        GWYDIssueForm.reopenIssueForm(test.reopenButton, test.reopenComment, test.reopenStatus);

      })

    })
  })
});

describe("GWY DEMO : Reopen an Issue management Workflow form with Single Assignee",
  {tags:["@regression", "@cms", "@external-webform","@gwyd","@single-assignee"] }, () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const GWYDIssueForm = new GWYDSingleAssignee();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  reopenIssue.forEach((test) => {
    it("GWY DEMO : Reopen an Issue management Workflow form with Single Assignee", () => {
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
      cy.visitCMSDashboard()
      GWYDIssueForm.workflowSingleAssigneeProcessReopen(test.acceptanceComment, test.statusAfterAccept, test.Subtasksummary, test.Description, test.prioritySubtask, test.orgHeirarchy, test.subjectArea)

    })
  })
});

describe("GWY DEMO : Reopen an Issue management Reject Sub task form with Single Assignee",
  {tags:["@regression", "@cms", "@external-webform","@gwyd","@single-assignee"] }, () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const GWYDIssueForm = new GWYDSingleAssignee();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  reopenIssue.forEach((test) => {
    it("GWY DEMO : Reopen an Issue management Reject Sub task form with Single Assignee", () => {
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
      cy.visitCMSDashboard()
      GWYDIssueForm.rejectSubTask(test.statusSubtaskreject, test.submittedStatus, test.rejectSubtaskButton, test.rejectSubtaskStatus)

    })
  })
});

describe("GWY DEMO : Reopen an Issue management Sub taskWorkflow Process After Reject form with Single Assignee",
  {tags:["@regression", "@cms", "@external-webform","@gwyd","@single-assignee"] }, () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const GWYDIssueForm = new GWYDSingleAssignee();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  reopenIssue.forEach((test) => {
    it("GWY DEMO : Reopen an Issue management Reject Sub task form with Single Assignee", () => {
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
      cy.visitCMSDashboard()
      GWYDIssueForm.subTaskWorkflowProcessAfterReject(test.subtasksubmitButton, test.statusSubtask, test.acceptComment)
    })
  })
});