import UIHelper from "./helpers/UIHelper";
import FormHelper from "./helpers/FormHelper";
import ValidationHelper from "./helpers/ValidationHelper";
import TableHelper from "./helpers/TableHelper";
import DataHelper from "./helpers/DataHelper";
import DateHelper from "./helpers/DateHelper";
import locators from "../../../../fixtures/locators.json";

class RiskEvents {
  /**
   * Click the Add button to open the add risk event form
   */
  static clickAddButton() {
    UIHelper.clickButtonByText(locators.general.addBtn, "Add");
  }

  /**
   * Fill the risk event form with provided data using FormHelper
   * @param {Object} data - Risk event data
   * @param {string} data.name - Name of the risk event
   * @param {string} data.eventType - Type of the event
   * @param {string} data.owner - Owner of the event
   * @param {string} data.status - Status (Active/Inactive)
   * @param {string} data.eventDate - Event date
   * @param {string} data.closedDate - Closed date (optional)
   */
  static fillRiskEventForm(
    data,
    baseData,
    previousDate,
    futureDate,
    closeDate
  ) {
    // Fill form fields using UIHelper methods
    if (data.name !== undefined) {
      UIHelper.clearAndType(locators.general.nameInput, data.name || "");
    }

    if (baseData && baseData.eventType) {
      cy.get("#s2id_eventTypeID_").click();
      cy.dropDownSearchAndSelect(
        locators.general.selectSearch,
        baseData.eventType
      );
    }

    if (data.owner) {
      FormHelper.selectDropdown(locators.general.ownerDropdown, data.owner);
    }

    if (data.status) {
      FormHelper.selectRadioStatus(
        locators.general.statusActive,
        locators.general.statusInactive,
        data.status
      );
    }

    if (data.eventDate) {
      FormHelper.fillDateInput(
        locators.general.eventDateInput,
        data.eventDate,
        data.previousDate,
        data.futureDate,
        data.closedDate
      );
    }

    if (data.closedDate) {
      FormHelper.fillDateInput(
        locators.general.closedDateInput,
        data.closedDate
      );
    }
  }

  /**
   * Click the Save button using UIHelper
   */
  static clickSaveButton() {
    UIHelper.clickSaveRiskEventFormBtn(locators.general.saveButton);
  }

  /**
   * Click the Cancel button using FormHelper
   */
  static clickCancelButton() {
    FormHelper.clickCanButton(locators.general.cancelButton);
  }

  /**
   * Verify that a risk event exists in the table using TableHelper
   * @param {string} riskEventName - Name of the risk event to verify
   */
  static verifyRiskEventInTable(riskEventName) {
    TableHelper.verifyAnyTextInTable(
      locators.general.tableContainer,
      riskEventName
    );
  }

  static getFirstEventNameFromTable(tableSelector) {
    return cy
      .get(`${tableSelector} tbody tr:first td:first`, { timeout: 15000 })
      .invoke("text")
      .then((text) => text.trim());
  }

  /**
   * Click on a specific risk event in the table using TableHelper
   * @param {string} riskEventName - Name of the risk event to click
   */
  static clickRiskEventInTable(riskEventName) {
    TableHelper.clickRowContaining(
      locators.general.tableContainer,
      riskEventName
    );
  }

  /**
   * Open the filter modal using FormHelper
   */
  static openFilterModal() {
    FormHelper.clickButton(locators.general.filterButton);
  }

  /**
   * Apply a filter with the given text using simplified approach
   * @param {string} filterText - Text to filter by
   */
  static applyFilter(filterText) {
    this.openFilterModal();
    if (filterText) {
      cy.searchFilterNameWithoutStatus(filterText, "#riskEventName");
    }
  }
  static searchFilterAllowEmpty(filterText) {
    this.openFilterModal();
    if (filterText) {
      cy.searchFilterAllowEmpty(filterText, "#riskEventName");
    }
  }

  /**
   * Clear all applied filters using FormHelper
   */
  static clearFilter() {
    this.openFilterModal();
    FormHelper.clickButton(locators.general.clearFilterButton);
  }

  /**
   * Verify that a validation error message is displayed using ValidationHelper
   * @param {string} expectedMessage - Expected error message
   */
  static verifyValidationError(expectedMessage) {
    ValidationHelper.verifyValidationError(expectedMessage);
  }

  /**
   * Verify that form fields are highlighted for errors using ValidationHelper
   */
  static verifyFormErrorHighlight() {
    ValidationHelper.verifyFieldError(locators.general.nameInput);
  }

