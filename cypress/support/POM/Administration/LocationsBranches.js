import locators from "../../../fixtures/locators.json";
// import testData from "../../../fixtures/Administration/LocationsBranches.json";
const dataFile = "cypress/fixtures/Administration/LocationsBranches.json";
import dayjs from "dayjs";

class Locations {
  /**
   * Selects an item from a searchable dropdown.
   * @param {string} selectLocator - The CSS selector for the dropdown.
   * @param {string} searchBoxLocator - The CSS selector for the dropdown search box.
   * @param {string} searchText - The text to search and select in the dropdown.
   */
  clickSelectDropDownHandler(selectLocator, searchBoxLocator, searchText) {
    cy.get(selectLocator).should("be.visible").click();
    cy.dropDownSearchAndSelect(searchBoxLocator, searchText);
  }

  /**
   * Selects the process owner from the dropdown using environment user.
   */
  selectProcessOwner() {
    this.clickSelectDropDownHandler(
      locators.administration.resellers.idropdown,
      locators.general.selectSearch,
      Cypress.env("USER").FNBA.USERNAME
    );
  }

  /**
   * Selects COC (Chain of Command) type and corresponding user/group.
   * @param {string} type - The type of COC ("Single" or "Group").
   * @param {string} userGroup - The user or group name to select.
   */
  selectCOCType(type, userGroup) {
    cy.get(`[name='cocType'][value='${type}']`).check({ force: true });
    if (type == "Single")
      this.clickSelectDropDownHandler(
        locators.administration.site.cocTypeSingle,
        locators.general.selectSearch,
        Cypress.env("USER").FNBA.USERNAME
      );
    if (type == "Group")
      this.clickSelectDropDownHandler(
        locators.administration.site.cocTypeGroup,
        locators.general.selectSearch,
        userGroup
      );
  }

  /**
   * Selects OIC (Officer in Charge) type and corresponding user/group.
   * @param {string} type - The type of OIC ("Single" or "Group").
   * @param {string} userGroup - The user or group name to select.
   */
  selectOICType(type, userGroup) {
    cy.get(`[name='oicType'][value='${type}']`).check({ force: true });
    if (type == "Single")
      this.clickSelectDropDownHandler(
        locators.administration.site.oicSingle,
        locators.general.selectSearch,
        Cypress.env("USER").FNBA.USERNAME
      );
    if (type == "Group") {
      this.clickSelectDropDownHandler(
        locators.administration.site.oicGroup,
        locators.general.selectSearch,
        userGroup
      );
    }
  }

  /**
   * Clicks the Save button on the form.
   */
  clickSaveButton() {
    cy.contains(locators.administration.resellers.oSave).click();
  }

  /**
   * Adds a location/site by selecting COC and OIC from the provided section data.
   * @param {string} sectionName - Section name to retrieve data from the JSON file.
   */
  addLocationSite(sectionName) {
    cy.readFile(dataFile).then((data) => {
      this.selectCOCType(
        data[sectionName].coCType,
        data[sectionName].userGroup
      );
      this.selectOICType(
        data[sectionName].oicType,
        data[sectionName].userGroup
      );
    });
  }

  /**
   * Updates the JSON data file with a new location/site name.
   * @param {string} siteName - The site name to write.
   * @param {string} sectionName - The section in the data file to update.
   */
  writeSiteName(siteName, sectionName) {
    cy.readFile(dataFile).then((data) => {
      data[sectionName].locationName = siteName;
      cy.writeFile(dataFile, data);
    });
  }

  /**
   * Inputs the site/location name in the input field.
   * @param {string} siteName - The name of the site.
   */
  inputSiteName(siteName) {
    cy.get(locators.administration.resellers.itextBox).clear().type(siteName);
  }

  /**
   * Opens the form to add a new location/branch.
   */
  openLocationForm() {
    cy.get(locators.administration.resellers.addBranch).click();
  }

  /**
   * Verifies that a location exists in the list/grid.
   * @param {string} locationName - Name of the location to verify.
   */
  verifyAddedLocation(locationName) {
    cy.get(locators.administration.regulations.standards.allStandards).contains(
      locationName
    );
  }

  /**
   * Verifies that a location does not exist in the list/grid.
   * @param {string} locationName - Name of the location to check.
   */
  locationNotExists(locationName) {
    cy.get(locators.administration.regulations.standards.allStandards).should(
      "not.contain",
      locationName
    );
  }

  /**
   * Cancels the add/edit site form.
   */
  cancelSiteScreen() {
    cy.get(locators.administration.resellers.oCancel).click();
  }

  /**
   * Clicks on an existing site entry to edit.
   * @param {string} existingSiteName - Name of the existing site.
   */
  clickExistingSite(existingSiteName) {
    cy.contains(
      locators.administration.resellers.oEdit,
      existingSiteName
    ).click();
  }

