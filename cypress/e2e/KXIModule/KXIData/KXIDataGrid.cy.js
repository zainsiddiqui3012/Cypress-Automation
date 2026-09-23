import locators from "../../../fixtures/locators.json";

/// <reference types= "cypress" />

import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import Data from "../../../fixtures/KXIModule/KXIData.json";
import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";

describe(
  "Kxi Data Management grid useability improvements",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd21943",
      "@release5.17",
      "@predict",
      "@customer",
    ],
  },
  () => {
    context(
      "Kxi Data Management grid useability improvements for Customer with ERM",
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
          it(test.ResettoDefaultLayout, () => {
            cy.visitProfile();

            predictMenu_PO.menuClick();

            kxiData.kxiDataMenu();
            kxiData.verifyDefaultLayout();
            kxiData.verifyDefaultView();
            kxiData.columnPickerBtn();
            kxiData.verifyColumnPickerFilter();
          });
          it(test.ColumnPicker, () => {
            cy.visitProfile();
            predictMenu_PO.menuClick();
            kxiData.kxiManagement();
            kxiData.kxiDataMenu();
            kxiData.columnPickerBtn();
          });
          it(test.Sorting, () => {
            cy.visitProfile();
            predictMenu_PO.menuClick();
            kxiData.kxiManagement();
            kxiData.kxiDataMenu();
            kxiData.checkSorting();
          });
          it(test.groupColHeader, () => {
            cy.visitProfile();
            predictMenu_PO.menuClick();
            kxiData.kxiManagement();
            kxiData.kxiDataMenu();
            kxiData.VerifyColumnnGroup();
          });

          it(test.ValidateBU, () => {
            cy.visitProfile();

            predictMenu_PO.menuClick();
            kxiData.kxiManagement();
            kxiData.kxiDataMenu();
            kxiData.columnPickerBtn();
            kxiData.verfiyBU();
          });
          it(test.ValidateName, () => {
            cy.visitProfile();

            predictMenu_PO.menuClick();
            kxiData.kxiManagement();
            kxiData.kxiDataMenu();
            kxiData.verifyNameColumn();
          });
          it(test.ResettoDefaultLayout, () => {
            cy.visitProfile();

            predictMenu_PO.menuClick();
            kxiData.kxiManagement();
            kxiData.kxiDataMenu();
            kxiData.verifyDefaultLayout();
            kxiData.verifyDefaultView();
            kxiData.columnPickerBtn();
            kxiData.verifyColumnPickerFilter();
          });
        });

        context(
          "Kxi Data Management grid useability improvements for Lumify Customer",
          { tags: ["@withoutRM"] },
          () => {
            const predictMenu_PO = new PredictMenu_PO();
            const kxiData = new KXI_POM();
            const withoutRM_PEER = Cypress.env("kxi").customer.withoutRM;
            beforeEach(() => {
                  cy.loginWithSession(
                    `login - ${withoutRM_PEER.username}`,
                    withoutRM_PEER.username,
                    withoutRM_PEER.password,
                    withoutRM_PEER.key
                  );
            });
            Data.forEach((test) => {
              it(test.ColumnPicker, () => {
                cy.visitProfile();
                predictMenu_PO.menuClick();

                kxiData.kxiDataMenu();
                kxiData.columnPickerBtn();
              });
              it(test.Sorting, () => {
                cy.visitProfile();
                predictMenu_PO.menuClick();

                kxiData.kxiDataMenu();
                kxiData.checkSorting();
              });
              it(test.groupColHeader, () => {
                cy.visitProfile();
                predictMenu_PO.menuClick();

                kxiData.kxiDataMenu();
                kxiData.VerifyColumnnGroup();
              });
              it(test.DefaultView, () => {
                cy.visitProfile();
                predictMenu_PO.menuClick();

                kxiData.kxiDataMenu();
                kxiData.verfiyDefaultColumns();
                kxiData.columnPickerBtn();
                kxiData.verfiyColumnsnotChecked();
              });
              it(test.ValidateBU, () => {
                cy.visitProfile();

                predictMenu_PO.menuClick();

                kxiData.kxiDataMenu();
                kxiData.columnPickerBtn();
                kxiData.verfiyBU();
              });
              it(test.ValidateName, () => {
                cy.visitProfile();

                predictMenu_PO.menuClick();

                kxiData.kxiDataMenu();
                kxiData.verifyNameColumn();
              });
            });
          }
        );
      }
    );
  }
);
