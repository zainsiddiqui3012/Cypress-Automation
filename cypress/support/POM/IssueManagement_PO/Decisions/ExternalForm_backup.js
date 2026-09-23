const locators = require('../../../../fixtures/locators.json');
const testData = require('../../../../fixtures/IssueManagement/CreateIssueSetupData.json');

class ExternalForm {
  constructor() {
    this.constants = testData.externalWebformData.testData.constants;
  }

  /**
   * Gets element by data-componentid attribute
   * @param {string} componentId - The component ID
   * @returns {Cypress.Chainable} Cypress element
   */
  getByDataComponentId(componentId) {
    const selector = this.constants.cssSelectors.componentPrefix + componentId + this.constants.cssSelectors.componentSuffix;
    return cy.get(selector);
  }

  /**
   * Wait for external form to be loaded
   */
  waitForExternalFormToLoad() {
    cy.wait(this.constants.timeouts.formLoad);
  }

  /**
   * Enter Subject text
   * @param {string} subject - Subject text to enter
   */
  enterSubject(subject) {
    const componentId = locators.externalWebform.subject.match(/data-componentid="([^"]+)"/)[1];
    this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.textarea)
      .first()
      .should(this.constants.cssSelectors.visibility)
      .clear()
      .type(subject);
  }

  /**
   * Enter description text
   * @param {string} description - Description text to enter
   */
  enterDescription(description) {
    const componentId = locators.externalWebform.description.match(/data-componentid="([^"]+)"/)[1];
    this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.textarea)
      .first()
      .should(this.constants.cssSelectors.visibility)
      .click({ force: this.constants.elementProperties.force })
      .clear()
      .type(description);
  }

  /**
   * Enter identification date based on given date type
   * @param {string} dateType - Type of date (current, pastDate, futureDate)
   */
  enterIdentificationDate(dateType) {
    const regexPattern = /data-componentid="([^"]+)"/;
    let dateValue;
    const today = new Date();

    if (this.constants.dateTypes[dateType]) {
      const dateConfig = this.constants.dateTypes[dateType];
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + dateConfig.offset);
      
      const [month, day, year] = targetDate.toLocaleDateString(this.constants.dateFormats.locale, {
        month: this.constants.dateFormats.month,
        day: this.constants.dateFormats.day,
        year: this.constants.dateFormats.year
      }).split('/');
      
      dateValue = `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
    }

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
    const componentId = locators.externalWebform.potentialLoss.match(/data-componentid="([^"]+)"/)[1];
    this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.input)
      .first()
      .should(this.constants.cssSelectors.visibility)
      .clear()
      .type(amount);
  }

  /**
   * Select type of issue from dropdown
   * @param {string} issueType - Type of issue to select
   */
  selectTypeOfIssue(issueType) {
    const componentId = locators.externalWebform.typeOfIssue.match(/data-componentid="([^"]+)"/)[1];
    this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.label)
      .first()
      .should(this.constants.cssSelectors.visibility)
      .click({ force: this.constants.elementProperties.force })
      .type(this.constants.keyboardKeys.downArrow);

    cy.contains(this.constants.cssSelectors.span, issueType)
      .should(this.constants.cssSelectors.visibility)
      .click({ force: this.constants.elementProperties.force });
  }

  /**
   * Enter notification email
   * @param {string} email - Email address
   */
  enterNotifyEmail(email) {
    const componentId = locators.externalWebform.notifyEmail.match(/data-componentid="([^"]+)"/)[1];
    this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.input)
      .first()
      .should(this.constants.cssSelectors.visibility)
      .clear()
      .type(email);
  }

  /**
   * Get field value from any field
   * @param {string} fieldName - Field name to get value from
   * @returns {Cypress.Chainable} Field value
   */
  getFieldValue(fieldName) {
    const fieldLocator = locators.externalWebform[fieldName];
    const componentId = fieldLocator.match(/data-componentid="([^"]+)"/)[1];
    
    return this.getByDataComponentId(componentId)
      .should(this.constants.cssSelectors.visibility)
      .find(this.constants.cssSelectors.input + this.constants.cssSelectors.comma + this.constants.cssSelectors.textarea)
      .first()
      .should(this.constants.cssSelectors.visibility)
      .invoke(this.constants.elementProperties.val);
  }

  /**
   * Click Create button
   */
  clickCreateButton() {
    cy.get(locators.externalWebform.createButton)
      .should(this.constants.cssSelectors.visibility)
      .click({ force: this.constants.elementProperties.force });
  }

  /**
   * Validate required field errors
   * @param {string[]} expectedErrors - Array of expected error messages
   */
  validateRequiredFieldErrors(expectedErrors) {
    expectedErrors.forEach(errorText => {
      cy.contains(this.constants.validationStrings.div, errorText)
        .should(this.constants.cssSelectors.visibility);
    });
  }

  /**
   * Hover over Create button for validation
   */
  hoverCreateButtonForValidation() {
    cy.get(locators.externalWebform.createButton)
      .should(this.constants.cssSelectors.visibility)
      .trigger(this.constants.elementProperties.mouseover);
  }

  /**
   * Clear all form fields
   */
  clearAllFields() {
    const fieldNames = [
      this.constants.fieldNames.subject,
      this.constants.fieldNames.description,
      this.constants.fieldNames.potentialLoss,
      this.constants.fieldNames.notifyEmail
    ];
    
    fieldNames.forEach(fieldName => {
      const fieldLocator = locators.externalWebform[fieldName];
      const componentId = fieldLocator.match(/data-componentid="([^"]+)"/)[1];
      
      this.getByDataComponentId(componentId)
        .find(this.constants.cssSelectors.input + this.constants.cssSelectors.comma + this.constants.cssSelectors.textarea)
        .first()
        .clear();
    });
  }
}

module.exports = ExternalForm;
