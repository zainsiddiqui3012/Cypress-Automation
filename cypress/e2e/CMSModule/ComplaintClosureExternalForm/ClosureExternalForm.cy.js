import ClosureExternalForm from "../../../support/POM/CMSModule_PO/ComplaintClosureExternalForm/ClosureExternalForm";

const closureWebForm = new ClosureExternalForm();

describe(
  "Check the webform and validate the form closed suscessfully ",
  {
    tags: [
      "@regression",
      "@release5.20.3",
      "@cms",
      "@complaint-closur-external-form",
      "@customer",
      "@pd32532",
      "@erm",
      "@customer-space",
      "@sims",
    ],
  },
  () => {
    it(
      "Check the ticket closed with all the mandatory field",
      {
        tags: ["@smoke", "@pd32590", "@pd32592", "@pd32594", "@pd32596"],
      },
      () => {
        cy.visitComplaintExternalForm();
        closureWebForm.filledFields();
        closureWebForm.selectDateByDatePicker();
        closureWebForm.submitform();
      }
    );

    context("Sims user login", () => {
      beforeEach(() => {
        const userLogin = Cypress.env("USER").SIMS;
        cy.loginWithSession(
          "loginwithsession",
          userLogin.username,
          userLogin.password,
          userLogin.key
        );
        cy.visitCMSDashboard();
      });

      it(
        "check the web form in the advanced search and close the ticket",
        {
          tags: ["@smoke", "@pd32590", "@pd32592", "@pd32594", "@pd32596"],
        },
        () => {
          closureWebForm.advanceSearchClick();
          closureWebForm.searchTicket();
          closureWebForm.closeTicket();
          closureWebForm.mandatoryFieldsPopup();
          closureWebForm.editForm();
          closureWebForm.closeTicket();
          closureWebForm.closedPopup();
        }
      );
    });
  }
);
