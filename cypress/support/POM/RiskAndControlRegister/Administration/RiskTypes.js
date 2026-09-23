import FormHelper from "./helpers/FormHelper";
import ValidationHelper from "./helpers/ValidationHelper";
import UIHelper from "./helpers/UIHelper";
import TableHelper from "./helpers/TableHelper";
import DataHelper from "./helpers/DataHelper";
import DateHelper from "./helpers/DateHelper";
import locators from "../../../../fixtures/locators.json";
/**
 * RiskTypes Page Object Model class
 * Utilizes helper classes for common operations
 */
class RiskTypes {
  constructor() {}

  /**
   * Navigate to Risk Types page
   */
  visitRiskTypesPage() {
    cy.visit(
      "https://stage.360factors.com/predict360/manageEventType.do?method=listEventTypes"
    );
    this.waitForPageLoad();
  }

  /**
   * Wait for page to fully load
   */
  waitForPageLoad() {
    cy.get(locators.riskType.pageTitle)
      .should("be.visible")
      .and("contain.text", "Event Types");
    cy.get(locators.riskType.addButton).should("be.visible");
    cy.get(locators.riskType.eventTypesTable).should("be.visible");
  }

  /**
   * Open the Add Risk Type form using FormHelper
   */
  openAddForm() {
    UIHelper.clickButtonByText(locators.riskType.addButton, "Add");
    cy.get(locators.riskType.formModal, { timeout: 10000 }).should(
      "be.visible"
    );
    cy.get(locators.riskType.nameInput, { timeout: 10000 })
      .should("be.visible")
      .type("Test Event");
    this.verifyFormTitle("Add Event Type");
  }

  /**
   * Fill Risk Type form using UIHelper methods
   * @param {object} data - Form data containing name and description
   */
  fillRiskTypeForm(data) {
    if (data.name !== undefined && data.name !== null) {
      if (data.name === "") {
        cy.get(locators.riskType.nameInput).clear();
      } else {
        UIHelper.clearAndType(locators.riskType.nameInput, data.name);
      }
    }

    if (data.description !== undefined && data.description !== null) {
      if (data.description === "") {
        cy.get(locators.riskType.descriptionInput).clear();
      } else {
        UIHelper.clearAndType(
          locators.riskType.descriptionInput,
          data.description
        );
      }
    }
  }

  /**
   * Save Risk Type using UIHelper
   */
  saveRiskType() {
    UIHelper.clickSaveButton(locators.riskType.saveButton);
  }

  /**
   * Cancel form using UIHelper
   */
  cancelForm() {
    cy.get(locators.riskType.cancelButtonName).click();
  }

  cancelFormbtn() {
    cy.get(locators.riskType.cancelButtonName).click();
  }

  /**
   * Close form using close button
   */
  closeForm() {
    cy.get(locators.riskType.closeButton).click();
  }

  /**
   * Verify form modal visibility
   */
  verifyFormModalVisible() {
    cy.get(locators.riskType.formModal).should("be.visible");
  }

  /**
   * Verify form modal is not visible
   */
  verifyFormModalNotVisible() {
    cy.get(locators.riskType.formModal).should("not.be.visible");
  }

  /**
   * Verify form title
   * @param {string} expectedTitle - Expected title text
   */
  verifyFormTitle(expectedTitle) {
    cy.get(locators.riskType.formTitle).should("contain.text", expectedTitle);
  }

  /**
   * Verify validation error using ValidationHelper
   * @param {string} fieldSelector - CSS selector for the field
   */
  verifyFieldValidationError(fieldSelector) {
    ValidationHelper.verifyFieldError(fieldSelector);
  }

  /**
   * Verify validation error message using ValidationHelper
   * @param {string} expectedMessage - Expected error message
   */
  verifyValidationErrorMessage(expectedMessage) {
    ValidationHelper.verifyValidationError(expectedMessage);
  }

  /**
   * Verify success message using ValidationHelper
   * @param {string} expectedMessage - Expected success message
   */
  verifySuccessMessage(expectedMessage) {
    ValidationHelper.verifySuccessMessage(expectedMessage);
  }

