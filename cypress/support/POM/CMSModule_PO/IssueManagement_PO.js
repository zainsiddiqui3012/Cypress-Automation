import dayjs from "dayjs";
import locators from "../../../fixtures/locators.json";

const loc = locators.cms.issueManagementAssignee;
const filename = "cypress/fixtures/CMSIssue/TicketId.txt";
const filename2 = "cypress/fixtures/CMSIssue/TicketIdSubtaskSingle.txt";

class IssueManagement_PO {
  setCustomerProfile(
    issueOwnerType,
    issueOwnerTypeName,
    customerProfileUpdatemsg,
  ) {
    cy.get(loc.issueProcessOwnerTypeSingle).click({
      force: true,
    });
    cy.get(loc.issueProcessOwnerId).should("be.visible").click();
    cy.get(loc.issueProcessOwnerSearch)
      .should("be.visible")
      .type(issueOwnerTypeName)
      .type("{enter}");
    cy.get(loc.issueProcessOwnerChosen, {
      timeout: 15000,
    }).should("contain.text", issueOwnerTypeName);
    cy.get(loc.formSaveBtn).scrollIntoView().click();
    cy.waitForElementToVisible(loc.toastMessage, 80000);
  }

  validateMandatoryFields(
    errorMessageAssignee,
    errorMessageSummary,
    errorMessageIssueType,
    errorMessageSubName,
    errorMessageIssueIdenDate,
    errorMessageIssueDescrp,
    errorMessageIssueSource,
    errorMessageAgency,
    errorMessageOwner,
  ) {
    // Form ready hone ka wait
    cy.cmsWaitForIframe(loc.summaryInput, 60000);
    cy.findInIframe(loc.iframeTarget, loc.issueCreateSubmit).click();
    cy.iframeReady(loc.iframeTarget, loc.assigneeErr, 30000);
    cy.findInIframe(loc.iframeTarget, loc.assigneeErr).contains(
      errorMessageAssignee,
    );
    cy.findInIframe(loc.iframeTarget, loc.assignToMeTrigger).click();
    cy.findInIframe(loc.iframeTarget, loc.issueCreateSubmit).click();
    cy.iframeReady(loc.iframeTarget, loc.auiErrorContainer, 30000);
    cy.findInIframe(
      loc.iframeTarget,
      loc.auiErrorP1,
    ).contains(errorMessageSummary);
    cy.findInIframe(
      loc.iframeTarget,
      loc.auiErrorP2,
    ).contains(errorMessageIssueType);
    cy.findInIframe(
      loc.iframeTarget,
      loc.auiErrorP3,
    ).contains(errorMessageSubName);
    cy.findInIframe(
      loc.iframeTarget,
      loc.auiErrorP4,
    ).contains(errorMessageIssueIdenDate);
    cy.findInIframe(
      loc.iframeTarget,
      loc.auiErrorP5,
    ).contains(errorMessageIssueDescrp);
    cy.findInIframe(
      loc.iframeTarget,
      loc.auiErrorP6,
    ).contains(errorMessageIssueSource);
    cy.findInIframe(
      loc.iframeTarget,
      loc.auiErrorP7,
    ).contains(errorMessageAgency);
    cy.findInIframe(
      loc.iframeTarget,
      loc.auiErrorP8,
    ).contains(errorMessageOwner);
  }

