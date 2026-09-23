import loginFunction from '../../support/POM/Functions/loginFunction';
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import MyTaxonomyTab_PO from "../../support/POM/RiskModule_PO/myTaxonomyTab_PO";
import RecommendedControl_PO from "../../support/POM/RiskModule_PO/recommendedControl_PO";
import ControlCategory_PO from "../../support/POM/RiskModule_PO/ControlCategory_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../support/POM/RiskModule_PO/RiskDefinition_PO";
import ControlDefinition_PO from "../../support/POM/RiskModule_PO/ControlDefinition_PO";

/// <reference types= "cypress" />

//Data Provider ///
before(function () {
    cy.fixture('RiskModule/RiskDefintionName.json').then(function (data) {
        global.data = data;
    });
    cy.fixture('RiskModule/RiskCategoryName.json').then(function (rc) {
        global.rc = rc;
    });
    cy.fixture('RiskModule/Control_Taxonomy/ControlCategoryMapping.json').then(function (control) {
        global.control = control;
    });
    cy.fixture('RiskModule/Control_Taxonomy/ControlCategoryMapping.json').then(function (ccm) {
        global.ccm = ccm;
    });
    cy.fixture('RiskModule/Control_Taxonomy/ControlCategoryMapping.json').then(function (cmap) {
        global.cmap = cmap;
    });

});

////Data Provider ///
const addRecommendedControl = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/addRecommendedControl.json')
const riskDefinition = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/riskDefinition.json')
//const riskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json')
//const controlCategory = require('../../fixtures/RiskModule/Control_Taxonomy/controlCategory.json')
//const controlDefinition = require('../../fixtures/RiskModule/Control_Taxonomy/controlDefinition.json')

const predictMenu_PO = new PredictMenu_PO();
const myTaxonomyTab_PO = new MyTaxonomyTab_PO();
const recommendedControl_PO = new RecommendedControl_PO();
//const controlCategory_PO = new ControlCategory_PO();
const riskCategory_PO = new RiskCategory_PO();
const riskDefinition_PO = new RiskDefinition_PO();
//const controlDefinition_PO = new ControlDefinition_PO();


describe("Setup Add three Risk Defintion for Recommended Control Automation - Complex Test Cases  ", {tags:["@risk-recommended-control","@risk","@regression","@admin-forms-risk-module"]},() => {

    Cypress._.times(3, () => {
        ///**Add Risk Definition into Category */       
        riskDefinition.forEach(test => {
            it("Three Risk Defintion for Recommended Control Automation- Complex Test Cases", () => {


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
                cy.wait(7000);

            });
        });
    });
});


describe("Validate that if risk category contain 3 definitions then the added control at risk category must be available at all 3 risk definitions. - Complex Test Cases ", {tags:["@risk-recommended-control","@risk","@regression","@admin-forms-risk-module"]},() => {

    addRecommendedControl.forEach(test => {
        it(test.name, () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch)
            recommendedControl_PO.recommendedControlthreeEllipse();
            recommendedControl_PO.addRecommendedControlbtn()
            recommendedControl_PO.addRecommendedControl(test.controlDefinitionID, test.definitionName, test.description, test.controlFrequency, test.controlTypes, test.controlExecution, control.ControlCategoryTreeMapping);
            recommendedControl_PO.savebtnRecommendedControl();
            recommendedControl_PO.verifyControls();


        });
    });
});


describe.skip("Linked Recommended Control On Category - Complex Test Cases", {tags:["@risk-recommended-control","@risk","@regression","@admin-forms-risk-module"]},() => {

    it("Validate that if risk category contain 3 definitions then the link control at risk category must be available at all 3 risk definitions", () => {

        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.restoreDefaultLayout();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
        recommendedControl_PO.recommendedControlthreeEllipse();
        recommendedControl_PO.recommendedControlLinkBtn();
        recommendedControl_PO.linkRecommendedControl(ccm.ControlCategoryTreeMapping);
        recommendedControl_PO.savebtnLink_FlyerRecommendedControl();
       recommendedControl_PO.linkVerifyControls()

    });

});
