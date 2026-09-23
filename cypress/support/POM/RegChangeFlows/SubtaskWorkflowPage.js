import locatorsData from "../../../fixtures/locators.json";

const loc = locatorsData.cms.regChange.workflows;
const IFRAME = loc.iframe;
const SAVED_KEYS_PATH = "cypress/fixtures/RegChangeFlows/savedTicketKeys.json";

class SubtaskWorkflowPage {
  constructor() {
    this.selectors = {
      iframe: IFRAME,
      ticketKey: loc.navigation.ticketKey,
      breadcrumb: loc.navigation.breadcrumbCurrentIssue,
      startProgressBtn: loc.workflowButtons.startProgress,
      stopProgressBtn: loc.workflowButtons.stopProgress,
      closeIssueBtn: loc.workflowButtons.closeIssue,
      modalCloseIssueBtn: loc.workflowButtons.modalCloseIssue,
      reopenIssueBtn: loc.workflowButtons.reopenIssue,
      assignBtn: loc.workflowButtons.assign,
      resolveBtn: loc.workflowButtons.resolve,
      statusField: loc.status.statusField,
      resolvedDateField:
        '[data-testid="issue.views.field.rich-text.resolved-date"]',
      assigneeField: loc.formFields.assigneeDisplay,
      subtasksSection: loc.issueLinks.subtasksSection,
      subtasksTable: loc.issueLinks.subtasksTable,
      subtaskRow: loc.issueLinks.subtaskRow,
      subtaskKey: loc.issueLinks.subtaskKey,
      subtaskSummary: loc.issueLinks.subtaskSummary,
      subtaskStatus: loc.issueLinks.subtaskStatus,
      commentBtn: loc.comments.commentBtn,
      commentField: loc.comments.commentField,
      commentSubmitBtn: loc.comments.commentSubmitBtn,
      commentText: loc.comments.commentText,
      watchBtn: loc.watchers.watchBtn,
      watchingIndicator: loc.watchers.watchingIndicator,
    };
  }
  withinRegChangeFrame(callback) {
    cy.frameLoaded(IFRAME);
    cy.iframe(IFRAME).within(callback);
  }
  getSubtaskKeyFromParent() {
    return cy
      .findInIframe(IFRAME, this.selectors.subtaskRow, 10000)
      .first()
      .find(this.selectors.subtaskKey)
      .invoke("attr", "data-issue-key")
      .then((key) => {
        const subtaskKey = key;
        return cy.readFile(SAVED_KEYS_PATH).then((data) => {
          const updatedData = {
            ...data,
            subTaskTicketKey: subtaskKey,
          };
          return cy
            .writeFile(SAVED_KEYS_PATH, updatedData)
            .then(() => subtaskKey);
        });
      });
  }
  verifySubtaskExists() {
    cy.findInIframe(IFRAME, this.selectors.subtasksSection, 10000)
      .should("exist")
      .and("be.visible");
    cy.findInIframe(IFRAME, this.selectors.subtaskRow, 10000).should(
      "have.length.at.least",
      1,
    );
  }
  clickCloseIssue(modalOption = false) {
    cy.cmsWaitForIframe(this.selectors.closeIssueBtn, 10000);
    cy.findInIframe(IFRAME, this.selectors.closeIssueBtn, 10000).click();

    if (modalOption === true) {
      cy.findInIframe(IFRAME, this.selectors.modalCloseIssueBtn, 10000).click();
    }
  }
  clickReopenIssue(modalOption = false) {
    cy.cmsWaitForIframe(this.selectors.reopenIssueBtn, 10000);
    cy.findInIframe(IFRAME, this.selectors.reopenIssueBtn, 10000).click();

    if (modalOption === true) {
      cy.findInIframe(IFRAME, this.selectors.modalCloseIssueBtn, 10000).click();
    }
  }
  verifyStatusIs(expectedStatus) {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.statusField,
      expectedStatus,
      10000,
    );
  }
  verifyWorkflowButtonsVisible(buttonNames) {
    buttonNames.forEach((buttonName) => {
      cy.get(IFRAME, { timeout: 50000 }).should(($iframe) => {
        const body =
          $iframe[0].contentDocument && $iframe[0].contentDocument.body;
        expect(body, "iframe body").to.exist;
        const $el = Cypress.$(body)
          .find(`span[class='trigger-label']:contains('${buttonName}')`)
          .filter(":visible");
        expect(
          $el.length,
          `"${buttonName}" visible in iframe`,
        ).to.be.greaterThan(0);
      });
    });
  }
  verifyWorkflowButtonVisible(buttonName) {
    cy.get(IFRAME, { timeout: 10000 }).should(($iframe) => {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      const $el = Cypress.$(body)
        .find(`a:contains('${buttonName}')`)
        .filter(":visible");
      expect($el.length, `"${buttonName}" visible in iframe`).to.be.greaterThan(
        0,
      );
    });
  }
}

export default SubtaskWorkflowPage;
