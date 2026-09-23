import { title } from "process";
import locators from "../../../fixtures/locators.json";
import dataFile from "../../../fixtures/RegChangeManagementV2-Decisions/FeedRegister.json";
import FeedRegister from "./FeedRegister";
import RegulatoryChange from "./RegulatoryChange";
import dayjs from "dayjs";
const mainURL = Cypress.env("BASE_URL");
const timeStamp = dayjs().format("MM-DD-YYYY");
const regChange = new RegulatoryChange();
const writeFile =
  "cypress/fixtures/RegChangeManagementV2-Decisions/WriteAdministration.json";
class TakeAction {
  takeActionLocator = locators.regChangeManagementV2.feedRegister.takeAction;
  regLocator = locators.regChangeManagementV2.feedRegister;
  feedRegister = new FeedRegister();

  /**
   * Scrolls the grid to the right and searches for a specific title in the grid.
   */
  scrollGrid() {
    cy.get(this.regLocator.agGrid.scrollGrid).scrollTo("right");
  }

  /**
   * Verifies the visibility and state (enabled/disabled) of various "Take Action" buttons.
   * * @param {String} status - the flag for validating status in Status column
   */
  verifyTakeActionbtns(status = null, title) {
    cy.get(this.regLocator.agGrid.gridID, {
      timeout: Cypress.env("waits").longWait,
    }).should("be.visible");

    this.feedRegister.searchTitleInGrid(title);

    cy.get(this.takeActionLocator.resumeBtn, {
      timeout: Cypress.env("waits").longWait,
    }).should("be.disabled");

    cy.get(this.takeActionLocator.updateBtn).should("be.disabled");

    cy.get(this.takeActionLocator.takeActionBtn).eq(0).should("be.enabled");

    if (status !== null) {
      this.verifyStatus(status);
    }
  }

  verifyStatus(status) {
    this.scrollGrid();
    cy.get(this.regLocator.agGrid.statusColumn, {
      timeout: Cypress.env("waits").longWait,
    })
      .eq(1)
      .should("contain", status);
  }

  /**
   * Clicks the "Take Action" button if it is enabled and verifies the modal title.
   */
  clickTakeActionBtn() {
    cy.get(this.takeActionLocator.takeActionBtn, {
      timeout: Cypress.env("waits").longWait,
    })
      .eq(0)
      .if("enabled")
      .should("be.enabled")
      .click();

    cy.get(this.takeActionLocator.modalTitle)
      .should("be.visible")
      .should("contain", dataFile.takeActionTitle);
  }

  /**
   * Clicks the "Cancel" button in the "Take Action" modal and verifies that the modal is closed.
   */
  clickCancelButton() {
    this.clickTakeActionBtn();
    cy.wait(3000); //wait for opening modal
    cy.get(this.takeActionLocator.cancelBtn, { timeout: 30000 }).click();
    cy.get(this.takeActionLocator.modalTitle).should("not.be.visible");
  }

  /**
   * Clicks the "Create Regulatory Change" button, verifies the URL, and navigates to the appropriate page.
   */
  createRegChange() {
    this.clickTakeActionBtn();

    cy.get(this.takeActionLocator.createRegChangeBtn, {
      timeout: Cypress.env("waits").longWait,
    })
      .invoke("attr", "href")
      .then((href) => {
        const fullUrl = href.startsWith("https") ? href : `${mainURL}${href}`;

        cy.get(this.takeActionLocator.createRegChangeBtn)
          .invoke("removeAttr", "target")
          .click();

        cy.readFile(writeFile).then((file) => {
          file.summaryURL = fullUrl;
          cy.writeFile(writeFile, file);
        });
        cy.visit(fullUrl);
        regChange.fillForm();
      });
  }

  /**
   * Searches for a specific title in the grid, clicks the "Take Action" button, selects a regulatory change,
   * links it, and verifies the success message.
   *
   * @param {string} regChange - The name of the regulatory change to select.
   * @param {string} msg - The expected success message after linking.
   * @param {boolean} openDropdown - the flag for selecting Reg Change from dropdown
   */
  clickLinkButton(regChange, msg, openDropdown = false, title) {
    this.feedRegister.searchTitleInGrid(title);

    cy.get(this.takeActionLocator.takeActionBtn)
      .eq(0)
      .if("enabled")
      .should("be.enabled")
      .click()
      .else("disabled");

    cy.wait(3000); // waiting for opening modal
    if (openDropdown === true) {
      cy.get(this.takeActionLocator.regChangeDropdown, {
        timeout: Cypress.env("waits").longWait,
      }).click({
        force: true,
      });

      cy.get(this.takeActionLocator.regChangeDropdownSearch)
        .type(regChange, { delay: 250 })
        .type("{Enter}");
    }

    cy.get(this.takeActionLocator.linkButton).dblclick();
    cy.verifyToastMessageContains(msg, Cypress.env("waits").shortWait);
  }

