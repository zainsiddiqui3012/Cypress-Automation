// import dayjs from "dayjs";
import FileHelper from "../Administration/helpers/FileHelper";
import DateHelper from "../Administration/helpers/DateHelper";
import UIHelper from "./helpers/UIHelper";
import ValidationHelper from "../Administration/helpers/ValidationHelper";
import TreeHelper from "../Administration/helpers/TreeHelper";
import FormHelper from "../Administration/helpers/FormHelper";
import ImportHelper from "../Administration/helpers/ImportHelper";
const qbImport = "cypress/fixtures/Examples/riskTaxonomyImport.json";

import locators from "../../../../fixtures/locators.json";

const customerDataString = "cypress/fixtures/Administration/Customers.json";
const data =
  "cypress/fixtures/RiskAndControlRegister/Administration/RiskTaxonomyNoneSpace.json";
const waits = Cypress.env("waits");
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

class RiskTaxonomy {
  /**
   * Write risk taxonomy name to file
   * @param {boolean} updated - Whether the name is being updated
   * @param {string} updatedName - The new name to write
   * @returns {Promise} Promise that resolves when file is updated
   */
  writeRiskTaxonomyName(updated = false, updatedName) {
    return FileHelper.updateRiskTaxonomyName(
      customerDataString,
      data,
      updated,
      updatedName
    );
  }

  /**
   * Add risk taxonomy without providing a name to test validation
   * @param {string} mandatoryFieldError - Expected error message for missing field
   */
  addRiskTaxonomyWithoutName(mandatoryFieldError) {
    cy.get(locators.general.addBtn).dblclick();
    cy.verifyToastMessageText(mandatoryFieldError, waits.mediumWait);
  }

  /**
   * Search for a risk taxonomy in the grid
   * @param {string} updatedName - Optional updated name to search for
   * @returns {Promise} Promise that resolves with search results
   */
  searchRiskTaxonomy(updatedName) {
    return FileHelper.readJsonFile(data).then((readData) => {
      const riskTaxonomyName = updatedName
        ? updatedName
        : readData.riskTaxonomy.riskTaxonomyName;
      UIHelper.searchInGrid(
        locators.risk.administration.riskTaxonomies.searchGrid,
        riskTaxonomyName,
        0
      );
      UIHelper.verifyGridRowCount(
        locators.risk.administration.riskTaxonomies.searchGridResult,
        1,
        1
      );
    });
  }

  /**
   * Change the status of a risk taxonomy
   * @param {string} status - New status to set
   */
  changedStatus(status) {
    cy.get(locators.risk.administration.riskTaxonomies.gridStatus)
      .should("have.length", 2)
      .eq(1)
      .as("status");
    cy.get("@status")
      .dblclick({ delay: 1000 })
      .then(() => {
        cy.get(locators.risk.administration.riskTaxonomies.selectStatus)
          .should("be.visible")
          .contains(status)
          .click();
      });
  }

  /**
   * Verify the status of a risk taxonomy
   * @param {string} status - Expected status to verify
   */
  verifyStatus(status) {
    UIHelper.verifyTextContent(
      locators.risk.administration.riskTaxonomies.gridStatus,
      status,
      1
    );
  }

  /**
   * Double click on a searched risk taxonomy to open it
   */
  clickSearchedRiskTaxonomy() {
   
    UIHelper.doubleClickGridCell(
      locators.risk.administration.riskTaxonomies.searchGridResult,
      1
    );
  }

  /**
   * Clear the existing name field
   */
  clearExistingName() {
    UIHelper.clearTextareaAndTab(
      locators.risk.administration.riskTaxonomies.categoryFormNameInput
    );
  }

  /**
   * Type a risk taxonomy name in the input field
   * @param {string} name - Name to type
   */
  typeRiskTaxonomyName(name) {
    UIHelper.typeInTextareaAndTab(
      locators.risk.administration.riskTaxonomies.categoryFormNameInput,
      name
    );
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
    cy.get(locators.risk.administration.riskTaxonomies.descriptionTextArea, {
      timeout: waits.longWait,
    })
      .should("be.enabled")
      .clear()
      .type(descriptionText);
  }

  /**
   * Verify that a name validation error is displayed
   */
  verifyNameError() {
    cy.get(locators.administration.toastMsg, { multiple: true })
      .should("exist")
      .and("be.visible");
  }

