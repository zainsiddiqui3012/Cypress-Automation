import locators from "../../../../fixtures/locators.json";

class NotificationSettings {
  clickNotificationSettings() {
    cy.get(locators.dms.notification.profileIcon).click();
    cy.contains(locators.dms.notification.NotificationSettings).click();
    cy.get(locators.dms.notification.addBtn).click();
  }

  enterNsName(value) {
    cy.get(locators.dms.notification.nsName).type(value);
  }

  enterNsNotifyBefore(value) {
    cy.get(locators.dms.notification.nsNotifyBefore).clear().type(value);
  }

  clickProdCheckbox() {
    cy.get(locators.dms.notification.notifyTo).click({ force: true });
    cy.contains(locators.dms.notification.prodCheckbox).click({ force: true });
   
  }

  clickTieredButton() {
    cy.get(locators.dms.notification.tieredButton).click({ force: true });
  }

  clickTieredCheckbox() {
    cy.get(locators.dms.notification.tieredCheckbox).click();
  }

  enterNstActivateBefore(value) {
    cy.get(locators.dms.notification.nstActivateBefore).clear().type(value);
  }

  enterNstFrequency(value) {
    cy.get(locators.dms.notification.nstFrequency).clear().type(value);
  }

  clickSaveButton() {
    cy.get(locators.dms.notification.saveButton).click();
  }
}

export default NotificationSettings;
