const locators = require("../../../../fixtures/locators.json");
const testData = require("../../../../fixtures/IssueManagementDecisions/Decisions/CreateIssueSetupData.json");
import IssueUtility from "./IssueUtility";

export default class ExternalForm {
  constructor() {
    this.issueUtility = new IssueUtility();
    this.constants = testData.externalWebformData.testData.constants;
  }

  /**
   * Get element by data-component-id (direct access, no iframe)
   * @param {string} id - The data-component-id value
   * @returns {Cypress.Chainable} - Cypress chainable element
   */
  getByDataComponentId(id) {
    const timeouts = testData.externalWebformData.testData.timeouts;
    return cy.get(`[data-component-id='${id}']`, { timeout: timeouts.defaultOperation || 30000 });
  }

  /**
   * Wait for external form to be fully loaded and ready
   * This should be called after navigating to the external form URL
   */
  waitForFormToLoad() {
    const timeouts = testData.externalWebformData.testData.timeouts;
    // Wait for any of the main form elements to be present
    cy.get(locators.externalWebform.summary, { timeout: timeouts.defaultOperation || 30000 })
      .should('be.visible');
    
    cy.log(this.constants.logMessages.formLoaded);
  }

  /**
   * Enter data in Summary field
   * @param {string} summaryText - Text to enter in summary field
   */
  enterDataInSummaryField(summaryText) {
    cy.get(locators.externalWebform.summary)
      .should(this.constants.cssSelectors.visibility)
      .click({ force: this.constants.elementProperties.force })
      .type(summaryText);
  }