  /**
   * Edits the status of a site (Active/Inactive).
   * @param {string} status - The status to select.
   */
  editSiteStatus(status) {
    cy.contains(locators.administration.resellers.oActive, status).click();
  }

  /**
   * Selects a single requirement by typing and pressing Enter.
   * @param {string} reqName - Requirement name to select.
   */
  selectSingleRequirement(reqName) {
    cy.waitForTopMsgLoaderToDisappear(15000);
    cy.get(locators.administration.site.selectCategory).find("input").type(`${reqName}{enter}`);
  }

  /**
   * Clears selected categories.
   * @param {number} clearTimes - Number of times to click clear.
   * @param {string} [catName=false] - Optional category name to verify cleared.
   */
  clearCategory(clearTimes = 1, catName = false) {
    for (let i = 0; i < clearTimes; i++) {
      cy.get(locators.administration.site.clearCategoriesDropDown).click();
      cy.get(locators.administration.site.categoryResult).should("not.contain", catName);
    }
  }

  /**
   * Selects all requirements from the dropdowns.
   */
  selectAllRequirements() {
    cy.get(locators.administration.resellers.singleRequirement).click();
    cy.get(locators.administration.resellers.clickCategory).click();
    cy.get(locators.administration.resellers.selectAllRequirements).click({
      force: true,
    });
  }

  /**
   * Unselects all previously selected requirements.
   */
  unselectAllRequirements() {
    cy.get(locators.administration.resellers.singleRequirement).click();
    cy.get(locators.administration.resellers.clickCategory).click();
    cy.get(locators.administration.resellers.selectAllRequirements).click({
      force: true,
    });
  }

  /**
   * Writes a category name into the test data JSON file.
   * @param {string} section - Data section name.
   * @param {string} categoryName - Category name to save.
   */
  writeCategoryName(section, categoryName) {
    cy.readFile(dataFile).then((data) => {
      data.category[section].name = categoryName;
      data.update.viewCategory = categoryName;
      cy.writeFile(dataFile, data);
    });
  }

  /**
   * Adds or updates a category with form data and saves it.
   * @param {string} sectionName - Section of the data file.
   * @param {string} categoryName - Category name.
   */
  addUpdateCategory(sectionName, categoryName) {
    this.fillAndSubmitCategoryForm(sectionName, categoryName);
    this.clickSaveButton();
  }

  /**
   * Filters categories by name.
   * @param {string} filterName - Name to search in the filter.
   */
  searchCategoryFilter(filterName) {
    cy.get(locators.administration.resellers.filterButton).click();
    cy.get(locators.administration.resellers.filterName).type(filterName);
    cy.get(locators.administration.resellers.applybtn).click();
  }

  /**
   * Clicks an existing category entry by name.
   * @param {string} categoryName - Category to open.
   */
  clickExistingCategory(categoryName) {
    cy.contains(categoryName).click();
  }

  /**
   * Clicks the "Add Category" button.
   */
  clickAddCategoryBtn() {
    cy.get(locators.administration.resellers.addCategory).click();
  }

  /**
   * Selects values in a `<select>` dropdown.
   * @param {string} locator - Dropdown CSS selector.
   * @param {string|Array} dataValues - Value(s) to select.
   */
  selectMethod(locator, dataValues) {
    cy.get(locator).select(dataValues, { force: true });
  }

  /**
   * Types into a field only if the value is non-empty.
   * @param {string} typeText - Text to type.
   * @param {string} locator - Field CSS selector.
   */
  typeOptionalField(typeText, locator) {
    cy.typeOptionalEmptyFieldCondition(typeText, locator);
  }

  /**
   * Fills the form with category data and does not click save.
   * @param {string} section - Section in the data file.
   * @param {string} categoryName - Name to enter in the form.
   */
  fillAndSubmitCategoryForm(section, categoryName) {
    cy.readFile(dataFile).then((file) => {
      cy.get(locators.administration.resellers.addCategoryName)
        .clear({ force: true })
        .type(categoryName);
      this.typeOptionalField(
        file.category[section].description,
        locators.administration.site.descriptionMaxLength
      );
      this.selectMethod(locators.administration.site.industry, file.category[section].industries);
      this.selectMethod(locators.administration.site.agencies, file.category[section].agencies);
      this.selectMethod(locators.administration.site.areas, file.category[section].areas);
      cy.clickOptionalBooleanFieldCondition(
        file.category[section].nonRegulatoryDriven,
        locators.administration.site.nonRegulatoryCheck
      );
    });
  }

  /**
   * Clicks the Add Area button.
   */
  clickAddAreasBtn() {
    cy.get(locators.general.clickAddBtn).should("be.visible").click();
  }

