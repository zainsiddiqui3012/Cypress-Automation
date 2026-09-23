import locatorsData from "../../../fixtures/locators.json";
import testData from "../../../fixtures/RegChangeFlows/RegulatoryChange.json";

const loc = locatorsData.cms.regChange.workflows;
const IFRAME = loc.iframe;

class RegChangeCreatePage {
  constructor() {
    this.selectors = {
      iframe: IFRAME,
      label: loc.formFields.businessUnitOption,
      advancedSearchLink: loc.navigation.advancedSearchLink,
      tasksMenu: loc.navigation.tasksMenu,
      regulatoryChangeLink: loc.navigation.regulatoryChangeLink,
      summaryField: loc.formFields.summaryField,
      businessUnitDropdown: loc.formFields.businessUnitDropdown,
      natureOfChangeDropdown: loc.formFields.natureOfChangeDropdown,
      typeOfChangeDropdown: loc.formFields.typeOfChangeDropdown,
      subjectAreaDropdown: loc.formFields.subjectAreaDropdown,
      magnitudeDropdown: loc.formFields.magnitudeDropdown,
      createButton: loc.createPage.createButton,
      ticketHeading: loc.createPage.ticketHeading,
      statusLabel: loc.labels.statusLabel,
      businessUnitLabel: loc.labels.businessUnitLabel,
      natureOfChangeLabel: loc.labels.natureOfChangeLabel,
      typeOfChangeLabel: loc.labels.typeOfChangeLabel,
      subjectAreaLabel: loc.labels.subjectAreaLabel,
      magnitudeLabel: loc.labels.magnitudeLabel,
      implementButton: loc.createPage.implementButton,
      createActionPlanButton: loc.createPage.createActionPlanButton,
      assigneeLabel: loc.labels.assigneeLabel,
      groupAssigneeLabel: loc.labels.groupAssigneeLabel,
      createdLabel: loc.labels.createdLabel,
      updatedLabel: loc.labels.updatedLabel,
    };
  }
  navigateToCreateForm() {
    cy.findInIframe(IFRAME, this.selectors.tasksMenu, 10000).trigger(
      "mouseover",
    );

    cy.findInIframe(IFRAME, this.selectors.regulatoryChangeLink, 10000).click();
    cy.iframeReady(IFRAME, this.selectors.summaryField, 15000);
  }
  fillSummary(summary) {
    cy.findInIframe(IFRAME, this.selectors.summaryField, 10000)
      .clear()
      .type(summary);
  }
  selectBusinessUnit(businessUnit) {
    cy.findInIframe(IFRAME, this.selectors.businessUnitDropdown, 10000).click();
    cy.iframeReady(IFRAME, this.selectors.label, 10000);
    cy.switchToIframe(IFRAME)
      .find(this.selectors.label)
      .contains(businessUnit)
      .click();
  }
  selectNatureOfChange(nature) {
    cy.findInIframe(
      IFRAME,
      this.selectors.natureOfChangeDropdown,
      10000,
    ).click();
    cy.iframeReady(IFRAME, this.selectors.label, 10000);
    cy.switchToIframe(IFRAME)
      .find(this.selectors.label)
      .contains(nature)
      .click({ force: true });
  }
  selectTypeOfChange(type) {
    cy.findInIframe(IFRAME, this.selectors.typeOfChangeDropdown, 10000).click();
    cy.iframeReady(IFRAME, this.selectors.label, 10000);
    cy.switchToIframe(IFRAME)
      .find(this.selectors.label)
      .contains(type)
      .click({ force: true });
  }
  selectSubjectArea(subjectArea) {
    cy.findInIframe(IFRAME, this.selectors.subjectAreaDropdown, 10000).click();
    cy.iframeReady(IFRAME, this.selectors.label, 10000);
    cy.switchToIframe(IFRAME)
      .find(this.selectors.label)
      .contains(subjectArea)
      .click();
  }
  selectMagnitude(magnitude) {
    cy.findInIframe(IFRAME, this.selectors.magnitudeDropdown, 10000).click();
    cy.iframeReady(IFRAME, this.selectors.label, 10000);
    cy.switchToIframe(IFRAME)
      .find(this.selectors.label)
      .contains(magnitude)
      .click({ force: true });
  }
  fillAllRequiredFields(data) {
    this.fillSummary(data.summary);
    this.selectBusinessUnit(data.businessUnit);
    this.selectNatureOfChange(data.natureOfChange);
    this.selectTypeOfChange(data.typeOfChange);
    this.selectSubjectArea(data.subjectArea);
    this.selectMagnitude(data.magnitude);
  }
  clickCreateButton() {
    cy.findInIframe(IFRAME, loc.createPage.createSubmitBtn, 10000).click();
    cy.iframeReady(IFRAME, this.selectors.ticketHeading, 15000);
  }
  verifyTicketCreated() {
    cy.findInIframe(IFRAME, this.selectors.ticketHeading, 10000).should(
      "be.visible",
    );
  }
  verifyFieldValue(fieldLabel, expectedValue) {
    cy.get(IFRAME, { timeout: 60000 }).should(($iframe) => {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      const $label = Cypress.$(body)
        .find(`:contains("${fieldLabel}")`)
        .filter(":visible");
      expect(
        $label.length,
        `"${fieldLabel}" visible in iframe`,
      ).to.be.greaterThan(0);
      const $value = Cypress.$(body)
        .find(`:contains("${expectedValue}")`)
        .filter(":visible");
      expect(
        $value.length,
        `"${expectedValue}" visible in iframe`,
      ).to.be.greaterThan(0);
    });
  }
  verifyAllFieldsSaved(data) {
    this.verifyFieldValue("Business Unit", data.businessUnit);
    this.verifyFieldValue("Nature of Change", data.natureOfChange);
    this.verifyFieldValue("Type of change", data.typeOfChange);
    this.verifyFieldValue("Subject Area", data.subjectArea);
    this.verifyFieldValue("Magnitude", data.magnitude);
  }
  verifyTicketStatus(expectedStatus) {
    cy.iframeContentEquals(
      IFRAME,
      loc.status.statusField,
      expectedStatus,
      50000,
    );
  }
  verifyWorkflowButtonsVisible() {
    cy.get(IFRAME, { timeout: 30000 }).should(($iframe) => {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      const $implement = Cypress.$(body)
        .find(
          `${loc.createPage.triggerLabel}:contains('${testData.workflowButtons.implement}')`,
        )
        .filter(":visible");
      expect(
        $implement.length,
        `"${testData.workflowButtons.implement}" visible in iframe`,
      ).to.be.greaterThan(0);
      const $createAP = Cypress.$(body)
        .find(
          `${loc.createPage.triggerLabel}:contains('${testData.workflowButtons.createActionPlan}')`,
        )
        .filter(":visible");
      expect(
        $createAP.length,
        `"${testData.workflowButtons.createActionPlan}" visible in iframe`,
      ).to.be.greaterThan(0);
    });
  }
  verifyAssigneeSection() {
    cy.get(IFRAME, { timeout: 30000 }).should(($iframe) => {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      const $assignee = Cypress.$(body)
        .find(`:contains("${this.selectors.assigneeLabel}")`)
        .filter(":visible");
      expect($assignee.length, '"Assignee" label visible').to.be.greaterThan(0);
      const $group = Cypress.$(body)
        .find(`:contains("${this.selectors.groupAssigneeLabel}")`)
        .filter(":visible");
      expect($group.length, '"Group Assignee" label visible').to.be.greaterThan(
        0,
      );
    });
  }
  verifyDateFields() {
    cy.get(IFRAME, { timeout: 30000 }).should(($iframe) => {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      const $created = Cypress.$(body)
        .find(`:contains("${this.selectors.createdLabel}")`)
        .filter(":visible");
      expect($created.length, '"Created" label visible').to.be.greaterThan(0);
      const $updated = Cypress.$(body)
        .find(`:contains("${this.selectors.updatedLabel}")`)
        .filter(":visible");
      expect($updated.length, '"Updated" label visible').to.be.greaterThan(0);
    });
  }
  createNewRegulatoryChange(data) {
    this.navigateToCreateForm();
    this.fillAllRequiredFields(data);
    this.clickCreateButton();
    this.verifyTicketCreated();
    this.verifyAllFieldsSaved(data);
    this.verifyTicketStatus(testData.parent.statuses.new);
    this.verifyWorkflowButtonsVisible();
    this.verifyAssigneeSection();
    this.verifyDateFields();
  }
}

export default RegChangeCreatePage;
