import loginFunction from '../../support/POM/Functions/loginFunction';
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../support/POM/RiskModule_PO/RiskDefinition_PO";

/// <reference types= "cypress" />

////Data Provider ///
const riskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json')
const riskDefinition = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/riskDefinition.json')
const editRiskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/editRiskCategory.json')
const editRiskDefinition = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/editRiskDefinition.json')
const validationRiskDefinition = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/validationRiskDefinition.json')

// ///***run scripts 5 time */
// Cypress._.times(5, () => {

describe("Risk Defintion New Screen Automation", () => {

    const predictMenu_PO = new PredictMenu_PO();
    const riskCategory_PO = new RiskCategory_PO();
    const riskDefinition_PO = new RiskDefinition_PO();



    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();



    })


    ///**Add Risk Definition into Category */       
    riskDefinition.forEach(test => {
        it(test.name, () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            riskCategory_PO.clickOnMyTaxonomiesTab();
            riskDefinition_PO.addDefinitionButton();
            riskDefinition_PO.addDefinitionInfo(test.riskDefinitionId, test.definitionName, test.description);
            riskDefinition_PO.savebutton();

            // /**Add Edit Definition */
            // editRiskDefinition.forEach(test => {

            //     riskDefinition_PO.editDefintion(test.riskDefinitionId, test.definitionName, test.description);
            //     riskDefinition_PO.savebutton();
            // })


        })

    })

    // validationRiskDefinition.forEach(test => {
    //     it(test.name, () => {

    //         //Login Details
    //         cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
    //         loginDetails_PO.visitUrl();
    //         loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
    //         loginDetails_PO.clickOn_LoginButton();

    //         predictMenu_PO.menuClick();
    //         predictMenu_PO.riskAndControlRegisterClick();
    //         predictMenu_PO.riskAdministrationClick();
    //         predictMenu_PO.riskAndProcessTaxonomyClick();
    //         riskDefinition_PO.addDefinitionButton();
    //         riskDefinition_PO.validationDefinitionInfo(test.riskDefinitionId, test.definitionName, test.description);
    //         riskDefinition_PO.savebutton();
    //         cy.get('.toast').contains('Please Select a Different Parent. Parent Selected same as Risk Category being edited.')


    //     });

    // });

});

// });

