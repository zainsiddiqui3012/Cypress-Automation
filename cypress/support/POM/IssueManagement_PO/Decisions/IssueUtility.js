
import locators from "../../../../fixtures/locators.json";
import 'cypress-real-events/support';
export default class IssueUtility {
  /**
   * Finds an element by its data-component-id inside the iframe.
   * @param {string} id - The data-component-id of the element to find.
   */
  getByDataComponentId = (id) =>
    cy
      .switchToIframe("#decisionsFrame")
      .find(`[data-component-id='${id}']`, { timeout: 70000 });
  /**
 * Finds an element by its data-component-name inside the iframe.
 * @param {string} name - The data-component-name of the element to find.
 */
  getByDataComponentName = (name) =>
    cy
      .switchToIframe("#decisionsFrame")
      .find(`[data-component-name='${name}']`, { timeout: 70000 });

  /**
    * Finds a child element within a parent element, both identified by data-component-id.
    * @param {string} parentId - The parent element's data-component-id.
    * @param {string} childId - The child element's data-component-id.
    */
  getByDataParentComponentId = (parentId, childId) =>
    cy
      .switchToIframe("#decisionsFrame") // Switch to iframe
      .find(`[data-component-id='${parentId}']`, { timeout: 70000 }) // Find parent section
      .find(`[data-component-id='${childId}']`); // Find child element within the parent    

  /**
* Types a value into an input field inside a specified section.
* @param {string} sectionId - The data-component-id of the section containing the input field.
* @param {string} value - The value to type into the input field.
*/
  typeInInput(sectionId, value) {
    //this.getByDataComponentId(sectionId).find("input").scrollIntoView().type(value, { delay: delay });
    this.getByDataComponentId(sectionId).find("input").clear().type(value);
  }

  validateInputText(sectionId, message) {
    this.getByDataComponentId(sectionId)
      .find("input")  // Find the input inside the section
      .invoke("val")
      .should("eq", message);
  }

  typeInputAndVerifySuggestion(sectionId, value, shouldVerifySuggestion = true) {
    this.getByDataComponentId(sectionId).find("input")
      .should("be.visible") // Ensure input is available
      .click({ force: true }) // Click to activate field
      .clear()
      .type(value, { delay: 100 })
      .wait(1000) // Short wait for UI processing
      .then(($input) => {
        cy.log("Input after typing:", $input.val());
      });

    // Move cursor to the end and delete last 2 characters
    this.getByDataComponentId(sectionId).find("input")
      .should("be.visible") // Ensure input is still present
      .click({ force: true }) // Click again to ensure focus
      .type("{moveToEnd}") // Move cursor to the end
      .wait(2000)
      .type("{end}")
      .wait(1000)
      .type("{leftArrow}{leftArrow}") // Move cursor back two places
      .wait(500)
      .type("{rightArrow}{rightArrow}") // Move cursor back two places
      .wait(500)
      .type("{backspace}{backspace}", { delay: 300 }) // Delete last two characters
      .wait(500)
      .then(($input) => {
        cy.log("Input after deleting characters:", $input.val());
      });

    if (shouldVerifySuggestion) {
      cy.switchToIframe("#decisionsFrame")
        .find('.dp-popup-layer .selected-item')
        .should('be.visible')
        .should('contain.text', value.substring(0, value.length - 2));
    } else {
      cy.switchToIframe("#decisionsFrame")
        .find('.dp-popup-layer .selected-item')
        .should('not.exist');
    }
  }

  verifyFieldType(sectionId, expectedType) {
    this.getByDataComponentId(sectionId)
      .scrollIntoView()
      .find("input")
      .then(($field) => {
        if ($field.hasClass("valueHolder")) {
          expect(expectedType).to.eq("textbox", `Expected field to be a textbox but found something else.`);
        } else if ($field.hasClass("dp-combobox__input")) {
          expect(expectedType).to.eq("dropdown", `Expected field to be a dropdown but found something else.`);
        } else {
          throw new Error(`Field type not recognized for section ID: ${sectionId}`);
        }
      });
  }


