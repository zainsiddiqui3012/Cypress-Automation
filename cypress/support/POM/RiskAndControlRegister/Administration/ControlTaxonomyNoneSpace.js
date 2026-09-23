import FileHelper from "../Administration/helpers/FileHelper";
import DateHelper from "../Administration/helpers/DateHelper";
import UIHelper from "./helpers/UIHelper";
import ValidationHelper from "../Administration/helpers/ValidationHelper";
import TreeHelper from "../Administration/helpers/TreeHelper";
import FormHelper from "../Administration/helpers/FormHelper";
import ImportHelper from "../Administration/helpers/ImportHelper";

const sampleFileName = "ImportTemplate_ControlTaxonomy_NoneReseller.xlsx";
const qbImport = "cypress/fixtures/Examples/controlTaxonomyImport.json";
import locators from "../../../../fixtures/locators.json";

const customerDataString = "cypress/fixtures/Administration/Customers.json";
const data =
  "cypress/fixtures/RiskAndControlRegister/Administration/ControlTaxonomyNoneSpace.json";
const waits = Cypress.env("waits");
const last = "last";

const descriptionText = [
  "Test description without name",
  "Test Description with MaxLength",
  "Test Cancel Category",
  "Test description",
  "Duplicate category test",
  "Special characters test",
  "Numeric name test",
  "Updated description",
  "Test description without required fields",
  "Test description without name",
  "Test description without category",
  "Test without library ID",
  "Rich Text Definition",
];

const submitForm = ["Category", "Definition"];

class ControlTaxonomy {
  /**
   * Write control taxonomy name to file
   * @param {boolean} updated - Whether the name is being updated
   * @param {string} updatedName - The new name to write
   * @returns {Promise} Promise that resolves when file is updated
   */
  writeControlTaxonomyName(updated = false, updatedName) {
    return FileHelper.updateControlTaxonomyName(
      customerDataString,
      data,
      updated,
      updatedName
    );
  }

  /**
   * Verify control taxonomy grid is loaded with proper columns
   */
  verifyControlTaxonomyGridLoaded() {
    cy.get(locators.risk.controlTaxonomies.gridContainer).should("be.visible");
    cy.get(locators.risk.controlTaxonomies.gridHeaders)
      .should("contain", "Name")
      .and("contain", "Content Library")
      .and("contain", "Description")
      .and("contain", "Status")
      .and("contain", "Actions");
  }

  /**
   * Add control taxonomy without providing a name to test validation
   * @param {string} mandatoryFieldError - Expected error message for missing field
   */
  addControlTaxonomyWithoutName(mandatoryFieldError) {
    cy.get(locators.general.addBtn).dblclick();
    cy.verifyToastMessageText(mandatoryFieldError, waits.mediumWait);
  }

  /**
   * Add control taxonomy with valid data
   * @param {string} successMsg - Expected success message
   */
  addControlTaxonomyWithValidData(successMsg = "saved successfully") {
    const uniqueName =
      DateHelper.generateUniqueNameWithTimestamp("Control Tax ");

    cy.get(locators.general.addBtn).click();

    FormHelper.fillControlTaxonomyForm({
      name: uniqueName,
      contentLibrary: "test Library jsyco",
      description: "Test control taxonomy description",
      status: "Active",
    });

    ValidationHelper.verifySuccessMessage(successMsg);

    return uniqueName;
  }

  /**
   * Add control taxonomy without content library
   */
  addControlTaxonomyWithoutContentLibrary(expectedError) {
    const uniqueName =
      DateHelper.generateUniqueNameWithTimestamp("Control Tax ");

    cy.get(locators.general.addBtn).click();

    FormHelper.fillControlTaxonomyForm({
      name: uniqueName,
      description: "Test control taxonomy description",
      // Intentionally skip content library
    });

    UIHelper.clickSaveButton(locators.general.saveBtn);
    ValidationHelper.verifyValidationError(expectedError);
  }

  /**
   * Add duplicate control taxonomy
   * @param {string} existingName - Name of the existing taxonomy to duplicate
   * @param {string} duplicateError - Expected error message for duplicate
   */
  addDuplicateControlTaxonomy(existingName, duplicateError) {
    cy.get(locators.general.addBtn).click();

    FormHelper.fillControlTaxonomyForm({
      name: existingName,
      contentLibrary: "test Library jsyco",
      description: "Duplicate taxonomy test",
    });

    // UIHelper.clickSaveButton(locators.control.administration.controlTaxonomy.saveBtn);
    ValidationHelper.verifyDuplicateError(duplicateError);
  }

