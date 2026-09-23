import dataFile from "../../../fixtures/RegChangeManagementV2-Decisions/FeedRegister.json";
import FeedRegister from "../../../support/POM/RegChangeManagementV2-Decisions/FeedRegister";
import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Decisions/RegChangeMenu.json";

describe(
  "AG Grid View for Reg Feed and display Reg Feed in Columns and apply filtering on Columns.",
  {
    tags: [
      "@regression",
      "@pd21544",
      "@cms",
      "@regchangev2",
      "@feedregister",
      "@release5.21",
      "@predict",
    ],
  },
  () => {
    const feedregister = new FeedRegister();
    const menu = new RegChangeV2Menu();
    context(
      dataFile.feedRegisterHeading,
      { tags: ["@customer", "@pd31272"] },
      () => {
        beforeEach(() => {
          const customerUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
          cy.loginWithSession(
            "Login with Reg Change V2 customer user",
            customerUser.USERNAME,
            customerUser.PASSWORD,
            customerUser.KEY
          );
          menu.navigateToScreen(
            regChangeMenu.regulatoryChangeManagement.feedRegister
          );
        });
        it(
          "Verify Regulatory change feed should be displayed on Regulatory Change Feed Register",
          { tags: ["@pd31273"] },
          () => {
            feedregister.verifyFeedHeading(dataFile.feedRegisterHeading);
          }
        );
        it(
          "Verify The Regulatory Change Feed Register should show the Reg Feed AG Grid and have columns",
          { tags: ["@pd31276"] },
          () => {
            feedregister.verifyAgGridAndColumns();
          }
        );
        it(
          "Verify The Regulatory Change Feed Register should show the Reg Feed AG Grid and have filter columns",
          { tags: ["@pd31367"] },
          () => {
            feedregister.verifyAgGridFilters();
          }
        );
        it(
          "Verify By default,the (New or Updated flags equal to true) in General Filter above the Reg change Feed Register should be selected.",
          { tags: ["@pd31363"] },
          () => {
            feedregister.verifyGeneralFilters();
          }
        );
        it(
          "Verify Every Reg Feed Column should have correct type",
          { tags: ["@pd31368"] },
          () => {
            feedregister.verifyFilterTypes();
          }
        );
        it(
          "Verify Information should be displayed  correctly in the columns which should fetch from the Reg Feed Table in Database",
          { tags: ["@pd31357"] },
          () => {
            dataFile.title.forEach(($title) => {
              menu.navigateToScreen(
                regChangeMenu.regulatoryChangeManagement.feedRegister
              );
              feedregister.searchTitleInGrid($title);
              feedregister.fetchDBData();
            });
          }
        );
        it(
          "Provide Icon to open chat with “Regulatory AI Companion”.",
          { tags: ["@pd21553", "@31940", "@31941"] },
          () => {
            feedregister.verifyChatWindow();
          }
        );
      }
    );
  }
);