  verifyMultiSelectDropdown(sectionId, value, shouldExist = true) {
    this.getByDataComponentId(sectionId)
      .find(".dropDownMultiSelectItemSpan")
      .should(shouldExist ? "exist" : "not.exist")
      .then(($elements) => {
        if (shouldExist) {
          expect($elements).to.contain.text(value);
        }
      });
  }


  verifyMultiSelectItemCount(sectionId, expectedCount) {
    this.getByDataComponentId(sectionId)
      .find(".dropDownMultiSelectItem")  // Select all selected items
      .should("have.length", expectedCount);  // Verify count
  }

  /**
   * Types a value into a textarea inside a specified section.
   * @param {string} sectionId - The data-component-id of the section containing the textarea.
   * @param {string} value - The value to type into the textarea.
   */
  typeInTextArea(sectionId, value) {
    this.getByDataComponentId(sectionId).find("textarea").type(value);
  }
  /**
   * Enters text inside an iframe-based rich text editor (e.g., CKEditor).
   * Ensures the iframe exists, becomes visible, and is interactable before typing.
   * 
   * @param {string} id - The data-component-id of the editor section.
   * @param {string} text - The text to enter into the CKEditor.
   */
/**
 * Enters text inside an iframe-based rich text editor (e.g., CKEditor).
 * Ensures the editor is interactable and handles DOM re-renders.
 * @param {string} id - The data-component-id of the editor section.
 * @param {string} text - The text to enter into the CKEditor.
 */
typeInIframeEditor(id, char) {
  this.getByDataComponentId(id).then($section => {
    cy.wrap($section)
      .find('[contenteditable="true"]', { timeout: 10000 })
      .should('exist')
      .and('be.visible')
      .should('have.attr', 'contenteditable', 'true')
      .trigger('mousedown', { force: true })
      .trigger('mouseup', { force: true })
      .click({ force: true })
      .wait(500)
      .then($el => {
        // Use cypress-real-events to type the character
        cy.wrap($el).realType(char);
      });
  });
}


/**
    * Clicks a tree item by expanding its parent and selecting the child node.
    * @param {string} sectionId - The data-component-id of the tree container.
    * @param {string} parentItem - The label of the parent item to expand.
    * @param {string} childItem - The label of the child item to select.
    */
  clickTreeItem(sectionId, parentItem, childItem) {
    // Expand parent node
    this.getByDataComponentId(sectionId)
      .contains('.jstree-node', parentItem)
      .find('.jstree-icon.jstree-ocl')
      .click({ force: true });
    // Ensure parent is expanded
    this.getByDataComponentId(sectionId)
      .contains('.jstree-node', parentItem)
      .should('have.class', 'jstree-open');
    // Wait for child node to appear
    cy.wait(2000);
    // Click the child node
    this.getByDataComponentId(sectionId)
      .contains('.jstree-anchor', childItem, { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });
  }
  /**
   * Selects a document from a list within a specified section.
   * @param {string} sectionId - The ID of the section containing the document list.
   */
  selectDocument(sectionId) {
    this.getByDataComponentId(sectionId).find('li')
  }
  /**
     * Selects an option from a single-select dropdown.
     * @param {string} sectionId - The data-component-id of the dropdown container.
     * @param {string} option - The option to select.
     */
  selectSingleSelect(sectionId, option) {
    this.getByDataComponentId(sectionId).find("select").select(option);
  }

  selectMultiSelect(sectionId, options) {
    this.getByDataComponentId(sectionId).find();
  }

  radioButton(sectionId, value) {
    this.getByDataComponentId(sectionId)
      .find("input[type='radio']")
      .filter(`[value='${value}']`)
      .click({ force: true });
  }
  checkbox(sectionId, value) {
    this.getByDataComponentId(sectionId).find("input").check();
  }
  /**
     * Clicks a button based on its text.
     * @param {string} btnText - The text of the button to click.
     */
  clickButtonByText(btnText) {
    this.getByDataComponentName("SilverSubDataFlowButton")
      .contains("button", btnText)
      .click();
  }