  /**
   * Click on a filter icon
   * @param {number} iconIndex - Index of the filter icon to click
   */
  clickFilterIcon(iconIndex) {
    UIHelper.clickFilterIcon(
      locators.risk.administration.riskTaxonomies.filterIcon,
      iconIndex
    );
  }

  /**
   * Type a name in the filter input field
   * @param {string} name - Name to filter by
   * @param {number} filterIndex - Index of the filter input (default: 0)
   */
  typeFilterName(name, filterIndex = 0) {
    UIHelper.searchInGrid(
      locators.risk.administration.riskTaxonomies.filterNameInput,
      name,
      filterIndex
    );
  }

  /**
   * Type a status name in the status filter field
   * @param {string} status - Status to filter by
   */
  typeStatusName(status) {
    UIHelper.searchInGrid(
      locators.risk.administration.riskTaxonomies.filterStatusInput,
      status,
      0
    );
  }

  /**
   * Verify the length of search results
   */
  verifySearchRiskTaxonomyLength() {
    UIHelper.verifyGridRowCount(
      locators.risk.administration.riskTaxonomies.searchGridResult,
      1,
      1
    );
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
    cy.get(locators.risk.administration.riskTaxonomies.verifyViewActionScreen, {
      timeout: waits.longWait,
    }).should("be.visible");
  }
}

class RiskCategory {
  /**
   * Click the Add Risk Category button
   * @param {string} btnTextName - Text of the button to click
   */
  clickAddRiskCategory(btnTextName) {
    UIHelper.clickButtonByText(locators.general.addBtn, btnTextName);
  }

  /**
   * Add Risk Category with missing required field
   */
  addRiskCategoryWithMissingName(missingNameError) {
    FormHelper.fillRiskCategoryForm({
      description: descriptionText[0],
    });
    FormHelper.submitForm(submitForm[0]);
    ValidationHelper.verifyValidationError(missingNameError);
  }

  /**
   * Add Risk Category with maximum name length
   * @param {number} length - Character length to test
   */
  addRiskCategoryWithMaxLength(length = 255) {
    const longName = "A".repeat(length);
    FormHelper.fillRiskCategoryForm({
      riskCategoryId: DateHelper.generateUniqueNameWithTimestamp("Cat"),
      name: longName,
      description: descriptionText[1],
    });
    FormHelper.submitForm(submitForm[0]);
    return longName;
  }

  /**
   * Add Risk Category exceeding name limit
   */
  addRiskCategoryExceedingNameLimit() {
    const tooLongName = "A".repeat(256);
    FormHelper.fillRiskCategoryForm({
      riskCategoryId: DateHelper.generateUniqueNameWithTimestamp("Cat"),
      name: tooLongName,
      description: descriptionText[3],
    });
    ValidationHelper.verifyMaxLengthValidation(
      locators.risk.administration.riskCategory.formName,
      tooLongName,
      255
    );
  }

  /**
   * Add Risk Category with maximum description
   */
  addRiskCategoryWithMaxDescription() {
    const longDescription = "A".repeat(5000);
    const createdName = DateHelper.generateUniqueNameWithTimestamp("Cat");
    FormHelper.fillRiskCategoryForm({
      riskCategoryId: createdName,
      name: createdName,
      description: longDescription,
    });
    FormHelper.submitForm(submitForm[0]);
    return createdName;
  }

  /**
   * Add Risk Category exceeding description limit
   */
  addRiskCategoryExceedingDescriptionLimit() {
    const createdName = DateHelper.generateUniqueNameWithTimestamp("Cat");
    const tooLongDescription = "A".repeat(5001);
    FormHelper.fillRiskCategoryForm({
      riskCategoryId: createdName,
      name: createdName,
      description: tooLongDescription,
    });
    ValidationHelper.verifyMaxLengthValidation(
      locators.risk.administration.riskCategory.formDescription,
      tooLongDescription,
      5000
    );
  }

  /**
   * Cancel Add Risk Category form
   */
  cancelAddRiskCategory() {
    FormHelper.fillRiskCategoryForm({
      riskCategoryId: descriptionText[2],
      name: descriptionText[2],
      description: descriptionText[2],
    });
    FormHelper.cancelForm();
  }

  /**
   * Verify that the form is closed
   */
  verifyFormClosed() {
    cy.get(locators.risk.administration.riskCategory.formClosed).should(
      "not.have.class",
      locators.risk.administration.riskCategory.closedClassName
    );
  }