  /**
   * Verify max length validation using ValidationHelper
   * @param {string} fieldSelector - Field selector
   * @param {string} text - Text to validate
   * @param {number} maxLength - Maximum allowed length
   */
  verifyMaxLengthValidation(fieldSelector, text, maxLength = 255) {
    ValidationHelper.verifyMaxLengthValidation(fieldSelector, text, maxLength);
  }

  /**
   * Verify risk type exists in table using TableHelper
   * @param {string} name - Risk type name to verify
   */
  verifyRiskTypeInTable(name) {
    TableHelper.verifyTextInTable(locators.riskType.eventTypesTable, name);
  }

  /**
   * Verify risk type does not exist in table using TableHelper
   * @param {string} name - Risk type name to verify absence
   */
  verifyRiskTypeNotInTable(name) {
    cy.get(locators.riskType.tableBody).then(($tbody) => {
      if ($tbody.find("tr").length > 0) {
        cy.get(locators.riskType.tableRows).should("not.contain.text", name);
      } else {
        cy.log("Table is empty - risk type not found as expected");
      }
    });
  }

  /**
   * Verify multiple risk types exist in table using TableHelper
   * @param {Array} names - Array of risk type names to verify
   */
  verifyMultipleRiskTypesInTable(names) {
    TableHelper.verifyAnyTextInTable(locators.riskType.eventTypesTable, names);
  }

  /**
   * Get first risk type name from table using TableHelper
   * @returns {Cypress.Chainable} First risk type name
   */
  getFirstRiskTypeFromTable() {
    return TableHelper.getFirstEventNameFromTable(
      locators.riskType.eventTypesTable
    );
  }

  /**
   * Verify event exists in table using TableHelper
   * @param {string} expectedName - Expected event name
   */
  verifyEventExistsInTable(expectedName) {
    TableHelper.verifyEventExistsInTable(
      locators.riskType.eventTypesTable,
      expectedName
    );
  }

  /**
   * Click on a risk type row to edit
   * @param {string} name - Risk type name to click
   */
  editRiskType(name) {
    cy.get(locators.riskType.tableRows).contains(name).click();
    this.verifyFormModalVisible();
  }

  /**
   * Click on a risk type link (for navigation)
   * @param {string} name - Risk type name to click
   */
  clickRiskTypeLink(name) {
    cy.get(locators.riskType.tableRows).contains("a", name).click();
  }

  /**
   * Open filter modal
   */
  openFilter() {
    cy.get(locators.riskType.filterButton).click();
    cy.get(locators.riskType.filterModal).should("be.visible");
  }

  /**
   * Apply filter with given text
   * @param {string} filterText - Text to filter by
   */
  applyFilter(filterText) {
    this.openFilter();
    if (filterText) {
      UIHelper.clearAndType(locators.riskType.filterInput, filterText);
    }
    cy.get(locators.riskType.filterApplyButton).click();
    cy.get(locators.riskType.filterModal).should("not.be.visible");
    cy.wait(1000); // Wait for table to update
  }

  /**
   * Clear filter
   */
  clearFilter() {
    this.openFilter();
    cy.get(locators.riskType.filterClearButton).click(); // reset
    cy.contains("a.btn.btn-outline-primary", "Cancel").click(); // modal close
    cy.get(locators.riskType.filterModal).should("not.be.visible");
    cy.wait(1000);
  }

  /**
   * Cancel filter
   */
  cancelFilter() {
    this.openFilter();
    cy.get(locators.riskType.filterCancelButton).click();
    cy.get(locators.riskType.filterModal, { timeout: 10000 }).should(
      "not.be.visible"
    );
  }
  /**
   * Change records per page
   * @param {string} value - Number of records to show
   */
  changeRecordsPerPage(value) {
    cy.get(locators.riskType.recordsDropdown).select(value);
    cy.wait(2000);
    cy.get(locators.riskType.recordsDropdown).select(value);
    cy.wait(2000); // Wait for page to reload
  }

  /**
   * Verify pagination information
   * @param {string} expectedText - Expected pagination text
   */
  verifyPaginationInfo(expectedText) {
    cy.get(locators.riskType.paginationInfo).should(
      "contain.text",
      expectedText
    );
  }

  /**
   * Verify table has records
   */
  verifyTableHasRecords() {
    cy.get(locators.riskType.tableRows).should("have.length.greaterThan", 0);
  }

