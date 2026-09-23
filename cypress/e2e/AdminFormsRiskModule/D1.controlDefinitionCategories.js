
import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import ControlDefinitionCategories_PO from "../../support/POM/RiskModule_PO/controlDefinitionCategories_PO";


////Data Provider ///
const ControlDefinitionCategory = require('../../fixtures/RiskModule/Control Definition Categories/ControlDefinitionCategory.json')
const EditControlDefinitionCategory = require('../../fixtures/RiskModule/Control Definition Categories/EditControlDefinitionCategory.json')


describe("Control Definition Categories Screen Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const controlDefinitionCategories_PO = new ControlDefinitionCategories_PO();


    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();

    })


    ControlDefinitionCategory.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlDefinitionCategoriesClick();
            controlDefinitionCategories_PO.addButton();
            controlDefinitionCategories_PO.addControlInfo(test.controlName);

        })

    })

    ControlDefinitionCategory.forEach(test => {
        it("Edit Control Definition Category Successfully", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlDefinitionCategoriesClick();
            controlDefinitionCategories_PO.editControlInfo(test.controlName);

            EditControlDefinitionCategory.forEach(test => {
                controlDefinitionCategories_PO.editControlName(test.NameEdit);


            })

        })


    })



    EditControlDefinitionCategory.forEach(test => {
        it("Inactive Control Definition Category Successfully", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlDefinitionCategoriesClick();
            controlDefinitionCategories_PO.inactiveAndActive(test.NameEdit);

        })


    })

    ControlDefinitionCategory.forEach(test => {
        it("Validation Check Control Definition Category", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlDefinitionCategoriesClick();
            controlDefinitionCategories_PO.addButton();
            controlDefinitionCategories_PO.addButton();
            cy.get('.toast').contains('Empty record exist')
        })


    })




})
