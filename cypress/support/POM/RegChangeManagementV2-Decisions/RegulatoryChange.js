import locators from "../../../fixtures/locators.json";
import dataFile from "../../../fixtures/RegChangeManagementV2-Decisions/RegChange.json";

const writeFile =
  "cypress/fixtures/RegChangeManagementV2-Decisions/WriteAdministration.json";
class RegulatoryChange {
  regLocators = locators.cms.regChange;

  fillForm() {
    cy.waitForTopMsgLoaderToDisappear(30000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(this.regLocators.assignTome)
      .click();

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(this.regLocators.buDropdown)
      .click();
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(this.regLocators.option)
      .contains(dataFile.BU)
      .click({ force: true });

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(this.regLocators.subjectAreaDropdown)
      .click();
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(this.regLocators.option)
      .contains(dataFile.subjectArea)
      .click({ force: true });

    cy.readFile(writeFile).then((file) => {
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(this.regLocators.natureofChangeDropsown)
        .click();
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(this.regLocators.searchInput)
        .type(file.saveNatureOfChange)
        .type("{Enter}");

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(this.regLocators.typeOfChangeDropdown)
        .click();
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(this.regLocators.searchInput)
        .type(file.saveChangeType)
        .type("{Enter}");

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(this.regLocators.magnitudeDropdown)
        .click();
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(this.regLocators.searchInput)
        .type(file.saveMagnitude)
        .type("{Enter}");
    });
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(this.regLocators.createBtn)
      .click();
  }
}
export default RegulatoryChange;
