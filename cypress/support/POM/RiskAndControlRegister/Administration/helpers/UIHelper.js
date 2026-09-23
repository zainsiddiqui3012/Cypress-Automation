import locators from "../../../../../fixtures/locators.json";
class UIHelper {
  /**
   * Click a button with specific text
   * @param {string} selector - CSS selector for the button container
   * @param {string} btnText - Button text to click
   */
  static clickButtonByText(selector, btnText) {
    cy.get(selector, { timeout: 20000 })
      .parent()
      .contains("span", btnText)
      .should("be.visible")
      .click();
  }

  /**
   * Type text in an input field
   * @param {string} selector - CSS selector for the input
   * @param {string} text - Text to type
   * @param {object} options - Typing options
   */
  static typeInInput(selector, text, options = {}) {
    cy.get(selector).type(text, options);
  }

  /**
   * Clear and type text in an input field
   * @param {string} selector - CSS selector for the input
   * @param {string} text - Text to type
   * @param {object} options - Typing options
   */

  static clearAndType(selector, text, options = { delay: 100 }) {
    cy.get(selector).should("be.visible").clear();
    if (text) {
      cy.get(selector).type(text, options);
    }
  }

  /**
   * Click save button with validation
   * @param {string} selector - CSS selector for save button
   */
  static clickSaveButton(selector, elementPosition = "first") {
    let element = cy.get(selector, { timeout: 10000 });

    if (elementPosition === "first") {
      element = element.first();
    } else if (elementPosition === "last") {
      element = element.last();
    }
    element.scrollIntoView().should("be.visible").click({ force: true });
  }
  /**
   * Click save button with validation
   * @param {string} selector - CSS selector for save button
   */

  static clickSaveButtonRiskType(selector) {
    cy.get(selector, { timeout: 10000 })
      .first()
      .scrollIntoView()
      .click({ force: true });
  }

  static clickSaveRiskEventFormBtn(selector) {
    cy.get(selector)
      .should("be.visible")
      .click({ multiple: true, force: true });
  }

  /**
   * Search in AG Grid filter
   * @param {string} filterSelector - CSS selector for filter input
   * @param {string} searchText - Text to search
   * @param {number} index - Index of the filter input
   */
  static searchInGrid(filterSelector, searchText, index = 0) {
    cy.get(filterSelector)
      .eq(index)
      .should("be.visible")
      .click()
      .clear()
      .type(searchText, { delay: 100 })
      .type("{enter}");
  }

  /**
   * Verify grid row count
   * @param {string} selector - CSS selector for grid rows
   * @param {number} expectedCount - Expected row count
   * @param {number} index - Index of the row
   */
  static verifyGridRowCount(selector, expectedCount, index = 1) {
    cy.wait(500);
    cy.get(selector)
      .eq(index)
      .should("be.visible")
      .and("have.length", expectedCount);
  }

  /**
   * Double click on grid cell
   * @param {string} selector - CSS selector for grid cell
   * @param {number} index - Index of the cell
   */
  static doubleClickGridCell(selector, index = 1) {
    cy.get(selector)
      .eq(index)
      .wait(2000) // Wait for any potential loading
      .should("have.length", 1)
      .should("not.be.disabled")
      .dblclick();
  }

  /**
   * Verify text content in element
   * @param {string} selector - CSS selector
   * @param {string} expectedText - Expected text
   * @param {number} index - Index of the element
   */
  static verifyTextContent(selector, expectedText, index = 1) {
    cy.wait(2000) // wait for any potential loading
    cy.get(selector)
      .eq(index)
      .should("be.visible")
      .and("have.text", expectedText);
  }

  /**
   * Clear textarea and navigate with tabs
   * @param {string} selector - CSS selector for textarea
   */
  static clearTextareaAndTab(selector) {
    cy.get(selector)
      .should("be.visible")
      .type("{selectall}{backspace}")
      .clear()
      .then(() => {
        cy.focused().tab().tab();
      });
  }

  /**
   * Type in textarea and navigate with tabs
   * @param {string} selector - CSS selector for textarea
   * @param {string} text - Text to type
   */
  static typeInTextareaAndTab(selector, text) {
    cy.get(selector)
      .should("be.visible")
      .type("{selectall}{backspace}")
      .type(text, { delay: 100 })
      .then(() => {
        cy.focused().tab().tab();
      });
  }