  /**
   * Types the area name into the input field.
   * @param {string} areaName - Area name to enter.
   */
  typeAreaName(areaName) {
    cy.get(locators.administration.site.areaName, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(areaName);
  }

  /**
   * Writes area name to the test data file.
   * @param {string} sectionName - Section in JSON file.
   * @param {string} areaName - Area name to save.
   */
  writeAreaName(sectionName, areaName) {
    cy.readFile(dataFile).then((data) => {
      data.areas[sectionName].name = areaName;
      data.category[sectionName].areas = [areaName];
      cy.writeFile(dataFile, data);
    });
  }

  /**
   * Clicks the top right pagination button.
   */
  clickTopRightPageBtn() {
    cy.waitForTopMsgLoaderToDisappear(30000);
    cy.get(locators.general.gridTopDoubleRightPageBtn).click();
  }

  /**
   * Verifies sub-category presence in area edit form.
   * @param {string} areaName - Area name to open.
   * @param {string} subCategoryName - Sub-category to verify.
   */
  verifyUpdatedBSAInAreas(areaName, subCategoryName) {
    cy.contains(areaName).click();
    cy.waitForTopMsgLoaderToDisappear(40000);
    cy.contains(subCategoryName);
  }

  /**
   * Selects a sub-category from dropdown.
   * @param {string} subCategoryName - Sub-category name.
   */
  viewSubCategory(subCategoryName) {
    cy.get(locators.administration.resellers.viewSubCategoryarea)
      .should("exist")
      .then(($select) => {
        cy.wrap($select).parent().click();
        cy.get(locators.administration.users.searchBox)
          .clear()
          .type(subCategoryName);
        cy.get(locators.administration.site.viewSubCategoryOptions)
          .contains(subCategoryName)
          .should("exist");
        cy.get(locators.administration.users.searchBox).type("{enter}");
      });
  }

  /**
   * Clicks the Add Agency button.
   */
  clickAddAgencyBtn() {
    cy.get(locators.general.clickAddBtn).click();
  }

  /**
   * Writes agency name to test data file and links to category.
   * @param {string} sectionName - Section in file.
   * @param {string} agencyName - Name of the agency.
   */
  writeAgencyName(sectionName, agencyName) {
    cy.readFile(dataFile).then((data) => {
      data.agencies[sectionName].name = agencyName;
      data.category[sectionName].agencies = [agencyName];
      cy.writeFile(dataFile, data);
    });
  }

  /**
   * Fills agency name into form.
   * @param {string} agencyName - Agency name.
   */
  addUpdateAgency(agencyName) {
    cy.get(locators.administration.resellers.addAgencyName)
      .should("be.visible")
      .clear()
      .type(agencyName);
  }

  /**
   * Clicks Add Sub-category for BSA.
   */
  clickBSASubCategoryAddBtn() {
    cy.get(locators.general.clickAddBtn).should("be.visible").click();
  }

  /**
   * Adds BSA sub-category in editable grid.
   * @param {string} subCategoryName - Sub-category name.
   */
  addBSASubCategories(subCategoryName) {
    cy.get(locators.administration.site.subCategoryName).eq(1).dblclick();
    cy.get(locators.general.textAreaNameDescription)
      .should("be.visible")
      .clear()
      .type(subCategoryName)
      .tab();
  }

  /**
   * Deletes a BSA sub-category entry.
   */
  deleteBSASubCategories() {
    cy.get(locators.administration.site.subCategoryName).eq(1).parent().contains("Delete").click();
    cy.get(locators.general.deleteYes, {
      timeout: Cypress.env("waits").mediumWait,
    })
      .should("be.visible")
      .click();
  }

  /**
   * Verifies a BSA sub-category entry exists.
   * @param {string} subCategoryName - Sub-category name to verify.
   */
  verifyBSASubCategories(subCategoryName) {
    cy.get(locators.general.gridName)
      .should("have.length", 1)
      .and("contain", subCategoryName);
  }

  /**
   * Searches for a BSA sub-category in the grid.
   * @param {string} subCategoryName - Sub-category name.
   */
  searchBSASubCategory(subCategoryName) {
    cy.waitForTopMsgLoaderToDisappear(50000);
    cy.get(locators.general.searchTextField)
      .eq(0)
      .clear()
      .type(subCategoryName, { delay: 200 });
    cy.get(locators.general.gridName).should("have.length", 1);
  }

  /**
   * Writes sub-category name to test data file.
   * @param {string} sectionName - Section in data.
   * @param {string} subCategoryName - Name of the sub-category.
   */
  writeBSASubCategory(sectionName, subCategoryName) {
    cy.readFile(dataFile).then((data) => {
      data.bsaSubCategory[sectionName].name = subCategoryName;
      cy.writeFile(dataFile, data);
    });
  }
}

export default Locations;
