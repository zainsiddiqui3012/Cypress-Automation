import locators from "../../../fixtures/locators.json";
import buData from "../../../fixtures/Administration/organizationalHierarchy.json";
import OrgDataFile from "../../../fixtures/Administration/organizationalHierarchy.json";
import { time } from "console";
const orgDataFilePath =
  "cypress/fixtures/Administration/organizationalHierarchy.json";
const staticWait = 2000;
class OrganizationalHierarchy {
  orgHierarchy = locators.administration.organizationalHierarchy;

  createAndSetBU() {
    this.clickAddBtn();
    this.fillAndSubmitAddBUForm(true, true);
    cy.reload();
    this.clickExpandAllBtn();
    this.clickDialogueExpandBtn();
    this.setBU(true);
  }

  createInActiveBU() {
    this.clickAddBtn();
    this.fillAndSubmitAddBUForm(true, true, false);
    cy.reload();
    this.clickExpandAllBtn();
    this.clickDialogueExpandBtn();
    this.setBU(true);
    this.openBU(true);
  }

  unsetBU() {
    cy.reload();
    this.clickExpandAllBtn();
    this.clickDialogueExpandBtn();
    this.setBU(true);
  }
  OpenBUAndRenameBU() {
    cy.reload();
    this.clickExpandAllBtn();
    this.clickDialogueExpandBtn();
    this.renameBU(true);
  }

  /**
   * clickAddBtn will click on the Add button on Organizational Hierarchy page
   */
  clickAddBtn() {
    cy.get(this.orgHierarchy.addBtn).click();
  }

  /**
   * typeName will clear the name input field and wait for 500 miliseconds
   * and then type the procided name on Add Organizational Hierarchy flyout
   * @param {string} name text to be typed in the name input field
   */
  typeName(name) {
    const fullName = buData.buName + name;
    //need static wait here as the content does not loaded sometimes when the form is opened this can not be handled with dynamic wait
    cy.wait(4000)
    cy.get(this.orgHierarchy.nameInput,{timeout:15000})
      .clear({ force: true })
      .wait(500)
      .type(fullName);
  }

  /**
   * clickSaveBtn will click on the Save button on Add Organizational Hierarchy flyout
   */
  clickSaveBtn() {
    cy.get(this.orgHierarchy.saveBtn).click({ force: true });
  }

  /**
   * clickExpandAllBtn will click on the Expand All link on Organizational Hierarchy page
   */
  clickExpandAllBtn() {
    cy.contains("div", OrgDataFile.expandAll).should("be.visible").click();
    cy.wait(2000);
  }

  /**
   * clickExpandAllBtn will click on the Expand All link on Organizational Hierarchy page
   */
  clickCollapseAllBtn() {
    cy.contains("div", OrgDataFile.collapseAll, { timeout: 50000 })
      .should("be.visible")
      .click({ force: true });
  }
  /**
   * clickDialogueExpandBtn will click on the expand button on Expand dialogue
   */
  clickDialogueExpandBtn() {
    cy.get(this.orgHierarchy.expandDialogueBtn).click({ force: true });
  }

  /**
   * clicksetAsBUBtn will click on the Set as Business Unit button for the provided nameOfBU
   * @param {string} nameOfBU name of the BU which needs to be set as Business Unit
   */
  clicksetAsBUBtn(nameOfBU) {
    cy.xpath(
      `//span[@class='aciLabel' and text()='${nameOfBU}']//ancestor::span/../div[contains(@class,'aciTreeColumn0')]`,
      { timeout: 40000 } //timeout for element to appear
    )
      .should("exist") // Ensure element exists in the DOM
      .should("be.visible", { timeout: 40000 }) // Wait until visible
      .click();
  }
  /**
   * openBU will click on the provided nameOfBU
   * @param {string} nameOfBU name of the BU which needs to be open
   */
  openBU(newBU = false, edit = false) {
    //need static wait here as the content does not loaded sometimes when the form is opened this can not be handled with dynamic wait
    cy.wait(7000);
    cy.readFile(orgDataFilePath).then((obj) => {
    if (newBU === true) {
      cy.waitForToastMessageToDisappear(9000);
      cy.waitForTopMsgLoaderToDisappear(15000);
      cy.get(this.orgHierarchy.buSpan, { timeout: 50000 })
        .contains(obj.newName, { timeout: 50000 })
        .click({
          force: true,
        });
    } else {
      cy.get(this.orgHierarchy.buSpan, { timeout: 50000 }).eq(1).click({
        force: true,
      });
    }
    cy.waitForElementToVisible(this.orgHierarchy.nameInput, 30000);
    if (edit === true)
      cy.get(this.orgHierarchy.nameInput).should("have.value", obj.newName);
  })
  }

