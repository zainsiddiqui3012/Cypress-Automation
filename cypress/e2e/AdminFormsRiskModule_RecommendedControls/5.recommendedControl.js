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
const riskCategory = require('../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json')
const controlCategory = require('../../fixtures/RiskModule/Control_Taxonomy/controlCategory.json')
const controlDefinition = require('../../fixtures/RiskModule/Control_Taxonomy/controlDefinition.json')

const predictMenu_PO = new PredictMenu_PO();
const myTaxonomyTab_PO = new MyTaxonomyTab_PO();
const recommendedControl_PO = new RecommendedControl_PO();
const controlCategory_PO = new ControlCategory_PO();
const riskCategory_PO = new RiskCategory_PO();
const riskDefinition_PO = new RiskDefinition_PO();
const controlDefinition_PO = new ControlDefinition_PO();


describe("Recommended Controls Automation for My Taxonomies Tab", () => {

    it("Risk Category: Validate that when user click on the 3 ellipses against a risk category then the following 2 options must be available, 1. Add recommended control 2. Link recommended control", () => {

        //Login Details
        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
        recommendedControl_PO.recommendedControlthreeEllipse();
        recommendedControl_PO.verifyrecommendedControlCategoryButtonValidation();
    });

    it("Case1: Verify that when a user clicks three ellipses, and selects add recommended control, it opens a flyout, Case2: Confirm that an appropriate validation message is displayed for each missing mandatory field", () => {

        //Login Details
        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch)
        recommendedControl_PO.recommendedControlthreeEllipse();
        recommendedControl_PO.addRecommendedControlbtn()
        recommendedControl_PO.flyerValidate();
        recommendedControl_PO.savebtnRecommendedControl();
        recommendedControl_PO.validationCheckrecommendedControl()

    });

    it("Validate that the control category must contain the same hierarchy as defined in control definition page.", () => {
        //Login Details
        loginFunction();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
        recommendedControl_PO.recommendedControlthreeEllipse();
        recommendedControl_PO.addRecommendedControlbtn();
        recommendedControl_PO.controlCategoryTreeRecordsMatchControlDefinitionTreeRecords();
        recommendedControl_PO.expendedRecommendedControlCategory();

    });

});

describe("Add Recommended Control and Verify Recommended Control", () => {

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

        });
    });


    addRecommendedControl.forEach(test => {
        it("Validate that the added control must appear in 'Control Definition' page also.", () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
            recommendedControl_PO.expendedRecommendedControlCategory();
            recommendedControl_PO.expendedControlCol();
            recommendedControl_PO.controlGridFilterCol();
            recommendedControl_PO.verifyrecommendedControlCategory(test.controlTypes, test.controlFrequency);;
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick2();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTaxonomyClick();
            recommendedControl_PO.controlMapping(cmap.ControlCategoryTreeMapping);


        });


    });

    addRecommendedControl.forEach(test => {
        it("Verify Recommended Control Details", () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
            //  recommendedControl_PO.expendedRecommendedControlCategory();
            recommendedControl_PO.expendedControlCol();
            recommendedControl_PO.controlGridFilterCol();
            recommendedControl_PO.verifyrecommendedControlCategory(test.controlTypes, test.controlFrequency);

        });
    });

    it("Validate that risk category does not contain the 'Recommended Control' tab in edit mode.", () => {

        //Login Details
        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch)
        riskCategory_PO.editCategoryButton();
        recommendedControl_PO.validateRecommendedControlTab()
    });

});


describe("Linked Recommended Control On Category", () => {

    it("Validate that if user click on link control then 'Link Control Definition' flyout must be opened.", () => {

        //Login Details
        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
        recommendedControl_PO.recommendedControlthreeEllipse();
        recommendedControl_PO.recommendedControlLinkBtn();
        recommendedControl_PO.linkFlyerValidation();

    });

    it("Validate that user must be able to link a control at risk category.", () => {

        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
        recommendedControl_PO.recommendedControlthreeEllipse();
        recommendedControl_PO.recommendedControlLinkBtn();
        recommendedControl_PO.linkRecommendedControl(ccm.ControlCategoryTreeMapping);
        recommendedControl_PO.savebtnLink_FlyerRecommendedControl();

    });
    addRecommendedControl.forEach(test => {
        it("Validate that the added control must appear in Control column.", () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
            // recommendedControl_PO.expendedRecommendedControlCategory();
            recommendedControl_PO.expendedControlCol();
            recommendedControl_PO.controlGridFilterCol();
            recommendedControl_PO.verifyrecommendedControlCategory(test.controlTypes, test.controlFrequency);

        });
    });


});



