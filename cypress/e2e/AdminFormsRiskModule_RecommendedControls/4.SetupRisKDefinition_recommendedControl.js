import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../support/POM/RiskModule_PO/RiskDefinition_PO";

/// <reference types= "cypress" />
////Data Provider ///
const riskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json')
const riskDefinition = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/riskDefinition.json')
const editRiskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/editRiskCategory.json')

// ///***run scripts 5 time */
// Cypress._.times(5, () => {

describe("Setup Risk Defintion for Recommended Control Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskCategory_PO = new RiskCategory_PO();
    const riskDefinition_PO = new RiskDefinition_PO();
    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();

    })
    ///**Add Risk Definition into Category */       
    riskDefinition.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            riskCategory_PO.clickOnMyTaxonomiesTab();
            riskDefinition_PO.addDefinitionButton();
            riskDefinition_PO.addDefinitionInfo(test.riskDefinitionId, test.definitionName, test.description);
            riskDefinition_PO.savebutton();
            cy.wait(7000);

        })
    })
});
