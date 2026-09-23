import locators from "../../../fixtures/locators.json";

import dataFile from "../../../fixtures/fboComplaintWebform/fboComplaintWebform.json";

const externalwebloc = locators.cms.template.externalWebform;

class Fbcomplaintwebform{

   createComplaintFormWithAllFields()
   {
     cy.get(externalwebloc.customerFirstName).type(dataFile.customerFirstName);
     cy.get(externalwebloc.customerLastName).type(dataFile.customerLastName);
     cy.get(externalwebloc.clientLevel).select(dataFile.clientLevel);
     cy.get(externalwebloc.summary).type(dataFile.summary);
     cy.get(externalwebloc.acctNo).type(dataFile.acctNo);
     cy.get(externalwebloc.resolutionSummary).type(dataFile.resolutionSummary);
     cy.get(externalwebloc.bankReceived).type(dataFile.bankReceived);
     cy.get(externalwebloc.enteredByName).click({force: true}).type(dataFile.enteredByName);
     cy.get(externalwebloc.notificationAlerts).type(dataFile.notificationAlerts);
     cy.get(externalwebloc.enteredByBusinessUnit).select(dataFile.enteredByBusinessUnit);
     cy.get(externalwebloc.enteredByBranch).select(dataFile.enteredByBranch);
     cy.get(externalwebloc.source).select(dataFile.source);
     cy.get(externalwebloc.saveComplaintForm).click();
   }

   createComplaintFormWithMandatoryFields()
   {
    cy.get(externalwebloc.customerFirstName).type(dataFile.customerFirstName);
    cy.get(externalwebloc.customerLastName).type(dataFile.customerLastName);
    cy.get(externalwebloc.clientLevel).select(dataFile.clientLevel);
    cy.get(externalwebloc.source).select(dataFile.source);
    cy.get(externalwebloc.summary).type(dataFile.summary);
    cy.get(externalwebloc.bankReceived).type(dataFile.bankReceived);
    cy.get(externalwebloc.enteredByName).click({force: true}).type(dataFile.enteredByName);
    cy.get(externalwebloc.enteredByBranch).select(dataFile.enteredByBranch);
    cy.get(externalwebloc.saveComplaintForm).click();
   }
   
   assertFboComplaintToosterMessage()
   {
      cy.contains('Your complaint has been successfully submitted.').should('be.visible');
   }
}
export default Fbcomplaintwebform;