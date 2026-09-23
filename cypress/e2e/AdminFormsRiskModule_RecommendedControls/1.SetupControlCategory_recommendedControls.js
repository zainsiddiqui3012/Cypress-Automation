
import { it } from "mocha";
import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import ControlCategory_PO from "../../support/POM/RiskModule_PO/ControlCategory_PO";

/// <reference types= "cypress" />
////Data Provider ///
const controlCategory = require('../../fixtures/RiskModule/Control_Taxonomy/controlCategory.json')

before(function () {

    cy.fixture('RiskModule/Control_Taxonomy/ControlCategoryMapping.json').then(function (testdata) {
        global.testdata = testdata;
    })
})

describe("Setup Control Category for Recommended Controls", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const controlCategory_PO = new ControlCategory_PO();


    controlCategory.forEach(test => {
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
            controlCategory_PO.addControlButton();
            controlCategory_PO.addControlCategoryInfo(test.ControlCategoryID, test.controlName);
            controlCategory_PO.savebutton();

        })
    })
});