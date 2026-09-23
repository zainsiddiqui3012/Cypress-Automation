

import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
//import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";
import RiskRegister_PO from "../../support/POM/STARTRCSA_PO/RIsk applicability for RCSA _PO";

/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />


////Data Provider ///
const RCSAApplicableFlyer = require('../../fixtures/RCSAAuditLog/RiskApplicabilityforRCSA.json')


//Data Provider ///
before(function () {
    cy.fixture('RiskModule/RiskCategoryName.json').then(function (data) {
        global.data = data;

        cy.fixture('RiskModule/RiskDefintionName.json').then(function (rd) {
            global.rd = rd;


            cy.fixture('RCSAAuditLog/_write_business_unit.json').then(function (BUU) {
                global.BUU = BUU;



        });

    });

});
});

describe("Mark Applicable, Defer, Not Applicable and Emerging Risk from Risk Register Three Ellipsis Options", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskRegister_PO = new RiskRegister_PO();



    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();

    })

       ////*****Applicable flyer - Marked Defer*/
       RCSAApplicableFlyer.forEach(test => {
        it(test.Defer, () => {

            //Login Details
            cy.log(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height
            riskRegister_PO.threeEllipsisMenu();
            riskRegister_PO.riskTaxonomyclick();
            riskRegister_PO.deferMarked(test.BU, test.SearchRisk);
            riskRegister_PO.saveRiskTaxonomy();

        })
    })



    /////*****Applicable flyer - Marked Applicable */
  RCSAApplicableFlyer.forEach(test => {
        it(test.Applicable, () => {

            //Login Details
            cy.log(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height
            riskRegister_PO.threeEllipsisMenu();
            riskRegister_PO.riskTaxonomyclick();
            riskRegister_PO.applicableMarked(test.BU, test.SearchRisk);
            riskRegister_PO.saveRiskTaxonomy();
            riskRegister_PO.ValidateBusinessUnitModal();
            riskRegister_PO.Validate_Modal_details(test.RiskID, test.CreatedDate, test.Status);
        })
    })

//     ////*****Applicable flyer - Marked Not Applicable*/
  RCSAApplicableFlyer.forEach(test => {
        it(test.NotApplicable, () => {

            //Login Details
            cy.log(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height
            riskRegister_PO.threeEllipsisMenu();
            riskRegister_PO.riskTaxonomyclick();
            riskRegister_PO.notApplicableMarked(test.BU, test.SearchRisk);
            riskRegister_PO.saveRiskTaxonomy();


        })
    })

       /////*****Applicable flyer - Marked Applicable */
  RCSAApplicableFlyer.forEach(test => {
    it(test.Applicable, () => {

        //Login Details
        cy.log(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskRegitserClick();
        cy.get("#myGrid").getAgGridData();
        cy.viewport(2000, 1300) // Set viewport to width and height
        riskRegister_PO.threeEllipsisMenu();
        riskRegister_PO.riskTaxonomyclick();
        riskRegister_PO.applicableMarked(test.BU, test.SearchRisk);
        riskRegister_PO.saveRiskTaxonomy();
        riskRegister_PO.ValidateBusinessUnitModal();
        riskRegister_PO.Validate_Modal_details(test.RiskID, test.CreatedDate, test.Status);

    })
})

//     ////*****Applicable flyer - Marked Emerging */
   RCSAApplicableFlyer.forEach(test => {
        it(test.Emerging, () => {

            //Login Details
            cy.log(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height
            riskRegister_PO.threeEllipsisMenu();
            riskRegister_PO.riskTaxonomyclick();
            riskRegister_PO.emergingMarked(test.BU, test.SearchRisk);
            riskRegister_PO.saveRiskTaxonomy();

        })
    })

       /////*****Applicable flyer - Marked Applicable */
  RCSAApplicableFlyer.forEach(test => {
    it(test.Applicable, () => {

        //Login Details
        cy.log(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskRegitserClick();
        cy.get("#myGrid").getAgGridData();
        cy.viewport(2000, 1300) // Set viewport to width and height
        riskRegister_PO.threeEllipsisMenu();
        riskRegister_PO.riskTaxonomyclick();
        riskRegister_PO.applicableMarked(test.BU, test.SearchRisk);
        riskRegister_PO.saveRiskTaxonomy();
        riskRegister_PO.ValidateBusinessUnitModal();
        riskRegister_PO.Validate_Modal_details(test.RiskID, test.CreatedDate, test.Status);

    })
})


})
