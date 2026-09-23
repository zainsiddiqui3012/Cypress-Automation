import locators from "../../../fixtures/locators.json";

const loc = locators.cms.issueManagementAssignee;
const filename = "cypress/fixtures/CMSIssue/TicketId.txt";
const filename2 = "cypress/fixtures/CMSIssue/TicketIdSubtaskSingle.txt";

// TinyMCE dialog logic → cy.cmsTinyMceDialog(comment, expectedStatus, timeout)
// custom command mein hai (cypress/support/commands.js).

class IssueWorkflowSingleAssignee_PO {
  searchTicketNumber(fileName = filename2) {
    cy.readFile(fileName).then((text) => {
      cy.findInIframe(loc.iframeTarget, loc.quickSearchInput).type(
        text + "{enter}",
      );
      cy.iframeContentEquals(loc.iframeTarget, loc.keyVal, text.trim(), 60000);
    });
  }

  workflowSingleAssigneeProcess(
    acceptanceComment,
    statusAfterAccept,
    Subtasksummary,
    Description,
    prioritySubtask,
    site,
    subjectArea,
  ) {
    // ── Accept: wait for button → click → TinyMCE dialog ─────────────────────
    cy.cmsWaitForIframe(loc.acceptBtn, 150000);
    cy.findInIframe(loc.iframeTarget, loc.acceptBtn).click();
    cy.cmsTinyMceDialog(acceptanceComment, statusAfterAccept, 120000);

    // ── Create Action Plan subtask ────────────────────────────────────────────
    // cmsCreateSubtask internally waits for #assign-issue12 (timeout=150000).
    cy.cmsCreateSubtask(
      Subtasksummary,
      Description,
      prioritySubtask,
      site,
      filename2,
    );
  }

  validateDataSubtask(
    issueType,
    issueSubtaskNewStatus,
    site,
    Description,
    assigneeName,
  ) {
    cy.findInIframe(loc.iframeTarget, loc.typeVal).contains(issueType);
    cy.findInIframe(loc.iframeTarget, loc.statusVal).contains(
      issueSubtaskNewStatus,
    );
    cy.findInIframe(loc.iframeTarget, loc.siteVal).contains(site);
    cy.findInIframe(loc.iframeTarget, loc.descriptionVal).contains(Description);
    cy.findInIframe(loc.iframeTarget, loc.assigneeVal).contains(assigneeName);
  }

  subTaskWorkflowProcess(
    subtasksubmitButton,
    statusSubtask,
    actionPlanStatus,
    submittedStatus,
    // acceptComment,
    subtaskcloseStatus,
  ) {
    // ── Assert Action Plan status before submit ─────────────────────────────────
    cy.iframeContentEquals(
      loc.iframeTarget,
      loc.typeVal,
      "Action Plan",
      160000,
    );

    // Direct Status Change (Start Progress → In Progress)
    // ── cmsTransition: #action_id_11 → direct (no dialog) Start Progress -> In Progress ────────────────────
    cy.cmsTransition(loc.action11, statusSubtask);
    cy.iframeContentEquals(
      loc.iframeTarget,
      loc.statusVal,
      statusSubtask,
      120000,
    );

    // Click Submited for Closure btn, direct status change (In Progress → Submitted For Closure)
    // ── cmsTransition: #action_id_41 → TinyMCE dialog → Submitted For Closure ────────────────
    cy.cmsWaitForIframe(loc.action41, 25000);
    cy.cmsTransition(loc.action41, submittedStatus);

    // click Accept & Close btn, modal open without comment (Submit For Closure → Closed)
    // ── cmsTransition: #action_id_71 → TinyMCE dialog → closed ────────────────
    cy.cmsWaitForIframe(loc.action71, 150000);
    cy.iframeContentEquals(
      loc.iframeTarget,
      loc.statusVal,
      submittedStatus,
      120000,
    );

    cy.cmsTransition(
      loc.action71,
      subtaskcloseStatus,
      null,
      loc.iframeTarget,
      130000,
      true,
    );

    cy.iframeContentEquals(
      loc.iframeTarget,
      loc.statusVal,
      subtaskcloseStatus,
      120000,
    );
  }

  reopenSubtask(reopenStatus, submittedStatus, subtaskcloseStatus) {
    cy.iframeContentEquals(
      loc.iframeTarget,
      loc.statusVal,
      subtaskcloseStatus,
      120000,
    );
    // ── cmsTransition: #action_id_91 → direct → reopen ───────────────────────
    cy.cmsTransition(loc.action91, reopenStatus);

    // ── cmsTransition: #action_id_41 → direct ────────────────────────────────
    cy.cmsTransition(loc.action41, submittedStatus);
    // check for Accept & Close btn
    cy.cmsWaitForIframe(loc.action71, 120000);

    // click Accept & Close btn, modal open without comment (Submit For Closure → Closed)
    cy.cmsTransition(
      loc.action71,
      subtaskcloseStatus,
      null,
      loc.iframeTarget,
      120000,
      true,
    );
  }

