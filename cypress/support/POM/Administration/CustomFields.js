import data from "../../../fixtures/Administration/CustomFields.json";
import locators from "../../../fixtures/locators.json";
import dayjs from "dayjs";
const testDataFile = "cypress/fixtures/Administration/CustomFields.json";
const writeFile = "cypress/fixtures/Administration/writeCustomFields.json";

class CustomField {
  // Unchecks the "Required" checkbox
  uncheckRequiredCheckbox() {
    cy.get(locators.administration.customFields.addCheckbox).uncheck({
      force: true,
    });
  }

  //Selects a value from the "Required" dropdown in Custom Fields form.
  selectRequiredOption(value) {
    cy.get(locators.administration.customFields.selectRequired).click({
      force: true,
    });
    cy.get(locators.administration.customFields.requiredOptionClick).type(
      `${value}{enter}`
    );
  }

  // add  the appled funtion
  selectApplicableTo(value) {
    cy.get(locators.administration.customFields.forDropdown).click();
    cy.get(locators.administration.customFields.searchFor).type(
      `${value}{enter}`
    );
  }

  //pick the calender date
  verifyCreatedDatePickerVisible() {
    cy.get(locators.administration.customFields.createdDatePickerContainer, {
      timeout: 10000,
    }).should("be.visible");
  }
  // click on the applied dropdown and select the value
  selectAppliedDropdownValue(value) {
    cy.get(locators.administration.customFields.clickApplyBtn).click();
    cy.get(locators.administration.customFields.appliedType).type(
      `${value}{enter}`
    );
  }

  //create type dropdowen and select the value

  selectTypeDropdown(value) {
    cy.get(locators.administration.customFields.selectType).click({
      force: true,
    });
    cy.get(locators.administration.customFields.typeClick).type(
      `${value}{enter}`
    );
  }

