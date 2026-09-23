


import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import EventTypes_PO from "../../support/POM/RiskModule_PO/EventTypes_PO";

/// <reference types= "cypress" />

////Data Provider ///
const EventTypes = require('../../fixtures/RiskModule/Event Types/EventTypes.json')
const EditEventTypes = require('../../fixtures/RiskModule/Event Types/EditEventTypes.json')



describe("Event Types Screen Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const eventTypes_PO = new EventTypes_PO();



    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();



    })

    EventTypes.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.eventtypesClick();
            eventTypes_PO.addButton();
            eventTypes_PO.addEventTypeInfo(test.eventName, test.description);
            eventTypes_PO.savebutton();

        })
    })


    EventTypes.forEach(test => {
        it("Filter Event Types and Edit Event Types Successfully", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.eventtypesClick();
            eventTypes_PO.filterEventTypes(test.eventName);

            EditEventTypes.forEach(test => {
                eventTypes_PO.editEventTypes(test.eventNameEdit, test.description);
                eventTypes_PO.savebutton();


            })




        })
    })

    it("Validation Check Event Types", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.eventtypesClick();
        eventTypes_PO.addButton();
        eventTypes_PO.savebutton();

    })






})