describe("Add Recommended Control on Risk Definition", () => {
    it("Validate that when user click on the 3 ellipses against a risk definition then the following 2 options must be available: 1. Add recommended control, 2. Link recommended control", () => {

        //Login Details
        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
        recommendedControl_PO.recommendedControlthreeEllipseDefinition();
        recommendedControl_PO.verifyrecommendedControlDefinitionButtonValidation();
    });


    it("Case: 1, Validate that when user click on Add recommended control against any risk definition then 'Add Control Definition' must open. Case : 2 , Validate that when user click on save button without providing any mandatory fields on 'Add Control Definition' flyout then all the mandatory fields must be highlighted  and a validation message must appear on screen.", () => {

        //Login Details
        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
        recommendedControl_PO.recommendedControlthreeEllipseDefinition();
        recommendedControl_PO.addRecommendedControlbtn();
        recommendedControl_PO.flyerValidate();
        recommendedControl_PO.savebtnRecommendedControl();
        recommendedControl_PO.validationCheckrecommendedControl()
    });


    addRecommendedControl.forEach(test => {
        it("Validate that user must be able to add the recommended control at risk definition.", () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
            recommendedControl_PO.recommendedControlthreeEllipseDefinition();
            recommendedControl_PO.addRecommendedControlbtn()
            recommendedControl_PO.addRecommendedControl(test.controlDefinitionID, test.definitionName, test.description, test.controlFrequency, test.controlTypes, test.controlExecution, control.ControlCategoryTreeMapping);
            recommendedControl_PO.savebtnRecommendedControl();


        });
    });

    addRecommendedControl.forEach(test => {
        it("Validate that the added control must appear in 'Control' column at Risk Taxonomy page.", () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
            // recommendedControl_PO.expendedRecommendedControlCategory();
            recommendedControl_PO.expendedControlCol();
            recommendedControl_PO.controlGridFilterCol();
            recommendedControl_PO.verifyrecommendedControlCategory(test.controlTypes, test.controlFrequency);

        });
    });

    it("Validate that when user expand the control column then the same data must appear in following columns:1.Control Name,2. Control Type,3. Control Category,4. Primary Control,5. Control Frequency,6. Prevent Fraud", () => {

        //Login Details
        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
        // recommendedControl_PO.expendedRecommendedControlCategory();
        recommendedControl_PO.expendedControlCol();
        recommendedControl_PO.verifyrecommendedControlControlGridCol();

    });
    addRecommendedControl.forEach(test => {
        it("Validate that the added control must appear in 'Control Definition' page also.", () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
            // recommendedControl_PO.expendedRecommendedControlCategory();
            recommendedControl_PO.expendedControlCol();
            recommendedControl_PO.controlGridFilterCol();
            recommendedControl_PO.verifyrecommendedControlCategory(test.controlTypes, test.controlFrequency);;
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick2();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTaxonomyClick();
            recommendedControl_PO.controlMapping(cmap.ControlCategoryTreeMapping);


        });


    });


    it("Validate that the added control must appear in 'Recommended Control tab' in edit mode of risk definition", () => {

        //Login Details
        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        riskCategory_PO.clickOnMyTaxonomiesTab();
        riskDefinition_PO.riskDefinitionEditbtn();
        recommendedControl_PO.clickRecommendedControlTab();

    });

    it("Validate that the library name must be empty if recommended control is created at customer space.", () => {

        //Login Details
        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        riskCategory_PO.clickOnMyTaxonomiesTab();
        riskDefinition_PO.riskDefinitionEditbtn();
        riskDefinition_PO.riskDefinitionEditScreen();

    });

    it("Case 1: Validate that if user delete a control then it will be deleted from that particular risk definition. Case 2 : Validate that after the deletion of control success message must appear on screen.", () => {

        //Login Details
        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        riskCategory_PO.clickOnMyTaxonomiesTab();
        recommendedControl_PO.expendedControlCol();
        riskDefinition_PO.deleteControlDefinitinAggrid();

    });

});


