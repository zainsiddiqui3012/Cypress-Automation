import locators from "../../../../fixtures/locators.json";
import WithSubgridData from "../../../../fixtures/RiskRegister/Add_Link_Control_Instance/WithSubgrid.json";
import RiskRegister_PO from "../../../../support/POM/RiskModule_PO/RiskRegister_PO.js";

const subgridUser = Cypress.env("riskManagement").subgridUser;
const riskRegister_PO = new RiskRegister_PO();

class SubGridControlInstance {
  constructor() {
    this.locators = locators.risk.riskRegister;
    this.testData = WithSubgridData;
  }

  /**
   * Scrolls the grid horizontally to the center to ensure columns are visible
   */
  scrollToHorizontalCenter() {
    // First scroll horizontally to ensure the column is visible
    cy.get(this.locators.scrollHorizontal).scrollTo("center");
  }
  /**
   * Generic method to perform an action and verify an element becomes visible
   * @param {string} actionLocator - CSS selector of the element to click
   * @param {string} visibleLocator - CSS selector of the element that should become visible after the action
   */
  actionControlInstances(actionLocator, visibleLocator) {
    cy.get(actionLocator, { timeout: 10000 }).click({ timeout: 10000 });
    cy.get(visibleLocator, { timeout: 10000 }).should("be.visible");
  }

  /**
   * Clicks the Add Control Instance button and verifies the control instance ID field is visible
   */
  clickAddControlInstanceBtn() {
    this.actionControlInstances(
      this.locators.subGridControlInstance.addInstanceClick,
      this.locators.subGridControlInstance.controlInstanceIdField
    );
  }

  // Modal Operations
  /**
   * Verifies that the control instance modal is open and visible
   */
  verifyModalIsOpen() {
    cy.get(this.locators.subGridControlInstance.modal).should("be.visible");
    cy.get(this.locators.subGridControlInstance.form).should("exist");
  }

  /**
   * Clicks Cancel button and verifies that the control instance modal is closed
   */
  verifyModalIsClosed() {
    this.controlInstanceClickSaveCancel(this.testData.cancel, "Cancel");
    cy.get(this.locators.subGridControlInstance.modal).should("not.be.visible");
  }

  // Tree Operations
  /**
   * Generic method to select an item from a tree view by double-clicking
   * @param {string} treeContainer - CSS selector for the tree container element
   * @param {string} treeItems - CSS selector for tree item elements
   * @param {string} name - The name of the tree item to select
   */
  selectFromTree(treeContainer, treeItems, name) {
    cy.get(treeContainer).should("be.visible");
    cy.get(treeItems).contains(name).dblclick();
  }

  /**
   * Selects a control definition from the tree view by double-clicking on it
   * @param {string} controlDefinitionName - The name of the control definition to select from the tree
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  selectControlDefinitionFromTree(controlDefinitionName) {
    return this.selectFromTree(
      this.locators.subGridControlInstance.treeContainer,
      this.locators.subGridControlInstance.treeItems,
      controlDefinitionName
    );
  }

  /**
   * Selects a control category from the tree view by double-clicking on it
   * @param {string} controlCategoryName - The name of the control category to select from the tree
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  selectControlCategoryFromTree(controlCategoryName) {
    return this.selectFromTree(
      this.locators.subGridControlInstance.treeContainer,
      this.locators.subGridControlInstance.treeItems,
      controlCategoryName
    );
  }

  // Field Input Operations
  /**
   * Clears the control name input field
   */
  clearControlName() {
    cy.get(this.locators.subGridControlInstance.controlNameField).clear();
  }

  /**
   * Generic method to clear and enter a value into any input field
   * @param {string} fieldLocator - CSS selector for the input field
   * @param {string|number} value - The value to be entered
   * @param {Object} [options={}] - Optional Cypress options (e.g., timeout)
   */
  enterFieldValue(fieldLocator, value, options = {}) {
    cy.get(fieldLocator, options).clear().type(value, options);
  }

  /**
   * Enters the control name in the corresponding field with extended timeout
   * @param {string} controlName - The name of the control to be entered
   */
  enterControlName(controlName) {
    this.enterFieldValue(
      this.locators.subGridControlInstance.controlNameField,
      controlName,
      { timeout: 100000 } // specific timeout for this field
    );
  }

