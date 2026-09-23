


import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import ControlCategory_PO from "../../support/POM/RiskModule_PO/ControlCategory_PO";

/// <reference types= "cypress" />


// ///***run scripts 5 time */
// Cypress._.times(5, () => {

describe("Control Taxonomy Import and Export Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const controlCategory_PO = new ControlCategory_PO();




    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();



    })


    ///**Export Control Taxonomies */          
    it("Export Control Taxonomies Successfully", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.controlTaxonomyClick();
        controlCategory_PO.threeEllipsis();
        controlCategory_PO.export();

    })



    ///**Import Control Taxonomies */          
    it("Import Control Taxonomies Successfully", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.controlTaxonomyClick();
        controlCategory_PO.threeEllipsis();
        controlCategory_PO.import();
        controlCategory_PO.importOption();

    })

    ///**Download Sample file control Taxonomies */          
    it("Download Sample file Control Taxonomies Successfully", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.controlTaxonomyClick();
        controlCategory_PO.threeEllipsis();
        controlCategory_PO.import();
        controlCategory_PO.downloadSampleFile();

    })

})









