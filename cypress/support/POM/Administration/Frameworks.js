import locators from "../../../fixtures/locators.json";
import Assessment from "./Assessment";
const frameWorkDataString = "cypress/fixtures/Administration/Frameworks.json";
import dayjs from "dayjs";

const assessment = new Assessment();
class Frameworks {
  /**
   * Cancels the framework form by clicking the close button.
   */
  cancelFrameWorkForm() {
    cy.get(locators.general.closeForm).click({ multiple: true, force: true });
    cy.get(locators.general.closeForm).should("not.be.visible");
  }

  /**
   * Checks for mandatory field errors by attempting to save an empty form.
   */
  checkMandatoryFieldsError() {
    cy.readFile(frameWorkDataString).then((data) => {
      cy.get(locators.general.clickAddBtn).click();
      this.cancelFrameWorkForm();
      cy.get(locators.general.clickAddBtn).click();
      cy.get(locators.general.saveBtn).click();
      cy.verifyToastMessageText(
        data.mandatoryErrorMsg,
        Cypress.env("waits").mediumWait
      );
    });
  }

  /**
   * Saves or discards the framework form.
   * @param {string} successMsg - Success message to verify upon saving.
   * @param {boolean} isDiscard - If true, the form is discarded instead of saving.
   */
  saveDiscardForm(successMsg, isDiscard) {
    if (isDiscard) {
      this.cancelFrameWorkForm();
    } else {
      cy.get(locators.administration.QB.saveBtn).click();
      cy.verifyToastMessageText(successMsg, Cypress.env("waits").mediumWait);
    }
  }

  /**
   * Creates a new framework entry.
   * @param {string} sectionName - The section from the data file to use for framework creation.
   * @param {boolean} isDiscard - If true, the form is discarded after filling instead of saving.
   */
  createFrameWork(sectionName, isDiscard = false) {
    cy.createRandomString(5).then(($el) => {
      cy.readFile(frameWorkDataString).then((data) => {
        const name = data[sectionName].baseName + $el;
        data[sectionName].name = name;
        cy.get(locators.general.clickAddBtn).click();
        assessment.addFrameWork(name, data[sectionName].description);
        this.saveDiscardForm(data.saveSuccessMsg, isDiscard);
        cy.reload();
        cy.writeFile(frameWorkDataString, data);
      });
    });
  }

  /**
   * Updates an existing framework entry.
   * @param {boolean} isDiscard - If true, the form is discarded instead of saving updates.
   */
  updateFrameWork(isDiscard) {
    cy.createRandomString(5).then(($el) => {
      cy.readFile(frameWorkDataString).then((data) => {
        const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const name = data.updateFrameWork.baseName + currentTime + $el;
        const description = data.updateFrameWork.description;
        data.updateFrameWork.name = name;
        assessment.addFrameWork(name, description);
        this.saveDiscardForm(data.saveSuccessMsg, isDiscard);
        cy.writeFile(frameWorkDataString, data);
      });
    });
  }

  /**
   * Searches for a framework using a filter.
   * @param {string} name - The name of the framework to search for.
   */
  searchWithFilter(name) {
    cy.get(locators.general.filterIcon).click({ force: true });
    cy.waitForTopMsgLoaderToDisappear(40000);
    cy.searchFilterNameWithoutStatus(
      name,
      locators.administration.frameWork.frameWorkFilterName
    );
    cy.get(locators.administration.frameWork.frameWorkGrid)
      .contains(name)
      .click();
  }

  /**
   * Filters the framework data based on the provided section name.
   * Reads the framework data from a file, retrieves the name associated
   * with the given section, and applies the search filter.
   *
   * @param {string} sectionName - The name of the section to filter by.
   */
  frameworkFilter(sectionName){
    cy.readFile(frameWorkDataString).then((data) => {
      const name = data[sectionName].name;
      this.searchWithFilter(name);
    })
  }

  /**
   * Verifies that a framework exists with the correct details.
   * @param {string} sectionName - The section from the data file to validate.
   */
  verifyFrameWork(sectionName) {
    cy.readFile(frameWorkDataString).then((data) => {
      const name = data[sectionName].name;
      const description = data[sectionName].description;
      this.searchWithFilter(name);
      cy.get(locators.administration.frameWork.frameWorkNameField).as(
        "frameWorkName"
      );

      cy.get("@frameWorkName").should("have.attr", "maxlength", "255");
      cy.get("@frameWorkName").should("have.value", name);

      if (description) {
        cy.get(locators.administration.frameWork.frameWorkDescription).as(
          "frameWorkDescription"
        );

        cy.get("@frameWorkDescription").should(
          "have.attr",
          "maxlength",
          "2500"
        );
        cy.get("@frameWorkDescription").should("have.text", description);
      }
    });
  }

  /**
   * Verifies that the framework list is displayed and contains multiple entries.
   */
  verifyFrameWorkList() {
    cy.waitForTopMsgLoaderToDisappear(50000);
    cy.get(locators.administration.frameWork.frameWorkGrid).should(($grid) => {
      expect($grid.length).to.be.greaterThan(0);
    });
  }

  /**
   * Sorts the framework list by the specified column.
   * @param {string} sortColumnName - The name of the column to sort by.
   */
  sortFrameWorkList(sortColumnName) {
    cy.waitForTopMsgLoaderToDisappear(40000);
    cy.readFile(frameWorkDataString).then((data) => {
      for (let i = 0; i < 2; i++) {
        cy.get(locators.administration.frameWork.sortFrameWorkGrid)
          .should("be.visible")
          .contains(sortColumnName)
          .click({ delay: 1000 });
        cy.waitForTopMsgLoaderToDisappear(40000);
      }
      cy.get(locators.administration.frameWork.frameWorkGrid).should(
        "be.visible"
      );
      this.verifyFrameWorkList();
    });
  }

  /**
   * Verifies pagination functionality by navigating to the last page.
   */
  verifyPagination() {
    cy.waitForTopMsgLoaderToDisappear(40000);
    cy.get(locators.general.gridTopDoubleRightPageBtn).click();
    this.verifyFrameWorkList();
  }
}

export default Frameworks;
