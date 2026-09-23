import KxiCategories from "../../../support/POM/KXIModule/KXICategories/KxiCategories";
import data from "../../../fixtures/KXIModule/KXICategories.json";
const kxiCategories = new KxiCategories();

describe(
  "E2E testing of kxi categories",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-categories",
      "@pd36110",
      "@predict",
      "@customer",
    ],
  },

  () => {
    context("Added the Kxi category", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );

        cy.visitKxiCategories();
      });

      it(
        "Verify that a new category can be added inline with description ",
        { tags: ["@pd38863", "@pd38868"] },
        () => {
          kxiCategories.addCategoryBtn();
          kxiCategories.enterName();
          kxiCategories.enterCategoryId();
          cy.verifyToastMessageText(data.successMsg, 20000).should(
            "be.visible"
          );
          kxiCategories.contentLib();
          kxiCategories.verifyLongDesc();
          cy.verifyToastMessageText(data.successMsg, 20000).should(
            "be.visible"
          );
        }
      );
    });
    context("update the Kxi category", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );

        cy.visitKxiCategories();
      });

      it(
        "Verify that an existing category can be edited inline ",
        { tags: "@pd38864" },
        () => {
          kxiCategories.editCategoryName();
          kxiCategories.editCategoryId();
        }
      );
    });
    context("added duplicate and Filters", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );

        cy.visitKxiCategories();
      });
      it(
        "Verify that duplicate KXI Category IDs are not allowed",
        { tags: "@pd38865" },
        () => {
          kxiCategories.checkDuplicateId();
          cy.verifyToastMessageText(data.duplicateText, 10000).should(
            "be.visible"
          );
        }
      );

      it(
        "Verify that filters work correctly with edited values",
        { tags: "@pd38866" },
        () => {
          kxiCategories.filterByEditedName();
        }
      );
    });
    context("empty name validation", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );

        cy.visitKxiCategories();
      });

      it("Validate the Name field is required ", { tags: "@pd38867" }, () => {
        kxiCategories.addCategoryBtn();
        kxiCategories.validateNameFieldIsRequired();
        cy.verifyToastMessageText(data.errorMessage, 20000).should(
          "be.visible"
        );
      });
    });
  }
);