describe("Link Recommended Control on Risk Definition", () => {

    it("Validate that if user click on link control then 'Link Control Definition' flyout must be opened.", () => {

        //Login Details
        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
        recommendedControl_PO.recommendedControlthreeEllipseDefinition();
        recommendedControl_PO.recommendedControlLinkBtn();
        recommendedControl_PO.linkFlyerValidation();

    });

    it("Validate that user must be able to link a control at risk definition.", () => {

        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
        recommendedControl_PO.recommendedControlthreeEllipseDefinition();
        recommendedControl_PO.recommendedControlLinkBtn();
        recommendedControl_PO.linkRecommendedControl(ccm.ControlCategoryTreeMapping);
        recommendedControl_PO.savebtnLink_FlyerRecommendedControl();

    });
    addRecommendedControl.forEach(test => {
        it("Validate that the added control must appear in Control column.", () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
            // recommendedControl_PO.expendedRecommendedControlCategory();
            recommendedControl_PO.expendedControlCol();
            recommendedControl_PO.verifyrecommendedControlCategory(test.controlTypes, test.controlFrequency);

        });
    });



//     it.skip("Case 1 : Validate that if multiple risk definition have that control and we unlink from one risk definition then it will be unlink from that particular definition only. Case 2 : Validate that after the unlink of control success message must appear on screen", () => {

//         //Login Details
//         loginFunction();
//         predictMenu_PO.menuClick();
//         predictMenu_PO.riskAndControlRegisterClick();
//         predictMenu_PO.riskAdministrationClick();
//         predictMenu_PO.riskTaxonomyClick();
//         myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
//         recommendedControl_PO.recommendedControlthreeEllipseDefinition();
//         recommendedControl_PO.recommendedControlLinkBtn();
//         recommendedControl_PO.unLinkRecommendedControl(ccm.ControlCategoryTreeMapping);
//         recommendedControl_PO.expendedControlCol();
//         recommendedControl_PO.verifyUnLinkRecommendedControl();


//     });

});

//////Complex Test Cases 

describe("Setup Control Category and Control Definition for Recommended Controls - Complex Test Cases ", () => {

    controlCategory.forEach(test => {
        it(test.name, () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTaxonomyClick();
            controlCategory_PO.addControlButton();
            controlCategory_PO.addControlCategoryInfo(test.ControlCategoryID, test.controlName);
            controlCategory_PO.savebutton();

        });
    });

    controlDefinition.forEach(test => {
        it(test.name, () => {

            //Login Details
            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.controlTaxonomyClick();
            controlDefinition_PO.addDefinitionButton();
            controlDefinition_PO.addDefinitionInfo(test.controlDefinitionID, test.definitionName, test.description, test.controlFrequency, test.controlTypes, test.controlExecution, data.ControlCategoryTreeMapping);
            controlDefinition_PO.savebutton();
        });
    });
});



describe("Setup Risk Category for Recommended Control Automation - Complex Test Cases ", () => {

    riskCategory.forEach(test => {
        it(test.name, () => {

            loginFunction();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            riskCategory_PO.clickOnMyTaxonomiesTab();
            riskCategory_PO.addCategoryButton();
            riskCategory_PO.addCategoryInfo(test.riskCategoryID, test.riskName, test.description);
            riskCategory_PO.savebutton();

        });
    });


});

describe("Setup Add three Risk Defintion for Recommended Control Automation - Complex Test Cases  ", () => {

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


describe("Validate that if risk category contain 3 definitions then the added control at risk category must be available at all 3 risk definitions. - Complex Test Cases ", () => {

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


describe("Linked Recommended Control On Category - Complex Test Cases", () => {

    it("Validate that if risk category contain 3 definitions then the link control at risk category must be available at all 3 risk definitions", () => {

        loginFunction();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        myTaxonomyTab_PO.searchDefintiontaxonomyGrid(data.RiskDefinitionSearch);
        recommendedControl_PO.recommendedControlthreeEllipse();
        recommendedControl_PO.recommendedControlLinkBtn();
        recommendedControl_PO.linkRecommendedControl(ccm.ControlCategoryTreeMapping);
        recommendedControl_PO.savebtnLink_FlyerRecommendedControl();
        recommendedControl_PO.linkVerifyControls()

    });

});
