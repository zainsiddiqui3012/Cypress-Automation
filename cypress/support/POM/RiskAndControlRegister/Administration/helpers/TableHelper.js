/**
 * TableHelper - Utility class for table interactions and validations
 */

import locators from "../../../../../fixtures/locators.json";
class TableHelper {
  /**
   * Verify that a specific text exists in any table row
   * @param {string} tableSelector - CSS selector for the table
   * @param {string} text - Text to search for in the table
   */

  static verifyAnyTextInTable(tableSelector, texts) {
    const items = Array.isArray(texts) ? texts : [texts];

    cy.get(`${tableSelector} tbody tr`, { timeout: 20000 })
      .should("have.length.greaterThan", 0)
      .then(($rows) => {
        const tableText = $rows.text().toLowerCase().trim();
        const found = items.some((t) =>
          tableText.includes(t.toLowerCase().trim())
        );

        expect(found, `One of [${items.join(", ")}] should exist in the table`)
          .to.be.true;
      });
  }

  static verifyTextInTable(tableSelector, text) {
    cy.waitForTopMsgLoaderToDisappear(15000);
    cy.get(`${tableSelector} tbody tr`, { timeout: 15000 }).should(
      "contain.text",
      text
    );
  }

  static getFirstEventNameFromTable(tableSelector) {
    return cy
      .get(`${tableSelector} tbody tr:first td:first`, { timeout: 15000 })
      .invoke("text")
      .then((text) => text.trim());
  }
  static verifyEventExistsInTable(tableSelector, expectedName) {
    cy.get(`${tableSelector} tbody tr`, { timeout: 15000 })
      .should("exist")
      .then(($rows) => {
        const allTexts = [...$rows].map((r) => r.innerText.trim());
        expect(
          allTexts.some((t) => t.includes(expectedName)),
          `Table should contain row with event name: ${expectedName}`
        ).to.be.true;
      });
  }

  static findRowByPartialName(tableSelector, partialName) {
    return cy
      .contains(`${tableSelector} tbody tr`, partialName, { timeout: 15000 })
      .should("exist")
      .invoke("text");
  }

  static findRowByEventName(tableSelector, eventName) {
    return cy
      .get(`${tableSelector} tbody tr`, { timeout: 15000 })
      .filter((_, row) => row.innerText.includes(eventName))
      .first()
      .should("exist")
      .invoke("text");
  }

  /**
   * Click on a specific row containing text
   * @param {string} tableSelector - CSS selector for the table
   * @param {string} text - Text to search for to identify the row
   */
  static clickRowContaining(tableSelector, text) {
    cy.get(`${tableSelector} tbody tr`).contains(text).click();
  }

  /**
   * Verify table is empty or shows no data message
   * @param {string} tableSelector - CSS selector for the table
   */

  static verifyTableEmpty() {
    cy.get("body")
      .invoke("text")
      .should("match", /No data|0 entries|No records found/);
  }

  /**
   * Get row count from table
   * @param {string} tableSelector - CSS selector for the table
   * @returns {Cypress.Chainable} - Chainable with row count
   */
  static getRowCount(tableSelector) {
    return cy.get(`${tableSelector} tbody tr`).its("length");
  }

  /**
   * Verify specific row contains multiple values
   * @param {string} tableSelector - CSS selector for the table
   * @param {string} identifierText - Text to identify the specific row
   * @param {object} expectedValues - Object containing expected values
   */

  static verifyRowContainsValues(
    tableSelector,
    identifierText,
    expectedValues
  ) {
    // Wait until rows exist
    cy.get(`${tableSelector} tbody tr`, { timeout: 15000 }).should("exist");

    // Find the row containing the identifier text (event name)
    cy.contains(`${tableSelector} tbody tr`, identifierText, { timeout: 15000 })
      .should("exist")
      .then(($row) => {
        cy.wrap($row).within(() => {
          Object.entries(expectedValues).forEach(([key, value]) => {
            if (value) {
              // ✅ look only inside cells of this row
              cy.get("td", { timeout: 10000 }).should("contain.text", value);
            }
          });
        });
      });
  }

  /**
   * Change page size in pagination
   * @param {string} pageSizeSelector - CSS selector for page size dropdown
   * @param {string} size - Page size to select
   */
  static changePageSize(pageSizeSelector, size) {
    cy.get(pageSizeSelector).select(size);
  }

  /**
   * Verify pagination controls exist
   * @param {string} paginationSelector - CSS selector for pagination container
   */
  static verifyPaginationExists(paginationSelector = ".pagination, .pager") {
    cy.get(paginationSelector).should("be.visible");
  }

  /**
   * Search in table filter
   * @param {string} filterSelector - CSS selector for filter input
   * @param {string} searchText - Text to search for
   */
  static searchInFilter(filterSelector, searchText) {
    cy.get(filterSelector).clear().type(searchText);
  }

  /**
   * Clear table filter
   * @param {string} filterSelector - CSS selector for filter input
   */
  static clearFilter(filterSelector) {
    cy.get(filterSelector).clear();
  }

