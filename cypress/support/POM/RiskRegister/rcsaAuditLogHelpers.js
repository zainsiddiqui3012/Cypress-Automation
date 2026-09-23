const { time } = require("console");
const locators = require("../../../fixtures/locators.json");

class RCSAAuditLogHelpers {
  constructor() {
    this.locators = locators.risk.administration.riskCategory.rcsaAuditLog;
  }

  // Navigation Methods
  /**
   * Navigates to RCSA Audit Log page
   * @description Clicks through navigation menu to reach RCSA Audit Log page and verifies URL
   * @param None
   * @returns {void}
   */
  navigateToRCSAAuditLog() {
    cy.get(locators.risk.administration.riskCategory.riskRegisterThreeEllipse)
      .should("be.visible")
      .click();

    cy.get(locators.risk.administration.riskCategory.rcsaAuditLogLink)
      .should("be.visible")
      .click();
    const url = "rcsaReviewAuditLog";
    cy.url().should("include", url);
    cy.wait(2000); // Wait for page to load
  }

  // RCSA Review Selection Methods
  /**
   * Selects RCSA review from dropdown
   * @description Opens RCSA review dropdown and selects specified review or first option if none specified
   * @param {string} reviewText - Text of the RCSA review to select (optional)
   * @returns {void}
   */
  selectRCSAReview(reviewText) {
    cy.get(this.locators.rcsaReviewDropdown).should("be.visible").click();

    cy.get(locators.general.dropDownSearch)
      .should("be.visible")
      .within(() => {
        if (reviewText) {
          cy.contains(
            locators.risk.administration.riskCategory.rcsaAuditLog
              .dropDownResult,
            reviewText
          ).click();
        } else {
          cy.get(
            locators.risk.administration.riskCategory.rcsaAuditLog
              .dropDownResult
          )
            .first()
            .click();
        }
      });

    cy.wait(1000);
  }

  /**
   * Clears RCSA review selection
   * @description Resets RCSA review dropdown to default "Select Please" option
   * @param None
   * @returns {void}
   */
  clearRCSAReviewSelection() {
    cy.get(this.locators.rcsaReviewDropdown).click();
    cy.get(
      locators.risk.administration.riskCategory.rcsaAuditLog
        .searchDropDownResult
    )
      .contains("Select Please")
      .click();
  }

  // Business Unit Selection Methods
  /**
   * Selects a single business unit from dropdown
   * @description Opens business unit dropdown and selects specified BU or first option if none specified
   * @param {string} buText - Text of the business unit to select (optional)
   * @returns {void}
   */
  selectBusinessUnit(buText) {
    cy.get(this.locators.businessUnitDropdown).should("be.visible").click();

    cy.get(locators.risk.administration.riskCategory.rcsaAuditLog.buDropDown)
      .should("be.visible")
      .within(() => {
        if (buText) {
          cy.contains(
            locators.risk.administration.riskCategory.rcsaAuditLog
              .buDropDownResult,
            buText
          ).click();
        } else {
          cy.get(
            locators.risk.administration.riskCategory.rcsaAuditLog
              .buDropDownResult
          )
            .first()
            .click();
        }
      });

    // Close dropdown
    cy.get("body").click();
    cy.wait(500);
  }

  /**
   * Selects multiple business units from dropdown
   * @description Opens business unit dropdown and selects all business units in the provided array
   * @param {Array<string>} buArray - Array of business unit names to select
   * @returns {void}
   */
  selectMultipleBusinessUnits(buArray) {
    cy.get(this.locators.businessUnitDropdown).click();

    buArray.forEach((bu) => {
      cy.get(locators.risk.administration.riskCategory.rcsaAuditLog.buDropDown)
        .should("be.visible")
        .within(() => {
          cy.contains(
            locators.risk.administration.riskCategory.rcsaAuditLog
              .buDropDownResult,
            bu
          ).click();
        });
    });

    // Close dropdown
    cy.get("body").click();
    cy.wait(500);
  }

  /**
   * Clears all business unit selections
   * @description Opens business unit dropdown and clicks clear all button to deselect all BUs
   * @param None
   * @returns {void}
   */
  clearBusinessUnitSelection() {
    cy.get(this.locators.businessUnitDropdown).click();
    cy.get(
      locators.risk.administration.riskCategory.rcsaAuditLog.buDropDownClearAll
    ).click();
    cy.get("body").click();
  }

