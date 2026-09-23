import locators from "../../../fixtures/locators.json";
import dataFile from "../../../fixtures/RegChangeManagementV2-Decisions/administration.json";
import dayjs from "dayjs";
const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
const filePath =
  "cypress/fixtures/RegChangeManagementV2-Decisions/WriteAdministration.json";

class PreRequisites {
  adminLocator = locators.regChangeManagementV2.administration;

  /**
   * Adds a new entry to the grid for the given screen.
   * If `natureOfChange` is true, it deletes the last row before adding the entry.
   * Otherwise, it adds the entry without deleting the last row.
   * The method also updates the saved file with the newly added name.
   *
   * @param {string} screenName - The name of the screen where the entry is being added.
   * @param {string} name - The name for the entry.
   * @param {boolean} [natureOfChange=false] - Flag to determine whether the entry requires a "nature of change".
   */
  addInGrid(screenName, name, natureOfChange = false) {
    const fullName = name + timeStamp;
    if (natureOfChange === true) {
      this.deleteLastRow();
     cy.waitForToastMessageToDisappear(10000)
      cy.get(this.adminLocator.addBtn).contains(screenName).click();
      cy.get(this.adminLocator.textArea).type(fullName);
      this.selectCategory(dataFile.categories[0]);
      // this.verifyUniqueCategory(category);
    } else {
      this.deleteLastRow();
       cy.waitForToastMessageToDisappear(10000)
      cy.get(this.adminLocator.addBtn).contains(screenName).click();
      cy.get(this.adminLocator.textArea).type(fullName);
      cy.get(locators.regChangeManagementV2.feedRegister.agGrid.statusColumn)
        .eq(0)
        .click();
    }
    cy.readFile(filePath).then((file) => {
      if (screenName === dataFile.changeType) {
        file.saveChangeType = fullName;
        cy.writeFile(filePath, file);
      } else if (screenName === dataFile.natureofChange) {
        file.saveNatureOfChange = fullName;
        cy.writeFile(filePath, file);
      } else if (screenName === dataFile.magnitude) {
        file.saveMagnitude = fullName;
        cy.writeFile(filePath, file);
      }
    });
    cy.get(locators.administration.toastMsg, { timeout: 40000 })
      .should("be.visible")
      .should("contain", dataFile.successMsg);
  }

  /**
   * Adds a description in the provided description frame and submits it.
   * The description text is saved to a file after submission.
   *
   * @param {string} description - The description text to add.
   */
  addDescription(descrption) {
    const fullName = descrption + timeStamp;
    cy.get(this.adminLocator.decriptionFrame).then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).click().type(descrption, { force: true });
    });
    cy.get(this.adminLocator.descriptionSubmit).click();
    cy.readFile(filePath).then((file) => {
      if (descrption === dataFile.actionplanText) {
        file.saveActionPlan = fullName;
        cy.writeFile(filePath, file);
      } else if (descrption === dataFile.evaluateImpactText)
        file.saveEvaluateImpact = fullName;
      cy.writeFile(filePath, file);
    });
  }

  /**
   * Opens the category dropdown for the last row in the grid.
   */
  openCategoryDropdown() {
    cy.get(this.adminLocator.categoryCell).last().dblclick();
  }

  /**
   * Selects a category from the category dropdown.
   *
   * @param {string} categoryName - The name of the category to select.
   */
  selectCategory(categoryName) {
    this.openCategoryDropdown();
    cy.get(this.adminLocator.categoryDropdown).contains(categoryName).click();
  }

  /**
   * Edits the last row in the grid by clicking the edit button,
   * updating the name, and saving the changes. The updated name is saved to a file.
   *
   * @param {string} name - The name to update in the last row.
   * @param {string} editText - The additional text to add during the edit.
   */
  editLastRow(name, editText) {
    cy.get(this.adminLocator.editButton).last().click();
    const fullName = name + timeStamp;
    cy.get(this.adminLocator.textArea).clear().type(fullName).type(editText);
    cy.get(locators.regChangeManagementV2.feedRegister.agGrid.statusColumn)
      .last()
      .click();

    cy.readFile(filePath).then((file) => {
      if (name === dataFile.automatedChangeType) {
        file.saveChangeType = fullName;
        cy.writeFile(filePath, file);
      } else if (name === dataFile.automatedNatureofChange) {
        file.saveNatureOfChange = fullName;
        cy.writeFile(filePath, file);
      } else if (name === dataFile.automatedMagnitude) {
        file.saveMagnitude = fullName;
        cy.writeFile(filePath, file);
      }
    });
    cy.get(locators.administration.toastMsg, { timeout: 40000 })
      .should("be.visible")
      .should("contain", dataFile.successMsg);
  }

  /**
   * Deletes the last row in the grid by clicking the delete button and confirming the action.
   * After deletion, a success message is displayed.
   */
  deleteLastRow() {
    cy.get(this.adminLocator.deleteButton).last().click();
    cy.on("window:confirm", () => true);

    cy.get(locators.administration.toastMsg)
      .should("be.visible")
      .should("contain", dataFile.deleteMsg);
  }
}

export default PreRequisites;