  fillIssueForm(
    summary,
    IssueSource,
    Agency_Entities,
    typeOfIssue,
    issueDescription,
    audit_exam,
    issueOwner,
    rootCause,
    rootCauseDescription,
    submitterName,
    repeatFinding,
    priority,
    assigneeType,
    projectNumber,
    subjectArea,
    severity,
    responsibleDepartment,
  ) {
    const date = dayjs().format("DD/MMM/YYYY");
    cy.log(date);
    const resolutiondueDate = dayjs().day(5).format("DD/MMM/YYYY");
    cy.log(resolutiondueDate);

    // ── STEP 1: Form load — cmsWaitForIframe summary field aane ka wait ──────
    cy.cmsWaitForIframe(loc.summaryInput, 60000);
    cy.findInIframe(loc.iframeTarget, loc.summaryField).type(summary, {
      delay: 50,
    });
    // ── STEP 2: IssueSource dropdown ─────────────────────────────────────────
    cy.findInIframe(loc.iframeTarget, loc.issueSourceDropdown).click();
    cy.findInIframe(loc.iframeTarget, loc.select2TextInput)
      .type(IssueSource)
      .wait(3000)
      .type("{enter}");
    // ── STEP 3: Agency/Entities dropdown ─────────────────────────────────────
    cy.findInIframe(loc.iframeTarget, loc.agencyDropdown).click();
    cy.findInIframe(loc.iframeTarget, loc.select2SearchInput)
      .type(Agency_Entities)
      .wait(3000)
      .type("{enter}");
    // ── STEP 4: Type of Issue dropdown ───────────────────────────────────────
    cy.findInIframe(loc.iframeTarget, loc.issueTypeDropdown).click();
    cy.findInIframe(loc.iframeTarget, loc.select2SearchInput)
      .type(typeOfIssue)
      .wait(3000)
      .type("{enter}");
    // ── STEP 5: Remaining text/date fields ───────────────────────────────────
    cy.findInIframe(loc.iframeTarget, loc.identificationDate)
      .type(date)
      .wait(3000)
      .type("{enter}");
    cy.findInIframe(loc.iframeTarget, loc.issueDescriptionField).type(
      issueDescription,
    );
    cy.findInIframe(loc.iframeTarget, loc.auditExamField).type(
      audit_exam,
    );
    cy.findInIframe(loc.iframeTarget, loc.issueOwnerField).type(issueOwner);
    cy.findInIframe(loc.iframeTarget, loc.responsibleDeptSelect).select(
      responsibleDepartment,
      { force: true },
    );
    cy.findInIframe(loc.iframeTarget, loc.resolutionDueDate).type(
      resolutiondueDate,
    );
    cy.findInIframe(loc.iframeTarget, loc.rootCauseSelect).select(rootCause);
    cy.findInIframe(loc.iframeTarget, loc.rootCauseDescField).type(
      rootCauseDescription,
    );
    cy.findInIframe(loc.iframeTarget, loc.submitterNameField)
      .type(submitterName)
      .type("{enter}");
    cy.findInIframe(loc.iframeTarget, loc.repeatFindingNo)
      .eq(0)
      .click();
    cy.findInIframe(loc.iframeTarget, loc.prioritySelect).select(priority);
    cy.findInIframe(loc.iframeTarget, loc.assigneeTypeField).contains(
      assigneeType,
    );

    // ── STEP 6: Assign to me ──────────────────────────────────────────────────
    cy.findInIframe(loc.iframeTarget, loc.assignToMeTrigger).click();
    cy.findInIframe(loc.iframeTarget, loc.dueDateInput).type(resolutiondueDate);
    cy.findInIframe(loc.iframeTarget, loc.projectNumberField).type(
      projectNumber,
    );

    // ── STEP 7: Subject Area select2 ─────────────────────────────────────────
    cy.findInIframe(
      loc.iframeTarget,
      loc.subjectAreaChoices,
    ).type(subjectArea);
    cy.findInIframe(loc.iframeTarget, loc.select2ResultLabel).click();

    // ── STEP 8: Severity dropdown ─────────────────────────────────────────────
    cy.findInIframe(
      loc.iframeTarget,
      loc.severityDropdown,
    ).click();
    cy.wait(2000);
    // ── STEP 9: File upload ───────────────────────────────────────────────────
    // input[type="file"] is ALWAYS hidden by browsers (display:none).
    // allowHidden=true skips the :visible filter so the element is found,
    // then { force: true } on selectFile bypasses the visibility check for the action.
    const filepath = "cypress/attachment/testing.txt";
    cy.findInIframe(loc.iframeTarget, loc.fileUploadInput, 30000, true).selectFile(
      filepath,
      { force: true },
    );
    cy.wait(3000);
    cy.findInIframe(loc.iframeTarget, loc.select2DropSearch)
      .type(severity)
      .type("{enter}");

    // ── STEP 10: Submit → ticket ID ───────────────────────────────────────────
    cy.findInIframe(loc.iframeTarget, loc.issueCreateSubmit).click();
    cy.waitForTopMsgLoaderToAppear(200000);
    // cmsWaitForIframe — ticket ID link aane ka wait (stale frame safe)
    cy.cmsWaitForIframe(loc.keyVal, 250000);
    cy.findInIframe(loc.iframeTarget, loc.keyVal).invoke("text").as("ticketId");
    cy.get("@ticketId").then((ticketId) => {
      cy.writeFile(filename, ticketId);
    });
  }
  validateData(
    taskType,
    assigneeName,
    reporter,
    IssueSource,
    Agency_Entities,
    typeOfIssue,
    issueDescription,
    audit_exam,
    issueOwner,
    rootCause,
    rootCauseDescription,
    submitterName,
    repeatFinding,
    priority,
    projectNumber,
    subjectArea,
    severity,
  ) {
    cy.readFile(filename).then((text) => {
      cy.findInIframe(loc.iframeTarget, loc.quickSearchInput).type(text + "{enter}");
      // VALUE-BASED wait — active Predict360 frame confirm karo BEFORE asserting fields
      // a#key-val with the correct ticket text is ONLY in the active Predict360 frame
      cy.iframeContentEquals(loc.iframeTarget, loc.keyVal, text.trim(), 150000);
    });
    cy.findInIframe(loc.iframeTarget, loc.typeVal).contains(taskType);
    cy.findInIframe(loc.iframeTarget, loc.assigneeValId).contains(assigneeName);
    cy.findInIframe(loc.iframeTarget, loc.reporterVal).contains(reporter);
    cy.findInIframe(loc.iframeTarget, loc.issueSourceVal).contains(
      IssueSource,
    );
    cy.findInIframe(loc.iframeTarget, loc.agencyVal).contains(
      Agency_Entities,
    );
    cy.findInIframe(loc.iframeTarget, loc.issueTypeVal).contains(
      typeOfIssue,
    );
    cy.findInIframe(loc.iframeTarget, loc.issueDescriptionVal).contains(
      issueDescription,
    );
    cy.findInIframe(loc.iframeTarget, loc.auditExamVal).contains(audit_exam);
    cy.findInIframe(loc.iframeTarget, loc.issueOwnerVal).contains(issueOwner);
    cy.findInIframe(loc.iframeTarget, loc.rootCauseVal).contains(rootCause);
    cy.findInIframe(loc.iframeTarget, loc.rootCauseDescVal).contains(
      rootCauseDescription,
    );
    cy.findInIframe(loc.iframeTarget, loc.submitterNameVal).contains(
      submitterName,
    );
    cy.findInIframe(loc.iframeTarget, loc.repeatFindingVal).contains(
      repeatFinding,
    );
    cy.findInIframe(loc.iframeTarget, loc.priorityVal).contains(priority);
    cy.findInIframe(loc.iframeTarget, loc.projectNumberVal).contains(
      projectNumber,
    );
    cy.findInIframe(loc.iframeTarget, loc.subjectAreaVal).contains(
      subjectArea,
    );
    cy.findInIframe(loc.iframeTarget, loc.severityVal).contains(severity);
  }
  openEditIssueForm(comment) {
    cy.findInIframe(loc.iframeTarget, loc.changeLogField, 30000)
      .invoke("val")
      .should("eq", comment);
  }
  editIssueForm(description, comment) {
    cy.readFile(filename).then((text) => {
      cy.findInIframe(loc.iframeTarget, loc.quickSearchInput).type(text + "{enter}");

      // Wait until the active Predict360 frame shows the correct ticket key
      cy.iframeContentEquals(loc.iframeTarget, loc.keyVal, text.trim(), 60000);

      // Also wait explicitly for the Edit button to be visible before clicking
      cy.cmsWaitForIframe(loc.editIssueBtn, 60000);

      // Now click Edit — use { force: true } to handle any brief overlay/flicker
      cy.findInIframe(loc.iframeTarget, loc.editIssueBtn).click({ force: true });

      // Edit dialog open hone ka wait — TinyMCE (#mce_0_ifr) load hone ka wait
      cy.cmsWaitForIframe(loc.summaryInput, 120000);

      cy.findInIframe(loc.iframeTarget, loc.issueDescTextarea)
        .clear({ force: true })
        .type(description, { force: true });
      cy.findInIframe(loc.iframeTarget, loc.changeLogField).type(comment, {
        force: true,
      });
      cy.findInIframe(loc.iframeTarget, loc.issueEditSubmit).click({ force: true });

      // Edit submit ke baad — wait for ticket key again to confirm reload is done
      cy.iframeContentEquals(loc.iframeTarget, loc.keyVal, text.trim(), 60000);
    });
  }
  rejectIssueForm(rejectComment, rejectStatus) {
    cy.iframeContentEquals(loc.iframeTarget, loc.statusVal, "New", 160000);
    cy.wait(6000);
    cy.findInIframe(loc.iframeTarget, loc.action21).click();
    cy.cmsTinyMceDialog(rejectComment, rejectStatus, 120000);
  }

