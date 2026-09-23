/// <reference types="../../../support" />
import locators from "../../../fixtures/locators.json";
import { KriMyTaxonomy } from "../../../support/POM/RiskModule_PO/KriMyTaxonomy";
import KxIDefinition from "../../../support/POM/KXIModule/KxIDefinition";
import KXIDefinition from "../../../fixtures/KXIModule/KXIDefinition.json";
import riskAppetite from "../../../fixtures/RiskAndControlRegister/RiskAppetite/riskAppetite.json";
import dayjs from "dayjs";

export class RiskAppetite {
  timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
  kxiDef = new KxIDefinition();
  kri = new KriMyTaxonomy();

  //addAppetiteBtn is single click function to create Risk Appetite
  addAppetiteBtn() {
    cy.get(locators.risk.riskAppetite.addBtn).click();
  }

  /**
   * fillAndRiskAppetiteform will open Appetite form
   * @param {String} riskAppetiteName is appetite name
   */
  fillAddRiskAppetiteForm(riskAppetiteName) {
    const updatedAppetiteName = riskAppetiteName + " " + this.timeStamp;
    this.addAppetiteBtn();
    cy.get(locators.risk.riskAppetite.addRiskAppetiteForm.statement).type(
      updatedAppetiteName
    );
  }

  /**
   * addMetric will fill the metric form and add the kxi in metric with fulfilling the values based on type of kxi
   * @param {String} metricName is new metric name
   * @param {String} kxiDefName is kxi name
   * @param {String} kxiType is kxi type they can be ("applicable","notApplicable","partialNotApplicable")
   * @returns updateMetricName is updated created metric name
   */
  addMetric(metricName, kxiDefName, kxiType) {
    const updatedMetricName = metricName + " " + this.timeStamp;
    cy.get(
      locators.risk.riskAppetite.addRiskAppetiteForm.metrics.addMetricBtn
    ).click();
    this.fillMetricThresholdValues(updatedMetricName, kxiDefName, kxiType);
    return updatedMetricName;
  }

  /**
   * searchAndLinkMetric will search the kxi names in risk appettite form on metric section and check all the related metric kxi than save the settings
   * @param {*} metricName is searched metric name
   */
  searchAndLinkMetric(metricName) {
    cy.get(
      locators.risk.riskAppetite.addRiskAppetiteForm.metrics.searchName
    ).clear();
    cy.get(
      locators.risk.riskAppetite.addRiskAppetiteForm.metrics.searchName
    ).type("{selectall}{backspace}");
    cy.get(locators.risk.riskAppetite.addRiskAppetiteForm.metrics.searchName)
      .clear()
      .type(metricName)
      .type("{enter}", { delay: 1500 });

    //it was not clicking multiple with chaining
    cy.get(
      locators.risk.riskAppetite.addRiskAppetiteForm.metrics.linkMetrics
    ).click({ multiple: true }, { delay: 400 });
  }

  /**
   * editRiskAppetite will search the metric in appetite form
   * @param {String} riskAppetiteName is risk appetite name
   */
  editRiskAppetite(riskAppetiteName) {
    //searching with appetite name
    cy.waitForMyGridLoaderToDisappear(400000);
    cy.get(locators.risk.riskAppetite.searchStatement).clear();
    cy.get(locators.risk.riskAppetite.searchStatement)
      .click({ delay: 800 })
      .type("{selectall}{backspace}");
    cy.get(locators.risk.riskAppetite.searchStatement).clear();
    cy.get(locators.risk.riskAppetite.searchStatement)
      .type(riskAppetiteName)
      .type("{enter}");
    cy.get(locators.risk.riskAppetite.editRiskAppetite).then((editKxi) => {
      cy.wrap(editKxi).should("have.length", 0, { delay: 200 });
      cy.get(locators.risk.riskAppetite.editRiskAppetite).click({ delay: 800 });
    });
  }

  //saveAppetite will save the appetite form
  saveAppetite() {
    cy.get(locators.risk.riskAppetite.addRiskAppetiteForm.saveBtn).click();
    cy.get(locators.risk.riskAppetite.addRiskAppetiteForm.saveBtn).should(
      "not.be.visible",
      { timeout: 3000 }
    );
  }