  /**
   * Search for a control taxonomy in the grid
   * @param {string} updatedName - Optional updated name to search for
   * @returns {Promise} Promise that resolves with search results
   */
  searchControlTaxonomy(updatedName) {
    return FileHelper.readJsonFile(data).then((readData) => {
      const controlTaxonomyName = updatedName
        ? updatedName
        : readData.controlTaxonomy.controlTaxonomyName;
      UIHelper.searchInGrid(
        locators.risk.controlTaxonomies.searchGrid,
        controlTaxonomyName,
        0
      );
      UIHelper.verifyGridRowCount(locators.general.gridName, 1, 0);
    });
  }

  /**
   * Change the status of a control taxonomy
   * @param {string} status - New status to set
   */
  changedStatus(status) {
    cy.get(locators.general.gridStatusCell)
      .should("have.length", 2)
      .eq(1)
      .as("status");
    cy.get("@status")
      .dblclick({ delay: 1000 })
      .then(() => {
        cy.get(".ag-virtual-list-item")
          .should("be.visible")
          .contains(status)
          .click();
      });
  }

  /**
   * Verify the status of a control taxonomy
   * @param {string} status - Expected status to verify
   */
  verifyStatus(status) {
    UIHelper.verifyTextContent(locators.general.gridStatusCell, status, 1);
  }

  /**
   * Double click on a searched control taxonomy to open it
   */
  clickSearchedControlTaxonomy() {
    cy.get(locators.general.gridName)
    .should("have.length",1)
    .dblclick();
  }

  /**
   * Type a control taxonomy name in the input field
   * @param {string} name - Name to type
   */
  typeControlTaxonomyName(name) {
    UIHelper.typeInTextareaAndTab(locators.general.textAreaGridCell, name);
  }

  /**
   * Type description text in the description field
   * @param {string} descriptionText - Description text to enter
   */
  typeDescription(descriptionText) {
    cy.wait(2000);
    cy.get(locators.general.gridDescription)
      .eq(1)
      .should("be.visible")
      .and("have.length", 1)
      .dblclick();
    cy.get(locators.general.textAreaGridCell, {
      timeout: waits.longWait,
    })
      .should("be.enabled")
      .clear()
      .type(descriptionText);
  }

  /**
   * Click on a filter icon
   * @param {number} iconIndex - Index of the filter icon to click
   */
  clickFilterIcon(iconIndex) {
    UIHelper.clickFilterIcon(locators.general.gridFilter, iconIndex);
  }

  /**
   * Type a name in the filter input field
   * @param {string} name - Name to filter by
   * @param {number} filterIndex - Index of the filter input (default: 0)
   */
  typeFilterName(name, filterIndex = 0) {
    UIHelper.searchInGrid(
      locators.general.gridFilterNameInput,
      name,
      filterIndex
    );
  }

  /**
   * Type content library filter
   * @param {string} libraryName - Library name to filter by
   */
  typeContentLibraryFilter(libraryName) {
    UIHelper.searchInGrid(
      locators.general.gridContentLibraryInput,
      libraryName,
      0
    );
  }

  /**
   * Type a status name in the status filter field
   * @param {string} status - Status to filter by
   */
  typeStatusName(status) {
    UIHelper.searchInGrid(locators.general.gridFilterNameInput, status, 0);
  }

  /**
   * Verify the length of search results
   * @param {number} indexCount - Expected number of results (default: 1)
   */
  verifySearchControlTaxonomyLength(indexCount = 1) {
    UIHelper.verifyGridRowCount(locators.general.gridName, 1, indexCount);
  }

  /**
   * Click on the view action button
   */
  clickViewAction() {
    cy.get(locators.risk.administration.riskTaxonomies.viewAction, {
      timeout: waits.longWait,
    })
      .should("be.visible")
      .should("have.length", 1)
      .click();
  }

  /**
   * Verify that the view action screen is opened
   */
  verifyViewActionScreenOpen() {
    cy.get(locators.risk.controlTaxonomies.verifyViewActionScreen, {
      timeout: waits.longWait,
    }).should("be.visible");
  }
}

class ControlCategory {
  /**
   * Click the Add Control Category button
   * @param {string} btnTextName - Text of the button to click
   */
  clickAddControlCategory(btnTextName) {
    cy.contains(btnTextName).click();
  }

