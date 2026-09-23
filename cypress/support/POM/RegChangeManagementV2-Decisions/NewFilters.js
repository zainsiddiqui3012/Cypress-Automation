import locators from "../../../fixtures/locators.json";
import dataFile from "../../../fixtures/RegChangeManagementV2-Decisions/NewFiltersData.json";
import feedRegister from "../../../support/POM/RegChangeManagementV2-Decisions/FeedRegister";
import dayjs from "dayjs";
const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
const filePath =
  "cypress/fixtures/RegChangeManagementV2-Decisions/FilterName.json";

class NewFilters {
  filterLocator = locators.regChangeManagementV2.feedRegister.filters;
  feedRegister = new feedRegister();
  /**
   * Returns the "Create New" button element after ensuring it is visible
   * and has the expected text. Used to trigger the creation of a new filter.
   */
  createNewButton() {
    return cy
      .get(this.filterLocator.createNewButton)
      .focus()
      .scrollIntoView()
      .should("be.visible")
      .should("have.text", dataFile.createNew);
  }

  /**
   * Creates a new filter using the provided parameters.
   * Handles optional settings like pinning, mandatory field validation, and filter name.
   * Displays appropriate toast messages and saves the filter name to a file if successful.
   *
   * @param {string|null} filterType - The base type/name of the filter to be created.
   * @param {boolean} pin - Whether to pin the filter or not.
   * @param {boolean} mandatory - Whether to trigger mandatory field validation.
   * @param {string|null} name - Optional custom name for the filter.
   */
  createNewFilter(
    filterType = null,
    pin = false,
    mandatory = false,
    name = null
  ) {
    this.createNewButton().click();
    const filterName = filterType + timeStamp;
    cy.wait(3000); // wait for opening modal

    if (mandatory === false) {
      cy.get(this.filterLocator.nameInput)
        .should("be.visible")
        .type(name == null ? filterName : name);
    }

    if (pin === true) {
      cy.get(this.filterLocator.pinCheckBox).if("visible").click();
    }

    cy.get(this.filterLocator.saveFilterModalButton)
      .should("be.visible")
      .click();

    if (mandatory === true) {
      cy.verifyToastMessageContains(
        dataFile.mandatoryMessge,
        Cypress.env("waits").longWait
      );
    } else if (name !== null) {
      cy.verifyToastMessageContains(
        dataFile.sameFilterMessge,
        Cypress.env("waits").longWait
      );
    } else {
      cy.verifyToastMessageContains(
        dataFile.filterSaveSuccessMessage,
        Cypress.env("waits").longWait
      );

      cy.readFile(filePath).then((file) => {
        file.filterName = filterName;
        cy.writeFile(filePath, file);
      });
      // this.feedRegister.clearTitleInGrid();
    }
  }

  /**
   * Verifies whether the specified filter name is present or not
   * in the "Select Filter" dropdown options.
   *
   * @param {string} filterName - The name of the filter to check for.
   */
  verifyFilterInSelectFilterDropdown(filterName) {
    cy.get(this.filterLocator.selectFilterDropdown, {
      timeout: Cypress.env("waits").longWait,
    })
      .should("be.visible")
      .click();
    cy.get(this.filterLocator.selectFilterDropdownValue).then(($dropdown) => {
      if ($dropdown.text().includes(filterName)) {
        cy.wrap($dropdown)
          .should("contain", filterName)
          .contains(filterName)
          .click();
      } else {
        cy.wrap($dropdown).should("not.contain", filterName);
      }
    });
  }
  verifySaveFilterButton() {
    cy.get(this.filterLocator.saveFilterButton, {
      timeout: Cypress.env("waits").longWait,
    })
      .focus()
      .should("be.visible")
      .click();
    cy.get(this.filterLocator.confirmSaveButton, {
      timeout: Cypress.env("waits").longWait,
    })
      .should("be.visible")
      .click();
  }
  saveButtonFunctionality(
    noChange = false,
    filterName = null,
    successMsg = false
  ) {
    if (noChange === true) {
      this.verifyFilterInSelectFilterDropdown(filterName);
      this.verifySaveFilterButton();
      cy.verifyToastMessageContains(
        dataFile.noChangesMsg,
        Cypress.env("waits").longWait
      );
    } else if (successMsg === true) {
      this.verifyFilterInSelectFilterDropdown(filterName);
      this.feedRegister.searchTitleInGrid("title123");
      this.verifySaveFilterButton();
      cy.verifyToastMessageContains(
        dataFile.successMsg,
        Cypress.env("waits").longWait
      );
    } else {
      this.verifySaveFilterButton();
      cy.verifyToastMessageContains(
        dataFile.selectFilterMsg,
        Cypress.env("waits").longWait
      );
    }
  }
  verifyViewButton(filterName, deleteFlag = false, noPin = false) {
    cy.get(this.filterLocator.viewFilterButton, {
      timeout: Cypress.env("waits").longWait,
    })
      .scrollIntoView()
      .should("be.visible")
      .click();
    if (deleteFlag === true) {
      this.verifyPinButton(filterName);
      this.clickDeleteButton(filterName);
    } else if (noPin === true) {
      this.verifyNopinElement(filterName);
    } else {
      this.clickUnpinSavedFilter().should("be.disabled");
      this.checkFilterCheckbox(filterName);
      this.clickUnpinSavedFilter().should("be.enabled").click();
      cy.verifyToastMessageContains(dataFile.unpinFilterSuccessMsg, 3000);
    }
  }

  clickDeleteButton(filterName) {
    cy.get(this.filterLocator.filterRowByName)
      .contains(filterName, { timeout: Cypress.env("waits").longWait })
      .scrollIntoView()
      .closest("tr")
      .find("td")
      .find(this.filterLocator.deleteButtonByFilterName)
      .scrollIntoView()
      .if("visible")
      .should("be.visible")
      .click()
      .else()
      .should("not.exist");
    cy.get(this.filterLocator.confirmDeleteButton, {
      timeout: Cypress.env("waits").longWait,
    })
      .should("be.visible")
      .click();
    cy.verifyToastMessageContains(dataFile.deleteFilterMsg, 10000);
  }

  verifyPinButton(filterName) {
    cy.get(this.filterLocator.filterRowByName)
      .contains(filterName, { timeout: Cypress.env("waits").longWait })
      .scrollIntoView()
      .parent("tr")
      .find(this.filterLocator.pinButtonByFilterName)
      .if("exists")
      .should("exist")
      .scrollIntoView()
      .if("visible")
      .should("be.visible")
      .else()
      .should("not.exist");
  }

  checkFilterCheckbox(filterName) {
    cy.contains(this.filterLocator.filterRowByName, filterName)
      .parent("tr")
      .find(this.filterLocator.unpinCheckbox)
      .check()
      .should("be.checked");
  }

  clickUnpinSavedFilter() {
    return cy
      .get(this.filterLocator.unpinSavedFilter)
      .scrollIntoView()
      .contains(dataFile.unpinFilterBtn)
      .if("visible")
      .should("be.visible");
  }
  verifyNopinElement(filterName) {
    cy.get(this.filterLocator.unpinSavedFilter).should("not.exist");
    cy.get(this.filterLocator.filterRowByName)
      .contains(filterName, { timeout: Cypress.env("waits").longWait })
      .scrollIntoView()
      .closest("tr")
      .find("td")
      .find(this.filterLocator.deleteButtonByFilterName)
      .if("visible")
      .click()
      .should("not.exist");
    this.verifyPinButton(filterName);
  }
}
export default NewFilters;
