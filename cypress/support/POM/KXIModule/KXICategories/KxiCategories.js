import data from "../../../../fixtures/KXIModule/KXICategories.json";
import locators from "../../../../fixtures/locators.json";
const writeFilePath = "cypress/fixtures/KXIModule/writeKxiCategory.json";
import dayjs from "dayjs";
const categoryIdData = "cypress/fixtures/KXIModule/categoryIdData.json";

class KxiCategories {
  /**
   * Clicks the "Add Category" button.
   *
   * @returns {void}
   */
  addCategoryBtn() {
    cy.get(locators.kxi.kxiCategory.clickAddKxiBtn).click();
  }

  /**
   * Generates a unique category name using timestamp.
   *
   * @returns {string} A unique category name string
   */
  addName() {
    return `${data.kxiCatName}-${dayjs().format("MM-DD-YYYY_HH-mm-ss")}`;
  }

  /**
   * Enters the generated category name into the input field and triggers a Tab key.
   * Saves the generated name to a JSON file.
   *
   * @returns {void}
   */

  enterName() {
    const categoryName = this.addName();
    cy.get(locators.kxi.kxiCategory.addName, {
      timeout: Cypress.env("waits").mediumWait,
    })
      .type(categoryName)
      .focused()
      .tab();
    cy.readFile(writeFilePath).then((file) => {
      file.name = categoryName;
      cy.writeFile(writeFilePath, file);
    });
  }

  /**
   * Dynamically generates and enters category ID field.
   * Saves the generated ID to a JSON file.
   *
   * @returns {void}
   */
  enterCategoryId() {
    let optionalFields = [
      {
        name: data.idName,
        locators: locators.kxi.kxiCategory.addCategoryId,
      },
    ];

    optionalFields.forEach(({ name, locators }) => {
      cy.readFile(categoryIdData).then((file) => {
        const section = data.sectionAdd;

        cy.createRandomAlphaNumeric(5).then((alphaNumericValues) => {
          const idValue = data.nameCategoryId + alphaNumericValues;

          if (!file[section]) {
            file[section] = {};
          }
          file[section][name] = idValue;

          cy.get(locators).clear().type(idValue).focused().tab();

          cy.writeFile(categoryIdData, file);
        });
      });
    });
  }

  /**
   * Simulates a Tab key press in the Content Library field to move focus.
   * Waits for the element to be visible before acting.
   *
   * @returns {void}
   */
  contentLib() {
    cy.get(locators.kxi.kxiCategory.contentLib, {
      timeout: Cypress.env("waits").mediumWait,
    })
      .should("be.visible")
      .focused()
      .tab();
  }

  /**
   * Types a 100-character random string into the Description field.
   * Waits for the field to be visible before typing.
   * Uses delay and force to ensure proper input.
   *
   * @returns {void}
   */
  verifyLongDesc() {
    // Generate 500-character random alphanumeric string
    cy.createRandomAlphaNumeric(100).then((longText) => {
      // Type into the Description field
      cy.get(locators.kxi.kxiCategory.descInput, {
        timeout: Cypress.env("waits").mediumWait,
      })
        .should("be.visible")
        .type(longText, { delay: 5, force: true });
    });
  }

  /**
   * Validates that the Name field is required by tabbing through multiple form fields.
   * Simulates keyboard tab events on specified selectors to trigger validation.
   *
   * @returns {void}
   */

  validateNameFieldIsRequired() {
    const tabThroughField = (selector) => {
      cy.get(selector, { timeout: Cypress.env("waits").mediumWait })
        .should("be.visible")
        .focused()
        .tab({ force: true });
    };

    const fieldsToTab = [
      locators.kxi.kxiCategory.addName,
      locators.kxi.kxiCategory.addName,
      locators.kxi.kxiCategory.searchField,
      locators.kxi.kxiCategory.addName,
      locators.kxi.kxiCategory.statusTab,
    ];

    fieldsToTab.forEach(tabThroughField);
  }

