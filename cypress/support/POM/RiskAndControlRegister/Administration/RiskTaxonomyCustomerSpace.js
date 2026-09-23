import locators from "../../../../fixtures/locators.json";
import UIHelper from "./helpers/UIHelper";
import ValidationHelper from "../Administration/helpers/ValidationHelper";
import TreeHelper from "../Administration/helpers/TreeHelper";
import FormHelper from "../Administration/helpers/FormHelper";
import DateHelper from "../Administration/helpers/DateHelper";
import DataHelper from "../Administration/helpers/DataHelper";
import FileHelper from "../Administration/helpers/FileHelper";
import ImportHelper from "../Administration/helpers/ImportHelper";
import FilterAndDeleteHelper from "./helpers/FilterAndDeleteHelper";
import dayjs from "dayjs";

const loc = locators.risk.administration.importOperations;
const importDialog = locators.risk.administration.importOperations.importDialog;
const qbImport = "cypress/fixtures/Examples/RiskTaxonomyImportCustomerSpace.json";
const data = "cypress/fixtures/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.json";
const sampleFileName = "ImportTemplate_RiskandProcessTaxonomy_Customer.xlsx";
const filePath = "cypress/fixtures/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.json";
const waits = Cypress.env("waits");

const submitForm = ["Category", "Definition"];
class RiskTaxonomy {
  /**
   * Open Add Risk Category form and validate the form opens
   */
  openAddRiskCategoryForm(btnText = "Add Risk Category") {
    cy.get(locators.risk.administration.riskTaxonomies.addRiskCategoryBtn)
      .contains(btnText)
      .click();

    cy.get(locators.risk.administration.riskCategory.riskCategoryForm).should(
      "be.visible"
    );
  }

  /**
   * Fill Risk Category ID (optional field)
   */
  fillRiskCategoryId(riskId) {
    if (riskId) {
      cy.get(locators.risk.administration.riskCategory.riskIdField)
        .clear()
        .type(riskId);
    }
  }

  /**
   * Fill Name (mandatory field)
   */
  fillName(name) {
    cy.get(locators.risk.administration.riskCategory.nameField)
      .clear()
      .type(name);
  }

  /**
   * Fill Description (optional field)
   */
  fillDescription(description) {
    if (description) {
      cy.get(locators.risk.administration.riskCategory.descriptionField)
        .clear({ force: true })
        .type(description, { force: true, delay: 150 });
    }
  }

  /**
   * Select Parent Risk Category from tree (mandatory for assessments)
   */
  selectParentRiskCategory(nodeIndex = 0) {
    cy.get(locators.risk.administration.riskCategory.parentRiskCategoryTree)
      .find(locators.risk.administration.riskCategory.checkCategory)
      .eq(nodeIndex)
      .click({ force: true });
  }

  /**
   * Click on Save button on Risk Category form
   */
  saveRiskCategory() {
    cy.get(locators.risk.administration.riskCategory.saveButton).scrollIntoView().click({
      multiple: true, force: true
    });
    cy.wait(3000); // added static wait so that the value should be synced in backend.
  }

  /**
   * Error message verification when category name is not provided
   */
  verifyMissingCategoryNameError(errorMessage) {
    cy.get(locators.risk.administration.riskCategory.notificationToast)
      .should("be.visible")
      .and("contain.text", errorMessage);
  }

  /**
   * Error message verification when same category name is provided which already exists
   */
  verifyDuplicateCategoryError(errorMessage) {
    cy.get(locators.risk.administration.riskCategory.notificationToast)
      .should("be.visible")
      .and("contain.text", errorMessage);
  }

  /**
   * Success message verification when category is added successfully
   */
  verifyCategorySuccessfullyAdded(successMessage) {
    cy.get(locators.risk.administration.riskCategory.notificationToast)
      .should("be.visible")
      .and("contain.text", successMessage);
  }

  /**
   * Generate random data for category name and replace the existing category name in the file
   */
  generateAndWriteRiskCategoryDataInFile(filePath, section = "add") {
    // Use FileHelper to read and write file data
    FileHelper.readJsonFile(filePath).then((fileData) => {
      cy.createRandomString(6).then((randomString) => {
        const newCategoryName = `~zz Risk Cat ${section} ` + dayjs().format("MM/DD/YYYY HH:mm:ss");;
        const updateSection = {
          name: newCategoryName,
          riskCategoryId: newCategoryName,
        };
        return FileHelper.updateSectionProperties(
          filePath,
          "riskCatagory",
          section,
          updateSection
        );
      });
    });
  }

  /**
   * Navigate to Risk Taxonomies page
   */
  navigateToRiskTaxonomies() {
    cy.visitRiskTaxonomies();
  }

  /**
   * Wait for page to load completely
   */
  waitForPageLoad() {
    cy.get(
      locators.risk.administration.riskCategory.customerSpace.FormParentElement
    ).should("be.visible");
    cy.wait(waits.medium);
  }

  /**
   * Search for specific item in grid
   */
  searchInGrid(selector=locators.general.searchTextField, searchTerm) {
    cy.get(selector).first().clear().type('{selectall}{backspace}').type('{selectall}{backspace}').type(searchTerm);
    // cy.wait(2000);
  }

  clearSearches(ColumnIndex, selector=locators.general.searchGrid){
    cy.get(selector)
    .eq(ColumnIndex)
    .clear()
    .type('{selectall}{backspace}')
    .wait(2000); // Wait for grid to refresh
  }
  /**
   * Verify total count in grid
   */
  verifyGridCount(selector=locators.general.gridResult, expectedCount) {
    cy.get(selector).should(
      "contain.text",
      `${expectedCount}`
    );
  }

  /**
   * Refresh the grid data
   */
  refreshGrid() {
    cy.get(locators.general.refereshGrid).first().click();
    this.waitForPageLoad();
  }

  /**
   * Sort grid by column
   */
  sortByColumn(columnName, direction = "asc") {
    cy.get(locators.general.sortColumn).contains(columnName).click();
    if (direction === "desc") {
      cy.get(locators.general.sortColumn).contains(columnName).click();
    }
  }

  /**
   * Generate random data for risk definition and replace the existing data in the file
   */
  generateAndWriteRiskDefinitionDataInFile(filePath, section = "add") {
    return FileHelper.readJsonFile(filePath).then((fileData) => {
      cy.createRandomString(6).then((randomString) => {
        const baseName = fileData.riskDefinition[section].baseName;
        const newName = baseName + dayjs().format("MM/DD/YYYY HH:mm:ss");

        fileData.riskDefinition[section].name = newName;
        fileData.riskDefinition[section].riskDefinitionId = newName;

        return FileHelper.writeJsonFile(filePath, fileData);
      });
    });
  }

  /**
   * Search for a risk taxonomy in the grid with hover, menu click, and expand all
   * @param {string} taxonomyName - Name of the taxonomy to search for
   */
  searchRiskTaxonomy(taxonomyName) {
    // Simple search - try search fields
    cy.get('body').then($body => {
      if ($body.find(locators.general.searchField).length > 0) {
        cy.get(locators.general.searchField)
          .should('be.visible')
          .clear({force: true})
          .type(taxonomyName, {force: true});
      }
    });
 
    // Expand grid and verify result
    cy.get(locators.risk.riskRegister.riskColumnHeader)
      .first()
      .should('be.visible')
      .trigger('mouseover')
      .find(locators.risk.riskRegister.columnMenuIcon)
      .click();
 
    cy.get(locators.risk.riskRegister.expandAllOption)
      .should('be.visible')
      .click();
   
    cy.get (locators.Administration.RiskTaxonomyLibraries.grid.mainGrid).contains(taxonomyName)
      .should('be.visible');
   
    cy.log(`Successfully found Risk Taxonomy: ${taxonomyName}`);
  }
}

/**
 * RiskCategory class encapsulates methods to manage risk categories in the application
 */
class RiskCategory {
  /**
   * Click Add Risk Category button
   */
  clickAddRiskCategory() {
    UIHelper.clickButtonByText(
      locators.risk.administration.riskTaxonomies.addRiskCategoryBtn,
      "Add Risk Category"
    );
  }

  /**
   * Fill Risk Category with valid data including mandatory fields
   * @param {string} sectionName - Section name in test data (add/update)
   */
  addRiskCategoryValidData(
    sectionName = "add",
    parentCategory = false,
    multipleBA = false,
    parentCategoryNumber = 5
  ) {
    // Use FileHelper to read JSON file instead of cy.readFile()
    FileHelper.readJsonFile(filePath).then((data) => {
      const categoryData = data.riskCatagory[sectionName];

      // Use FormHelper to fill form data
      FormHelper.fillRiskCategoryForm({
        riskCategoryId: categoryData.riskCategoryId,
        name: categoryData.name,
        description: categoryData.description,
      });
      // Select Business Area Definition
      if (categoryData.businessAreaDefinition) {
        this.selectBusinessAreaDefinition(multipleBA, sectionName);
      }
      // Select Risk Appetite
      if (categoryData.riskAppetite)
        this.selectRiskAppetite(categoryData.riskAppetite);

      // Select Assessment fields if available
      this.selectAssessments(
        categoryData.inherentRiskProbabilityAssessment,
        categoryData.inherentRiskImpactAssessment,
        categoryData.controlEnvironmentAssessment,
        sectionName
      );

      // Select Parent Risk Category
      if (parentCategory) this.selectParentRiskCategory(parentCategoryNumber);
      this.writeRiskCategoryNameInRiskDefinition(categoryData.name);
    });
  }

  /**
   * Add Risk Category without filling the Name field
   */
  addRiskCategoryWithoutName(section = "add") {
    // Use FileHelper to read JSON file
    FileHelper.readJsonFile(filePath).then((data) => {
      const categoryData = data.riskCatagory.add;

      // Fill all fields except name using FormHelper
      FormHelper.fillRiskCategoryForm({
        riskCategoryId: categoryData.riskCategoryId,
        description: categoryData.description,
        // Intentionally omitting name to test validation
      });
      this.selectBusinessAreaDefinition(false, section);
      this.selectRiskAppetite(categoryData.riskAppetite);
      this.selectAssessments(
        categoryData.inherentRiskProbabilityAssessment,
        categoryData.inherentRiskImpactAssessment,
        categoryData.controlEnvironmentAssessment,
        section
      );
      this.selectParentRiskCategory();
    });
  }

