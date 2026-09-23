import locators from "../../../../fixtures/locators.json";
import data from "../../../../fixtures/CMSModule/RcsaUrlLinkForm/RcsaUrlLinkForm.json";

class UrlLink {
  // Add a link to the instance template within the iframe's description section

  addLinkDescription() {
    cy.get(locators.regChangeManagementV2.administration.decriptionFrame).then(
      ($iframe) => {
        const body = $iframe.contents().find("body");
        cy.wrap(body)
          .click({ force: true })
          .type(" ") // Adds a space after the first text
          .type(data.typeLink.split("\n")[0], { force: true })
          .type(" "); // Adds a space after the first text
      }
    );
  }

  // Click the save button to submit the template data

  submitBtn() {
    cy.get(locators.cms.rcsa.templateBtn).click();
  }

  // Navigate to the risk register page and trigger the "Start RCSA Review" action

  createRcsaTicket() {
    cy.visitRiskRegister();
    cy.get(locators.kxi.kxiData.threeElepsis).should("be.visible").click();
    cy.get(locators.kxi.kxiData.restoreLayout2, { timeout: 10000 })
      .contains(data.rcsaReview)
      .click();

    cy.get(locators.cms.rcsa.baDropdown).first().click();
    cy.get(locators.cms.rcsa.baTypeGroup).first().click({ force: true });
  }

  // Function to select a date using the date picker
  selectDateByDatePicker() {
    const targetDay = data.targetDate;

    // Wait for 2 seconds to ensure the iframe has fully loaded before proceeding
    cy.wait(2000);

    cy.get(locators.cms.rcsa.calenderIconClick).first().click();

    // Wait for the calendar to open and make sure it is visible
    cy.get(locators.cms.rcsa.calenderVisible).should("be.visible");

    // Find and click the target day in the calendar
    cy.get(`td:contains("${targetDay}")`)
      .first()
      .should("be.visible")
      .click({ force: true });
  }

  // Capture the URL of a newly opened tab and visit it in the Cypress window

  saveBtn(newWindowUrl) {
    cy.window().then((win) => {
      // Stub window.open to capture the new tab/window URL
      cy.stub(win, "open").as("windowOpen");

      cy.log("Stubbed window.open");

      // Click the "Create" button to trigger the window.open
      cy.get(locators.cms.rcsa.startRcsaReviewBtn, { timeout: 50000 })
        .first()
        .click();

      // Assert window.open was called and extract the URL
      cy.get("@windowOpen", { timeout: 50000 })
        .should("be.called")
        .then((stub) => {
          const newTabUrl = stub.getCall(0).args[0];

          cy.log(data.captureData, newTabUrl);

          // Ensure the final URL is properly constructed, avoiding extra slashes or repeated parts
          const finalURL = newWindowUrl.replace(/\/$/, "") + newTabUrl;

          // Log the final constructed URL
          cy.log(data.finalUrlData, finalURL);

          // Visit the captured URL in the same Cypress window
          cy.visit(finalURL, { failOnStatusCode: false });
          cy.wait(2000); // Optional: Wait for the page to load
        });
    });
  }

  // Open the RCSA subtask by interacting with the iframe and clicking the subtask link

  openSubTask() {
    cy.switchIframe(locators.cms.ATask.frameId).then((iframe) => {
      cy.log("iframe....", iframe);
      cy.get(iframe)
        .find(locators.cms.rcsa.subTaskLinkClick, { timeout: 10000 })
        .should("be.visible") // Ensure the summary field is visible
        .click();
    });
  }

  // Click on the description link located within the description section of the iframe

  clickDesClick() {
    cy.switchIframe(locators.cms.ATask.frameId).then((iframe) => {
      cy.log("iframe....", iframe);
      cy.get(iframe)
        .find(locators.cms.rcsa.descrptionLinkClick, { timeout: 10000 })
        .first()
        .scrollIntoView()
        .should("be.visible")
        .click();
    });
  }
}

export default UrlLink;
