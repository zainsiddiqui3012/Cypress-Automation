import locators from "../../../../fixtures/locators.json";
import data from "../../../../fixtures/RiskAndControlRegister/Administration/ControlOperationCustomerSpace.json";
import dayjs from "dayjs";
import FileHelper from "./helpers/FileHelper";
import DateHelper from "./helpers/DateHelper";
import DataHelper from "./helpers/DataHelper";
import UIHelper from "./helpers/UIHelper";
import ValidationHelper from "./helpers/ValidationHelper";
import TreeHelper from "./helpers/TreeHelper";
import FormHelper from "./helpers/FormHelper";

const writeFilePath =
  "cypress/fixtures/RiskAndControlRegister/Administration/WriteControlOperationCustomerSpace.json";

class ControlOperation {
  /**
   * Clicks on the "Control Operation" button to add a new Control Operation.
   */
  clickOnAddControlBtn() {
    cy.contains(
      locators.risk.administration.controlOperationCustSpace
        .controlOperationBtn,
      data.controlOperationBtn
    ).click({ force: true });
  }

  /**
   * Verifies that the empty record message is visible.
   */
  verifyEmptyRecordMessage() {
    cy.verifyToastMessageText(data.emptyMsg, 20000).should("be.visible");
  }

  /**
   * Enters a new category name, triggers the "Tab" key to save, and updates the JSON file.
   */
  enterCategoryName() {
    // const categoryName =
    //   DateHelper.generateUniqueNameWithTimestamp("CATEGORY ");
    const categoryName = DataHelper.generateRandomString(9);
    this.findFirstRowInGrid();
    this.typeNewCategoryName(categoryName);
    return categoryName;
  }

  /**
   * Finds the first row in the Control Operation Category grid and double-clicks it.
   * This method targets the first name row from the grid, waits for its visibility, and then double-clicks it.
   */