  /**
   * Add Risk Category with duplicate name on same hierarchy level
   */
  addRiskCategoryDuplicateName(existingName) {
    // Use FileHelper for reading file data
    FileHelper.readJsonFile(filePath).then((data) => {
      this.clickAddRiskCategory();

      // Use FormHelper to fill just the name field
      FormHelper.fillRiskCategoryForm({
        name: existingName,
      });

      // Select same parent to create duplicate at same level
      this.selectParentRiskCategory();
      this.saveRiskCategory();
    });
  }

  /**
   * Add Risk Category with duplicate name on different hierarchy level
   */
  addRiskCategoryDuplicateNameDifferentLevel(existingName) {
    // Use FileHelper for reading file data
    FileHelper.readJsonFile(filePath).then((data) => {
      this.clickAddRiskCategory();

      // Use FormHelper to fill just the name field
      FormHelper.fillRiskCategoryForm({
        name: existingName,
      });

      // Select different parent to create duplicate at different level
      this.selectParentRiskCategory(1); // Different parent
      this.saveRiskCategory();
    });
  }

  /**
   * Add Risk Category without selecting Business Area
   */
  addRiskCategoryWithoutBusinessArea() {
    // Use FileHelper to read JSON file
    FileHelper.readJsonFile(filePath).then((data) => {
      const categoryData = data.riskCatagory.add;

      // Use FormHelper to fill form excluding business area
      FormHelper.fillRiskCategoryForm({
        name: categoryData.name,
        riskCategoryId: categoryData.riskCategoryId,
        description: categoryData.description,
      });

      // Deliberately skip business area selection
      this.selectAssessments(
        categoryData.inherentRiskProbabilityAssessment,
        categoryData.inherentRiskImpactAssessment,
        categoryData.controlEnvironmentAssessment
      );
      this.selectRiskAppetite(categoryData.riskAppetite);
    });
  }

  /**
   * Add Risk Category without selecting Risk Appetite
   */
  addRiskCategoryWithoutRiskAppetite() {
    // Use FileHelper to read JSON file
    FileHelper.readJsonFile(filePath).then((data) => {
      const categoryData = data.riskCatagory.add;
      // Use FormHelper to fill form
      FormHelper.fillRiskCategoryForm({
        name: categoryData.name,
        riskCategoryId: categoryData.riskCategoryId,
        description: categoryData.description,
      });

      this.selectBusinessAreaDefinition();
      this.selectAssessments(
        categoryData.inherentRiskProbabilityAssessment,
        categoryData.inherentRiskImpactAssessment,
        categoryData.controlEnvironmentAssessment
      );
      // Deliberately skip risk appetite selection
    });
  }

  /**
   * Add Risk Category with maximum length name (255 characters)
   */
  addRiskCategoryWithMaxLengthName(selectParentRiskCategory) {
    // Use DataHelper to generate exactly 255 character string
    const maxLengthName = DataHelper.generateRandomString(255);

    // Use FileHelper to read JSON file
    FileHelper.readJsonFile(filePath).then((data) => {
      this.clickAddRiskCategory();

      // Use FormHelper to fill form with max length name
      FormHelper.fillRiskCategoryForm({
        name: maxLengthName,
      });

      this.selectBusinessAreaDefinition();
      // this.selectRiskAppetite();
      if (selectParentRiskCategory) this.selectParentRiskCategory();
    });
    return maxLengthName;
  }

  /**
   * Add Risk Category with name exceeding max length
   */
  addRiskCategoryExceedingNameLength() {
    // Use DataHelper to generate string that exceeds 255 character limit
    const exceedingName = DataHelper.generateRandomString(255);

    // Use FileHelper to read JSON file
    FileHelper.readJsonFile(filePath).then((data) => {
      const categoryData = data.riskCatagory.add;
      FormHelper.fillRiskCategoryForm({
        riskCategoryId: categoryData.riskCategoryId,
        name: exceedingName,
        description: categoryData.description,
      });
      // Use ValidationHelper to test max length validation
      ValidationHelper.verifyMaxLengthValidation(
        locators.risk.administration.riskTaxonomies.categoryNameInput,
        exceedingName,
        255
      );
    });
    return exceedingName;
  }

  /**
   * Edit existing Risk Category to change its description
   */
  editRiskCategoryDescription(categoryName, newDescription) {
    // Find and click edit button for the category
    this.findAndEditCategory(categoryName);

    // Use FormHelper to update description
    FormHelper.fillRiskCategoryForm({
      description: newDescription,
    });

    this.saveRiskCategory();
  }

  /**
   * Edit Risk Category and remove Risk Appetite
   */
  editRiskCategoryRemoveRiskAppetite(categoryName) {
    this.findAndEditCategory(categoryName);

    // Clear risk appetite selection
    cy.get(
      locators.risk.administration.riskCategory.customerSpace.riskAppetite
    ).then(($select) => {
      if ($select.val()) {
        cy.get(
          locators.risk.administration.riskCategory.customerSpace.riskAppetite
        ).pqSelect("clear");
      }
    });
  }

  /**
   * Add Risk Category with special characters in name
   */
  addRiskCategoryWithSpecialCharacters() {
    // Use DataHelper to generate special character string
    const specialChar = "@#$%^&*()_+-={}[]|:;'<>?,.!";
    const specialCharName = DataHelper.generateRandomString(8, specialChar);

    // Use FileHelper to read JSON file
    FileHelper.readJsonFile(filePath).then((data) => {
      const categoryData = data.riskCatagory.add;
      this.clickAddRiskCategory();

      // Use FormHelper to fill form with special characters
      FormHelper.fillRiskCategoryForm({
        riskCategoryId: categoryData.riskCategoryId,
        name: specialCharName,
        description: categoryData.description,
      });

      this.selectBusinessAreaDefinition(categoryData.businessAreaDefinition);
      this.selectAssessments(
        categoryData.inherentRiskProbabilityAssessment,
        categoryData.inherentRiskImpactAssessment,
        categoryData.controlEnvironmentAssessment
      );
    });
    return specialCharName;
  }

  /**
   * Select Business Area Definition
   */
  selectBusinessAreaDefinition(multipleBA = false, section = "add") {
    return FileHelper.readJsonFile(filePath).then((data) => {
      const businessAreaLocator =
        section === "add"
          ? locators.risk.administration.riskCategory.customerSpace
              .formBusinessArea
          : locators.risk.administration.riskCategory.customerSpace
              .editBusinessArea;
      const businessArea = multipleBA
        ? data.riskCatagory[section].multipleBusinessAreaDefinition
        : data.riskCatagory[section].businessAreaDefinition;
      cy.get(businessAreaLocator).select(businessArea, { force: true });
    });
  }

  /**
   * Select Risk Appetite
   */
  selectRiskAppetite(riskAppetite) {
    cy.get(
      locators.risk.administration.riskCategory.customerSpace.riskAppetite
    ).select(riskAppetite, { force: true });
  }

  /**
   * Select Assessment fields (Probability, Impact, Control Environment)
   */
  selectAssessments(
    probabilityAssessment,
    impactAssessment,
    controlEnvironment,
    section = "add"
  ) {
    // Select Inherent Risk Probability Assessment
    if (probabilityAssessment) {
      const loc =
        section === "add"
          ? locators.risk.administration.riskCategory.customerSpace
              .formProbabilityAssessment
          : locators.risk.administration.riskCategory.customerSpace
              .editProbabilityAssessment;
      cy.get(loc)
        .scrollIntoView()
        .select(probabilityAssessment, { force: true });
    }
    // Select Inherent Risk Impact Assessment
    if (impactAssessment) {
      const loc =
        section === "add"
          ? locators.risk.administration.riskCategory.customerSpace
              .formImpactAssessment
          : locators.risk.administration.riskCategory.customerSpace
              .editImpactAssessment;
      cy.get(loc).scrollIntoView().select(impactAssessment, { force: true });
    }
    // Select Control Environment Assessment
    if (controlEnvironment) {
      const loc =
        section === "add"
          ? locators.risk.administration.riskCategory.customerSpace
              .formControlEnvironment
          : locators.risk.administration.riskCategory.customerSpace
              .editControlEnvironment;
      cy.get(loc).scrollIntoView().select(controlEnvironment, { force: true });
    }
  }

  /**
   * Select Parent Risk Category from tree
   */
  selectParentRiskCategory(nodeIndex = -1) {
    cy.get(locators.general.selectParentCategoryTree)
      .find(locators.risk.administration.riskCategory.checkCategory)
      .eq(nodeIndex)
      .click({ force: true });
  }

  /**
   * Cancel Risk Category form
   */
  cancelRiskCategory() {
    UIHelper.clickCancel();
  }

  /**
   * Find and edit a specific category
   */
  findAndEditCategory(categoryName) {
    cy.get(
      locators.risk.administration.riskCategory.customerSpace.FormParentElement
    ).within(() => {
      cy.contains(categoryName)
        .parents(".ag-row")
        .within(() => {
          cy.get(locators.general.gridEditIcon).click();
        });
    });
  }

  scrollingToBottomOfGrid() {
    cy.wait(2000);

    // Use your existing locator structure
    cy.get(
      locators.risk.administration.riskCategory.customerSpace.FormParentElement
    )
      .should("exist")
      .within(() => {
        // Use the scrollParentElement locator you already have defined
        cy.get(".ag-body-viewport") // This matches your viewPort locator
          .should("exist")
          .then(($viewport) => {
            if ($viewport.length > 0) {
              cy.wrap($viewport).scrollTo("bottom", { duration: 400 });
              cy.log("✅ Scrolled to bottom successfully");
            } else {
              cy.log("❌ .ag-body-viewport not found within grid");
            }
          });
      });
  }

