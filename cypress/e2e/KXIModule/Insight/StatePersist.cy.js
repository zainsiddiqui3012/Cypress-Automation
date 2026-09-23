import LumifyInsight from "../../../support/POM/KXIModule/Insight/LumifyInsight";

describe(
  "Risk Insight State Persistent for Lumify",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@insight",
      "@pd22281",
      "@release5.17",
      "@customer",
    ],
  },
  () => {
    const lumifyInsight = new LumifyInsight();

    context(
      "Verify State persist without Logout cases",
      { tags: ["@withoutRM"] },
      () => {
        const withoutRM = Cypress.env("kxi").customer.withoutRM;
        beforeEach(() => {
          cy.loginWithSession(
            "login - " + withoutRM.username,
            withoutRM.username,
            withoutRM.password,
            withoutRM.key
          );
        });

        it.skip("Verify state persist if user adds column(s) in grid from columns picker.", () => {
          lumifyInsight.navigateToInsightScreen();
        });

        it("Verify state should persist on refreshing the page on Insights screen.", () => {
          lumifyInsight.navigateToInsightScreen();
          lumifyInsight.setColFilter_StatePersist();
          cy.reload();
          lumifyInsight.verifyColFilter_StatePersist();
        });

        it.skip("Verify state should persist on Insights screen if user changes the order of grid column(s).", () => {
          lumifyInsight.navigateToInsightScreen();
        });

        it.skip("Verify state should persist if user creates row grouping view on Insights screen.", () => {
          lumifyInsight.navigateToInsightScreen();
        });

        it("Verify state should persist if user has typed any word in risk hierarchy column or any other and on refreshing the page it should display the typed word.", () => {
          lumifyInsight.navigateToInsightScreen();
          lumifyInsight.resetSearchState();
          lumifyInsight.typeCategoryName_StatePersist(true);
          cy.wait(1500).reload();
          lumifyInsight.verifySearchValue_StatePersist(true);
          lumifyInsight.resetSearchState();
        });

        it.skip("Verify state should persist on Insights if user has applied  Expand or Collapse All Row Groups filter of ag grid", () => {
          lumifyInsight.navigateToInsightScreen();
        });
      }
    );

    context(
      "Verify State persist with Logout cases",
      { tags: ["@withoutRM"] },
      () => {
        it("Verify state should persist on Insights screen even if user logout and relogins into the customer space.", () => {
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
      }
    );
  }
);
