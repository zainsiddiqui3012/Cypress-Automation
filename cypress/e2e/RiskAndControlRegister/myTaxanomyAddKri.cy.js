import locators from "../../fixtures/locators.json";
import { KriMyTaxonomy } from "../../support/POM/RiskModule_PO/KriMyTaxonomy";

describe("Verify KRI weight values when added with threshold/non-threshold kxI Definitions", () => {
  const kri = new KriMyTaxonomy();
  let riskCatName, riskDefName, kxiName;
  const setupSession = () => {
    cy.session("login - with ERM User that have RM and KXI Both", () => {
      const withRM2 = Cypress.env("kxi").customer.withRM;
      cy.visit(Cypress.config("baseUrl"));
      cy.login(withRM2.username, withRM2.password, withRM2.key);
    });
  };

  before(() => {
    setupSession();
    cy.visitProfile();
    kri.createRiskCategory("Risk Cat ", "Risk Cat ", "Risk Cat ").then(() => {
      riskCatName = kri.getSharedData("generatedRiskCategory");
    });

    kri.createRiskDefinition("Risk Def ", "Risk Def ", "Risk Def ").then(() => {
      riskDefName = kri.getSharedData("generatedDefName");
    });

    cy.visitkxiDef();
    kri.createKxiDefinitionTrigger("kxi Def ").then(() => {
      kxiName = kri.getSharedData("generatedKxiName");
    });
  });

  beforeEach(() => {
    setupSession();
  });

  //****************<<<<<(RISK--CATEGORY)>>>>>****************** */

  describe("Check KRIs and weights on  Risk Category Level", () => {
    it("When adding the KRI Check that weight is the mandatory field.", () => {
      cy.visitProfile();
      kri.navigateMyTaxanomy();
      //search with risk def name in grid and click edit in Risk Category
      kri.editRiskCatDef(
        riskDefName,
        locators.kxi.insight.linkedKxI.kxiCategorySubGrid,
        locators.risk.administration.riskTaxonomies.editCatDef,
        true
      );
      kri.kriMendatoryFields(kxiName);
    });

    it("Verify that user can not add more than 100 weight values on category", () => {
      cy.visitProfile();
      kri.navigateMyTaxanomy();
      kri.editRiskCatDef(
        riskDefName,
        locators.kxi.insight.linkedKxI.kxiCategorySubGrid,
        locators.risk.administration.riskTaxonomies.editCatDef,
        true
      );
      kri.kriWeightCheck(kxiName);
    });

    it("Verify that User should not be able to add same kri if it is already added.", () => {
      cy.visitProfile();
      kri.navigateMyTaxanomy();
      kri.editRiskCatDef(
        riskDefName,
        locators.kxi.insight.linkedKxI.kxiCategorySubGrid,
        locators.risk.administration.riskTaxonomies.editCatDef,
        true
      );
      kri.sameKriValidation(kxiName);
    });
  });

  //****************<<<<<(RISK--DEFINATION)>>>>>****************** */

  describe("Check KRIs and Weights on Risk Defination Level", () => {
    it("When adding the KRI Check that weight is the mandatory field.", () => {
      cy.visitProfile();
      kri.navigateMyTaxanomy();
      //search with risk def name in grid and click edit in Risk Category
      kri.editRiskCatDef(
        riskDefName,
        locators.kxi.insight.linkedKxI.kxiDefinitionSubGrid,
        locators.risk.administration.riskTaxonomies.editCatDef,
        true
      );
      kri.kriMendatoryFields(kxiName);
    });

    it("Verify that user can not add more than 100 weight values on category", () => {
      cy.visitProfile();
      kri.navigateMyTaxanomy();
      kri.editRiskCatDef(
        riskDefName,
        locators.kxi.insight.linkedKxI.kxiDefinitionSubGrid,
        locators.risk.administration.riskTaxonomies.editCatDef,
        true
      );
      kri.kriWeightCheck(kxiName);
    });

    it("Verify that User should not be able to add same kri if it is already added.", () => {
      cy.visitProfile();
      kri.navigateMyTaxanomy();
      kri.editRiskCatDef(
        riskDefName,
        locators.kxi.insight.linkedKxI.kxiDefinitionSubGrid,
        locators.risk.administration.riskTaxonomies.editCatDef,
        true
      );
      kri.sameKriValidation(kxiName);
    });
  });
});