  // Date Range Methods
  /**
   * Sets date range for audit log search
   * @description Enters start date and/or end date in the respective date fields
   * @param {string} startDate - Start date in format MM/DD/YYYY (optional)
   * @param {string} endDate - End date in format MM/DD/YYYY (optional)
   * @returns {void}
   */
  setDateRange(startDate, endDate) {
    if (startDate) {
      cy.get(this.locators.startDateField)
        .should("be.visible")
        .clear()
        .type(startDate)
        .type("{enter}");
    }

    if (endDate) {
      cy.get(this.locators.closedDateField)
        .should("be.visible")
        .clear()
        .type(endDate)
        .type("{enter}");
    }

    cy.wait(500);
  }

  /**
   * Clears date range fields
   * @description Removes all text from start and end date fields
   * @param None
   * @returns {void}
   */
  clearDateRange() {
    cy.get(this.locators.startDateField).clear();
    cy.get(this.locators.closedDateField).clear();
    // Close dropdown
    cy.get("body").click();
  }

  /**
   * Sets future date for validation testing
   * @description Sets start date to 30 days from current date
   * @param None
   * @returns {void}
   */
  setFutureDate() {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const formattedDate = futureDate.toLocaleDateString("en-US");

    this.setDateRange(formattedDate, null);
  }

  /**
   * Sets invalid date range for validation testing
   * @description Sets start date as today and end date as yesterday (invalid range)
   * @param None
   * @returns {void}
   */
  setInvalidDateRange() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayFormatted = today.toLocaleDateString("en-US");
    const yesterdayFormatted = yesterday.toLocaleDateString("en-US");