  reopenIssueForm(reopenButton, reopenComment, reopenStatus) {
    cy.iframeContentEquals(
      loc.iframeTarget,
      loc.statusVal,
      "Not Accepted",
      160000,
    );
    // --- cmsTransition: Direct Status Change (Not Accepted → New)
    cy.cmsTransition(loc.action131, reopenStatus);
  }

  rejectSubTask(
    statusSubtaskreject,
    submittedStatus,
    rejectSubtaskButton,
    rejectSubtaskStatus,
  ) {
    // --- cmsTransition: Direct status change (Start Progress → In Progress)
    cy.cmsTransition(loc.action11, statusSubtaskreject);
    // --- cmsTransition: Direct status change (In Progress → Submitted For Closure)
    cy.cmsTransition(loc.action41, submittedStatus);
    // -- Accept or Reject button will appear after status change, pehle uska wait karo
    cy.cmsWaitForIframe(loc.action81, 60000);
    // --- Transition: Status change with TinyMCE dialog (Submitted For Closure → Rejected)
    cy.findInIframe(loc.iframeTarget, loc.action81)
      .contains(rejectSubtaskButton)
      .click();
    cy.cmsTinyMceDialog("rejectComment", rejectSubtaskStatus, 60000);
  }
}
export default IssueManagement_PO;
