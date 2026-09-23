

import loginFunction from '../../support/POM/Functions/loginFunction';
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import ControlCategory_PO from "../../support/POM/RiskModule_PO/ControlCategory_PO";

/// <reference types= "cypress" />

////Data Provider ///
const controlCategory = require('../../fixtures/RiskModule/Control_Taxonomy/controlCategory.json')
const NegativeImpact_ControlCategory = require('../../fixtures/RiskModule/Control_Taxonomy/NegativeImpact_ControlCategory.json')

describe("Control Category Screen Automation", () => {

    const predictMenu_PO = new PredictMenu_PO();
    const controlCategory_PO = new ControlCategory_PO();


    beforeEach(function () {
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.session("riskUserLogin", () => {
            cy.visit(Cypress.config("baseUrl"))
            cy.login(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"))
        })
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });

    })
    ////####Add Control Category Successfully #######/////////
    controlCategory.forEach(test => {
        it("Add Control Category Successfully and Add Control Category for Negative Impact Successfully", () => {
          cy.visitProfile();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTaxonomyClick();
            controlCategory_PO.addControlButton();
            controlCategory_PO.addControlCategoryInfo(test.ControlCategoryID, test.controlName);
            controlCategory_PO.saveButton();
            cy.visitControlTaxonomyCS();
            NegativeImpact_ControlCategory.forEach(test => {
                controlCategory_PO.addControlButton();
                controlCategory_PO.addControlCategoryNegativeImpact(test.ControlCategoryID, test.controlName);
                controlCategory_PO.saveButton();
            })

        })
    })

    //####Add Control Category for Negative Impact Successfully #######/////////
    NegativeImpact_ControlCategory.forEach(test => {
        it(test.name, () => {
           cy.visitProfile();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTaxonomyClick();
            controlCategory_PO.addControlButton();
            controlCategory_PO.addControlCategoryNegativeImpact(test.ControlCategoryID, test.controlName);
            controlCategory_PO.saveButton();

        })
    })

})



