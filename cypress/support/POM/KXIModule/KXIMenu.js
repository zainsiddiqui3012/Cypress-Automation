import locators from "../../../fixtures/locators.json";
import kxiMenu from "../../../fixtures/KXIModule/KXIMenu.json";

class KXIMenu {
  clickLeftMenu() {
    cy.get(locators.leftMenuBtn).click();
  }

  clickAdministration() {
    cy.get(locators.menu.administration).click();
  }

  verifyMenuItemAndLink(menuKey) {
    cy.get(locators.kxi.kxiMenu.menuItem)
      .contains("span", kxiMenu.withoutRM[menuKey].name)
      .should("be.visible")
      .parent()
      .should("have.attr", "href")
      .and("eq", kxiMenu.withoutRM[menuKey].link);
  }

  verifyPrevSibling(menuKey, prevKey) {
    cy.get(locators.kxi.kxiMenu.menuItem)
      .contains("span", kxiMenu.withoutRM[menuKey].name)
      .should("be.visible")
      .parentsUntil("ul")
      .eq(1)
      .prev()
      .contains("span", kxiMenu.withoutRM[prevKey].name);
  }

  verifyPrentAdministration(menuKey) {
    cy.get(locators.kxi.kxiMenu.menuItem)
      .contains("span", kxiMenu.withoutRM.administration.name)
      .should("be.visible")
      .parentsUntil(".dropdown.open")
      .parentsUntil("ul")
      .contains("span", kxiMenu.withoutRM[menuKey].name)
      .should("be.visible");
  }

  verifyPeerBankNotPresent() {
    cy.get(locators.kxi.kxiMenu.menuItem)
      .contains("span", kxiMenu.withoutRM.administration.name)
      .should("be.visible")
      .parentsUntil(".dropdown.open")
      .parentsUntil("ul")
      .find("li > a > span")
      .should("not.have.text", kxiMenu.withoutRM.peerBanks.name);
  }
}
export default KXIMenu;