  /**
   * Add duplicate Risk Category
   * @param {string} existingName - Name of existing category
   */
  addDuplicateRiskCategory(existingName) {
    FormHelper.fillRiskCategoryForm({
      riskCategoryId: existingName,
      name: existingName,
      description: descriptionText[4],
    });
    FormHelper.submitForm(submitForm[0]);
    cy.waitForElementToVisible(
      locators.administration.toastMsg,
      waits.mediumWait
    )
  }
  /**
   * Add Risk Category with special characters
   * @param {string} specialChars - Special characters to test
   */
  addRiskCategoryWithSpecialChars(specialChars = "@#$%^&*()") {
    const nameWithSpecialChars = `Test${specialChars}Category`;
    FormHelper.fillRiskCategoryForm({
      riskCategoryId: nameWithSpecialChars,
      name: nameWithSpecialChars,
      description: descriptionText[5],
    });
    FormHelper.submitForm(submitForm[0]);
    return nameWithSpecialChars;
  }

  /**
   * Add Risk Category with numeric name
   */
  addRiskCategoryWithNumericName(categoryName) {
    const numericName = "85776746354545";
    FormHelper.fillRiskCategoryForm({
      riskCategoryId: numericName,
      name: numericName,
      description: descriptionText[6],
    });
    FormHelper.selectRiskCategory(categoryName);
    FormHelper.submitForm(submitForm[0]);
    return numericName;
  }

  /**
   * Add a risk category with specified parameters
   * @param {string} sectionName - Section name for data storage
   * @param {string} baseName - Base name for generating unique name
   * @param {string} description - Description for the category
   */
  addRiskCategory(sectionName, baseName, description) {
    const createdName = DateHelper.generateUniqueNameWithTimestamp(baseName);
    FormHelper.fillRiskCategoryForm({
      riskCategoryId: createdName,
      name: createdName,
      description: description,
    });
    FormHelper.submitForm(submitForm[0]);
    FileHelper.updateSectionData(data, "add", createdName);
  }

  /**
   * Edit existing Risk Category
   * @param {string} categoryName - Name of category to edit
   * @param {object} newData - New data for the category
   */
  editRiskCategory(sectionName, baseName, categoryName) {
    this.verifyAddedRiskCategory(categoryName);
    cy.contains(
      locators.risk.administration.riskCategory.clickExistingTaxonomyName,
      categoryName
    ).dblclick();

    const updatedName = DateHelper.generateUniqueNameWithTimestamp(baseName);
    FormHelper.fillRiskCategoryForm({
      name: updatedName,
      description: descriptionText[7],
    });
    FormHelper.submitForm(submitForm[1]);
    FileHelper.updateSectionData(data, sectionName, updatedName);
    this.verifyAddedRiskCategory(updatedName);
  }

  verifyAddedRiskCategory(categoryName) {
    cy.wait(3000); // it was displaying previous page data
    cy.contains(locators.risk.administration.treeOperations.treeText, categoryName, {timeout:10000})
    .should("be.visible");
  }

  /**
   * Write risk category name for use in risk definition
   * @param {string} categoryName - Name of the category to write
   */
  writeRiskCategoryNameInRiskDefinition(categoryName) {
    FileHelper.updateNestedProperty(
      data,
      "riskDefinition",
      "add",
      "riskCategory",
      categoryName
    );
  }
}

class RiskDefinition {
  /**
   * Click Add Risk Definition button
   */
  clickAddRiskDefinition(btnText) {
    UIHelper.clickButtonByText(locators.general.addBtn, btnText);
  }

  /**
   * Add Risk Definition with valid data
   * @param {string} sectionName - Section name in test data
   */
  addRiskDefinitionValidData(sectionName) {
    return FileHelper.getSectionData(data, sectionName, "riskDefinition").then(
      (sectionData) => {
        const uniqueName = DateHelper.generateUniqueNameWithTimestamp(
          sectionData.baseName
        );

        FormHelper.fillRiskDefinitionForm({
          riskDefinitionId: uniqueName,
          name: uniqueName,
          description: sectionData.description,
          cfrGuidance: sectionData.cfrGuidance || "",
          status: "Active",
          updated: false,
        });

        // Select risk category
        if (sectionData.riskCategory) {
          FormHelper.selectRiskCategory(sectionData.riskCategory);
        }

        FormHelper.submitForm(submitForm[1]);
        FileHelper.updateSectionData(
          data,
          sectionName,
          uniqueName,
          "riskDefinition"
        );
        return cy.wrap(uniqueName);
      }
    );
  }

