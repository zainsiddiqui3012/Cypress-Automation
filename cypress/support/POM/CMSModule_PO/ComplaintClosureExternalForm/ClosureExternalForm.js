import data from "../../../../fixtures/CMSModule/ComplaintClosureExternalForm/ClosureExternalForm.json";
import locators from "../../../../fixtures/locators.json";

class ClosureExternalForm {
  // Function to fill in the mandatory fields with values from the provided data

  filledFields() {
    cy.get(
      locators.cms.complaintform.complaintwebform.simsWebForm.firstName
    ).type(data.firstName);

    cy.get(
      locators.cms.complaintform.complaintwebform.simsWebForm.lastName
    ).type(data.lastName);

    cy.get(
      locators.cms.complaintform.complaintwebform.simsWebForm.summary
    ).type(data.summary);

    cy.get(
      locators.cms.complaintform.complaintwebform.simsWebForm.enteredByName
    ).type(data.summary);

    cy.get(locators.cms.complaintform.complaintwebform.simsWebForm.facility, {
      timeout: 10000,
    })
      .should("be.visible")
      .select(data.facilityText);
  }

  // Function to select a date from the date picker

  selectDateByDatePicker() {
    const targetDay = data.calenderDate;
    // Find and click the button that opens the date picker
    cy.get(
      locators.cms.complaintform.complaintwebform.simsWebForm.dateSelector,
      { timeout: 2000 }
    ).click();

    // Ensure the datepicker is visible
    cy.get(
      locators.cms.complaintform.complaintwebform.simsWebForm.dataPicker
    ).should("be.visible");

    // Find and click the target day in the calendar
    cy.get(`td:contains("${targetDay}")`)
      .first()
      .should("be.visible")
      .click({ force: true });

    // Optionally, verify that the date is populated in the input field
    cy.get(
      locators.cms.complaintform.complaintwebform.simsWebForm.inputDateField,
      { timeout: 10000 }
    ).should("be.visible");
  }

  // Function to submit the web form after filling out all fields
  submitform() {
    cy.get(
      locators.cms.complaintform.complaintwebform.simsWebForm.submitButton
    ).click();
  }

  // Function to open the incident dropdown by triggering a mouseover event
  advanceSearchClick() {
    cy.get(locators.cms.ATask.frameId).then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    // Custom wait to ensure iframe is loaded

    cy.get("@iframe")
      .find(locators.cms.complaintform.advanceSearchBtn, { timeout: 3000 })
      .click();
  }

  // Function to search for a ticket by entering a test name
  searchTicket() {
    // Wait for 3 seconds to ensure the iframe has fully loaded before proceeding
    cy.wait(3000);
    cy.switchToIframe(locators.cms.ATask.frameId).then((iframe) => {
      cy.get("iframe")
        .should("be.visible")
        .then(($iframe) => {
          const iframeBody = $iframe.contents().find("body");
          cy.wrap(iframeBody)
            .find(locators.cms.complaintform.inputTextarea, { timeout: 10000 })
            .should("be.visible")
            .type(data.searchType);

          // click on the search button that loacted on the Advance search screen
          cy.get("iframe")
            .should("be.visible")
            .then(($iframe) => {
              const iframeBody = $iframe.contents().find("body");
              cy.wrap(iframeBody)
                .find(locators.cms.complaintform.searchBtn, { timeout: 10000 })
                .should("be.visible")
                .first()
                .click();
            });
        });
    });
  }

  //Function to check if the form is closed when mandatory fields are not filled

  closeTicket() {
    // Wait for 3 seconds to ensure the iframe has fully loaded before proceeding
    cy.wait(3000);
    cy.switchIframe(locators.cms.ATask.frameId, { timeout: 3000 })
      .find(locators.cms.complaintform.closeTicket, {
        timeout: 3000,
      })
      // .should("exist")
      .then(($el) => {
        if ($el.length) {
          // Click the element if it exists
          cy.wrap($el).click();
        } else {
          // Wait for 3 seconds to ensure the iframe has fully loaded before proceeding
          cy.wait(3000);
          closeTicket();
        }
      });
  }