  /**
   * Add control category with valid data
   */
  addControlCategory(sectionName, baseName) {
    const createdName = DateHelper.generateUniqueNameWithTimestamp(baseName);
    FormHelper.fillControlCategoryForm({
      controlCategoryId: createdName,
      name: createdName,
    });
    ControlCategory.clickSaveButton();
    FileHelper.updateSectionData(
      data,
      sectionName,
      createdName,
      "controlCategory"
    );
  }

  /**
   * Add Control Category with missing required field
   */
  addControlCategoryWithMissingName(missingNameError) {
    FormHelper.fillControlCategoryForm({
      description: descriptionText[0],
    });
    ControlCategory.clickSaveButton();
    ValidationHelper.verifyValidationError(missingNameError);
  }

  /**
   * Add Control Category with maximum name length
   * @param {number} length - Character length to test
   */
  addControlCategoryWithMaxLength(length = 255) {
    const longName = "A".repeat(length);
    FormHelper.fillControlCategoryForm({
      controlCategoryId: DateHelper.generateUniqueNameWithTimestamp("Cat"),
      name: longName,
      description: descriptionText[1],
    });
    ControlCategory.clickSaveButton();
    return longName;
  }

  /**
   * Add Control Category exceeding name limit
   */
  addControlCategoryExceedingNameLimit() {
    const tooLongName = "A".repeat(256);
    FormHelper.fillControlCategoryForm({
      controlCategoryId: DateHelper.generateUniqueNameWithTimestamp("Cat"),
      name: tooLongName,
    });
  }

  /**
   * Add Control Category with special characters
   * @param {string} specialChars - Special characters to test
   */
  addControlCategoryWithSpecialChars(specialChars = "@#$%^&*()") {
    const nameWithSpecialChars = `Test${specialChars}Category`;
    FormHelper.fillControlCategoryForm({
      controlCategoryId: nameWithSpecialChars,
      name: nameWithSpecialChars,
    });
    ControlCategory.clickSaveButton();
    return nameWithSpecialChars;
  }

  /**
   * Add duplicate Control Category
   * @param {string} existingName - Name of existing category
   */
  addDuplicateControlCategory(existingName) {
    FormHelper.fillControlCategoryForm({
      controlCategoryId: existingName,
      name: existingName,
    });
    ControlCategory.clickSaveButton();
    cy.waitForElementToVisible(
      locators.administration.toastMsg,
      waits.mediumWait
    );
  }

  /**
   * Cancel Add Control Category form
   */
  cancelAddControlCategory() {
    FormHelper.fillControlCategoryForm({
      controlCategoryId: descriptionText[2],
      name: descriptionText[2],
    });
    FormHelper.cancelForm();
  }

  /**
   * Verify that the form is closed
   */
  verifyFormClosed() {
    cy.get(locators.risk.administration.riskCategory.formClosed).should(
      "not.exist"
    );
  }

  /**
   * Edit existing Control Category
   * @param {string} sectionName - Section name for data storage
   * @param {string} baseName - Base name for generating unique name
   * @param {string} categoryName - Name of category to edit
   */
  editControlCategory(sectionName, baseName, categoryName) {
    TreeHelper.verifyNodeExists(categoryName);
    cy.contains(
      locators.risk.administration.riskCategory.clickExistingTaxonomyName,
      categoryName
    ).dblclick();

    const updatedName = DateHelper.generateUniqueNameWithTimestamp(baseName);
    FormHelper.fillControlCategoryForm({
      name: updatedName,
    });
    ControlCategory.clickSaveButton();
    FileHelper.updateSectionData(
      data,
      sectionName,
      updatedName,
      "controlCategory"
    );
    this.verifyAddedControlCategory(updatedName);
  }

  /**
   * Verify added control category
   */
  verifyAddedControlCategory(categoryName) {
    cy.wait(3000);
    cy.contains(locators.risk.administration.treeOperations.treeText, categoryName).should("be.visible");
  }

  /**
   * Write control category name for use in control definition
   * @param {string} categoryName - Name of the category to write
   */
  writeControlCategoryNameInControlDefinition(categoryName) {
    FileHelper.updateNestedProperty(
      data,
      "controlDefinition",
      "add",
      "controlCategory",
      categoryName
    );
  }