  /**
   * Add Risk Definition with missing required fields
   */
  addRiskDefinitionMissingFields(missingError) {
    FormHelper.fillRiskDefinitionForm({
      description: descriptionText[8],
    });
    FormHelper.submitForm(submitForm[1]);
    ValidationHelper.verifyValidationError(missingError);
  }

  /**
   * Add Risk Definition with missing name
   */
  addRiskDefinitionMissingName(missingNameError, categoryName) {
    const riskId = DateHelper.generateUniqueNameWithTimestamp("DefId");
    FormHelper.fillRiskDefinitionForm({
      riskDefinitionId: riskId,
      description: descriptionText[9],
    });
    FormHelper.selectRiskCategory(categoryName);
    FormHelper.submitForm(submitForm[1]);
    ValidationHelper.verifyValidationError(missingNameError);
  }

  /**
   * Add Risk Definition with missing risk category
   */
  addRiskDefinitionMissingCategory(missingParentError) {
    FormHelper.fillRiskDefinitionForm({
      riskDefinitionId: "TestDefId",
      name: "Test Definition",
      description: descriptionText[10],
    });
    FormHelper.submitForm(submitForm[1]);
    ValidationHelper.verifyValidationError(missingParentError);
  }

  /**
   * Add Risk Definition with special characters
   */
  addRiskDefinitionWithSpecialChars(
    specialCharacters = "Test@#$%^&*()Definition",
    riskCategory
  ) {
    const specialName = specialCharacters;
    FormHelper.fillRiskDefinitionForm({
      riskDefinitionId: specialName,
      name: specialName,
      description: descriptionText[5],
    });
    FormHelper.selectRiskCategory(riskCategory);
    FormHelper.submitForm(submitForm[1]);
  }

  /**
   * Add Risk Definition with max length name
   */
  addRiskDefinitionMaxLengthName(maxLengthCharacters = 255) {
    const longName = "A".repeat(256);
    FormHelper.fillRiskDefinitionForm({
      riskDefinitionId: "TestDef",
      name: longName,
    });
    ValidationHelper.verifyMaxLengthValidation(
      locators.risk.administration.riskCategory.formName,
      longName,
      maxLengthCharacters
    );
  }

  /**
   * Add Risk Definition with max length description
   */
  addRiskDefinitionMaxLengthDescription() {
    const longDescription = "A".repeat(5001);
    FormHelper.fillRiskDefinitionForm({
      riskDefinitionId: "TestDef",
      name: "Test Definition",
      description: longDescription,
    });
    ValidationHelper.verifyMaxLengthValidation(
      locators.risk.administration.riskCategory.formDescription,
      longDescription,
      5000
    );
  }

  /**
   * Add Risk Definition without Library Risk Definition ID
   */
  addRiskDefinitionWithoutLibraryId(riskIDRequiredError) {
    const randomName = DateHelper.generateUniqueNameWithTimestamp("Def");
    FormHelper.fillRiskDefinitionForm({
      name: randomName,
      description: descriptionText[11],
    });
    FormHelper.submitForm(submitForm[1]);
    ValidationHelper.verifyValidationError(riskIDRequiredError);
  }

  /**
   * Edit Risk Definition - Change Description
   * @param {string} definitionName - Name of definition to edit
   * @param {string} newDescription - New description
   */
  editRiskDefinitionDescription(definitionName, newDescription) {
    TreeHelper.verifyNodeExists(definitionName);
    cy.contains(
      locators.risk.administration.riskCategory.clickExistingTaxonomyName,
      definitionName
    ).dblclick({ force: true });

    FormHelper.fillRiskDefinitionForm({
      description: newDescription,
    });
    FormHelper.submitForm(submitForm[1]);
  }