  workflowSingleAssigneeProcessAfterSubtask(
    resolveComment,
    issueResolveStatus,
    acceptedComment,
    issueAcceptedStatus,
  ) {
    // ── Transition: #action_id_31 → TinyMCE dialog → resolve ──────────────
    cy.iframeContentEquals(
      loc.iframeTarget,
      loc.typeVal,
      "Issue Management",
      160000,
    );
    cy.cmsWaitForIframe(loc.action31, 40000);
    cy.findInIframe(loc.iframeTarget, loc.action31).click();
    cy.cmsTinyMceDialog(resolveComment, issueResolveStatus, 30000);

    // ── Transition: #action_id_41 → TinyMCE dialog → accept ───────────────
    cy.cmsWaitForIframe(loc.action41, 60000);
    cy.findInIframe(loc.iframeTarget, loc.action41).click();
    cy.cmsTinyMceDialog(acceptedComment, issueAcceptedStatus, 60000);
  }

  workflowSingleAssigneeProcessReturnToOwner(
    resolveComment,
    issueResolveStatus,
    returntoOwnerButton,
    returntoownerComment,
    returnToOwnerStatus,
    resolveAfterRTO,
    acceptedComment,
    issueAcceptedStatus,
  ) {
    cy.readFile(filename).then((text) => {
      cy.findInIframe(loc.iframeTarget, loc.quickSearchInput).type(
        text + "{enter}",
      );
      cy.iframeContentEquals(loc.iframeTarget, loc.keyVal, text.trim(), 60000);
    });

    // ── cmsTransition: #action_id_31 → TinyMCE dialog → resolve ──────────────
    cy.cmsWaitForIframe(loc.action31, 40000);
    cy.findInIframe(loc.iframeTarget, loc.action31).click();
    cy.cmsTinyMceDialog(resolveComment, issueResolveStatus, 30000);

    // ── Return to owner: opsbar button → TinyMCE dialog ──────────────────────
    cy.cmsWaitForIframe(loc.opsbarTransitions, 15000);
    cy.cmsClickInIframe(loc.opsbarTransitionsLink, returntoOwnerButton, 15000);
    cy.cmsTinyMceDialog(returntoownerComment, returnToOwnerStatus, 30000);

    // ── cmsTransition: #action_id_31 → TinyMCE dialog → resolve again ─────────
    cy.cmsWaitForIframe(loc.action31, 15000);
    cy.findInIframe(loc.iframeTarget, loc.action31).click();
    cy.cmsTinyMceDialog(resolveComment, issueResolveStatus, 30000);

    // ── Resolve after RTO: opsbar button → TinyMCE dialog → final accept ──────
    cy.cmsWaitForIframe(loc.opsbarTransitions, 15000);
    cy.cmsClickInIframe(loc.opsbarTransitionsLink, resolveAfterRTO, 15000);
    cy.cmsTinyMceDialog(acceptedComment, issueAcceptedStatus, 30000);
  }

  workflowSingleAssigneeProcessReopen(
    acceptanceComment,
    statusAfterAccept,
    Subtasksummary,
    Description,
    prioritySubtask,
    site,
    subjectArea,
  ) {
    // ── Accept: wait for button → click → TinyMCE dialog ─────────────────────
    cy.cmsWaitForIframe(loc.acceptBtn, 40000);
    cy.iframeContentEquals(loc.iframeTarget, loc.statusVal, "New", 120000);
    cy.findInIframe(loc.iframeTarget, loc.acceptBtn).click();
    cy.cmsTinyMceDialog(acceptanceComment, statusAfterAccept, 120000);
    cy.wait(8000);
    // ── Create Action Plan subtask ────────────────────────────────────────────
    // cmsCreateSubtask already waits for #assign-issue12 internally (timeout=150000)
    cy.cmsCreateSubtask(
      Subtasksummary,
      Description,
      prioritySubtask,
      site,
      filename2,
    );
  }

  subTaskWorkflowProcessAfterReject(statusSubtask, subtaskcloseStatus) {
    // --- verify 'In Progress' status before submit for Closure
    cy.iframeContentEquals(
      loc.iframeTarget,
      loc.typeVal,
      "Action Plan",
      160000,
    );

    // --- cmsTransition: Direct status change (In Progress → Submitted For Closure)
    cy.cmsWaitForIframe(loc.action41, 25000);
    
    cy.cmsTransition(loc.action41, subtaskcloseStatus);

    // ── cmsTransition: #action_id_71 → TinyMCE dialog → close ────────────────
    cy.cmsWaitForIframe(loc.action71, 55000);
    cy.cmsTransition(
      loc.action71,
      subtaskcloseStatus,
      null,
      loc.iframeTarget,
      120000,
      true,
    );
    cy.log("close");
  }
  verifyAssigneeValidationError(errorMessageAssignee) {
    cy.cmsWaitForIframe(loc.summaryInput, 60000);
    cy.findInIframe(loc.iframeTarget, loc.issueCreateSubmit).click();
    cy.findInIframe(loc.iframeTarget, loc.assigneeErr).contains(
      errorMessageAssignee,
    );
  }
}
export default IssueWorkflowSingleAssignee_PO;