  /**
   * clickCloseAddGroupSlider will click on the X button on the Add Organization Hierarchy flyout
   */
  clickCloseAddGroupSlider() {
    cy.get(this.orgHierarchy.closeAddOrgGroupSlider).click({ force: true });
  }

  /**
   * fillAndSubmitAddBUForm will create Organizational Hierarchy item with random name
   * and will reload the page after verifying the toast messages
   * @param {boolean} [isNewBU=false] flag to set a different BU value in the file, dafualt value False
   * @param {boolean} [isSave=true] default value is true and if you don't want to save the BU value, pass false
   */
  fillAndSubmitAddBUForm(isNewBU = false, isSave = true, update = false) {
    cy.createRandomString(20).then((name) => {
      cy.waitForElementToVisible(this.orgHierarchy.nameInput, 40000);
      this.typeName(name);
      const fullName = buData.buName+ name;
      cy.readFile(orgDataFilePath).then((obj) => {
        if (isNewBU) obj.newName = fullName;
        else obj.name = fullName;
        this.clickSaveBtn();

        if (update === true) {
          cy.verifyToastMessageText(obj.updateSuccessMsg, 40000);
        } else {
          cy.verifyToastMessageText(obj.saveSuccessMsg, 40000);
        }

        cy.waitForToastMessageToDisappear(40000);

        if (isSave) cy.writeFile(orgDataFilePath, obj);
      });

      this.clickCloseAddGroupSlider();
      cy.wait(staticWait);
    });
  }

  /**
   *
   * @param {string} name name of the BU which needs to be renamed
   */
  renameBU(newBU = false) {
    this.clickExpandAllBtn();
    cy.wait(staticWait);
    this.clickDialogueExpandBtn();
    cy.wait(staticWait);
    this.openBU(newBU, false);
    return cy.createRandomString(20).then((name) => {
      const fullName = buData.buName + name;
      cy.get(this.orgHierarchy.nameInput)
        .clear({ force: true })
        .wait(1000)
        .type(fullName);

      cy.readFile(orgDataFilePath).then((obj) => {
        obj.renameBU = fullName;
        this.clickSaveBtn();
        cy.verifyToastMessageText(obj.updateSuccessMsg, 40000);
        cy.waitForToastMessageToDisappear(40000);

        cy.writeFile(orgDataFilePath, obj);
      });
      cy.wait(staticWait);
    });
  }

  changeBUStatus(status, inActive = false) {
    if (inActive === true) {
      this.openBU();
    }
    this.markStatus(status);
    this.clickSaveBtn();
    cy.readFile(orgDataFilePath).then((obj) => {
      cy.verifyToastMessageText(obj.updateSuccessMsg, 40000);
      cy.waitForToastMessageToDisappear(40000);
    });

    cy.wait(staticWait);
  }

  /**
   * setBU will read the name of the BU from the data file and set organizational hierarchy item as BU
   * @param {boolean} [isNew=false] default false, whether to use new BU or old one
   */
  setBU(isNewBU = false) {
    this.clickExpandAllBtn();
    cy.wait(staticWait);

    this.clickDialogueExpandBtn();
    cy.wait(staticWait);

    cy.readFile(orgDataFilePath).then((obj) => {
      const bu = isNewBU ? obj.newName : obj.name;
      this.clicksetAsBUBtn(bu);
    });
  }

