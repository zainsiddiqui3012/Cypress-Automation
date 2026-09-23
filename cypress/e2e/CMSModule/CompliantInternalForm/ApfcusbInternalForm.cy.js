import CompliantInternalForm from "../../../support/POM/CMSModule_PO/ApfcusbInternalForm";

const complaintForm = new CompliantInternalForm();

describe(
  "Check the internal form and validate the labels and required fields that target the APFCUSB CUSTOMER. ",
  {
    tags: [
      "@regression",
      "@release5.21",
      "@cms",
      "@complaintinternalwebform",
      "@regression",
      "@release5.21",
      "@cms",
      "@complaint-internal-webform",
      "@customer",
      "@pd25139",
      "@erm",
      "@customer-space",
      "@apfcusb"
    ],
  },

  () => {
    beforeEach(() => {
      const noneLogin = Cypress.env("USER").APFCUS;
      cy.loginWithSession(
        "loginwithsession",
        noneLogin.username,
        noneLogin.password,
        noneLogin.key
      );
      cy.visitCMSDashboard();
    });

    it(
      "Check the labels and Mandatory fields",
      {
        tags: [
          "@smoke",
          "@pd30162",
          "@pd30192",
          "@pd30193",
          "@pd30194",
          "@pd30195",
          "@pd30196",
          "@pd30201",
          "@pd30202",
          "@pd30203",
          "@pd30204",
          "@pd30205",
          "@pd30206",
          "@pd30208",
          "@pd30209",
          "@pd30259",
          "@pd30261",
          "@pd30263",
          "@pd30660",
          "@pd30679",
          "@pd30680",
          "@pd30684",
          "@pd30708",
          "@pd30712"
        ],
      },
      () => {
        complaintForm.incidentDropdownClick();
        complaintForm.complaintSelectClick();
        complaintForm.checkLabels();
        complaintForm.checkMandatoryFields();
      }
    );
  }
);