  /**
   * Enters the optimal role for the control
   * @param {string} role - The role name to be entered in the optimal role field
   */
  enterOptimalRole(role) {
    this.enterFieldValue(
      this.locators.subGridControlInstance.optimalRoleField,
      role
    );
  }

  /**
   * Enters the effectiveness percentage value
   * @param {string|number} value - The effectiveness percentage value (0-100)
   */
  enterEffectiveness(value) {
    this.enterFieldValue(
      this.locators.subGridControlInstance.effectivenessField,
      value
    );
  }

  /**
   * Enters the weight percentage value
   * @param {string|number} value - The weight percentage value (0-100)
   */
  enterWeight(value) {
    this.enterFieldValue(
      this.locators.subGridControlInstance.weightField,
      value
    );
  }

  /**
   * Enters the implemented percentage value
   * @param {string|number} value - The implementation percentage value (0-100)
   */
  enterImplemented(value) {
    this.enterFieldValue(
      this.locators.subGridControlInstance.implementedField,
      value
    );
  }

  clickElement(locator) {
    cy.get(locator, { timeout: 10000 }).last().click({ force: true });
  }
  typeDescription(text) {
    cy.get(this.locators.subGridControlInstance.controlDescriptionTextfield, {
      delay: 1000,
    })
      .should("exist")
      .then(($iframe) => {
        const body = $iframe.contents().find("body");

        cy.wrap(body).type(`${text}{enter}`, { force: true });
      });
  }

  clickBoldFormat() {
    this.clickElement(
      this.locators.subGridControlInstance.richTextButtons.bold
    );
  }

  clickItalicFormat() {
    this.clickElement(
      this.locators.subGridControlInstance.richTextButtons.italic
    );
  }

  clickUnderline() {
    this.clickElement(
      this.locators.subGridControlInstance.richTextButtons.underline
    );
  }

  clickBulletList() {
    this.clickElement(
      this.locators.subGridControlInstance.richTextButtons.bulletList
    );
  }

  clickNumberList() {
    this.clickElement(
      this.locators.subGridControlInstance.richTextButtons.numberedList
    );
  }

  /**
   * Formats the description text with rich text formatting options
   * @param {Object} options - Formatting options object
   * @param {boolean} [options.bold] - Apply bold formatting
   * @param {boolean} [options.italic] - Apply italic formatting
   * @param {boolean} [options.underline] - Apply underline formatting
   * @param {boolean} [options.bulletList] - Apply bullet list formatting
   * @param {boolean} [options.numberedList] - Apply numbered list formatting
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  formatDescriptionWithRichText() {
    this.scrollDown(0, 100);

    const formattingActions = [
      () => this.clickBoldFormat(),
      () => this.clickItalicFormat(),
      () => this.clickUnderline(),
      () => this.clickBulletList(),
      () => this.clickNumberList(),
    ];

    formattingActions.forEach((action) => {
      action();
      this.typeDescription(
        this.testData.addControlInstance.richTextFormatting
          .controlDescriptionText
      );
    });
  }

  /**
   * Generic method to select a radio button option (Yes/No)
   * @param {string} yesLocator - CSS selector for the "Yes" radio button
   * @param {string} noLocator - CSS selector for the "No" radio button
   * @param {string} value - "Yes" or "No" to indicate which option to select
   */
  selectRadioOption(yesLocator, noLocator, value) {
    if (value === "Yes") {
      cy.get(yesLocator).check({ force: true });
    } else {
      cy.get(noLocator).check({ force: true });
    }
  }

