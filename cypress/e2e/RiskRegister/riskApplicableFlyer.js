import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";

/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />

////Data Provider ///
const ApplicableFlyer = require("../../fixtures/RiskModule/Risk Register/ApplicableFlyer.json");

//Data Provider ///
before(function () {
  cy.fixture("RiskModule/RiskCategoryName.json").then(function (data) {
    global.data = data;

    cy.fixture("RiskModule/RiskDefintionName.json").then(function (rd) {
      global.rd = rd;
    });
  });
});

describe("Mark Applicable, Defer, Not Applicable and Emerging Risk from Risk Register Three Ellipsis Options", () => {
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

  /////*****Applicable flyer - Marked Applicable */
  ApplicableFlyer.forEach((test) => {
    it(test.Applicable, () => {
      cy.viewport(2000, 1300); // Set viewport to width and height
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.riskTaxonomyclick();
      riskRegister_PO.applicableMarked(test.BU2, data.riskItemSearch);
      riskRegister_PO.saveRiskTaxonomy();
    });
  });

  ////*****Applicable flyer - Marked Defer*/
  ApplicableFlyer.forEach((test) => {
    it(test.Defer, () => {
      cy.viewport(2000, 1300); // Set viewport to width and height
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.riskTaxonomyclick();
      riskRegister_PO.deferMarked(test.BU1, rd.RiskDefinitionSearch);
      riskRegister_PO.saveRiskTaxonomy();
    });
  });
  ////*****Applicable flyer - Marked Not Applicable*/
  ApplicableFlyer.forEach((test) => {
    it(test.NotApplicable, () => {
      cy.viewport(2000, 1300); // Set viewport to width and height
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.riskTaxonomyclick();
      riskRegister_PO.notApplicableMarked(test.BU3, rd.RiskDefinitionSearch);
      riskRegister_PO.saveRiskTaxonomy();
    });
  });

  ////*****Applicable flyer - Marked Emerging */
  ApplicableFlyer.forEach((test) => {
    it(test.Emerging, () => {
      cy.viewport(2000, 1300); // Set viewport to width and height
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.riskTaxonomyclick();
      riskRegister_PO.emergingMarked(test.BU4, rd.RiskDefinitionSearch);
      riskRegister_PO.saveRiskTaxonomy();
    });
  });
});
