import data from "../../../../fixtures/CMSModule/ComplaintClosureForm/ClosureForm.json";
import locators from "../../../../fixtures/locators.json";

class ClosureForm {
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

  // Function to fill out the mandatory fields in the form
  filledMandatoryFields() {
    // Wait for 3 seconds to ensure the iframe has fully loaded before proceeding
    cy.wait(3000);

    cy.switchIframe(locators.cms.ATask.frameId).then((iframe) => {
      cy.log("iframe....", iframe);
      cy.get(iframe)
        .find(locators.cms.complaintform.summary, { timeout: 10000 })
        .should("be.visible") // Ensure the summary field is visible
        .type(data.summary);

      cy.get(iframe)
        .find(locators.cms.complaintform.firstName)
        .type(data.firstName);

      cy.get(iframe)
        .find(locators.cms.complaintform.lastName)
        .type(data.lastName);

      cy.get(iframe)
        .find(locators.cms.complaintform.escalatedComplaintType)
        .click();

      cy.get(iframe)
        .find(locators.cms.complaintform.selectOption)
        .type("Pending{enter}");

      cy.get(iframe).find(locators.cms.complaintform.selectChannel).click();

      cy.get(iframe)
        .find(locators.cms.complaintform.channelType)
        .type("Email{enter}");
    });
  }

  // Function to select a date using the date picker
  selectDateByDatePicker() {
    const targetDay = data.calenderDate;

    // Wait for 2 seconds to ensure the iframe has fully loaded before proceeding
    cy.wait(2000);

    // Switch to the iframe to interact with the elements inside
    cy.switchIframe(locators.cms.ATask.frameId).then((iframe) => {
      cy.log("iframe....", iframe);
      cy.get(iframe)
        .find(locators.cms.complaintform.datePicker) // This triggers the date picker
        .click();

      // Wait for the calendar to open and make sure it is visible
      cy.get(iframe)
        .find(locators.cms.complaintform.calender)
        .should("be.visible"); // Ensure the calendar is visible

      // Find and click the target day in the calendar
      cy.get(iframe)
        .find(`td:contains("${targetDay}")`)
        .should("be.visible")
        .click({ force: true });

      // Optionally, verify that the date is populated in the input field
      cy.get(iframe)
        .find(locators.cms.complaintform.inputDate)
        .should("have.value", `18/Mar/2025`);
    });
  }

  // Submit the form after filling mandatory fields
  submitForm() {
    cy.get(locators.cms.ATask.frameId).then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });

    cy.get("@iframe").find(locators.cms.complaintform.submitForm).click();
    //wait for submit the form
    cy.wait(3000);
  }

  // Automates the process of closing a ticket in the CMS module

  closeTicket() {
    // wait is appear to ensure ifram loaded
    cy.wait(3000)
    cy.switchIframe(locators.cms.ATask.frameId, { timeout: 10000 })
      .find(locators.cms.complaintform.closeTicket, {
        timeout: 10000,
      })
      .should("exist")
      .then(($el) => {
        if ($el.length) {
          cy.wrap($el).click();
        } else {
          closeTicket();
        }
      });
    // wait is appear to ensure ifram loaded
    cy.wait(500);
    // Use proper selector for the iframe
    cy.get("iframe")
      .should("be.visible")
      .then(($iframe) => {
        const iframeBody = $iframe.contents().find("body");
        cy.wrap(iframeBody)
          .find(locators.cms.complaintform.closePopup, {
            timeout: 10000,
          })
          .click();
      });
  }
}

export default ClosureForm;