  /**
   * Verify Risk Category exists in MyTaxonomy Grid with auto-reload until found
   * @param {string} categoryName - Name of the category to verify
   * @param {number} maxRetries - Maximum number of reload attempts (default: 5)
   * @param {number} waitTime - Wait time between retries in milliseconds (default: 2000)
   */
  verifyRiskCategoryInGrid(categoryName, maxRetries = 15, waitTime = 2000) {
    let retryCount = 0;

    const checkCategoryExists = () => {
      // Try multiple scroll strategies for AG-Grid
      this.scrollingToBottomOfGrid();

      // Wait for scrolling to complete
      cy.wait(1000);

      cy.get("body").then(($body) => {
        // Check if the grid contains the category name
        const gridExists =
          $body.find(
            locators.risk.administration.riskCategory.customerSpace
              .FormParentElement
          ).length > 0;
        const categoryExists =
          gridExists &&
          $body
            .find(
              locators.risk.administration.riskCategory.customerSpace
                .FormParentElement
            )
            .text()
            .includes(categoryName);

        if (categoryExists) {
          // Category found, verify it's visible
          cy.get(
            locators.risk.administration.riskCategory.customerSpace
              .FormParentElement
          )
            .contains(categoryName)
            .should("be.visible");
        } else if (retryCount < maxRetries) {
          // Category not found and we haven't exceeded max retries
          retryCount++;

          // Reload the page
          cy.reload(true);

          // Wait for the grid to load
          cy.get(
            locators.risk.administration.riskCategory.customerSpace
              .FormParentElement,
            { timeout: 15000 }
          ).should("be.visible");
          cy.wait(waitTime);

          // Recursively check again
          checkCategoryExists();
        } else {
          // Max retries exceeded, fail the test
          throw new Error(
            `Category "${categoryName}" not found in grid after ${maxRetries} reload attempts`
          );
        }
      });
    };

    checkCategoryExists();
  }

  /**
   * Verify Risk Category is visible in list view
   */
  verifyRiskCategoryInListView(categoryName) {
    cy.get(
      locators.risk.administration.riskCategory.customerSpace.FormParentElement
    ).within(() => {
      cy.contains(categoryName).should("be.visible");
    });
  }

  /**
   * Verify tree structure in selection panel
   */
  verifyTreeStructure() {
    cy.get(
      locators.risk.administration.riskCategory.customerSpace.parentCategoryTree
    ).within(() => {
      cy.get(locators.general.aciTreeUI).should("be.visible");
      cy.get(locators.general.aciTreeLi).should("have.length.greaterThan", 0);
    });
  }

  /**
   * Verify Cancel button discards entered data
   */
  verifyCancelDiscardsData() {
    this.clickAddRiskCategory();
    return FileHelper.readJsonFile(filePath).then((data) => {
      // Enter some data using FormHelper
      FormHelper.fillRiskCategoryForm({
        name: data.riskCatagory.add.name,
        description: data.riskCatagory.add.description,
      });

      // Cancel the form
      this.cancelRiskCategory();

      // Reopen form and verify fields are empty
      this.clickAddRiskCategory();
      this.verifyFormCleanState();
    });
  }

  /**
   * Verify error messages
   */
  verifyErrorMessage(expectedMessage) {
    ValidationHelper.verifyValidationError(expectedMessage);
  }

  /**
   * Verify success message
   */
  verifySuccessMessage(expectedMessage) {
    ValidationHelper.verifySuccessMessage(expectedMessage);
  }

  /**
   * Write risk category name to file for use in risk definition
   */
  writeRiskCategoryNameInRiskDefinition(categoryName) {
    // Use FileHelper to update nested property instead of manual file operations
    return FileHelper.updateNestedProperty(
      filePath,
      "riskDefinition",
      "add",
      "riskCategory",
      categoryName
    );
  }
  /**
   * Verify form validation highlighting
   */
  verifyFieldValidationHighlight(fieldSelector) {
    ValidationHelper.verifyFieldError(fieldSelector);
  }

  /**
   * Verify form is in clean state
   */
  verifyFormCleanState() {
    UIHelper.verifyFieldValue("#field-name", "");
    UIHelper.verifyFieldValue("#description", "");
    UIHelper.verifyFieldValue("#riskId", "");
  }

  /**
   * Verify dropdown options are populated
   */
  verifyDropdownOptions(dropdownSelector, expectedCount = 1) {
    cy.get(dropdownSelector)
      .find("option")
      .should("have.length.greaterThan", expectedCount);
  }

  /**
   * Verify category appears at correct tree level
   */
  verifyCategoryAtTreeLevel(categoryName, expectedLevel) {
    cy.get(
      locators.risk.administration.riskCategory.customerSpace.FormParentElement
    ).within(() => {
      cy.contains(categoryName)
        .parents(".ag-row")
        .should("have.class", `ag-row-level-${expectedLevel}`);
    });
  }

  /**
   * Verify form field character limits
   */
  verifyFieldCharacterLimit(fieldSelector, maxLength) {
    // Use DataHelper to generate string that exceeds limit for testing
    const overLengthString = DataHelper.generateOverLengthString(maxLength);
    ValidationHelper.verifyMaxLengthValidation(
      fieldSelector,
      overLengthString,
      maxLength
    );
  }

  /**
   * Verify category status indicator
   */
  verifyCategoryStatus(categoryName, expectedStatus) {
    cy.get(
      locators.risk.administration.riskCategory.customerSpace.FormParentElement
    ).within(() => {
      cy.contains(categoryName)
        .parents(".ag-row")
        .within(() => {
          cy.get(
            locators.risk.administration.riskCategory.customerSpace
              .riskCatStatus
          ).should("contain.text", expectedStatus);
        });
    });
  }

  /**
   * Update specific category data using FileHelper
   * @param {string} sectionName - Section name (add/update)
   * @param {string} newName - New name for the category
   */
  updateCategoryDataInFile(sectionName, newName) {
    // Use FileHelper's updateSectionData method for clean file updates
    return FileHelper.updateSectionData(
      filePath,
      sectionName,
      newName,
      "riskCatagory"
    );
  }

  /**
   * Get category data from file using FileHelper
   * @param {string} sectionName - Section name to retrieve
   * @returns {Cypress.Chainable} - Category data
   */
  getCategoryDataFromFile(sectionName = "add") {
    // Use FileHelper to get section data instead of manual file reading
    return FileHelper.getSectionData(filePath, sectionName, "riskCatagory");
  }

  /**
   * Update multiple category properties at once using FileHelper
   * @param {string} sectionName - Section name to update
   * @param {Object} properties - Properties to update
   */
  updateMultipleCategoryProperties(sectionName, properties) {
    // Use FileHelper's updateSectionProperties for bulk updates
    return FileHelper.updateSectionProperties(
      filePath,
      "riskCatagory",
      sectionName,
      properties
    );
  }

  /**
   * Create category with data from file using FileHelper methods
   * @param {string} sectionName - Section to read from
   */
  createCategoryFromFileData(sectionName = "add") {
    // Use FileHelper to get section data
    return this.getCategoryDataFromFile(sectionName).then((categoryData) => {
      this.clickAddRiskCategory();

      // Use FormHelper with the data from FileHelper
      FormHelper.fillRiskCategoryForm({
        riskCategoryId: categoryData.riskCategoryId,
        name: categoryData.name,
        description: categoryData.description,
      });

      this.selectParentRiskCategory();
      this.saveRiskCategory();

      return categoryData;
    });
  }

  clickEditIconForCategory() {
    cy.get(locators.general.lastRowGridEditIcon)
      // .scrollIntoView()
      .last()
      .as("editIcon");
    cy.get("@editIcon").should("be.visible").click();
    cy.get(
      locators.risk.administration.riskCategory.customerSpace.editScreen
    ).should("be.visible");
  }

  /**
   * Verify tree structure in selection panel
   */
  verifyTreeStructureInSelectionPanel(catagoryName) {
    TreeHelper.verifyNodeExists(catagoryName);
  }

  /**
   * Verify that grid Data is loaded and visible
   */
  verifyGridContainsMinimumRows(minCount = 1) {
    cy.get(locators.risk.administration.riskCategory.customerSpace.gridCount)
      .should("have.length.greaterThan", minCount)
      .and("be.visible");
  }

  /**
   * Verify that the same category name exists at different hierarchy levels - Pure Cypress approach
   * @param {string} categoryName - Name of the category to verify
   * @param {number} minOccurrences - Minimum expected occurrences (default: 2)
   */
  verifyDifferentParentSelectionWorks(
    categoryName,
    maxRetries = 15,
    waitTime = 2000
  ) {
    let retryCount = 0;

    const checkCategoryExists = () => {
      // Ensure grid is loaded
      cy.get(
        locators.risk.administration.riskCategory.customerSpace
          .FormParentElement,
        { timeout: 15000 }
      ).should("be.visible");

      cy.get("body").then(($body) => {
        // Check if the category exists in the grid
        const gridExists =
          $body.find(
            locators.risk.administration.riskCategory.customerSpace
              .FormParentElement
          ).length > 0;
        const categoryExists =
          gridExists &&
          $body
            .find(
              locators.risk.administration.riskCategory.customerSpace
                .FormParentElement
            )
            .text()
            .includes(categoryName);

        if (categoryExists) {
          // Category found, verify it has at least 1 occurrence
          cy.get(
            locators.risk.administration.riskCategory.customerSpace
              .FormParentElement
          )
            .find(`[col-id='ag-Grid-AutoColumn']:contains('${categoryName}')`)
            .should("have.length", 1);
        } else if (retryCount < maxRetries) {
          // Category not found, reload and retry
          retryCount++;
          cy.reload(true);
          cy.get("#riskTaxonomiesMainGrid", { timeout: 15000 }).should(
            "be.visible"
          );
          cy.wait(waitTime);

          checkCategoryExists();
        } else {
          // Max retries exceeded
          throw new Error(
            `Category "${categoryName}" not found in grid after ${maxRetries} reload attempts`
          );
        }
      });
    };

    checkCategoryExists();
  }

  /**
   * Verify assessment fields are visible
   */
  verifyAssessmentFieldsVisibility(expectedVisibility) {
    if (expectedVisibility.probability) {
      UIHelper.verifyElementVisible("#s2id_risk-cat-rpaId");
    }
    if (expectedVisibility.impact) {
      UIHelper.verifyElementVisible("#s2id_risk-cat-riaId");
    }
    if (expectedVisibility.controlEnvironment) {
      UIHelper.verifyElementVisible("#s2id_risk-cat-controlSurveyId");
    }
  }

