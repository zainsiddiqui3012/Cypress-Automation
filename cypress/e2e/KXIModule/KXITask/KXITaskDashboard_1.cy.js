/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import kxiDef from "../../../fixtures/KXIModule/FredQuery.json";

import status from "../../../fixtures/KXIModule/TaskStatus.json";
const taskFilePath = "cypress/fixtures/KXIModule/KXITaskWriteUpdate.json";
const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
const withoutRM = Cypress.env("kxi").customer.decision;

describe(
  "Decisions - KXI Task Dashboard in decisions platform",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-task-dashboard",
      "@pd21999",
      "@release5.19",
      "@decision",
      "@customer",
    ],
  },
  () => {
    const kxi = new KXI_POM();

    context("Dashboard UI Verification", () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login - ${withoutRM.username}`,
          withoutRM.username,
          withoutRM.password,
          withoutRM.key
        );
      });
      it("Verify the title of KXI Task Dashboard", () => {
        kxi.navigateToDashboard();
        kxi.verifyDashboardTitle();
      });

      it("Verify grid view is loaded successfully", () => {
        kxi.navigateToDashboard();
        kxi.verifyDashboardColumns();
      });

      it("Verify the Summary column should be hyperlink", () => {
        kxi.navigateToDashboard();
        kxi.verifyHyperlink();
      });

      it("Verify the All tasks Data Entry should have pagination", () => {
        kxi.navigateToDashboardClickDataTasks();
        kxi.verifyPagination();
      });

      it("Verify if 'All Tasks' option is selected by default", () => {
        kxi.navigateToDashboard();
        kxi.verifyAllTasksSelectedByDefault();
      });
    });

    context("Task Creation (Regular/Update)", () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login - ${withoutRM.username}`,
          withoutRM.username,
          withoutRM.password,
          withoutRM.key
        );
      });
      it("Verify when add kxi update task from Update task button should be visible on Task Dashboard", () => {
        kxi.createUpdateTask(withoutRM.username);
        kxi.navigateToDashboardClickDataTasks();
        cy.readFile(taskFilePath).then((file) => {
          kxi.verifyNewlyCreatedTask(file.taskName);
        });
      });

      it("Verify when add kxi regular task from Take Action button should be visible on Task Dashboard", () => {
        kxi.navigateToKxiDefAndOpenTaskModal();
        kxi.addKxiDefinition(
          kxiDef.kxiValue,
          kxiDef.Left1,
          kxiDef.Left2,
          kxiDef.Left3,
          kxiDef.Right1,
          kxiDef.Right2,
          kxiDef.Right3,
          withoutRM.username,
          null,
          false,
          false,
          false,
          null,
          null,
          true
        );

        cy.readFile(writeDataFilePath).then((file) => {
          kxi.addKxiData(file.kxiName, kxiDef.kxiValue);
          kxi.navigateToKxiData(file.kxiName);
        });

        kxi.navigateToDashboard();
        cy.readFile(taskFilePath).then((file) => {
          kxi.verifyNewlyCreatedTask(file.taskName);
        });
      });
    });

    context("Task Filters", () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login - ${withoutRM.username}`,
          withoutRM.username,
          withoutRM.password,
          withoutRM.key
        );
      });

      status.filtersAllTasks.forEach((statusKey) => {
        it(`Verify the status '${statusKey}' Filter in All Tasks`, () => {
          kxi.navigateToDashboard();

          kxi.verifyStatusFilter(statusKey);
        });
      });

      status.filtersDataEntryTasks.forEach((statusKey) => {
        it(`Verify the status '${statusKey}' Filter in All Data Entry Tasks`, () => {
          kxi.navigateToDashboardClickDataTasks();

          kxi.verifyAllDataEntryStatusFilter(statusKey);
        });
      });
      it("Verify the task status of All Tasks in search dropdown", () => {
        kxi.navigateToDashboard();
        kxi.verifyStatusofAllTasks();
      });

      it("Verify the task status of All Data Entry Tasks in search dropdown", () => {
        kxi.navigateToDashboardClickDataTasks();
        kxi.verifyStatusofAllTasks();
      });
    });
  }
);
