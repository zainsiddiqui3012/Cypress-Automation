import locators from "../../../../../fixtures/locators.json";
import testData from "../../../../../fixtures/RiskAndControlRegister/Administration/RiskTypes.json";
class ValidationHelper {
  /**
   * Verify validation error message appears
   * @param {string} expectedMessage - Expected error message
   * @param {number} timeout - Timeout for waiting
   */
  static verifyValidationError(expectedMessage, timeout = 10000) {
    cy.get(locators.administration.toastMsg, {
      timeout,
    })
      .should("be.visible")
      .and("contain.text", expectedMessage);
  }

  /**
   * Verify form field has error state
   * @param {string} fieldSelector - CSS selector for the field
   */
  static verifyFieldError(fieldSelector) {
    cy.get(fieldSelector)
      .parents(".form-group")
      .should("have.class", "has-danger");
  }

  /**
   * Verify character count validation
   * @param {string} fieldSelector - CSS selector for the field
   * @param {string} text - Text to type
   * @param {number} maxLength - Maximum allowed length default 255 characters
   */
  static verifyMaxLengthValidation(fieldSelector, text, maxLength = 255) {
    cy.get(fieldSelector)
      .clear({ force: true })
      .type(text, { force: true })
      .should("have.attr", "maxlength", maxLength.toString());
  }

  /**
   * Verify success message appears
   * @param {string} expectedMessage - Expected success message
   */
  static verifySuccessMessage(expectedMessage) {
    cy.get(locators.administration.toastMsg, { timeout: 10000 })
      .should("be.visible")
      .and("contain.text", expectedMessage);
  }

  /**
   * Verify duplicate validation error
   * @param {string} itemType - Type of item (category/definition)
   */
  static verifyDuplicateError(itemType = "item") {
    const messages = [
      `Duplicate ${itemType} name not allowed`,
      `${itemType} name must be unique`,
      `${itemType} already exists`,
      "Already Exists",
    ];

    cy.get(locators.administration.toastMsg, { timeout: 10000 })
      .should("be.visible")
      .then(($el) => {
        const text = $el.text();
        const hasValidMessage = messages.some((msg) => text.includes(msg));
        expect(hasValidMessage).to.be.true;
      });
  }

