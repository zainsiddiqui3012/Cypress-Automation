import { time } from "console";
import locators from "../../../../fixtures/locators.json";
import testData from "../../../../fixtures/RiskAndControlRegister/Administration/RiskTaxonomyLibrariesCustomerSpace.json";
import ImportHelper from "../../../../support/POM/RiskAndControlRegister/Administration/helpers/ImportHelper.js";

/**
 * Page Object Model for the Risk Taxonomy Libraries screen.
 * Provides reusable methods to interact with dropdowns, grids, flyouts, and workflow steps.
 */
export class RiskTaxonomyLibrariesPage {
  /**
   * Initializes locators, test data, and runtime helpers.
   * @constructor
   */
  constructor() {
    /** @type {object} Locators for Risk Taxonomy Libraries */
    this.loc = locators.Administration.RiskTaxonomyLibraries;

    /** @type {object} Test data for Risk Taxonomy Libraries */
    this.data = testData.test;

    /**
     * Runtime selector helper for result options.
     * @param {number} index - Index of the result option.
     * @returns {string} CSS selector for the indexed option.
     */
    this.loc.dropdown.resultOption = (index) =>
      `${this.loc.dropdown.resultOptionTemplate}:eq(${index})`;
  }

  /**
   * Opens the library dropdown and asserts it is visible.
   * @returns {void}
   */
  openLibraryDropdown() {
    cy.get(this.loc.dropdown.selector).click();
    cy.get(this.loc.dropdown.results).should("be.visible");
  }

  /**
   * Searches for a library by name and selects it.
   * @param {string} name - The library name to search and select.
   * @returns {void}
   */
  searchAndSelectLibrary(name) {
    cy.get(this.loc.dropdown.searchInput).clear().type(name);
    cy.get(this.loc.dropdown.searchData).click();
  }

  /**
   * Validates that the given categories are visible in the grid.
   * @param {string[]} categories - List of category names.
   * @returns {void}
   */
  expectCategoriesInGrid(categories) {
    categories.forEach((cat) => {
      cy.get(this.loc.grid.container).contains(cat).should("be.visible");
    });
  }

  /**
   * Selects a single category in the grid by checking its row checkbox.
   * @param {string} category - The category name to select.
   * @returns {void}
   */
  selectCategoryInGrid(category) {
    cy.get(this.loc.grid.container)
      .contains(category)
      .closest(this.loc.grid.row)
      .get(this.loc.grid.checkbox)
      .first()
      .click();
  }

  /**
  * Selects checkboxes in the grid by their index positions.
  *
  * @param {Array<number>} indexes - List of indexes (0-based) from fixture.
  * @returns {void}
  */
 selectMultipleCategoryInGrid(indexes) {
  indexes.forEach((i) => {
    cy.get(this.loc.grid.checkbox)
    .eq(i)
    .then(($checkbox) => {
      if (!$checkbox.prop("checked")) {
        cy.get(this.loc.grid.checkbox).eq(i).click({ force: true });
      }
    });
  });
}

  /**
   * Clicks the Import button.
   * @returns {void}
   */
  clickImport() {
    cy.get(this.loc.import.button).click({force: true});
  }

  /**
   * Asserts that the flyout is visible.
   * @returns {void}
   */
  expectFlyoutVisible() {
    cy.get(this.loc.flyout.container).should("be.visible");
  }

  /**
   * Validates a category is visible in the flyout and clicks its checkbox.
   * @param {string} category - The category name to verify and select.
   * @returns {void}
   */
  expectCategoryInFlyout(category) {
    cy.get(this.loc.flyout.grid).contains(category).should("be.visible");
    cy.get(this.loc.flyout.checked).eq(0).click();
  }

  /**
   * Validates that multiple categories are present in the flyout.
   * Expects at least two matches.
   * @param {string[]} categories - List of categories to validate.
   * @returns {void}
   */
  expectMultipleCategoryInFlyout(categories) {
    cy.waitForMyGridLoaderToDisappear(1000000);
    cy.get("#riskLibrariesFlyoutGrid [col-id='ag-Grid-AutoColumn']")
    .should('have.length.greaterThan', 2, { timeout: 10000 });

    cy.get(this.loc.flyout.grid).then(($grid) => {
      const gridText = $grid.text();
      const matchedCategories = categories.filter((cat) =>
        gridText.includes(cat)
      );

      expect(
        matchedCategories.length,
        `Expected at least 2 categories to be visible, but found ${matchedCategories.length}`
      ).to.be.at.least(2);
    });
  }