  /**
   * Selects whether the control is a primary control
   * @param {string} value - "Yes" or "No" to indicate if this is a primary control
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  selectPrimaryControl(value) {
    this.scrollDown(0, 800); // keep scroll if needed
    this.selectRadioOption(
      this.locators.subGridControlInstance.primaryControlYes,
      this.locators.subGridControlInstance.primaryControlNo,
      value
    );
  }

  /**
   * Selects whether the control prevents fraud
   * @param {string} value - "Yes" or "No" to indicate if this control prevents fraud
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  selectPreventsFraud(value) {
    this.selectRadioOption(
      this.locators.subGridControlInstance.preventsFraudYes,
      this.locators.subGridControlInstance.preventsFraudNo,
      value
    );
  }

  /**
   * Generic method to select a value from a dropdown by typing and pressing enter
   * @param {string} dropdownLocator - CSS selector for the dropdown trigger element
   * @param {string} searchLocator - CSS selector for the dropdown search input field
   * @param {string} value - The value to type and select from the dropdown
   */
  selectDropdown(dropdownLocator, value) {
    cy.get(dropdownLocator).select(value, { force: true });
  }

  /**
   * Selects control type(s) from the dropdown
   * @param {string} controlType - The control type to select from the dropdown
   */
  selectControlTypes(controlType) {
    this.scrollDown(0, 800);
    this.selectDropdown(
      this.locators.subGridControlInstance.controlTypesSearch,
      controlType
    );
  }

  /**
   * Selects the control frequency from the dropdown
   * @param {string} frequency - The frequency option to select (e.g., "Daily", "Weekly", "Monthly")
   */
  selectControlFrequency(frequency) {
    this.selectDropdown(
      this.locators.subGridControlInstance.controlFrequencySearch,
      frequency
    );
  }

  /**
   * Selects the control owner from the dropdown
   * @param {string} controlOwner - The name of the control owner to select
   */
  selectControlOwner(controlOwner) {
    this.scrollDown(0, 800);
    this.selectDropdown(
      this.locators.subGridControlInstance.controlOwnerSearch,
      controlOwner
    );
  }

  /**
   * Selects the control tester from the dropdown
   * @param {string} controlTester - The name of the control tester to select
   */
  selectControlTester(controlTester) {
    this.selectDropdown(
      this.locators.subGridControlInstance.controlTesterSearch,
      controlTester
    );
  }

  /**
   * Selects the control operations from the dropdown
   * @param {string} controlOperations - The control operations option to select
   */
  selectControlOperations(controlOperations) {
    this.selectDropdown(
      this.locators.subGridControlInstance.controlOperationsSearch,
      controlOperations
    );
  }

  /**
   * Selects the control execution option from the dropdown
   * @param {string} controlExecution - The control execution option to select
   */
  selectControlExecution(controlExecution) {
    this.selectDropdown(
      this.locators.subGridControlInstance.controlExecutionSearch,
      controlExecution
    );
  }

  /**
   * Selects control definition categories from the dropdown
   * @param {string} controlDefinitionCategories - The control definition category to select
   */
  selectControlDefinitionCategories(controlDefinitionCategories) {
    this.selectDropdown(
      this.locators.subGridControlInstance.controlDefinitionCategoriesSearch,
      controlDefinitionCategories
    );
  }

  /**
   * Selects the control strength from the dropdown
   * @param {string} controlStrength - The control strength level (e.g., "Low", "Medium", "High")
   */
  selectControlStrength(controlStrength) {
    this.selectDropdown(
      this.locators.subGridControlInstance.controlStrengthSearch,
      controlStrength
    );
  }

  /**
   * Clicks the Save or Cancel button in the control instance modal
   * @param {number} index - The index of the button element
   * @param {string} label - The button label text ("Save" or "Cancel")
   */
  controlInstanceClickSaveCancel(index, label) {
    cy.get(this.locators.subGridControlInstance.controlInstanceSaveCancelBtn)

      .eq(index)
      .should("have.text", label)
      .click({ force: true });
  }
  /**
   * Clicks Save button and verifies there are no validation errors for control frequency field
   */
  verifyControlFrequencyNoValidationError() {
    this.controlInstanceClickSaveCancel(this.testData.save, "Save");
    cy.get(this.locators.subGridControlInstance.controlFrequencyDropdown, {
      timeout: 50000,
    }).scrollIntoView();

    this.verifyNoValidationError();
  }

