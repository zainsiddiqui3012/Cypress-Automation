import locators from "../../../fixtures/locators.json";

/// <reference types= "cypress" />

import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import Category from "../../../fixtures/KXIModule/KXICategories.json";
import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";

describe(
  "Risk Appetite Screen Changes - PD-19376",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@define-kxis",
      "@pd22245",
      "@release5.17",
      "@predict",
      "@customer",
    ],
  },
  () => {
    context(
      "Risk Appetite changes for Customer with ERM",
      { tags: ["@withRM"] },
      () => {
        const predictMenu_PO = new PredictMenu_PO();
        const withoutRM_PEER = Cypress.env("kxi").customer.withRM3;
        beforeEach(() => {
          cy.loginWithSession(
            `login - ${withoutRM_PEER.username}`,
            withoutRM_PEER.username,
            withoutRM_PEER.password,
            withoutRM_PEER.key
          );
        });
        Category.forEach((test) => {
          it(test.CategoriesWithERM, () => {
            cy.visitProfile();

            predictMenu_PO.menuClick();
            cy.get(locators.menu.kxIManagement).click();
            cy.get(locators.menu.riskAppetite).click();
            cy.get(locators.kxi.riskAppetite.categoriesColumn).contains(
              "Categories"
            );
          });

          it(test.CategoriesAddForm, () => {
            cy.visitProfile();

            predictMenu_PO.menuClick();
            cy.get(locators.menu.kxIManagement).click();
            cy.get(locators.menu.riskAppetite).click();
            cy.get(
              locators.administration.organizationalHierarchy.addBtn
            ).click();
            cy.get(locators.kxi.riskAppetite.text).contains("Categories");
          });
          it(test.CategoriesEditForm, () => {
            cy.visitProfile();

            predictMenu_PO.menuClick();
            cy.get(locators.menu.kxIManagement).click();
            cy.get(locators.menu.riskAppetite).click();
            cy.get(locators.kxi.riskAppetite.editBtn).click();
            cy.get(locators.kxi.riskAppetite.text).contains("Categories");
          });
        });

        context(
          "Risk Appetite changes for Lumify",
          { tags: ["@withoutRM"] },
          () => {
            const predictMenu_PO = new PredictMenu_PO();
            const withoutRM_PEER = Cypress.env("kxi").customer.withoutRM;
            beforeEach(() => {
              cy.loginWithSession(
                `login - ${withoutRM_PEER.username}`,
                withoutRM_PEER.username,
                withoutRM_PEER.password,
                withoutRM_PEER.key
              );
            });
            Category.forEach((test) => {
              it(test.CategoriesWithERM, () => {
                cy.visitProfile();

                predictMenu_PO.menuClick();
                cy.get(locators.menu.administration).click();
                cy.get(locators.menu.riskAppetite).click();
                cy.get(locators.kxi.riskAppetite.categoriesColumn).contains(
                  "Categories"
                );
              });

              it(test.CategoriesLumifyAddForm, () => {
                cy.visitProfile();

                predictMenu_PO.menuClick();
                cy.get(locators.menu.administration).click();
                cy.get(locators.menu.riskAppetite).click();
                cy.get(
                  locators.administration.organizationalHierarchy.addBtn
                ).click();
                cy.get(locators.kxi.riskAppetite.text).contains("Categories");
              });
              it(test.CategoriesLumifyEditForm, () => {
                cy.visitProfile();

                predictMenu_PO.menuClick();
                cy.get(locators.menu.administration).click();
                cy.get(locators.menu.riskAppetite).click();
                cy.get(locators.kxi.riskAppetite.editBtn).eq(0).click();
                cy.get(locators.kxi.riskAppetite.text).contains("Categories");
              });
            });
          }
        );
      }
    );
  }
);
