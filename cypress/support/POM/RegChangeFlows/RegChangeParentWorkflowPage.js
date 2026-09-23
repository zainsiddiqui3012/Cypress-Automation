import locatorsData from "../../../fixtures/locators.json";

const loc = locatorsData.cms.regChange.workflows;
const IFRAME = loc.iframe;
const SAVED_KEYS_PATH = "cypress/fixtures/RegChangeFlows/savedTicketKeys.json";

class RegChangeParentWorkflowPage {
  constructor() {
    this.selectors = {
      iframe: IFRAME,

      implementBtn: loc.workflowButtons.implement,
      closeBtn: loc.workflowButtons.close,
      reopenBtn: loc.workflowButtons.reopen,
      abandonBtn: loc.workflowButtons.abandon,
      createActionPlanBtn: loc.workflowButtons.createActionPlan,
      notifyBUAndCloseBtn: loc.workflowButtons.notifyBUAndClose,
      createFindingBtn: loc.workflowButtons.createFinding,

      moreButton: loc.workflowButtons.moreButton,
      createSubtaskOption: loc.moreMenu.createSubtask,
      linkIssueOption: loc.moreMenu.linkIssue,

      subtaskSummaryField: loc.subtaskForm.subtaskSummaryField,
      subtaskDescField: loc.subtaskForm.subtaskDescField,
      subtaskCreateBtn: loc.subtaskForm.subtaskCreateBtn,

      commentBtn: loc.comments.commentBtn,
      commentField: loc.comments.commentField,
      commentSubmitBtn: loc.comments.commentSubmitBtn,
      commentInActivity: loc.comments.commentInActivity,
      commentAddBtn: loc.comments.commentSubmitBtn,
      commentText: loc.comments.commentText,

      attachFilesBtn: loc.moreMenu.attachFiles,
      attachScreenshotBtn: loc.moreMenu.attachScreenshot,
      fileInput: loc.attachments.fileInput,
      attachmentsList: loc.attachments.attachmentsList,
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

      linkIssueDialog: loc.issueLinks.linkIssueDialog,
      linkIssueSearch: loc.issueLinks.linkIssueSearch,
      linkIssueBtn: loc.issueLinks.linkIssueBtn,
      linkedIssues: loc.issueLinks.linkedIssues,

      statusField: loc.status.statusField,
      resolvedDateField: loc.status.resolvedDateField,
      ticketKey: loc.navigation.ticketKey,

      issueLinksTable: loc.issueLinks.issueLinksTable,
      subtaskRow: loc.issueLinks.subtaskRow,
      subtasksSection: loc.issueLinks.subtasksSection,
      subtasksTable: loc.issueLinks.subtasksTable,
      subtaskTableRow: loc.issueLinks.subtaskTableRow,
      subtaskKey: loc.issueLinks.subtaskKey,
      childTicketLink: loc.issueLinks.childTicketLink,

      closeWarningDialog: loc.dialogs.closeWarningDialog,
      closeConfirmBtn: loc.dialogs.closeConfirmBtn,
      closeCancelBtn: loc.dialogs.closeCancelBtn,

      abandonWarningDialog: loc.dialogs.abandonWarningDialog,
      abandonConfirmBtn: loc.dialogs.abandonConfirmBtn,
      abandonCancelBtn: loc.dialogs.abandonCancelBtn,
    };
  }
  withinRegChangeFrame(callback) {
    cy.frameLoaded(IFRAME);
    cy.iframe(IFRAME).within(callback);
  }
  saveParentTicketKey() {
    cy.frameLoaded(IFRAME);
    return cy
      .iframe(IFRAME)
      .find(this.selectors.ticketKey)
      .invoke("text")
      .then((ticketKey) => {
        const key = ticketKey.trim();

        Cypress.env("parentTicketKey", key);

        cy.writeFile(SAVED_KEYS_PATH, {
          parentTicketKey: key,
        });
        return cy.wrap(key);
      });
  }
  visitParent(parentTicketKey) {
    cy.visit(`${Cypress.env("COMPLIANCE_DASHBOARD")}?key=${parentTicketKey}`);
  }
  clickImplement() {
    this.withinRegChangeFrame(() => {
      cy.wait(5000);
      cy.get(this.selectors.implementBtn, { timeout: 10000 }).click();
    });
  }
  clickMoreButton() {
    cy.cmsWaitForIframe(this.selectors.moreButton, 30000);
    cy.wait(5000);
    cy.findInIframe(IFRAME, this.selectors.moreButton, 10000).click();
  }
  clickCreateSubtask() {
    cy.findInIframe(IFRAME, this.selectors.createSubtaskOption, 10000).click();
  }
  verifyStatusIs(expectedStatus) {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.statusField,
      expectedStatus,
      50000,
    );
  }
  verifyWorkflowButtonVisible(buttonName) {
    cy.get(IFRAME, { timeout: 50000 }).should(($iframe) => {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      const $el = Cypress.$(body)
        .find(`:contains("${buttonName}")`)
        .filter(":visible");
      expect($el.length, `"${buttonName}" visible in iframe`).to.be.greaterThan(
        0,
      );
    });
  }
  verifyResolvedDateNotExists() {
    cy.get(IFRAME, { timeout: 10000 }).should(($iframe) => {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      const $el = Cypress.$(body).find(this.selectors.resolvedDateField);
      expect(
        $el.length,
        `"${this.selectors.resolvedDateField}" should not exist`,
      ).to.equal(0);
    });
  }
  verifySubtaskInIssueLinks(subtaskSummary) {
    cy.iframeContentEquals(
      IFRAME,
      loc.issueLinks.subtaskTableRow,
      subtaskSummary,
      10000,
    );
  }
  verifyCurrentTicketIs(expectedTicketKey) {
    cy.findInIframe(IFRAME, this.selectors.ticketKey, 10000)
      .should("be.visible")
      .invoke("text")
      .then((actualKey) => {
        const actualTicketKey = actualKey.trim();
        expect(actualTicketKey).to.equal(expectedTicketKey);
      });
  }
}

export default RegChangeParentWorkflowPage;