  /**
 * Clicks a button within a section identified by its data-component-id and returns the Cypress chainable object.
 *
 * @param {string} sectionId - The data-component-id of the section containing the button.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} - The chainable Cypress object for further assertions or actions.
 */
  clicksAndReturnBySectionId(sectionId) {
    return this.getByDataComponentId(sectionId) // Ensure this returns a chainable object
      .find("button") // Find the button
      .should("exist") // Ensure the button exists
      .and("be.visible") // Ensure the button is visible
      .click(); // Click the button
  }
  /**
   * Clicks an input element inside a given section.
   * @param {string} sectionId - The data-component-id of the section containing the input field.
   */
  clickInputElement(sectionId) {
    this.getByDataComponentId(sectionId)
      .find("input")
      .click();
  }
  /**
   * Clicks the first button within a specified section.
   * @param {string} sectionId - The ID of the section.
   */
  clickButtonBySectionId(sectionId) {
    this.getByDataComponentId(sectionId).find("button").first().click();
  }

  verifyButtonTextBySectionId(sectionId, text) {
    this.getByDataComponentId(sectionId).find("button").first().should('contain', text);
  }
  /**
   * Clicks the back button.
   */
  clickBackBtn() {
    this.getByDataComponentName("BackButton")
      .find(".back-button-holder")
      .click();
  }

  /**
     * Verifies the text content of a label inside a specified section.
     * @param {string} sectionId - The data-component-id of the section containing the label.
     * @param {string} text - The expected text of the label.
     */
  verifyLabelText(sectionId, text) {
    this.getByDataComponentId(sectionId)
      .find("label")
      .should("have.text", text);
  }
  /**
  * Verifies that the first label within a given section has the expected text.
  * @param {string} sectionId - The ID of the section.
  * @param {string} text - The expected text of the label.
  */
  verifyFirstLabelText(sectionId, text) {
    this.getByDataComponentId(sectionId)
      .find('label.silverLabel.makeLabelSelectable')
      .first() // Ensures it selects the first matching element
      .should('have.text', text);
  }
  /**
  * Verifies that the input field inside a section has the expected text.
  * @param {string} sectionId - The ID of the section.
  * @param {string} expectedText - The expected text in the input field.
  */
  verifyInputText(sectionId, expectedText) {
    this.getByDataComponentId(sectionId)
      .find("input", { timeout: 10000 }) // Wait for input field
      .should("be.visible") // Ensure input is visible
      .invoke("val")
      .then((actualValue) => {
        expect(actualValue).to.not.be.empty; // Ensure it's not empty
        expect(actualValue.trim()).to.contain(expectedText.trim());
      });
  }
  /**
  * Verifies the text inside a div within a section.
  * @param {string} sectionId - The ID of the section.
  * @param {string} text - The expected text inside the div.
  * @param {boolean} [isContainsText=false] - Whether to check for partial text match.
  */
  verifyDivText(sectionId, text, isContainsText = false) {
    if (isContainsText)
      this.getByDataComponentId(sectionId)
        .contains("div", text)
        .should("be.visible");
    else
      this.getByDataComponentId(sectionId)
        .find("div")
        .should("have.text", text);
  }
  /**
  * Verifies the text of a button within a specified parent section.
  * @param {string} parentId - The ID of the parent section.
  * @param {string} childId - The ID of the child section.
  * @param {string} expectedText - The expected button text.
  */
  verifyButtonText(parentId, childId, expectedText) {
    return this.getByDataParentComponentId(parentId, childId)
      .find("button")
      .should("exist")
      .invoke("text")
      .then((text) => {
        const normalizedText = text.replace(/\s+/g, " ").trim(); // Normalize spaces
        expect(normalizedText).to.eq(expectedText);
      });
  }

  /**
  * Clicks a button within a specified parent section.
  * @param {string} parentId - The ID of the parent section.
  * @param {string} childId - The ID of the child section.
  */
  clickButtonByParentSectionID(parentId, childId) {
    return this.getByDataParentComponentId(parentId, childId)
      .find("div").find("a").click();

  }
  /**
   * Verifies the count of watchers (number displayed in an input field).
   * @param {string} sectionId - The ID of the section.
   * @param {string} value - The expected value in the input field.
   */
  verifyWatchersCount(sectionId, value) {
    this.getByDataComponentId(sectionId)
      .find("input")
      .should("have.value", value);
  }

