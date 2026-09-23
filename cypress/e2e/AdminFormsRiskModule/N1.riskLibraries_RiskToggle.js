
import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskLibraries_RiskToggle_PO from "../../support/POM/RiskModule_PO/riskLibraries_RiskToggle_PO";

/// <reference types= "cypress" />
////Data Provider ///
const ContentLibrariesDropdown = require('../../fixtures/RiskModule/Risk Libraries/ContentLibrariesDropdown.json')
const ContentLibraryStateMaintained = require('../../fixtures/RiskModule/Risk Libraries/ContentLibraryStateMaintained.json')
const RiskLibrariesGridSearchable = require('../../fixtures/RiskModule/Risk Libraries/RiskLibrariesGridSearchable.json')

before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();

})


describe("Risk Toggle of Risk Taxonomy screen", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskLibraries_RiskToggle_PO = new RiskLibraries_RiskToggle_PO();

    it("Verify By default, Risk will be selected on toggle on Risk Taxonomies screen.", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        predictMenu_PO.riskLibrariesTab();
        riskLibraries_RiskToggle_PO.riskToggleOption();

    })

    it("Verify if any customer doesn’t have any content library assigned then  on customer space when click on Risk libraries it will show message that Contact your account.", () => {

        //Login Details
        cy.log(Cypress.env("username6"), Cypress.env("password6"), Cypress.env("key6"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username6"), Cypress.env("password6"), Cypress.env("key6"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        predictMenu_PO.riskLibrariesTab();
        riskLibraries_RiskToggle_PO.noRiskLibraries();


    })


    ContentLibrariesDropdown.forEach(test => {
        it(test.name, () => {
            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            predictMenu_PO.riskLibrariesTab();
            riskLibraries_RiskToggle_PO.contentlibDropdown(test.ContentLibrary1, test.ContentLibrary2, test.ContentLibrary3);

        })

    })

    ContentLibraryStateMaintained.forEach(test => {
        it(test.case1, () => {
            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            predictMenu_PO.riskLibrariesTab();
            riskLibraries_RiskToggle_PO.contentLibrayStateMaintained(test.ContentLibrary);
            predictMenu_PO.clickOnMyTaxonomiesTab();
            predictMenu_PO.riskLibrariesTab();
            riskLibraries_RiskToggle_PO.contentStateMaintained(test.ContentLibrary);


        })


        it("By default, the grid would have the following columns name,Description,Business Area Definition, controls, mapped to my taxonomy, status. ", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            predictMenu_PO.riskLibrariesTab();
            riskLibraries_RiskToggle_PO.RiskLibrariesTabGridVerify();

        })
    })


    RiskLibrariesGridSearchable.forEach(test => {
        it(test.name, () => {
            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            predictMenu_PO.riskLibrariesTab();
            riskLibraries_RiskToggle_PO.RiskLibrariesGridSearchable(test.Name, test.Description, test.RiskDefinitionId, test.BusinessAreaDefinition, test.Controls, test.MappedtomyTaxonomy, test.Status);


        })

    })

    it("Verify that grid will have columns and filter options on the left side of the grid.", () => {
        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        predictMenu_PO.riskLibrariesTab();
        riskLibraries_RiskToggle_PO.columnsClickRiskLibrariesTab();
        riskLibraries_RiskToggle_PO.filtersClickRiskLibrariesTab();


    })


    ContentLibraryStateMaintained.forEach(test => {
        it(test.case2, () => {
            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            predictMenu_PO.riskLibrariesTab();
            riskLibraries_RiskToggle_PO.contentLibrayStateMaintained(test.ContentLibrary);
            riskLibraries_RiskToggle_PO.contentStateMaintained(test.ContentLibrary);

        })
    })

    ContentLibraryStateMaintained.forEach(test => {
        it(test.case3, () => {
            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            predictMenu_PO.riskLibrariesTab();
            riskLibraries_RiskToggle_PO.contentLibrayStateMaintained(test.ContentLibrary);
            cy.reload().wait(15000);
            riskLibraries_RiskToggle_PO.contentStateMaintained(test.ContentLibrary);

        })
    })

    it("Verify by default first taxonomy in the alphabetical order in drop down  should be selected however user can select different. Only single select will be allowed.", () => {
        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        predictMenu_PO.riskLibrariesTab();
        riskLibraries_RiskToggle_PO.alphabeticalOrdercontentLibray();

    })

})





