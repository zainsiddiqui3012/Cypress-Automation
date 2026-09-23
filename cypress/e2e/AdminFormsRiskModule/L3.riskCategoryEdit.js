

import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";


/// <reference types= "cypress" />

////Data Provider ///
const editRiskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/editRiskCategory.json')
const validationRiskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/validationRiskCategory.json')
const childCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/childCategory.json')

before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();

})

//Data Provider ///
before(function () {
    cy.fixture('RiskModule/RiskDefintionName.json').then(function (data) {
        global.data = data;


    });

});


describe("Risk Category Edit and Add child Category Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskCategory_PO = new RiskCategory_PO();

    editRiskCategory.forEach(test => {
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
            riskCategory_PO.editCategory(data.RiskDefinitionSearch, test.riskCategoryID, test.riskName, test.description);
            riskCategory_PO.savebutton();

        })


    })



    childCategory.forEach(test => {
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
            riskCategory_PO.childCategoryInfo(test.riskCategoryID, test.riskName, test.description);
            riskCategory_PO.savebutton();

        })

    })



    validationRiskCategory.forEach(test => {
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
            riskCategory_PO.validationCategoryInfo(test.riskCategoryID, test.riskName, test.description);
            riskCategory_PO.savebutton();
            cy.get('.toast-message').contains('Please Enter Name And Then Select Content Library')



        })

    })


})