  /**
   * Saves control instance with valid data by dynamically calling methods based on field mappings from test data
   * Uses controlInstanceFieldsMapping array from test data to determine which fields to populate
   * @param {Object} data - Object containing control instance field data to be entered
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  saveWithValidData(data) {
    this.testData.controlInstanceFieldsMapping.forEach((field) => {
      if (data[field.key] && typeof this[field.method] === "function") {
        this[field.method](data[field.key]);
      }
    });
    this.controlInstanceClickSaveCancel(this.testData.save, "Save");
    return this;
  }

  // Validation Operations
  /**
   * Verifies that a validation error message is displayed
   * @param {string} [errorMessage] - Optional specific error message to verify
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyValidationError(errorMessage) {
    cy.get(this.locators.subGridControlInstance.validationError).should(
      "be.visible"
    );
    if (errorMessage) {
      cy.contains(errorMessage).should("be.visible");
    }
  }

  /**
   * Verifies that no validation error messages are displayed
   */
  verifyNoValidationError() {
    cy.get(this.locators.subGridControlInstance.validationError).should(
      "not.exist"
    );
  }
  /**
   * Verifies that a required field exists in the DOM
   * @param {string} field - The CSS selector of the field to verify
   */
  verifyRequiredField(field) {
    cy.get(field).should("exist");
  }

  /**
   * Generic method to verify that a field has the expected value
   * @param {string} fieldLocator - CSS selector of the field to verify
   * @param {string|number} expectedValue - The expected value of the field
   */
  verifyFieldValue(fieldLocator, expectedValue) {
    cy.get(fieldLocator).should("have.value", expectedValue);
  }

  /**
   * Verifies that the control instance ID field has the expected value
   * @param {string} expectedValue - The expected control instance ID value
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyControlIdValue(expectedValue) {
    return this.verifyFieldValue(
      this.locators.subGridControlInstance.controlInstanceIdField,
      expectedValue
    );
  }

  /**
   * Verifies that the control name field has the expected value
   * @param {string} expectedValue - The expected control name value
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyControlNameValue(expectedValue) {
    return this.verifyFieldValue(
      this.locators.subGridControlInstance.controlNameField,
      expectedValue
    );
  }

  /**
   * Verifies that the primary control field has the expected value
   * @param {string} expectedValue - The expected primary control value ("Yes" or "No")
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyPrimaryControlValue(expectedValue) {
    return this.verifyFieldValue(
      this.locators.subGridControlInstance.primaryControlYes,
      expectedValue
    );
  }

  /**
   * Verifies that the prevents fraud field has the expected value
   * @param {string} expectedValue - The expected prevents fraud value ("Yes" or "No")
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyPreventsFraudValue(expectedValue) {
    return this.verifyFieldValue(
      this.locators.subGridControlInstance.preventsFraudYes,
      expectedValue
    );
  }

  /**
   * Verifies that the effectiveness field has the expected value
   * @param {string|number} expectedValue - The expected effectiveness percentage value
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyEffectivenessValue(expectedValue) {
    return this.verifyFieldValue(
      this.locators.subGridControlInstance.effectivenessField,
      expectedValue
    );
  }

  /**
   * Verifies that the weight field has the expected value
   * @param {string|number} expectedValue - The expected weight percentage value
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyWeightValue(expectedValue) {
    return this.verifyFieldValue(
      this.locators.subGridControlInstance.weightField,
      expectedValue
    );
  }

  /**
   * Verifies that the implemented field has the expected value
   * @param {string|number} expectedValue - The expected implementation percentage value
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyImplementedValue(expectedValue) {
    return this.verifyFieldValue(
      this.locators.subGridControlInstance.implementedField,
      expectedValue
    );
  }

  /**
   * Verifies that the CKEditor description field contains the expected value
   * @param {string} expectedValue - The expected description text to verify
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyControlDescriptionValue(expectedValue) {
    cy.window().then((win) => {
      const ckeditorInstance =
        win.CKEDITOR.instances["controlInstanceDescription"];
      if (ckeditorInstance) {
        const content = ckeditorInstance.getData();
        expect(content).to.include(expectedValue);
      }
    });
    return this;
  }

  /**
   * Generic method to verify that an element contains the expected text
   * @param {string} elementLocator - CSS selector of the element to verify
   * @param {string} expectedValue - The expected text that should be contained in the element
   */
  verifyValueContains(elementLocator, expectedValue) {
    cy.get(elementLocator).should("contain", expectedValue);
  }

