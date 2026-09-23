

import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskDefinition_PO from "../../support/POM/RiskModule_PO/RiskDefinition_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";


/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />


////Data Provider ///
const riskCategory_ManageDetailedControl = require('../../fixtures/RiskModule/Manage Detailed Controls/riskCategory_ManageDetailedControl.json')
const riskDefinition_ManageDetailedControl = require('../../fixtures/RiskModule/Manage Detailed Controls/riskDefinition_ManageDetailedControl.json')


//Data Provider ///
before(function () {
    cy.fixture('RiskModule/RiskCategoryName.json').then(function (data) {
        global.data = data;


    });

}); 

describe("Setup Risk Category & Risk Defintion for Manage Detailed Controls Feature", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskCategory_PO = new RiskCategory_PO();
    const riskDefinition_PO = new RiskDefinition_PO();


    riskCategory_ManageDetailedControl.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
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


    ///**Add Risk Definition into Category */       
    riskDefinition_ManageDetailedControl.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
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


})




