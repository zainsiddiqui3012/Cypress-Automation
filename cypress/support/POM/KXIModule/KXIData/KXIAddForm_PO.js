import locators from "../../../../fixtures/locators.json";
import testData from "../../../../fixtures/KXIModule/KXIData/KxiDefinitionData.json";
import dayjs from "dayjs";
const message = testData.targetFieldInvalidMessage;
const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";

/**
 * Page Object Model class for KXI Definition modal interactions.
 */
export class KxiDefinitionPage {
  /**
   * Opens the KXI Definition modal form.
   */
  openForm() {
    // Setup intercept first
    cy.intercept("GET", testData.activeKriDefinitionApi).as("definitions");

    // Open the modal
    cy.get(locators.kxiDefinition.openMainButton).click();
    cy.get(locators.kxi.kxiData.clickAdd).click();
    cy.get(locators.kxiDefinition.modalHeader).should("be.visible");
  }
  /**
   * Opens the KXI Definition dropdown and types the search term.
   */
  openDefinitionDropdown(kxiDefinition) {
    // Continue with assertions
    cy.wait("@definitions", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);
    // Click the dropdown to trigger the API (already intercepted)
    cy.get(locators.kxiDefinition.dropdownButton).click();
    cy.get(locators.kxiDefinition.dropdownListModal).should("be.visible");
    cy.get(locators.kxiDefinition.dropdownSearchInput).type(kxiDefinition);
  }

  /**
   * Searches and selects a KXI Definition from the dropdown.
   */
  searchAndSelectDefinition(kxiDefinition) {
    cy.wait("@definitions", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);
    cy.get(locators.kxiDefinition.dropdownButton).click();
    cy.get(locators.kxiDefinition.dropdownSearchInput, { timeout: 50000 }).type(
      kxiDefinition
    );
    cy.get(locators.kxiDefinition.dropdownListModal)
      .contains(kxiDefinition)
      .click();
  }

  /**
   * Asserts that the dropdown contains the searched text.
   */
  assertDefinitionDropdownContainsSearchText(kxiDefinition) {
    cy.get(locators.kxiDefinition.dropdownListModal).should(
      "contain.text",
      kxiDefinition
    );
  }

  setKxiValue() {
    cy.get(locators.kxiDefinition.valueField).clear().type(testData.kxiValue);
  }

  /**
   * Validates that a given field is auto-populated.
   * @param {string} fieldKey - Key for the field locator.
   */
  validateAutoPopulatedField(fieldKey) {
    cy.get(locators.kxiDefinition[fieldKey])
      .invoke("val")
      .should("not.be.empty");
  }

  /**
   * Clicks the Save button on the modal.
   */
  clickSaveButton() {
    cy.get(locators.kxiDefinition.saveButton).click();
  }

  /**
   * Validates the presence of a generic toast message.
   */
  validateToastMessage() {
    cy.get(locators.kxiDefinition.toastMessage).should(
      "contain.text",
      testData.expectedToast
    );
  }

  /**
   * Validates that the success or duplicate toast message is shown.
   */
  successToastMessage() {
    cy.get(locators.kxiDefinition.toastMessage)
      .invoke("text")
      .then((msg) => {
        const trimmed = msg.trim();
        if (
          trimmed === testData.successToastMessage ||
          trimmed.includes(testData.alreadyExistToastMessage)
        ) {
          cy.log("Toast validation passed");
        } else {
          throw new Error(`Unexpected toast message: "${trimmed}"`);
        }
      });
  }

  validateAddedDataOnUI(kxiName) {
    cy.visitkxiData();
    const timeStamp = dayjs().format("MM/DD/YYYY");
    this.searchKxiInGrid(kxiName);

    cy.get(locators.kxi.kxiData.valueColumn, { timeout: 5000 }).should(
      "contain",
      testData.kxiValue
    );

    cy.get(locators.kxi.kxiData.sampleDateColumn, { timeout: 5000 }).should(
      "contain",
      timeStamp
    );
    cy.get(locators.kxi.kxiData.commentsColumn, { timeout: 5000 }).should(
      "contain",
      testData.commentText
    );
  }

  /**
   * Validates that a required field's error label is shown.
   * @param {string} fieldKey - Key for the field locator.
   */
  validateRequiredField(fieldKey) {
    cy.get(locators.kxiDefinition[fieldKey]).should("exist");
  }

  /**
   * Adds a sample date and validates the format.
   */
  addSampleDate() {
    cy.get(locators.kxiDefinition.sampleDateInput).click();
    cy.get(locators.kxiDefinition.dateTable)
      .contains(testData.dateToSelect)
      .should("be.visible");
    cy.get(locators.kxiDefinition.selectDate).click();
    cy.get(locators.kxiDefinition.sampleDateInput)
      .invoke("val")
      .should("match", new RegExp(testData.expectedDateFormat));
  }
  addComments() {
    cy.get(locators.kxiDefinition.commentField).type(testData.commentText);
  }
  /**
   * Sets a value greater than the target field value.
   */
  setValueGreaterThanTarget() {
    cy.wait("@definitions", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);
    cy.readFile(writeDataFilePath).then((file) => {
      cy.get(locators.kxiDefinition.dropdownButton).click();
      cy.get(locators.kxiDefinition.dropdownSearchInput).type(
        file.kxiName + "{enter}"
      );
    });

    cy.get(locators.kxiDefinition.targetField)
      .invoke("val")
      .then((target) => {
        const targetValue = parseFloat(target);
        if (!isNaN(targetValue)) {
          const greaterValue = targetValue + 5;
          cy.get(locators.kxiDefinition.valueField, { timeout: 50000 })
            .clear()
            .type(greaterValue.toString());
        } else {
          throw new Error(`${message} "${target}"`);
        }
      });
  }

  /**
   * Opens the Kaia AI chat widget.
   */
  openAIChat() {
    cy.get(locators.kxiDefinition.kaiaChatIcon).click();
  }

  /**
   * Verifies that the AI chat panel is opened.
   */
  verifyAIChatOpened() {
    cy.get(locators.kxiDefinition.chatWindow)
      .contains(testData.chatBotWelcomeMessage)
      .should("exist");
  }

  /**
   * Selects the first record from the KXI grid.
   */
  selectFirstKxiRecord() {
    cy.get(locators.kxi.kxiData.checkBoxSelectionkxi, { timeout: 50000 })
      .eq(0)
      .click({ multiple: true });
  }

  /**
   * Clicks the "Show All" button to view all records.
   */
  clickShowAllButton() {
    cy.get(locators.kxi.kxiData.showAllButton).click();
  }

  /**
   * Clicks the "Show Latest" button to view recent data.
   */
  clickShowLatestBtn() {
    cy.get(locators.kxi.kxiData.showAllButton).click();
    cy.get(locators.kxiDefinition.showLatestBtn).click();
  }

  /**
   * Validates that the grid contains full definition data.
   */
  searchKxiInGrid(kxiName) {
    cy.get(locators.kxi.kxiDefinition.nameSearch, { timeout: 100000 })
      .should("be.visible")
      .type("{selectall}{backspace}", { force: true }, { delay: 300 })
      .clear()
      .type("{selectall}{backspace}")
      .click({force: true })
      .type(kxiName, { delay: 250 });
    cy.get(locators.kxiDefinition.kxiGridData, { timeout: 50000 }).should(
      "contain",
      kxiName
    );
  }

  /**
   * Ensures at least the second row of the grid is visible.
   */
  scanKxiGrid() {
    cy.get(locators.kxiDefinition.kxiGridData2).eq(1).should("be.visible");
  }
}