  /**
   * Verifies that the control type dropdown contains the expected value
   * @param {string} expectedValue - The expected control type value
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyControlTypeValue(expectedValue) {
    return this.verifyValueContains(
      this.locators.subGridControlInstance.controlTypesDropdown,
      expectedValue
    );
  }

  /**
   * Verifies that the control frequency dropdown contains the expected value
   * @param {string} expectedValue - The expected control frequency value
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyControlFrequencyValue(expectedValue) {
    return this.verifyValueContains(
      this.locators.subGridControlInstance.controlFrequencyDropdown,
      expectedValue
    );
  }

  /**
   * Verifies that the control owner dropdown contains the expected value
   * @param {string} expectedValue - The expected control owner name
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyControlOwner(expectedValue) {
    return this.verifyValueContains(
      this.locators.subGridControlInstance.controlOwnerDropdown,
      expectedValue
    );
  }

  /**
   * Verifies that the control tester dropdown contains the expected value
   * @param {string} expectedValue - The expected control tester name
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyControlTester(expectedValue) {
    return this.verifyValueContains(
      this.locators.subGridControlInstance.controlTesterDropdown,
      expectedValue
    );
  }

  /**
   * Verifies that the control strength dropdown contains the expected value
   * @param {string} expectedValue - The expected control strength level
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyControlStrength(expectedValue) {
    return this.verifyValueContains(
      this.locators.subGridControlInstance.controlStrengthDropdown,
      expectedValue
    );
  }

  /**
   * Verifies that the control operations dropdown contains the expected value
   * @param {string} expectedValue - The expected control operations value
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyControlOperationsValue(expectedValue) {
    return this.verifyValueContains(
      this.locators.subGridControlInstance.controlOperationsDropdown,
      expectedValue
    );
  }

  /**
   * Verifies that the control definition categories dropdown contains the expected value
   * @param {string} expectedValue - The expected control definition categories value
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyControlDefinitionsCategoriesValue(expectedValue) {
    return this.verifyValueContains(
      this.locators.subGridControlInstance.controlDefinitionCategoriesDropdown,
      expectedValue
    );
  }

  /**
   * Verifies that the optimal role field contains the expected value
   * @param {string} expectedValue - The expected optimal role value
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyOptimalRoleValue(expectedValue) {
    cy.get(this.locators.subGridControlInstance.optimalRoleField).should(
      "contain.value",
      expectedValue
    );
  }

  /**
   * Verifies that the control execution dropdown contains the expected value
   * @param {string} expectedValue - The expected control execution value
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyControlExecutionValue(expectedValue) {
    cy.get(this.locators.subGridControlInstance.controlExecutionDropdown, {
      timeout: 50000,
    }).contains(expectedValue);
  }

  /**
   * Scrolls down the modal window to a specific position
   * @param {number} x - The horizontal scroll position in pixels
   * @param {number} y - The vertical scroll position in pixels
   */
  scrollDown(x, y) {
    cy.get(this.locators.subGridControlInstance.modal).scrollTo(x, y, {
      duration: 500,
    });
  }

