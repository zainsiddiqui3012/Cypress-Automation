/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import kxiDef from "../../../fixtures/KXIModule/FredQuery.json";
import KXIRegularTaskSummary from "../../../support/POM/KXIModule/KXITask/KXIRegularTaskSummary.js";
import KXIChildTask from "../../../support/POM/KXIModule/KXITask/KXIChildTask";
const status = "cypress/fixtures/KXIModule/TaskStatus.json";
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
      "@pd36108",
      "@release5.19",
      "@decision",
      "@customer",
    ],
  },
  () => {
    const kxi = new KXI_POM();
    const childTask = new KXIChildTask();

    context(
      "Create Task Button Visibility and Tasks Creation from Dashboard",
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            `login - ${withoutRM.username}`,
            withoutRM.username,
            withoutRM.password,
            withoutRM.key
          );
        });
        it(
          "Verify the 'Create Task' button on KXI Task Dashboard",
          { tags: ["pd39544", "pd39545", "pd39546"] },
          () => {
            kxi.navigateToDashboard();
            kxi.validateTaskButtonOnDashboard(true);
            kxi.navigateToDashboard();
            kxi.verifyDashboardColumns();
            cy.readFile(taskFilePath).then((file) => {
              kxi.searchTaskName(file.taskName);
            });
          }
        );
      }
    );

    context("Task Sorting", () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login - ${withoutRM.username}`,
          withoutRM.username,
          withoutRM.password,
          withoutRM.key
        );
      });
      //bug: https://360factors.atlassian.net/browse/PD-39510
      it("Verify sorting by Due Date column", { tags: "@pd41249" }, () => {
        kxi.navigateToDashboard();
        cy.waitForTopMsgLoaderToDisappear(100000);
        kxi.verifyDashboardColumns();
        kxi.sortWithCreatedDate();
        cy.readFile(taskFilePath).then((file) => {
          kxi.verifyCreatedTaskName(file.taskName);
        });
      });
      //bug: https://360factors.atlassian.net/browse/PD-39510
      it("Test sorting by Task Status", { tags: "@pd41250" }, () => {
        kxi.navigateToDashboard();
        cy.waitForTopMsgLoaderToDisappear(100000);
        kxi.verifyDashboardColumns();
        kxi.sortWithStatus();
        cy.readFile(taskFilePath).then((file) => {
          kxi.verifyCreatedTaskName(file.taskName);
        });
      });
    });

    context("Task Editing & Validations", () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login - ${withoutRM.username}`,
          withoutRM.username,
          withoutRM.password,
          withoutRM.key
        );
      });
      it(
        "Verify functionality of the task editing option",
        { tags: "pd39547" },
        () => {
          kxi.navigateToDashboard();
          cy.waitForTopMsgLoaderToDisappear(100000);
          kxi.verifyDashboardColumns();
          cy.readFile(taskFilePath).then((file) => {
            kxi.searchTaskName(file.taskName);
            kxi.clickCreatedTaskForEdit(file.taskName);
          });
        }
      );

      it(
        "Verify if task due date is in the correct format",
        { tags: "pd39548" },
        () => {
          kxi.navigateToDashboard();
          cy.waitForTopMsgLoaderToDisappear(100000);
          kxi.verifyDashboardColumns();
          cy.readFile(taskFilePath).then((file) => {
            kxi.clickCreatedTaskForEdit(file.taskName);
            const formattedDueDate = kxi.formatDueDateFormat(file.dueDate);
            kxi.verifyDueDate(formattedDueDate);
          });
        }
      );

      it(
        "Verify 'Created' field shows correct task creation timestamp",
        { tags: "pd39550" },
        () => {
          kxi.navigateToDashboard();
          cy.waitForTopMsgLoaderToDisappear(100000);
          kxi.verifyDashboardColumns();
          kxi.writeCurrentDate();
          cy.readFile(taskFilePath).then((file) => {
            kxi.clickCreatedTaskForEdit(file.taskName);
            const formattedcreatedDate = kxi.formatDueDateFormat(
              file.createdDate
            );
            kxi.verifyDueDate(formattedcreatedDate);
          });
        }
      );

      it(
        "Check if task status updates correctly (e.g., from 'In Progress' to 'Closed')",
        { tags: "pd39556" },
        () => {
          kxi.navigateToDashboard();
          cy.waitForTopMsgLoaderToDisappear(300000);
          kxi.verifyDashboardColumns();
          cy.readFile(taskFilePath).then((file) => {
            kxi.clickCreatedTaskForEdit(file.taskName);
            kxi.editStatusField(file.updatedTask.startStatus);
            kxi.verifyInProgressStatus(file.updatedTask.inprogressStatus);
          });
        }
      );

      it(
        "Ensure the task cannot be submitted with an empty 'Summary'",
        { tags: "pd39557" },
        () => {
          kxi.navigateToDashboard();
          cy.waitForTopMsgLoaderToDisappear(100000);
          kxi.verifyDashboardColumns();
          cy.readFile(taskFilePath).then((file) => {
            kxi.clickCreatedTaskForEdit(file.taskName);
            kxi.clickEditButton();
            kxi.verifySummaryFieldCharacterLimit(file.summaryFieldCharLimit);
            kxi.editSummaryField(file.updatedTask.summary, true);
            kxi.clickSaveButton();
            kxi.clickSaveButton();
            kxi.clickSaveButton();
            kxi.verifySaveBtnVisible();
          });
        }
      );

      it(
        "Verify that Fields can be updated of created Task",
        { tags: ["pd39551", "pd39552", "pd39553", "pd39554", "pd39555"] },
        () => {
          kxi.navigateToDashboard();
          cy.waitForTopMsgLoaderToDisappear(100000);
          kxi.verifyDashboardColumns();
          cy.readFile(taskFilePath).then((file) => {
            kxi.clickCreatedTaskForEdit(file.taskName);
            kxi.clickEditButton();
            kxi.editSummaryField(file.updatedTask.summary);
            kxi.editDescriptionField(file.updatedTask.description);
            kxi.editAssigneeField(
              Cypress.env("kxi").customer.decision.fullName
            );
            kxi.editPriorityField(file.updatedTask.priority);
            kxi.editCategoryField(file.updatedTask.category);
            kxi.editBusinessUnit();
            kxi.editSite(file.updatedTask.site);
            kxi.editRecurrence(file.updatedTask.recurrence);
            kxi.attachValidFile("testing.txt");
            kxi.clickSaveButton();
          });
        }
      );
    });

    context("Task other workflow", () => {
      const kxiRegularTaskSummary = new KXIRegularTaskSummary();
      beforeEach(() => {
        cy.loginWithSession(
          `login - ${withoutRM.username}`,
          withoutRM.username,
          withoutRM.password,
          withoutRM.key
        );
      });
      it(
        "Verify the 'Create Task' button on KXI Task Dashboard",
        { tags: ["pd39546", "@smoke"] },
        () => {
          kxi.navigateToDashboard();
          kxi.validateTaskButtonOnDashboard(true);
          kxi.navigateToDashboard();
          kxi.verifyDashboardColumns();
          cy.readFile(taskFilePath).then((file) => {
            kxi.searchTaskName(file.taskName);
          });
        }
      );

      it("Verify the Assignee Type", { tags: ["@pd41245", "@smoke"] }, () => {
        kxi.navigateToDashboard();
        cy.waitForTopMsgLoaderToDisappear(100000);
        kxi.verifyDashboardColumns();
        cy.readFile(taskFilePath).then((file) => {
          kxi.clickCreatedTaskForEdit(file.taskName);
          kxi.clickAssigneeButton();
          kxi.selectAssigneeUser(file.newAssignee);
          kxi.clickSubmitButton();
          kxiRegularTaskSummary.verifyChangedAssignee();
        });
      });
      it("Verify the Comment can be added", { tags: "@pd41246" }, () => {
        kxi.navigateToDashboard();
        cy.waitForTopMsgLoaderToDisappear(100000);
        kxi.verifyDashboardColumns();
        cy.readFile(taskFilePath).then((file) => {
          kxi.clickCreatedTaskForEdit(file.taskName);
          kxi.clickCommentButton();
          kxi.enterComment(file.commentText);
          kxi.verifyAddedComment(file.commentText);
        });
      });
      it("Verify Manage Watchers", { tags: ["@pd35488", "@smoke"] }, () => {
        kxi.navigateToDashboard();
        cy.waitForTopMsgLoaderToDisappear(100000);
        kxi.verifyDashboardColumns();
        cy.readFile(taskFilePath).then((file) => {
          kxi.clickCreatedTaskForEdit(file.taskName);
          kxi.clickManageWatcher();
          kxi.selectWatcherUser(file.watcherUser);
          kxi.validateWatcherUser(file.watcherUser);
        });
      });
      it(
        "Verify Export Button Workflow",
        { tags: ["@pd41247", "@smoke"] },
        () => {
          kxi.navigateToDashboard();
          cy.waitForTopMsgLoaderToDisappear(100000);
          kxi.verifyDashboardColumns();
          cy.readFile(taskFilePath).then((file) => {
            kxi.clickCreatedTaskForEdit(file.taskName);
            kxi.clickExportButton();
            kxi.downloadWord();
          });
        }
      );

      it(
        "Verify child task  Workflow",
        { tags: ["@pd35487", "@smoke"] },
        () => {
          kxi.navigateToDashboard();
          cy.waitForTopMsgLoaderToDisappear(100000);
          kxi.verifyDashboardColumns();
          cy.readFile(taskFilePath).then((file) => {
            kxi.clickCreatedTaskForEdit(file.taskName);
            childTask.createChildTaskForm(file.newAssignee);
          });
        }
      );
    });
  }
);
