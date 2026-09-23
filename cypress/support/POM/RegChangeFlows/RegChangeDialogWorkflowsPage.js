import locatorsData from "../../../fixtures/locators.json";
import testData from "../../../fixtures/RegChangeFlows/RegulatoryChange.json";

const loc = locatorsData.cms.regChange.workflows;
const IFRAME = loc.iframe;
const SAVED_KEYS_PATH = "cypress/fixtures/RegChangeFlows/savedTicketKeys.json";

class RegChangeDialogWorkflowsPage {
  constructor() {
    this.selectors = {
      iframe: IFRAME,
      createActionPlanBtn: loc.workflowButtons.createActionPlan,
      actionPlanDialog: loc.dialogs.actionPlanDialog,
      businessUnitCheckbox: loc.dialogs.businessUnitCheckbox,
      businessUnitInput: loc.dialogs.businessUnitInput,
      instructionsTextarea: loc.dialogs.instructionsTextarea,
      instructionsCKEditorFrame: loc.dialogs.instructionsCKEditorFrame,
      assigneeField: loc.dialogs.assigneeField,
      assigneeDropdown: loc.dialogs.assigneeDropdown,
      dueDateField: loc.dialogs.dueDateField,
      createBtn: loc.dialogs.createBtn,
      cancelBtn: loc.dialogs.cancelBtn,
      createEvaluateImpactBtn: loc.workflowButtons.createEvaluateImpact,
      evaluateImpactDialog: loc.dialogs.evaluateImpactDialog,
      issueLinksSection: loc.issueLinks.issueLinksSection,
      issueLinksTable: loc.issueLinks.issueLinksTable,
      issueTableBody: loc.issueLinks.issueTableBody,
      childTicketRow: loc.issueLinks.childTicketRow,
      childTicketSummaryCell: loc.issueLinks.childTicketSummaryCell,
      childTicketLink: loc.issueLinks.childTicketLink,
      childTicketKey: loc.issueLinks.childTicketKey,
      childTicketBusinessUnit: loc.issueLinks.childTicketBusinessUnit,
      childTicketOwner: loc.issueLinks.childTicketOwner,
      childTicketDueDate: loc.issueLinks.childTicketDueDate,
      childTicketStatus: loc.issueLinks.childTicketStatus,
      parentStatusField: loc.status.statusField,
      errorMessage: loc.dialogs.errorMessage,
      errorMessageText: loc.dialogs.errorMessageText,
      modalMsg: loc.dialogs.modalMsg,
    };
  }
  withinRegChangeFrame(callback) {
    cy.frameLoaded(IFRAME);
    cy.iframe(IFRAME).within(callback);
  }
  clickCreateActionPlan() {
    cy.cmsWaitForIframe(this.selectors.createActionPlanBtn, 10000);
    cy.findInIframe(IFRAME, this.selectors.createActionPlanBtn, 10000).click();
  }
  createActionPlanWithDueDate(dueDate) {
    cy.wait(5000);
    this.clickCreateActionPlan();
    cy.cmsCreateChildTask(dueDate, testData.assignee.single.displayName);
  }
  clickCreateEvaluateImpact() {
    cy.cmsWaitForIframe(this.selectors.createEvaluateImpactBtn, 30000);
    cy.findInIframe(
      IFRAME,
      this.selectors.createEvaluateImpactBtn,
      30000,
    ).click();
  }
  createEvaluateImpactWithDueDate(dueDate) {
    cy.wait(5000);
    this.clickCreateEvaluateImpact();
    cy.cmsCreateChildTask(dueDate, testData.assignee.single.displayName);
  }
  verifyChildInIssueLinks(childType, dueDate, status) {
    cy.iframe(IFRAME).within(() => {
      cy.get(this.selectors.issueLinksTable, { timeout: 30000 }).should(
        "be.visible",
      );

      cy.get(this.selectors.childTicketLink, { timeout: 10000 })
        .contains(childType)
        .should("be.visible");

      if (dueDate) {
        cy.get(this.selectors.childTicketRow)
          .contains(childType)
          .parents("tr")
          .within(() => {
            cy.get("td.status").should("contain.text", status);
            cy.get("td").eq(5).should("contain.text", dueDate);
          });
      }
    });
  }
  verifyParentStatusUnchanged(expectedStatus) {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.parentStatusField,
      expectedStatus,
      10000,
    );
  }
  _saveChildTicketKey(childText, envKey, fileKey) {
    return cy
      .switchIframe(IFRAME)
      .find(this.selectors.childTicketRow, { timeout: 30000 })
      .contains(childText)
      .parents("tr")
      .find(this.selectors.childTicketLink)
      .invoke("attr", "data-issue-key")
      .then((key) => {
        const ticketKey = key.trim();
        Cypress.env(envKey, ticketKey);

        cy.readFile(SAVED_KEYS_PATH).then((data) => {
          cy.writeFile(SAVED_KEYS_PATH, {
            ...data,
            [fileKey]: ticketKey,
            lastUpdated: new Date().toISOString(),
          });
        });
        cy.wrap(ticketKey).as(envKey);
        return cy.wrap(ticketKey);
      });
  }
  saveActionPlanTicketKey() {
    return this._saveChildTicketKey(
      testData.childTypes.actionPlan,
      "actionPlanTicketKey",
      "actionPlanTicketKey",
    );
  }
  saveEvaluateImpactTicketKey(text) {
    return this._saveChildTicketKey(
      text,
      "evaluateImpactTicketKey",
      "evaluateImpactTicketKey",
    );
  }
}

export default RegChangeDialogWorkflowsPage;