  /**
   * Click filter icon
   * @param {string} selector - CSS selector for filter button
   * @param {number} index - Index of the filter button
   */
  static clickFilterIcon(selector, index) {
    cy.get(selector).eq(index).should("be.visible").click();
  }

  /**
   * Verify element visibility and text content
   * @param {string} selector - CSS selector
   * @param {string} expectedText - Expected text content
   * @param {object} options - Additional options
   */
  static verifyElementWithText(selector, expectedText, options = {}) {
    const element = cy.get(selector, options);
    element.should("be.visible");
    if (expectedText) {
      element.and("contain.text", expectedText);
    }
  }

  /**
   * Select dropdown option by value or text
   * @param {string} selector - CSS selector for dropdown
   * @param {string} optionValue - Option value or text to select
   */
  static selectDropdownOption(selector, optionValue) {
    cy.get(selector).select(optionValue);
  }

  /**
   * Clear dropdown selection
   * @param {string} selector - CSS selector for dropdown
   */
  static clearDropdownSelection(selector) {
    cy.get(selector).select('');
  }

  /**
   * Verify element is visible
   * @param {string} selector - CSS selector for element
   */
  static verifyElementVisible(selector) {
    cy.get(selector).scrollIntoView().should('be.visible');
  }

  /**
   * Verify element is not visible
   * @param {string} selector - CSS selector for element
   */
  static verifyElementNotVisible(selector) {
    cy.get(selector).scrollIntoView().should('not.be.visible');
  }