  /**
   * Click Save button on the control category form
   */
  static clickSaveButton(){
    cy.get(locators.risk.controlCategory.saveButton)
    .click();
  }
}

class ControlDefinition {
  /**
   * Click Add Control Definition button
   * @param {string} btnText - Button text to click
   */
  clickAddControlDefinition(btnText) {
    cy.contains(btnText).click();
  }

  /**
   * Add Control Definition with valid data
   * @param {string} sectionName - Section name in test data
   */
  addControlDefinitionValidData(sectionName) {
    return FileHelper.getSectionData(
      data,
      sectionName,
      "controlDefinition"
    ).then((sectionData) => {
      const uniqueName = DateHelper.generateUniqueNameWithTimestamp(
        sectionData.baseName
      );

      FormHelper.fillControlDefinitionForm({
        controlDefinitionId: uniqueName,
        name: uniqueName,
        description: sectionData.description,
        controlType: sectionData.controlType,
      });

      // Select control category
      if (sectionData.controlCategory) {
        FormHelper.selectControlCategory(sectionData.controlCategory);
      }

      // FormHelper.submitForm(submitForm[1]);
      ControlDefinition.clickSaveButton();
      FileHelper.updateSectionData(
        data,
        sectionName,
        uniqueName,
        "controlDefinition"
      );
      this.verifyAddedControlDefinition(
        sectionData.controlCategory,
        uniqueName
      );
      return cy.wrap(uniqueName);
    });
  }

  /**
   * Add Control Definition with missing required fields
   * @param {string} missingError - Expected error message
   */
  addControlDefinitionMissingFields(missingError) {
    FormHelper.fillControlDefinitionForm({
      description: descriptionText[8],
    });
    ControlDefinition.clickSaveButton();
    ValidationHelper.verifyValidationError(missingError);
  }

  /**
   * Add Control Definition with missing name
   * @param {string} missingNameError - Expected error message
   * @param {string} categoryName - Name of the parent category
   */
  addControlDefinitionMissingName(missingNameError, categoryName) {
    const controlId = DateHelper.generateUniqueNameWithTimestamp("DefId");
    FormHelper.fillControlDefinitionForm({
      controlDefinitionId: controlId,
      description: descriptionText[9],
    });
    FormHelper.selectControlCategory(categoryName);
    ControlDefinition.clickSaveButton();
    ValidationHelper.verifyValidationError(missingNameError);
  }

  /**
   * Add Control Definition with missing control category
   * @param {string} missingParentError - Expected error message
   * @param {object} controlDefinitionData - Data for the control definition
   */
  addControlDefinitionMissingCategory(
    missingParentError,
    controlDefinitionData
  ) {
    FormHelper.fillControlDefinitionForm({
      controlDefinitionId: controlDefinitionData.controlDefinitionId,
      name: controlDefinitionData.name,
      description: descriptionText[10],
      controlType: controlDefinitionData.controlType,
    });
    ControlDefinition.clickSaveButton();
    ValidationHelper.verifyValidationError(missingParentError);
  }

  /**
   * Add Control Definition with special characters
   * @param {string} specialCharacters - Special characters to include in name
   * @param {string} controlCategory - Parent control category
   * @param {string} controlType - Type of control (default: 'Preventative')
   * @returns {string} The special characters used in the name
   */
  addControlDefinitionWithSpecialChars(
    specialCharacters,
    controlCategory,
    controlType = "Preventative"
  ) {
    const specialName = specialCharacters;
    FormHelper.fillControlDefinitionForm({
      controlDefinitionId: specialName,
      name: specialName,
      description: descriptionText[5],
      controlType: controlType,
    });
    FormHelper.selectControlCategory(controlCategory);
    ControlDefinition.clickSaveButton();
    return specialCharacters;
  }

  /**
   * Add Control Definition with max length name
   * @param {number} maxLengthCharacters - Maximum length to test
   */
  addControlDefinitionMaxLengthName(maxLengthCharacters = 1200) {
    const longName = "A".repeat(1201);
    FormHelper.fillControlDefinitionForm({
      controlDefinitionId: "TestDef",
      name: longName,
    });
    ValidationHelper.verifyMaxLengthValidation(
      locators.risk.controlDefinition.definitionNameInput,
      longName,
      maxLengthCharacters
    );
  }

