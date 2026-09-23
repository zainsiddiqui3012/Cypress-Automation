import locators from "../../../../fixtures/locators.json";
import data from "../../../../fixtures/RiskAndControlRegister/Administration/ControlDefinitionCategoryCustomerSpace.json";
import dayjs from "dayjs";
import FileHelper from "./helpers/FileHelper";
import DateHelper from "./helpers/DateHelper";
import UIHelper from "./helpers/UIHelper";
import ValidationHelper from "./helpers/ValidationHelper";
import TreeHelper from "./helpers/TreeHelper";
import FormHelper from "./helpers/FormHelper";

const writeFilePath =
  "cypress/fixtures/RiskAndControlRegister/Administration/writeControlDefinitionCategoryCustomerSpace.json";

class ControlDefinitionCategory {
  /**
   * Helper function to get the category name from the data file and generate a unique name.
   */
  generateUniqueCategoryName(prefix) {
    // If no prefix is provided, default to "category "
    const namePrefix = prefix || "category ";
    return DateHelper.generateUniqueNameWithTimestamp(namePrefix);
  }

  /**
   * Helper function to verify the visibility of a grid element.
   */
  verifyGridVisibility() {
    cy.get(locators.risk.administration.controlDefCategory.grid).should(
      "be.visible"
    );
    cy.get(locators.risk.administration.controlDefCategory.gridData).should(
      "have.length.greaterThan",
      0
    );
  }

  /**
   * Verifies the presence of Control Definition Category List.
   */
  verifyControlDefCategoryList() {
    cy.get(locators.risk.administration.controlDefCategory.header).should(
      "contain",
      data.controlDefCategory
    );
    this.verifyGridVisibility();
  }

  /**
   * Verifies that no data is present in the grid and checks for "No Rows To Show" message.
   */
  verifyNoDataOnGrid() {
    cy.get(locators.general.gridStatusCell).should("have.length", 1);
  }
  /**
   * This method checks the existence of data in the grid.
   * It uses the provided `activeLocator` to locate the grid and counts the number of rows.
   * If the number of rows is greater than 0, it logs a message indicating that data exists.
   *
   * @param {string} activeLocator - The locator used to locate the grid element.
   */
  dataexistance(activeLocator) {
    cy.get(activeLocator)
      .get(locators.risk.administration.controlDefCategory.row)
      .its(data.length)
      .then((rowCount) => {
        if (rowCount > 0) {
          cy.log(data.dataExistMsg);
        }
      });
  }

  /**
   * Applies a filter to the Control Definition Categories grid by name.
   *
   * @param {string} filterName - The name to filter by (default: data.updatedText).
   */
  applyFilterByName(filterName = data.updatedText) {
    cy.readFile(writeFilePath).then((file) => {
      const updatedName = file.name || filterName;
      cy.get(locators.risk.administration.controlDefCategory.nameFilter)
        .eq(0)
        .clear()
        .type(updatedName, { delay: 100 });

      this.findGridData();
      cy.get(
        locators.risk.administration.controlDefCategory.nameColumnGrid
      ).should("contain.text", updatedName);
    });
  }

  /**
   * Finds and retrieves the grid data from the Control Definition Category grid.
   * This method waits for the grid data to be loaded, using the configured timeout from the environment.
   * It does not perform any assertion or action on the data, just retrieves it.
   */
  findGridData() {
    cy.get(locators.risk.administration.controlDefCategory.gridData, {
      timeout: Cypress.env("waits").mediumWait,
    });
  }

  /**
   * Applies an invalid filter to the Control Definition Categories grid by name.
   */
  applyFilterByInvalidName() {
    const invalidName = this.generateUniqueCategoryName("Invalid Cat ");
    this.applyFilterByName(invalidName);
  }

  /**
   * Verifies that no records were found after applying the filter.
   */
  verifyNoRecordsFound() {
    cy.get(locators.risk.administration.controlDefCategory.jobQueueModel, {
      timeout: 10000,
    }).should("exist");
  }

  /**
   * Writes the generated category name to the JSON file.
   */
  writeEnteredName(categoryName = this.categoryName) {
    cy.readFile(writeFilePath).then((file) => {
      file.name = categoryName;
      cy.writeFile(writeFilePath, file);
    });
  }
  /**
   * Finds the first row in the Control Definition Category grid and double-clicks it.
   * This method targets the first name row from the grid, waits for its visibility, and then double-clicks it.
   */

  findFirstRowInGrid() {
    cy.get(locators.risk.administration.controlDefCategory.firstNameRow, {
      timeout: Cypress.env("waits").mediumWait,
    })
      .eq(1)
      .dblclick();
  }

  /**
   * Enters a new category name, triggers the "Tab" key to save, and updates the JSON file.
   */
  enterCategoryName() {
    const categoryName =
      DateHelper.generateUniqueNameWithTimestamp("category ");
    this.findFirstRowInGrid();
    this.typeNewCategoryName(categoryName);
  }

