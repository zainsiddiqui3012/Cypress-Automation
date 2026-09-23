/// <reference types="../../support" />

import negativeImpactData from "../../fixtures/RiskAndControlRegister/RiskRegisterNegativeImpact/riskRegisterNegativeImpact.json";
import riskAppetite from "../../fixtures/RiskAndControlRegister/RiskAppetite/riskAppetite.json";
import locators from "../../fixtures/locators.json";

import RiskAndControlRegister from "../../support/POM/RiskAndControlRegister/riskAndControlRegister";
import RiskAppetite from "../../support/POM/RiskAndControlRegister/riskAppetite";
const username = Cypress.env("username");

const riskAppetiteFixtureFilePath =
  "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json";

describe("RiskRegisterNegativeImpact-Add createdBy, createdOn, modifiedBy, modifiedOn and isDeleted fields - 20587", () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.session("login session of user: " + username, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(username, Cypress.env("password"), Cypress.env("key"));
    });
  });
  const riskAndControlRegister = new RiskAndControlRegister();
  const riskApp = new RiskAppetite();

  // The RiskRegisterNegativeImpact entity should be updated to include createdBy, createdOn, modifiedBy, modifiedOn and isDeleted fields
  negativeImpactData.fields.forEach((dbFieldTest) => {
    it.skip(dbFieldTest.name, () => {
      cy.query(negativeImpactData.showColQuery).then((res) => {
        let isFound = false;
        res.forEach((element) => {
          if (element.Field === dbFieldTest.fieldName) {
            isFound = true;
            console.log(
              `found ${element.Field} in predict360.riskregisternegativeimpact`
            );
          }
        });

        expect(isFound).to.be.true;
      });
    });
  });

  it("Create Prerequisite for RiskRegisterNegativeImpact-Add createdBy, createdOn, modifiedBy, modifiedOn and isDeleted fields - 20587", () => {
    riskAndControlRegister.navigateToTaxnomyAndAddRiskCategory(
      riskAppetite
    );

    riskAndControlRegister.navigateToTaxonomyAndAddRiskDefinition(
      riskAppetite
    );

    cy.visitRiskAppetite();

    riskApp.addRiskAppetite(riskAppetite.riskAppetite, false);
  });

  it("The system should display only active records to users, and any required actions should be performed on active records. - Risk Metric Number", () => {
    cy.query(riskAppetite.selectAppetite).then((res) => {
      console.log(res[0].statement);
      cy.visitRiskAppetite();

      cy.get(locators.risk.riskAppetite.searchStatement)
        .wait(500)
        .clear()
        .wait(500)
        .type(res[0].statement);

      cy.get(locators.risk.riskAppetite.riskAppetiteStatement).should(
        "have.text",
        res[0].statement
      );
    });
  });

  it(
    riskAppetite.riskAppetite.statement +
      " When isDeleted is set to true, the system should appropriately handle the visibility and actions related to the records.",
    () => {
      let appetiteStatement = riskAppetite.riskAppetite.statement;
      const riskApp = locators.risk.riskAppetite;

      cy.visitRiskAppetite();

      cy.get(riskApp.addBtn).click();

      cy.createRandomString(10).then((str) => {
        cy.get(riskApp.addRiskAppetiteForm.statement).type(
          appetite.statement + str
        );
        appetiteStatement = appetiteStatement + str;
      });

      cy.get(riskApp.addRiskAppetiteForm.metrics.searchName).type(
        riskAppetite.riskAppetite.metrics.name
      );

      cy.wait(1500);

      cy.get(riskApp.addRiskAppetiteForm.metrics.linkMetrics).click();

      cy.readFile(
        "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json"
      ).then((file) => {
        cy.get(riskApp.addRiskAppetiteForm.selectRiskItem)
          .contains("label", file.riskCategory.categoryName)
          .find("span")
          .first()
          .click();

        cy.get(riskApp.addRiskAppetiteForm.saveBtn).click();

        cy.get(riskApp.searchStatement)
          .wait(500)
          .clear()
          .wait(500)
          .type(appetiteStatement);

        cy.wait(1500);

        cy.get(riskApp.editRiskAppetite).click();

        cy.get(riskApp.addRiskAppetiteForm.selectRiskItem)
          .contains("label", file.riskCategory.categoryName)
          .find("span")
          .first()
          .click();
      });

      cy.get(riskApp.addRiskAppetiteForm.saveBtn).click();

      cy.query(riskAppetite.riskregisternegativeimpact).then((res) => {
        expect(res[0].isDeleted.data[0]).to.eq(1);
      });
    }
  );

  it("Active records should be presented to users for interaction.", () => {
    cy.query(riskAppetite.selectAppetite).then((res) => {
      console.log(res[0].statement);
      cy.visitRiskAppetite();

      cy.get(locators.risk.riskAppetite.searchStatement)
        .wait(500)
        .clear()
        .wait(500)
        .type(res[0].statement);

      cy.get(locators.risk.riskAppetite.riskAppetiteStatement).should(
        "have.text",
        res[0].statement
      );
    });
  });

  it("If a mapping exists with isDeleted set to true, the system should prevent the creation of a new record with similar data.", () => {
    let appetiteStatement = riskAppetite.riskAppetite.statement;
    const riskApp = locators.risk.riskAppetite;

    cy.visit(Cypress.config("baseUrl"));
    cy.login(
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );

    // Navigate to Risk Appetite
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.riskAndControlRegister).click();
    cy.get(locators.menu.riskAppetite).click();

    cy.get(riskApp.addBtn).click();

    cy.createRandomString(10).then((str) => {
      cy.get(riskApp.addRiskAppetiteForm.statement).type(
        riskAppetite.riskAppetite.statement + str
      );
      appetiteStatement = appetiteStatement + str;
    });

    cy.get(riskApp.addRiskAppetiteForm.metrics.searchName).type(
      riskAppetite.riskAppetite.metrics.name
    );

    cy.wait(1500);

    cy.get(riskApp.addRiskAppetiteForm.metrics.linkMetrics).click();

    cy.readFile(
      "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json"
    ).then((file) => {
      cy.get(riskApp.addRiskAppetiteForm.selectRiskItem)
        .contains("label", file.riskCategory.categoryName)
        .find("span")
        .first()
        .click();

      cy.get(riskApp.addRiskAppetiteForm.saveBtn).click();

      cy.get(riskApp.searchStatement)
        .wait(500)
        .clear()
        .wait(500)
        .type(appetiteStatement);

      cy.wait(1500);

      cy.get(riskApp.editRiskAppetite).click();

      cy.get(riskApp.addRiskAppetiteForm.selectRiskItem)
        .contains("label", file.riskCategory.categoryName)
        .find("span")
        .first()
        .click();
    });

    cy.get(riskApp.addRiskAppetiteForm.saveBtn).click();

    cy.get(riskApp.addBtn).click();

    cy.get(riskApp.addRiskAppetiteForm.statement).type(appetiteStatement);

    cy.get(riskApp.addRiskAppetiteForm.metrics.searchName).type(
      riskAppetite.riskAppetite.metrics.name
    );

    cy.wait(1500);

    cy.get(riskApp.addRiskAppetiteForm.metrics.linkMetrics).click();

    cy.get(riskApp.addRiskAppetiteForm.saveBtn).click();
  });

  it(
    riskAppetite.riskAppetite.statement +
      "Instead of creating a new record, the existing record with isDeleted marked as false should be considered.",
    () => {
      let appetiteStatement = riskAppetite.riskAppetite.statement;
      const riskApp = locators.risk.riskAppetite;

      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );

      // Navigate to Risk Appetite
      cy.get(locators.leftMenuBtn).click();
      cy.get(locators.menu.riskAndControlRegister).click();
      cy.get(locators.menu.riskAppetite).click();

      cy.get(riskApp.addBtn).click();

      cy.createRandomString(10).then((str) => {
        cy.get(riskApp.addRiskAppetiteForm.statement).type(
          appetite.statement + str
        );
        appetiteStatement = appetiteStatement + str;
      });

      cy.get(riskApp.addRiskAppetiteForm.metrics.searchName).type(
        riskAppetite.riskAppetite.metrics.name
      );

      cy.wait(1500);

      cy.get(riskApp.addRiskAppetiteForm.metrics.linkMetrics).click();

      cy.readFile(
        "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json"
      ).then((file) => {
        cy.get(riskApp.addRiskAppetiteForm.selectRiskItem)
          .contains("label", file.riskCategory.categoryName)
          .find("span")
          .first()
          .click();

        cy.get(riskApp.addRiskAppetiteForm.saveBtn).click();

        cy.get(riskApp.searchStatement)
          .wait(500)
          .clear()
          .wait(500)
          .type(appetiteStatement);

        cy.wait(1500);

        cy.get(riskApp.editRiskAppetite).click();

        cy.get(riskApp.addRiskAppetiteForm.selectRiskItem)
          .contains("label", file.riskCategory.categoryName)
          .find("span")
          .first()
          .click();
      });

      cy.get(riskApp.addRiskAppetiteForm.saveBtn).click();

      cy.get(riskApp.addBtn).click();

      cy.get(riskApp.addRiskAppetiteForm.statement).type(appetiteStatement);

      cy.get(riskApp.addRiskAppetiteForm.metrics.searchName).type(
        riskAppetite.riskAppetite.metrics.name
      );

      cy.wait(1500);

      cy.get(riskApp.addRiskAppetiteForm.metrics.linkMetrics).click();

      cy.get(riskApp.addRiskAppetiteForm.saveBtn).click();
    }
  );

  it("Instead of creating a new record, the existing record with isDeleted marked as false should be considered.", () => {
    let appetiteStatement = riskAppetite.riskAppetite.statement;
    const riskApp = locators.risk.riskAppetite;

    cy.visit(Cypress.config("baseUrl"));
    cy.login(
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );

    // Navigate to Risk Appetite
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.riskAndControlRegister).click();
    cy.get(locators.menu.riskAppetite).click();

    cy.get(riskApp.addBtn).click();

    cy.createRandomString(10).then((str) => {
      cy.get(riskApp.addRiskAppetiteForm.statement).type(
        riskAppetite.riskAppetite.statement + str
      );
      appetiteStatement = appetiteStatement + str;
    });

    cy.get(riskApp.addRiskAppetiteForm.metrics.searchName).type(
      riskAppetite.riskAppetite.metrics.name
    );

    cy.wait(1500);

    cy.get(riskApp.addRiskAppetiteForm.metrics.linkMetrics).click();

    cy.readFile(
      "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json"
    ).then((file) => {
      cy.get(riskApp.addRiskAppetiteForm.selectRiskItem)
        .contains("label", file.riskCategory.categoryName)
        .find("span")
        .first()
        .click();

      cy.get(riskApp.addRiskAppetiteForm.saveBtn).click();

      cy.get(riskApp.searchStatement)
        .wait(500)
        .clear()
        .wait(500)
        .type(appetiteStatement);

      cy.wait(1500);

      cy.get(riskApp.editRiskAppetite).click();

      cy.get(riskApp.addRiskAppetiteForm.selectRiskItem)
        .contains("label", file.riskCategory.categoryName)
        .find("span")
        .first()
        .click();
    });

    cy.get(riskApp.addRiskAppetiteForm.saveBtn).click();

    cy.get(riskApp.addBtn).click();

    cy.get(riskApp.addRiskAppetiteForm.statement).type(appetiteStatement);

    cy.get(riskApp.addRiskAppetiteForm.metrics.searchName).type(
      riskAppetite.riskAppetite.metrics.name
    );

    cy.wait(1500);

    cy.get(riskApp.addRiskAppetiteForm.metrics.linkMetrics).click();

    cy.get(riskApp.addRiskAppetiteForm.saveBtn).click();
  });
});