  /**
   * addBU will visit scree,click Add btn
   * fill And Save BU
   * Mark the Status of BU
   * Select Location/Branches
   * Save the form
   * @param {boolean} status the Status of added BU
   *  @param {boolean} [Location = false] the flag for adding Location/Branches
   */
  addBU(
    status,
    Location = false,
    color = false,
    qaTest = false,
    officer = null,
    radioValue = null
  ) {
    cy.visitOrganizationalHierarchy();
    this.clickAddBtn();
    this.fillAndSubmitAddBUForm(true, true);
    this.markStatus(status);
    if (Location === true) this.selectLocationBranch(buData.location);
    if (color === true) this.selectColor(buData.selectedColor);
    if (qaTest === true) {
      cy.reload();
      this.clickExpandAllBtn();
      this.clickDialogueExpandBtn();
      this.clicksetAsBUBtn(buData.newName);
      this.clickExpandAllBtn();
      this.clickDialogueExpandBtn();
      this.openBU(true);
      this.selectQATestSeriesOfficers(officer, radioValue);
    }
    this.clickSaveBtn();
  }
  /**  * Mark the Status of BU
   * @param {boolean} status the Status of added BU
   */

  // statup update
  markStatus(status) {
    if (status == true) {
      cy.get(this.orgHierarchy.statusActive, { timeout: 40000 }).click({
        force: true,
      });
    } else {
      cy.get(this.orgHierarchy.statusInactive, { timeout: 40000 }).click({
        force: true,
      });
    }
  }
  /**
   * Click Toggle button
   * Click Expand All
   * Click modal Expand button
   * Verify Active and InActive BUs
   */
  clickToggleButton() {
    cy.reload();
    cy.get(this.orgHierarchy.toggleBtn).should("be.visible");
    cy.get(this.orgHierarchy.buSpan).as(OrgDataFile.inactive);
    cy.get(this.orgHierarchy.toggleBtn)
      .should("be.visible")
      .click({ force: true });

    cy.wait(5000);
    this.clickExpandAllBtn();
    cy.wait(5000);
    this.clickDialogueExpandBtn();

    cy.get("@Inactive", { timeout: 50000 })
      .contains(OrgDataFile.inactive, { timeout: 90000 })
      .first()
      .should("be.visible")
      .click();
  }

  /**
   * Verify mandatory fields
   */

  emptyFieldValidated() {
    cy.visitOrganizationalHierarchy();
    this.clickAddBtn();
    this.clickSaveBtn();
    cy.verifyToastMessageText(buData.errorMsg, 20000);
  }

  /**
   *Verify fields by clicking BU
   * in edit mode
   */
  verifyFieldsinEditMode() {
    cy.get(this.orgHierarchy.nameInput, { timeout: 50000 }).should(
      "be.visible"
    );
    cy.get(this.orgHierarchy.colorPicker).should("be.visible");
    cy.get(this.orgHierarchy.statusActive).should("be.visible");
    cy.get(this.orgHierarchy.statusInactive).should("be.visible");
  }
  /**
   *Select Location/Branches from Add form
   * *  @param {String} locationName Location/Branches option name
   */
  selectLocationBranch(locationName) {
    cy.get(this.orgHierarchy.locationDropdown).click({ force: true });
    cy.wait(3000);
    cy.get(this.orgHierarchy.locationDropdownSearch)
      .type(locationName, { delay: 300, force: true })
      .type("{enter}", { force: true });
  }
  /**
   * *  @param {String} name Location/Branches option name
   */
  verifySelectedLocation(name) {
    cy.get(this.orgHierarchy.locationOption, { timeout: 40000 })
      .should("exist")
      .and("contain", name);
  }
  /**
   * *  @param {String} name Category name
   */
  verifySelectedCategory(name) {
    this.clickApplicability();
    //need static wait here as there was no loader in the form and it takes time to load the categories dynamic toploader was not working here
    cy.wait(3000);
    cy.get(this.orgHierarchy.locationOption, { timeout: 20000 }).should(
      "contain",
      name
    );
  }
  /**
   * Verify behavior of Cancel button
   * After Selecting Category
   */
  verifyDiscardCategory() {
    this.clickApplicability();
    cy.get(this.orgHierarchy.locationOption, { timeout: 30000 }).should(
      "not.exist"
    );
  }

  /**
   * Click Applicabilty tab
   */
  clickApplicability() {
    cy.waitForTopMsgLoaderToDisappear(40000);
    cy.get(this.orgHierarchy.clickApplicabilty, { timeout: 30000 }).click();
  }

  /**
   * Select Single Category from Dropdown
   * @param {string} categoryName the Category Name
   */
  selectSingleCategory(categoryName) {
    this.clickApplicability();
    cy.get(this.orgHierarchy.categoryDropdown).click();
    cy.wait(3000);
    cy.get(this.orgHierarchy.locationDropdownSearch)
      .type(categoryName, { delay: 300, force: true })
      .type("{enter}", { force: true });
  }

