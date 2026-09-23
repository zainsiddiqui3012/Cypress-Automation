import ApfcusbComplaintWebForm from "../../../support/POM/CMSModule_PO/ApfcusbWebForm";

const complaintWebForm = new ApfcusbComplaintWebForm();

describe(
  "Check the webform and validate the labels and required fields that target the APFCUSB CUSTOMER. ",
  {
    tags: [
      "@regression",
      "@release5.21",
      "@cms",
      "@complaint-external-webform",
      "@customer",
      "@pd25139",
      "@erm",
      "@customer-space",
      "@apfcusb"
    ],
  },
  () => {
    it(
      "Check the labels and mandatory fields with the webform ",
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
          "@pd30659",
          "@pd30679",
          "@pd30680",
          "@pd30701",
          "@pd30709",
          "@pd30710",
          "@pd30711",
          "@pd30712"
        ],
      },
      () => {
        cy.visitComplaintExternalForm();
        complaintWebForm.checkLabels();
        complaintWebForm.checkMandatoryFields();
      }
    );
  }
);
