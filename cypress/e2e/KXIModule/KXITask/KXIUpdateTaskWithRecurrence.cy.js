/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import KXIRecurrence from "../../../support/POM/KXIModule/KXITask/KXIUpdateRecurrence";
import data from "../../../fixtures/KXIModule/Recurrence.json";

const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
describe(
  "Decisions - Required Recurrence Functionality for Task and validate Correctly diplaying Recurrence Pattern in summary form",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@define-kxis",
      "@pd23806",
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

        it("Verify 'Daily' Recurrence", () => {
          recur.recurrenceValidation(
            data.daily,
            data.recurEvery,
            data.occurences
          );
        });
        it("Verify 'Weekly' Recurrence", () => {
          recur.recurrenceValidation(
            data.weekly,
            data.recurEvery,
            null,
            data.day
          );
        });
        it("Verify 'Monthly' Recurrence", () => {
          recur.recurrenceValidation(
            data.monthly,
            data.recurEvery,
            data.occurences,
            null,
            data.dayOfMonth
          );
        });
        it("Verify 'Bi-Yearly' Recurrence", () => {
          recur.recurrenceValidation(
            data.biYearly,
            data.recurEvery,
            data.occurences
          );
        });
        it("Verify 'Yearly' Recurrence", () => {
          recur.recurrenceValidation(
            data.yearly,
            data.recurEvery,
            data.occurences
          );
        });
        it("Verify 'Weekly' Recurrence with multiple days ", () => {
          recur.recurrenceValidation(
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
