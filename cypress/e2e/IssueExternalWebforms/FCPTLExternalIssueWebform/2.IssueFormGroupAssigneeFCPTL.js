import LoginDetails_PO from "../../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import FCPTLGroupAssignee from "../../../support/POM/CMSModule_PO/FCPTLGroupAssignee";

const customerProfile = require('../../../fixtures/CMSIssueExternalWebforms/FCPTLGroupAssigneCustomerProfile.json');
const fillIssueForm = require('../../../fixtures/CMSIssueExternalWebforms/FCPTLGroupAssignee.json');
const dataValidation = require('../../../fixtures/CMSIssueExternalWebforms/FCPTLDataValidationGroupAssignee.json');
const validateRequiredFields = require('../../../fixtures/CMSIssueExternalWebforms/RequiredFieldsValidation.json');
const workflowProcessGroupAssignee = require('../../../fixtures/CMSIssueExternalWebforms/WorkflowGroupAssigneeCPTL.json')
const subTaskProcessGroupAssignee = require('../../../fixtures/CMSIssueExternalWebforms/subTaskWorkflowCPTLGroup.json')
const workflowProcessGroupAssigneeCompletion = require('../../../fixtures/CMSIssueExternalWebforms/workflowCompletionGroupCPTL.json')
const rejectIssue = require('../../../fixtures/CMSIssueExternalWebforms/RejectIssueGroupFCPTL.json');
const reopenIssue = require('../../../fixtures/CMSIssueExternalWebforms/reopenIssueGroupFCPTL.json');
const returnToOwner = require('../../../fixtures/CMSIssueExternalWebforms/returntoOwnerCPTLGrp.json')

describe("Group Assignee : Submit, Reopen, Reject,Return to owner and Close an Issue Management External WebForm and It's Subtask with Complete workflow process.", () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const FCPTLIssueForm = new FCPTLGroupAssignee();

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
      FCPTLIssueForm.issueFormDataValidation(test.summaryForm, test.submitterName, test.responsibleDept, test.issueType, test.issueDescription, test.potentialLoss, test.actualLoss, test.owner, test.issueSource, test.issueFormType, test.issueStatus);

    })
  });

  workflowProcessGroupAssignee.forEach((test) => {
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
      FCPTLIssueForm.issueFormGroupWorkflowProcess(test.acceptanceComment, test.statusAfterAccept, test.Subtasksummary, test.Description, test.prioritySubtask, test.orgHeirarchy, test.subjectArea)
      cy.wait(4000);
    })
  });
  subTaskProcessGroupAssignee.forEach((test) => {
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
      FCPTLIssueForm.validateDataSubtask(test.issueType, test.issueSubtaskNewStatus, test.orgHeirarchy, test.Description, test.assigneeName)
      FCPTLIssueForm.subTaskWorkflowProcess(test.subtasksubmitButton, test.statusSubtask, test.actionPlanStatus, test.submittedStatus, test.acceptComment, test.subtaskcloseStatus)
      FCPTLIssueForm.reopenSubtask(test.reopenStatus, test.submittedStatus, test.acceptComment, test.subtaskcloseStatus);
    })
  });
  workflowProcessGroupAssigneeCompletion.forEach((test) => {
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
      FCPTLIssueForm.workflowGroupAssigneeProcessAfterSubtask(test.resolveComment, test.issueResolveStatus, test.acceptedComment, test.issueAcceptedStatus)
    })
  });
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
  });

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
  });
  reopenIssue.forEach((test) => {
    it("FCPTL : Reopen an Issue management Workflow form with Group Assignee", () => {
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
      FCPTLIssueForm.workflowGroupAssigneeProcessReopen(test.acceptanceComment, test.statusAfterAccept, test.Subtasksummary, test.Description, test.prioritySubtask, test.orgHeirarchy, test.subjectArea)

    })
  });
  reopenIssue.forEach((test) => {
    it("FCPTL : Reopen an Issue management Reject Sub task form with Group Assignee", () => {
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
    it("FCPTL : Reopen an Issue management Sub Task Workflow Process After Reject Sub task form with Group Assignee", () => {
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


})