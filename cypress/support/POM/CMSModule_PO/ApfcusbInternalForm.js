import data from "../../../fixtures/CMSModule/CompliantInternalForm/Apfcusb.json";
import locators from "../../../fixtures/locators.json";

class CompliantInternalForm {
  // Function to open the incident dropdown by triggering a mouseover event
  incidentDropdownClick() {
    cy.get(locators.cms.ATask.frameId).then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.get("@iframe")
      .find(locators.cms.ATask.incident)
      .trigger("mouseover", { force: true });
  }
  // Function to select the complaint option located in the dropdown and navigate to the complaint form

  complaintSelectClick() {
    cy.get(locators.cms.ATask.frameId).then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.get("@iframe").find(locators.cms.ATask.weblink).click({ force: true });
    cy.visitComplaintForm();
  }

  // Function to check the text content of labels in the complaint form

  checkLabels() {
    cy.switchToIframe(locators.cms.ATask.frameId).then((iframe) => {
      cy.get(iframe)
        .find(locators.cms.compliantform.tab1)
        .contains(data.consumerFirstName);

      cy.get(iframe)
        .find(locators.cms.compliantform.tab1)
        .contains(data.consumerLastName);

      cy.get(iframe)
        .find(locators.cms.compliantform.tab1)
        .contains(data.dateReceived);

      cy.get(iframe)
        .find(locators.cms.compliantform.tab1)
        .contains(data.ermComplianceReceived);

      cy.get(iframe)
        .find(locators.cms.compliantform.tab2)
        .contains(data.nameOfEmployee);

      cy.get(iframe)
        .find(locators.cms.compliantform.tab2)
        .contains(data.costFee);
    });
  }

  // Function to check if the mandatory fields are correctly marked in the complaint form

  checkMandatoryFields() {
    cy.switchToIframe(locators.cms.ATask.frameId).then((iframe) => {
      cy.get(iframe)
        .find(locators.cms.compliantform.requiredname, {
          timeout: 10000,
        })
        .eq(0)
        .contains("Required");

      cy.get(iframe)
        .find(locators.cms.compliantform.requiredlastname, {
          timeout: 10000,
        })
        .eq(0)
        .contains("Required");

      cy.get(iframe)
        .find(locators.cms.compliantform.requireddate, {
          timeout: 20000,
        })

        .should("not.contain", "Required"); // Assert that it doesn't contain 'Required'

      cy.get(iframe)
        .find(locators.cms.compliantform.requiredERM, {
          timeout: 10000,
        })
        .eq(0)
        .contains("Required");

      cy.get(iframe)
        .find(locators.cms.compliantform.requiredemployee, {
          timeout: 10000,
        })
        .eq(0)
        .contains("Required");

      cy.get(iframe)
        .find(locators.cms.compliantform.costfee, {
          timeout: 20000,
        })
        .should("not.contain", "Required"); // Assert that it doesn't contain 'Required'
    });
  }
}

export default CompliantInternalForm;