  /**
   * Wait for table to load completely
   * @param {string} tableSelector - CSS selector for the table
   * @param {number} timeout - Timeout in milliseconds
   */
  static waitForTableLoad(tableSelector, timeout = 10000) {
    cy.get(tableSelector).should("be.visible", { timeout });
    cy.get(locators.general.body).should("not.contain", "Loading");
  }

  /************************************************************************************
   * **************** R I S K -- T Y P E --- M E T H O D S *****************************
   * **********************************************************************************
   */
  /**
   * Verify Risk Type exists in table
   * @param {string} riskTypeName - Risk type name to verify
   */
  static verifyRiskTypeInTable(riskTypeName) {
    cy.waitForTopMsgLoaderToDisappear(15000);
    cy.get(locators.riskType.tableRows, { timeout: 15000 }).should(
      "contain.text",
      riskTypeName
    );
  }

  /**
   * Verify Risk Type does not exist in table
   * @param {string} riskTypeName - Risk type name to verify absence
   */
  static verifyRiskTypeNotInTable(riskTypeName) {
    cy.get(locators.riskType.tableBody).then(($tbody) => {
      if ($tbody.find("tr").length > 0) {
        cy.get(locators.riskType.tableRows).should(
          "not.contain.text",
          riskTypeName
        );
      } else {
        cy.log("Table is empty - risk type not found as expected");
      }
    });
  }

  /**
   * Verify multiple Risk Types exist in table
   * @param {Array} riskTypeNames - Array of risk type names to verify
   */
  static verifyMultipleRiskTypesInTable(riskTypeNames) {
    const items = Array.isArray(riskTypeNames)
      ? riskTypeNames
      : [riskTypeNames];

    cy.waitForTopMsgLoaderToDisappear(15000);
    cy.get(locators.riskType.tableRows, { timeout: 15000 }).then(($rows) => {
      const tableText = $rows.text();
      const found = items.some((name) => tableText.includes(name));
      expect(found, `One of [${items.join(", ")}] should exist in the table`).to
        .be.true;
    });
  }

  /**
   * Get first Risk Type name from table
   * @returns {Cypress.Chainable} First risk type name
   */
  static getFirstRiskTypeFromTable() {
    return cy
      .get(locators.riskType.riskfromTable, { timeout: 15000 })
      .invoke("text")
      .then((text) => text.trim());
  }
  /**
   * Verify Risk Type exists in table with specific validation
   * @param {string} expectedName - Expected risk type name
   */
  static verifyRiskTypeExistsInTable(expectedName) {
    cy.get(locators.riskType.tableRows, { timeout: 15000 })
      .should("exist")
      .then(($rows) => {
        const allTexts = [...$rows].map((r) => r.innerText.trim());
        expect(
          allTexts.some((t) => t.includes(expectedName)),
          `Table should contain row with risk type name: ${expectedName}`
        ).to.be.true;
      });
  }

  /**
   * Get Risk Type table row count
   * @returns {Cypress.Chainable} Number of rows
   */
  static getRiskTypeTableRowCount() {
    return cy.get(locators.riskType.tableRows).its("length");
  }

  /**
   * Verify Risk Type table has records
   */
  static verifyRiskTypeTableHasRecords() {
    cy.get(locators.riskType.tableRows).should("have.length.greaterThan", 0);
  }

  /**
   * Verify Risk Type table is empty
   */
  static verifyRiskTypeTableEmpty() {
    cy.get(locators.risk.administration.controlDefCategory.body)
      .should("contain.text", "No data to display")
      .or("contain.text", "No records found");
  }

  /**
   * Click Risk Type table row by name
   * @param {string} riskTypeName - Risk type name to click
   */
  static clickRiskTypeTableRow(riskTypeName) {
    cy.get(locators.riskType.tableRows).contains(riskTypeName).click();
  }

  /**
   * Click Risk Type table link by name
   * @param {string} riskTypeName - Risk type name link to click
   */
  static clickRiskTypeTableLink(riskTypeName) {
    cy.get(locators.riskType.tableRows).contains("a", riskTypeName).click();
  }

  /**
   * Verify Risk Type table pagination info
   * @param {string} expectedText - Expected pagination text
   */
  static verifyRiskTypePaginationInfo(expectedText) {
    cy.get(locators.riskType.paginationInfo).should(
      "contain.text",
      expectedText
    );
  }

  /**
   * Verify Risk Type table pagination controls visible
   */
  static verifyRiskTypePaginationVisible() {
    cy.get(locators.riskType.paginationContainer).should("be.visible");
  }

  /**
   * Sort Risk Type table by column
   * @param {string} columnName - Column name to sort by
   */
  static sortRiskTypeTableByColumn(columnName) {
    cy.get(locators.riskType.tableHeader).contains(columnName).click();
    cy.wait(1000); // Wait for sort to complete
  }

  /**
   * Wait for Risk Type table to load
   */
  static waitForRiskTypeTableLoad() {
    cy.get(locators.riskType.tableRows).should("be.visible");
  }
}

export default TableHelper;
