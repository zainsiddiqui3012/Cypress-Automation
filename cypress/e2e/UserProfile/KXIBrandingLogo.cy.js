import {brandingLogo} from "../../support/POM/UserProfile/KXIBrandingLogo"

describe(("Check that Correct Branding Logo is displaying on Top when Loggedin with Predict/Lumify User"),()=>{
    const Logo= new brandingLogo()
    
    //Login with Lumify360 User and check for the Logo respectively.
    it("Check For Lumify360 User's Branding Logo",()=>{
        const withoutRM= Cypress.env("kxi").customer.withoutRM
        cy.visit(Cypress.config("baseUrl"));
        cy.login(withoutRM.username, withoutRM.password, withoutRM.key)
        Logo.checkForBrandingLogo("lumify360")
    });
    
    //Login with Predict360 User and Check for the Logo respectively.
    it("Check For Predict360 User's Branding Logo", () => {
        const withRM= Cypress.env("kxi").customer.withRM2
        cy.visit(Cypress.config("baseUrl"));
        cy.login(withRM.username, withRM.password, withRM.key);
        Logo.checkForBrandingLogo("predict360")
      });

})