  /**
   * Add Control Definition with max length description
   * @param {number} maxLength - Maximum length to test
   */
  addControlDefinitionMaxLengthDescription(maxLength = 5000) {
    const longDescription = "A".repeat(maxLength + 1);
    FormHelper.fillControlDefinitionForm({
      controlDefinitionId: "TestDef",
      name: "Test Definition",
      description: longDescription,
    });
    ValidationHelper.verifyMaxLengthValidation(
      locators.risk.controlDefinition.categoryDescriptionInput,
      longDescription,
      maxLength
    );
  }

  /**
   * Add duplicate Control Definition ID
   * @param {string} existingId - Existing Control Definition ID to duplicate
   * @param {string} categoryName - Parent control category
   * @param {string} controlType - Type of control (default: 'Preventative')
   */
  addDuplicateControlDefinitionId(
    existingId,
    categoryName,
    controlType = "Preventative"
  ) {
    FormHelper.fillControlDefinitionForm({
      controlDefinitionId: existingId,
      name: existingId,
      description: descriptionText[4],
      controlType: controlType,
    });
    FormHelper.selectControlCategory(categoryName);
    ControlDefinition.clickSaveButton();
    ValidationHelper.verifyDuplicateError(submitForm[1]);
  }

  /**
   * Cancel Control Definition Add
   */
  cancelControlDefinitionAdd() {
    FormHelper.fillControlDefinitionForm({
      controlDefinitionId: descriptionText[2],
      name: descriptionText[2],
      description: descriptionText[2],
    });
    FormHelper.cancelForm(3);
  }

  /**
   * Edit Control Definition - Change Description
   * @param {string} definitionName - Name of definition to edit
   * @param {string} newDescription - New description
   */
  editControlDefinitionDescription(definitionName, newDescription) {
    TreeHelper.verifyNodeExists(definitionName);
    cy.contains(
      locators.risk.administration.riskCategory.clickExistingTaxonomyName,
      definitionName
    ).dblclick({ force: true });

    FormHelper.fillControlDefinitionForm({
      description: newDescription,
    });
    ControlDefinition.clickSaveButtonEditPage();
  }

  /**
   * Toggle primary control option
   * @param {string} definitionName - Name of definition to edit
   */
  togglePrimaryControlOption(definitionName) {
    TreeHelper.verifyNodeExists(definitionName);
    cy.contains(
      locators.risk.administration.riskCategory.clickExistingTaxonomyName,
      definitionName
    ).dblclick({ force: true });

    cy.get(locators.risk.controlDefinition.primaryControlToggleActive)
      .click({ force: true })
      .should("be.checked");
    UIHelper.clickSaveButton(locators.general.saveBtn);
  }

  /**
   * Change control type
   * @param {string} definitionName - Name of definition to edit
   * @param {string} newControlType - New control type to select
   */
  changeControlType(definitionName, newControlType) {
    TreeHelper.verifyNodeExists(definitionName);
    cy.contains(
      locators.risk.administration.riskCategory.clickExistingTaxonomyName,
      definitionName
    ).dblclick({ force: true });

    FormHelper.fillControlDefinitionForm({
      controlType: newControlType,
    });
    ControlDefinition.clickSaveButtonEditPage();
    cy.get(locators.risk.controlDefinition.controlTypeDropdown).should(
      "contain.text",
      newControlType
    );
  }

  /**
   * Verify added Control Definition
   * @param {string} categoryName - Name of the parent category
   * @param {string} definitionName - Name of the definition to verify
   */
  verifyAddedControlDefinition(categoryName, definitionName) {
    cy.wait(3500);
    TreeHelper.expandControlCategory(categoryName);
    TreeHelper.verifyNodeExists(definitionName);
  }

  /**
   * Click Save button on the control definition form
   */
  static clickSaveButton(){
    cy.get(locators.risk.controlDefinition.saveButton)
    .scrollIntoView()
    .should("be.visible")
    .click();
  }
  /**
   * Click Save button on the control definition form
   */
  static clickSaveButtonEditPage(){
    cy.get(locators.risk.controlDefinition.editPageSaveButton)
    .scrollIntoView()
    .should("be.visible")
    .click();
  }
  
}

class TreeOperations {
  /**
   * Verify tree loaded`
   */
  verifyTreeLoaded() {
    cy.get(
      locators.risk.administration.treeOperations.containsRiskCategory
    ).should("be.visible");
  }