    // Set From Date > To Date (invalid)
    this.setDateRange(todayFormatted, yesterdayFormatted);
  }

  // Search and Validation Methods
  /**
   * Clicks the search button
   * @description Triggers audit log search with current filter criteria
   * @param None
   * @returns {void}
   */
  clickSearch() {
    cy.get(this.locators.searchButton).should("be.visible").click();

    cy.wait(2000); // Wait for search results
  }

  /**
   * Validates search results are displayed
   * @description Verifies audit log grid is visible and contains data or shows no records message
   * @param None
   * @returns {void}
   */
  validateSearchResults() {
    cy.get(this.locators.auditLogGrid).should("be.visible");

    // Check if grid has data or shows no records message
    cy.get("body").then(($body) => {
      if ($body.find(this.locators.noRecordsMessage).length > 0) {
      } else {
        cy.get(this.locators.auditLogGrid)
          .find(locators.risk.administration.riskCategory.rcsaAuditLog.agRow)
          .should("have.length.greaterThan", 0);
      }
    });
  }

  /**
   * Validates error message toast
   * @description Verifies that expected error message appears in toast notification
   * @param {string} expectedMessage - Expected error message text
   * @returns {void}
   */
  validateErrorMessage(expectedMessage) {
    cy.verifyToastMessageText(expectedMessage, 10000);
  }

  // Grid Filtering Methods
  /**
   * Filters audit log by risk name
   * @description Enters risk text in the risk filter input field
   * @param {string} riskText - Risk name to filter by
   * @returns {void}
   */
  filterByRisk(riskText) {
    cy.get(this.locators.riskFilterInput)
      .should("be.visible")
      .clear()
      .type(riskText);

    cy.wait(1000);
  }

  /**
   * Filters audit log by business unit
   * @description Enters business unit text in the BU filter input field
   * @param {string} buText - Business unit name to filter by
   * @returns {void}
   */
  filterByBU(buText) {
    cy.get(this.locators.buFilterInput)
      .should("be.visible")
      .clear()
      .type(buText);

    cy.wait(1000);
  }

  /**
   * Filters audit log by field name
   * @description Enters field name text in the field name filter input
   * @param {string} fieldName - Field name to filter by
   * @returns {void}
   */
  filterByFieldName(fieldName) {
    cy.get(this.locators.fieldNameFilterInput)
      .should("be.visible")
      .clear()
      .type(fieldName);

    cy.wait(1000);
  }

  /**
   * Filters audit log by change value
   * @description Enters change text in the change filter input field
   * @param {string} changeText - Change value to filter by
   * @returns {void}
   */
  filterByChange(changeText) {
    cy.get(this.locators.changeFilterInput)
      .should("be.visible")
      .clear()
      .type(changeText);

    cy.wait(1000);
  }

  /**
   * Filters audit log by user name
   * @description Enters user text in the user filter input field
   * @param {string} userText - User name to filter by
   * @returns {void}
   */
  filterByUser(userText) {
    cy.get(this.locators.userFilterInput)
      .should("be.visible")
      .clear()
      .type(userText);

    cy.wait(1000);
  }

  /**
   * Filters audit log by IP address
   * @description Enters IP address in the IP address filter input field
   * @param {string} ipAddress - IP address to filter by
   * @returns {void}
   */
  filterByIPAddress(ipAddress) {
    cy.get(this.locators.ipAddressFilterInput)
      .should("be.visible")
      .clear()
      .type(ipAddress);

    cy.wait(1000);
  }

  /**
   * Clears all grid filter inputs
   * @description Removes text from all filter input fields in the audit log grid
   * @param None
   * @returns {void}
   */
  clearAllFilters() {
    const filterInputs = [
      this.locators.riskFilterInput,
      this.locators.buFilterInput,
      this.locators.fieldNameFilterInput,
      this.locators.changeFilterInput,
      this.locators.userFilterInput,
      this.locators.ipAddressFilterInput,
    ];

    filterInputs.forEach((input) => {
      cy.get(input).clear();
    });

    cy.wait(1000);
  }

  // Grid Validation Methods
  /**
   * Validates all grid column headers are present
   * @description Verifies that all expected column headers exist in the audit log grid
   * @param None
   * @returns {void}
   */
  validateGridColumns() {
    const expectedColumns = [
      "Category",
      "Risk",
      "BU",
      "Field Name",
      "Change",
      "User",
      "Date & Time",
      "IP Address",
      "Actions",
    ];

    expectedColumns.forEach((column) => {
      cy.get(
        locators.risk.administration.riskCategory.rcsaAuditLog
          .auditLogResultHeaders
      ).should("contain.text", column);
    });
  }

  /**
   * Validates data in specific column
   * @description Verifies that specific column at given index contains expected data
   * @param {string} columnSelector - CSS selector for the column
   * @param {string} expectedData - Expected data text in the column
   * @param {number} index - Row index to check (default: 2)
   * @returns {void}
   */
  validateColumnData(columnSelector, expectedData, index = 2) {
    cy.get(columnSelector).eq(index).should("contain.text", expectedData);
  }

  /**
   * Validates field name and change columns structure
   * @description Verifies field name column visibility and change column contains arrow indicator
   * @param {number} index - Row index to validate (default: 2)
   * @returns {void}
   */
  validateFieldNameAndChangeColumns(index = 2) {
    cy.get(this.locators.fieldNameColumn).should("be.visible");

    cy.get(this.locators.changeColumn)
      .eq(index)
      .should("be.visible")
      .within(($el) => {
        cy.get($el).find(
          locators.risk.administration.riskCategory.rcsaAuditLog.changeArrow
        ); // '->' Arrow indicating before/after change
      });
  }

  /**
   * Validates no records message is displayed
   * @description Verifies that the "No Rows To Show" or custom error message appears in grid
   * @param {string} error - Expected error message text (default: "No Rows To Show")
   * @returns {void}
   */
  validateNoRecordsMessage(error = "No Rows To Show") {
    cy.get(this.locators.noRecordsMessage)
      .should("be.visible")
      .and("contain.text", error);
  }

  // Utility Methods
  /**
   * Gets count of rows in audit log grid
   * @description Returns the number of rows currently displayed in the audit log grid
   * @param None
   * @returns {Cypress.Chainable<number>} Cypress chainable yielding row count
   */
  getGridRowCount() {
    return cy
      .get(this.locators.auditLogGrid)
      .find(locators.risk.administration.riskCategory.rcsaAuditLog.agRow)
      .its("length");
  }

  /**
   * Scrolls to bottom of audit log grid
   * @description Performs smooth scroll to the bottom of the grid viewport
   * @param None
   * @returns {void}
   */
  scrollToBottomOfGrid() {
    cy.get(this.locators.auditLogGridViewport)
      .should("exist")
      .scrollTo("bottom", { duration: 400 });
  }

  /**
   * Validates multiple filters are applied and show results
   * @description Verifies that grid contains rows when multiple filters are active
   * @param None
   * @returns {void}
   */
  validateMultipleFiltersApplied() {
    // Verify that multiple filters show appropriate results
    cy.get(this.locators.auditLogGrid)
      .find(locators.risk.administration.riskCategory.rcsaAuditLog.agRow)
      .should("have.length.greaterThan", 0);
  }
}

module.exports = new RCSAAuditLogHelpers();