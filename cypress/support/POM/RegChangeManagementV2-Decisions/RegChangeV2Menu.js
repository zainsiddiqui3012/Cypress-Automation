import locators from "../../../fixtures/locators.json";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Decisions/RegChangeMenu.json";
import "cypress-if";
class RegChangeV2Menu {
  /**
   *Click side menu
   * Click Compliance Management
   */
  clickLeftMenu() {
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.ComplianceManagement).click();
  }

  /**
   * Get menu item locator
   * Verify its name and URL
   * Click on menu item
   * @param {String} menuKey is menu item name
   */
  verifyMenuItemAndClick(menuKey) {
    // cy.visitProfile();
    // this.clickLeftMenu();
    cy.get(locators.kxi.kxiMenu.menuItem)
      .contains("span", menuKey["name"])
      .parent()
      .should("be.visible")
      .should("have.attr", "href", menuKey["link"])
      .click();
  }

  /**
   * Navigate to Welcome screen menu
   * Click Left Menu & click Compliance Management menu
   * Click Regulatory Change Management menu
   * Click Regulatory Change Feed Register menu
   * User should be navigated to
   *  @param {String} submodule Regulatory changesub module name
   */
  navigateToScreen(submodule, V2 = false, administration = false) {
    cy.visitProfile();
    this.clickLeftMenu();
    if (V2 === true) {
      this.verifyMenuItemAndClick(
        regChangeMenu.regulatoryChangeManagement.regulatoryChange
      );
    }
    if (administration === true) {
      cy.get(locators.menu.administrationRisk).eq(0).click();
    }
    this.verifyMenuItemAndClick(submodule);
  }
}

export default RegChangeV2Menu;