  /**
   * Edit Risk Definition - Change Risk Category
   * @param {string} definitionName - Name of definition to edit
   * @param {string} newCategory - New risk category
   */
  editRiskDefinitionCategory(
    definitionName,
    riskCategory,
    selectPreviousCategory = false
  ) {
    TreeHelper.verifyNodeExists(definitionName);
    cy.contains(
      locators.risk.administration.riskCategory.clickExistingTaxonomyName,
      definitionName
    ).dblclick({ force: true });

    cy.wait(2000); // it was displaying previous page data
    FormHelper.selectRiskCategory(riskCategory, selectPreviousCategory);
    FormHelper.submitForm(submitForm[1]);
  }

  /**
   * Edit Risk Definition - Change Status to Inactive
   * @param {string} definitionName - Name of definition to edit
   */
  editRiskDefinitionStatusInactive(
    definitionName,
    selectedStatus = "Active",
    updatedForm = false
  ) {
    TreeHelper.verifyNodeExists(definitionName);
    cy.contains(
      locators.risk.administration.riskCategory.clickExistingTaxonomyName,
      definitionName
    ).dblclick({ delay: 2000, force: true });

    FormHelper.fillRiskDefinitionForm({
      status: selectedStatus,
      updated: updatedForm,
    });

    cy.get(locators.risk.administration.riskTaxonomies.riskDefinitionSaveBtn).click();
    cy.waitForElementToVisible(
      locators.administration.toastMsg,
      waits.mediumWait
    );
  }

  /**
   * Cancel Risk Definition Add
   */
  cancelRiskDefinitionAdd() {
    FormHelper.fillRiskDefinitionForm({
      riskDefinitionId: descriptionText[2],
      name: descriptionText[2],
      description: descriptionText[2],
    });
    FormHelper.cancelForm(3);
  }

  /**
   * Add Risk Definition with rich text in description
   */
  addRiskDefinitionWithRichText(riskCategory, richTextDescription) {
    const richTextContent = richTextDescription;
    FormHelper.fillRiskDefinitionForm({
      riskDefinitionId: DateHelper.generateUniqueNameWithTimestamp("RichDef"),
      name: descriptionText[12],
      description: richTextContent,
    });
    FormHelper.selectRiskCategory(riskCategory);
    FormHelper.submitForm(submitForm[1]);
  }

  /**
   * Add duplicate Risk Definition ID
   * @param {string} existingId - Existing definition ID
   */
  addDuplicateRiskDefinitionId(existingId, categoryName) {
    FormHelper.fillRiskDefinitionForm({
      riskDefinitionId: existingId,
      name: existingId,
      description: descriptionText[4],
    });
    FormHelper.selectRiskCategory(categoryName);
    FormHelper.submitForm(submitForm[1]);
    ValidationHelper.verifyDuplicateError(submitForm[1]);
  }

  /**
   * Verify added Risk Definition
   * @param {string} definitionName - Name of the definition to verify
   */
  verifyAddedRiskDefinition(categoryName, definitionName) {
    // TreeHelper.verifyNodeExists(definitionName);
    cy.wait(3000); // it was displaying previous page data
    TreeHelper.expandAll(categoryName);
    TreeHelper.askExpandBtn();
    TreeHelper.verifyNodeExists(definitionName);

  }
}

class TreeOperations {
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
   * Delete a Risk Definition
   * @param {string} definitionName - Name of definition to delete
   * @param {boolean} confirm - Whether to confirm deletion
   */
  deleteRiskDefinition(categoryName, definitionName, confirm = true) {
    TreeHelper.deleteTreeItem(definitionName, confirm);

    if (confirm) {
      TreeHelper.expandNode(categoryName);
      TreeHelper.verifyNodeNotExists(definitionName);
    } else {
      TreeHelper.verifyNodeExists(definitionName);
    }
  }

  /**
   * Delete a Risk Category with children
   * @param {string} categoryName - Name of category to delete
   * @param {boolean} confirm - Whether to confirm deletion
   */
  deleteRiskCategoryWithChildren(categoryName, confirm = true) {
    TreeHelper.deleteTreeItem(categoryName, confirm);

    if (confirm) {
      TreeHelper.verifyNodeNotExists(categoryName);
    } else {
      TreeHelper.verifyNodeExists(categoryName);
    }
  }

