import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";

/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />

////Data Provider ///
const RiskCategory = require("../../fixtures/RiskModule/Risk Register/RiskCategory.json");

describe("Risk Register Top Three Ellipsis Options Automation", () => {
  const predictMenu_PO = new PredictMenu_PO();
  const riskRegister_PO = new RiskRegister_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  beforeEach(function () {
    cy.loginWithSession(
      "login with Risk Management User",
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );
    cy.visitRiskRegister();
    cy.get("#myGrid").getAgGridData();
  });

  RiskCategory.forEach((test) => {
    it(test.name, () => {
      cy.waitForMyGridLoaderToDisappear(10000);
      cy.viewport(2000, 1300); // Set viewport to width and height
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.addRiskCategory(test.riskName, test.description);
    });
  });

  it("Applicability Filter Risk Register Data", () => {
    cy.waitForMyGridLoaderToDisappear(10000);
    cy.viewport(2000, 1300); // Set viewport to width and height
    riskRegister_PO.threeEllipsisMenu();
    riskRegister_PO.applicabilityFilter();
  });

  it("Defer Filter Risk Register Data", () => {
    cy.waitForMyGridLoaderToDisappear(10000);
    cy.viewport(2000, 1300); // Set viewport to width and height
    riskRegister_PO.threeEllipsisMenu();
    riskRegister_PO.applicabilityFilter();
  });

  it("Emerging Filter Risk Register Data", () => {
     cy.waitForMyGridLoaderToDisappear(10000);
    cy.viewport(2000, 1300); // Set viewport to width and height
    riskRegister_PO.threeEllipsisMenu();
    riskRegister_PO.applicabilityFilter();
  });

  it("Not Applicable Filter Risk Register Data", () => {
    cy.waitForMyGridLoaderToDisappear(10000);
    cy.viewport(2000, 1300); // Set viewport to width and height
    riskRegister_PO.threeEllipsisMenu();
    riskRegister_PO.applicabilityFilter();
  });

  it.only("Export Risk Register Successfully", () => {
    cy.waitForMyGridLoaderToDisappear(10000);
    cy.viewport(2000, 1300); // Set viewport to width and height
    riskRegister_PO.threeEllipsisMenu();
    riskRegister_PO.exportOption();
  });

  it.only("Import Risk Register Successfully", () => {
    cy.waitForMyGridLoaderToDisappear(10000);
    cy.viewport(2000, 1300); // Set viewport to width and height
    riskRegister_PO.threeEllipsisMenu();
    riskRegister_PO.importOption();
  });
});
