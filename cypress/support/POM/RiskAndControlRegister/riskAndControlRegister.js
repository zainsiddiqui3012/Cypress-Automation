import locators from "../../../fixtures/locators.json";
const writeDataFilePath =
  "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json";

class RiskAndControlRegister {
  /**
   * navigateToRiskTaxonmies will navigate to Risk Taxonomies Screen
   */
  navigateToRiskTaxonmies() {
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.riskAndControlRegister).click();
    cy.get(locators.menu.administrationRisk).click();
    cy.get(locators.menu.riskTaxonomies).click();
  }

  clickMyTaxonmiesTab() {
    cy.get(locators.risk.administration.riskTaxonomies.myTaxonmiesTab).click();
  }

  searchRiskDefinition(definition) {
    cy.get(locators.risk.administration.riskTaxonomies.searchRiskDefinition)
      .wait(500)
      .clear()
      .wait(500)
      .type(definition);
  }

  clickBusinessAreaDetailIcon(isExpand) {
    if (isExpand)
      cy.get(
        locators.risk.administration.riskTaxonomies
          .businessAreaDefinition_Expanded
      ).click({ force: true });
    else
      cy.get(
        locators.risk.administration.riskTaxonomies
          .businessAreaDefinition_Contracted
      ).click({ force: true });
  }

  verifyRiskAppetiteColumn(column) {
    cy.get(locators[column]).should("be.visible");
  }

  clickDetailsRiskInstance() {
    cy.get(locators.risk.riskRegister.detailsRiskInstance)
      .wait(2000)
      .first()
      .click({ force: true })
      .wait(2500);
  }

  clickControlOption(){
    
  }

  typeRiskName_EditRiskInstance(name) {
    if (name)
      cy.get(locators.risk.riskRegister.editDialogue.riskName)
        .clear()
        .wait(500)
        .type(name);
  }

  selectStatus_EditRiskInstance(status) {
    cy.wait(1500);
    if (status == "active")
      cy.get(
        locators.risk.riskRegister.editDialogue.status.activeLabel
      ).click();
    else
      cy.get(
        locators.risk.riskRegister.editDialogue.status.inactiveLabel
      ).click({ force: true });
  }

  selectApplicability(value) {
    cy.get(locators.risk.riskRegister.editDialogue.applicablility).select(
      value,
      { force: true }
    );
  }

  clickSaveBtn_EditInstance() {
    cy.get(locators.risk.riskRegister.editDialogue.saveBtn)
      .scrollIntoView()
      .click({ force: true })
      .wait(5000);
  }

  navigateToTaxnomyAndAddRiskCategory(riskAppetite) {
    cy.visitRiskTaxonomies();

    // Creating Risk Taxonomies locators object
    const riskTax = locators.risk.administration.riskTaxonomies;

    // Add Risk Category
    cy.get(riskTax.addRiskCategoryBtn).click();
    cy.createRandomAlphaNumeric(10).then((ranAlphaNum) => {
      cy.readFile(writeDataFilePath).then((file) => {
        const categoryID = riskAppetite.automation.riskCategoryID + ranAlphaNum;
        const categoryName = riskAppetite.automation.categoryName + ranAlphaNum;
        const categoryDescription =
          riskAppetite.automation.categoryDescription + ranAlphaNum;

        file.riskCategory.riskCategoryID = categoryID;
        file.riskCategory.categoryName = categoryName;
        file.riskCategory.categoryDescription = categoryDescription;

        cy.writeFile(writeDataFilePath, file);
        cy.addRiskCategory(categoryID, categoryName, categoryDescription);
      });
    });
    cy.verifyToastMessageText(riskAppetite.toastMsgText.categorySuccess, 30000);
    cy.waitForToastMessageToDisappear(30000);
  }

  navigateToTaxonomyAndAddRiskDefinition(riskAppetite) {
    // Creating Risk Taxonomies locators object
    const riskTax = locators.risk.administration.riskTaxonomies;

    cy.visitRiskTaxonomies();

    // Add Risk Definition
    cy.get(riskTax.addRiskDefinitionBtn).click();
    cy.createRandomAlphaNumeric(10).then((ranAlphaNum) => {
      cy.readFile(writeDataFilePath).then((file) => {
        const definitionID =
          riskAppetite.automation.riskDefinitionID + ranAlphaNum;
        const definitionName =
          riskAppetite.automation.definitionName + ranAlphaNum;
        const definitionDescription =
          riskAppetite.automation.definitionDescription + ranAlphaNum;

        file.riskDefinition.riskDefinitionID = definitionID;
        file.riskDefinition.definitionName = definitionName;
        file.riskDefinition.definitionDescription = definitionDescription;

        cy.writeFile(writeDataFilePath, file);
        cy.addRiskDefinition(
          definitionID,
          definitionName,
          definitionDescription,
          file.riskCategory.categoryName
        );
      });
    });
    cy.verifyToastMessageText(
      riskAppetite.toastMsgText.definitionSuccess,
      30000
    );
    cy.waitForToastMessageToDisappear(30000);
  }
}
export default RiskAndControlRegister;
