import RiskAppetite from "../../../support/POM/KXIModule/RiskAppetite/RiskAppetite";
import dataFile from "../../../fixtures/RiskAppetite/RiskAppetite.json";
import { KriMyTaxonomy } from "../../../support/POM/RiskModule_PO/KriMyTaxonomy";
const kri = new KriMyTaxonomy();
let kxiApplicable, kxiNotApplicable, kxiPartialNotApplicable, riskCatName;
let localTimeConvert = "sample time";

const writeDataFilePath =
  "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json";
describe(
  "Risk Appetite for KxI without Risk Management",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@risk-appetite",
      "@predict",
      "@customer",
    ],
  },
  () => {
    beforeEach(() => {
      cy.loginWithSession(
        `login - without RM User`,
        Cypress.env("kxi").customer.withoutRM.username,
        Cypress.env("kxi").customer.withoutRM.password,
        Cypress.env("kxi").customer.withoutRM.key
      );
      cy.visitRiskAppetite();
      cy.waitForTopMsgLoaderToDisappear(100000);
    });
    before(() => {
      const ownerName = Cypress.env("kxi").customer.withoutRM.username;
      cy.ignoreNetworkLogs();
      cy.loginWithSession(
        `login - without RM User in Before Hook`,
        Cypress.env("kxi").customer.withoutRM.username,
        Cypress.env("kxi").customer.withoutRM.password,
        Cypress.env("kxi").customer.withoutRM.key
      );
      cy.visitkxiDef();
      kri.createKxiDefinitionTrigger("kxi Def ", ownerName).then(() => {
        kxiApplicable = kri.getSharedData("generatedKxiName");
      });

      kri
        .createKxiDefinitionWithoutTrigger("kxi Def without Trigger ", ownerName)
        .then(() => {
          kxiNotApplicable = kri.getSharedData("generatedKxiName");
        });

      kri
        .createKxiDefinitionPartialNotApplicable("kxi Def Partial ", ownerName)
        .then(() => {
          kxiPartialNotApplicable = kri.getSharedData("generatedKxiName");
        });
    });

  describe(
      "Risk Appetite for KxI without Risk Management",
      { tags: ["@withRM"] },
      () => {
        const riskAppetite = new RiskAppetite();
        const withoutRM = Cypress.env("kxi").customer.withoutRM;

        it(
          "Verify that Risk Appetite Statements are displayed correctly",
          { tags: ["@pd38704", "@pd38705", "@pd38729"] },
          () => {
            riskAppetite.addAppetiteBtn();
            riskAppetite.fillAddRiskAppetiteForm(dataFile.name);
            cy.waitForTopMsgLoaderToDisappear(100000);
            const metricApplicable = riskAppetite.addMetric(
              "Applicable",
              kxiApplicable,
              "applicable"
            );
            const metricNotApplicable = riskAppetite.addMetric(
              "notApplicable",
              kxiNotApplicable,
              "notApplicable"
            );
            const metricPartialNotApplicable = riskAppetite.addMetric(
              "partialApplicable",
              kxiPartialNotApplicable,
              "partialNotApplicable"
            );
            riskAppetite.searchAndLinkMetric(metricApplicable);
            riskAppetite.saveAppetite();
            cy.readFile(writeDataFilePath).then((file) => {
              riskAppetite.searchStatement(file.statement, dataFile.status[0]);
            });
            cy.reload();
            riskAppetite.searchMetricInGrid(metricApplicable);
          }
        );

        it(
          "Verify that Status can be marked as Active/Inactive",
          {
            tags: ["@pd38709", "@pd38714", "@pd38715", "@pd38716", "@pd38722"],
          },
          () => {
            riskAppetite.editAppetiteChangeStatus();

            cy.readFile(writeDataFilePath).then((file) => {
              riskAppetite.searchStatement(file.statement, dataFile.status[1]);
            });
          }
        );
        it(
          "Verify that the system prevents duplicate entries",
          { tags: "@pd38725" },
          () => {
            riskAppetite.addRiskAppetite(null, true);
          }
        );
        it(
          "Verify the Character length of Statement Description",
          { tags: ["@pd38727", "@pd38736"] },
          () => {
            riskAppetite.addAppetiteBtn();
            riskAppetite.validateStatementLength();
          }
        );
        it("Verify Mandatory Fields", { tags: "@pd38734" }, () => {
          riskAppetite.addAppetiteBtn();

          riskAppetite.validateMandatoryFields();
        });
        it(
          "Verify the Character length of Qualitative Matrix",
          { tags: ["@pd38728", "@pd38737"] },
          () => {
            riskAppetite.addAppetiteBtn();
            riskAppetite.validateQualitativeMatrixLength();
          }
        );

        it(
          "Verify that user can delete a Risk Appetite Statement",
          { tags: "@pd38712" },
          () => {
            cy.readFile(writeDataFilePath).then((file) => {
              riskAppetite.searchStatement(file.statement, dataFile.status[1]);
              riskAppetite.deleteRiskAppetite();
            });
          }
        );
        it(
          "Verify the Character length of Statement",
          { tags: ["@pd38726", "@pd38735"] },
          () => {
            riskAppetite.addAppetiteBtn();
            riskAppetite.validateStatementLength();
          }
        );
        it("Verify matrix should be deleted", () => {
          riskAppetite.addAppetiteBtn();
          cy.createRandomString(3).then((name) => {
            const metricApplicable = riskAppetite.addMetric(
              "Applicable" + name,
              kxiApplicable,
              "applicable"
            );
            riskAppetite.searchAndLinkMetric(metricApplicable);

            riskAppetite.deleteMatrix();
          });
        });
        it(
          "Verify matrix should be edited and Add Kxi Definition",
          {
            tags: [
              "@pd38742",
              "@pd38739",
              "@pd38741",
              "@pd38743",
              "@pd38744",
              "@pd38745",
              "@pd38746",
              "@pd38747",
              "@pd38748",
              "@pd38749",
              "@pd38750",
              "@pd38751",
              "@pd38752",
              "@pd38753",
            ],
          },
          () => {
            riskAppetite.addAppetiteBtn();
            cy.createRandomString(3).then((name) => {
              const metricNotApplicable = riskAppetite.addMetric(
                "notApplicable" + name,
                kxiNotApplicable,
                "notApplicable"
              );
              riskAppetite.searchAndLinkMetric(metricNotApplicable);
              riskAppetite.editMatrix(withoutRM.username);
            });
          }
        );
        it(
          "Verify Mandatory Fields on Matrix modal",
          { tags: "@pd38755" },
          () => {
            riskAppetite.addAppetiteBtn();
            riskAppetite.verifyMandatoryFieldsONMatrix();
          }
        );
      }
    );
  }
);
