import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
//import workflowGrpAssignee_PO from "../../support/POM/CMSModule_PO/IssueWorkflowGroupAssignee";
import IssueManagementGroup_PO from "../../support/POM/CMSModule_PO/IssueManagementGroup_PO";
import IssueWorkflowGroupAssignee_PO from "../../support/POM/CMSModule_PO/IssueWorkflowGroupAssignee";

const customerProfile = require("../../fixtures/CMSIssue/customerProfileGroup.json");
const createIssueForm = require("../../fixtures/CMSIssue/issueFormGroup.json");
const validateFields = require("../../fixtures/CMSIssue/validateFieldsGroup.json");
const validateData = require("../../fixtures/CMSIssue/dataValidationGroup.json");
const workflowProcessGroupAssignee = require("../../fixtures/CMSIssue/workflowGroupAssigne.json");
const subTaskProcessGroupAssignee = require("../../fixtures/CMSIssue/subTaskWorkflowGroup.json");
const workflowProcessGroupAssigneeCompletion = require("../../fixtures/CMSIssue/workflowCompletionGroup.json");
const rejectIssue = require("../../fixtures/CMSIssue/rejectIssueGroup.json");
const reopenIssue = require("../../fixtures/CMSIssue/reopenIssueformGroup.json");
const returnToOwner = require("../../fixtures/CMSIssue/returnToOwnerGrp.json");


describe("Group Assignee : Create, Reopen, Reject,Return to owner and Close an Issue Management Form with Complete workflow process.",
  { tags:["@regression", "@cms", "@issue-management","@group-assignee"] } , () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const issueManagementGroup_PO = new IssueManagementGroup_PO();
  const workflowGrpAssignee_PO = new IssueWorkflowGroupAssignee_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  beforeEach(()=>{
    cy.ignoreNetworkLogs()
  })

  customerProfile.forEach((test) => {
    it(test.name, {tags:"@smoke"}, () => {
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
      predictMenu_PO.administrationModuleClick();
      predictMenu_PO.customerProfileClick();
      issueManagementGroup_PO.setCustomerProfile(test.issueOwnerType, test.issueOwnerTypeName, test.customerProfileUpdatemsg);
    });

  });
  validateFields.forEach((test) => {
    it(test.name, {tags:"@smoke"}, () => {
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
      cy.wait(6000);
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      cy.wait(30000);
      issueManagementGroup_PO.validateMandatoryFields(test.errorMessageAssignee, test.errorMessageSummary, test.errorMessageIssueType, test.errorMessageSubName, test.errorMessageIssueIdenDate, test.errorMessageIssueDescrp, test.errorMessageIssueSource, test.errorMessageAgency, test.errorMessageOwner)
      cy.wait(4000);
    });

  });
  createIssueForm.forEach((test) => {
    it(test.name, {tags:"@smoke"}, () => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(30000);
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      cy.wait(30000);
      issueManagementGroup_PO.fillIssueForm(test.summary, test.IssueSource, test.Agency_Entities, test.typeOfIssue, test.issueDescription, test.audit_exam, test.issueOwner, test.rootCause, test.rootCauseDescription, test.submitterName, test.repeatFinding, test.priority, test.assigneeType, test.projectNumber, test.subjectArea, test.severity)
      cy.wait(20000);
      issueManagementGroup_PO.editIssueForm(test.description, test.comment);
      cy.wait(20000);
    });
  });
  validateData.forEach((test) => {
    it(test.name, {tags:"@smoke"}, () => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      issueManagementGroup_PO.validateData(test.taskType, test.assigneeName, test.reporter, test.IssueSource, test.Agency_Entities, test.typeOfIssue, test.issueDescription, test.audit_exam, test.issueOwner, test.rootCause, test.rootCauseDescription, test.submitterName, test.repeatFinding, test.priority, test.projectNumber, test.subjectArea, test.severity)
    })
  })
  workflowProcessGroupAssignee.forEach((test) => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      workflowGrpAssignee_PO.workflowGrpAssigneeProcess(test.acceptanceComment, test.statusAfterAccept, test.Subtasksummary, test.Description, test.prioritySubtask, test.site, test.subjectArea)
      cy.wait(3000);
    })
  })
  subTaskProcessGroupAssignee.forEach((test) => {
    it(test.name, () => {
      cy.log(
        Cypress.env("bcususername"),
        Cypress.env("bcuspassword"),
        Cypress.env("bcuskey")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("bcususername"),
        Cypress.env("bcuspassword"),
        Cypress.env("bcuskey")
      );
      loginDetails_PO.clickOn_LoginButton();
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      workflowGrpAssignee_PO.validateDataSubtask(test.issueType, test.issueSubtaskNewStatus, test.site, test.Description, test.assigneeName)
      workflowGrpAssignee_PO.subTaskWorkflowProcess(test.subtasksubmitButton, test.statusSubtask, test.actionPlanStatus, test.submittedStatus, test.acceptComment, test.subtaskcloseStatus)
      workflowGrpAssignee_PO.reopenSubtask(test.reopenStatus, test.submittedStatus, test.acceptComment, test.subtaskcloseStatus);
    })
  })
  workflowProcessGroupAssigneeCompletion.forEach((test) => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      workflowGrpAssignee_PO.workflowGrpAssigneeProcessAfterSubtask(test.resolveComment, test.issueResolveStatus, test.acceptedComment, test.issueAcceptedStatus)
      cy.wait(3000);
    })
  })
  rejectIssue.forEach((test) => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      cy.wait(30000);
      issueManagementGroup_PO.fillIssueForm(test.summary, test.IssueSource, test.Agency_Entities, test.typeOfIssue, test.issueDescription, test.audit_exam, test.issueOwner, test.rootCause, test.rootCauseDescription, test.submitterName, test.repeatFinding, test.priority, test.assigneeType, test.projectNumber, test.subjectArea, test.severity)
      cy.wait(20000);
      issueManagementGroup_PO.rejectIssueForm(test.rejectComment, test.rejectStatus)

    })
  })
});
describe("Group Assignee : Reopen an Issue management", 
  { tags:["@regression", "@cms", "@issue-management","@group-assignee"] } , () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const issueManagementGroup_PO = new IssueManagementGroup_PO();
  const workflowGrpAssignee_PO = new IssueWorkflowGroupAssignee_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.ignoreNetworkLogs();
  });

  reopenIssue.forEach((test) => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      issueManagementGroup_PO.reopenIssueForm(test.reopenButton, test.reopenComment, test.reopenStatus)

    })
  })
});