  /**
   * Clicks the Reset button inside the flyout.
   * @returns {void}
   */
  clickReset() {
    cy.get(this.loc.flyout.resetButton).click();
  }

  /**
   * Clicks the Cancel button in the import flyout and verifies it is closed.
   * @returns {void}
   */
  clickCancel() {
    cy.get(locators.general.cancelFormBtn).eq(0).should("be.visible").click();
    cy.get(this.loc.step.widget3Grid).should("not.be.visible");
  }

  /**
   * Validates that the selection for a category has been cleared in the flyout.
   * @param {string} category - The category name to verify.
   * @returns {void}
   */
  expectSelectionCleared(category) {
    cy.get(this.loc.flyout.grid)
      .contains(category)
      .parents(this.loc.grid.row)
      .get(this.loc.flyout.unChecked)
      .should("not.be.checked");
  }

  /**
   * Clicks the "Next" button in Step 1.
   * @returns {void}
   */
  clickNextStep1() {
    cy.get(this.loc.step.nextBtn1).should("be.visible").click();
  }

  /**
   * Validates that the "Next" button in Step 1 is disabled.
   * @returns {void}
   */
  disableNextBtn() {
    cy.get(this.loc.step.nextBtn1).should("be.disabled");
  }

  /**
   * Validates that Step 2 grid is visible.
   * @returns {void}
   */
  validateStep2Grid() {
    cy.get(this.loc.step.widget2).should("exist").and("be.visible");
    cy.get(this.loc.step.widget2Grid).should("exist").and("be.visible");
  }

  /**
   * Validates that all expected columns exist in the flyout grid.
   * Expected columns are read from test data.
   * @returns {void}
   */
  validateFlyoutColumns() {
    cy.get(this.loc.flyout.containerGrid).within(() => {
      this.data.flyoutColumns.forEach((column) => {
        cy.contains(column).should("be.visible");
      });
    });
  }

  /**
   * Clicks the "Next" button in Step 2.
   * @returns {void}
   */
  clickNextStep2() {
    cy.get(this.loc.step.nextBtn2).should("be.visible").click();
  }

  /**
   * Validates that the summary grid in Step 3 contains the given category.
   * @param {string} categoryName - The expected category name.
   * @returns {void}
   */
  validateSummaryCategory(categoryName) {
    cy.get(this.loc.step.widget3).should("exist").and("be.visible");
    cy.get(this.loc.step.widget3Grid).contains(categoryName).should("exist");
  }

  /**
   * Performs Undo action in Step 3, confirms it, and validates no rows remain.
   * @returns {void}
   */
  performUndoAction() {
    cy.get(this.loc.undo.action).should("exist").eq(0).click();
    cy.get(this.loc.undo.popup).should("be.visible");
    cy.get(this.loc.undo.confirmBtn).click();
    cy.get(this.loc.step.widget3Grid)
      .eq(0)
      .should("contain.text", this.data.undo.noRowsText);
  }

  /**
   * Performs Continue Mapping in Step 3, returns to review, and validates mapping.
   * @returns {void}
   */
  performContinueMapping() {
    cy.get(this.loc.flyout.continueBtn).should("exist").click();
    cy.get(this.loc.flyout.container).should("be.visible");
    cy.get(this.loc.flyout.backToReview).click();
    cy.get(this.loc.step.widget3Grid).should("be.visible");
    cy.get(this.loc.step.widget3Grid)
      .eq(0)
      .should("contain.text", this.data.importCategory);
  }

  /**
   * Applies a filter on the "Name" column of the grid.
   * @param {string} filterText - The text to filter by.
   * @returns {void}
   */
  applyFilterOnNameColumn(filterText) {
    cy.get(this.loc.grid.nameFilter).eq(0).clear().type(filterText);
  }

  /**
   * Applies a filter on the "Business Area Definition" column of the grid.
   * @param {string} filterText - The text to filter by.
   * @returns {void}
   */
  applyFilterOnBaColumn(filterText) {
    cy.get(this.loc.grid.baFilter).eq(0).clear().type(filterText);
  }

  /**
   * Validates that only the filtered category is visible in the grid.
   * @param {string} expectedText - The expected text in the filtered results.
   * @returns {void}
   */
  expectOnlyFilteredCategoryVisible(expectedText) {
    cy.get(this.loc.grid.container)
      .should("have.length.at.least", 1)
      .each(($row) => {
        cy.wrap($row).should("contain.text", expectedText);
      });
    cy.get(this.loc.grid.nameFilter).clear({ force: true });
  }

