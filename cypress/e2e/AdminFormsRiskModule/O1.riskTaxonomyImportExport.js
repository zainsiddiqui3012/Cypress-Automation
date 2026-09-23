


// import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
// import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
// import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";

// /// <reference types= "cypress" />


// // ///***run scripts 5 time */
// // Cypress._.times(5, () => {

// describe.skip("Risk Taxonomy Import and Export Automation", () => {

//     const loginDetails_PO = new LoginDetails_PO();
//     const predictMenu_PO = new PredictMenu_PO();
//     const riskCategory_PO = new RiskCategory_PO();



//     before(function () {
//         cy.clearLocalStorage();
//         cy.clearCookies();



//     })

    
//     ///**Export Risk Taxonomies */          
//     it("Export Risk Taxonomies Successfully", () => {

//         //Login Details
//         cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
//         loginDetails_PO.visitUrl();
//         loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
//         loginDetails_PO.clickOn_LoginButton();

//         predictMenu_PO.menuClick();
//         predictMenu_PO.riskAndControlRegisterClick();
//         predictMenu_PO.riskAdministrationClick();
//         predictMenu_PO.riskTaxonomyClick();
//         riskCategory_PO.threeEllipsis();
//         riskCategory_PO.export();

//     })

//     ///**Download Sample file Risk Taxonomies */          
//     it("Download Sample file Risk Taxonomies Successfully", () => {

//         //Login Details
//         cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
//         loginDetails_PO.visitUrl();
//         loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
//         loginDetails_PO.clickOn_LoginButton();

//         predictMenu_PO.menuClick();
//         predictMenu_PO.riskAndControlRegisterClick();
//         predictMenu_PO.riskAdministrationClick();
//         predictMenu_PO.riskTaxonomyClick();
//         riskCategory_PO.threeEllipsis();
//         riskCategory_PO.import();
//         riskCategory_PO.downloadSampleFile();

//     })


//     ///**Import Risk Taxonomies */          
//     it("Import Risk Taxonomies Successfully", () => {

//         //Login Details
//         cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
//         loginDetails_PO.visitUrl();
//         loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
//         loginDetails_PO.clickOn_LoginButton();

//         predictMenu_PO.menuClick();
//         predictMenu_PO.riskAndControlRegisterClick();
//         predictMenu_PO.riskAdministrationClick();
//         predictMenu_PO.riskTaxonomyClick();
//         riskCategory_PO.threeEllipsis();
//         riskCategory_PO.import();
//         riskCategory_PO.importOption();

//     })

    

// })