  /**
   * Checks that duplicate Category IDs are not allowed.
   * Reads existing category name and ID from fixture files,
   * then tries to add a new category with the same name and ID to trigger validation.
   *
   * @returns {void}
   */
  checkDuplicateId() {
    // Read the saved category name and ID
    cy.readFile(writeFilePath).then((file) => {
      const existingName = file.name;

      cy.readFile(categoryIdData).then((idFile) => {
        const section = data.sectionAdd;
        const duplicateId = idFile[section][data.idName];

        // Click 'Add Category'
        this.addCategoryBtn();

        // Enter the existing category name (intentionally duplicate)
        cy.get(locators.kxi.kxiCategory.addName)
          .type(existingName)
          .focused()
          .tab();

        // Enter the duplicate ID
        cy.get(locators.kxi.kxiCategory.addCategoryId).type(duplicateId);

        // Click outside to trigger validation
        cy.get(locators.kxi.kxiCategory.girdMain).click();
      });
    });
  }

  /**
   * Applies a filter on the Category Name column using the updated category name
   * read from a fixture file to verify that filtering works after editing.
   *
   * @returns {void}
   */
  filterByEditedName() {
    cy.readFile(writeFilePath).then((file) => {
      const updatedName = file.name;

      // Apply filter in the first floating filter input
      cy.get(locators.kxi.kxiCategory.filterInput)
        .find(locators.kxi.kxiCategory.nameSearch)
        .eq(0) // first column - Category Name
        .clear()
        .type(updatedName, { delay: 100 });

      // Assertion: Check that the updated name appears in the table
      cy.get(locators.kxi.kxiCategory.tableTop, {
        timeout: Cypress.env("waits").mediumWait,
      });
      cy.get(locators.kxi.kxiCategory.clickCategoryName).should(
        "contain.text",
        updatedName
      );
    });
  }

  /**
   * Edits an existing category name inline by:
   * - Reading the current name from a JSON file
   * - Finding the corresponding table row and entering edit mode
   * - Updating the category name with a new generated name
   * - Verifying the success toast message appears
   * - Updating the JSON file with the new name
   *
   * @returns {void}
   */
  editCategoryName() {
    cy.readFile(writeFilePath).then((file) => {
      const oldName = file.name;
      const newName = data.updatedText + this.addName();

      // Step 1: Find the row by old category name and double-click to edit
      cy.get(locators.kxi.kxiCategory.tableTop)
        .contains(locators.kxi.kxiCategory.clickCategoryName, oldName)
        .dblclick()
        .then(() => {
          // Step 2: Clear and type new category name
          cy.get(locators.kxi.kxiCategory.addName)
            .find("textarea")
            .clear()
            .type(newName)
            .focused()
            .tab();

          // Step 3: Verify success toast
          cy.verifyToastMessageText(data.successMsg, 20000).should(
            "be.visible"
          );

          // Step 4: Update the saved name in file
          file.name = newName;
          cy.writeFile(writeFilePath, file);
        });
    });
  }
  /**
   * Edits the category ID inline by:
   * - Generating a new random suffix and concatenating it with a base ID
   * - Clearing and typing the new ID into the input field
   * - Clicking outside to trigger the save action
   * - Updating the category ID JSON file with the new ID
   * - Verifying that the success toast message is displayed
   *
   * @returns {void}
   */
  editCategoryId() {
    cy.readFile(writeFilePath).then((file) => {
      cy.createRandomAlphaNumeric(5).then((newIdSuffix) => {
        const newId = data.updatedCategoryId + newIdSuffix;

        // Step 1: Clear and update the ID input
        cy.get(locators.kxi.kxiCategory.addCategoryId).clear().type(newId);

        // Step 2: Click outside to trigger save
        cy.get(locators.kxi.kxiCategory.girdMain).click();

        // Step 3: Update categoryIdData JSON
        cy.readFile(categoryIdData).then((idFile) => {
          const section = data.sectionAdd;
          if (!idFile[section]) idFile[section] = {};
          idFile[section][data.idName] = newId;
          cy.writeFile(categoryIdData, idFile);
        });

        // Step 4: Show success toast
        cy.verifyToastMessageText(data.successMsg, 20000).should("be.visible");
      });
    });
  }
}

export default KxiCategories;