  /**
   * Select Multiple Category from Dropdown
   * @param {Array} categories the Category Name
   */
  selectMultipleCategories(categories) {
    cy.waitForTopMsgLoaderToDisappear(40000)
    this.clickApplicability();
    cy.get(this.orgHierarchy.categoryDropdown).click();
    cy.wait(3000);
    categories.forEach((category) => {
      cy.get(this.orgHierarchy.optionName)
        .contains(category, { timeout: 10000 })
        .siblings(this.orgHierarchy.categoryOption)
        .check({ force: true });
    });
  }
  /**
   * Verify requirement
   * Search requirement
   * on selecting Single Category from Dropdown
   * @param {string} requirementName the requirement Name
   */

  selectRequirement(requirementName) {
    this.clickApplicability();
    cy.get(this.orgHierarchy.requirementSearch).type(requirementName);
    cy.get(this.orgHierarchy.savebutton).click();
  }

  /**
   * Verify multiple Requirements
   * Search requirement
   * on selecting multiple Categories from Dropdown
   * @param {Array} requirements the requirement Array
   */
  selectMultipleRequirements(requirements) {
    this.clickApplicability();
    requirements.forEach((requirement) => {
      cy.get(this.orgHierarchy.requirementSearch).clear().type(requirement);
      cy.get(this.orgHierarchy.requirementList).should("contain", requirement);
    });
  }
  /**
   * Click Save button
   * of Applicability form
   
   */
  clickApplicabitySaveBtn() {
    cy.get(this.orgHierarchy.applicabiltySave).click({ force: true });
  }

  /**
   * Click Cancel button
   * of Applicability form
   
   */
  clickCancel() {
    cy.get(this.orgHierarchy.cancelButton).click();
  }

  /**
   * Click Applicability tab
   * Unselect Category
   * Save the form
   
   */
  unSelectCategory() {
    this.clickApplicability();
    cy.get(this.orgHierarchy.deSelectCatagory, { timeout: 10000 })
      .eq(0)
      .should("be.visible")
      .click({ force: true });
    this.clickApplicabitySaveBtn();
  }
  /**
   * Click Applicability tab
   * Verify unselected Requirements
   * on deselecting Categories
   
   */
  verifyDeSelectRequirements(requirements) {
    this.clickApplicability();
    requirements.forEach((requirement) => {
      cy.get(this.orgHierarchy.requirementSearch).clear().type(requirement);
      cy.get(this.orgHierarchy.requirementList).should("not.exist");
    });
  }

  // Set the color using the color picker
  selectColor(colorHex) {
    cy.get(this.orgHierarchy.colorPickerButton).click({ force: true }); // Open color picker
    cy.get(this.orgHierarchy.colorPickerInput)
      .invoke("val", colorHex)
      .trigger("change", { force: true }); // Set color
  }
  // Check the selected color value
  verifySelectedColor(expectedColor) {
    cy.get(this.orgHierarchy.colorPickerInput).should(
      "have.value",
      expectedColor
    );
  }
  // Select QA officers and choose radio button
  selectQATestSeriesOfficers(COCOfficer, radioValue) {
    cy.get(this.orgHierarchy.singleRadioButton)
      .contains(radioValue)
      .click({ multiple: true });
    cy.get(this.orgHierarchy.cocDropdown).click();
    cy.get(this.orgHierarchy.dropDownSearch)
      .type(COCOfficer, { force: true })
      .type("{enter}");
    cy.get(this.orgHierarchy.oICDropdown).click();
    cy.get(this.orgHierarchy.dropDownSearch2)
      .type(COCOfficer, { force: true })
      .type("{enter}");
    cy.get(this.orgHierarchy.oICGDropdown).click();
    cy.get(this.orgHierarchy.dropDownSearch2)
      .type(buData.location, { force: true })
      .type("{enter}");
  }
  // Verify QA data is added correctly
  verifyAddedQAData() {
    this.openBU(true);
    cy.get(this.orgHierarchy.oICDropdown).should("have.text", buData.location);
  }
  // Open Organizational Hierarchy page and expand all nodes
  expandOHTree() {
    cy.visitOrganizationalHierarchy();
    this.clickExpandAllBtn();
    this.clickDialogueExpandBtn();
  }
}
export default OrganizationalHierarchy;
