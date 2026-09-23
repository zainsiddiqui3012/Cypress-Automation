/**
 * RiskRegisterPage Class - Handles interactions with the Risk Register page.
 * @module RiskRegisterPage
 */

import locators from "../../../fixtures/locators.json";
import dataFile from "../../../fixtures/RiskModule/RiskItem/DataFile.json";

class RiskRegisterPage {
  /**
   * Searches and verifies the presence of a risk item in the grid.
   * Hovers over the 'Risk' column, opens the filter menu, and applies a search filter.
   * @function searchAndVerifyRiskItem
   * @returns {void}
   */
  searchAndVerifyRiskItem() {
    cy.waitForMyGridLoaderToDisappear(30000);
    cy.get(locators.risk.riskRegister.riskColumnHeader)
      .first()
      .trigger("mouseover");
    cy.get(locators.risk.riskRegister.riskColumnHeader)
      .first()
      .find(locators.risk.riskRegister.columnMenuIcon)
      .click();
    cy.get(locators.risk.riskRegister.expandAllOption)
      .should("be.visible")
      .click();
    cy.waitForOverlayLoaderToDisappear(30000);
    cy.get(locators.risk.riskRegister.riskFilterInput)
      .first()
      .clear()
      .type(dataFile.riskName);
  }

  /**
   * Opens the details view of a specific risk item.
   * @function openRiskDetails
   * @returns {void}
   */
  openRiskDetails() {
    cy.get(locators.risk.riskRegister.detailModalFlyerOpenr).click();
  }

  /**
   * Deletes a risk item from the Risk Register.
   * Performs click actions to confirm deletion and waits for loaders to disappear.
   * @function deleteRisk
   * @returns {void}
   */
  deleteRisk() {
    cy.get(locators.risk.riskRegister.deleteButton).click();
    cy.get(locators.risk.riskRegister.deleteRiskButton).click();
    cy.waitForOverlayLoaderToDisappear(30000);
  }

  /**
   * Verifies the deletion toast message after deleting a risk.
   * @function verifyDeletionToast
   * @returns {void}
   */
  verifyDeletionToast() {
    cy.verifyToastMessageText(dataFile.deletToast, 20000);
    cy.waitForOverlayLoaderToDisappear(50000);
  }

  /**
   * Verifies the risk item is no longer present in the grid.
   * Ensures the risk name is not found in the grid container.
   * @function verifyRiskNotPresent
   * @returns {void}
   */
  verifyRiskNotPresent() {
    cy.waitForMyGridLoaderToDisappear(30000);
    cy.wait(2000);
    cy.get(locators.risk.riskRegister.gridContainer).should(
      "not.contain",
      dataFile.riskName
    );
  }
}

export default new RiskRegisterPage();
