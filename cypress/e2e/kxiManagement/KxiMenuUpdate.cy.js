import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO.js";
////Data Provider ////
const kxiMenu = require("../../fixtures/KXIModule/KXIUpdatedMenu.json");
describe("Navigate to the QA environment, log in, open the left menu, select KXI Management, click Define KXi Variable ", () => {
  tags: [
    "@regression",
    "@kxi-management",
    "@pd-30296",
    "@release5.21",
    "@predict",
    "@customer",
  ];
  const predictMenu_PO = new PredictMenu_PO();
  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  kxiMenu.forEach((test) => {
    it("validate newly added Define-KXI-variable Menu Item", () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("kxiusername"),
        Cypress.env("kxipassword"),
        Cypress.env("kxikey")
      );
      predictMenu_PO.menuClick();
      predictMenu_PO.kxiMenuClick(test.kxiManagementMenu);
      predictMenu_PO.kxiMenuClick(test.kxiVariableDefinition);
    });
    it("validate newly added menu variable data", () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("kxiusername"),
        Cypress.env("kxipassword"),
        Cypress.env("kxikey")
      );
      predictMenu_PO.menuClick();
      predictMenu_PO.kxiMenuClick(test.kxiManagementMenu);
      predictMenu_PO.kxiMenuClick(test.variableData);
    });
  });
});
