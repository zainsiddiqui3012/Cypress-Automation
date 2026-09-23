import data from "../../../fixtures/CMSModule/CompliantWebForm/ApfcusbWebForm.json";
import locators from "../../../fixtures/locators.json";

class ApfcusbComplaintWebForm {
  // Function to check if the text of the labels in the complaint form are correct

  checkLabels() {
    cy.get(
      locators.cms.compliantform.compliantwebform.consumerFirstName
    ).contains(data.consumerFirstName);

    cy.get(
      locators.cms.compliantform.compliantwebform.consumerlastName
    ).contains(data.consumerLastName);

    cy.get(locators.cms.compliantform.compliantwebform.dataReceived).contains(
      data.dateReceived
    );

    cy.get(locators.cms.compliantform.compliantwebform.Costfee).contains(
      data.costFee
    );
  }

  // Function to check if the mandatory fields are marked with the '*' (required) label

  checkMandatoryFields() {
    cy.get(locators.cms.compliantform.compliantwebform.requiredfirstname)
      .eq(0)
      .contains(data.required);

    cy.get(locators.cms.compliantform.compliantwebform.requiredlastname)
      .eq(0)
      .contains(data.required);

    cy.get(locators.cms.compliantform.compliantwebform.requieddatareceived)
      .eq(0)
      .contains(data.required);

    cy.get(locators.cms.compliantform.compliantwebform.requiredcost)
      .eq(0)
      .should("not.contain", data.required);
  }
}

export default ApfcusbComplaintWebForm;