  findFirstRowInGrid() {
    cy.get(
      locators.risk.administration.controlOperationCustSpace.firstNameRow,
      {
        timeout: Cypress.env("waits").mediumWait,
      }
    )
      .eq(1)
      .dblclick();
  }
  /**
   * Types a new category name and simulates "Tab" key press to move focus.
   */
  typeNewCategoryName(categoryName) {
    this.categoryName = categoryName; // Store the passed categoryName in this.categoryName
    cy.get(locators.risk.administration.controlOperationCustSpace.textArea, { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type(this.categoryName, { delay: 100 })
      .focused()
      .tab()
      .tab();
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
   * Verifies the success of the control operation by checking for a success toast message.
   */
  verifySuccessControlOperation() {
    cy.verifyToastMessageText(data.successMsg, 20000).should("be.visible");
  }

  /**
   * This method verifies whether a record exists in the grid.
   * It reads the category name from the JSON file and checks if it exists in the grid.
   * If the record exists, the test passes.
   */
  verifyRecordExists() {
    cy.readFile(writeFilePath).then((file) => {
      const name = file.name;
      cy.get(locators.risk.administration.controlOperationCustSpace.nameFilter)
        .eq(0)
        .clear()
        .type(name, { delay: 100 })
        .should('be.visible')
      cy.contains(
        locators.risk.administration.controlOperationCustSpace.nameColumnGrid,
        name
      ).should("exist");
    });
  }

  /**
   * Enters a new category name with "Inactive" status in the grid.
   */
  enterNamewithInactiveStatus() {
    this.categoryName = DateHelper.generateUniqueNameWithTimestamp("cat ");
    this.findFirstRowInGrid();

    this.typeNewCategoryNameInactive();
    this.selectInactiveStatus();
    return this.categoryName;
  }
  /**
   * Types a new category name with a delay and triggers the "Tab" key to save.
   */
  typeNewCategoryNameInactive() {
    cy.get(locators.risk.administration.controlOperationCustSpace.textArea)
      .type(this.categoryName, { delay: 150 })
      .focused()
      .tab();
  }

  /**
   * Selects the "Inactive" status from the dropdown.
   */
  selectInactiveStatus() {
    cy.get(
      locators.risk.administration.controlOperationCustSpace.statusDropdown
    )
      .contains(data.inactiveStatus)
      .click();
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
   * Double-clicks on a category name in the grid to edit it.
   * This method reads the current category name from a JSON file and finds it in the grid.
   * After locating the category name, it performs a double-click to initiate editing.
   *
   * @param {string} name - The category name to be edited (currently the method uses the value from the file).
   */
  doubleClickCategoryName(name) {
    cy.readFile(writeFilePath).then((file) => {
      const oldName = file.name;
      cy.get(locators.risk.administration.controlOperationCustSpace.nameFilter)
        .eq(0)
        .clear()
        .type(oldName, { delay: 100 })
         .should('be.visible')
      cy.contains(
        locators.risk.administration.controlOperationCustSpace.nameColumnGrid,
        oldName
      ).dblclick();
    });
  }
  /**
   * Clears the category name in the text area and simulates pressing the "Tab" key twice.
   * This method is used to clear the text area without making any changes to the name
   * and then move the focus to the next element(s).
   */
  editCatNameWithoutChanges() {
    cy.get(locators.risk.administration.controlOperationCustSpace.textArea)
      .clear()
      .focused()
      .tab()
      .tab();
  }

  /**
   * Edits an existing category name inline and updates it in the JSON file.
   */
  editCategoryName() {
    const newName = this.generateUniqueCategoryName("@@@!!! ");
    this.doubleClickCategoryName();
    this.typeNewCategoryName(newName);
    this.writeEnteredName(newName);
  }

  /**
   * Helper function to get the category name from the data file and generate a unique name.
   */
  generateUniqueCategoryName(prefix) {
    // If no prefix is provided, default to "category "
    const namePrefix = prefix || "category ";
    return DateHelper.generateUniqueNameWithTimestamp(namePrefix);
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
   * Clicks the "Tab" key on the description area to move focus.
   * This action is used to navigate away from the current field to the next element.
   */
  clickTabDescriptionArea() {
    cy.get(locators.risk.administration.controlOperationCustSpace.textArea)
      .focused()
      .tab();
  }
  /**
   * Verifies the success of the control operation by checking for a success toast message.
   */
  verifySuccessControlOperation() {
    cy.verifyToastMessageText(data.successMsg, 20000).should("be.visible");
  }

  /**
   * Applies a filter to the Control Operation Categories grid by name.
   *
   * @param {string} filterName - The name to filter by (default: data.updatedText).
   */
  applyFilterByName(filterName = data.updatedText) {
    cy.readFile(writeFilePath).then((file) => {
      const updatedName = file.name || filterName;
      cy.get(locators.risk.administration.controlOperationCustSpace.nameFilter)
        .eq(0)
        .clear()
        .type(updatedName, { delay: 100 });

      this.findGridData();
      cy.get(
        locators.risk.administration.controlOperationCustSpace.nameColumnGrid
      ).should("contain.text", updatedName);
    });
  }

  /**
   * Applies a filter using an invalid name in the "Name" filter field.
   * This function simulates typing an invalid category name (from `data.invalidCategory`) into the filter field,
   * clears any existing value, and types the invalid name. After applying the filter, it triggers the grid data search.
   */
  applyFilterByInvalidName() {
    const updatedName = data.invalidCategory;
    cy.get(locators.risk.administration.controlOperationCustSpace.nameFilter)
      .eq(0)
      .clear()
      .type(updatedName, { delay: 100 });
    this.findGridData();
  }

  /**
   * Finds and retrieves the grid data from the Control Operation Category grid.
   * This method waits for the grid data to be loaded, using the configured timeout from the environment.
   * It does not perform any assertion or action on the data, just retrieves it.
   */
  findGridData() {
    cy.get(locators.risk.administration.controlOperationCustSpace.gridData, {
      timeout: Cypress.env("waits").mediumWait,
    });
  }

  /**
   * Verifies that no records were found after applying the filter.
   */
  verifyNoRecordsFound() {
    const updatedName = data.invalidCategory;

    cy.get(
      locators.risk.administration.controlDefCategory.nameColumnGrid
    ).should("not.have.text", updatedName);

    cy.get(
      locators.risk.administration.controlOperationCustSpace.jobQueueModel,
      {
        timeout: 10000,
      }
    ).should("exist");
  }

  /**
   * Verifies the presence of Control Operation Category List.
   */
  verifyControlOperationList() {
    cy.get(
      locators.risk.administration.controlOperationCustSpace.header
    ).should("contain", data.controlOperation);
    this.verifyGridVisibility();
  }
  /**
   * Helper function to verify the visibility of a grid element.
   */
  verifyGridVisibility() {
    cy.get(locators.risk.administration.controlOperationCustSpace.grid).should(
      "be.visible"
    );
    cy.get(
      locators.risk.administration.controlOperationCustSpace.gridData
    ).should("have.length.greaterThan", 0);
  }

/**
 * Returns the row element for the specified control operation.
 * Centralizes the repeated DOM traversal used in multiple functions.
 * @param {string} controlOperationName - The name of the control operation. Defaults to `data.noneSpaceControlOperation`.
 * @returns Cypress chainable for the row element.
 */
getControlOperationRow(controlOperationName = data.noneSpaceControlOperation) {
  return cy
    .get(locators.risk.administration.controlOperationCustSpace.mainDiv)
    .contains(controlOperationName)
    .parents(locators.risk.administration.controlOperationCustSpace.row);
}
/**
 * Searches for a control operation category by name.
 * Clears the first name filter input field and types the provided control operation name
 * with a slight delay between keystrokes to simulate natural typing.
 *
 * @param {string} controloperationName - The name to search for; defaults to data.noneSpaceControloperation.
 */

searchNameForAddedCategory(controlOperationName = data.noneSpaceControlOperation){
  cy.get(locators.risk.administration.controlOperationCustSpace.nameFilter)
        .eq(0)
        .clear()
        .type(controlOperationName, { delay: 100 });
}

/**
 * Verifies that the Control Operation exists in the list.
 * Checks if the control operation is visible in the grid.
 */
verifyControlOperationExists(controlOperationName = data.noneSpaceControlOperation) {
   this.searchNameForAddedCategory()
  cy.get(locators.risk.administration.controlOperationCustSpace.mainDiv)
    .contains(controlOperationName)
    .should("be.visible");
}

/**
 * Verifies that the "Name" field for the specified control operation is non-editable.
 * It ensures that the "Name" column contains the `ag-cell-not-inline-editing` class.
 */
verifyNameFieldIsNonEditable(controlOperationName = data.noneSpaceControlOperation) {
  const nonEditable = "ag-cell-not-inline-editing";
  this.getControlOperationRow(controlOperationName)
    .find(locators.risk.administration.controlOperationCustSpace.nameColumnGrid)
    .eq(0) 
    .should("have.class", nonEditable);
}

/**
 * Verifies that the "Content Library" field for the specified control operation is non-editable.
 * It ensures that the "Content Library" column contains the `ag-cell-not-inline-editing` class.
 */
verifyContentLibraryFieldIsNonEditable(controlOperationName = data.noneSpaceControlOperation) {
   const nonEditable = "ag-cell-not-inline-editing";
    this.getSecondColumnValues(controlOperationName)
    .should("have.class", nonEditable);
}

/**
 * Verifies that the "Content Library" field has a value (i.e., it is not empty).
 */
verifyContentLibraryHasValue(controlOperationName = data.noneSpaceControlOperation) {
  this.getSecondColumnValues(controlOperationName)
    .should("not.have.text", ""); 
}

/**
 * Helper function that returns the Content Library cell for a given control operation.
 * @param {string} controlOperationName - Name of the control operation
 * @returns Cypress chainable for the Content Library cell
 */
getSecondColumnValues(controlOperationName = data.noneSpaceControlOperation) {
  return this.getControlOperationRow(controlOperationName)
    .find(locators.risk.administration.controlOperationCustSpace.nameColumnGrid)
    .eq(1); 
}
/**
 * Verifies that the content library field is not empty for the specified control operation.
 * Essentially similar to `verifyContentLibraryHasValue`, kept for semantic clarity if needed.
 */
verifyContentLibraryIsNotEmpty(controlOperationName = data.noneSpaceControlOperation) {
  this.verifyContentLibraryHasValue(controlOperationName);
}






}
export default ControlOperation;