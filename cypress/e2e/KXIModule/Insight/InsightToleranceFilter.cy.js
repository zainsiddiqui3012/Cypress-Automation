import LumifyInsight from "../../../support/POM/KXIModule/Insight/LumifyInsight";
import dataFile from "../../../fixtures/KXIModule/Insight/InsightToleranceFilter.json";

describe(
  "Risk Insight Module (Lumify) without ERM - PD-19376",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@insight",
      "@pd22243",
      "@release5.17",
      "@customer",
    ],
  },
  () => {
    const lumifyInsight = new LumifyInsight();
    context("LUMIFY user", { tags: ["@withoutRM"] }, () => {
      const withoutRM = Cypress.env("kxi").customer.withoutRM;
      beforeEach(() => {
        cy.loginWithSession(
          "login - " + withoutRM.username,
          withoutRM.username,
          withoutRM.password,
          withoutRM.key
        );
      });

      it("Verify all positive up and down values should filter and display on risk insight grid when All Values filter is selected on risk insight.", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.selectToleranceFilter(dataFile.toleranceFilter.all);
        lumifyInsight.verifyToleranceFilterValues(dataFile.toleranceFilter.all);
        lumifyInsight.verifyToleranceFilterGrid(dataFile.toleranceFilter.all);
      });

      it("Verify risk categories and instances that have KxI definitions with positive up & down values linked will display when select out of tolerance positive filter on risk insight screen.", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.selectToleranceFilter(dataFile.toleranceFilter.positive);
        lumifyInsight.verifyToleranceFilterValues(
          dataFile.toleranceFilter.positive
        );
        lumifyInsight.verifyToleranceFilterGrid(
          dataFile.toleranceFilter.positive
        );
      });

      it("Verify risk categories and instances that have KxI definitions with negative up & down values linked will display when select out of tolerance negative filter on risk insight screen.", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.selectToleranceFilter(dataFile.toleranceFilter.negative);
        lumifyInsight.verifyToleranceFilterValues(
          dataFile.toleranceFilter.negative
        );
        lumifyInsight.verifyToleranceFilterGrid(
          dataFile.toleranceFilter.negative
        );
      });

      it("Verify risk categories and instances that have KxI definitions with both positive up & down and negative up & down values linked will display when select out of tolerance filter on risk insight screen.", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.selectToleranceFilter(dataFile.toleranceFilter.zero);
        lumifyInsight.verifyToleranceFilterValues(
          dataFile.toleranceFilter.zero
        );
        lumifyInsight.verifyToleranceFilterGrid(dataFile.toleranceFilter.zero);
      });
    });
  }
);