  /**
   * Verifies that control instance fields are auto-populated with values from control definition selection
   * Uses controlDefinitionSelection.autoPopulateFields test data for expected values
   * Scrolls through the form to verify all auto-populated fields
   */
  verifyAutoPopulatedData() {
    this.verifyControlIdValue(
      this.testData.controlDefinitionSelection.autoPopulateFields
        .controlInstanceId
    );
    this.verifyControlNameValue(
      this.testData.controlDefinitionSelection.autoPopulateFields.controlName
    );
    this.verifyControlDescriptionValue(
      this.testData.controlDefinitionSelection.autoPopulateFields
        .controlDescription
    );
    this.scrollDown(0, 400, { timeout: 50000 });
    this.verifyControlTypeValue(
      this.testData.controlDefinitionSelection.autoPopulateFields.controlTypes
    );
    this.verifyPrimaryControlValue(
      this.testData.controlDefinitionSelection.autoPopulateFields.primaryControl
    );
    this.verifyPreventsFraudValue(
      this.testData.controlDefinitionSelection.autoPopulateFields.preventsFraud
    );
    this.verifyControlFrequencyValue(
      this.testData.controlDefinitionSelection.autoPopulateFields
        .controlFrequency
    );
    this.verifyOptimalRoleValue(
      this.testData.controlDefinitionSelection.autoPopulateFields.optimalRole
    );

    this.verifyControlOperationsValue(
      this.testData.controlDefinitionSelection.autoPopulateFields
        .controlOperations
    );

    this.verifyControlDefinitionsCategoriesValue(
      this.testData.controlDefinitionSelection.autoPopulateFields
        .controlDefinitionCategories
    );
    this.scrollDown(0, 1300, { timeout: 50000 });

    this.verifyControlExecutionValue(
      this.testData.controlDefinitionSelection.autoPopulateFields
        .controlExecution,
      { timeout: 50000 }
    );
    this.verifyEffectivenessValue(
      this.testData.controlDefinitionSelection.autoPopulateFields.effectiveness
    );
    this.verifyWeightValue(
      this.testData.controlDefinitionSelection.autoPopulateFields.weight
    );
    this.verifyImplementedValue(
      this.testData.controlDefinitionSelection.autoPopulateFields.implemented
    );
  }

  // Toast/Success Message
  /**
   * Verifies that a success message is displayed on the page
   * @param {string} message - The success message text to verify
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifySuccessMessage(message) {
    cy.contains(message, { timeout: 10000 }).should("be.visible");
  }

  // Risk Register Linking Verification
  /**
   * Verifies that the control is linked to the risk register and displays the correct control name
   * @param {string} controlName - The expected control name that should be displayed in the risk register
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyLinkedToRiskRegister(controlName) {
    this.controlInstanceClickSaveCancel(this.testData.cancel, "Cancel", {
      timeout: 50000,
    });

    cy.get(this.locators.subGridControlInstance.riskRegisterControlField)
      .eq(1)
      .should("contain", controlName);
  }

  /**
   * Opens the control flyover by clicking Cancel button, waiting for data load, and accessing control options
   * Switches to the iframe containing control flyover content and verifies control instance name is visible
   */
  openControlFlyover() {
    this.controlInstanceClickSaveCancel(this.testData.cancel, "Cancel");
    // Static wait is required here because when we open Control Flyover white screen appears until the data is loaded
    cy.wait(5000);
    cy.waitForTopMsgLoaderToDisappear(300000);
    cy.get(locators.general.threeElipses)
      .wait(3000)
      .eq(1)
      .should("be.visible")
      .click()
      .then(() => {
        cy.get(this.locators.controlBtnThreeElipses)
          .should("be.visible")
          .click();
      });
    cy.wait(5000); // wait for iframe to load
    cy.switchToIframe(this.locators.controlFlyoverFrame).then(($iframe) => {
      const iframeBody = cy.wrap($iframe);
      iframeBody
        .should("have.attr", { timeout: 10000 })
        .contains("Automated Test Control Instance");
    });
  }

  /**
   * Verifies the character count of a field's value
   * @param {string} field - The CSS selector of the field to verify
   * @param {number} expectedCount - The expected character count
   * @returns {SubGridControlInstance} The current instance for method chaining
   */
  verifyCharacterCount(field, expectedCount) {
    cy.get(field)
      .invoke("val")
      .then((val) => {
        expect(val.length).to.equal(expectedCount);
      });
  }
  /**
   * Logs in as the subgrid user, navigates to Risk Register, and opens the Add Control Instance modal
   * Performs complete setup: login session, visit risk register, wait for grid, scroll, open control subgrid, and click Add button
   */
  loginSubgridUser() {
    cy.loginWithSession(
      `login with ${subgridUser.username}`,
      subgridUser.username,
      subgridUser.password,
      subgridUser.key
    );
    cy.visitRiskRegister();
    cy.waitForStableGrid(300000);
    this.scrollToHorizontalCenter();
    riskRegister_PO.openControlSubGrid();
    this.clickAddControlInstanceBtn();
  }
}

export default SubGridControlInstance;
