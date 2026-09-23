import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import IssueManagement_PO from "../../support/POM/CMSModule_PO/IssueManagement_PO";
import IssueWorkflowSingleAssignee_PO from "../../support/POM/CMSModule_PO/IssueWorkflowSingleAssignee";

const customerProfile = require("../../fixtures/CMSIssue/customerProfilesingle.json");
const createIssueForm = require("../../fixtures/CMSIssue/issueFormSingle.json");
const validateFields = require("../../fixtures/CMSIssue/validateFieldsSingle.json");
const validateData = require("../../fixtures/CMSIssue/dataValidationsingle.json");
const workflowProcessSingleAssignee = require("../../fixtures/CMSIssue/workflowSingleAssigne.json");
const subTaskProcessSingleAssignee = require("../../fixtures/CMSIssue/subTaskWorkflowSingle.json");
const workflowProcessSingleAssigneeCompletion = require("../../fixtures/CMSIssue/workflowCompletionSingle.json");
const rejectIssue = require("../../fixtures/CMSIssue/rejectIssue.json");
const reopenIssue = require("../../fixtures/CMSIssue/reopenIssueform.json");
const returnToOwner = require("../../fixtures/CMSIssue/rejectSubtaskIssue.json");

const filename = "cypress/fixtures/CMSIssue/TicketId.txt";
const filename2 = "cypress/fixtures/CMSIssue/TicketIdSubtaskSingle.txt";

const loginDetails_PO = new LoginDetails_PO();
const predictMenu_PO = new PredictMenu_PO();
const issueManagement_PO = new IssueManagement_PO();
const workflowsingleAssignee_PO = new IssueWorkflowSingleAssignee_PO();

