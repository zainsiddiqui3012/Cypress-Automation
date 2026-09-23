import NotificationSettings from "../../../support/POM/DMS/NotificationSetting/NotificationSetting.js";
const testData = require("../../../fixtures/DMS/NotificationSetting/NotificationSetting.json");

describe("Notification Settings Automation Test", () => {
  const notificationSettings = new NotificationSettings();

  beforeEach(() => {
    cy.session("Logging with ERM User Credentials including Peer Banks", () => {
      const withRm = Cypress.env("kxi").customer.DMS;
      cy.visit(Cypress.config("baseUrl"));
      cy.login(withRm.username, withRm.password, withRm.key);
    });
  });

  it("Perform Notification Settings Operations", () => {
    // Step 1: Open Website
    cy.visit(Cypress.env("notificationSetting_url"));

    // Step 2: Click on Notification Settings
    notificationSettings.clickNotificationSettings();

    // Step 3: Enter "test" into "ns_name"
    notificationSettings.enterNsName(testData.nsName);

    // Step 4: Enter "1" into "ns_notifyBefore"
    notificationSettings.enterNsNotifyBefore(testData.nsNotifyBefore);

    // Step 5: Click on "prod"
    notificationSettings.clickProdCheckbox();

    // Step 6: Click on "Tiered"
    notificationSettings.clickTieredButton();

    // Step 7: Click on "Tiered" checkbox
    notificationSettings.clickTieredCheckbox();

    // Step 8: Enter "1" into "nst_activateBefore_1"
    notificationSettings.enterNstActivateBefore(testData.nstActivateBefore);

    // Step 9: Enter "1" into "nst_frequency_1"
    notificationSettings.enterNstFrequency(testData.nstFrequency);

    // Step 10: Click on "Save"
    notificationSettings.clickSaveButton();
  });
});
