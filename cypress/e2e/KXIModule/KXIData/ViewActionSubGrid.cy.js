/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";

describe(
  "View Action Sub-Grid On KXI Data Management Screen for KXI Regular Tasks",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd23680",
      "@release5.19",
      "@customer",
    ],
  },
  () => {
    context(
      "Login with decision who has all GKM Permission",
      { tags: ["@all-gkm-permission"] },
      () => {
        const kxi = new KXI_POM();
        const loginUser = Cypress.env("kxi").customer.decision;
        beforeEach(() => {
          cy.loginWithSession(
            `login - ${loginUser.username}`,
            loginUser.username,
            loginUser.password,
            loginUser.key
          );

          kxi.addKxiDataAndDefinitionWithoutCF(loginUser.username, null, true);
        });

        it(
          "Verify View Task Column on Data Grid",
          { tags: ["@predict"] },
          () => {
            cy.visitkxiData();
            kxi.verfiyTaskColumns();
          }
        );
        it(
          "Verify Create Task button on Data Grid",
          { tags: ["@predict"] },
          () => {
            cy.visitkxiData();
            kxi.verfiyTaskButton();
          }
        );
        it(
          "Create Task from Create Task button from Data sub-Grid",
          { tags: ["@decision"] },
          () => {
            cy.visitkxiData();
            kxi.clickCreateTask();
          }
        );
        //This case is failing due to the bug https://360factors.atlassian.net/browse/PD-28593
        it("Validate values on Data sub-Grid", { tags: ["@predict"] }, () => {
          cy.visitkxiData();
          kxi.validateValuesOnSubGrid();
        });
        it("Validate the task count", { tags: ["@predict"] }, () => {
          cy.visitkxiData();
          kxi.validateTaskContOnSubGrid();
        });
        it(
          "Validate the task name is hyperlink and on click it navigating to Summary Form",
          { tags: ["@decision"] },
          () => {
            cy.visitkxiData();
            kxi.verifyTaskName();
          }
        );
      }
    );
    context(
      "Login with decision who has No GKM Permission",
      { tags: ["@read-gkm-permission"] },
      () => {
        const kxi = new KXI_POM();
        const loginUser = Cypress.env("kxi").customer.decisionRead;
        const loginAll = Cypress.env("kxi").customer.decision;
        before(() => {
          cy.loginWithSession(
            `login - ${loginAll.username}`,
            loginAll.username,
            loginAll.password,
            loginAll.key
          );

          kxi.addKxiDataAndDefinitionWithoutCF(
            loginAll.username,
            loginUser.username,
            true
          );
        });
        it(
          "Verify Create Task button will not be visible when no permission or read permission will be given to the user",
          { tags: ["@predict"] },
          () => {
            cy.visit(Cypress.config("baseUrl"));
            cy.login(loginUser.username, loginUser.password, loginUser.key);
            cy.visitkxiData();
            kxi.verfiyTaskButtonNotVisible();
          }
        );
      }
    );
  }
);
