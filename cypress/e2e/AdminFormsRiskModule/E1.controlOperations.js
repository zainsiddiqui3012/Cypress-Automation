


import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import ControlOperations_PO from "../../support/POM/RiskModule_PO/ControlOperations_PO";

/// <reference types= "cypress" />

////Data Provider ///
const ControlOperation = require('../../fixtures/RiskModule/Control Operation/ControlOperation.json')
const EditControlOperation = require('../../fixtures/RiskModule/Control Operation/EditControlOperation.json')



describe("Control Operation Screen Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const controlOperations_PO = new ControlOperations_PO();



    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();



    })

    ControlOperation.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlOperationClick();
            controlOperations_PO.addButton();
            controlOperations_PO.addControlOperationsInfo(test.ControlOperationsName);


        })

    })

    ControlOperation.forEach(test => {

        it("Edit Control Operations Successfully", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlOperationClick();
            controlOperations_PO.editControlOperations(test.ControlOperationsName);

            EditControlOperation.forEach(test => {
                controlOperations_PO.editControlOperationsName(test.NameEdit);


            })

        })


    })


    EditControlOperation.forEach(test => {
        it("Inactive Control Operations Successfully", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlOperationClick();
            controlOperations_PO.inactiveAndActive(test.NameEdit);



        })


    })

    ControlOperation.forEach(test => {
        it("Validation Check Control Operations", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlOperationClick();
            controlOperations_PO.addButton();
            controlOperations_PO.addButton();
            cy.get('.toast').contains('Empty record exist')






        })


    })



})
