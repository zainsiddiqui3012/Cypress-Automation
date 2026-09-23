/// <reference types="../../support" />

import locators from "../../fixtures/locators.json";
import RiskAndControlRegister from "../../support/POM/RiskAndControlRegister/riskAndControlRegister";

describe("RD BA Definition Sub-Grid Displaying Multiple Business Area", () => {
  const riskAndControlRegister = new RiskAndControlRegister();

  before(() => {
    cy.fixture(
      "RiskAndControlRegister/RiskDefinitionBusinessArea/riskDefinitionBusinessArea"
    ).then((riskDefinitionBusinessArea) => {
      global.riskDefinitionBusinessArea = riskDefinitionBusinessArea;
    });
  });

  it.only("The RD BA Definition should be displayed consistently in the sub-grid within the Risk Libraries Grid on the Customer space.", () => {
    // Creating Risk Taxonomies locators object
    const riskTax = locators.risk.administration.riskTaxonomies;

    cy.visit(Cypress.config("baseUrl"));
    cy.login(
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );

    // Navigate to Risk Taxonomies
    riskAndControlRegister.navigateToRiskTaxonmies();

    riskAndControlRegister.clickMyTaxonmiesTab();

    cy.waitForMyGridLoaderToDisappear(25000);

    riskAndControlRegister.searchRiskDefinition(
      riskDefinitionBusinessArea.riskDefinition
    );

    cy.wait(1500);

    riskAndControlRegister.clickBusinessAreaDetailIcon(true);

    cy.wait(1500);

    // Verify Row Count is Zero
    cy.get(riskTax.businessAreaDetailRows).should("have.length", 1);
  });
  it("Each risk definition in the Content library should be associated with a Business Area Definition only once on the Business Area Screen.", () => {
    // Creating Risk Taxonomies locators object
    const riskTax = locators.risk.administration.riskTaxonomies;

    cy.visit(Cypress.config("baseUrl"));
    cy.login(
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );

    cy.get(locators.menu.administration).click();
    cy.get(locators.menu.businessArea).click();

    cy.waitForMyGridLoaderToDisappear(25000);

    cy.wait(1500);

    riskAndControlRegister.clickBusinessAreaDetailIcon(true);

    cy.wait(1500);

    // Verify Row Count is Zero
    cy.get(riskTax.businessAreaDetailRows).should("have.length", 1);
  });
  it("The RD BA Definition should not be duplicated or displayed multiple times in the sub-grid, even if the same BA definition exists in the content libraries having the same content source.", () => {
    // Creating Risk Taxonomies locators object
    const riskTax = locators.risk.administration.riskTaxonomies;

    cy.visit(Cypress.config("baseUrl"));
    cy.login(
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );

    // Navigate to Risk Taxonomies
    riskAndControlRegister.navigateToRiskTaxonmies();

    riskAndControlRegister.clickMyTaxonmiesTab();

    cy.waitForMyGridLoaderToDisappear(25000);

    riskAndControlRegister.searchRiskDefinition(
      riskDefinitionBusinessArea.riskDefinition
    );

    cy.wait(1500);

    riskAndControlRegister.clickBusinessAreaDetailIcon(true);

    cy.wait(1500);

    // Verify Row Count is Zero
    cy.get(riskTax.businessAreaDetailRows).should("have.length", 1);
  });
  it("When viewing the details of a risk definition, it should accurately show that the risk is associated with only one RD BA Definition, corresponding to the content library.", () => {
    // Creating Risk Taxonomies locators object
    const riskTax = locators.risk.administration.riskTaxonomies;

    cy.visit(Cypress.config("baseUrl"));
    cy.login(
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );

    // Navigate to Risk Taxonomies
    riskAndControlRegister.navigateToRiskTaxonmies();

    riskAndControlRegister.clickMyTaxonmiesTab();

    cy.waitForMyGridLoaderToDisappear(25000);

    riskAndControlRegister.searchRiskDefinition(
      riskDefinitionBusinessArea.riskDefinition
    );

    cy.wait(1500);

    riskAndControlRegister.clickBusinessAreaDetailIcon(true);

    cy.wait(1500);

    // Verify Row Count is Zero
    cy.get(riskTax.businessAreaDetailRows).should("have.length", 1);
  });
  it("The sub-grid within the Risk Libraries Grid, My Taxonomy Grid, and Risk Register should accurately reflect the association between risk definitions and RD BA Definitions without redundancy.", () => {
    // Creating Risk Taxonomies locators object
    const riskTax = locators.risk.administration.riskTaxonomies;

    cy.visit(Cypress.config("baseUrl"));
    cy.login(
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );

    // Navigate to Risk Taxonomies
    riskAndControlRegister.navigateToRiskTaxonmies();

    riskAndControlRegister.clickMyTaxonmiesTab();

    cy.waitForMyGridLoaderToDisappear(25000);

    riskAndControlRegister.searchRiskDefinition(
      riskDefinitionBusinessArea.riskDefinition
    );

    cy.wait(1500);

    riskAndControlRegister.clickBusinessAreaDetailIcon(true);

    cy.wait(1500);

    // Verify Row Count is Zero
    cy.get(riskTax.businessAreaDetailRows).should("have.length", 1);
  });
  it("The system should consider the specific content library associated with each instance of Business Area Definition, ensuring that the correct RD BA Definition is displayed in the sub-grid based on the content library.", () => {
    // Creating Risk Taxonomies locators object
    const riskTax = locators.risk.administration.riskTaxonomies;

    cy.visit(Cypress.config("baseUrl"));
    cy.login(
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );

    // Navigate to Risk Taxonomies
    riskAndControlRegister.navigateToRiskTaxonmies();

    riskAndControlRegister.clickMyTaxonmiesTab();

    cy.waitForMyGridLoaderToDisappear(25000);

    riskAndControlRegister.searchRiskDefinition(
      riskDefinitionBusinessArea.riskDefinition
    );

    cy.wait(1500);

    riskAndControlRegister.clickBusinessAreaDetailIcon(true);

    cy.wait(1500);

    // Verify Row Count is Zero
    cy.get(riskTax.businessAreaDetailRows).should("have.length", 1);
  });
  it("The RD BA Definition should be displayed consistently in the sub-grid within the My Taxonomy Grid on the Customer space.", () => {
    // Creating Risk Taxonomies locators object
    const riskTax = locators.risk.administration.riskTaxonomies;

    cy.visit(Cypress.config("baseUrl"));
    cy.login(
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );

    // Navigate to Risk Taxonomies
    riskAndControlRegister.navigateToRiskTaxonmies();

    riskAndControlRegister.clickMyTaxonmiesTab();

    cy.waitForMyGridLoaderToDisappear(25000);

    riskAndControlRegister.searchRiskDefinition(
      riskDefinitionBusinessArea.riskDefinition
    );

    cy.wait(1500);

    riskAndControlRegister.clickBusinessAreaDetailIcon(true);

    cy.wait(1500);

    // Verify Row Count is Zero
    cy.get(riskTax.businessAreaDetailRows).should("have.length", 1);
  });
  it("The RD BA Definition should be displayed consistently in the sub-grid within the Risk Register on the Customer space.", () => {
    // Creating Risk Taxonomies locators object
    const riskTax = locators.risk.administration.riskTaxonomies;

    cy.visit(Cypress.config("baseUrl"));
    cy.login(
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );

    // Navigate to Risk Taxonomies
    riskAndControlRegister.navigateToRiskTaxonmies();

    riskAndControlRegister.clickMyTaxonmiesTab();

    cy.waitForMyGridLoaderToDisappear(25000);

    riskAndControlRegister.searchRiskDefinition(
      riskDefinitionBusinessArea.riskDefinition
    );

    cy.wait(1500);

    riskAndControlRegister.clickBusinessAreaDetailIcon(true);

    cy.wait(1500);

    // Verify Row Count is Zero
    cy.get(riskTax.businessAreaDetailRows).should("have.length", 1);
  });
});
