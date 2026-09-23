import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";

/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />

const RiskRegisterBUFilter = require('../../fixtures/RiskModule/Risk Register/RiskRegisterBUFilter.json')



describe("Risk Register Top Menu/option Automation", () => {

    const predictMenu_PO = new PredictMenu_PO();
    const riskRegister_PO = new RiskRegister_PO();



    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();
    })

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
    it("Refersh Risk Register Page Successfully", () => {
        cy.viewport(2000, 1300) // Set viewport to width and height
        riskRegister_PO.refershButtonRiskRegister();

    })

    it("Wrap Text Risk Register Successfully", () => {
        cy.viewport(2000, 1300) // Set viewport to width and height
        riskRegister_PO.WrapTextRiskRegister();
    })

    it("Likeihood / Impact Toggle Risk Register Successfully", () => {
        cy.viewport(2000, 1300) // Set viewport to width and height
        riskRegister_PO.likeihoodImpactRiskRegister();
    })
})