describe("Group Assignee : Reopen an Issue management Workflow", 
  { tags:["@regression", "@cms", "@issue-management","@group-assignee"] } , () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const issueManagementGroup_PO = new IssueManagementGroup_PO();
  const workflowGrpAssignee_PO = new IssueWorkflowGroupAssignee_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.ignoreNetworkLogs();
  });


  reopenIssue.forEach((test) => {
    it("Reopen an Issue management Workflow form with Group Assignee", () => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      workflowGrpAssignee_PO.workflowGrpAssigneeProcess(test.acceptanceComment, test.statusAfterAccept, test.Subtasksummary, test.Description, test.prioritySubtask, test.site, test.subjectArea)

    })
  })
});
describe("Group Assignee : Reopen an Issue management Validate Data Sub task", 
  { tags:["@regression", "@cms", "@issue-management","@group-assignee"] } , () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const issueManagementGroup_PO = new IssueManagementGroup_PO();
  const workflowGrpAssignee_PO = new IssueWorkflowGroupAssignee_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.ignoreNetworkLogs();
  });

  reopenIssue.forEach((test) => {
    it("Reopen an Issue management Validate Data Sub task form with Group Assignee", () => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      workflowGrpAssignee_PO.validateDataSubtask(test.issueType, test.issueSubtaskNewStatus, test.site, test.Description, test.assigneeName)

    })
  })
});