  /**
   * removing risk appetite from existing category
   */
  removeRiskAppetite() {
    // Handle multi-select dropdown clearing
    cy.get(
      locators.risk.administration.riskCategory.customerSpace.riskAppetite
    ).then(($select) => {
      // Clear all selected options for multi-select
      $select.val([]); // Set to empty array for multi-select

      // Remove selected attribute from all options
      $select.find("option").removeAttr("selected");

      // Trigger change event
      $select.trigger("change");
    });
  }
}

/**
 * RiskDefinition class encapsulates methods to manage risk definitions in the application
 */
class RiskDefinition {
  riskCategory = new RiskCategory();
  /**
   * Click Add Risk Definition button
   */
  clickAddRiskDefinition() {
    UIHelper.clickButtonByText(
      'a[data-target="#addRiskSlider"]',
      "Add Risk Definition"
    );
  }

  expandRiskCategory() {
    cy.wait(2000); // Wait for stabilization
    cy.get(locators.general.expandIcon)
      .should("be.visible")
      .click({ delay: 300, multiple: true, force: true });
  }

  /**
   * Fill Risk Definition with valid data including mandatory fields
   * @param {string} sectionName - Section name in test data (add/update)
   */
  addRiskDefinitionValidData(sectionName = "add") {
    return FileHelper.readJsonFile(filePath).then((data) => {
      const definitionData = data.riskDefinition[sectionName];

      // Use FormHelper to fill form data
      FormHelper.fillRiskDefinitionCSForm({
        riskDefinitionId: definitionData.riskDefinitionId,
        name: definitionData.name,
        description: definitionData.description,
        cfrGuidance: definitionData.cfrGuidance,
        status: definitionData.status,
        updated: sectionName === "update",
      });

      // Select Business Area Definition
      if (definitionData.businessAreaDefinition) {
        this.riskCategory.selectBusinessAreaDefinition(
          definitionData.businessAreaDefinition
        );
      }

      // Select Assessment fields if available
      this.riskCategory.selectAssessments(
        definitionData.inherentRiskProbabilityAssessment,
        definitionData.inherentRiskImpactAssessment,
        definitionData.controlEnvironmentAssessment
      );

      this.selectRiskCategory(definitionData.riskCategory);
    });
  }

  /**
   * Add Risk Definition without filling the Name field
   */
  addRiskDefinitionWithoutName() {
    return FileHelper.readJsonFile(filePath).then((data) => {
      const definitionData = data.riskDefinition.add;

      // Fill all fields except name using FormHelper
      FormHelper.fillRiskDefinitionCSForm({
        riskDefinitionId: definitionData.riskDefinitionId,
        description: definitionData.description,
        cfrGuidance: definitionData.cfrGuidance,
      });

      this.selectBusinessAreaDefinition(definitionData.businessAreaDefinition);
      this.selectAssessments(
        definitionData.inherentRiskProbabilityAssessment,
        definitionData.inherentRiskImpactAssessment,
        definitionData.controlEnvironmentAssessment
      );
    });
  }

  /**
   * Add Risk Definition without selecting Risk Category
   */
  addRiskDefinitionWithoutRiskCategory() {
    return FileHelper.readJsonFile(filePath).then((data) => {
      const definitionData = data.riskDefinition.add;

      FormHelper.fillRiskDefinitionCSForm({
        riskDefinitionId: definitionData.riskDefinitionId,
        name: definitionData.name,
        description: definitionData.description,
        cfrGuidance: definitionData.cfrGuidance,
      });

      // this.selectBusinessAreaDefinition(definitionData.businessAreaDefinition);
      this.riskCategory.selectBusinessAreaDefinition(
        definitionData.businessAreaDefinition
      );
      this.riskCategory.selectAssessments(
        definitionData.inherentRiskProbabilityAssessment,
        definitionData.inherentRiskImpactAssessment,
        definitionData.controlEnvironmentAssessment
      );
      // Deliberately skip risk category selection
    });
  }

  /**
   * Add Risk Definition without selecting Business Area
   */
  addRiskDefinitionWithoutBusinessArea() {
    return FileHelper.readJsonFile(filePath).then((data) => {
      const definitionData = data.riskDefinition.add;

      FormHelper.fillRiskDefinitionCSForm({
        riskDefinitionId: definitionData.riskDefinitionId,
        name: definitionData.name,
        description: definitionData.description,
        cfrGuidance: definitionData.cfrGuidance,
      });

      // Deliberately skip business area selection
      this.riskCategory.selectAssessments(
        definitionData.inherentRiskProbabilityAssessment,
        definitionData.inherentRiskImpactAssessment,
        definitionData.controlEnvironmentAssessment
      );
      this.selectRiskCategory(definitionData.riskCategory);
    });
  }

  /**
   * Add Risk Definition with maximum length description (5000 characters)
   */
  addRiskDefinitionWithMaxLengthDescription() {
    const maxLengthDescription = DataHelper.generateRandomString(5000);

    return FileHelper.readJsonFile(filePath).then((data) => {
      const definitionData = data.riskDefinition.add;

      FormHelper.fillRiskDefinitionCSForm({
        riskDefinitionId: definitionData.riskDefinitionId,
        name: definitionData.name,
        description: maxLengthDescription,
        cfrGuidance: definitionData.cfrGuidance,
      });

      this.riskCategory.selectBusinessAreaDefinition(
        definitionData.businessAreaDefinition
      );
      this.riskCategory.selectAssessments(
        definitionData.inherentRiskProbabilityAssessment,
        definitionData.inherentRiskImpactAssessment,
        definitionData.controlEnvironmentAssessment
      );
      this.selectRiskCategory(definitionData.riskCategory);

    // Use cy.then() to properly chain and return the value
    return cy.then(() => {
      return definitionData.name;
    });
    });
  }

  /**
   * Add Risk Definition with special characters in name
   */
  addRiskDefinitionWithSpecialCharacters() {
  const specialChar = "@#$%^&*()_+-={}[]|:;'<>?,.!";
  const specialCharName = DataHelper.generateRandomString(8, specialChar);

  return FileHelper.readJsonFile(filePath).then((data) => {
    const definitionData = data.riskDefinition.add;

    FormHelper.fillRiskDefinitionCSForm({
      riskDefinitionId: definitionData.riskDefinitionId,
      name: specialCharName,
      description: definitionData.description,
      cfrGuidance: definitionData.cfrGuidance,
    });

    this.riskCategory.selectBusinessAreaDefinition(
      definitionData.businessAreaDefinition
    );
    this.riskCategory.selectAssessments(
      definitionData.inherentRiskProbabilityAssessment,
      definitionData.inherentRiskImpactAssessment,
      definitionData.controlEnvironmentAssessment
    );
    this.selectRiskCategory(definitionData.riskCategory);

    // Use cy.then() to properly chain and return the value
    return cy.then(() => {
      return specialCharName;
    });
  });
}

  /**
   * Leave all fields blank and try to save
   */
  addRiskDefinitionWithAllFieldsBlank() {
    // Don't fill any fields, just try to save
    return Promise.resolve();
  }

  /**
   * Edit existing Risk Definition
   */
  editRiskDefinitionSuccess(newName, newDescription) {
    return FileHelper.readJsonFile(filePath).then((data) => {
      // Update with new values
      FormHelper.fillRiskDefinitionCSForm({
        name: newName || data.riskDefinition.update.name,
        description: newDescription || data.riskDefinition.update.description,
      }, "update");
      this.selectRiskCategory(data.riskDefinition.add.riskCategory);
    });
  }

  /**
   * Select Business Area Definition for Risk Definition
   */
  selectBusinessAreaDefinition(businessArea) {
    if (businessArea) {
      cy.get("#s2id_businessAreasDefinitionsSelector").click();
      cy.get(".select2-results").contains(businessArea).click();
    }
  }

  /**
   * Select Assessment fields (Probability, Impact, Control Environment)
   */
  selectAssessments(
    probabilityAssessment,
    impactAssessment,
    controlEnvironment
  ) {
    // Select Inherent Risk Probability Assessment
    if (probabilityAssessment) {
      cy.get("#s2id_rpaId").click();
      cy.get(".select2-results").contains(probabilityAssessment).click();
    }

    // Select Inherent Risk Impact Assessment
    if (impactAssessment) {
      cy.get("#s2id_riaId").click();
      cy.get(".select2-results").contains(impactAssessment).click();
    }

    // Select Control Environment Assessment
    if (controlEnvironment) {
      cy.get("#s2id_controlSurveyId").click();
      cy.get(".select2-results").contains(controlEnvironment).click();
    }
  }

  /**
   * Select Risk Category from tree
   */
  selectRiskCategory(categoryName) {
    if (categoryName) {
      cy.get("#riskRegisterItemDiv")
        .contains(".aciTreeText", categoryName)
        .closest(".aciTreeLi")
        .find(".aciTreeCheck")
        .click({ force: true });
    }
  }

  /**
   * Save Risk Definition form
   */
  saveRiskDefinition(selector = "#btn_save", elementPosition = "first") {
    UIHelper.clickSaveButton(selector, elementPosition);
    cy.wait(3000) //added wait for syncing the value in backend
  }

  /**
   * Cancel Risk Definition form
   */
  cancelRiskDefinition() {
    UIHelper.clickCancel("#cancelDefitionBtn");
  }

  /**
   * Verify Assessment fields are visible
   */
  verifyAssessmentFieldsVisibility(expectedVisibility) {
    if (expectedVisibility.probability) {
      UIHelper.verifyElementVisible("#s2id_rpaId");
    }
    if (expectedVisibility.impact) {
      UIHelper.verifyElementVisible("#s2id_riaId");
    }
    if (expectedVisibility.controlEnvironment) {
      UIHelper.verifyElementVisible("#s2id_controlSurveyId");
    }
  }

  /**
   * Verify tree structure for risk category selection
   */
  verifyTreeStructureInSelectionPanel(categoryName) {
    cy.get("#addRiskSlider")
    .scrollTo("bottom")
    TreeHelper.verifyNodeExists(categoryName);
  }