  /**
   * fillMetricThreshold will add the threshold values in metric form based on kxi type
   * @param {String} metricName is metric name
   * @param {String} kxiDefName is kxi definition name
   * @param {String} kxiType is kxi type ("applicable","notApplicable","partialNotApplicable")
   */
  fillMetricThresholdValues(metricName, kxiDefName, kxiType) {
    cy.get(locators.risk.riskAppetite.addMetricForm.name).clear();
    cy.get(locators.risk.riskAppetite.addMetricForm.name).type(metricName);

    cy.get(
      locators.risk.riskAppetite.addMetricForm.searchKriSelector.selectKriBtn
    ).click();
    cy.get(locators.risk.riskAppetite.addMetricForm.searchKriSelector.searchKri)
      .type(kxiDefName)
      .type("{enter}");

    this.kri.setTriggers(
      kxiType,
      riskAppetite.metric[0].targetValue,
      riskAppetite.metric[0].leftTriggerLevel1,
      riskAppetite.metric[0].leftTriggerLevel2,
      riskAppetite.metric[0].leftTriggerLevel3,
      riskAppetite.metric[0].rightTriggerLevel1,
      riskAppetite.metric[0].rightTriggerLevel2,
      riskAppetite.metric[0].rightTriggerLevel3
    );

    cy.get(locators.risk.riskAppetite.addMetricForm.submitBtn).click();
    cy.get(locators.risk.riskAppetite.addMetricForm.submitBtn).should(
      "not.be.visible",
      { timeout: 8000 }
    );
  }
}

const appetite = locators.risk.riskAppetite;
const addAppetite = appetite.addRiskAppetiteForm;
const metric = appetite.addMetricForm;

const writeDataFilePath =
  "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json";

class RiskAppetite2 {
  addRiskAppetite(riskAppetite, isDuplicate) {
    cy.get(appetite.addBtn).should("be.visible").click({ force: true });
    cy.createRandomString(8).then((name) => {
      cy.readFile(writeDataFilePath).then((file) => {
        const statementValue = isDuplicate
          ? file.statement
          : riskAppetite.statement + name;
        file.statement = riskAppetite.statement + name;
        cy.get(addAppetite.statement)
          .should("be.visible")
          .focus()
          .type(statementValue);

        cy.writeFile(writeDataFilePath, file);
      });
    });

    this.linkMetric(riskAppetite.metrics.name);
    cy.readFile(writeDataFilePath).then((file) => {
      cy.get(addAppetite.selectRiskItem)
        .contains(file.riskCategory.categoryName)
        .find("span.aciTreeCheck")
        // .last()
        .click();
    });

    cy.get(addAppetite.saveBtn).scrollIntoView().click();

    if (isDuplicate)
      cy.url().should("include", "error=Risk+appetite+already+exists");
    else cy.url().should("include", "success=Successfully+updated");
  }

  editAppetite_OwnerField() {
    cy.readFile(writeDataFilePath).then((file) => {
      cy.get(appetite.searchStatement)
        .wait(500)
        .clear()
        .wait(500)
        .type(file.statement);

      cy.wait(1500);

      cy.get(appetite.editRiskAppetite).click();
      cy.get(appetite.addRiskAppetiteForm.owner).select(
        Cypress.env("NAME") + " (" + Cypress.env("username") + ")"
      );
    });
    cy.get(addAppetite.saveBtn).scrollIntoView().click();
  }

  editAppetiteAndRemoveCat() {
    cy.readFile(writeDataFilePath).then((file) => {
      cy.get(appetite.searchStatement)
        .wait(500)
        .clear()
        .wait(500)
        .type(file.statement);

      cy.wait(1500);

      cy.get(appetite.editRiskAppetite).click();

      cy.get(appetite.addRiskAppetiteForm.selectRiskItem)
        .contains("label", file.riskCategory.categoryName)
        .find("span")
        .first()
        .click();
    });
    cy.get(addAppetite.saveBtn).scrollIntoView().click();
  }

  addMetric(metricData) {
    cy.get(addAppetite.addMetricBtn)
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

    cy.createRandomString(8).then((name) => {
      cy.get(metric.name, { timeout: 40000 })
        .should("be.visible")
        .focus()
        .type(metricData.name + name);
    });

    cy.get(metric.targetValue).type(metricData.targetValue, { force: true });

    cy.get(metric.leftTriggerLevel1).type(metricData.leftTriggerLevel1);
    cy.get(metric.leftTriggerLevel2).type(metricData.leftTriggerLevel2);
    cy.get(metric.leftTriggerLevel3).type(metricData.leftTriggerLevel3);
    cy.get(metric.rightTriggerLevel1).type(metricData.rightTriggerLevel1);
    cy.get(metric.rightTriggerLevel2).type(metricData.rightTriggerLevel2);
    cy.get(metric.rightTriggerLevel3).type(metricData.rightTriggerLevel3);

    cy.get(metric.submitBtn)
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
  }

  linkMetric(name) {
    cy.get(addAppetite.metrics.searchName).type(name);
    cy.get(addAppetite.metrics.linkMetrics).click();
  }
}
export default RiskAppetite2;