  selectMoreOption(optionText) {
    this.getByDataComponentId("01J1YQCJY6V0TK9JK524YJ60SP")
      .find(".arrow-down")
      .click();
    cy.get(".dp-popup-layer .dp-combobox-item")
      .contains("span", optionText)
      .click();
  }
  /**
 * Selects an option from a dropdown menu triggered by clicking an arrow icon.
 *
 * @param {string} id - The data-component-id of the dropdown field.
 * @param {string} optionText - The visible text of the option to select.
 */
  selectMoreOptionID(id, optionText) {
    this.getByDataComponentId(id)
      .find(".arrow-down")
      .should("be.visible")
      .click();
    cy.get(".dp-popup-layer .dp-combobox-item")
      .contains("span", optionText)
      .click();
  }
  /**
   * Switches to a tab within a section by its title.
   * @param {string} id - The ID of the tab container.
   * @param {string} tabName - The name of the tab to switch to.
   */
  switchingTab(id, tabName) {
    this.getByDataComponentId(id) // Main tab container
      .find(`.ui-tabs-anchor[title='${tabName}']`) // Find the tab by title
      .click();
  }
  /**
  * Generates a random alphanumeric item name and stores it in a file.
  * @param {string} filePath - The path of the file to store the name.
  * @param {string} itemPrefix - The prefix for the generated item name.
  * @param {boolean} [isCharacterLong=false] - Whether to generate a long item name.
  */
  createRandomItemName(filePath, itemPrefix, isCharacterLong = false) {
    cy.readFile(filePath).then((file) => {
      const strLength = isCharacterLong ? (256 - itemPrefix.length) : 15;
      cy.createRandomAlphaNumeric(strLength).then((alphaNumeric) => {
        const sourceName = itemPrefix + alphaNumeric
        file.itemFullName = sourceName;
        cy.writeFile(filePath, file)
      })
    })
  }
  /**
   * Selects a status from a dropdown.
   * @param {string} locators - The locator of the dropdown.
   */
  selectStatus(locators) {
    cy.get(locators).click();
  }
  /**
  * Enters data into a text field.
  * @param {string} locators - The locator of the text field.
  * @param {string} data - The data to enter.
  */
  enterDataInTextField(locators, data) {
    cy.get(locators).type(data);
  }
  /**
   * Generates a random name with special characters and stores it in a file.
   * @param {string} filePath - The path of the file to store the name.
   * @param {string} itemPrefix - The prefix for the generated item name.
   */
  createRandomSpecialItemName(filePath, itemPrefix) {
    cy.readFile(filePath).then((file) => {
      cy.createRandomSpecialCharactersNumeric(15).then((randomStr) => {
        const itemName = itemPrefix + randomStr;
        file.itemFullName = itemName;
        cy.writeFile(filePath, file);
      });
    });
  }
  /**
  * Verifies the number of records displayed in a table.
  * @param {number} length - The expected number of records.
  */
  verifyNoOfRecord(length) {
    cy.get(locators.issueManagement.administration.tableRecordLength, { timeout: 10000 }).should('have.length', length)
  }
  /**
  * Verifies that all status values in the grid match the expected value.
  * @param {string} statusValue - The expected status value.
  */
  verifyStatus(statusValue) {
    cy.get(locators.issueManagement.administration.statusGridValue)
      .should(($elements) => {
        // Ensure that all elements have the expected status value
        expect($elements).to.have.length.gt(0);
        $elements.each((index, el) => {
          expect(el.innerText).to.equal(statusValue); // Verify the text of each element
        });
      });
  }
  /**
  * Changes the status of an item to 'Inactive'.
  */

  changeStatusToInactive() {
    cy.get(locators.issueManagement.administration.statusDropdown).eq(0).dblclick({ force: true })
    cy.get(locators.issueManagement.administration.statusDropdownValue).eq(1).type('{downarrow}{enter}')
  }

