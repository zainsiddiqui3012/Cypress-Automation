


import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import DefaultAssessments_PO from "../../support/POM/RiskModule_PO/DefaultAssessments_PO";

/// <reference types= "cypress" />

////Data Provider ///
const DefaultAssessments = require('../../fixtures/RiskModule/Default Assessments/DefaultAssessments.json')



describe("Default Assessments Screen Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const defaultAssessments_PO = new DefaultAssessments_PO();



    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();



    })

    DefaultAssessments.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.defaultAssessmentsClick();
            defaultAssessments_PO.selectInherentRiskProbabilityAssessment(test.InherentRiskProbabilityAssessment, test.InherentRiskImpactAssessment, test.ControlEnvironmentAssessment);
            defaultAssessments_PO.savebutton();
            cy.get('.toast-message').contains('Assessment is already linked to Assignment')


        })
    })


    it("Check Validation of Assign Risk Analysis Assessment", () => {

        //Login Details
        cy.log(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.defaultAssessmentsClick();
        defaultAssessments_PO.validationcheck()
        defaultAssessments_PO.savebutton();
        cy.get('.toast').contains('Atleast one Assessment is required for Assignment')

    })




})



