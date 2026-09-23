/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import kxiDef from "../../../fixtures/KXIModule/FredQuery.json";

describe(
  "Edit Button Changes on KXI Data Management Screens - Improvement",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd23556",
      "@release5.19",
      "@predict",
      "@customer",
    ],
  },
  () => {
    context("KXI Data Edit button", { tags: ["@withRM"] }, () => {
      const kxiData = new KXI_POM();
      const predictMenu_PO = new PredictMenu_PO();
      const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
      const withoutRM = Cypress.env("kxi").customer.withRM;
      beforeEach(() => {
        cy.loginWithSession(
          "login - decisions",
          withoutRM.username,
          withoutRM.password,
          withoutRM.key
        );
      });

      it("Verify in case of manual  when click on Edit button .it should show the text box against the column (KRI Value, Sample Date, Comments) in an editable mode", () => {
        cy.visitkxiDef();
        kxiData.addKxiDefinition(
          kxiDef.kxiValue,
          kxiDef.Left1,
          kxiDef.Left2,
          kxiDef.Left3,
          kxiDef.Right1,
          kxiDef.Right2,
          kxiDef.Right3,
          withoutRM.username
        );
        kxiData.verifyEditFields(kxiDef.kxiValue, true);
      });
      // The test for Automatic kxi Data is removed due to the improvement now all fields are editable
    });
  }
);
