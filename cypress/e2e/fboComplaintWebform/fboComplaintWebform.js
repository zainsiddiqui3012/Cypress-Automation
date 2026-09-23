import Fbcomplaintwebform from '../../support/POM/fboComplaintWebform/FbocomplaintWebform';


describe("Navigate to the stage environment, External webform URL, open the External form, enter text fields, select value from dropdowns", () => {

const fbcomplaintwebform = new Fbcomplaintwebform();

    /////*****Create External Form - with mandatory field */
        it("Create external form with mandatory fields", () => {

            cy.visit(Cypress.config("FBOCOMPLAINTFORMURL"));
            fbcomplaintwebform.createComplaintFormWithMandatoryFields();
            fbcomplaintwebform.assertFboComplaintToosterMessage();
        })

        it("Create external form with all fields", () => {

            cy.visit(Cypress.config("FBOCOMPLAINTFORMURL"));
            fbcomplaintwebform.createComplaintFormWithAllFields();
            fbcomplaintwebform.assertFboComplaintToosterMessage();
        })
    })
