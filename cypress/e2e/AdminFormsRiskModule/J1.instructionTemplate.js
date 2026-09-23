


import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import InstructionTemplate_PO from "../../support/POM/RiskModule_PO/InstructionTemplate_PO";


/// <reference types= "cypress" />

////Data Provider ///
const instructionTemplate = require('../../fixtures/RiskModule/Instruction Template/instructionTemplate.json')



describe("Instruction Template Screen Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const instructionTemplate_PO = new InstructionTemplate_PO();



    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();



    })

    instructionTemplate.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.instructionTemplateClick();
            instructionTemplate_PO.writeDescription(test.Description);
            instructionTemplate_PO.savebutton();

            // defaultAssessments_PO.savebutton();
            // cy.get('.toast').contains('Assessment is already linked to Assignment')


        })
    })




})



