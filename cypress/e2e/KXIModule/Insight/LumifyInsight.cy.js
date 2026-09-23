import LumifyInsight from "../../../support/POM/KXIModule/Insight/LumifyInsight";

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

      it("Verify new Insight screen will be shown when access Insights if user has only KXI module(Lumify)", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.verifyURL(false);
        lumifyInsight.verifySubHeaderTitle();
        lumifyInsight.verifyBreadCrumb();
      });

      it("Verify Three ellipses option should be displayed on the top right of the Insight screen.", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.verifyEllipsesBtnVisible();
      });

      it("Verify three ellipses should have Import, Export and Add Risk Category options.", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.verifyEllipsesMenu();
        lumifyInsight.verifyEllipsesMenuIcons();
      });

      it("Verify that Risk Applicability should not be a part of Standalone Risk Insight Module", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.verifyRiskApplicabilityNotExist();
      });

      it("Verify remove all risk related columns from Insight screen for Lumify.", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.verifyGridHeaderCells(false);
      });

      it("Verify Insight screen must not have these columns Inherent Risk, Residual Risk, Current Risk, BU, BA, Management comments and Relative Magnitude on Insight screen", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.verifyRiskColNotPresent();
      });

      it("Verify Insight screen should have column picker on grid.", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.verifyColPicker();
        lumifyInsight.verifyColFilter();
      });

      it("Verify user is able to add category from Three Ellipses for Lumify", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.resetSearchState();
        lumifyInsight.clickAddCategoryTopEllises();
        lumifyInsight.typeCategoryName(true);
        lumifyInsight.resetSearchState();
        lumifyInsight.verifyNewMainCategory();
        lumifyInsight.resetSearchState();
      });

      it("Verify Add Sub Category option for each category on Risk Insight Screen for Lumify", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.resetSearchState();
        lumifyInsight.verifyAddSubCategoryActionBtn();
      });

      it("Verify user is able to add Sub Category from Category row option for Lumify", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.resetSearchState();
        lumifyInsight.clickAddCategoryTopEllises();
        lumifyInsight.typeCategoryName(true);
        lumifyInsight.resetSearchState();
        lumifyInsight.verifyNewMainCategory();
        lumifyInsight.clickAddCategoryActionBtn();
        lumifyInsight.typeCategoryName(false);
        lumifyInsight.resetSearchState();
        lumifyInsight.verifyNewSubCategory(false);
        lumifyInsight.resetSearchState();
      });

      it("Verify on Insight screen data will be grouped by risk categories. ", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.verifyGroupColHeaders();
      });

      it("Verify Create KXI Definition and Link KXI Definition buttons will be shown in sub-grid on KXI column on Insight screen for Lumify.", () => {
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.resetSearchState();
        lumifyInsight.clickKXIExpandBtn();
        lumifyInsight.verifyKXISubGrid();
      });
    });

    context("State Persist case", () => {
      it("Verify Insight screen should have state persist functionality for Lumify.", () => {
        const withoutRM = Cypress.env("kxi").customer.withoutRM;
        cy.visit(Cypress.config("baseUrl"));
        cy.login(withoutRM.username, withoutRM.password, withoutRM.key);
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.setColFilter_StatePersist();
        cy.logout();
        cy.login(withoutRM.username, withoutRM.password, withoutRM.key);
        lumifyInsight.navigateToInsightScreen();
        lumifyInsight.verifyColFilter_StatePersist();
      });
    });

    context("ERM user", { tags: ["@withRM"] }, () => {
      const withRM = Cypress.env("kxi").customer.withRM;
      beforeEach(() => {
        cy.session("login - " + withRM.username, () => {
          cy.visit(Cypress.config("baseUrl"));
          cy.login(withRM.username, withRM.password, withRM.key);
        });
      });

      it("Verify remove all risk related columns from Insight screen for ERM.", () => {
        lumifyInsight.navigateToInsightScreen_ERM();
        lumifyInsight.verifyGridHeaderCells(true);
      });
    });
  }
);