  /**
   * Click on a risk definition to open it
   * @param {string} categoryName - Parent category name
   * @param {string} definitionName - Risk definition name to click
   */
  clickRiskDefinition(categoryName, definitionName) {
    // Find the category and expand it if needed
    cy.get(locators.risk.administration.treeOperations.riskDefinitionNameInTree)
      .contains(categoryName)
      .first()
      .parents(".aciTreeLi")
      .first()
      .as("categoryNode");

    // Ensure category is expanded
    cy.get("@categoryNode").then(($categoryNode) => {
      if (!$categoryNode.hasClass("aciTreeOpen")) {
        cy.get("@categoryNode").find(locators.risk.administration.controlOperations.expandButton).click();
        cy.wait(1000);
      }
    });

    // Find and click the risk definition within the category
    cy.get("@categoryNode")
      .find(`span.aciTreeText:contains("${definitionName}")`)
      .should("be.visible")
      .click({force:true});

    cy.wait(2000);
  }
}

class ImportOperations {
  /**
   * Open Import Modal and verify it's displayed
   */
  openImportModal() {
    ImportHelper.openImportModal();
  }

  /**
   * Download sample file and verify download
   */
  downloadSampleFile() {
    ImportHelper.downloadSampleFile();
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
    ImportHelper.performInvalidImport(filePath);
  }

  /**
   * Cancel import operation
   */
  cancelImport() {
    ImportHelper.cancelImport();
  }

  /**
   * Monitor job queue until completion
   * @param {string} expectedStatus - Expected status
   */
  monitorJobQueue(expectedStatus = "COMPLETED") {
    ImportHelper.monitorJobStatus(expectedStatus);
  }

  // ============= NEW JSON TO EXCEL IMPORT METHODS =============

  /**
   * Create and import Risk Taxonomy data from JSON with randomized names
   * @param {boolean} validFormatFile - Whether to create xlsx or csv
   */
  createAndImportRiskTaxonomyFromJson(validFormatFile = "importFile_XLSX") {
    ImportHelper.addRiskTaxonomyDataImportJson(qbImport, validFormatFile);
  }

  /**
   * Write imported data to test data file
   */
  saveImportedDataToTestFile() {
    ImportHelper.writeImportNameToDataFile(qbImport);
  }

  /**
   * Import JSON data and verify success
   */
  importJsonDataAndVerifySuccess() {
    this.openImportModal();
    this.createAndImportRiskTaxonomyFromJson(true);
    this.verifyJobQueueFunctionality();
    this.monitorJobQueue("COMPLETED");
    this.saveImportedDataToTestFile();
  }

  /**
   * Import JSON data and expect failure (for testing invalid data)
   */
  importJsonDataAndExpectFailure() {
    this.openImportModal();
    this.createAndImportRiskTaxonomyFromJson(true);
    this.verifyJobQueueFunctionality();
    this.monitorJobQueue("FAILED");
  }

  /**
   * Complete import workflow: JSON -> Excel -> Import -> Monitor
   */
  /**
   * Complete import workflow using sample file - only updating Risk Taxonomy name
   * @param {string} expectedStatus - Expected job status (default: "COMPLETED")
   */
  completeImportWorkflow(expectedStatus = "COMPLETED") {
    const libraryAdded = "test Library jsyco"; // this data will not be changed so it will not be added in data.json file
    // Step 1: Open import modal
    this.openImportModal();
    // Step 2: Create import file from sample template (only update Risk Taxonomy name)
    ImportHelper.createImportFileFromSampleWithUpdatedName(
      qbImport,
      libraryAdded
    );

    // Step 3: Wait for file creation
    cy.wait(3000);

    // Step 4: Upload the created file
    ImportHelper.uploadValidFileAndSubmit(true, "importFile_XLSX");

    // Step 5: Verify job queue opens and monitor status
    ImportHelper.verifyJobQueueModalOpen();
    ImportHelper.monitorJobStatus(expectedStatus);
    

    // Step 6: Save imported data and close
    const importedName = ImportHelper.writeImportNameToDataFile(qbImport);
    ImportHelper.closeJobQueueModal();
    return importedName;
  }
}

class ControlOperations {
  loc_control = locators.risk.administration.controlOperations;

  /**
   * Click on Controls tab to open control tree
   */
  clickControlsTab() {
    cy.get(this.loc_control.controlsTab).should("be.visible").click();
    cy.wait(2000); // Wait for tree to load
    cy.get(this.loc_control.controlTree).should("be.visible");
  }

  /**
   * Expand the test library
   */
  expandTestLibrary() {
    cy.get(this.loc_control.testLibrary)
      .parent()
      .parent()
      .find(this.loc_control.expandButton)
      .first()
      .click();
    // cy.wait(1000);
  }

