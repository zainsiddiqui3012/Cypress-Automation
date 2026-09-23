import locatorsData from "../../../fixtures/locators.json";
import testData from "../../../fixtures/RegChangeFlows/RegulatoryChange.json";

const loc = locatorsData.cms.regChange.workflows;
const IFRAME = loc.iframe;

class ActionPlanNoApprovalPage {
  constructor() {
    this.selectors = {
      iframe: IFRAME,
      ticketKey: loc.navigation.ticketKey,
      startProgressBtn: loc.workflowButtons.startProgress,
      completeBtn: loc.workflowButtons.complete,
      reopenBtn: loc.workflowButtons.reopen,
      sendForApprovalBtn: loc.workflowButtons.sendForApproval,
      statusField: loc.status.statusField,
      resolvedDateField: loc.status.resolvedDateField,
      assigneeField: loc.formFields.assigneeDisplay,
    };
  }
  withinRegChangeFrame(callback) {
    cy.frameLoaded(IFRAME);
    cy.iframe(IFRAME).within(callback);
  }
  navigateToActionPlan(ticketKey) {
    cy.visit(`${Cypress.env("BASE_URL")}/casemanagement/browse/${ticketKey}`);
    cy.cmsWaitForIframe(this.selectors.ticketKey, 15000);
  }
  verifyCompleteButtonVisible() {
    cy.findInIframe(IFRAME, this.selectors.completeBtn, 10000).should(
      "be.visible",
    );
  }
  verifySendForApprovalNotVisible() {
    cy.get(IFRAME, { timeout: 10000 }).then(($iframe) => {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      if (body) {
        const $btn = Cypress.$(body).find(this.selectors.sendForApprovalBtn);
      }
    });
  }
  clickStartProgress() {
    cy.cmsWaitForIframe(this.selectors.startProgressBtn, 10000);
    cy.findInIframe(IFRAME, this.selectors.startProgressBtn, 10000).click();
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.statusField,
      testData.actionPlan.statuses.inProgress,
      15000,
    );
  }
  clickComplete() {
    cy.cmsWaitForIframe(this.selectors.completeBtn, 10000);
    cy.findInIframe(IFRAME, this.selectors.completeBtn, 10000).click();
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.statusField,
      testData.actionPlan.statuses.closed,
      15000,
    );
  }
  completeWithoutApproval() {
    this.clickStartProgress();
    this.clickComplete();
  }
  verifyStatusIs(expectedStatus) {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.statusField,
      expectedStatus,
      10000,
    );
  }
  verifyResolvedDateExists() {
    cy.findInIframe(IFRAME, this.selectors.resolvedDateField, 10000).should(
      "exist",
    );
  }
  clickReopen() {
    cy.cmsWaitForIframe(this.selectors.reopenBtn, 10000);
    cy.findInIframe(IFRAME, this.selectors.reopenBtn, 10000).click();
  }
}

export default ActionPlanNoApprovalPage;