  /**
   * Verify table is empty or shows no data message
   */
  verifyNoDataMessage() {
    cy.get("body").should("contain.text", "Showing 0 to 0 of 0 entries");
  }

  /**
   * Verify breadcrumb navigation
   */
  verifyBreadcrumbs() {
    cy.get(".m-subheader__breadcrumbs").should(
      "contain.text",
      "Risk and Control Register"
    );
    cy.get(".m-subheader__breadcrumbs").should(
      "contain.text",
      "Administration"
    );
    cy.get(".m-subheader__breadcrumbs").should("contain.text", "Event Types");
  }

  /**
   * Sort table by column
   * @param {string} columnName - Column name to sort by
   */
  sortByColumn(columnName) {
    cy.get(locators.riskType.tableHeader).contains(columnName).click();
    cy.wait(1000); // Wait for sort to complete
  }

  /**
   * Verify element is visible
   * @param {string} selector - Element selector
   */
  verifyElementVisible(selector) {
    cy.get(selector).should("be.visible");
  }

  /**
   * Verify help text is displayed
   * @param {string} expectedText - Expected help text
   */
  verifyHelpText(expectedText) {
    cy.get(locators.riskType.helpText).should("contain.text", expectedText);
  }

  /**
   * Get table row count
   * @returns {Cypress.Chainable} Number of rows
   */
  getTableRowCount() {
    return cy.get(locators.riskType.tableRows).its("length");
  }

  /**
   * Verify pagination controls are visible
   */
  verifyPaginationVisible() {
    cy.get(locators.riskType.paginationContainer).should("be.visible");
  }

  /**
   * Clear all form fields
   */
  clearAllFormFields() {
    cy.get(locators.riskType.nameInput).clear();
    cy.get(locators.riskType.descriptionInput).clear();
  }

  /**
   * Verify required field indicator
   * @param {string} fieldLabel - Label text for the field
   */
  verifyRequiredField(fieldLabel) {
    cy.contains(fieldLabel)
      .parent()
      .find(locators.riskType.requiredIndicator)
      .should("be.visible");
  }

  /**
   * Get form field value
   * @param {string} fieldSelector - Field selector
   * @returns {Cypress.Chainable} Field value
   */
  getFieldValue(fieldSelector) {
    return cy.get(fieldSelector).invoke("val");
  }

  // Data generation methods using DataHelper

  /**
   * Generate unique risk type name using DataHelper
   * @param {string} baseName - Base name prefix
   * @returns {string} Unique name
   */
  generateUniqueRiskTypeName(baseName = "AutoRiskType") {
    return DataHelper.generateUniqueName(baseName);
  }

  /**
   * Generate unique name with date using DataHelper
   * @param {string} baseName - Base name prefix
   * @returns {string} Unique name with date
   */
  generateUniqueNameWithDate(baseName = "RiskType") {
    return DataHelper.generateUniqueNameWithDate(
      baseName,
      "MM/DD/YYYY_HH:mm:ss"
    );
  }

  /**
   * Create unique test data using DataHelper
   * @param {object} baseData - Base data object
   * @returns {object} Data with unique name
   */
  createUniqueTestData(baseData) {
    return DataHelper.createUniqueTestData(baseData, "name");
  }

  /**
   * Generate long name exceeding character limit using DataHelper
   * @param {number} length - Length of the name
   * @returns {string} Long name
   */
  generateLongName(length = 256) {
    return DataHelper.generateRandomString(length, "A");
  }

  /**
   * Generate random string using DataHelper
   * @param {number} length - String length
   * @returns {string} Random string
   */
  generateRandomString(length = 10) {
    return DataHelper.generateRandomString(length);
  }

  /**
   * Generate test data with special characters
   * @returns {object} Test data with special characters
   */
  generateSpecialCharsTestData() {
    return {
      name: `Test@Risk#Type&${Date.now()}`,
      description: "Description with special chars: !@#$%^&*()",
    };
  }

  /**
   * Wait for AJAX requests to complete
   */
  waitForAjax() {
    cy.wait(2000);
  }

  /**
   * Verify no validation errors exist
   */
  verifyNoValidationErrors() {
    cy.get(locators.riskType.errorGroup).should("not.exist");
  }
}

export default RiskTypes;
