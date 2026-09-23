import UIHelper from "./UIHelper";
import ValidationHelper from "./ValidationHelper";
import TableHelper from "./TableHelper";
import locators from "../../../../../fixtures/locators.json";
class FilterAndDeleteHelper {
  /**
   * Apply filter by Name in AG-Grid
   * @param {string} filterValue - Value to filter by
   * @param {number} columnIndex - Column index for name filter (default: 0 for Name column)
   */

  static FilterSearchHelper(
    filterValue,
    columnIndex,
    searchFilterElement = ".ag-input-field [aria-label='Filter Value']"
  ) {
    cy.get("[aria-label='Open Filter Menu'] .ag-icon-filter")
      .eq(columnIndex)
      .click();

    cy.get(searchFilterElement)
      .first()
      .clear()
      .type("{selectall}{backspace}") // Clear existing text
      .type(filterValue)
      .type("{enter}");

    // Wait for filter to be applied
    cy.wait(1000);
  }

  static filterByName(filterValue, columnIndex = 0) {
    // Use AG-Grid floating filter for Name column
    this.FilterSearchHelper(filterValue, columnIndex);
  }

  /**
   * Apply filter by Business Area Definition
   * @param {string} businessArea - Business area to filter by
   */
  static filterByBusinessArea(businessArea, columnIndex = 1) {
    // Use AG-Grid floating filter for Business Area column
    this.FilterSearchHelper(businessArea, columnIndex);
  }

  /**
   * Apply filter by Risk Definition ID
   * @param {string} riskDefId - Risk Definition ID to filter by
   */
  static filterByRiskDefinitionId(riskDefId, columnIndex = 2) {
    this.FilterSearchHelper(riskDefId, columnIndex);
  }

  /**
   * Apply filter by Status using dropdown menu
   * @param {string} status - Status to filter by ('Active', 'Inactive')
   */
  static filterByStatus(status, columnIndex = 6) {
    // Click on Status filter button to open the menu
    this.FilterSearchHelper(status, columnIndex, "[aria-label='Search filter values']");
  }

  /**
   * Verify filter results contain expected text
   * @param {string} expectedText - Text that should appear in filtered results
   * @param {string} gridSelector - Grid selector (default: AG-Grid body)
   */
  static verifyFilterResults(
    expectedText,
    gridSelector = ".ag-center-cols-container"
  ) {
    cy.get(gridSelector).should("contain.text", expectedText);
  }

  /**
   * Verify filter results count
   * @param {number} expectedCount - Expected number of rows after filtering
   */
  static verifyFilteredRowCount(expectedCount, gridSelector = ".ag-row") {
    cy.get(gridSelector).should("have.length", expectedCount);
  }

  /**
   * Delete item using context menu or delete button
   * @param {string} itemName - Name of item to delete
   * @param {boolean} confirmDelete - Whether to confirm deletion (default: true)
   * @param {string} gridSelector - Grid container selector
   */
  static deleteItemFromGrid(
    confirmDelete = true,
    buttonSelector = "a.btn-danger",
  ) {
    // Find the row containing the item
    cy.get(buttonSelector)
    .should("be.visible")
    .click();
    // Handle confirmation dialog
    if (confirmDelete) {
      cy.get(locators.general.deleteRiskDefinitionConfirmBtn)
      .click();
    }

    cy.wait(2000);
  }

  /**
   * Verify item is deleted from grid
   * @param {string} itemName - Name of deleted item
   * @param {string} gridSelector - Grid selector
   */
  static verifyItemDeleted(
    itemName,
    gridSelector = ".ag-center-cols-container"
  ) {
    cy.get(gridSelector).should("not.contain.text", itemName);
  }

  /**
   * Verify deletion success message
   * @param {string} expectedMessage - Expected success message
   */
  static verifyDeletionSuccess(expectedMessage = "deleted successfully") {
    ValidationHelper.verifySuccessMessage(expectedMessage);
  }

  /**
   * Verify deletion error message for items that cannot be deleted
   * @param {string} expectedError - Expected error message
   */
  static verifyDeletionError(expectedError) {
    ValidationHelper.verifyValidationError(expectedError);
  }

  /**
   * Search and filter combination
   * @param {string} searchTerm - Term to search for
   * @param {Object} filters - Object containing filter criteria
   */
  static searchAndFilter(searchTerm, filters = {}) {
    // Apply search first
    if (searchTerm) {
      this.filterByName(searchTerm);
    }

    // Apply additional filters
    if (filters.businessArea) {
      this.filterByBusinessArea(filters.businessArea);
    }

    if (filters.status) {
      this.filterByStatus(filters.status);
    }

    if (filters.riskDefinitionId) {
      this.filterByRiskDefinitionId(filters.riskDefinitionId);
    }

    cy.wait(1500); // Wait for all filters to be applied
  }
}

export default FilterAndDeleteHelper;
