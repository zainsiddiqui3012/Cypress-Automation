import NotificationSettings from "../../support/POM/Riskreview_PO/RiskReviewCustomFields.js";
const testData = require("../../fixtures/RCSAAuditLog/RiskreviewCustomField.json");

describe(
  "Riskreview mode see custom fields are appearing",
  {
    tags: [
      "@release5.21",
      "@pd21607",
      "@risk-register-rcsa",
      "@risk-register",
      "@rcsa",
      "@rcsa-review-mode",
      "@regression",
      "@erm",
      "@cms",
    ],
  },
  () => {
    const notificationSettings = new NotificationSettings();

    beforeEach(() => {
      cy.loginWithSession(
        "login with Risk Management User",
        Cypress.env("USER").RCSA_REVIEWER.USERNAME,
        Cypress.env("USER").RCSA_REVIEWER.PASSWORD,
        Cypress.env("USER").RCSA_REVIEWER.KEY
      );
    });

    it(
      "Performs Notification Settings Operations",
      {
        tags: [
          "@smoke",
          "@custom-fields",
          "@rcsa",
          "@cms",
          "@review-mode",
          "@pd30160",
        ],
      },
      () => {
        // Step 1: Open webPage
        cy.visitRiskRegister();

        // Step 2: Click on "Risk and Control Register" and click on columns
        notificationSettings.clickoncolumns();

        // Step 3-8: Click on "Columns" tab
        notificationSettings.ClickoncolumnButton();

        // Step 4: Click on Checkbox
        notificationSettings.clickCheckbox();

        // Step"5: Click on reload
        notificationSettings.reloadPage();

        // Step 6: click on threedot button
        notificationSettings.clickthreedot();

        // Step 7: Click on "Start RCSA Review"
        notificationSettings.startRcsa();

        // Step 8: Select current date
        notificationSettings.currentDate();

        // Step 9: Select Business Unit
        notificationSettings.selectBusinessUnit();

        // Step 10: Select Risk Review ID
        notificationSettings.clickonYesbutton();

        // Step 11: Click on Risk Review
        notificationSettings.clickRiskReview();

        // Step 12: Click on Risk Review
        notificationSettings.OnriskReview();
      }
    );
  }
);
