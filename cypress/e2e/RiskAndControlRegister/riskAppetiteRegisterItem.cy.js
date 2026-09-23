/// <reference types="../../support" />

import riskAppetite from "../../fixtures/RiskAndControlRegister/RiskAppetite/riskAppetite.json";
import locators from "../../fixtures/locators.json";

import RiskAndControlRegister from "../../support/POM/RiskAndControlRegister/riskAndControlRegister";
import RiskAppetite from "../../support/POM/RiskAndControlRegister/riskAppetite";
const username = Cypress.env("username");

const riskAppetiteFixtureFilePath =
  "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json";

describe("RiskAppetiteRegisterItem-Add createdBy, createdOn, modifiedBy, modifiedOn and isDeleted fields - 20586", () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.session("login session of user: " + username, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(username, Cypress.env("password"), Cypress.env("key"));
    });
  });

  const riskAndControlRegister = new RiskAndControlRegister();
  const riskApp = new RiskAppetite();
  // The RiskAppetiteRegisterItem entity should be updated to include createdBy, createdOn, modifiedBy, modifiedOn and isDeleted fields
  riskAppetite.fields.forEach((dbFieldTest) => {
    it(dbFieldTest.name, () => {
      cy.query(riskAppetite.showColQuery).then((res) => {
        let isFound = false;
        res.forEach((element) => {
          if (element.Field === dbFieldTest.fieldName) {
            isFound = true;
            console.log("found field " + element.Field);
          }
        });

        expect(isFound).to.be.true;
      });
    });
  });

  it("Create Prerequisite for RiskAppetiteRegisterItem-Add createdBy, createdOn, modifiedBy, modifiedOn and isDeleted fields - 20586", () => {
    riskAndControlRegister.navigateToTaxnomyAndAddRiskCategory(riskAppetite);

    riskAndControlRegister.navigateToTaxonomyAndAddRiskDefinition(riskAppetite);

    cy.visitRiskAppetite();

    riskApp.addRiskAppetite(riskAppetite.riskAppetite[0], false);
  });

  it("The system should display only active records to users, and any required actions should be performed on active records. - Risk Metric Number", () => {
    cy.query(riskAppetite.selectAppetite).then((res) => {
      console.log(res[0]);

      cy.visitRiskAppetite();

      // riskApp.addRiskAppetite(riskAppetite.riskAppetite[0], false);

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

  it("When isDeleted is set to true, the system should appropriately handle the visibility and actions related to the records.", () => {
    cy.visitRiskAppetite();

    riskApp.addRiskAppetite(riskAppetite.riskAppetite[0], false);

    riskApp.editAppetiteAndRemoveCat(riskAppetite.riskAppetite[0]);

    cy.query(riskAppetite.riskAppetiteRegisterItem).then((res) => {
      expect(res[0].isDeleted.data[0]).to.eq(1);
    });
  });

  it("Active records should be presented to users for interaction.", () => {
    cy.visitRiskAppetite();

    cy.query(riskAppetite.selectAppetite).then((res) => {
      res.forEach((value, index, list) => {
        const statement = value.statement;

        cy.get(locators.risk.riskAppetite.searchStatement)
          .wait(500)
          .clear()
          .wait(500)
          .type(statement);

        cy.get(locators.risk.riskAppetite.riskAppetiteStatement).should(
          "include.text",
          statement
        );
      });
    });
  });

  it("If a mapping exists with isDeleted set to true, the system should prevent the creation of a new record with similar data.", () => {
    cy.visitRiskAppetite();

    riskApp.addRiskAppetite(riskAppetite.duplicateAppetite, false);

    riskApp.addRiskAppetite(riskAppetite.duplicateAppetite, true);
  });

  it("Instead of creating a new record, the existing record with isDeleted marked as false should be considered.", () => {
    cy.visitRiskAppetite();

    riskApp.addRiskAppetite(riskAppetite.riskAppetite[0], false);

    riskApp.editAppetiteAndRemoveCat(riskAppetite.riskAppetite[0]);

    riskApp.addRiskAppetite(riskAppetite.riskAppetite[0], true);
  });

  it("The createdBy and createdOn fields should accurately reflect the user who created the record and the timestamp of its creation.", () => {
    cy.visitRiskAppetite();

    riskApp.addRiskAppetite(riskAppetite.riskAppetite[0], false);
    cy.readFile(riskAppetiteFixtureFilePath).then((file) => {
      cy.query(
        riskAppetite.query.predictuser.pre +
          username +
          riskAppetite.query.predictuser.post
      ).then((result) => {
        console.log(result);

        cy.query(
          riskAppetite.query.createdBy.pre +
            file.statement +
            riskAppetite.query.createdBy.mid +
            result[0].id +
            riskAppetite.query.createdBy.post
        ).then((secondResult) => {
          expect(secondResult[0].createdBy).to.eq(Cypress.env("USER_ID"));
        });
      });
    });
  });

  it("The modifiedBy and modifiedOn fields should be updated whenever modifications are made to the record.", () => {
    cy.visitRiskAppetite();

    riskApp.addRiskAppetite(riskAppetite.riskAppetite[0], false);

    riskApp.editAppetiteAndRemoveCat(riskAppetite.riskAppetite[0]);

    riskApp.editAppetiteAndRemoveCat(riskAppetite.riskAppetite[0]);

    cy.readFile(riskAppetiteFixtureFilePath).then((file) => {
      cy.query(
        riskAppetite.query.predictuser.pre +
          username +
          riskAppetite.query.predictuser.post
      ).then((result) => {
        console.log(result);
        cy.query(
          riskAppetite.query.modifiedBy.pre +
            file.statement +
            riskAppetite.query.modifiedBy.mid +
            result[0].id +
            riskAppetite.query.modifiedBy.post
        ).then((res) => {
          console.log(res);
          expect(res[0].modifiedBy).to.eq(Cypress.env("USER_ID"));
        });
      });
    });
  });

  it("The system should display only active records to users, and any required actions should be performed on active records  - Risk Metric Percentage", () => {
    cy.query(riskAppetite.selectAppetite).then((res) => {
      cy.visitRiskAppetite();
      res.forEach((value, index, list) => {
        cy.get(locators.risk.riskAppetite.searchStatement)
          .clear()
          .wait(500)
          .type(value.statement)
          .wait(1000);

        cy.get(locators.risk.riskAppetite.riskAppetiteStatement).should(
          "include.text",
          value.statement
        );
      });
    });
  });
});