  /**
   * Verify Risk Definition exists in grid
   */
  verifyRiskDefinitionInGrid(definitionName, maxRetries = 10, waitTime = 2000) {
    let retryCount = 0;

    const checkDefinitionExists = () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(
            `[data-cy="risk-definition-grid"]:contains("${definitionName}")`
          ).length > 0
        ) {
          cy.get(`[data-cy="risk-definition-grid"]`).should(
            "contain.text",
            definitionName
          );
        } else if (retryCount < maxRetries) {
          retryCount++;
          cy.reload();
          cy.wait(waitTime);
          checkDefinitionExists();
        } else {
          throw new Error(
            `Risk Definition "${definitionName}" not found in grid after ${maxRetries} retries`
          );
        }
      });
    };

    checkDefinitionExists();
  }

  /**
   * Get definition data from file using FileHelper
   */
  getDefinitionDataFromFile(filePath, sectionName = "add") {
    return FileHelper.getSectionData(filePath, sectionName, "riskDefinition");
  }

  /**
   * Generate and write risk definition data to file
   */
  generateAndWriteRiskDefinitionDataInFile(filePath, section = "add") {
    return FileHelper.readJsonFile(filePath).then((fileData) => {
      cy.createRandomString(6).then((randomString) => {
        const baseName = fileData.riskDefinition[section].baseName;
        const newName = baseName + randomString;

        fileData.riskDefinition[section].name = newName;
        fileData.riskDefinition[section].riskDefinitionId = newName;

        return FileHelper.writeJsonFile(filePath, fileData);
      });
    });
  }

  /**
   * Search for a risk taxonomy in the grid with hover, menu click, and expand all
   * @param {string} taxonomyName - Name of the taxonomy to search for
   */
  searchRiskTaxonomy(taxonomyName) {
    // Simple search - try search fields
    cy.get('body').then($body => {
      if ($body.find(locators.general.searchField).length > 0) {
        cy.get(locators.general.searchField)
          .should('be.visible')
          .clear({force: true})
          .type(taxonomyName, {force: true});
      }
    });
 
    // Expand grid and verify result
    cy.get(locators.risk.riskRegister.riskColumnHeader)
      .first()
      .should('be.visible')
      .trigger('mouseover')
      .find(locators.risk.riskRegister.columnMenuIcon)
      .click();
 
    cy.get(locators.risk.riskRegister.expandAllOption)
      .should('be.visible')
      .click();
   
    cy.get (locators.Administration.RiskTaxonomyLibraries.grid.mainGrid).contains(taxonomyName)
      .should('be.visible');
  }
}

/**
 * @class RiskTaxonomyImportOperations
 * @description POM class for Risk Taxonomy Import operations in Customer Space
 */
class RiskTaxonomyImportOperations {
  /**
   * Open Import Modal and verify it's displayed
   * @param {string} importModalSelector - CSS selector for the import modal
   * @param {string} importBtnElipses - CSS selector for import button
   * @param {string} modalText - Expected modal text
   */
  openImportModal(
    importModalSelector = loc.importDialog,
    importBtnElipses = loc.importBtn,
    modalText = null
  ) {
    cy.readFile(data).then((configData) => {
      const defaultModalText = configData.modalTexts.importRiskTaxonomiesFromExcel;
      ImportHelper.openImportModal(
        importModalSelector,
        importBtnElipses,
        modalText || defaultModalText
      );
    });
  }

  /**
   * Download sample file and verify download
   */
  downloadSampleFile() {
    ImportHelper.downloadSampleFile(sampleFileName);
  }

  /**
   * Clear cache before file operations to ensure fresh file uploads
   * This is especially important in CLI mode to prevent cached file uploads
   */
  clearFileUploadCache() {
    ImportHelper.clearCacheBeforeUpload();
  }

  /**
   * Import valid Excel file with taxonomy data
   * @param {string} filePath - Path to valid Excel file
   */
  importValidFile(filePath = "cypress/downloads/importFile_XLSX.xlsx") {
    // Ensure file exists before attempting upload (critical for CLI mode)
    cy.readFile(filePath, { timeout: 10000 }).should('exist').then(() => {
      // Add small delay to ensure file system operations are complete
      cy.wait(1000);
      ImportHelper.performValidImport(filePath);
    });
  }

  /**
   * Import invalid file format
   * @param {string} filePath - Path to invalid format file
   */
  importInvalidFileFormat(filePath = "cypress/attachment/testing.txt") {
    ImportHelper.performInvalidImport(filePath, loc.submitImportBtn);
  }

  /**
   * Upload file with missing required columns
   * @param {string} filePath - Path to file with missing columns
   */
  uploadFileWithMissingColumns(filePath = "cypress/attachment/missingColumns.xlsx") {
    ImportHelper.uploadFile(filePath);
    ImportHelper.clickImportButton();
    this.verifyModalValidationError();
  }

  /**
   * Upload Excel file with empty rows
   * @param {string} filePath - Path to file with empty rows
   */
  uploadFileWithEmptyRows(filePath = "cypress/attachment/emptyRows.xlsx") {
    ImportHelper.uploadFile(filePath);
    ImportHelper.clickImportButton();
    ImportHelper.verifyValidationError();
  }

  /**
   * Upload Excel with duplicate risk categories
   * @param {string} filePath - Path to file with duplicates
   */
  uploadFileWithDuplicateCategories(filePath = "cypress/attachment/duplicateCategories.xlsx") {
    ImportHelper.uploadFile(filePath);
    ImportHelper.clickImportButton();
    ImportHelper.verifyValidationError();
  }

  /**
   * Upload Excel with invalid characters
   * @param {string} filePath - Path to file with invalid characters
   */
  uploadFileWithInvalidCharacters(filePath = "cypress/attachment/invalidCharacters.xlsx") {
    ImportHelper.uploadFile(filePath);
    ImportHelper.clickImportButton();
    ImportHelper.verifyValidationError();
  }

  /**
   * Upload large Excel file
   * @param {string} filePath - Path to large Excel file
   */
  uploadLargeFile(filePath = "cypress/attachment/largeRiskTaxonomy.xlsx") {
    ImportHelper.uploadFile(filePath);
    ImportHelper.clickImportButton();
    ImportHelper.monitorJobStatus("COMPLETED", 120, 3000); // Extended timeout for large files
  }

  /**
   * Upload file with HTML/script tags
   * @param {string} filePath - Path to file with HTML tags
   */
  uploadFileWithHtmlTags(filePath = "cypress/attachment/htmlTagsInDescription.xlsx") {
    ImportHelper.uploadFile(filePath);
    ImportHelper.clickImportButton();
    ImportHelper.verifyValidationError();
  }

  /**
   * Upload file with mixed valid and invalid records
   * @param {string} filePath - Path to mixed records file
   */
  uploadFileWithMixedRecords(filePath = "cypress/attachment/mixedValidInvalid.xlsx") {
    ImportHelper.uploadFile(filePath);
    ImportHelper.clickImportButton();
    ImportHelper.verifyValidationError();
  }

  /**
   * Cancel import operation
   */
  cancelImport() {
    cy.get(loc.cancelImportModalBtn)
      .should("be.visible")
      .contains("Cancel")
      .dblclick({ delay: 1000 });
    cy.wait(10000); // Used static wait — not ideal, but needed as the modal close can’t be reliably detected otherwise.
    cy.get(importDialog).should('not.be.visible');
  }

  /**
   * Test canceling file selection dialog
   */
  testCancelFileDialog() {
    cy.get(loc.fileInput).eq(0).click({force: true});
    // Simulate canceling file dialog - modal should remain open
    cy.get(loc.importDialog).should("be.visible");
  }

  /**
   * Test importing while system is busy
   * @param {string} filePath - Path to valid file
   */
  testBusySystemImport(filePath = "cypress/attachment/ImportTemplate_RiskandProcessTaxonomy_Customer.xlsx") {
    // Start first import
    ImportHelper.uploadFile(filePath);
    this.clickImportButton();
    // Wait for job queue to show processing status before proceeding
    cy.get(loc.jobQueModal).should('be.visible');
    cy.get(loc.jobStatus).should('contain', 'PROCESSING', { timeout: 10000 });
    cy.get(loc.closeJobque).should("be.visible").click();
    
    // Immediately try second import
    this.openImportModal();
    ImportHelper.uploadFile(filePath);
    this.clickImportButton();
    this.verifyModalValidationError();
  }

  /**
   * Create clean base template for import operations
   */
  createCleanImportTemplate() {
    const cleanTemplate = {
      "Instructions": [
        {
          "Business Area Import Template": "Use this template to import Business Areas. Each column header describes the required data."
        },
        {
          "Note": "Fields marked with * are mandatory."
        }
      ],
      "Risk Category": [
        {
          "Id": "",
          "Name*": "",
          "Description": "",
          "Parent Risk Category Row No": "",
          "Parent Risk Category Id": "",
          "Risk Category ID": "",
          "Inherent Risk Probability Assessment ID": "",
          "Inherent Risk Impact Assessment ID": "",
          "Control Assessment ID": "",
          "Business Area Definition ID(s)": ""
        }
      ],
      "Risk Definition": [
        {
          "Id": "",
          "Name*": "",
          "Description": "",
          "Delete": "",
          "Status*": "",
          "Parent Risk Category Row No*": "",
          "Parent Risk Category Id": "",
          "Parent Process Category Row No *": "",
          "Parent Process Category Id": "",
          "Risk Definition Id": "",
          "Library Risk Definition Id": "",
          "Content Library": "",
          "Inherent Risk Probability Assessment ID": "",
          "Inherent Risk Impact Assessment ID": "",
          "Control Assessment ID": "",
          "Business Area Definitions ID(s)": ""
        }
      ],
      "Control Assessment Template": [
        {
          "ID": "",
          "Name": "",
          "Type": "",
          "Content Library": ""
        }
      ],
      "Risk Imp - Prob Assessment": [
        {
          "ID": "",
          "Name": "",
          "Type": "",
          "Content Library": ""
        }
      ],
      "Business Area Definitions": [
        {
          "ID": "",
          "Name": "",
          "Description": "",
          "Type": "",
          "Business Area Category 1": "",
          "Business Area Category 2": "",
          "Content Library": ""
        }
      ]
    };
    
    return cy.writeFile(qbImport, cleanTemplate);
  }