describe(
  "Single Assignee : Create, Reopen, Reject,Return to owner and Close an Issue Management Form and It's Subtask with Complete workflow process.",
  { tags: ["@regression", "@cms", "@issue-management", "@single-assignee"] },
  () => {
    beforeEach(() => {
      cy.ignoreNetworkLogs();
      cy.loginWithSession(
        "BCUS User session",
        Cypress.env("bcususername"),
        Cypress.env("bcuspassword"),
        Cypress.env("bcuskey"),
      );
      cy.visitCMSDashboard();
      predictMenu_PO.menuClick();
    });

    customerProfile.forEach((test) => {
      it(test.name, { tags: ["@smoke", "@pd51723"] }, () => {
        predictMenu_PO.administrationModuleClick();
        predictMenu_PO.customerProfileClick();
        issueManagement_PO.setCustomerProfile(
          test.issueOwnerType,
          test.issueOwnerTypeName,
          test.customerProfileUpdatemsg,
        );
      });
    });

    validateFields.forEach((test) => {
      it(test.name, { tags: ["@smoke", "@pd51724"] }, () => {
        cy.get(".navbar").contains("Compliance Management").click();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.incidentDropdownClick();
        predictMenu_PO.issueManagementClick();
        issueManagement_PO.validateMandatoryFields(
          test.errorMessageAssignee,
          test.errorMessageSummary,
          test.errorMessageIssueType,
          test.errorMessageSubName,
          test.errorMessageIssueIdenDate,
          test.errorMessageIssueDescrp,
          test.errorMessageIssueSource,
          test.errorMessageAgency,
          test.errorMessageOwner,
        );
      });
    });

    createIssueForm.forEach((test) => {
      it(test.name, { tags: ["@smoke", "@pd51725", "@pd51726"] }, () => {
        cy.get(".navbar").contains("Compliance Management").click();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.incidentDropdownClick();
        predictMenu_PO.issueManagementClick();
        issueManagement_PO.fillIssueForm(
          test.summary,
          test.IssueSource,
          test.Agency_Entities,
          test.typeOfIssue,
          test.issueDescription,
          test.audit_exam,
          test.issueOwner,
          test.rootCause,
          test.rootCauseDescription,
          test.submitterName,
          test.repeatFinding,
          test.priority,
          test.assigneeType,
          test.projectNumber,
          test.subjectArea,
          test.severity,
          test.responsibleDepartment,
        );
        issueManagement_PO.editIssueForm(test.description, test.comment);
        issueManagement_PO.openEditIssueForm(test.comment);
      });
    });

    validateData.forEach((test) => {
      it(test.name, { tags: "@smoke" }, () => {
        cy.get(".navbar").contains("Compliance Management").click();
        predictMenu_PO.activitiesAndTasksClick();
        issueManagement_PO.validateData(
          test.taskType,
          test.assigneeName,
          test.reporter,
          test.IssueSource,
          test.Agency_Entities,
          test.typeOfIssue,
          test.issueDescription,
          test.audit_exam,
          test.issueOwner,
          test.rootCause,
          test.rootCauseDescription,
          test.submitterName,
          test.repeatFinding,
          test.priority,
          test.projectNumber,
          test.subjectArea,
          test.severity,
        );
      });
    });

    workflowProcessSingleAssignee.forEach((test) => {
      it(test.name, { tags: ["@smoke", "@pd51727"] }, () => {
        cy.get(".navbar").contains("Compliance Management").click();
        predictMenu_PO.activitiesAndTasksClick();
        workflowsingleAssignee_PO.searchTicketNumber(filename);
        workflowsingleAssignee_PO.workflowSingleAssigneeProcess(
          test.acceptanceComment,
          test.statusAfterAccept,
          test.Subtasksummary,
          test.Description,
          test.prioritySubtask,
          test.site,
          test.subjectArea,
        );
      });
    });

    subTaskProcessSingleAssignee.forEach((test) => {
      it(test.name, { tags: ["@smoke", "@pd51728", "@52117"] }, () => {
        cy.get(".navbar").contains("Compliance Management").click();
        predictMenu_PO.activitiesAndTasksClick();
        workflowsingleAssignee_PO.searchTicketNumber(filename2);
        workflowsingleAssignee_PO.validateDataSubtask(
          test.issueType,
          test.issueSubtaskNewStatus,
          test.site,
          test.Description,
          test.assigneeName,
        );
        workflowsingleAssignee_PO.subTaskWorkflowProcess(
          test.subtasksubmitButton,
          test.statusSubtask,
          test.actionPlanStatus,
          test.submittedStatus,
          test.subtaskcloseStatus,
        );
        workflowsingleAssignee_PO.reopenSubtask(
          test.reopenStatus,
          test.submittedStatus,
          test.subtaskcloseStatus,
        );
      });
    });

    workflowProcessSingleAssigneeCompletion.forEach((test) => {
      it(
        test.name,
        { tags: ["@smoke", "@pd51729", "@52118", "@52119", "@52120"] },
        () => {
          cy.get(".navbar").contains("Compliance Management").click();
          predictMenu_PO.activitiesAndTasksClick();
          workflowsingleAssignee_PO.searchTicketNumber(filename);
          workflowsingleAssignee_PO.workflowSingleAssigneeProcessAfterSubtask(
            test.resolveComment,
            test.issueResolveStatus,
            test.acceptedComment,
            test.issueAcceptedStatus,
          );
        },
      );
    });

    rejectIssue.forEach((test) => {
      it(test.name, { tags: ["@smoke", "@pd51730"] }, () => {
        cy.get(".navbar").contains("Compliance Management").click();
        predictMenu_PO.activitiesAndTasksClick();
        predictMenu_PO.incidentDropdownClick();
        predictMenu_PO.issueManagementClick();
        issueManagement_PO.fillIssueForm(
          test.summary,
          test.IssueSource,
          test.Agency_Entities,
          test.typeOfIssue,
          test.issueDescription,
          test.audit_exam,
          test.issueOwner,
          test.rootCause,
          test.rootCauseDescription,
          test.submitterName,
          test.repeatFinding,
          test.priority,
          test.assigneeType,
          test.projectNumber,
          test.subjectArea,
          test.severity,
          test.responsibleDepartment,
        );
        issueManagement_PO.rejectIssueForm(
          test.rejectComment,
          test.rejectStatus,
        );
      });
    });
  },
);

describe(
  "Single Assignee : Reopen an Issue management",
  { tags: ["@regression", "@cms", "@issue-management", "@single-assignee"] },
  () => {
    beforeEach(() => {
      cy.loginWithSession(
        "BCUS User session",
        Cypress.env("bcususername"),
        Cypress.env("bcuspassword"),
        Cypress.env("bcuskey"),
      );
      cy.visitCMSDashboard();
      predictMenu_PO.menuClick();
    });

    reopenIssue.forEach((test) => {
      it(test.name, () => {
        cy.get(".navbar").contains("Compliance Management").click();
        predictMenu_PO.activitiesAndTasksClick();
        workflowsingleAssignee_PO.searchTicketNumber(filename);
        issueManagement_PO.reopenIssueForm(
          test.reopenButton,
          test.reopenComment,
          test.reopenStatus,
        );
      });
    });
  },
);

