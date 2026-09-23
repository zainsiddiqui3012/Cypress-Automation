/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import kxiDef from "../../../fixtures/KXIModule/FredQuery.json";
import KXIRecurrence from "../../../support/POM/KXIModule/KXITask/KXIUpdateRecurrence";
import data from "../../../fixtures/KXIModule/Recurrence.json";
// I covered pd-23683
const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
describe(
  "Update Recurrence pattern when update task is edited.",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@define-kxis",
      "@pd23683",
      "@release5.19",
      "@decision",
      "@customer",
    ],
  },
  () => {
    context(
      "KXI Update Task button",
      { tags: ["@update-task", "@recurrence"] },
      () => {
        const kxiData = new KXI_POM();
        const recur = new KXIRecurrence();
        const withoutRM = Cypress.env("kxi").customer.decision;
        beforeEach(() => {
          cy.loginWithSession(
            `login - ${withoutRM.username}`,
            withoutRM.username,
            withoutRM.password,
            withoutRM.key
          );
        });

        it("Add Kxi definition ", () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();
          kxiData.addKxiDefinition(
            kxiDef.kxiValue,
            kxiDef.Left1,
            kxiDef.Left2,
            kxiDef.Left3,
            kxiDef.Right1,
            kxiDef.Right2,
            kxiDef.Right3
          );
        });

        it("Create Task", () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();

          kxiData.verifyUpdateTaskModal();

          kxiData.verifySingleOwner();
          cy.readFile(writeDataFilePath).then((file) => {
            kxiData.createTask(file.kxiName);
          });
        });

        it("Verify 'Daily' Recurrence", () => {
          recur.navigateToSummaryForm(
            data.daily,
            data.recurEvery,
            data.occurences
          );
        });
        it("Verify 'Weekly' Recurrence", () => {
          recur.navigateToSummaryForm(
            data.weekly,
            data.recurEvery,
            null,
            data.day
          );
        });
        it("Verify 'Monthly' Recurrence", () => {
          recur.navigateToSummaryForm(
            data.monthly,
            data.recurEvery,
            data.occurences,
            null,
            data.dayOfMonth
          );
        });
        it("Verify 'Bi-Yearly' Recurrence", () => {
          recur.navigateToSummaryForm(
            data.biYearly,
            data.recurEvery,
            data.occurences
          );
        });
        it("Verify 'Yearly' Recurrence", () => {
          recur.navigateToSummaryForm(
            data.yearly,
            data.recurEvery,
            data.occurences
          );
        });
        it("Verify 'Weekly' Recurrence with multiple days ", () => {
          recur.navigateToSummaryForm(
            data.weekly,
            data.recurEvery,
            null,
            data.day,
            null,
            data.day1,
            data.day2
          );
        });
      }
    );
  }
);
