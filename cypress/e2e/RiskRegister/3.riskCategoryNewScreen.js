import loginFunction from '../../support/POM/Functions/loginFunction';
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";

/// <reference types= "cypress" />

////Data Provider ///
const riskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json')
const editRiskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/editRiskCategory.json')
const validationRiskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/validationRiskCategory.json')
const childCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/childCategory.json')


describe("Risk Category New Screen Automation", () => {

    const predictMenu_PO = new PredictMenu_PO();
    const riskCategory_PO = new RiskCategory_PO();


    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();

    })

    riskCategory.forEach(test => {
        it(test.name, () => {

            //Login Details
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            riskCategory_PO.clickOnMyTaxonomiesTab();
            riskCategory_PO.addCategoryButton();
            riskCategory_PO.addCategoryInfo(test.riskCategoryID, test.riskName, test.description);
            riskCategory_PO.savebutton();

        })

                   // ///**Add Edit Category */ 
            // editRiskCategory.forEach(test => {

            //     riskCategory_PO.editCategory(test.riskCategoryID, test.riskName, test.description);
            //     riskCategory_PO.savebutton();
            // })


    })

    // childCategory.forEach(test => {
    //     it(test.name, () => {

    //         //Login Details
    //         cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
    //         loginDetails_PO.visitUrl();
    //         loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
    //         loginDetails_PO.clickOn_LoginButton();

    //         predictMenu_PO.menuClick();
    //         predictMenu_PO.riskAndControlRegisterClick();
    //         predictMenu_PO.riskAdministrationClick();
    //         predictMenu_PO.riskAndProcessTaxonomyClick();
    //         riskCategory_PO.addCategoryButton();
    //         riskCategory_PO.childCategoryInfo(test.riskCategoryID, test.riskName, test.description);
    //         riskCategory_PO.savebutton();

    //     })

    // })


    // it.skip("Delete Risk Catergory", () => {

    //     //Login Details
    //     cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
    //     loginDetails_PO.visitUrl();
    //     loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
    //     loginDetails_PO.clickOn_LoginButton();

    //     predictMenu_PO.menuClick();
    //     predictMenu_PO.riskAndControlRegisterClick();
    //     predictMenu_PO.riskAdministrationClick();
    //     predictMenu_PO.riskAndProcessTaxonomyClick();
    //     riskCategory_PO.deleteRiskCategory();


    // })

    // validationRiskCategory.forEach(test => {
    //     it(test.name, () => {

    //         //Login Details
    //         cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
    //         loginDetails_PO.visitUrl();
    //         loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
    //         loginDetails_PO.clickOn_LoginButton();

    //         predictMenu_PO.menuClick();
    //         predictMenu_PO.riskAndControlRegisterClick();
    //         predictMenu_PO.riskAdministrationClick();
    //         predictMenu_PO.riskAndProcessTaxonomyClick();
    //         riskCategory_PO.addCategoryButton();
    //         riskCategory_PO.validationCategoryInfo(test.riskCategoryID, test.riskName, test.description);
    //         riskCategory_PO.savebutton();
    //         //cy.get('.toast').contains('Problem(s) in save. Please update the highlighted fields below and try again.')


    //     })

    // })


})