  /**
   * Validates that only the filtered category is visible in the grid.
   * @param {string} expectedText - The expected text in the filtered results.
   * @returns {void}
   */
  expectNoDataOnInvalidFilter(invalidFilter) {
    cy.get(this.loc.grid.nameFilter).eq(0).clear().type(invalidFilter);
    cy.get(`${this.loc.grid.container} .ag-row`).should("have.length", 0);
    cy.get(this.loc.grid.nameFilter).clear({ force: true });
  }

  /**
   * Validates that the filtered business area is visible in the grid.
   * @param {string} expectedText - The expected business area text.
   * @returns {void}
   */
  expectFilteredBusinessAreaVisible(expectedText) {
    cy.get(this.loc.grid.container)
      .should("have.length.at.least", 1)
      .each(($row) => {
        cy.wrap($row).should("contain.text", expectedText);
      });
    cy.get(this.loc.grid.baFilter).clear({ force: true });
  }

  /**
   * Handles Commit action in Step 3 of Import process.
   *
   * - Clicks Commit button
   * - Validates confirmation dialog visibility
   * - Confirms the Commit action
   * - Waits for the loader to disappear
   *
   * @returns {void}
   */
  clickCommit() {
    cy.get(this.loc.commit.commitBtn).click();
    cy.get(this.loc.commit.commitDialog).should("be.visible");
    cy.get(this.loc.commit.commitYesBtn).click();
    cy.waitForMyGridLoaderToDisappear(20000);
  }

  /**
   * @throws {Error} If job status is PROCESSING (indicates bug / stuck job)
   * @returns {void}
   */
  validateJobQueueAfterCommit() {
    ImportHelper.monitorJobStatus("COMPLETED", 5);
    }

    /**
     ** - Confirms the committed category from test data is present
     ** @returns {void}
     **/
    verifyCommittedCategoryInRiskTaxonomies() {
      cy.get(this.loc.grid.mainGrid).should("be.visible");

      cy.get(this.loc.grid.mainGrid, {timeout : 10000 })
      .should("contain.text", this.data.importCategory);
    }

    /**
    * Expands a given library group in the grid and validates that
    * the expected child categories are displayed.
    *
    * @param {string} groupName - The library group name to expand (e.g., "Compliance Risk").
    * @param {string[]} expectedCategories - List of child categories expected to appear after expansion.
    * @returns {void}
    */
   expandLibraryGroupAndVerify(groupName, expectedCategories) {
    cy.get(this.loc.grid.container)
    .contains(groupName)
    .closest(this.loc.grid.rowGroup)
    .then(($row) => {
      cy.wrap($row)
        .get(this.loc.grid.expandIcon)
        .eq(48) 
        .should("exist")
        .click({ force: true });
    });
    expectedCategories.forEach((category) => {
      cy.get(this.loc.grid.container)
      .contains(category)
      .should("be.visible");
    });
  }

  /**
   * Expands a mapped group in the flyout and validates its child categories.
   *
   * @param {string} parentCategory - The parent group to expand (e.g., "Compliance Risk").
   * @param {string[]} childCategories - Expected child categories under the expanded group.
   * @returns {void}
   */
  expandMappedGroupInFlyout(parentCategory, childCategories) {
    cy.get(this.loc.flyout.grid)
    .contains(parentCategory)
    .closest(this.loc.grid.row)  
    .then(($row) => {
      cy.wrap($row)
        .get(this.loc.flyout.expandIcon)
        .first()
        .dblclick({ force: true });
    });
    // Verify all expected child categories are visible  
    childCategories.forEach((child) => {
      cy.get(this.loc.flyout.grid).contains(child).should("be.visible");
    });
  }

  /**
   * Selects a taxonomy in Step 2 flyout and validates it in Step 3 summary.
   * @param {string} myTaxonomyRisk - The taxonomy risk name expected in summary.
   * @returns {void}
   */
  selectTaxonomyAndValidate(myTaxonomyRisk) {
    cy.get(this.loc.step.widget2Grid, { timeout: 10000 }).should(
      "be.visible",
    );

    cy.get(this.loc.flyout.riskTaxonomyFlyerCheckBox).eq(1).click({
      force: true,
    });

    cy.get(this.loc.step.nextBtn2).should("be.visible").click();

    cy.get(this.loc.step.widget3).should("exist").and("be.visible");
    cy.get(this.loc.step.widget3Grid).contains(myTaxonomyRisk).should("exist");
  }
}