  /**
   * Changes the status of an item to 'Active'.
   */
  changeStatusToActive() {
    cy.get(locators.issueManagement.administration.statusDropdown).eq(0).dblclick({ force: true })
    cy.get(locators.issueManagement.administration.statusDropdownValue).eq(0).type('{upArrow}{enter}')
  }

  /**
   * Verifies the text inside an AG Grid row, ensuring it's within the character limit.
   * @param {string} fullExpectedText - The full expected text for the row.
   */
  getTextForAgGridRow(fullExpectedText) {
    const expectedValue = fullExpectedText.substring(0, 255);

    cy.get(locators.issueManagement.administration.textRowItem)
      .should('be.visible')
      .invoke('text')
      .then((displayedText) => {
        const trimmedDisplayedText = displayedText.trim();
        cy.log("Displayed text:", trimmedDisplayedText);
        cy.log("Expected text:", expectedValue);
        expect(trimmedDisplayedText).to.equal(expectedValue);
      });
  }
  /**
  * Performs a double-click on a name field inside a grid.
  */
  doubleClicksOnNameFieldGrid() {
    cy.get(locators.issueManagement.administration.newRowItem).should('be.visible').dblclick();
  }
  /**
   * Generates and stores a random alphanumeric string for a given field in a JSON file.
   * @param {string} filePath - The path to the JSON file.
   * @param {string} category - The category within the JSON to update.
   */
  generateAndStoreItemWithDynamicKey(filePath, category) {
    cy.readFile(filePath).then((file) => {
      const { prefix, fullNameKey } = file.setup[category]; // Access dynamically
      cy.createRandomAlphaNumeric(15).then((randomStr) => {
        const newValue = prefix + randomStr; // Generate new random name
        file.setup[category][fullNameKey] = newValue; // Update the correct key
        file.setup[category][category] = newValue; // Store it correctly
        cy.writeFile(filePath, file); // Save updated JSON
      });
    });
  }
  /**
   * Scrolls to an element inside the iframe to ensure visibility.
   * @param {string} sectionId - The data-component-id of the section to scroll to.
   */
  scrollToElement(sectionId) {
    this.getByDataComponentId(sectionId)
      .scrollIntoView()
      .should("be.visible"); // Ensures the element is visible after scrolling
  }

  /**
  * Generates and stores a random number for a given field.
  * @param {string} filePath - The path to the JSON file.
  * @param {string} fieldName - The name of the field to update
  * @param {number} length - The number of digits to generate (default is 4).
  */
  generateAndStoreRandomNumber(filePath, fieldName, length = 4) {
    cy.readFile(filePath).then((file) => {
      // Use the `createRandomNumber` custom command to generate a random number
      cy.createRandomNumber(length).then((randomNumber) => {
        file.setup[fieldName] = parseInt(randomNumber, 10); // Convert string to number and update the field
        cy.writeFile(filePath, file); // Save updated JSON
      });
    });
  }

