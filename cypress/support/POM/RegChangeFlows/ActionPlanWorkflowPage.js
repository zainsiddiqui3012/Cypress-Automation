import locatorsData from "../../../fixtures/locators.json";
import testData from "../../../fixtures/RegChangeFlows/RegulatoryChange.json";

const loc = locatorsData.cms.regChange.workflows;
const IFRAME = loc.iframe;

class ActionPlanWorkflowPage {
  constructor() {
    this.selectors = {
      iframe: IFRAME,
      ticketKey: loc.navigation.ticketKey,
      startProgressBtn: loc.workflowButtons.startProgress,
      stopProgressBtn: loc.workflowButtons.stopProgress,
      sendForApprovalBtn: loc.workflowButtons.sendForApproval,
      addStatusUpdateBtn: loc.workflowButtons.addStatusUpdate,
      viewStatusUpdatesBtn: loc.workflowButtons.viewStatusUpdates,
      acceptBtn: loc.workflowButtons.accept,
      rejectBtn: loc.workflowButtons.reject,
      reopenBtn: loc.workflowButtons.reopen,
      modalReopenBtn: loc.workflowButtons.modalReopen,
      completeBtn: loc.workflowButtons.complete,
      statusUpdateDialog: loc.dialogs.statusUpdateDialog,
      statusUpdateField: loc.dialogs.statusUpdateField,
      statusUpdateSubmitBtn: loc.dialogs.statusUpdateSubmitBtn,
      dialogCancelBtn: loc.dialogs.dialogCancelBtnGeneric,
      inlineAssigneeField: loc.formFields.assigneeDisplay,
      inlineAssigneeInput: loc.formFields.assigneeField,
      inlineAssigneeConfirm: loc.editMode.inlineAssigneeConfirm,
      commentBtn: loc.comments.commentBtn,
      commentField: loc.comments.commentField,
      commentSubmitBtn: loc.comments.commentSubmitBtn,
      commentInActivity: loc.comments.commentInActivity,
      attachFileBtn: loc.moreMenu.attachFiles,
      attachScreenshotBtn: loc.moreMenu.attachScreenshot,
      fileInput: loc.attachments.fileInput,
      attachmentName: loc.attachments.attachmentName,
      watchBtn: loc.watchers.watchBtn,
      moreBtn: loc.workflowButtons.moreButton,
      manageWatchersLink: loc.watchers.manageWatchersLink,
      watcherDialog: loc.watchers.watcherDialog,
      watcherInput: loc.watchers.watcherInput,
      watcherAddBtn: loc.watchers.watcherAddBtn,
      watchersList: loc.watchers.watchersList,
      viewWatchList: loc.watchers.viewWatchList,
      removeWatcher: loc.watchers.removeWatcher,
      removeWatcherBtn: loc.watchers.removeWatcherBtn,
      submitForClosureBtn: loc.workflowButtons.submitForClosure,
      acceptAndCloseBtn: loc.workflowButtons.acceptAndClose,
      modalAcceptAndCloseBtn: loc.workflowButtons.modalAcceptAndClose,
      screenshotDialog: loc.dialogs.screenshotDialog,
      resolvedDate: loc.formFields.resolvedDate,
      groupAssigneeVal: loc.formFields.groupAssigneeVal,
      statusField: loc.status.statusField,
      assigneeField: loc.formFields.assigneeDisplay,
      issueLinksSection: loc.issueLinks.issueLinksSection,
      issueLinkKey: loc.issueLinks.issueLinkKey,
      childTicketLink: loc.issueLinks.childTicketLink,
      issueLinkTable: loc.issueLinks.issueLinksTable,
    };
  }
  withinRegChangeFrame(callback) {
    cy.frameLoaded(IFRAME);
    cy.iframe(IFRAME).within(callback);
  }
  addComment(commentText) {
    cy.wait(2000);
    cy.cmsWaitForIframe(this.selectors.startProgressBtn, 30000);
    cy.findInIframe(IFRAME, this.selectors.commentBtn, 30000).click();
    cy.wait(5000);
    // cy.cmsWaitForIframe(this.selectors.commentField, 30000);
    cy.findInIframe(IFRAME, this.selectors.commentField, 50000)
      .clear()
      .type(commentText);

    cy.findInIframe(IFRAME, this.selectors.commentSubmitBtn, 30000).click();
    cy.iframeReady(IFRAME, this.selectors.commentInActivity, 15000);
  }
  verifyCommentExists(commentText) {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.commentInActivity,
      commentText,
      10000,
    );
  }
  attachFile(filePath) {
    cy.findInIframe(IFRAME, this.selectors.attachFileBtn, 10000).click();
    cy.findInIframe(IFRAME, this.selectors.fileInput, 10000, true).selectFile(
      filePath,
      { force: true },
    );
  }
  verifyFileAttached(fileName) {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.attachmentName,
      fileName,
      10000,
    );
  }
  clickMoreButton() {
    cy.cmsWaitForIframe(this.selectors.moreBtn, 30000);
    cy.wait(5000);
    cy.findInIframe(IFRAME, this.selectors.moreBtn, 30000).click();
  }
  clickWatchIssue() {
    cy.findInIframe(IFRAME, this.selectors.watchBtn, 10000).click();
  }
  openManageWatchers() {
    cy.findInIframe(IFRAME, this.selectors.manageWatchersLink, 10000).click();
  }
  addWatcher(username) {
    cy.findInIframe(IFRAME, this.selectors.watcherInput, 10000)
      .type(username)
      .type("{enter}");
    cy.findInIframe(IFRAME, this.selectors.watcherAddBtn, 10000).click();
  }
  verifyAddedWatcher(username) {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.watchersList,
      username,
      10000,
    );
  }
  removeWatcher() {
    cy.cmsWaitForIframe(loc.watchers.watcherCheckbox, 30000);

    this.withinRegChangeFrame(() => {
      cy.get(loc.watchers.watcherCheckbox, { timeout: 10000 }).click({
        multiple: true,
      });
    });
    cy.findInIframe(IFRAME, this.selectors.removeWatcherBtn, 10000).click();
  }
  verifyRemovedWatcher() {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.removeWatcher,
      testData.messages.noWatchers,
      50000,
    );
  }
  verifyWatcherCount(expectedCount) {
    cy.findInIframe(IFRAME, this.selectors.viewWatchList, 30000).should(
      "have.length",
      expectedCount,
    );
  }
  clickAcceptAndClose() {
    cy.cmsWaitForIframe(this.selectors.acceptAndCloseBtn, 50000);
    cy.findInIframe(IFRAME, this.selectors.acceptAndCloseBtn, 50000).click();
    cy.findInIframe(
      IFRAME,
      this.selectors.modalAcceptAndCloseBtn,
      50000,
    ).click();
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.statusField,
      testData.actionPlan.statuses.closed,
      30000,
    );
  }
  verifyAssigneePreserved() {
    cy.findInIframe(IFRAME, this.selectors.assigneeField, 10000).should(
      "not.contain.text",
      "Unassigned",
    );
  }
  verifyAssigneeCleared() {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.assigneeField,
      testData.messages.unassigned,
      10000,
    );
  }
  verifyWorkflowButtonsVisible(buttonNames) {
    buttonNames.forEach((buttonName) => {
      this.withinRegChangeFrame(() => {
        cy.contains(buttonName, { timeout: 10000 }).should("be.visible");
      });
    });
  }
  verifyStatusIs(expectedStatus) {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.statusField,
      expectedStatus,
      100000,
    );
  }
  clickSendForApproval() {
    cy.cmsWaitForIframe(this.selectors.sendForApprovalBtn, 50000);
    cy.wait(5000);
    cy.findInIframe(IFRAME, this.selectors.sendForApprovalBtn, 50000).click();
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.statusField,
      testData.actionPlan.statuses.approvalNeeded,
      50000,
    );
  }
  clickReopen(modal = true) {
    cy.cmsWaitForIframe(this.selectors.reopenBtn, 30000);
    cy.wait(5000);
    cy.findInIframe(IFRAME, this.selectors.reopenBtn, 30000).click({
      force: true,
    });
    if (modal === true) {
      cy.findInIframe(IFRAME, this.selectors.modalReopenBtn, 30000).click({
        force: true,
      });
    }
  }
  clickAddStatusUpdate() {
    cy.cmsWaitForIframe(this.selectors.addStatusUpdateBtn, 50000);
    cy.findInIframe(IFRAME, this.selectors.addStatusUpdateBtn, 50000).click({
      force: true,
    });
  }
  fillAndSubmitStatusUpdate(updateText) {
    cy.findInIframe(IFRAME, this.selectors.statusUpdateField, 50000)
      .clear()
      .type(updateText);
    cy.findInIframe(
      IFRAME,
      this.selectors.statusUpdateSubmitBtn,
      50000,
    ).click();
  }
  cancelStatusUpdate() {
    cy.findInIframe(IFRAME, this.selectors.dialogCancelBtn, 10000).click();
  }
  verifyParentLinkExists(parentTicketKey) {
    cy.findInIframe(IFRAME, this.selectors.issueLinksSection, 10000).should(
      "be.visible",
    );
    cy.findInIframe(
      IFRAME,
      `${loc.issueLinks.subtaskKey}[data-issue-key="${parentTicketKey}"]`,
      10000,
    )
      .should("be.visible")
      .should("contain.text", parentTicketKey);
  }
  clickParentLink() {
    cy.findInIframe(IFRAME, loc.issueLinks.issueLinkTitle, 10000).click({
      force: true,
    });
    cy.iframeReady(IFRAME, loc.status.statusField, 15000);
  }
}

export default ActionPlanWorkflowPage;