  /**
   * Types a new category name and simulates "Tab" key press to move focus.
   */
  typeNewCategoryName(categoryName) {
    this.categoryName = categoryName; // Store the passed categoryName in this.categoryName
    cy.get(locators.risk.administration.controlDefCategory.textArea)
      .clear()
      .type(this.categoryName, { delay: 100 })
      .focused()
      .tab()
      .tab();
  }

  /**
   * Verifies the success of the control Definition by checking for a success toast message.
   */
  verifySuccessControlDefinition() {
    cy.verifyToastMessageText(data.successMsg, 20000).should("be.visible");
  }
  /**
   * Verifies the empty control Definition by checking for a empty toast message.
   */
  verifyEmptyRecordMessage() {
    cy.verifyToastMessageText(data.emptyMsg, 20000).should("be.visible");
  }

  /**
   * Enters a new category name with "Inactive" status in the grid.
   */
  enterNamewithInactiveStatus() {
    this.categoryName = DateHelper.generateUniqueNameWithTimestamp("cat ");
    this.findFirstRowInGrid();

    this.typeNewCategoryNameInactive();
    this.selectInactiveStatus();
  }

  /**
   * Types a new category name with a delay and triggers the "Tab" key to save.
   */
  typeNewCategoryNameInactive() {
    cy.get(locators.risk.administration.controlDefCategory.textArea)
      .type(this.categoryName, { delay: 150 })
      .focused()
      .tab();
  }

  /**
   * Selects the "Inactive" status from the dropdown.
   */
  selectInactiveStatus() {
    cy.get(locators.risk.administration.controlDefCategory.statusDropdown)
      .contains(data.inactiveStatus)
      .click();
  }

  /**
   * Verifies that the control definition (name and status) was saved successfully.
   *
   * @param {Object} data - The data object containing category name and status.
   */
  verifyControlDefinitionSaved(data) {
    cy.get(
      locators.risk.administration.controlDefCategory.nameColumnGrid
    ).contains(data.name);
    cy.get(
      locators.risk.administration.controlDefCategory.nameColumnGrid
    ).contains(data.status);
  }
  /**
   * This method performs an edit without changing the category name.
   * It reads the current category name from the JSON file, then searches for the category name
   * in the grid, double-clicks it to enter edit mode, clears the text field, and tabs twice to focus away.
   * After that, the page is reloaded to reflect any changes.
   */
  editWithoutChange() {
    this.doubleClickCategoryName();
    this.editCatNameWithoutChanges();
    cy.reload();
  }

  /**
   * Clears the category name in the text area and simulates pressing the "Tab" key twice.
   * This method is used to clear the text area without making any changes to the name
   * and then move the focus to the next element(s).
   */
  editCatNameWithoutChanges() {
    cy.get(locators.risk.administration.controlDefCategory.textArea, {timeout: 10000})
      .clear()
      .focused()
      .tab()
      .tab();
  }
  /**
   * This method verifies whether a record exists in the grid.
   * It reads the category name from the JSON file and checks if it exists in the grid.
   * If the record exists, the test passes.
   */
  verifyRecordExists() {
    cy.readFile(writeFilePath).then((file) => {
      const name = file.name;
       cy.get(locators.risk.administration.controlDefCategory.nameFilter)
              .eq(0)
              .clear()
              .type(name, { delay: 100 })
              .should('be.visible')
      cy.contains(
        locators.risk.administration.controlDefCategory.nameColumnGrid,
        name
      ).should("exist");
    });
  }
  /**
   * Edits an existing category name inline and updates it in the JSON file.
   */
  editCategoryName() {
    const newName = this.generateUniqueCategoryName("Update ");
    this.doubleClickCategoryName();
    this.typeNewCategoryName(newName);
    this.writeEnteredName(newName);
  }

  /**
   * Double-clicks on the category name in the grid to enter edit mode.
   * This method retrieves the current category name from a JSON file and locates it in the grid.
   * Once found, it performs a double-click action on the category name to allow editing.
   */
  doubleClickEditCatName() {
    cy.readFile(writeFilePath).then((file) => {
      const oldName = file.name;
      cy.contains(
        locators.risk.administration.controlDefCategory.nameColumnGrid,
        oldName
      ).dblclick();
    });
  }

  /**
   * Edits the category status to "Inactive" by selecting it from the dropdown.
   */
  editCategoryStatusToInactive() {
    this.doubleClickCategoryName();
    this.clickTabDescriptionArea();
    this.selectInactiveStatus();
  }
  /**
   * Selects the "Inactive" status from the dropdown in the Control Definition Category section.
   * This action clicks on the dropdown and selects the item matching the "Inactive" status.
   */
  selectInactiveStatus() {
    cy.get(locators.risk.administration.controlDefCategory.statusDropdown)
      .contains(data.inactiveStatus)
      .click();
  }

