import loginFunction from '../../support/POM/Functions/loginFunction';
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import ControlCategory_PO from "../../support/POM/RiskModule_PO/ControlCategory_PO";

/// <reference types="cypress" />

// Data Provider
const controlCategory = require('../../fixtures/RiskModule/Control_Taxonomy/controlCategory.json');

describe("Control Category Screen Automation", () => {
    const predictMenu_PO = new PredictMenu_PO();
    const controlCategoryPage = new ControlCategory_PO(); // Renamed instance to avoid conflict

    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    controlCategory.forEach((test) => {
        it("Move Control category Successfully", () => {
            loginFunction(); // Logs in the user
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTaxonomyClick();
            controlCategoryPage.moveControlCategory(test.cantrolCategoryName); // Executes the move control category function
        });
    });
});