  /**
   * Validates that after linking, the "Take Action" button is disabled,
   * the status column reflects the correct state, and the assignee column contains the expected value.
   *
   * @param {string} assignee - The expected assignee name.
   */
  verifyAssignee(assignee) {
    cy.get(this.regLocator.agGrid.assigneeColumn)
      .eq(1)
      .should("contain", assignee);
  }
  /**
   * This method validates the functionality of updating a record in the feed grid.
   * Searches for a specific title in the grid using the provided dataFile.title[0].
   *Verifies the updated date column (updatedDateColumn) is visible and has the expected background color (dataFile.backColumnColor).
   * Calls the `verifyTakeActionbtns()` method to validate the state of action buttons.
   * Asserts that the toast message is visible and contains the expected text (dataFile.docMsg).
   * Reloads the page to ensure the update persists.
   * After the reload, confirms that the updated date column is visible and contains the correct timestamp (timeStamp).
   */

  validateUpdateFunctionality() {
    this.feedRegister.searchTitleInGrid(dataFile.title[0]);
    cy.get(this.regLocator.agGrid.updatedDateColumn, {
      timeout: Cypress.env("waits").longWait,
    })
      .eq(1)
      .should("be.visible")
      .should("have.css", "background-color", dataFile.backColumnColor);
    this.verifyTakeActionbtns();

    cy.verifyToastMessageContains(
      dataFile.docMsg,
      Cypress.env("waits").shortWait
    );
    cy.reload();
    cy.get(this.regLocator.agGrid.updatedDateColumn, {
      timeout: Cypress.env("waits").longWait,
    })
      .should("be.visible")
      .should("contain", timeStamp);
  }
  /**
   * This method searches for a title in the grid, verifies the presence of a valid URL in the <a> tag,
   * removes the `target` attribute to ensure it opens in the same window, and then navigates to the URL.
   * After visiting the URL, it verifies that the current URL matches the expected URL.
   */
  clickTitle() {
    // Search for the title in the grid
    this.feedRegister.searchTitleInGrid(dataFile.title[0]);

    // Wait for the <a> tag to be visible and ensure it has the href attribute
    cy.get(this.regLocator.agGrid.titleColumn, {
      timeout: Cypress.env("waits").shortWait,
    })
      .find(this.regLocator.agGrid.titleLink) // Ensure the selector is specific enough
      .should("have.attr", "href") // Ensure the <a> tag has the href attribute before invoking
      .then((href) => {
        // Check if href is present before proceeding
        if (href) {
          const screenUrl = href.startsWith("https")
            ? href
            : `${Cypress.config("baseUrl")}${href}`;

          // Remove the target attribute to ensure the link opens in the same window
          cy.get(this.regLocator.agGrid.titleColumn)
            .find(this.regLocator.agGrid.titleLink)
            .invoke("removeAttr", "target")
            .click();

          // Visit the Compliance Document URL
          cy.visit(screenUrl);

          // Verify that the current URL contains the expected URL
          cy.url().should("contain", screenUrl);
        }
      });
  }

  /**
   * This method scrolls through the grid to find a specific regulatory change view link,
   * waits for the link to be visible, clicks on the link, and then verifies that the URL
   * contains the expected document URL from the dataFile.
   */
  clickRegChangeView() {
    this.scrollGridAndSearch();
    // Wait for the <a> tag to be visible and ensure it has the href attribute
    cy.get(this.regLocator.agGrid.regulatoryChangeColumn, {
      timeout: Cypress.env("waits").shortWait,
    })
      .find(this.regLocator.agGrid.regulatoryChangeView)
      .should("have.text", dataFile.viewLinkText) // Ensure the selector is specific enough
      .click();

    cy.url().should("contain", dataFile.docURL);
  }
}

export default TakeAction;