describe(
  "Single Assignee : Reopen an Issue management Workflow",
  {
    tags: [
      "@regression",
      "@cms",
      "@issue-management",
      "@single-assignee",
      "@pd51732",
    ],
  },
  () => {
    beforeEach(() => {
      cy.loginWithSession(
        "BCUS User session",
        Cypress.env("bcususername"),
        Cypress.env("bcuspassword"),
        Cypress.env("bcuskey"),
      );
      cy.visitCMSDashboard();
      predictMenu_PO.menuClick();
    });

    reopenIssue.forEach((test) => {
      it("Verify that a reopened issue can be moved to In-Progress and a subtask can be created successfully", () => {
        cy.get(".navbar").contains("Compliance Management").click();
        predictMenu_PO.activitiesAndTasksClick();
        workflowsingleAssignee_PO.searchTicketNumber(filename);
        workflowsingleAssignee_PO.workflowSingleAssigneeProcessReopen(
          test.acceptanceComment,
          test.statusAfterAccept,
          test.Subtasksummary,
          test.Description,
          test.prioritySubtask,
          test.site,
          test.subjectArea,
        );
      });
    });
  },
);

describe(
  "Single Assignee : Reopen an Issue management Data Validation",
  { tags: ["@regression", "@cms", "@issue-management", "@single-assignee"] },
  () => {
    beforeEach(() => {
      cy.loginWithSession(
        "BCUS User session",
        Cypress.env("bcususername"),
        Cypress.env("bcuspassword"),
        Cypress.env("bcuskey"),
      );
      cy.visitCMSDashboard();
      predictMenu_PO.menuClick();
    });

    reopenIssue.forEach((test) => {
      it("Reopen an Issue management Data Validation form with Single Assignee", () => {
        cy.get(".navbar").contains("Compliance Management").click();
        predictMenu_PO.activitiesAndTasksClick();
        workflowsingleAssignee_PO.searchTicketNumber(filename2);
        workflowsingleAssignee_PO.validateDataSubtask(
          test.issueType,
          test.issueSubtaskNewStatus,
          test.site,
          test.Description,
          test.assigneeName,
        );
      });
    });
  },
);

describe(
  "Single Assignee : Reopen an Issue management Reject Sub task",
  { tags: ["@regression", "@cms", "@issue-management", "@single-assignee"] },
  () => {
    beforeEach(() => {
      cy.loginWithSession(
        "BCUS User session",
        Cypress.env("bcususername"),
        Cypress.env("bcuspassword"),
        Cypress.env("bcuskey"),
      );
      cy.visitCMSDashboard();
      predictMenu_PO.menuClick();
    });

    reopenIssue.forEach((test) => {
      it(
        "Verify that a rejected issue can be reopened and its status changes back to New",
        { tags: ["@smoke", "@pd51731"] },
        () => {
          cy.get(".navbar").contains("Compliance Management").click();
          predictMenu_PO.activitiesAndTasksClick();
          workflowsingleAssignee_PO.searchTicketNumber(filename2);
          issueManagement_PO.rejectSubTask(
            test.statusSubtaskreject,
            test.submittedStatus,
            test.rejectSubtaskButton,
            test.rejectSubtaskStatus,
          );
        },
      );
    });
  },
);

describe(
  "Single Assignee : Reopen an Issue management Sub Task Workflow Process After Reject ",
  { tags: ["@regression", "@cms", "@issue-management", "@single-assignee"] },
  () => {
    beforeEach(() => {
      cy.loginWithSession(
        "BCUS User session",
        Cypress.env("bcususername"),
        Cypress.env("bcuspassword"),
        Cypress.env("bcuskey"),
      );
      cy.visitCMSDashboard();
      predictMenu_PO.menuClick();
    });

    reopenIssue.forEach((test) => {
      it("Reopen an Issue management Sub Task Workflow Process After Reject form with Single Assignee", () => {
        cy.get(".navbar").contains("Compliance Management").click();
        predictMenu_PO.activitiesAndTasksClick();
        workflowsingleAssignee_PO.searchTicketNumber(filename2);
        workflowsingleAssignee_PO.subTaskWorkflowProcessAfterReject(
          test.subtasksubmitButton,
          test.statusSubtask,
           
        );
      });
    });
  },
);

describe(
  "Single Assignee : Reopen an Issue management Workflow Single Assignee Process After Sub task",
  { tags: ["@regression", "@cms", "@issue-management", "@single-assignee"] },
  () => {
    beforeEach(() => {
      cy.loginWithSession(
        "BCUS User session",
        Cypress.env("bcususername"),
        Cypress.env("bcuspassword"),
        Cypress.env("bcuskey"),
      );
      cy.visitCMSDashboard();
      predictMenu_PO.menuClick();
    });

    reopenIssue.forEach((test) => {
      it("Reopen an Issue management Workflow Single Assignee Process After Sub task form with Single Assignee", () => {
        cy.get(".navbar").contains("Compliance Management").click();
        predictMenu_PO.activitiesAndTasksClick();
        workflowsingleAssignee_PO.searchTicketNumber(filename);
        workflowsingleAssignee_PO.workflowSingleAssigneeProcessAfterSubtask(
          test.resolveComment,
          test.issueResolveStatus,
          test.acceptedComment,
          test.issueAcceptedStatus,
        );
      });
    });
  },
);
