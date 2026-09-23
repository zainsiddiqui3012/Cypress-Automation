

import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../support/POM/RiskModule_PO/RiskDefinition_PO";


/// <reference types= "cypress" />

////Data Provider ///
const riskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json')

before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();

})


describe("Risk Category New Screen Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskCategory_PO = new RiskCategory_PO();

    riskCategory.forEach(test => {
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
            riskCategory_PO.addCategoryButton();
            riskCategory_PO.addCategoryInfo(test.riskCategoryID, test.riskName, test.description);
            riskCategory_PO.savebutton();

        })

    })

})




