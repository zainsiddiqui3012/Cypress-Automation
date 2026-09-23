


import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskEvents_PO from "../../support/POM/RiskModule_PO/RiskEvents_PO";

/// <reference types= "cypress" />

////Data Provider ///
const RiskEvents = require('../../fixtures/RiskModule/Risk Event/RiskEvents.json')
const EdiRiskEvent = require('../../fixtures/RiskModule/Risk Event/EdiRiskEvent.json')



describe("Risk Event Screen Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskevents_PO = new RiskEvents_PO();



    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();



    })

    RiskEvents.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskEventsClick();


            riskevents_PO.addButton();
            riskevents_PO.addRiskEventInfo(test.riskEventsName);
            riskevents_PO.savebutton();

        })
    })


    RiskEvents.forEach(test => {
        it("Filter Risk Event and Edit Risk Event Successfully", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskEventsClick();
            riskevents_PO.filterRiskEvent(test.riskEventsName);

            EdiRiskEvent.forEach(test => {
                riskevents_PO.editRiskEvent(test.riskEventsName, test.EventType);
                riskevents_PO.savebutton();

            })

        })
    })

    it("Validation Check Risk Event", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskEventsClick();
        riskevents_PO.addButton();
        riskevents_PO.savebutton();


    })

})