  //Verify that the table have the name
  verifyAddedCustomField() {
    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.customFieldsList).contains(
        file.name
      );
    });
  }
  // Clicks the "Save" button on the form.
  clickAddBtn() {
    cy.get(locators.administration.customFields.addBtn, {
      timeout: 30000,
    }).click();
  }
  // Enters description text in the description field
  enterDescription(text) {
    cy.get(locators.administration.customFields.descriptionTextlocator, {
      timeout: 10000,
    })
      .eq(1)
      .type(text);
  }

  //// Selects a value from the "Field Type" dropdown
  selectFieldType(value) {
    cy.get(locators.administration.customFields.fieldTypeDropdown).click();
    cy.get(locators.administration.customFields.searchInput)
      .eq(1)
      .type(`${value}{enter}`);
  }

  addName() {
    return `${data.customName}-${dayjs().format("MM-DD-YYYY_HH-mm-ss-SSS")}`;
  }

  // Fills out the "Add Custom Field" form with provided inputs.
  fillAndSubmitAddCustomFields(
    addDescription,
    descriptionText,
    addCheckbox,
    customName,
    typeField,
    typeText
  ) {
    const fieldName = customName || this.addName();

    // Type name

    cy.get(locators.administration.customFields.name, { timeout: 10000 }).type(
      fieldName
    );

    // Select "Applicable To"
    this.selectApplicableTo(data.userText);

    // Select Field Type

    // Selects a value from the "Field Type" dropdown
    if (typeField === true) {
      this.selectFieldType(data.typeText);
    }

    //  Add description
    if (addDescription === true) {
      this.enterDescription(data.descriptionText);
    }

    cy.readFile(writeFile).then((file) => {
      file.name = fieldName;
      cy.writeFile(writeFile, file);
    });
  }

  // Clicks the "Save" button on the form.
  saveBtn() {
    cy.get(locators.administration.customFields.saveBtn).should("be.visible");
    cy.get(locators.administration.customFields.saveBtn, {
      timeout: 30000,
    }).click({ force: true });
  }

  // Cancel button on the form.
  cancelBtn() {
    cy.get(locators.administration.customFields.cancelBtn).click();
  }

  //cancel on the apply form
  filterCancel() {
    cy.get(locators.administration.customFields.filterCancelBtn).click();
  }

  // check the duplication error on  the add button
  addDuplicateName() {
    //  Read the previously saved name
    cy.readFile(writeFile).then((file) => {
      const savedName = file.name;

      //  First creation
      this.clickAddBtn();
      this.fillAndSubmitAddCustomFields(
        false,
        "",
        false,
        savedName,
        true,
        data.typeText
      );
      this.saveBtn({});
      // Verify duplication error toast
      cy.verifyToastMessageText(data.duplicationMsg, 2000).should("be.visible");
    });
  }

  //Shortcut method to create a basic custom field with optional description and checkbox.
  addField(
    addDescription = false,
    descriptionText,
    addCheckbox = false,
    customName,
    typeField = false,
    typeText
  ) {
    this.clickAddBtn();
    this.fillAndSubmitAddCustomFields(
      addDescription,
      descriptionText,
      addCheckbox,
      customName,
      typeField,
      typeText
    );
    this.saveBtn();
  }

  //unchecked the radio Button
  unCheckButton() {
    this.fillAndSubmitAddCustomFields();
  }

  //Attempts to save an empty form to validate required fields.
  mandatoryFieldEmpty() {
    this.clickAddBtn();
    this.saveBtn();
    cy.verifyToastMessageText(data.mandatoryMsg, 20000).should("be.visible");
  }

  // custom name in this method
  fixedFields(customName) {
    const fieldName = customName || this.addName(); // use customName if passed
    // Type name
    cy.get(locators.administration.customFields.name, { timeout: 10000 }).type(
      fieldName
    );
    // Select "Applicable To"
    this.selectApplicableTo(data.userText);
    // Select Field Type
    this.selectFieldType(data.typeText);

    // Optional description and checkbox
    this.enterDescription(data.descriptionText);

    // this.checkRequiredCheckbox();
    // Return the field name so we can use it later
    return fieldName;
  }

  // update the exiting field

  updateFields() {
    // Read previously saved field name
    cy.readFile(writeFile).then((file) => {
      const fieldName = file.name;

      // Assert the field is created and visible
      cy.contains(data.addFirstWork, fieldName).should("exist");

      // Click the created field to edit it
      cy.contains(data.addFirstWork, fieldName).click();

      // Edit the name
      cy.get(locators.administration.customFields.name, { timeout: 10000 })
        .clear()
        .type(`${data.updatedName}${fieldName}`, {
          parseSpecialCharSequences: false,
        });

      this.uncheckRequiredCheckbox();
      this.saveBtn();
    });
  }

  //on edit mode name field empty

  editEmptyField() {
    cy.readFile(writeFile).then((file) => {
      const fieldName = file.name;

      // Find and click the existing field to edit
      cy.contains(data.addFirstWork, fieldName, { timeout: 20000 })
        .should("be.visible")
        .click();

      cy.get(locators.administration.customFields.name, {
        timeout: 20000,
      }).should("have.value", fieldName);

      cy.get(locators.administration.customFields.name, {
        timeout: 30000,
      }).clear();

      this.saveBtn({ force: true });

      //assertion add
      cy.verifyToastMessageText(data.dupText, 20000).should("be.visible");
    });
  }

  //update the name with the duplicate name

  updateFieldsWithDuplicateName() {
    // Read previously saved field name
    cy.readFile(writeFile).then((file) => {
      const existingName = file.name;

      // Create a new field with a different name
      const tempName = this.addName();

      this.clickAddBtn();
      this.fixedFields(tempName);
      this.saveBtn();

      // Now edit the new field and set its name to the existing one (to cause duplication)
      cy.contains(data.addFirstWork, tempName).click();

      cy.get(locators.administration.customFields.name, {
        timeout: 30000,
      })
        .clear()
        .type(existingName);

      this.saveBtn({ force: true });

      //  Expect duplication error message
      cy.verifyToastMessageText(data.duplicationMsg, 2000).should("be.visible");
    });
  }

  //Attempts to save a custom field form without making any changes.
  saveWithoutChanges() {
    cy.readFile(writeFile).then((file) => {
      const existingName = file.name;

      // Locate and open the field in edit mode
      cy.contains(data.addFirstWork, existingName).click();

      // Save without changing anything
      this.saveBtn();
    });
  }

  //Verifies that clicking the Cancel button discards unsaved changes
  verifyCancelDiscardsChanges() {
    this.clickAddBtn();
    this.fixedFields();
    this.cancelBtn();
    cy.reload();
  }

  // click on the filter button
  filterBtn() {
    cy.get(locators.administration.customFields.clickFilterBtn, {
      timeout: 4000,
    }).click({ force: true });
  }

  //click on the apply button
  applyBtn() {
    cy.get(locators.administration.customFields.applyButton).click({
      force: true,
    });
  }

  // Verifies that the "Applied On" dropdown allows selecting options
  applyFilterButton(
    appliedDropdown = false,
    typeDropdown = false,
    required = false,
    requiredNo = false,
    requiredAll = false
  ) {
    this.filterBtn();
    if (appliedDropdown) {
      this.selectAppliedDropdownValue(data.riskItem);
    }
    if (typeDropdown) {
      this.selectTypeDropdown(data.typeText);
    }

    if (required) {
      // For "Yes"
      this.selectRequiredOption(data.requiredYesText);
    }

    if (requiredNo) {
      this.selectRequiredOption(data.requiredNoText);
    }
    if (requiredAll) {
      this.selectRequiredOption(data.requiredAllText);
    }
    this.applyBtn();

    // Add assertions based on the filters used
    if (appliedDropdown) {
      cy.wait(3000);
      cy.get(locators.administration.customFields.tableMain, { timeout: 25000 })
        .should("be.visible")
        .and("contain.text", data.riskItem);
    }

    if (typeDropdown) {
      cy.wait(3000);
      cy.get(locators.administration.customFields.tableMain, { timeout: 15000 })
        .should("be.visible")
        .should("contain.text", data.typeText);
    }

    if (required) {
      cy.wait(3000);
      cy.get(locators.administration.customFields.tableMain, {
        timeout: 40000,
      }).each(($el) => {
        cy.wrap($el)
          .should("be.visible")
          .should("contain.text", data.requiredYesText); // usually "Yes"
      });
    }

    if (requiredNo) {
      cy.wait(3000);
      cy.get(locators.administration.customFields.tableMain).each(($el) => {
        cy.wrap($el).should("contain.text", data.requiredNoText); // usually "No"
      });
    }
  }

  //Verifies that no data is displayed or filtered
  invalidAppliedOnFilter() {
    this.filterBtn();
    this.selectAppliedDropdownValue(data.riskItemError);

    //type invalid name

    this.selectTypeDropdown(data.typeDataError);

    // reuired invaild apply
    this.selectRequiredOption(data.requiredYesTextError);
  }

  // created date filter apply
  createdDateFilter() {
    const today = dayjs().date(); // Gets today's day of the month (e.g., 1 to 31)

    cy.get(locators.administration.customFields.datePickerSelect, {
      timeout: 10000,
    })
      .should("be.visible")
      .click(); // Open the date picker

    this.verifyCreatedDatePickerVisible();

    // Select today's date from the date picker
    cy.get(locators.administration.customFields.selectDatePicker)
      .contains(new RegExp(`^${today}$`)) // Match exact day number (e.g., "1", not "11")
      .click({ force: true });
  }

  // select the filter through date .
  applyDateFilter() {
    const todayFormatted = dayjs().format("MM/DD/YYYY");
    this.filterBtn(); // Open the filter modal

    this.createdDateFilter();

    // Apply the filter
    this.applyBtn();

    //added the assertion
    cy.get(locators.administration.customFields.tableMain)
      .should("be.visible")
      .should("contain.text", todayFormatted);
  }

  //edit cancel button
  editCancel() {
    cy.get(locators.administration.customFields.clickEditBtn)
      .contains(data.cancelText)
      .click();
  }

  //Clicks the "Clear" button in the filter modal to remove all applied filters.
  clickClearFilterButtonOnly() {
    cy.get(locators.administration.customFields.clearBtnFilter).click({
      force: true,
    });
  }

  //Opens the filter modal, applies filter options, and then clears them using the "Clear" button.

  applyFiltersThenClear() {
    this.filterBtn();

    //click on the applied dropdown
    this.selectAppliedDropdownValue(data.riskItem);

    //click on the type dropdown
    this.selectTypeDropdown(data.typeText);

    this.clickClearFilterButtonOnly();

    //  Assertion: Confirm filters are cleared and full list is shown again
    cy.get(locators.administration.customFields.customFieldsList)
      .its("length")
      .should("be.greaterThan", 0);
  }

  //click on the filter cancel button
  cancelButtonDiscardsChanges() {
    this.filterBtn();
    this.filterCancel();
  }

  // Retrieves the list of added Custom Fields and asserts that the list is not empty.
  viewFieldList() {
    cy.get(locators.administration.customFields.customFieldsList)
      .its("length")
      .should("be.greaterThan", 0);
  }

  //Clicks the pagination button to go to the next page and waits for the loader to disappear.
  clickPagination() {
    cy.get(locators.general.gridTopDoubleRightPageBtn).click();
    cy.waitForTopMsgLoaderToDisappear(20000);
    this.viewFieldList();
  }

  // upadated data filter
  updatedDateFilter() {
    const today = new Date();
    const day = today.getDate().toString(); // Get today's day number (1–31)

    cy.get(locators.administration.customFields.updatedIconSelect, {
      timeout: 10000,
    }).click(); // Open the date picker

    this.verifyCreatedDatePickerVisible();

    cy.get(locators.administration.customFields.selectDatePicker)
      .contains(new RegExp(`^${day}$`)) // Ensure it matches exact day number
      .click({ force: true });
  }

  // check the updated field though date
  updatedDate() {
    const todayFormatted = dayjs().format("MM/DD/YYYY");
    this.updateFields();
    this.editCancel();
    this.filterBtn();
    this.updatedDateFilter();
    this.applyBtn();

    //added the assertion
    cy.get(locators.administration.customFields.tableMain, { timeout: 20000 })
      .should("be.visible")
      .should("contain.text", todayFormatted);
  }

  //Checks that each "Updated" column cell shows the expected date.
  verifyUpdatedColumnDates() {
    this.updateFields();
    this.editCancel();

    const today = dayjs().format("MM/DD/YYYY");
    cy.get(locators.administration.customFields.tableMain, { timeout: 20000 })
      .first()
      .should("contain.text", today);
  }

  // Deletes the top field and verifies it's removed from the list
  deleteFieldAndVerify(confirmDelete = true) {
    // Step 1: Add a custom field
    this.clickAddBtn();
    const fieldName = this.fixedFields(); // Get the field name
    this.saveBtn();

    // Step 2: Verify field exists in the list
    cy.contains(data.addFirstWork, fieldName, { timeout: 10000 }).should(
      "exist"
    );

    // Step 3: Click delete button to open confirmation dialog
    cy.contains(data.addFirstWork, fieldName)
      .parents("tr")
      .find(locators.administration.customFields.fieldDltBtn)
      .click({ force: true });

    // Step 4: Depending on parameter, cancel or confirm delete
    if (confirmDelete) {
      // Confirm deletion
      cy.get(locators.administration.customFields.clickDltBtn).click();

      // Step 5: Assert the field is removed from the list
      cy.contains(data.addFirstWork, fieldName).should("not.exist");
    } else {
      // Cancel deletion
      cy.get(locators.administration.customFields.dltDta).click();

      // Step 5: Assert the field still exists (deletion aborted)
      cy.contains(data.addFirstWork, fieldName).should("exist");
    }
  }

  // Verifies that all expected columns are displayed in the custom fields table header.
  verifyAllColumnsDisplayed() {
    const expectedHeaders = [
      data.nameText,
      data.typeWord,
      data.appliedText,
      data.appliedInstanceText,
      data.createdTtext,
      data.updatedText,
      data.requiredText,
    ];

    expectedHeaders.forEach((header) => {
      cy.get(locators.administration.customFields.tableHead)
        .contains("th", header)
        .should("exist");
    });
  }
  // Checks that Cancel button discards changes
  verifyCancelButtonFunctionality() {
    this.filterBtn();

    cy.get(locators.administration.customFields.filterCancelBtn).click();

    //  Assertion: Ensure the Custom Fields page is visible
    cy.url().should("include", data.urlLink);
  }
  // Verifies that no filters are applied and all fields are visible
  verifyEmptyFilterDialog() {
    this.filterBtn();
    this.applyBtn();

    // Assert that at least one custom field is visible in the list
    cy.get(locators.administration.customFields.customFieldsList)
      .its("length")
      .should("be.greaterThan", 0);
  }

  // Adds and verifies a custom field on User or Risk screen
  addCustomField({ fieldType, forOption, options = [] } = {}) {
    this.clickAddBtn();

    const fieldName = data.customName + dayjs().format("MM/DD/YYYY HH:mm:ss");

    // Clear and type unique field name
    cy.get(locators.administration.customFields.name, { timeout: 10000 })
      .clear()
      .type(fieldName);

    // Select "Applicable To" dropdown and choose option
    this.selectApplicableTo(forOption);

    // Select Field Type
    this.selectFieldType(fieldType);

    // Add options if needed (for selects, radio, etc)
    if (options.length > 0) {
      options.forEach((opt) => {
        cy.get(locators.administration.customFields.optionField, {
          timeout: 10000,
        })
          .should("be.visible")
          .type(`${opt}{enter}`);
      });
    }

    // Save the field
    this.saveBtn();
    cy.readFile(writeFile).then((file) => {
      file.name = fieldName;
      cy.writeFile(writeFile, file);
    });
  }

  // add the assertion to the user screen
  assertionUserScreen() {
    cy.get(locators.administration.customFields.userAddClick, {
      timeout: 10000,
    }).click({ force: true });

    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.userForm).contains(file.name);
    });
  }
  // add the assertion to the risk screen
  assertionRiskScreen() {
    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.riskRegisterVist, {
        timeout: 30000,
      })
        .should("exist")
        .contains(file.name, { timeout: 30000 })
        .should("exist");
    });
  }
  // add the assertion to the role screen
  assertionRoleScreen() {
    cy.get(locators.administration.customFields.addRoleClick).click();

    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.roleForm).contains(file.name);
    });
  }

  // add the assertion to the user group  screen
  assertionUserGroupScreen() {
    cy.get(locators.administration.customFields.userGroupAddClick).click();

    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.userGroupForm, {
        timeout: 30000,
      }).contains(file.name);
    });
  }

  // add the assertion to the OH  screen
  assertionOHScreen() {
    cy.get(locators.administration.customFields.clickAddOrg).click({
      force: true,
    });

    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.OrgForm).contains(file.name);
    });
  }

  // add the assertion to the site  screen
  assertionSiteScreen() {
    cy.get(locators.administration.customFields.clickAddOrg).click({
      force: true,
    });

    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.siteForm).contains(file.name);
    });
  }

  // add the assertion to the assessment  screen
  assertionAssessmentScreen() {
    cy.get(locators.administration.customFields.assessmentAddClick).click({
      force: true,
    });

    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.assesmentForm).contains(
        file.name
      );
    });
  }

  // add the assertion to the Question bank  screen
  assertionQuestionBankScreen() {
    cy.get(locators.administration.customFields.questionAddClick).click({
      force: true,
    });

    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.questionForm).contains(
        file.name
      );
    });
  }

  // add the assertion to the assessment Question   screen
  assertionAssessmentQuestionScreen() {
    cy.get(locators.administration.customFields.questionAddClick).click({
      force: true,
    });

    const questionBankName =
      data.questionText + dayjs().format("MM/DD/YYYY HH:mm:ss");

    cy.get(locators.administration.customFields.questionInput).type(
      questionBankName
    );

    cy.get(locators.administration.customFields.frameworkClick).click();
    cy.get(locators.administration.customFields.frameworkType).type(
      `${data.frameworkText}{enter}`
    );

    cy.get(locators.administration.customFields.questionBankSave, {
      timeout: 30000,
    })
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

    cy.get(locators.administration.customFields.questionTabOpen).click({
      force: true,
    });

    cy.get(locators.administration.customFields.surveryAddBtn).click();

    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.surveyForm).contains(
        file.name
      );
    });
  }

  // add the assertion to the risk definition  screen
  assertionQuestionSurveyScreen() {
    cy.get(locators.administration.customFields.riskDefAddClick).click();
    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.riskForm).contains(file.name);
    });
  }

  // add the assertion to the control  definition  screen
  assertionControlDefScreen() {
    cy.get(locators.administration.customFields.controlDefAdd).click();
    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.controlForm).contains(
        file.name
      );
    });
  }

  // add the assertion to the framework screen
  assertionFrameworkScreen() {
    cy.get(locators.administration.customFields.frameworlAddClick).click();
    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.frameworkForm).contains(
        file.name
      );
    });
  }

  // add the assertion to the kxi data screen
  assertionKxiDataScreen() {
    // Step 1: Click the dropdown toggle button to show the hidden dropdown
    cy.get(locators.administration.customFields.kxiDataToggle).click();

    // Step 2: Now click the "Add" button inside the dropdown
    cy.get(locators.administration.customFields.kxiDataAddClick)
      .should("exist")
      .click();
    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.kxiDataForm).contains(
        file.name
      );
    });
  }
  // add the assertion to the kxi def screen
  assertionKxiDefScreen() {
    // Step 1: Click the dropdown toggle button to show the hidden dropdown
    cy.get(locators.administration.customFields.kxiDataToggle).click();

    // Step 2: Now click the "Add" button inside the dropdown
    cy.contains(locators.administration.customFields.kxiDefAdd, data.kxidef)
      .should("be.visible")
      .click();
    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.kxiDataForm).contains(
        file.name
      );
    });
  }

  /**
   * Get the custom field name from the data file.
   *
   * This method reads the data from the specified file and returns the "name" property.
   *
   * @returns {Cypress.Chainable} A Cypress chainable object that resolves to the "name" property from the data file.
   */
  getCustomFieldName() {
    return cy.readFile(writeFile).then((data) => {
      return data.name;
    });
  }

  /**
   * Verifies that the custom field name is not present after descending sort.
   *
   * This method performs the following actions:
   * - Reads the test data file to retrieve necessary information for sorting.
   * - Clicks the column header to trigger a sort (descending).
   * - Asserts that the custom field name is not present in the list of custom fields after sorting.
   *
   * @param {string} customFieldName The name of the custom field to verify is not present in the list.
   * @returns {Cypress.Chainable} A Cypress chainable object that performs the assertions and actions.
   */
  verifyFieldAtTopAfterDescendingSort(customFieldName) {
    cy.readFile(testDataFile).then(($data) => {
      // Click on the table header to sort the column (descending)
      cy.get(locators.administration.customFields.tableHead)
        .contains($data.createdTtext) // Click the header by text
        .click();

      // Verify that the custom field name is not found in the custom fields list
      cy.get(locators.administration.customFields.customFieldsList).should(
        "not.contain",
        customFieldName
      );
    });
  }

  /**
   * Logs in again by visiting the base URL and performing the login action.
   *
   * This method retrieves user credentials from environment variables and logs the user in
   * by calling the `cy.login()` function with the retrieved credentials.
   *
   * @returns {Cypress.Chainable} A Cypress chainable object that performs the login action.
   */
  sessionLoginAgain() {
    const userLogin = Cypress.env("kxi").customer;
    // Retrieve user credentials from environment variables
    cy.readFile(testDataFile).then(($data) => {
      cy.visit(Cypress.config("baseUrl")); // Visit the base URL
      cy.loginWithSession(
        "login with KXI Customer User",
        userLogin.withRM.username,
        userLogin.withRM.password,
        userLogin.withRM.key
      );
    });
  }

  /**
   * Verifies that the data is persistent after logging in.
   *
   * This method reads the test data file and checks if a custom field with the updated name
   * is present in the list of custom fields after login.
   *
   * @param {string} fieldName The name of the custom field to check for persistence.
   * @returns {Cypress.Chainable} A Cypress chainable object that performs the assertion to verify data persistence.
   */
  verifyDataPersistenceAfterLogin(fieldName) {
    cy.readFile(testDataFile).then((data) => {
      // Verify if the custom field with updated name is present in the list
      cy.get(locators.administration.customFields.customFieldsList)
        .contains(fieldName, { timeout: 20000 })
        .should("be.visible");
      // Assert that the custom field name is in the list
    });
  }

  /**
   * Clicks on the "Created Date" column header twice to sort the table in descending order.
   *
   * This method performs the following actions:
   * - Reads the test data file to retrieve the header text for the "Created Date" column.
   * - Waits for any loading message to disappear before interacting with the table.
   * - Double-clicks the "Created Date" column header twice to sort the table.
   *
   * @returns {Cypress.Chainable} A Cypress chainable object that performs the sorting action.
   */
  clickSortingWithCreatedDate() {
    cy.readFile(testDataFile).then(($data) => {
      // Loop to double-click the "Created Date" header twice
      for (let i = 0; i < 2; i++) {
        // Wait for any loading message to disappear
        cy.waitForTopMsgLoaderToDisappear(10000);
        // Click on the "Created Date" header twice to trigger sorting
        cy.get(locators.administration.customFields.tableHead)
          .should("be.visible")
          .contains($data.createdTtext)
          .as("createdText"); // Click the header by text
        cy.get("@createdText").dblclick({ force: true });
      }
    });
  }

  // add the assertion to the control items screen
  assertionControlItemsScreen() {
    cy.waitForTopMsgLoaderToDisappear(20000);

    cy.get(locators.administration.customFields.subGridOpen, { timeout: 30000 })
      .should("exist")

      .first()
      .click();

    cy.get(locators.administration.customFields.addInstanceClick)
      .should("be.visible")
      .click();
    cy.readFile(writeFile).then((file) => {
      cy.get(locators.administration.customFields.instanceForm).contains(
        file.name
      );
    });
  }
}

export default CustomField;
