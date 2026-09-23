import LoginDetails_PO from "../../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import FCPTLSingleAssignee from "../../../support/POM/CMSModule_PO/FCPTLSingleAssignee";

const customerProfile = require('../../../fixtures/CMSIssueExternalWebforms/FCPTLSingleAssigneCustomerProfile.json');
const fillIssueForm = require('../../../fixtures/CMSIssueExternalWebforms/FCPTLSingleAssignee.json');
const dataValidation = require('../../../fixtures/CMSIssueExternalWebforms/FCPTLDataValidationSingleAssignee.json');
const validateRequiredFields = require('../../../fixtures/CMSIssueExternalWebforms/RequiredFieldsValidation.json');
const workflowProcessSingleAssignee = require('../../../fixtures/CMSIssueExternalWebforms/WorkflowSingleAssignee.json');
const subTaskProcessSingleAssignee = require('../../../fixtures/CMSIssueExternalWebforms/subTaskWorkflowCPTLSingle.json');
const workflowProcessSingleAssigneeCompletion = require('../../../fixtures/CMSIssueExternalWebforms/workflowCompletionSingleCPTL.json')
const rejectIssue = require('../../../fixtures/CMSIssueExternalWebforms/RejectIssueSingleFCPTL.json')
const reopenIssue = require('../../../fixtures/CMSIssueExternalWebforms/reopenIssueSingleFCPTL.json')
const returnToOwner = require('../../../fixtures/CMSIssueExternalWebforms/returntoOwnerCPTL.json')

describe("Single Assignee : Submit, Reopen, Reject,Return to owner and Close an Issue Management External WebForm and It's Subtask with Complete workflow process.", () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const FCPTLIssueForm = new FCPTLSingleAssignee();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  customerProfile.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.adminModuleCPTL();
      predictMenu_PO.customerProfileCPTL();
      FCPTLIssueForm.setCustomerProfile(test.issueOwnerType, test.issueOwnerTypeName, test.customerProfileUpdatemsg);
    });

  });
  validateRequiredFields.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      FCPTLIssueForm.validateMandatoryFields(test.assigneeError, test.errorMessageTypeOfIssue, test.errorMessageSummary, test.errorMessageSubName, test.errorMessageIssueIdentificationDate, test.errorMessageIssueDescrp, test.errorMessageIssueSource, test.errorMessageOwners)
    })
  });

  fillIssueForm.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      FCPTLIssueForm.fillIssueExternalForm(test.summaryForm, test.IssueSource, test.issueDescription, test.issueType, test.owner, test.submitterName, test.responsibleDept, test.potentialLoss, test.actualLoss, test.rootCause)

    })
  });
  dataValidation.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      cy.wait(20000);
      predictMenu_PO.advanceSearch();
      cy.wait(20000);
      FCPTLIssueForm.openTicket(test.assigneeName);
      cy.wait(20000);
      FCPTLIssueForm.issueFormDataValidation(test.summaryForm, test.submitterName, test.responsibleDept, test.issueType, test.issueDescription, test.potentialLoss, test.actualLoss, test.owner, test.issueSource, test.issueFormType, test.issueStatus)

    })
  });
  workflowProcessSingleAssignee.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      cy.wait(30000);
      predictMenu_PO.advanceSearch();
      FCPTLIssueForm.issueFormSingleWorkflowProcess(test.acceptanceComment, test.statusAfterAccept, test.Subtasksummary, test.Description, test.prioritySubtask, test.orgHeirarchy, test.subjectArea)
      cy.wait(4000);
    })
  });
  subTaskProcessSingleAssignee.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      FCPTLIssueForm.validateDataSubtask(test.issueType, test.issueSubtaskNewStatus, test.orgHeirarchy, test.Description, test.assigneeName)
      FCPTLIssueForm.subTaskWorkflowProcess(test.subtasksubmitButton, test.statusSubtask, test.actionPlanStatus, test.submittedStatus, test.acceptComment, test.subtaskcloseStatus)
      FCPTLIssueForm.reopenSubtask(test.reopenStatus, test.submittedStatus, test.acceptComment, test.subtaskcloseStatus);
    })
  });
  workflowProcessSingleAssigneeCompletion.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      FCPTLIssueForm.workflowSingleAssigneeProcessAfterSubtask(test.resolveComment, test.issueResolveStatus, test.acceptedComment, test.issueAcceptedStatus)
      cy.wait(3000);
    })
  })
  rejectIssue.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      FCPTLIssueForm.fillIssueExternalForm(test.summaryForm, test.IssueSource, test.issueDescription, test.issueType, test.owner, test.submitterName, test.responsibleDept, test.potentialLoss, test.actualLoss, test.rootCause)
      cy.wait(20000);
      predictMenu_PO.advanceSearch();
      cy.wait(20000);
      FCPTLIssueForm.openTicket(test.assigneeName);
      cy.wait(5000);
      FCPTLIssueForm.rejectIssueForm(test.rejectComment, test.rejectStatus)

    })
  })
  reopenIssue.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.advanceSearch();
      FCPTLIssueForm.reopenIssueForm(test.reopenButton, test.reopenStatus)

    })
  })

  reopenIssue.forEach((test) => {
    it("FCPTL : Reopen an Issue management Workflow form with Single Assignee", () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      FCPTLIssueForm.workflowSingleAssigneeProcessReopen(test.acceptanceComment, test.statusAfterAccept, test.Subtasksummary, test.Description, test.prioritySubtask, test.orgHeirarchy, test.subjectArea)

    })
  });

  reopenIssue.forEach((test) => {
    it("FCPTL : Reopen an Issue management Reject Sub task form with Single Assignee", () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      FCPTLIssueForm.rejectSubTask(test.statusSubtaskreject, test.submittedStatus, test.rejectSubtaskButton, test.rejectSubtaskStatus)
    })
  });


  reopenIssue.forEach((test) => {
    it("FCPTL : Reopen an Issue management Sub Task Workflow Process After Reject Sub task form with Single Assignee", () => {
      cy.log(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("usernameCPTL"),
        Cypress.env("passwordCPTL"),
        Cypress.env("keyCPTL")
      );
      loginDetails_PO.clickOn_LoginButton();
      FCPTLIssueForm.subTaskWorkflowProcessAfterReject(test.subtasksubmitButton, test.statusSubtask, test.acceptComment, test.subtaskcloseStatus)

    })
  });


});
