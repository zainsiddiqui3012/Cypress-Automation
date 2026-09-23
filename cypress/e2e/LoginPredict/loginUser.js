import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";

/// <reference types="cypress" />


describe("Login user Form", () => {

     const loginDetails_PO = new LoginDetails_PO();
    
    // before(function( ){
    //     cy.log(Cypress.env("username"));
    //     cy.fixture("LoginUserCredentials").then(function(user) {
    //     globalThis.user = user;
    
    //     });

        before(function( ){
            cy.log(Cypress.env("username"),Cypress.env("password"),Cypress.env("key"));
        
    })

     it("Login user Successfully", () => {
        loginDetails_PO.visitUrl();
      //  loginDetails_PO.loginDetails(user.username, user.password, user.key);
        // loginDetails_PO.loginDetails(username);
        loginDetails_PO.loginDetails(Cypress.env("username"),Cypress.env("password"),Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();
        
        
    });

    
})