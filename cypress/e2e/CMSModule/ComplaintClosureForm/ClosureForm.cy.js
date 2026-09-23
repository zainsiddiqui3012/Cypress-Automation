import ClosureForm from "../../../support/POM/CMSModule_PO/ComplaintClosureForm/ClosureForm";
const complaintClosureForm = new ClosureForm();

describe(
  "Check that the complaint form is closed with all the mandatory fields",
  {
    tags: [
      "@regression",
      "@release5.20.3",
      "@cms",
      "@complaint-closure-internal-form",
      "@customer",
      "@pd32532",
      "@erm",
      "@customer-space",
      "@one_finance",
    ],
  },

  () => {
    beforeEach(() => {
      const userLogin = Cypress.env("USER").ONE_FINANCE;
      cy.loginWithSession(
        "loginwithsession",
        userLogin.username,
        userLogin.password,
        userLogin.key
      );
      cy.visitCMSDashboard();
    });

    it(
      "Check the ticket closed with all the mandatory field",
      {
        tags: ["@smoke", "@pd32590", "@pd32592", "@pd32594", "@pd32596"],
      },
      () => {
        complaintClosureForm.incidentDropdownClick();
        complaintClosureForm.complaintSelectClick();
        complaintClosureForm.filledMandatoryFields();
        complaintClosureForm.selectDateByDatePicker();
        complaintClosureForm.submitForm();
        complaintClosureForm.closeTicket();
      }
    );
  }
);