  /**
   * Enter submitter name
   * @param {string} submitterName - Name of the submitter
   */
  enterSubmitterName(submitterName) {
    const regexPattern = new RegExp(testData.externalWebformData.testData.constants.regexPattern);
    const componentId = locators.externalWebform.submitterName.match(regexPattern)[1];
    this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.inputTextarea)
      .first()
      .should(this.constants.cssSelectors.visibility)
      .click({ force: this.constants.elementProperties.force })
      .clear()
      .type(submitterName);
  }

  /**
   * Enter Event Occurrence date
   * @param {string} dateType - Type of date (current, past, future)
   */
  enterEventOccurrenceDate(dateType) {
    let dateValue;
    const today = new Date();
    const dateOffsets = testData.externalWebformData.testData.dateOffsets || { eventOccurrencePast: 30, eventOccurrenceFuture: 30 };
    
    switch(dateType) {
      case this.constants.dateTypes.current:
        dateValue = today.toISOString().split(this.constants.dateFormats.isoSplit)[this.constants.dateFormats.isoIndex];
        break;
      case this.constants.dateTypes.past:
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - dateOffsets.eventOccurrencePast);
        dateValue = pastDate.toISOString().split(this.constants.dateFormats.isoSplit)[this.constants.dateFormats.isoIndex];
        break;
      case this.constants.dateTypes.future:
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + dateOffsets.eventOccurrenceFuture);
        dateValue = futureDate.toISOString().split(this.constants.dateFormats.isoSplit)[this.constants.dateFormats.isoIndex];
        break;
      default:
        dateValue = today.toISOString().split(this.constants.dateFormats.isoSplit)[this.constants.dateFormats.isoIndex];
    }

    const regexPattern = new RegExp(testData.externalWebformData.testData.constants.regexPattern);
    const componentId = locators.externalWebform.eventOccurrence.match(regexPattern)[1];
    this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.input)
      .first()
      .should(this.constants.cssSelectors.visibility)
      .click({ force: this.constants.elementProperties.force })
      .clear()
      .type(dateValue);
  }

  /**
   * Enter Identification date
   * @param {string} dateType - Type of date (current, past, future)
   */
  enterIdentificationDate(dateType) {
    let dateValue;
    const today = new Date();
    const dateOffsets = testData.externalWebformData.testData.dateOffsets || { identificationPast: 15, identificationFuture: 15 };
    
    switch(dateType) {
      case this.constants.dateTypes.current:
        dateValue = today.toISOString().split(this.constants.dateFormats.isoSplit)[this.constants.dateFormats.isoIndex];
        break;
      case this.constants.dateTypes.past:
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - dateOffsets.identificationPast);
        dateValue = pastDate.toISOString().split(this.constants.dateFormats.isoSplit)[this.constants.dateFormats.isoIndex];
        break;
      case this.constants.dateTypes.future:
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + dateOffsets.identificationFuture);
        dateValue = futureDate.toISOString().split(this.constants.dateFormats.isoSplit)[this.constants.dateFormats.isoIndex];
        break;
      default:
        dateValue = today.toISOString().split(this.constants.dateFormats.isoSplit)[this.constants.dateFormats.isoIndex];
    }

    const regexPattern = new RegExp(testData.externalWebformData.testData.constants.regexPattern);
    const componentId = locators.externalWebform.identificationDate.match(regexPattern)[1];
    this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.input)
      .first()
      .should(this.constants.cssSelectors.visibility)
      .click({ force: this.constants.elementProperties.force })
      .clear()
      .type(dateValue);
  }

  /**
   * Enter Potential Loss amount
   * @param {number} amount - Amount between 1-100
   */
  enterPotentialLoss(amount) {
    const ranges = testData.externalWebformData.ranges;
    const validAmount = Math.max(ranges.potentialLossMin, Math.min(ranges.potentialLossMax, amount));
    
    const regexPattern = new RegExp(testData.externalWebformData.testData.constants.regexPattern);
    const componentId = locators.externalWebform.potentialLoss.match(regexPattern)[1];
    this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.input)
      .first()
      .should(this.constants.cssSelectors.visibility)
      .click({ force: this.constants.elementProperties.force })
      .clear()
      .type(validAmount.toString());
  }

  /**
   * Select Type of Issue from dropdown
   * @param {string} issueType - Issue type to select
   */
  selectTypeOfIssue(issueType) {
    const regexPattern = new RegExp(testData.externalWebformData.testData.constants.regexPattern);
    const componentId = locators.externalWebform.typeOfIssue.match(regexPattern)[1];
    this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.input)
      .first()
      .should(this.constants.cssSelectors.visibility)
      .click({ force: this.constants.elementProperties.force })
      .clear()
      .type(issueType)
      .type(this.constants.keyboardKeys.enter);
  }

  /**
   * Enter email in Notify field
   * @param {string} email - Email address to notify
   */
  enterNotifyEmail(email) {
    const regexPattern = new RegExp(testData.externalWebformData.testData.constants.regexPattern);
    const componentId = locators.externalWebform.notify.match(regexPattern)[1];
    
    // Handle potentially hidden email field
    this.getByDataComponentId(componentId).then($component => {
      const $input = $component.find(this.constants.cssSelectors.input);
      if ($input.length > 0) {
        if ($input.is(':visible')) {
          cy.wrap($input).first()
            .click({ force: this.constants.elementProperties.force })
            .clear()
            .type(email);
        } else {
          // For hidden fields, use force: true
          cy.wrap($input).first()
            .type(email, { force: this.constants.elementProperties.force });
        }
      }
    });
  }

  /**
   * Get field value for validation
   * @param {string} fieldName - Name of the field to get value from
   * @returns {Cypress.Chainable} - Chainable for the field value
   */
  getFieldValue(fieldName) {
    const locatorPath = locators.externalWebform[fieldName];
    if (!locatorPath) {
      throw new Error(`Field locator not found for: ${fieldName}`);
    }
    
    const regexPattern = new RegExp(testData.externalWebformData.testData.constants.regexPattern);
    const componentId = locatorPath.match(regexPattern)[1];
    return this.getByDataComponentId(componentId)
      .find(this.constants.cssSelectors.inputTextarea)
      .first();
  }

  /**
   * Click Create button to submit the form
   */
  clickCreateButton() {
    const regexPattern = new RegExp(testData.externalWebformData.testData.constants.regexPattern);
    const componentId = locators.externalWebform.createButton.match(regexPattern)[1];
    this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.buttonTypes)
      .first()
      .should(this.constants.cssSelectors.disabled)
      .click({ force: this.constants.elementProperties.force });
  }

  /**
   * Validate error messages for required fields
   * @param {string[]} expectedErrors - Array of expected error messages
   */
  validateRequiredFieldErrors(expectedErrors) {
    const config = testData.externalWebformData;
    
    expectedErrors.forEach(errorMessage => {
      cy.contains(errorMessage)
        .should('be.visible');
    });
  }

  /**
   * Hover over Create button to see validation tooltip
   */
  hoverCreateButtonForValidation() {
    cy.get(locators.externalWebform.createButton)
      .should(this.constants.cssSelectors.visibility)
      .trigger('mouseover');
  }

  /**
   * Clear all form fields
   */
  clearAllFields() {
    const fields = [
      locators.externalWebform.summary,
      locators.externalWebform.submitterName,
      locators.externalWebform.eventOccurrence,
      locators.externalWebform.identificationDate,
      locators.externalWebform.potentialLoss
    ];

    fields.forEach(field => {
      cy.get('body').then($body => {
        if ($body.find(field).length > 0) {
          cy.get(field).within(() => {
            cy.get('input, textarea').then($elements => {
              if ($elements.length > 0) {
                cy.wrap($elements.first()).click().clear();
              }
            });
          });
        }
      });
    });
    
    // Handle rich text editor separately
    cy.get('body').then($body => {
      if ($body.find(locators.externalWebform.originalReport).length > 0) {
        cy.get(locators.externalWebform.originalReport).within(() => {
          cy.get('textarea, .ql-editor, [contenteditable="true"]').then($elements => {
            if ($elements.length > 0) {
              cy.wrap($elements.first()).click().clear();
            }
          });
        });
      }
    });
    
    // Handle notify field separately as it might be hidden
    cy.get('body').then($body => {
      if ($body.find(locators.externalWebform.notify).length > 0) {
        cy.get(locators.externalWebform.notify).within(() => {
          cy.get('input').then($elements => {
            if ($elements.length > 0 && $elements.first().is(':visible')) {
              cy.wrap($elements.first()).click().clear();
            }
          });
        });
      }
    });
  }
}