  /**
   * Validate that element does not contain specific text
   * @param {string} selector - CSS selector for the element
   * @param {string} text - Text that should not be present
   */
  static validateElementDoesNotContain(selector, text) {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('not.contain.text', text);
      }
    });
  }

  /**
   * Validate error message in specific container
   * @param {string} selector - CSS selector for error container
   * @param {string} expectedMessage - Expected error message
   */
  static validateErrorMessage(selector, expectedMessage) {
    cy.get(selector)
      .should('be.visible')
      .and('contain.text', expectedMessage);
  }

  /**
   * Validate minimum element count
   * @param {string} selector - CSS selector for elements to count
   * @param {number} minCount - Minimum expected count
   */
  static validateMinimumElementCount(selector, minCount) {
    cy.get(selector).should('have.length.at.least', minCount);
  }

  /**
   * Validate dropdown selection
   * @param {string} selector - CSS selector for dropdown
   * @param {string} expectedValue - Expected selected value
   */
  static validateDropdownSelection(selector, expectedValue) {
    cy.get(selector).should('have.value', expectedValue);
  }

  /**
   * Validate dropdown options
   * @param {string} selector - CSS selector for dropdown
   * @param {Array} expectedOptions - Array of expected options
   */
  static validateDropdownOptions(selector, expectedOptions) {
    expectedOptions.forEach(option => {
      cy.get(`${selector} option`).should('contain.text', option);
    });
  }

  /**
   * Validate checkbox is selected
   * @param {string} selector - CSS selector for checkbox
   */
  static validateCheckboxSelected(selector) {
    cy.get(selector).should('be.checked');
  }

  /**
   * Validate grid data structure
   * @param {string} gridSelector - CSS selector for grid
   * @param {Object} criteria - Validation criteria
   */
  static validateGridData(gridSelector, criteria) {
    cy.get(gridSelector).should('be.visible');
    
    if (criteria.expectedColumns) {
      criteria.expectedColumns.forEach(columnName => {
        cy.get(`${gridSelector} .ag-header-cell`).should('contain.text', columnName);
      });
    }
    
    if (criteria.minRows) {
      cy.get(`${gridSelector} .ag-row`).should('have.length.at.least', criteria.minRows);
    }
  }

  /**
   * Validate form fields against expected values
   * @param {Object} fieldValueMap - Object mapping selectors to expected values
   */
  static validateFormFields(fieldValueMap) {
    Object.keys(fieldValueMap).forEach(selector => {
      cy.get(selector).should('have.value', fieldValueMap[selector]);
    });
  }

  /**
   * Validate field validation state
   * @param {string} fieldSelector - CSS selector for field
   * @param {string} expectedResult - Expected validation result ('valid' or 'invalid')
   */
  static validateFieldValidation(fieldSelector, expectedResult) {
    if (expectedResult === 'valid') {
      cy.get(fieldSelector).should('not.have.class', 'is-invalid');
    } else {
      cy.get(fieldSelector).should('have.class', 'is-invalid');
    }
  }

  /**
   * Validate text content in element
   * @param {string} selector - CSS selector for element
   * @param {string} expectedText - Expected text content
   */
  static validateText(selector, expectedText) {
    cy.get(selector).should('contain.text', expectedText);
  }

  /**
   * Validate element contains text
   * @param {string} selector - CSS selector for element
   * @param {string} expectedText - Expected text content
   */
  static validateElementContainsText(selector, expectedText) {
    cy.get(selector).should('contain.text', expectedText);
  }

  /**
   * Validate elements are visible
   * @param {string} selector - CSS selector for elements
   * @param {number} minCount - Minimum number of visible elements
   */
  static validateElementsVisible(selector, minCount = 1) {
    cy.get(selector).should('be.visible').and('have.length.at.least', minCount);
  }

  /**
   * Validate form validation rules
   * @param {Array} validationRules - Array of validation rule objects
   */
  static validateFormValidation(validationRules) {
    validationRules.forEach(rule => {
      if (rule.rule === 'required') {
        cy.get(rule.field).should('have.attr', 'required');
      } else if (rule.rule === 'optional') {
        cy.get(rule.field).should('not.have.attr', 'required');
      }
    });
  }

  /**********************  R I S K -- T Y P E --- M E T H O D S ********************************************
   * *******************************************************************************************************
   */

  /**
   * Verify validation error message appears for Risk Types
   * @param {string} expectedMessage - Expected error message
   * @param {number} timeout - Timeout for waiting
   */
  static verifyRiskTypeValidationError(expectedMessage, timeout = 10000) {
    // Check for multiple possible toast selectors
    cy.get("body").then(($body) => {
      if ($body.find(".toast-message").length > 0) {
        cy.get(".toast-message", { timeout })
          .should("be.visible")
          .and("contain.text", expectedMessage);
      } else if ($body.find(".toastr-message").length > 0) {
        cy.get(".toastr-message", { timeout })
          .should("be.visible")
          .and("contain.text", expectedMessage);
      } else if ($body.find('[class*="toast"]').length > 0) {
        cy.get('[class*="toast"]', { timeout })
          .should("be.visible")
          .and("contain.text", expectedMessage);
      } else {
        // Fallback - look for any element containing the message
        cy.contains(expectedMessage, { timeout }).should("be.visible");
      }
    });
  }

  /**
   * Verify Risk Type form field has error state
   * @param {string} fieldSelector - CSS selector for the field
   */
  static verifyRiskTypeFieldError(fieldSelector) {
    cy.get(fieldSelector)
      .parents(locators.riskType.groupForm)
      .should("have.class", "has-danger");
  }

  /**
   * Verify no validation errors exist in Risk Type form
   */
  static verifyNoRiskTypeValidationErrors() {
    cy.get(locators.riskType.errorGroup).should("not.exist");
  }

  /**
   * Verify success message for Risk Type operations
   * @param {string} expectedMessage - Expected success message
   * @param {number} timeout - Timeout for waiting
   */
  static verifyRiskTypeSuccessMessage(expectedMessage, timeout = 10000) {
    // Similar to error message but for success
    cy.get("body").then(($body) => {
      if ($body.find(".toast-success").length > 0) {
        cy.get(".toast-success", { timeout })
          .should("be.visible")
          .and("contain.text", expectedMessage);
      } else if ($body.find(".toastr-success").length > 0) {
        cy.get(".toastr-success", { timeout })
          .should("be.visible")
          .and("contain.text", expectedMessage);
      } else {
        // Fallback for general toast messages
        this.verifyRiskTypeValidationError(expectedMessage, timeout);
      }
    });
  }

  /**
   * Verify duplicate name error for Risk Types
   * @param {string} duplicateName - The duplicate name that was attempted
   */
  static verifyRiskTypeDuplicateError(duplicateName) {
    this.verifyRiskTypeValidationError(testData.toastMessage.duplicateError);
  }

  /**
   * Verify required field error for Risk Types
   * @param {string} fieldName - Field name that is required
   */
  static verifyRiskTypeRequiredFieldError(fieldName) {
    this.verifyRiskTypeValidationError(testData.toastMessage.validationError);
  }

  /**
   * Verify character limit validation for Risk Type fields
   * @param {string} fieldSelector - Field selector
   * @param {number} maxLength - Maximum allowed length
   */
  static verifyRiskTypeCharacterLimit(fieldSelector, maxLength = 255) {
    cy.get(fieldSelector).should(
      "have.attr",
      "maxlength",
      maxLength.toString()
    );
  }

  /**
   * Verify help text for Risk Type fields
   * @param {string} expectedHelpText - Expected help text
   */
  static verifyRiskTypeHelpText(expectedHelpText) {
    cy.get(locators.riskType.helpText).should("contain.text", expectedHelpText);
  }

  /**
   * Verify required field indicator for Risk Types
   * @param {string} fieldLabel - Label text for the field
   */
  static verifyRiskTypeRequiredIndicator(fieldLabel) {
    cy.contains(fieldLabel).parent().find(".required").should("be.visible");
  }
}

export default ValidationHelper;
