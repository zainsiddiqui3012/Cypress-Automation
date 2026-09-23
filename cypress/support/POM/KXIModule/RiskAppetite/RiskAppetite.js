import locators from "../../../../fixtures/locators.json";
import { KriMyTaxonomy } from "../../RiskModule_PO/KriMyTaxonomy";
import KxIDefinition from "../../KXIModule/KxIDefinition";
import KXI_POM from "../../../../support/POM/KXIModule/KxI_POM";
import kxiDef from "../../../../fixtures/KXIModule/FredQuery.json";
import riskAppetite from "../../../../fixtures/RiskAppetite/RiskAppetite.json";
import dayjs from "dayjs";
import { use } from "chai";
const appetite = locators.risk.riskAppetite;
const addAppetite = appetite.addRiskAppetiteForm;
const metric = appetite.addMetricForm;
const mainURL = Cypress.env("MAIN_URL");
const writeDataFilePath =
  "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json";

export class RiskAppetite {
  kxiData = new KXI_POM();
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
  fillAddRiskAppetiteForm(riskAppetiteName, Edit = null) {
    const updatedAppetiteName =
      Edit != null
        ? riskAppetiteName + " " + this.timeStamp + " " + Edit
        : riskAppetiteName + " " + this.timeStamp;

    cy.get(locators.risk.riskAppetite.addRiskAppetiteForm.statement)
      .clear()
      .type(updatedAppetiteName);
    cy.readFile(writeDataFilePath).then((file) => {
      file.statement = updatedAppetiteName;

      cy.writeFile(writeDataFilePath, file);
    });
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
   * Searches for a statement and verifies it exists with the correct status.
   *
   * @param {String} statementName - Name of the statement to search.
   * @param {String} status - Expected status to validate.
   */
  searchStatement(statementName, status) {
    cy.get(locators.risk.riskAppetite.grid.searchStatement).clear();
    cy.get(locators.risk.riskAppetite.grid.searchStatement).type(
      "{selectall}{backspace}"
    );
    cy.get(locators.risk.riskAppetite.grid.searchStatement)
      .clear()
      .type(statementName)
      .type("{enter}", { delay: 1500 });

    cy.get(locators.risk.riskAppetite.grid.statementColumn).should(
      "contain",
      statementName
    );
    cy.get(locators.risk.riskAppetite.grid.statusColumn).should(
      "contain",
      status
    );
  }
  /**
   * Deletes a risk appetite entry and verifies success message.
   */
  deleteRiskAppetite() {
    cy.get(appetite.deleteRiskAppetite).click();
    cy.get(appetite.confirmDelete).eq(1).click();

    cy.verifyToastMessageContains(riskAppetite.deleteMessage, 3000);
  }

  /**
   * Deletes a matrix entry and verifies success message.
   */
  deleteMatrix() {
    cy.get(appetite.deleteMatrix).click();
    cy.get(appetite.confirmDelete).eq(0).click();

    cy.verifyToastMessageContains(riskAppetite.deleteMatric, 3000);
  }
  /**
   * Opens edit mode for a matrix, creates a new KXI definition in a new tab.
   *
   * @param {String} username - Username to associate with the KXI definition.
   */

  editMatrix(username) {
    cy.get(appetite.editMatrix).click();
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");

      cy.get(appetite.addkxiButton).click();

      cy.get("@windowOpen")
        .should("be.called")
        .then((stub) => {
          const newTabUrl = stub.getCall(0).args[0];
          const finalURL = mainURL + newTabUrl;
          cy.visit(finalURL);
        });
      this.kxiData.addKxiDefinition(
        kxiDef.kxiValue,
        kxiDef.Left1,
        kxiDef.Left2,
        kxiDef.Left3,
        kxiDef.Right1,
        kxiDef.Right2,
        kxiDef.Right3,
        username,
        null,
        true
      );
    });
  }
  /**
   * editRiskAppetite will search the metric in appetite form
   * @param {String} riskAppetiteName is risk appetite name
   */
  editRiskAppetite(riskAppetiteName) {
    //searching with appetite name
    cy.waitForMyGridLoaderToDisappear(20000);
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
  /**
   * Adds a new risk appetite from provided data, optionally checks for duplicate.
   *
   * @param {Object|null} riskAppetite - Risk appetite data object (e.g., {statement: "Risk statement"}).
   * @param {boolean} isDuplicate - if true, attempts to enter a duplicate risk appetite.
   */
  addRiskAppetite(riskAppetite = null, isDuplicate = false) {
    cy.get(appetite.addBtn).should("be.visible").click({ force: true });

    cy.createRandomString(8).then((randomSuffix) => {
      cy.readFile(writeDataFilePath).then((file) => {
        const statementValue = isDuplicate
          ? file.statement // existing value to trigger duplicate error
          : `${riskAppetite.statement}_${randomSuffix}`; // unique value

        // Update file only if creating a new, unique entry
        if (!isDuplicate) {
          file.statement = statementValue;
          cy.writeFile(writeDataFilePath, file);
        }

        cy.get(addAppetite.statement)
          .should("be.visible")
          .focus()
          .clear()
          .type(statementValue);
      });
    });

    cy.get(locators.risk.riskAppetite.addRiskAppetiteForm.metrics.linkMetrics)
      .eq(0)
      .click({ delay: 400 });

    cy.get(addAppetite.saveBtn).scrollIntoView().click();

    // Validate appropriate URL based on duplicate or unique entry
    if (isDuplicate) {
      cy.url().should("include", "error=Risk+appetite+already+exists");
    } else {
      cy.url().should("include", "success=Successfully+updated");
    }
  }

  /**
   * Edits the owner field of an existing risk appetite.
   */

  editAppetite_OwnerField(name, userName) {
    cy.readFile(writeDataFilePath).then((file) => {
      cy.get(appetite.searchStatement)
        .wait(500)
        .clear()
        .wait(500)
        .type(file.statement);
      cy.wait(1500);
      cy.get(appetite.editRiskAppetite).click();
      cy.get(appetite.addRiskAppetiteForm.owner).select(
        name + " (" + userName + ")"
      );
    });
    cy.get(addAppetite.saveBtn).scrollIntoView().click();
  }
  /**
   * Edits risk appetite and removes an associated category.
   */
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
  /**
   * Edits the status of a risk appetite and confirms the change.
   */
  editAppetiteChangeStatus() {
    cy.readFile(writeDataFilePath).then((file) => {
      cy.get(appetite.searchStatement)
        .wait(500)
        .clear()
        .wait(500)
        .type(file.statement);
      cy.wait(1500);
      cy.get(appetite.editRiskAppetite).click();
      this.fillAddRiskAppetiteForm(file.statement, "Edit");
      cy.get(appetite.statusDropdown).select(riskAppetite.InActive);
    });
    cy.get(addAppetite.saveBtn).scrollIntoView().click();
    cy.get(appetite.confirmInactive).click();
  }

  /**
   * Links a metric in the form using the provided name.
   *
   * @param {String} name - Name of the metric to link.
   */
  linkMetric(name) {
    cy.get(addAppetite.metrics.searchName).type(name);
    cy.get(addAppetite.metrics.linkMetrics).eq(0).click();
  }

  /**
   * Searches for a metric in the grid and verifies its presence.
   *
   * @param {String} metricName - Metric to search for.
   */
  searchMetricInGrid(metricName) {
    cy.get(locators.risk.riskAppetite.grid.searchMetrics).type(
      "{selectall}{backspace}",
      { force: true, delay: 800 }
    );
    cy.get(locators.risk.riskAppetite.grid.searchMetrics)

      .type(metricName, { force: true })
      .type("{enter}", { delay: 1500 });

    cy.get(locators.risk.riskAppetite.grid.metricsColumn).should(
      "contain",
      metricName
    );
  }
  /**
   * Validates character length restriction for statement description.
   */

  validateStatementLength() {
    cy.createRandomString(5010).then((description) => {
      cy.get(appetite.statementDescriptionFrame).then(($iframe) => {
        const body = $iframe.contents().find(appetite.descriptionText);
        cy.wait(3000);
        cy.wrap(body).click().type(description, { force: true });
      });
    });
    cy.get(appetite.statementCharacterCount)
      .should("be.visible")
      .should("have.text", riskAppetite.characterCount);
  }
  /**
   * Validates character limit enforcement in the qualitative matrix description.
   */
  validateQualitativeMatrixLength() {
    cy.createRandomString(5010).then((description) => {
      cy.get(appetite.matrixDescriptionFrame).then(($iframe) => {
        const body = $iframe.contents().find(appetite.descriptionText);
        cy.wait(3000);
        cy.wrap(body).click().type(description, { force: true });
      });
    });
    cy.get(appetite.matrixCharacterCount)
      .should("be.visible")
      .should("have.text", riskAppetite.characterCount);
  }
  /**
   * Verifies that all mandatory fields are marked and required validations are working.
   */
  validateMandatoryFields() {
    riskAppetite.requiredFields.forEach((field) => {
      cy.contains("label", field.trim())
        .find("span", { timeout: 10000 })
        .should("have.class", "required");
    });
    cy.get(locators.risk.riskAppetite.addRiskAppetiteForm.saveBtn).click();

    cy.verifyToastMessageContains(riskAppetite.errorMessage, 3000);
    cy.get(appetite.matrixGrid).should("have.class", "headerError");
  }

  /**
   * Validates character limit enforcement in the Statement Field.
   */
  validateStatementLength() {
    cy.get(locators.risk.riskAppetite.addRiskAppetiteForm.characterMsg)
      .should("be.visible")
      .should("have.text", riskAppetite.characterLimit);
    cy.createRandomString(260).then((name) => {
      cy.get(locators.risk.riskAppetite.addRiskAppetiteForm.statement)
        .clear()
        .type(name);
    });
    cy.get(locators.risk.riskAppetite.addRiskAppetiteForm.metrics.linkMetrics)
      .eq(0)
      .click({ delay: 400 });
    this.saveAppetite();
  }
  /**
   * Verifies that submitting the matrix form with empty fields triggers validation error.
   */
  verifyMandatoryFieldsONMatrix() {
    cy.get(
      locators.risk.riskAppetite.addRiskAppetiteForm.metrics.addMetricBtn
    ).click();
    cy.get(locators.risk.riskAppetite.addMetricForm.submitBtn).click();
    cy.verifyToastMessageContains(riskAppetite.errorMessage, 3000);
  }
}

export default RiskAppetite;
