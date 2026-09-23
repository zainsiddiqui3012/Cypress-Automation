import loginFunction from '../../support/POM/Functions/loginFunction';
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import ControlCategory_PO from "../../support/POM/RiskModule_PO/ControlCategory_PO";
import dayjs from 'dayjs';

/// <reference types= "cypress" />

////Data Provider ///
const controlCategory = require('../../fixtures/RiskModule/Control_Taxonomy/controlCategory.json')
const NegativeImpact_ControlCategory = require('../../fixtures/RiskModule/Control_Taxonomy/NegativeImpact_ControlCategory.json')

describe("Control Category Screen Automation", () => {

    const predictMenu_PO = new PredictMenu_PO();
    const controlCategory_PO = new ControlCategory_PO();


    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();

    })
    ////####Edit Control Category Successfully #######/////////
    controlCategory.forEach(test => {
        it("Edit Control Category Successfully", () => {
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTaxonomyClick();
            controlCategory_PO.editCategory();
            controlCategory_PO.makeChildCategoryViaEdit();

            
        });
    });

})