  // Function to handle the mandatory fields error popup

  mandatoryFieldsPopup() {
    // Wait for 3 seconds to ensure the iframe has fully loaded before proceeding
    cy.wait(3000);
    cy.get(locators.cms.ATask.frameId, { timeout: 3000 })
      .should("exist")
      .then((iframe) => {
        console.log(iframe);
        cy.wrap(iframe.contents().find("body"))
          .find(locators.cms.complaintform.erroePopup, {
            timeout: 9000,
          })
          .should("be.visible")
          .click();
      });
  }

  // Function to edit the form and fill out all mandatory fields
  editForm() {
    // Switch to iframe to edit the form
    cy.switchIframe(locators.cms.ATask.frameId, { timeout: 20000 })
      .find(locators.cms.complaintform.editBtn, {
        timeout: 50000,
      })
      .should("exist")
      .then(($el) => {
        if ($el.length) {
          cy.wrap($el).click();
        } else {
          // Wait for 3 seconds to ensure the iframe has fully loaded before proceeding
          cy.wait(3000);
          editForm();
        }
      });

    // Click the second tab to proceed with form editing

    // Wait for 3 seconds to ensure the iframe has fully loaded before proceeding
    cy.wait(3000);
    cy.switchIframe(locators.cms.ATask.frameId, { timeout: 20000 })
      .wait(2000) // Optional, to wait for a bit after iframe load
      .find(locators.cms.complaintform.secondTab, { timeout: 50000 })
      .should("exist")
      .should("be.visible")
      .click();

    // Dropdown selections for fields in the form

    cy.wait(2000); // Wait for the iframe or content to load

    // Switch to iframe and wait for its content to load
    cy.switchIframe(locators.cms.ATask.frameId).then((iframe) => {
      cy.log("iframe....", iframe);
      cy.get(iframe).find(locators.cms.complaintform.businessUnit).click();

      cy.iframeDropDownSearchAndSelect(
        locators.cms.ATask.frameId,
        locators.cms.complaintform.businessUnit,
        data.businessUnitDropdown
      );
    });

    cy.switchIframe(locators.cms.ATask.frameId).then((iframe) => {
      cy.get(iframe).find(locators.cms.complaintform.receivingBranch).click();

      cy.iframeDropDownSearchAndSelect(
        locators.cms.ATask.frameId,
        locators.cms.complaintform.receivingBranch,
        data.receivingBranchDropdown
      );
    });

    cy.switchIframe(locators.cms.ATask.frameId).then((iframe) => {
      cy.get(iframe).find(locators.cms.complaintform.complaintBusiness).click();

      cy.iframeDropDownSearchAndSelect(
        locators.cms.ATask.frameId,
        locators.cms.complaintform.complaintBusiness,
        data.complaintBusinessDropdown
      );
    });

    cy.switchIframe(locators.cms.ATask.frameId).then((iframe) => {
      cy.get(iframe).find(locators.cms.complaintform.updateBtn).click();
    });
  }

  // Function to handle closing of the popup (after filling out mandatory fields)
  closedPopup() {
    // Handle the popup by ensuring the iframe is visible and loaded
    cy.wait(3000);
    cy.get("iframe", { timeout: 3000 })
      .should("be.visible")
      .then(($iframe) => {
        // Access the body of the iframe
        const iframeBody = $iframe.contents().find("body");

        // Wait for the iframe body to be available and ensure the popup close element is found
        cy.wrap(iframeBody)
          .find(locators.cms.complaintform.closePopup, { timeout: 3000 }) // Adjust timeout as needed
          .should("exist") // Make sure the close button exists
          .click({ force: true });
      });
  }
}

export default ClosureExternalForm;