  /**
   * Complete import workflow for risk taxonomy with valid data
   * @description Creates a comprehensive import file with valid Risk Categories and Risk Definitions
   * including proper references and relationships between entities. This is the main method
   * for creating successful import test scenarios.
   * @returns {Cypress.Chainable} Promise that resolves when import file is ready
   * @example
   * // Usage in test
   * importOperations.updateRiskTaxonomyImportJSON().then(() => {
   *   importOperations.uploadValidConvertedFile();
   *   importOperations.monitorJobQueue("COMPLETED");
   * });
   */
  updateRiskTaxonomyImportJSON() {
    const uniqueImportName = DateHelper.generateUniqueNameWithTimestamp(
      "Import Risk Tax "
    );

    // Start with clean template and wait for it to complete
    return this.createCleanImportTemplate().then(() => {
      // Read the clean template and update with valid data
      return cy.readFile(qbImport, { timeout: 15000 }).then((jsonData) => {
        // Generate unique timestamps for Risk Category and Risk Definitions
        const uniqueRiskDef1 = DateHelper.generateUniqueNameWithTimestamp("Risk Definition 1 ");
        const uniqueRiskDef2 = DateHelper.generateUniqueNameWithTimestamp("Risk Definition 2 ");
        
        // Update Risk Category with valid data
        jsonData["Risk Category"][0]["Name*"] = uniqueImportName;
        jsonData["Risk Category"][0]["Description"] = `Description for ${uniqueImportName}`;
        
        // Add second Risk Category for Risk Definition reference
        jsonData["Risk Category"].push({
          "Id": "",
          "Name*": uniqueImportName + " Category 2",
          "Description": `Description for ${uniqueImportName} Category 2`,
          "Parent Risk Category Row No": "",
          "Parent Risk Category Id": "",
          "Risk Category ID": "",
          "Inherent Risk Probability Assessment ID": "",
          "Inherent Risk Impact Assessment ID": "",
          "Control Assessment ID": "",
          "Business Area Definition ID(s)": ""
        });
        
        // Update Risk Definition entries with proper references to Risk Category rows
        jsonData["Risk Definition"][0]["Name*"] = uniqueRiskDef1;
        jsonData["Risk Definition"][0]["Description"] = `Description for ${uniqueRiskDef1}`;
        jsonData["Risk Definition"][0]["Status*"] = "Active";
        jsonData["Risk Definition"][0]["Parent Risk Category Row No*"] = "2";
        
        // Add second Risk Definition linking to second Risk Category
        jsonData["Risk Definition"].push({
          "Id": "",
          "Name*": uniqueRiskDef2,
          "Description": `Description for ${uniqueRiskDef2}`,
          "Delete": "",
          "Status*": "Active",
          "Parent Risk Category Row No*": "3",
          "Parent Risk Category Id": "",
          "Parent Process Category Row No *": "",
          "Parent Process Category Id": "",
          "Risk Definition Id": "",
          "Library Risk Definition Id": "",
          "Content Library": "",
          "Inherent Risk Probability Assessment ID": "",
          "Inherent Risk Impact Assessment ID": "",
          "Control Assessment ID": "",
          "Business Area Definitions ID(s)": ""
        });
        
        // Write back the updated JSON with both sections updated
        return cy.writeFile(qbImport, jsonData).then(() => {
          
          // Verify the file was written correctly
          return cy.readFile(qbImport, { timeout: 15000 }).then((verifyData) => {
            if (verifyData["Risk Definition"][0]["Name*"] === uniqueRiskDef1) {
              
              // Now convert to XLSX and return the promise
              return cy.convertXlsxtoJson(jsonData, false, true).then(() => {
                cy.log(`Converted to XLSX with name: ${uniqueImportName}`);
                // Verify the Excel file was created successfully
                return cy.readFile('cypress/downloads/importFile_XLSX.xlsx', { timeout: 10000 }).should('exist');
              });
            } else {
              throw new Error("JSON file write verification failed");
            }
          });
        });
      });
    });
  }

  /**
   * Create import file with missing required columns for validation testing
   * @description Generates a test file missing the mandatory 'Name*' field in Risk Category
   * to verify system validation of required columns during import process
   * @returns {Cypress.Chainable} Promise that resolves when file creation is complete
   * @example
   * // Usage in test
   * importOperations.createImportFileWithMissingColumns().then(() => {
   *   // File is ready for upload
   * });
   */
  createImportFileWithMissingColumns() {
    // Start with clean template, then remove required columns
    return this.createCleanImportTemplate().then(() => {
      return cy.readFile(qbImport, { timeout: 15000 }).then((jsonData) => {
        // Generate unique Risk Definition name with timestamp
        const uniqueRiskDef = DateHelper.generateUniqueNameWithTimestamp("Risk Definition ");
        
        // Add Risk Definition data with proper row reference
        jsonData["Risk Definition"][0]["Name*"] = uniqueRiskDef;
        jsonData["Risk Definition"][0]["Description"] = `Description for ${uniqueRiskDef}`;
        jsonData["Risk Definition"][0]["Status*"] = "Active";
        jsonData["Risk Definition"][0]["Parent Risk Category Row No*"] = "2"; // Row 2 reference
        
        // Fill in all Risk Category details except Name* to test missing column validation
        jsonData["Risk Category"][0]["Description"] = "Risk Category with missing Name field";
        jsonData["Risk Category"][0]["Risk Category ID"] = "RC_001";
        
        // Remove the Name* field from Risk Category to create missing column scenario
        if (jsonData["Risk Category"][0]["Name*"]) {
          delete jsonData["Risk Category"][0]["Name*"];
        }
        
        return cy.writeFile(qbImport, jsonData).then(() => {
          return cy.convertXlsxtoJson(jsonData, false, true);
        });
      });
    });
  }

  /**
   * Create import file containing empty rows for validation testing
   * @description Generates a test file with empty data rows to verify system handling
   * of blank entries during the import process
   * @returns {Cypress.Chainable} Promise that resolves when file creation is complete
   * @example
   * // Usage in test
   * importOperations.createImportFileWithEmptyRows().then(() => {
   *   // File with empty rows is ready for upload
   * });
   */
  createImportFileWithEmptyRows() {
    // Start with clean template, then add empty rows
    return this.createCleanImportTemplate().then(() => {
      return cy.readFile(qbImport, { timeout: 15000 }).then((jsonData) => {
        // Add empty rows to the data structure
        jsonData["Risk Category"].push({
          "Id": "",
          "Name*": "",
          "Description": "",
          "Parent Risk Category Row No": "",
          "Parent Risk Category Id": "",
          "Risk Category ID": "",
          "Inherent Risk Probability Assessment ID": "",
          "Inherent Risk Impact Assessment ID": "",
          "Control Assessment ID": "",
          "Business Area Definition ID(s)": ""
        });
        
        return cy.writeFile(qbImport, jsonData).then(() => {
          return cy.convertXlsxtoJson(jsonData, false, true);
        });
      });
    });
  }

  /**
   * Create import file with duplicate risk category names for validation testing
   * @description Generates a test file containing duplicate risk category names to verify
   * system validation against duplicate entries during import process
   * @returns {Cypress.Chainable} Promise that resolves when file creation is complete
   * @example
   * // Usage in test
   * importOperations.createImportFileWithDuplicates().then(() => {
   *   // File with duplicate entries is ready for upload
   * });
   */
  createImportFileWithDuplicates() {
    const duplicateName = "Duplicate Risk Category Test";
    
    // Start with clean template, then add duplicates
    return this.createCleanImportTemplate().then(() => {
      return cy.readFile(qbImport, { timeout: 15000 }).then((jsonData) => {
        // Set same name for first entry
        jsonData["Risk Category"][0]["Name*"] = duplicateName;
        jsonData["Risk Category"][0]["Description"] = "First duplicate entry";
        
        // Add another entry with same name
        jsonData["Risk Category"].push({
          "Id": "",
          "Name*": duplicateName,
          "Description": "Second duplicate entry",
          "Parent Risk Category Row No": "",
          "Parent Risk Category Id": "",
          "Risk Category ID": "",
          "Inherent Risk Probability Assessment ID": "",
          "Inherent Risk Impact Assessment ID": "",
          "Control Assessment ID": "",
          "Business Area Definition ID(s)": ""
        });
        
        return cy.writeFile(qbImport, jsonData).then(() => {
          return cy.convertXlsxtoJson(jsonData, false, true);
        });
      });
    });
  }

  /**
   * Create import file with invalid characters in ID fields for validation testing
   * @description Generates a test file containing special characters and symbols in ID fields
   * to verify system validation against invalid characters during import process
   * @returns {Cypress.Chainable} Promise that resolves when file creation is complete
   * @example
   * // Usage in test
   * importOperations.createImportFileWithInvalidCharacters().then(() => {
   *   // File with invalid characters is ready for upload
   * });
   */
  createImportFileWithInvalidCharacters() {
    // Start with clean template, then add invalid characters
    return this.createCleanImportTemplate().then(() => {
      return cy.readFile(qbImport, { timeout: 15000 }).then((jsonData) => {
        const uniqueName = DateHelper.generateUniqueNameWithTimestamp("Risk Cat ");
        
        jsonData["Risk Category"][0]["Name*"] = uniqueName;
        jsonData["Risk Category"][0]["Risk Category ID"] = "INVALID@#$%^&*()ID";
        jsonData["Risk Category"][0]["Description"] = "Test with invalid ID characters";
        
        return cy.writeFile(qbImport, jsonData).then(() => {
          return cy.convertXlsxtoJson(jsonData, false, true);
        });
      });
    });
  }

  /**
   * Create import file with HTML/script tags in description fields for security testing
   * @description Generates a test file containing HTML and script tags in description fields
   * to verify system security validation against code injection attempts during import
   * @returns {Cypress.Chainable} Promise that resolves when file creation is complete
   * @example
   * // Usage in test
   * importOperations.createImportFileWithHtmlTags().then(() => {
   *   // File with HTML tags is ready for security validation test
   * });
   */
  createImportFileWithHtmlTags() {
    // Start with clean template, then add HTML tags
    return this.createCleanImportTemplate().then(() => {
      return cy.readFile(qbImport, { timeout: 15000 }).then((jsonData) => {
        const uniqueName = DateHelper.generateUniqueNameWithTimestamp("Risk Cat ");
        
        jsonData["Risk Category"][0]["Name*"] = uniqueName;
        jsonData["Risk Category"][0]["Description"] = "<script>alert('test')</script>HTML content with <b>tags</b>";
        
        return cy.writeFile(qbImport, jsonData).then(() => {
          return cy.convertXlsxtoJson(jsonData, false, true);
        });
      });
    });
  }