describe("Group Assignee : Reopen an Issue management Reject Sub Task",
  { tags:["@regression", "@cms", "@issue-management","@group-assignee"] } , () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const issueManagementGroup_PO = new IssueManagementGroup_PO();
  const workflowGrpAssignee_PO = new IssueWorkflowGroupAssignee_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.ignoreNetworkLogs();
  });


  reopenIssue.forEach((test) => {
    it("Reopen an Issue management Reject Sub Task form with Group Assignee", () => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      issueManagementGroup_PO.rejectSubTask(test.statusSubtaskreject, test.submittedStatus, test.rejectSubtaskButton, test.rejectSubtaskStatus)

    })
  })
});

describe("Group Assignee : Reopen an Issue management Sub Task Workflow Process After Reject",
  { tags:["@regression", "@cms", "@issue-management","@group-assignee"] } , () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const issueManagementGroup_PO = new IssueManagementGroup_PO();
  const workflowGrpAssignee_PO = new IssueWorkflowGroupAssignee_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.ignoreNetworkLogs();
  });

  reopenIssue.forEach((test) => {
    it("Reopen an Issue management Sub Task Workflow Process After Reject form with Group Assignee", () => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      workflowGrpAssignee_PO.subTaskWorkflowProcessAfterReject(test.subtasksubmitButton, test.statusSubtask, test.acceptComment, test.subtaskcloseStatus)

    })
  })
});
describe("Group Assignee : Reopen an Issue management Workflow After Sub task",
  { tags:["@regression", "@cms", "@issue-management","@group-assignee"] } , () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const issueManagementGroup_PO = new IssueManagementGroup_PO();
  const workflowGrpAssignee_PO = new IssueWorkflowGroupAssignee_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.ignoreNetworkLogs()
  });

  reopenIssue.forEach((test) => {
    it("Reopen an Issue management Workflow After Sub task form with Group Assignee", () => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      workflowGrpAssignee_PO.workflowGrpAssigneeProcessAfterSubtask(test.resolveComment, test.issueResolveStatus, test.acceptedComment, test.issueAcceptedStatus)

    })
  })
});

describe("Group Assignee : Create process flow for Return to Owner and complete Workflow",
  { tags:["@regression", "@cms", "@issue-management","@group-assignee"] } , () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const issueManagementGroup_PO = new IssueManagementGroup_PO();
  const workflowGrpAssignee_PO = new IssueWorkflowGroupAssignee_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.ignoreNetworkLogs()
  });


  returnToOwner.forEach((test) => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      predictMenu_PO.incidentDropdownClick();
      predictMenu_PO.issueManagementClick();
      cy.wait(30000);
      issueManagementGroup_PO.fillIssueForm(test.summary, test.IssueSource, test.Agency_Entities, test.typeOfIssue, test.issueDescription, test.audit_exam, test.issueOwner, test.rootCause, test.rootCauseDescription, test.submitterName, test.repeatFinding, test.priority, test.assigneeType, test.projectNumber, test.subjectArea, test.severity)
      cy.wait(20000);
      workflowGrpAssignee_PO.workflowGrpAssigneeProcess(test.acceptanceComment, test.statusAfterAccept, test.Subtasksummary, test.Description, test.prioritySubtask, test.site, test.subjectArea)
      cy.wait(3000);
      workflowGrpAssignee_PO.validateDataSubtask(test.issueType, test.issueSubtaskNewStatus, test.site, test.Description, test.assigneeName)
      workflowGrpAssignee_PO.subTaskWorkflowProcess(test.subtasksubmitButton, test.statusSubtask, test.actionPlanStatus, test.submittedStatus, test.acceptComment, test.subtaskcloseStatus)
 
    })
  })
});

describe("Group Assignee : Return to Owner and complete Workflow",
  { tags:["@regression", "@cms", "@issue-management","@group-assignee"] } , () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const workflowGrpAssignee_PO = new IssueWorkflowGroupAssignee_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.ignoreNetworkLogs()
  });

  returnToOwner.forEach((test) => {
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
      cy.wait(3000);
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      cy.wait(3000);
      workflowGrpAssignee_PO.workflowGrpAssigneeProcessReturnToOwner(test.resolveComment, test.issueResolveStatus, test.returntoOwnerButton, test.returntoownerComment, test.returnToOwnerStatus, test.resolveAfterRTO, test.acceptedComment, test.issueAcceptedStatus);
      cy.wait(3000);
    })
  })
});