  /**
   * Double-clicks on a category name in the grid to edit it.
   * This method reads the current category name from a JSON file and finds it in the grid.
   * After locating the category name, it performs a double-click to initiate editing.
   *
   * @param {string} name - The category name to be edited (currently the method uses the value from the file).
   */
  doubleClickCategoryName(name) {
    cy.readFile(writeFilePath).then((file) => {
      const oldName = file.name;
      cy.get(locators.risk.administration.controlDefCategory.nameFilter)
              .eq(0)
              .clear()
              .type(oldName, { delay: 100 })
               .should('be.visible')
      cy.contains(
        locators.risk.administration.controlDefCategory.nameColumnGrid,
        oldName
      ).dblclick();
    });
  }

/**
 * Searches for a control definition category by name.
 * Clears the first name filter input field and types the provided control definition name
 * with a slight delay between keystrokes to simulate natural typing.
 *
 * @param {string} controlDefinitionName - The name to search for; defaults to data.noneSpaceControlDefinition.
 */
  searchNameForAddedCategory(controlDefinitionName = data.noneSpaceControlDefinition){
    cy.get(locators.risk.administration.controlDefCategory.nameFilter)
          .eq(0)
          .clear()
          .type(controlDefinitionName, { delay: 100 });
  }
  /**
   * Clicks the "Tab" key on the description area to move focus.
   * This action is used to navigate away from the current field to the next element.
   */
  clickTabDescriptionArea() {
    cy.get(locators.risk.administration.controlDefCategory.textArea)
      .focused()
      .tab();
  }

  /**
   * Clicks on the "Add Control" button to add a new control definition category.
   */
  clickOnAddControlBtn() {
    cy.contains(
      locators.risk.administration.controlDefCategory.controlDefCategoryBtn,
      data.controlDefBtn
    ).click();
  }

/**
 * Returns the row element for the specified control definition.
 * Centralizes the repeated DOM traversal used in multiple functions.
 * @param {string} controlDefinitionName - The name of the control definition. Defaults to `data.noneSpaceControlDefinition`.
 * @returns Cypress chainable for the row element.
 */
getControlDefinitionRow(controlDefinitionName = data.noneSpaceControlDefinition) {
  return cy
    .get(locators.risk.administration.controlDefCategory.mainDiv)
    .contains(controlDefinitionName)
    .parents(locators.risk.administration.controlDefCategory.row);
}

/**
 * Verifies that the Control definition exists in the list.
 * Checks if the control definition is visible in the grid.
 */
verifyControlDefinitionExists(controlDefinitionName = data.noneSpaceControlDefinition) {
  this.searchNameForAddedCategory()
  cy.get(locators.risk.administration.controlDefCategory.mainDiv)
    .contains(controlDefinitionName)
    .should("be.visible");
}


/**
 * Verifies that the "Name" field for the specified control definition is non-editable.
 * It ensures that the "Name" column contains the `ag-cell-not-inline-editing` class.
 */
verifyNameFieldIsNonEditable(controlDefinitionName = data.noneSpaceControlDefinition) {
  const nonEditable = "ag-cell-not-inline-editing";
  this.getControlDefinitionRow(controlDefinitionName)
    .find(locators.risk.administration.controlDefCategory.nameColumnGrid)
    .eq(0) // First column (Name)
    .should("have.class", nonEditable);
}

/**
 * Verifies that the "Content Library" field for the specified control definition is non-editable.
 * It ensures that the "Content Library" column contains the `ag-cell-not-inline-editing` class.
 */
verifyContentLibraryFieldIsNonEditable(controlDefinitionName = data.noneSpaceControlDefinition) {
   const nonEditable = "ag-cell-not-inline-editing";
    this.getFirstColumnValues(controlDefinitionName)
    .should("have.class", nonEditable);
}

/**
 * Verifies that the "Content Library" field has a value (i.e., it is not empty).
 */
verifyContentLibraryHasValue(controlDefinitionName = data.noneSpaceControlDefinition) {
  this.getFirstColumnValues(controlDefinitionName)
    .should("not.have.text", ""); // Ensure Content Library is not empty
}

/**
 * Helper function that returns the Content Library cell for a given control definition.
 * @param {string} controlDefinitionName - Name of the control definition
 * @returns Cypress chainable for the Content Library cell
 */
getFirstColumnValues(controlDefinitionName = data.noneSpaceControlDefinition) {
  return this.getControlDefinitionRow(controlDefinitionName)
    .find(locators.risk.administration.controlDefCategory.nameColumnGrid)
    .eq(1); // Second column (Content Library)
}
/**
 * Verifies that the content library field is not empty for the specified control definition.
 * Essentially similar to `verifyContentLibraryHasValue`, kept for semantic clarity if needed.
 */
verifyContentLibraryIsNotEmpty(controlDefinitionName = data.noneSpaceControlDefinition) {
  this.verifyContentLibraryHasValue(controlDefinitionName);
}




}

export default ControlDefinitionCategory;
