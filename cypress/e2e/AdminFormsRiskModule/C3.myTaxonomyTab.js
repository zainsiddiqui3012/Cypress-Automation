

import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";
import MyTaxonomyTab_PO from "../../support/POM/RiskModule_PO/myTaxonomyTab_PO";

/// <reference types= "cypress" />

//Data Provider ///
before(function () {
    cy.fixture('RiskModule/RiskDefintionName.json').then(function (data) {
        global.data = data;
        cy.fixture('RiskModule/RiskCategoryName.json').then(function (rc) {
            global.rc = rc;

        });
    });

});

////Data Provider ///
const riskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json')
const riskDefinition = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/riskDefinition.json')


describe("My Taxonomies Tab Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskCategory_PO = new RiskCategory_PO();
    const myTaxonomyTab_PO = new MyTaxonomyTab_PO();

    it("Verify My Taxonomies tab it would have same AG grid like risk libraries", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.myTaxonomyTabGridVerify();

    })

    it("Verify three ellipses it should have the import/export , Restore default layout options on my taxonomy tab. ", () => {
        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        riskCategory_PO.threeEllipsis();
        myTaxonomyTab_PO.verifyImport();
        riskCategory_PO.threeEllipsis();
        myTaxonomyTab_PO.verifyExport();
        riskCategory_PO.threeEllipsis();
        myTaxonomyTab_PO.verifyRestore();


    })


    riskCategory.forEach(test => {
        it("Case #1: Verify orphan category will be shown on the top of the gird in which all the risk definitions will be moved if their parent category will be deleted. Case #2 : Auto grid refresh whenever user adds risk category or risk definition. ", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            /////Case 1. Auto grid Refresh verify and case 2. delete definition  
            myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
            riskCategory_PO.deleteRiskCategory();
            myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
            myTaxonomyTab_PO.verifyRecordOrphan(data.RiskDefinitionSearch);



        })

    })


})