  /**
   * Create large import file with multiple entries for performance testing
   * @description Generates a test file containing 50+ risk categories and definitions
   * to verify system performance and handling of bulk import operations
   * @returns {Cypress.Chainable} Promise that resolves when file creation is complete
   * @example
   * // Usage in test
   * importOperations.createLargeImportFile().then(() => {
   *   // Large file with 50+ entries is ready for performance test
   * });
   */
  createLargeImportFile() {
    // Start with clean template, then generate large dataset
    return this.createCleanImportTemplate().then(() => {
      return cy.readFile(qbImport, { timeout: 15000 }).then((jsonData) => {
        // Clear existing data to ensure fresh start
        jsonData["Risk Category"] = [];
        jsonData["Risk Definition"] = [];
        
        // Generate multiple risk categories and corresponding risk definitions
        for (let i = 1; i <= 50; i++) {
          const uniqueName = `Large Import Risk Category ${i} - ${DateHelper.getCurrentTimestamp()}`;
          const uniqueDefName = `Large Import Risk Definition ${i} - ${DateHelper.getCurrentTimestamp()}`;
          
          // Add Risk Category
          jsonData["Risk Category"].push({
            "Id": "",
            "Name*": uniqueName,
            "Description": `Description for ${uniqueName}`,
            "Parent Risk Category Row No": "",
            "Parent Risk Category Id": "",
            "Risk Category ID": `RC_${i}`,
            "Inherent Risk Probability Assessment ID": "",
            "Inherent Risk Impact Assessment ID": "",
            "Control Assessment ID": "",
            "Business Area Definition ID(s)": ""
          });
          
          // Add corresponding Risk Definition
          jsonData["Risk Definition"].push({
            "Id": "",
            "Name*": uniqueDefName,
            "Description": `Description for ${uniqueDefName}`,
            "Delete": "",
            "Status*": "Active",
            "Parent Risk Category Row No*": (i + 1).toString(), // Row numbers start from 2 (header is row 1)
            "Parent Risk Category Id": "",
            "Parent Process Category Row No *": "",
            "Parent Process Category Id": "",
            "Risk Definition Id": `RD_${i}`,
            "Library Risk Definition Id": "",
            "Content Library": "",
            "Inherent Risk Probability Assessment ID": "",
            "Inherent Risk Impact Assessment ID": "",
            "Control Assessment ID": "",
            "Business Area Definitions ID(s)": ""
          });
        }
        
        return cy.writeFile(qbImport, jsonData).then(() => {
          return cy.convertXlsxtoJson(jsonData, false, true);
        });
      });
    });
  }

  /**
   * Create import file with mixed valid and invalid records for comprehensive testing
   * @description Generates a test file containing both valid and invalid data entries
   * to verify system handling of partial import scenarios and error reporting
   * @returns {Cypress.Chainable} Promise that resolves when file creation is complete
   * @example
   * // Usage in test
   * importOperations.createImportFileWithMixedRecords().then(() => {
   *   // File with mixed valid/invalid records is ready for comprehensive test
   * });
   */
  createImportFileWithMixedRecords() {
    // Start with clean template, then add mixed records
    return this.createCleanImportTemplate().then(() => {
      return cy.readFile(qbImport, { timeout: 15000 }).then((jsonData) => {
        const baseName = DateHelper.generateUniqueNameWithTimestamp("Mixed ");
        
        // Clear existing and add mixed data
        jsonData["Risk Category"] = [
          {
            "Id": "",
            "Name*": baseName + "Valid 1",
            "Description": "Valid risk category 1",
            "Parent Risk Category Row No": "",
            "Parent Risk Category Id": "",
            "Risk Category ID": "RC_001",
            "Inherent Risk Probability Assessment ID": "",
            "Inherent Risk Impact Assessment ID": "",
            "Control Assessment ID": "",
            "Business Area Definition ID(s)": ""
          },
          {
            "Id": "",
            "Name*": "", // Invalid - missing required name
            "Description": "Invalid risk category - no name",
            "Parent Risk Category Row No": "",
            "Parent Risk Category Id": "",
            "Risk Category ID": "RC_002",
            "Inherent Risk Probability Assessment ID": "",
            "Inherent Risk Impact Assessment ID": "",
            "Control Assessment ID": "",
            "Business Area Definition ID(s)": ""
          },
          {
            "Id": "",
            "Name*": baseName + "Valid 2",
            "Description": "Valid risk category 2",
            "Parent Risk Category Row No": "",
            "Parent Risk Category Id": "",
            "Risk Category ID": "RC_003",
            "Inherent Risk Probability Assessment ID": "",
            "Inherent Risk Impact Assessment ID": "",
            "Control Assessment ID": "",
            "Business Area Definition ID(s)": ""
          }
        ];
        
        // Add corresponding Risk Definitions for valid Risk Categories
        jsonData["Risk Definition"] = [
          {
            "Id": "",
            "Name*": baseName + "Risk Def 1",
            "Description": "Risk definition for valid category 1",
            "Delete": "",
            "Status*": "Active",
            "Parent Risk Category Row No*": "2", // First data row (header is row 1)
            "Parent Risk Category Id": "",
            "Parent Process Category Row No *": "",
            "Parent Process Category Id": "",
            "Risk Definition Id": "RD_001",
            "Library Risk Definition Id": "",
            "Content Library": "",
            "Inherent Risk Probability Assessment ID": "",
            "Inherent Risk Impact Assessment ID": "",
            "Control Assessment ID": "",
            "Business Area Definitions ID(s)": ""
          },
          {
            "Id": "",
            "Name*": baseName + "Risk Def 2",
            "Description": "Risk definition for valid category 2",
            "Delete": "",
            "Status*": "Active",
            "Parent Risk Category Row No*": "4", // Third data row (skip invalid row 3)
            "Parent Risk Category Id": "",
            "Parent Process Category Row No *": "",
            "Parent Process Category Id": "",
            "Risk Definition Id": "RD_003",
            "Library Risk Definition Id": "",
            "Content Library": "",
            "Inherent Risk Probability Assessment ID": "",
            "Inherent Risk Impact Assessment ID": "",
            "Control Assessment ID": "",
            "Business Area Definitions ID(s)": ""
          }
        ];
        
        return cy.writeFile(qbImport, jsonData).then(() => {
          return cy.convertXlsxtoJson(jsonData, false, true);
        });
      });
    });
  }

  /**
   * Upload valid converted file and submit
   */
  uploadValidConvertedFile() {
    // Clear cache before upload to ensure fresh file
    this.clearFileUploadCache();
    
    ImportHelper.uploadValidFileAndSubmit(
      true,
      "importFile_XLSX",
      loc.submitImportBtn
    );
  }

  /**
   * Upload valid converted file with comprehensive cache clearing
   * This method ensures maximum reliability for CLI mode by clearing all possible caches
   */
  uploadValidConvertedFileWithCacheClear() {
    
    // Clear browser cache comprehensively
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    
    // Clear file input cache
    this.clearFileUploadCache();
    
    // Wait for cache clearing to complete
    cy.wait(1000);
    
    // Verify file exists before upload
    const filePath = 'cypress/downloads/importFile_XLSX.xlsx';
    cy.readFile(filePath, { timeout: 10000 }).should('exist').then(() => {
      cy.log(`Verified file exists: ${filePath}`);
      
      ImportHelper.uploadValidFileAndSubmit(
        true,
        "importFile_XLSX",
        loc.submitImportBtn
      );
    });
  }

  /**
   * Monitor job queue and verify completion
   * @param {string} expectedStatus - Expected job status
   */
  monitorJobQueue(expectedStatus = "COMPLETED") {
    ImportHelper.verifyJobQueueModalOpen();
    ImportHelper.monitorJobStatus(expectedStatus);
    ImportHelper.closeJobQueueModal();
  }

  /**
   * Verify that import audit log entries are generated correctly
   * @description Validates that the system properly logs import operations for audit purposes.
   * Checks audit modal for presence of import records and validates against expected data.
   * @returns {void} Performs assertions on audit log presence
   * @throws {Error} If audit log is not found or contains unexpected data
   * @example
   * // Usage in test
   * importOperations.verifyAuditLogGenerated();
   */
  verifyAuditLogGenerated() {
    // Click on Audit Log link
    cy.get(loc.auditLogLink).eq(0)
      .should("be.visible")
      .click();
    
    // Wait for modal to open and verify it's visible
    cy.get(loc.auditModalBody)
      .should("be.visible");
    
    // Check if audit log contains the taxonomy entry or shows "No record found"
    cy.get(loc.auditModalBody).then($modalBody => {
      if ($modalBody.find(':contains("No record found")').length > 0) {
        // If no records found, throw an error
        cy.readFile(data).then((configData) => {
          throw new Error(`${configData.errorMessages.auditLogNotFound}${importedTaxonomyName}`);
        });
      } else {
        // If records exist, verify the actual imported taxonomy name is present
        cy.get(loc.auditModalBody)
          .should("contain.text", importedTaxonomyName)
          .and("be.visible");
        cy.readFile(data).then((configData) => {
          cy.log(`${configData.logMessages.auditLogEntryFound}${importedTaxonomyName}`);
        });
      }
    });
  }

  /**
   * Verify import validation and monitor job queue status
   * @description Monitors job queue for validation results and handles various import statuses
   * including successful completion, errors, and validation failures
   * @returns {void} Performs job queue monitoring and validation
   * @example
   * // Usage in test
   * importOperations.verifyImportValidation();
   */
  verifyImportValidation() {
    ImportHelper.verifyJobQueueModalOpen();
    ImportHelper.monitorJobStatus();
    ImportHelper.closeJobQueueModal();
  }

  /**
   * Verify import validation error scenarios
   * @description Specifically monitors for validation errors and failed import statuses
   * in job queue. Used for negative test scenarios.
   * @returns {void} Performs error validation monitoring
   * @example
   * // Usage in negative test cases
   * importOperations.verifyImportValidationError();
   */
  verifyImportValidationError() {
    ImportHelper.verifyJobQueueModalOpen();
    ImportHelper.monitorValidationErrorStatus();
    ImportHelper.closeJobQueueModal();
  }

