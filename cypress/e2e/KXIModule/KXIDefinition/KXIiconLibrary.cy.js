import locators from "../../../fixtures/locators.json";

/// <reference types= "cypress" />

import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import Data from "../../../fixtures/KXIModule/KXIData.json";
import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";

describe(
  "KxI Definition Screen - Provide a library of icons for the user to choose.",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@define-kxis",
      "@pd21948",
      "@release5.17",
      "@predict",
      "@customer",
    ],
  },
  () => {
    context(
      "KxI Definition Screen - Provide a library of icons for the user to choose for Customer with ERM",
      { tags: ["@withRM"] },
      () => {
        const predictMenu_PO = new PredictMenu_PO();
        const kxiData = new KXI_POM();
         const withoutRM_PEER = Cypress.env("kxi").customer.withRM;
        beforeEach(() => {
         
          cy.loginWithSession(
            `login - ${withoutRM_PEER.username}`,
            withoutRM_PEER.username,
            withoutRM_PEER.password,
            withoutRM_PEER.key
          );
        });
        Data.forEach((test) => {
          it(test.IconLibraryButton, () => {
            cy.visitProfile();
            predictMenu_PO.menuClick();
            kxiData.kxiManagement();
            kxiData.defineKxi();
            kxiData.addkxi();
            kxiData.chooseIconLibrary();
          });
          it(test.IconLibraryButtonEdit, () => {
            cy.visitProfile();
            predictMenu_PO.menuClick();
            kxiData.kxiManagement();
            kxiData.defineKxi();
            kxiData.editKxi();
            kxiData.chooseIconLibrary();
          });
          it(test.VerifyBrowseFunctionaliy, () => {
            cy.visitProfile();
            predictMenu_PO.menuClick();
            kxiData.kxiManagement();
            kxiData.defineKxi();
            kxiData.addkxi();
            kxiData.chooseFromBrowse();
          });
        });

        context(
          "KxI Definition Screen - Provide a library of icons for the user to choose",
          { tags: ["@withoutRM"] },
          () => {
            const predictMenu_PO = new PredictMenu_PO();
            const kxiData = new KXI_POM();
            beforeEach(() => {
              cy.session("login - with Lumify Customer", () => {
                const withoutRM_PEER = Cypress.env("kxi").customer.withoutRM;
                cy.visit(Cypress.config("baseUrl"));
                cy.login(
                  withoutRM_PEER.username,
                  withoutRM_PEER.password,
                  withoutRM_PEER.key
                );
              });
            });
            Data.forEach((test) => {
              it(test.IconLibraryButton, () => {
                cy.visitProfile();
                predictMenu_PO.menuClick();
                kxiData.lumifyAdmin();
                kxiData.defineKxi();
                kxiData.addkxi();
                kxiData.chooseIconLibrary();
              });
              it(test.IconLibraryButtonEdit, () => {
                cy.visitProfile();
                predictMenu_PO.menuClick();
                kxiData.lumifyAdmin();
                kxiData.defineKxi();
                kxiData.editKxi();
                kxiData.chooseIconLibrary();
              });
              it(test.VerifyBrowseFunctionaliy, () => {
                cy.visitProfile();
                predictMenu_PO.menuClick();
                kxiData.lumifyAdmin();
                kxiData.defineKxi();
                kxiData.addkxi();
                kxiData.chooseFromBrowse();
              });
            });
          }
        );
      }
    );
  }
);