  /**
   * Expand single category node
   * @param {string} categoryName - Name of category to expand
   */
  expandCategoryNode(categoryName) {
    TreeHelper.expandNode(categoryName);
    TreeHelper.verifyNodeExpanded(categoryName);
  }

  /**
   * Collapse single category node
   * @param {string} categoryName - Name of category to collapse
   */
  collapseCategoryNode(categoryName) {
    TreeHelper.collapseNode(categoryName);
    TreeHelper.verifyNodeCollapsed(categoryName);
  }

  /**
   * Click Expand All
   */
  clickExpandAll(categoryName) {
    TreeHelper.expandAll(categoryName);
    // Verify multiple nodes are expanded
    cy.get(".aciTreeOpen").should("have.length.greaterThan", 0);
  }

  /**
   * Click Collapse All
   */
  clickCollapseAll() {
    TreeHelper.collapseAll();
    // Verify nodes are collapsed
    cy.get(".aciTreeClosed").should("exist");
  }

  /**
   * Delete a Control Definition
   * @param {string} categoryName - Name of parent category
   * @param {string} definitionName - Name of definition to delete
   * @param {boolean} confirm - Whether to confirm deletion
   */
  deleteControlDefinition(categoryName, definitionName, confirm = true) {
    TreeHelper.deleteTreeItem(definitionName, confirm);

    if (confirm) {
      TreeHelper.expandNode(categoryName);
      TreeHelper.verifyNodeNotExists(definitionName);
    } else {
      TreeHelper.verifyNodeExists(definitionName);
    }
  }

  /**
   * Delete a Control Category with children
   * @param {string} categoryName - Name of category to delete
   * @param {boolean} confirm - Whether to confirm deletion
   */
  deleteControlCategoryWithChildren(categoryName, confirm = true) {
    TreeHelper.deleteTreeItem(categoryName, confirm);

    if (confirm) {
      TreeHelper.verifyNodeNotExists(categoryName);
    } else {
      TreeHelper.verifyNodeExists(categoryName);
    }
  }
}

class ImportOperations {
  /**
   * Open Import Modal and verify it's displayed
   */
  openImportModal(importModalSelector, importBtnElipses, modalText) {
    ImportHelper.openImportModal(
      importModalSelector,
      importBtnElipses,
      modalText
    );
  }

  /**
   * Download sample file and verify download
   */
  downloadSampleFile() {
    ImportHelper.downloadSampleFile(sampleFileName);
  }

  /**
   * Import valid Excel file with taxonomy data
   * @param {string} filePath - Path to valid Excel file
   */
  importValidFile(filePath = "cypress/downloads/importFile_XLSX.xlsx") {
    ImportHelper.performValidImport(filePath);
  }

  /**
   * Import invalid file format
   * @param {string} filePath - Path to invalid format file
   */
  importInvalidFileFormat(filePath = "cypress/attachment/testing.txt") {
    ImportHelper.performInvalidImport(filePath, locators.risk.administration.importOperations.submitImportControl);
  }

  /**
   * Cancel import operation
   */
  cancelImport() {
    ImportHelper.cancelImport();
  }

  /**
   * Complete import workflow for control taxonomy
   */
  updateControlTaxonomyImportJSON() {
    const libraryAdded = "test Library jsyco";
    const uniqueImportName = DateHelper.generateUniqueNameWithTimestamp(
      "Import Control Tax "
    );

    // Update the JSON file
    FileHelper.updateImportJSONFileSections(qbImport, "Control Taxonomy", 0, {
      "Name*": uniqueImportName,
      "Content Library*": libraryAdded,
    }).then(() => {
      // Read the updated file and convert to XLSX
      cy.readFile(qbImport).then((updatedJsonData) => {
        cy.convertXlsxtoJson(updatedJsonData, false, true);
        // Use the writeControlTaxonomyName method from ControlTaxonomy class
        const controlTaxonomy = new ControlTaxonomy();
        controlTaxonomy.writeControlTaxonomyName(true, uniqueImportName);
        cy.log(
          `Updated JSON and converted to XLSX with name: ${uniqueImportName}`
        );
      });
    });
  }

  uploadValidConvertedFile() {
    ImportHelper.uploadValidFileAndSubmit(
      true,
      "importFile_XLSX",
      locators.risk.administration.importOperations.submitImportControl
    );
  }
}

export {
  ControlTaxonomy,
  ControlCategory,
  ControlDefinition,
  TreeOperations,
  ImportOperations,
};