  /**
   * Generates and stores a random alphanumeric string for a given field.
   * @param {string} filePath - The path to the JSON file.
   * @param {string} fieldName - The name of the field to update (e.g., "potentialLoss").
   * @param {number} length - The length of the alphanumeric string to generate (default is 10).
   */
  generateAndStoreRandomAlphanumeric(filePath, fieldName, length = 10) {
    cy.readFile(filePath).then((file) => {
      // Use the `createRandomAlphaNumeric` custom command to generate a random alphanumeric string
      cy.createRandomAlphaNumeric(length).then((randomString) => {
        file.setup[fieldName] = randomString; // Update the field with the random string
        cy.writeFile(filePath, file); // Save updated JSON
      });
    });
  }
  /**
   * Generates and stores a random string for a given field.
   * @param {string} filePath - The path to the JSON file.
   * @param {string} fieldName - The name of the field to update (e.g., "potentialLoss").
   * @param {number} length - The length of the string to generate (default is 10).
   */
  generateAndStoreRandomString(filePath, fieldName, length = 10) {
    cy.readFile(filePath).then((file) => {
      // Use the `createRandomString` custom command to generate a random string
      cy.createRandomString(length).then((randomString) => {
        file.setup[fieldName] = randomString; // Update the field with the random string
        cy.writeFile(filePath, file); // Save updated JSON
      });
    });
  }
  /**
   * Generates a date string in MM/DD/YYYY format.
   * Supports generating the current date, past/future dates with an offset, or parsing a specific date string.
   * 
   * @param {string} typeOrDate - "current" for today, "past" for a previous date, "future" for a future date, or a hardcoded date string (e.g., "20 Jan 2030").
   * @param {number} [daysOffset=0] - The number of days to offset for past or future dates.
   * @returns {string} - The formatted date as MM/DD/YYYY.
   * @throws {Error} - Throws an error if an invalid date string is provided.
   */
  generateDate(typeOrDate, daysOffset = 0) {
    let date;
    if (typeOrDate === "current" || typeOrDate === "past" || typeOrDate === "future") {
      date = new Date();

      if (typeOrDate === "past") {
        date.setDate(date.getDate() - daysOffset);
      } else if (typeOrDate === "future") {
        date.setDate(date.getDate() + daysOffset);
      }
    }
    // Otherwise, assume it's a hardcoded date string (e.g., "20 Jan 2030")
    else {
      date = new Date(typeOrDate);

      // If the date is invalid, return an error
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format: ${typeOrDate}`);
      }
    }
    // Return date in MM/DD/YYYY format
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
  /**
   * Generates a random string with special characters, stores it in a JSON file, and associates it with a category.
   * 
   * @param {string} filePath - The path to the JSON file.
   * @param {string} category - The category key in the JSON where the generated value should be stored.
   */
  generateAndStoreItemWithSpecialChars(filePath, category) {
    cy.readFile(filePath).then((file) => {
      const { prefix, fullNameKey } = file.setup[category]; // Access dynamically
      cy.createRandomSpecialCharactersNumeric(20).then((randomStr) => {
        const newValue = prefix + randomStr; // Generate new random name
        file.setup[category][fullNameKey] = newValue; // Update the correct key
        file.setup[category][category] = newValue;
        cy.writeFile(filePath, file);
      });
    });
  }
  /**
   * Generates a random alphanumeric string with a maximum length of 255 characters, stores it in a JSON file, and associates it with a category.
   * 
   * @param {string} filePath - The path to the JSON file.
   * @param {string} category - The category key in the JSON where the generated value should be stored.
   */
  generateAndStoreItemWithMaxLength(filePath, category) {
    cy.readFile(filePath).then((file) => {
      const { prefix, fullNameKey } = file.setup[category]; // Access dynamically
      cy.createRandomAlphaNumeric(255 - prefix.length).then((randomStr) => {
        const newValue = prefix + randomStr; // Generate new random name
        file.setup[category][fullNameKey] = newValue; // Update the correct key
        file.setup[category][category] = newValue; // Store it correctly
        cy.writeFile(filePath, file);
      });
    });
  }

  /**
   * Enters a string value in a numeric input field and validates expected behavior.
   *
   * @param {string} sectionId - The data-component-id of the input field.
   * @param {string} value - The value to enter in the input field.
   */
  enterStringDataInNumericAndValidateEmptyValue(sectionId, value) {
    this.getByDataComponentId(sectionId)
      .find("input")
      .click() // Ensure input is focused
      .clear()
      .type(value)
      .should("have.value", value)
      .focus() // Explicitly set focus before blur
      .blur({ force: true }); // Ensure blur event is triggered

    // Retry assertion to ensure correct final value
    this.getByDataComponentId(sectionId)
      .find("input")
      .should(($input) => {
        let finalValue = $input.val().trim(); // Trim to remove extra spaces if any

        if (value.includes(".")) {
          // Convert input to float and apply rounding logic
          let roundedValue = Math.round(parseFloat(value));
          expect(parseInt(finalValue)).to.equal(roundedValue); // Validate rounded number
        } else if (value.match(/^\d+$/)) {
          // If it's a valid numeric value without decimal, assert it directly
          expect(finalValue).to.equal(value);
        } else {
          // If invalid input, expect the field to be empty after blur
          expect(finalValue).to.be.empty;
        }
      });
  }

  /**
 * Verifies the presence of a field (input/label) inside a section.
 *
 * @param {string} sectionId - The data-component-id of the section.
 * @param {boolean} expectedPresence - Whether the field should be visible.
 * @param {string} elementType - The type of element to verify (default: 'input').
 */
  verifyFieldPresence(sectionId, expectedPresence, elementType = "input") {
    this.getByDataComponentId(sectionId)
      .scrollIntoView()  // Ensure the field is in view
      .find(elementType)  // Dynamically find 'label' or 'input'
      .should(expectedPresence ? "be.visible" : "not.be.visible");
  }

  /**
 * Enters a maximum number in a numeric field inside an iframe and validates the tooltip.
 *
 * @param {string} sectionId - The data-component-id of the input field.
 * @param {string} value - The numeric value to enter.
 * @param {string} expectedTooltip - The expected tooltip text.
 */
  typeMaximumNumberInNumericFieldAndValidateTooltip(sectionId, value, expectedTooltip) {
    // Wait for the iframe to load
    cy.get("#decisionsFrame", { timeout: 10000 }).should("be.visible");

    cy.get("#decisionsFrame").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).should("be.visible");

      // Type the value in the input field
      cy.wrap(body)
        .find(`[data-component-id='${sectionId}'] input`)
        .click()
        .clear()
        .type(value)
        .should("have.value", value)
        .blur({ force: true }); // Blur to trigger validation

      cy.wait(500);

      // Move the mouse away from the field to reset hover
      cy.wrap(body).trigger("mousemove", { clientX: 10, clientY: 10 });
      cy.wait(500);

      // Hover over the field to trigger the tooltip
      cy.wrap(body)
        .find(`[data-component-id='${sectionId}'] input`)
        .trigger("mouseover");

      // Validate tooltip appears
      cy.wrap(body)
        .find(".ui-tooltip", { timeout: 7000 })
        .should("be.visible");

      // Validate tooltip message
      cy.wrap(body)
        .find(".ui-tooltip-content .vi-tt-content.vi-bl-error")
        .should("contain.text", expectedTooltip);
    });

  }

  /**
   * Generates a random numeric string with a length of 10, stores it in a JSON file, and associates it with a category.
   * 
   * @param {string} filePath - The path to the JSON file.
   * @param {string} category - The category key in the JSON where the generated value should be stored.
   */
  generateAndStoreItemWithNumbers(filePath, category) {
    cy.readFile(filePath).then((file) => {
      const { prefix, fullNameKey } = file.setup[category]; // Access dynamically
      cy.createRandomNumber(10).then((randomStr) => {
        const newValue = prefix + randomStr; // Generate new random name
        file.setup[category][fullNameKey] = newValue; // Update the correct key
        file.setup[category][category] = newValue; // Store it correctly
        cy.writeFile(filePath, file); // Save updated JSON
      });
    });
  }

  
  /**
* Types a value into an input field inside a specified section.
* @param {string} sectionId - The data-component-id of the section containing the input field.
* @param {string} value - The value to type into the input field.
*/
  typeInOriginalReportTextEditor(value) {
    cy.find(locators.externalWebform.originalReport).type(value);
  }

  /**
   * Enters text inside a rich text editor (e.g., CKEditor) without iframe.
   * Ensures the editor is interactable and handles DOM re-renders.
   * @param {string} id - The data-component-id of the editor section.
   * @param {string} char - The text to enter into the CKEditor.
   */
  typeInRichTextEditor(id, char) {
    cy.get(`[data-component-id='${id}']`, { timeout: 10000 })
      .find('[contenteditable="true"]', { timeout: 10000 })
      .should('exist')
      .and('be.visible')
      .should('have.attr', 'contenteditable', 'true')
      .trigger('mousedown', { force: true })
      .trigger('mouseup', { force: true })
      .click({ force: true })
      .wait(500)
      .then($el => {
        // Use cypress-real-events to type the character
        cy.wrap($el).realType(char);
      });
  }
}
