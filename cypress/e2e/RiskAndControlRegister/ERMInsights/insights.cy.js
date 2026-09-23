/// <reference types="../../../support" />
import { LinkedKXI } from "../../../support/POM/RiskAndControlRegister/insights";
import { KriMyTaxonomy } from "../../../support/POM/RiskModule_PO/KriMyTaxonomy";
import { RiskAppetite } from "../../../support/POM/RiskAndControlRegister/riskAppetite";
import myTaxanomyKri from "../../../fixtures/RiskModule/Risk_Process_Taxonomy/myTaxanomyKri.json";

export let riskDefName = "initial value set";
describe("For Risk Insights and Predict Risk Calculations, linking Threshold/non-threshold kxi to Risk Category/Definition", () => {
  const Kxi = new LinkedKXI();
  const kri = new KriMyTaxonomy();
  let kxiApplicable, kxiNotApplicable, kxiPartialNotApplicable, riskCatName;
  let localTimeConvert = "sample time";
  const sessionSetup = () => {
    cy.session("login - with ERM User that have RM and KXI Both", () => {
      const withRM2 = Cypress.env("kxi").customer.withRM2;
      cy.visit(Cypress.config("baseUrl"));
      cy.login(withRM2.username, withRM2.password, withRM2.key);
    });
  };

  const riskCatDefSetup = () => {
    cy.visitProfile();
    kri.createRiskCategory("Risk Cat ", "Risk Cat ", "Risk Cat ").then(() => {
      riskCatName = kri.getSharedData("generatedRiskCategory");
    });

    kri.createRiskDefinition("Risk Def ", "Risk Def ", "Risk Def ").then(() => {
      riskDefName = kri.getSharedData("generatedDefName");
      kri.addRiskApplicablity(riskDefName);
    });
  };

  const kxiRiskSetup = () => {
    cy.ignoreNetworkLogs();
    sessionSetup();

    riskCatDefSetup();
    cy.visitkxiDef();
    kri.createKxiDefinitionTrigger("kxi Def ").then(() => {
      kxiApplicable = kri.getSharedData("generatedKxiName");
    });

    kri
      .createKxiDefinitionWithoutTrigger("kxi Def without Trigger ")
      .then(() => {
        kxiNotApplicable = kri.getSharedData("generatedKxiName");
      });

    kri.createKxiDefinitionPartialNotApplicable("kxi Def Partial ").then(() => {
      kxiPartialNotApplicable = kri.getSharedData("generatedKxiName");
    });
  };

  beforeEach(() => {
    cy.ignoreNetworkLogs();
    sessionSetup();
  });

  before(() => {
    kxiRiskSetup();
  });

  //****************<<<<<(RISK--CATEGORY)>>>>>****************** */

  describe("Check that Predict Risk is calculating on Risk Category Level", () => {
    it("Verify that the data is added in dbTable when threshold value kri linked with Risk Category", () => {
      cy.visitkxiRiskInsight();
      Kxi.checkKxiWeight(
        "category",
        kxiApplicable,
        myTaxanomyKri.kri.data.valid.thresholdKxi,
        myTaxanomyKri.kri.weight.thresholdKxi,
        true,
        true
      );
      localTimeConvert = new Date().toLocaleString("en-US", {
        timeZone: "America/Chicago",
      });
      Kxi.verifyDbData(localTimeConvert);
    });

    it(
      "Check that when non thresholds kxI linked with Risk Category in Insights its weight will be '0'" +
      "verify that the data is not added in the db aswell.",
      () => {
        cy.visitkxiRiskInsight();
        Kxi.checkKxiWeight("category", kxiNotApplicable, null, 0, true, false);
        Kxi.verifyDbData(localTimeConvert);
      }
    );

    it("When non thresholds KxI linked with Risk Category in Inisghts its weight should be disable, not editable", () => {
      cy.visitkxiRiskInsight();
      Kxi.checkKxiWeight("category", kxiNotApplicable, null, 0, false, false);
    });
  });

  //   //**************************<<<<<(RISK--DEFINITION)>>>>>>******************* */

  describe("Check that Predict Risk is calculating on Risk Definition Level", () => {
    it("When threshold valued KXI linked with Risk Definition, predict risk will be re-calculated", () => {
      cy.visitkxiRiskInsight();
      Kxi.checkKxiWeight(
        "definition",
        kxiApplicable,
        myTaxanomyKri.kri.data.valid.thresholdKxi,
        myTaxanomyKri.kri.weight.thresholdKxi,
        true,
        true
      );
      Kxi.verifyPredictRisk("-3", "-3.00");
    });

    it("Verify that when Kri has only negative Threshold value, Predict risk will not be calculated if kri Data value is invalid & weight will be editable", () => {
      cy.visitkxiRiskInsight();
      Kxi.checkKxiWeight(
        "definition",
        kxiPartialNotApplicable,
        myTaxanomyKri.kri.data.invalid.partialNotApplicable,
        myTaxanomyKri.kri.weight.partialNotApplicable,
        true,
        true
      );
      Kxi.verifyPredictRisk("-3", "-3.00");
    });

    it("Verify that when Kri has only negative Threshold value, Predict risk will be calculated if Kri Data Value is valid, and the weight will be editable", () => {
      cy.visitkxiRiskInsight();
      Kxi.checkKxiWeight(
        "definition",
        kxiPartialNotApplicable,
        myTaxanomyKri.kri.data.valid.partialNotApplicable,
        myTaxanomyKri.kri.weight.partialNotApplicable,
        true,
        true
      );
      Kxi.verifyPredictRisk("-3", "-2.70");
    });

    it("Verify that if an already set KRI in insights is updated to “Not Applicable”, Predict risk should be recalculated, its weight should be set to 0, and it should not be editable.", () => {
      cy.visitkxiDef();
      kri.updateKriNotApplicable(kxiPartialNotApplicable);
      cy.visitkxiRiskInsight();
      Kxi.clickSubGridDef(riskDefName);
      Kxi.verifyPredictRisk("-3", "-3.00", { timeout: 3000 });
      Kxi.checkKxiWeight(
        "definition",
        kxiPartialNotApplicable,
        null,
        0,
        false,
        false
      );
    });

    it("Check that when non thresholds kxI linked with Risk definition in Insights its weight will be '0'", () => {
      cy.visitkxiRiskInsight();
      Kxi.clickSubGridDef(riskDefName);

      Kxi.selectKxionDef(kxiNotApplicable);
      Kxi.checkForWeightOnDef(kxiNotApplicable, 0);
    });

    it("When non thresholds KRI linked with Risk Definition in Inisghts its weight should be disable, not editable", () => {
      cy.visitkxiRiskInsight();
      Kxi.checkKxiWeight("definition", kxiNotApplicable, null, 0, false, false);
    });

    it("When non threshold valued KXI linked with Risk Definition, predict risk will not be re-calculated", () => {
      cy.visitkxiRiskInsight();
      Kxi.clickSubGridDef(riskDefName);
      Kxi.verifyPredictRisk("-3", "-3.00");
    });
  });
  describe("Check for the Predict Risk Calculations and weights with metric based KRIs", () => {
    const appetite = new RiskAppetite();

    before(() => {
      sessionSetup();
      riskCatDefSetup();
      cy.visitRiskAppetite();
      appetite.fillAddRiskAppetiteForm("Appetite");

      const metricApplicable = appetite.addMetric(
        "Applicable",
        kxiApplicable,
        "applicable"
      );
      const metricNotApplicable = appetite.addMetric(
        "notApplicable",
        kxiNotApplicable,
        "notApplicable"
      );
      const metricPartialNotApplicable = appetite.addMetric(
        "partialApplicable",
        kxiPartialNotApplicable,
        "partialNotApplicable"
      );
      appetite.searchAndLinkMetric(metricApplicable);
      appetite.saveAppetite();
    });

    //****************************........RISK-CATEOGRIES.....****************** */
    it(
      "Ensure that when metric based non-threshold kri linked with Risk Category" +
      "its weight will be '0' and non editable in insights",
      () => {
        cy.visitkxiRiskInsight();
        Kxi.checkKxiWeight("category", kxiNotApplicable, null, 0, true, false);
        Kxi.checkKxiWeight("category", kxiNotApplicable, null, 0, false, false);
      }
    );

    //**************************.......RISK-DEFINITION...*********************** */
    it("Ensure that adding both positive, negative thresholds to the metric and linking them with Risk Definition will calculate Predict Risk", () => {
      cy.visitkxiRiskInsight();
      Kxi.checkKxiWeight(
        "definition",
        kxiApplicable,
        myTaxanomyKri.riskAppetite.data.valid.thresholdKxi,
        myTaxanomyKri.riskAppetite.weight.thresholdKxi,
        true,
        true
      );
      Kxi.verifyPredictRisk("3", "3.00");
    });

    it(
      "Ensure that when only negative Threshold/Trigger values added with metrics and linking them with Risk Definition, " +
      " Predict risk will not be calculated if kri Data value is invalid & weight will be editable",
      () => {
        cy.visitkxiRiskInsight();
        Kxi.checkKxiWeight(
          "definition",
          kxiPartialNotApplicable,
          myTaxanomyKri.riskAppetite.data.invalid.partialNotApplicable,
          myTaxanomyKri.riskAppetite.weight.partialNotApplicable,
          true,
          true
        );
        Kxi.verifyPredictRisk("3", "3.00");
      }
    );

    it(
      "Ensure that when only negative Threshold/Trigger values added with metrics and linking them with Risk Definition, " +
      " Predict risk will be calculated if Kri Data Value is valid, and the weight will be editable",
      () => {
        cy.visitkxiRiskInsight();
        Kxi.checkKxiWeight(
          "definition",
          kxiPartialNotApplicable,
          myTaxanomyKri.riskAppetite.data.valid.partialNotApplicable,
          myTaxanomyKri.riskAppetite.weight.partialNotApplicable,
          true,
          true
        );
        Kxi.verifyPredictRisk("3", "3.00");
      }
    );

    it(
      "Ensure that when already added metric based kri updated to Not Applicable on both sides (Positive,Negative)" +
      " Predict risk should be recalculated, its weight should be set to 0, and it should not be editable.",
      () => {
        cy.visitkxiDef();
        kri.updateKriNotApplicable(kxiPartialNotApplicable);
        cy.visitkxiRiskInsight();
        Kxi.clickSubGridDef(riskDefName);
        Kxi.verifyPredictRisk("3", "3.00", { timeout: 3000 });
        Kxi.checkKxiWeight(
          "definition",
          kxiPartialNotApplicable,
          null,
          0,
          false,
          false
        );
      }
    );

    it(
      "Ensure that when metric based non-threshold kri linked with Risk Definition," +
      " kri weight will default set to '0' ",
      () => {
        cy.visitkxiRiskInsight();
        Kxi.clickSubGridDef(riskDefName);

        Kxi.selectKxionDef(kxiNotApplicable);
        Kxi.checkForWeightOnDef(kxiNotApplicable, 0);
      }
    );

    it(
      "Ensure that when metric based non-threshold kri linked with Risk Definition, " +
      " kri weight will be not editable",
      () => {
        cy.visitkxiRiskInsight();
        Kxi.checkKxiWeight(
          "definition",
          kxiNotApplicable,
          null,
          0,
          false,
          false
        );
      }
    );

    it(
      "Ensure that when metric based non-threshold kri linked with Risk definition, " +
      " Predict Risk will not be calculated on Risk Defintion",
      () => {
        cy.visitkxiRiskInsight();
        Kxi.clickSubGridDef(riskDefName);
        Kxi.verifyPredictRisk("3", "3.00");
      }
    );
  });
});
