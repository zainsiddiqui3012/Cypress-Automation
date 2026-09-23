import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import ControlDefinition_PO from "../../support/POM/RiskModule_PO/ControlDefinition_PO";

// <reference types= "cypress" />

////Data Provider ///
const controlDefinition = require('../../fixtures/RiskModule/Control_Taxonomy/controlDefinition.json')
//Data Provider ///
before(function () {
    cy.fixture('RiskModule/Control_Taxonomy/ControlCategoryMapping.json').then(function (data) {
        global.data = data;
        cy.fixture('RiskModule/Control_Taxonomy/ControlCategoryMapping.json').then(function (testdata) {
            global.testdata = testdata;
        })
    })
});
// ///***run scripts 5 time */
// Cypress._.times(5, () => {
describe("Setup Control Definition for Recommended Controls", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const controlDefinition_PO = new ControlDefinition_PO();

    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();

    });

    /**Add control Definition */
    controlDefinition.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTaxonomyClick();
            controlDefinition_PO.addDefinitionButton();
            controlDefinition_PO.addDefinitionInfo(test.controlDefinitionID, test.definitionName, test.description, test.controlFrequency, test.controlTypes, test.controlExecution, data.ControlCategoryTreeMapping);
            controlDefinition_PO.savebutton();
        })
    })
});