  /**
   * Expand the control taxonomy
   */
  expandControlTaxonomy() {
    cy.get(this.loc_control.controlTaxonomy)
      .parent()
      .parent()
      .find(this.loc_control.expandButton)
      .first()
      .click();
    // cy.wait(1000);
  }

  /**
   * Expand risk category to show control definitions
   * @param {string} categoryName - Name of the risk category to expand
   */
  expandRiskCategory(categoryName = "Test Risk Category 01") {
    cy.get(`span.aciTreeText:contains("${categoryName}")`)
      .parent()
      .parent()
      .find(this.loc_control.expandButton)
      .first()
      .click();
    // cy.wait(1000);
  }

  /**
   * Select a single control definition
   * @param {string} controlName - Name of the control to select
   */
  selectSingleControl(controlName = "Test Risk Def 01") {
    cy.get(`span.aciTreeText:contains("${controlName}")`)
      .parent()
      .find(this.loc_control.checkbox)
      .click();
  }

  /**
   * Select multiple control definitions
   * @param {Array} controlNames - Array of control names to select
   */
  selectMultipleControls(controlNames) {
    controlNames.forEach((controlName) => {
      cy.get(`span.aciTreeText:contains("${controlName}")`)
        .parent()
        .find(this.loc_control.checkbox)
        .click();
    });
  }

  /**
   * Unselect a control definition
   * @param {string} controlName - Name of the control to unselect
   */
  unselectControl(controlName) {
    cy.get(`span.aciTreeText:contains("${controlName}")`)
      .parent()
      .find(this.loc_control.checkbox)
      .click();
  }

  /**
   * Click Expand All button
   */
  clickExpandAll() {
    cy.get(this.loc_control.expandAllBtn, { timeout: 10000 }).first().click();
    // cy.wait(2000);
  }

  /**
   * Click Collapse All button
   */
  clickCollapseAll() {
    cy.get(this.loc_control.collapseAllBtn, { timeout: 10000 }).first().click();
    // cy.wait(2000);
  }

  /**
   * Click Save button
   */
  clickSave() {
    cy.get(this.loc_control.saveBtn).should("be.visible").click();
    cy.waitForElementToVisible(
      locators.administration.toastMsg,
      waits.mediumWait
    );
  }

  /**
   * Click Cancel button
   */
  clickCancel() {
    cy.get(this.loc_control.cancelBtn)
      .should("be.visible")
      .first() // Add this to select only the first element
      .click();
    // cy.wait(2000);
  }

  /**
   * Verify control is linked/visible
   * @param {string} controlName - Name of the control to verify
   */
  verifyControlLinked(controlName) {
    cy.get(`span.aciTreeText:contains("${controlName}")`)
      .closest(".aciTreeLi")
      .should("have.class", "aciTreeChecked");
  }

  /**
   * Verify control is unlinked
   * @param {string} controlName - Name of the control to verify
   */
  verifyControlUnlinked(controlName) {
    cy.get(`span.aciTreeText:contains("${controlName}")`)
      .parent()
      .find(this.loc_control.checkbox)
      .should("not.be.checked");
  }

  /**
   * Complete setup for control linking (expand all necessary nodes)
   */
  setupControlTree() {
    this.clickControlsTab();
    this.expandTestLibrary();
    this.expandControlTaxonomy();
    this.expandRiskCategory();
  }

  /**
   * Verify all control levels are expanded
   */
  verifyAllExpanded() {
    // Verify main library is expanded
    cy.get(this.loc_control.testLibrary)
      .closest(".aciTreeLi") // Use closest instead of multiple parent() calls
      .should("have.class", "aciTreeOpen");

    // Verify control taxonomy is expanded
    cy.get(this.loc_control.controlTaxonomy)
      .closest(".aciTreeLi")
      .should("have.class", "aciTreeOpen");
  }

  /**
   * Verify all control levels are collapsed
   */
  verifyAllCollapsed() {
    // Verify main library is collapsed
    cy.get(this.loc_control.testLibrary)
      .closest(".aciTreeLi") // Use closest instead of multiple parent() calls
      .should("not.have.class", "aciTreeOpen");
  }
}

export {
  RiskTaxonomy,
  RiskCategory,
  RiskDefinition,
  TreeOperations,
  ImportOperations,
  ControlOperations,
};
