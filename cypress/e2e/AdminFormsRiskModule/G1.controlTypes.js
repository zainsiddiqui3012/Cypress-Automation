


import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import ControlTypes_PO from "../../support/POM/RiskModule_PO/ControlTypes_PO";

/// <reference types= "cypress" />

////Data Provider ///
const ControlTypes = require('../../fixtures/RiskModule/Control Types/ControlTypes.json')
const EditControlTypes = require('../../fixtures/RiskModule/Control Types/EditControlTypes.json')



describe("Control Types Screen Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const controlTypes_PO = new ControlTypes_PO();



    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();



    })

    ControlTypes.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTypesClick();
            controlTypes_PO.addButton();
            controlTypes_PO.addControlTypeInfo(test.controlName, test.description);
            controlTypes_PO.savebutton();

        })
    })


    ControlTypes.forEach(test => {
        it("Filter Control Types and Edit Control Types Successfully", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTypesClick();
            controlTypes_PO.filterControlTypes(test.controlName);


            EditControlTypes.forEach(test => {
                controlTypes_PO.editControlTypes(test.controlName, test.description);
                controlTypes_PO.savebutton();


            })




        })
    })

    it("Validation Check Control Types", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.controlTypesClick();
        controlTypes_PO.addButton();
        controlTypes_PO.savebutton();
    })


})