  /**
   * Verify that the table is empty using TableHelper
   */
  static verifyTableEmpty() {
    TableHelper.verifyTableEmpty(locators.general.tableContainer);
  }

  /**
   * Change the page size using TableHelper
   * @param {string} size - Page size to set
   */
  static changePageSize(size) {
    TableHelper.changePageSize(locators.general.pageSizeSelect, size);
  }

  /**
   * Verify that pagination exists using TableHelper
   */
  static verifyPaginationExists() {
    TableHelper.verifyPaginationExists();
  }

  /**
   * Wait for the risk event page to load completely using TableHelper
   */
  static waitForPageLoad() {
    TableHelper.waitForTableLoad(locators.general.tableContainer);
  }

  /**
   * Create a new risk event with the provided data using helper methods
   * @param {Object} riskEventData - Risk event data object
   */
  static createRiskEvent(
    riskEventData,
    baseData,
    previousDate,
    futureDate,
    closeDate
  ) {
    this.clickAddButton();
    cy.wait(1000);
    FormHelper.waitForModalToAppear(locators.general.modal);
    // FormHelper.waitForModalToAppear(this.selectors.modal);
    this.fillRiskEventForm(
      riskEventData,
      baseData,
      previousDate,
      futureDate,
      closeDate
    );
    this.clickSaveButton();
  }

  /**
   * Edit an existing risk event using helper methods
   * @param {string} riskEventName - Name of the risk event to edit
   * @param {Object} updateData - Data to update
   */
  static editRiskEvent(riskEventName, updateData) {
    this.clickRiskEventInTable(riskEventName);
    cy.wait(1000);
    FormHelper.waitForModalToAppear(locators.general.modal);
    this.fillRiskEventForm(updateData);
    this.clickSaveButton();
  }

  /**
   * Verify that a risk event exists with specific details using TableHelper
   * @param {Object} details - Expected risk event details
   * @param {string} details.name - Expected name
   * @param {string} details.eventType - Expected event type
   * @param {string} details.owner - Expected owner
   * @param {string} details.status - Expected status
   */
  static verifyRiskEventWithDetails(details) {
    TableHelper.verifyRowContainsValues(
      locators.general.tableContainer,
      details.name,
      details
    );
  }

  // === Enhanced Methods using DataHelper ===

  /**
   * Create risk event with unique name using DataHelper
   * @param {Object} baseData - Base risk event data
   * @returns {Object} - Data with unique name
   */
  static createUniqueRiskEventData(baseData) {
    return DataHelper.createUniqueTestData(baseData);
  }

  /**
   * Generate test data variations for comprehensive testing
   * @param {Object} baseData - Base risk event data
   * @returns {Object} - Object containing different test data variations
   */
  static generateTestDataVariations(baseData) {
    return DataHelper.createTestDataVariations(baseData);
  }

  /**
   * Create risk event with auto-generated unique name
   * @param {Object} baseData - Base risk event data
   */
  static createRiskEventWithUniqueName(
    baseData,
    previousDate,
    futureDate,
    closeDate
  ) {
    const uniqueData = this.createUniqueRiskEventData(baseData);
    this.createRiskEvent(
      uniqueData,
      baseData,
      previousDate,
      futureDate,
      closeDate
    );
    return uniqueData; // Return the data with unique name for further verification
  }

  /**
   * Batch create multiple risk events for testing pagination
   * @param {Object} baseData - Base risk event data
   * @param {number} count - Number of events to create
   * @returns {Array} - Array of created event data
   */
  static createMultipleRiskEvents(baseData, count = 5) {
    const createdEvents = [];
    for (let i = 0; i < count; i++) {
      const eventData = this.createUniqueRiskEventData(baseData);
      this.createRiskEvent(eventData);
      createdEvents.push(eventData);
      cy.wait(1000); // Small delay between creations
    }
    return createdEvents;
  }

  // === Validation Testing Methods ===

  /**
   * Test long name validation using DataHelper
   * @param {Object} baseData - Base risk event data
   * @param {number} maxLength - Maximum allowed length (default: 255)
   */
  static testLongNameValidation(baseData, maxLength = 255) {
    const longNameData = {
      ...baseData,
      name: DataHelper.generateOverLengthString(maxLength),
    };
    this.createRiskEvent(longNameData);
  }

  /**
   * Test empty name validation
   * @param {Object} baseData - Base risk event data
   */
  static testEmptyNameValidation(baseData) {
    const emptyNameData = { ...baseData, name: "" };
    this.createRiskEvent(emptyNameData);
  }
}

export default RiskEvents;