  /**
   * Verify import operation failure
   * @description Validates that import operation fails as expected for invalid data scenarios
   * @returns {void} Performs failure validation
   * @example
   * // Usage in test
   * importOperations.verifyImportFailure();
   */
  verifyImportFailure() {
    ImportHelper.verifyImportFailure();
  }

  /**
   * Verify import operation success
   * @description Validates that import operation completes successfully for valid data
   * @returns {void} Performs success validation
   * @example
   * // Usage in test
   * importOperations.verifyImportSuccess();
   */
  verifyImportSuccess() {
    ImportHelper.verifyImportSuccess();
  }

  /**
   * Verify partial import success for mixed valid/invalid records
   * @description Handles scenarios where some records succeed and others fail during import.
   * Validates partial success status and logs appropriate messages.
   * @returns {void} Performs partial success validation
   * @example
   * // Usage in mixed data test cases
   * importOperations.verifyPartialImportSuccess();
   */
  verifyPartialImportSuccess() {
    cy.readFile(data).then((configData) => {
      ImportHelper.monitorJobStatus(configData.statusValues.completed);
      // Could add additional checks for partial success messages
      cy.log(configData.logMessages.partialImportSuccess);
    });
  }
  /**
   * Click the Import button to initiate file upload process
   * @description Performs click action on the import/submit button with proper validation
   * of button state (visible and enabled) before clicking
   * @returns {void} Clicks the import button
   * @example
   * // Usage in test
   * importOperations.clickImportButton();
   */
  clickImportButton() {
    cy.get(loc.submitImportBtn)
      .should("be.visible")
      .and("not.be.disabled")
      .click();
  }

  /**
   * Custom modal validation error verification for Risk Taxonomy Import
   * @description Performs comprehensive validation of modal error states and job queue status
   * for Risk Taxonomy specific import scenarios
   * @returns {void} Performs modal validation error checks
   * @example
   * // Usage in validation test cases
   * importOperations.verifyModalValidationError();
   */
  verifyModalValidationError() {
    cy.readFile(data).then((configData) => {
      ImportHelper.monitorJobStatus(
        configData.statusValues.completed, 
        configData.statusValues.completedWithErrors
      );
    });
  }
}

/**
 * RiskTaxonomyFilterAndDelete class for filtering and deleting risk categories and definitions
 */
class RiskTaxonomyFilterAndDelete {

  // ================== FILTER TEST METHODS ==================

  /**
   * Test Name filter functionality
   * @param {string} nameToFilter - Name to filter by
   */
  filterByName(nameToFilter) {
    FilterAndDeleteHelper.filterByName(nameToFilter);
    return this;
  }

  /**
   * Test Business Area filter functionality
   * @param {string} businessArea - Business area to filter by
   */
  filterByBusinessArea(businessArea) {
    FilterAndDeleteHelper.filterByBusinessArea(businessArea);
    return this;
  }

  /**
   * Test Status filter functionality
   * @param {string} status - Status to filter by ('Active', 'Inactive')
   */
  filterByStatus(status) {
    FilterAndDeleteHelper.filterByStatus(status);
    return this;
  }

  /**
   * Test Risk Definition ID filter
   * @param {string} riskDefId - Risk Definition ID to filter by
   */
  filterByRiskDefinitionId(riskDefId) {
    FilterAndDeleteHelper.filterByRiskDefinitionId(riskDefId);
    return this;
  }

  /**
   * Verify filter results contain expected text
   * @param {string} expectedText - Expected text in results
   */
  verifyFilterResults(expectedText) {
    FilterAndDeleteHelper.verifyFilterResults(expectedText);
    return this;
  }

  // ================== DELETE TEST METHODS ==================

  /**
   * Delete a Risk Category
   * @param {string} categoryName - Name of category to delete
   * @param {boolean} confirmDelete - Whether to confirm deletion
   */
  deleteRiskCategory(confirmDelete = true) {
    cy.get(locators.general.deleteIconGrid)
    .last()
    .click();

    cy.get(locators.general.deleteRiskCategoryConfirmBtn)
      .should("be.visible")
      .click();

    return this;
  }

  /**
   * Delete a Risk Definition
   * @param {string} definitionName - Name of definition to delete
   * @param {boolean} confirmDelete - Whether to confirm deletion
   */
  deleteRiskDefinition(confirmDelete = true) {
    FilterAndDeleteHelper.deleteItemFromGrid( 
      confirmDelete
    );
    
    return this;
  }

  /**
   * Verify item is deleted from grid
   * @param {string} itemName - Name of deleted item
   */
  verifyItemDeleted(itemName) {
    FilterAndDeleteHelper.verifyItemDeleted(
      itemName, 
      locators.risk.administration.riskCategory.customerSpace.FormParentElement
    );
    return this;
  }

  /**
   * Verify item still exists in grid (after cancelled deletion)
   * @param {string} itemName - Name of item that should still exist
   */
  verifyItemExists(itemName) {
    cy.get(locators.risk.administration.riskCategory.customerSpace.FormParentElement)
      .should('contain.text', itemName);
    return this;
  }

  // ================== DATA SETUP METHODS ==================


  /**
   * Get filter test scenarios from data file
   */
  getFilterTestScenarios() {
    return FileHelper.readJsonFile(filePath).then((data) => {
      return {
        validName: data.riskDefinition.add.name,
        validBusinessArea: data.riskDefinition.add.businessAreaDefinition,
        invalidName: 'NonExistentCategory',
        partialName: data.riskDefinition.add.name.substring(0, 5),
        statusActive: 'Active',
        statusInactive: 'Inactive'
      };
    });
  }
}

class AddLinkControls {
  /**
   * Generate and write risk definition data to file
   */
  generateAndWriteAddRecommendedControlDataInFile(filePath) {
    return FileHelper.readJsonFile(filePath).then((fileData) => {
      cy.createRandomString(6).then((randomString) => {
        const baseName = fileData.addRecommendControls.baseName;
        const newName = baseName + randomString;

        fileData.addRecommendControls.name = newName;
        fileData.addRecommendControls.controlDefinitionId = newName;

        return FileHelper.writeJsonFile(filePath, fileData);
      });
    });
  }

  verifyAddRecommendedControlModalOpen() {
    cy.get(locators.risk.controlTaxonomies.controlDefFormId).should("be.visible");
  }

  verifyLinkRecommendedControlModalOpen() {
    cy.get(locators.risk.controlTaxonomies.linkControlDefinitionFormId).should("be.visible");
  }

  expandControlCategoryTree(controlCategoryName){
    cy.waitForTopMsgLoaderToDisappear(15000);
    // cy.contains(
    //   locators.risk.administration.treeOperations.treeText,
    //   controlCategoryName,
    //   {timeout:10000}
    // )
    cy.get(locators.risk.administration.treeOperations.treeText,{timeout:10000})
    .contains(controlCategoryName)
      .scrollIntoView()
      .should("exist")
      .dblclick({delay:1000});
  }

  selectControlDefinition(controlDefinitionName){
    cy.contains(
      locators.risk.administration.treeOperations.treeText,
      controlDefinitionName
    )
      .scrollIntoView()
      .should("exist")
      .parent()
      .find(locators.risk.administration.riskCategory.checkCategory)
      .click({delay:600});
  }

  addValidDataAddRecommendControlForm(selectParentControlCategory) {
    FileHelper.readJsonFile(filePath).then((data) => {
      const addRecommendControls = data.addRecommendControls;
      FormHelper.fillAddRecommendedControlForm(
        {
          controlDefinitionId: addRecommendControls.controlDefinitionId,
          name: addRecommendControls.name,
          description: addRecommendControls.description,
          controlType: addRecommendControls.controlType,
          controlOperations: addRecommendControls.controlOperations,
          controlDefinitionCategories:
            addRecommendControls.controlDefinitionCategories,
          primaryControl: addRecommendControls.primaryControl,
          controlFrequency: addRecommendControls.controlFrequency,
          preventFraud: addRecommendControls.preventFraud,
          designAssessment: addRecommendControls.designAssessment,
          operatingEffectivenessAssessment:
            addRecommendControls.operatingEffectivenessAssessment,
          optimalRole: addRecommendControls.optimalRole,
          comments: addRecommendControls.comments,
          controlExecution: addRecommendControls.controlExecution,
          tags: addRecommendControls.tags,
        },
        selectParentControlCategory
      );
    });
  }

  /**
   * Save Risk Definition form
   */
  saveRecommendControlForm(
    selector = locators.general.saveB,
    elementPosition = 10
  ) {
    cy.get(selector)
    .eq(elementPosition)
    .scrollIntoView()
    .should("not.be.disabled")
    .click({force:true});
  }

  verifyControlAddedToRiskDefinition(expectedControlName, deleted=false) {
    const expectedAssertion= deleted
    ? 'not.contain.text'
    : 'contain.text';
    cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.controlColumn)
    .should('have.length',3)
    .last()
    .should(expectedAssertion, expectedControlName);
  }
  
  openControlSubGrid(){
    cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.expandConrolSubgrid)
    .should('have.length',1)
    .click()
  }

  clickDeleteControlBtn(){
    cy.get(locators.general.deleteIconGrid)
    .should('have.length',3)
    .last()
    .click()
  }

  clickYesDeleteBtn(){
    cy.get(locators.general.deleteYes)
    .last()
    .click();
  }

  /**************************************************************************************************************************
   * ******************** Moved Risk Definition UPDATED Functions ***********************************************************
   * *************************************************************************************************************************
   */

  verifyUpdatedOption(){
    cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.riskLibraryStatus)
    .contains("Updated")
    .should("be.visible");
  }

  clickUpdatedOption(){
    cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.riskLibraryStatus)
    .contains("Updated")
    .should("be.visible")
    .click();
  }

  verifyComparisonModalOpen(){
    cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.comparisonWindow, {timeout:10000})
    .should("be.visible");
  }

  verifyComparisonModalClosed(){
    cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.comparisonWindow, {timeout:10000})
    .should("not.exist");
  }
}
export { RiskTaxonomy, RiskCategory, RiskDefinition, RiskTaxonomyFilterAndDelete, RiskTaxonomyImportOperations, AddLinkControls };