  /**
   * Click cancel button
   * @param {string} selector - CSS selector for cancel button (optional)
   */
  static clickCancel(selector = '.btn-cancel, #cancelBtn, [data-action="cancel"]') {
    cy.get(selector).scrollIntoView().click();
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - CSS selector for element
   * @param {number} timeout - Timeout in milliseconds
   */
  static waitForVisible(selector, timeout = 10000) {
    cy.get(selector, { timeout }).should('be.visible');
  }

  /**
   * Check checkbox
   * @param {string} selector - CSS selector for checkbox
   */
  static checkCheckbox(selector) {
    cy.get(selector).check();
  }

  /**
   * Uncheck checkbox
   * @param {string} selector - CSS selector for checkbox
   */
  static uncheckCheckbox(selector) {
    cy.get(selector).uncheck();
  }

  /**
   * Select multiple options from multi-select dropdown
   * @param {string} selector - CSS selector for multi-select
   * @param {Array} options - Array of option values to select
   */
  static selectMultipleOptions(selector, options) {
    options.forEach(option => {
      cy.get(selector).select(option, { force: true });
    });
  }

  /**
   * Hover over element
   * @param {string} selector - CSS selector for element
   */
  static hoverElement(selector) {
    cy.get(selector).trigger('mouseover');
  }

  /**
   * Right click on element
   * @param {string} selector - CSS selector for element
   */
  static rightClickElement(selector) {
    cy.get(selector).rightclick();
  }

  /**
   * Double click on element
   * @param {string} selector - CSS selector for element
   */
  static doubleClickElement(selector) {
    cy.get(selector).dblclick();
  }

  /**
   * Scroll element into view
   * @param {string} selector - CSS selector for element
   */
  static scrollIntoView(selector) {
    cy.get(selector).scrollIntoView();
  }

  /**
   * Get element text
   * @param {string} selector - CSS selector for element
   * @returns {Cypress.Chainable} - Cypress chainable with text content
   */
  static getElementText(selector) {
    return cy.get(selector).invoke('text');
  }

  /**
   * Force click on element (for hidden or overlapped elements)
   * @param {string} selector - CSS selector for element
   */
  static forceClick(selector) {
    cy.get(selector).click({ force: true });
  }

  /************************************************************************
   * Risk Type Specific Helpers
   *******************************************************************************/
  /**
   * Click Risk Type Add button specifically
   */

  /**
   * Click Risk Type Save button specifically
   */
  static clickRiskTypeSaveButton() {
    cy.get(locators.general.saveButton, { timeout: 10000 })
      .first()
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Click Risk Type Cancel button specifically
   */
  static clickRiskTypeCancelButton() {
    cy.get(locators.general.cancelFormBtn).click();
  }

  /**
   * Click Risk Type Close button (X) specifically
   */
  static clickRiskTypeCloseButton() {
    cy.get(locators.riskType.closeButton).click();
  }

  /**
   * Type in Risk Type name field
   * @param {string} name - Risk type name to type
   */
  static typeRiskTypeName(name) {
    this.clearAndType(locators.riskType.eventtypeName, name);
  }

  /**
   * Type in Risk Type description field
   * @param {string} description - Risk type description to type
   */
  static typeRiskTypeDescription(description) {
    this.clearAndType(
      locators.risk.administration.riskCategory.descriptionField,
      description
    );
  }

  /**
   * Click Risk Type filter button
   */
  static clickRiskTypeFilterButton() {
    cy.get(locators.general.filterModal).click();
  }

  /**
   * Select records per page for Risk Types
   * @param {string} value - Number of records to show
   */
  static selectRiskTypeRecordsPerPage(value) {
    cy.get(locators.riskType.recordsDropdown).select(value);
  }

  /**
   * Click Risk Type table header for sorting
   * @param {string} columnName - Column name to sort by
   */
  static clickRiskTypeTableHeader(columnName) {
    cy.get(locators.riskType.tableHeader).contains(columnName).click();
  }

  /**
   * Click Risk Type table row
   * @param {string} riskTypeName - Risk type name to click
   */
  static clickRiskTypeTableRow(riskTypeName) {
    cy.get(locators.riskType.tableRows).contains(riskTypeName).click();
  }

  /**
   * Click Risk Type table link
   * @param {string} riskTypeName - Risk type name link to click
   */
  static clickRiskTypeTableLink(riskTypeName) {
    cy.get(locators.riskType.tableRows).contains("a", riskTypeName).click();
  }

  /**
   * Verify Risk Type element visibility
   * @param {string} selector - Element selector
   */
  static verifyRiskTypeElementVisible(selector) {
    cy.get(selector).should("be.visible");
  }

  /**
   * Wait for Risk Type page to load
   */
  static waitForRiskTypePageLoad() {
    cy.get(locators.riskType.pageTitle)
      .should("be.visible")
      .and("contain.text", "Event Types");
    cy.get(locators.riskType.addButton).should("be.visible");
    cy.get(locators.riskType.eventTypesTable).should("be.visible");
  }

  /**
   * Apply filter in Risk Type modal
   * @param {string} filterText - Text to filter by
   */
  static applyRiskTypeFilter(filterText) {
    cy.get(locators.riskType.filterButton).click();
    cy.get(locators.riskType.filterModal).should("be.visible");

    if (filterText) {
      cy.get(locators.riskType.filterInput).clear().type(filterText);
    }

    cy.get(locators.riskType.filterApplyButton).click();
    cy.get(locators.riskType.filterModal).should("not.be.visible");
    cy.wait(1000);
  }

  /**
   * Clear Risk Type filter
   */
  static clearRiskTypeFilter() {
    cy.get(locators.riskType.filterButton).click();
    cy.get(locators.riskType.filterModal).should("be.visible");
    cy.get(locators.riskType.filterModalCloseButton).click();
    cy.get(locators.riskType.filterModal).should("not.be.visible");
    cy.wait(1000);
  }

  /**
   * Cancel Risk Type filter
   */
  static cancelRiskTypeFilter() {
    cy.get(locators.riskType.filterButton).click();
    cy.get(locators.riskType.filterModal).should("be.visible");
    cy.get(locators.riskType.filterCancelButton).click();
    cy.get(locators.riskType.filterModal).should("not.be.visible");
  }

  static clickThreeElipses(indexCount = 0) {
    cy.wait(2000);
    cy.get(locators.general.threeElipses)
    .should("be.visible")
    .eq(indexCount)
    .click();
  }

  static clickThreeElipsesDropDownOptions(optionText="Add recommended control", selector=".dropdown-menu.show") {
    cy.get(selector)
      .should("be.visible")
      .contains(optionText)
      .click();
  }

}

export default UIHelper;