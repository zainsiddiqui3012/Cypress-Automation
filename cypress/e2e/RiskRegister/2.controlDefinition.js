
import loginFunction from '../../support/POM/Functions/loginFunction';
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import ControlDefinition_PO from "../../support/POM/RiskModule_PO/ControlDefinition_PO";

// <reference types= "cypress" />

////Data Provider ///
const controlDefinition = require('../../fixtures/RiskModule/Control_Taxonomy/controlDefinition.json')
const NegativeImpact_ControlDefinition = require('../../fixtures/RiskModule/Control_Taxonomy/NegativeImpact_ControlDefinition.json')


NegativeImpact_ControlDefinition.json

//Data Provider ///
before(function () {
    cy.fixture('RiskModule/Control_Taxonomy/ControlCategoryMapping.json').then(function (data) {
        global.data = data;

    });

    cy.fixture('RiskModule/Control_Taxonomy/_Write_NegativeImpactMapping').then(function (wr) {
        global.wr = wr;

    });

});

// ///***run scripts 5 time */
// Cypress._.times(5, () => {
describe("Control Defintion Screen Automation", () => {

    const predictMenu_PO = new PredictMenu_PO();
    const controlDefinition_PO = new ControlDefinition_PO();

    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();


    });


    /*****Add control Definition ****/
    controlDefinition.forEach(test => {
        it("Add Control Defintion Successfully and Add Control Defintion for Negative Impact Successfully", () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTaxonomyClick();
            controlDefinition_PO.addDefinitionButton();
            controlDefinition_PO.addDefinitionInfo(test.controlDefinitionID, test.definitionName, test.description, test.controlFrequency, test.controlTypes, test.controlExecution, data.ControlCategoryTreeMapping);
            controlDefinition_PO.savebutton();
            cy.wait(10000);

        });

    });

    /****Add Control Defintion for Negative Impact Successfully****/
    NegativeImpact_ControlDefinition.forEach(test => {
        it(test.name, () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTaxonomyClick();
            controlDefinition_PO.addDefinitionButton();
            controlDefinition_PO.addDefinition_NegativeImpact(test.controlDefinitionID, test.definitionName, test.description, test.controlFrequency, test.controlTypes, test.controlExecution, wr.ControlCategory_NegativeImpact);
            controlDefinition_PO.savebutton();
        });

    });


});



