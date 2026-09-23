import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import NewFilters from "../../../support/POM/RegChangeManagementV2-Decisions/NewFilters";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Jira/RegChangeMenu.json";
import filter from "../../../fixtures/RegChangeManagementV2-Decisions/NewFiltersData.json";
import FeedRegister from "../../../support/POM/RegChangeManagementV2-Decisions/FeedRegister";

describe(
  "Option to View Saved Filter and Delete Filter / Unpin Filter.",
  {
    tags: [
      "@regression",
      "@pd21552",
      "@jira",
      "@regchange",
      "@regchangefeedregister",
      "@release5.21",
      "@predict",
      "@customer",
    ],
  },
  () => {
    const regchangeV2Menu = new RegChangeV2Menu();
    const newFilters = new NewFilters();
    const regchangeUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
    const noPin = Cypress.env("REG_CHANGE_V2").CUSTOMER2;
    const filePath =
      "cypress/fixtures/RegChangeManagementV2-Decisions/FilterName.json";
    context("RegChange Feed Register", () => {
      beforeEach(() => {
        cy.clearAllCookies();
        cy.ignoreNetworkLogs();
        cy.loginWithSession(
          "Reg Change Feed Register User session",
          regchangeUser.USERNAME,
          regchangeUser.PASSWORD,
          regchangeUser.KEY
        );
        regchangeV2Menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.feedRegister
        );
      });
      it(
        "Verify that the View button is displayed next to the Saved Filter dropdown and clicking it opens the View filter modal if it has pin permission then it should have a 'Delete' button, allowing the user to remove it",
        {
          tags: [
            "@pd36348",
            "@pd36349",
            "@pd36350",
            "@pd36351",
            "@pd36352",
            "@pd36354",
          ],
        },
        () => {
          cy.createRandomString(3).then((randomString) => {
            newFilters.createNewFilter(
              filter.pinFilter + randomString,
              true,
              false
            );
          });
          cy.readFile(filePath).then((file) => {
            cy.reload();
            newFilters.verifyViewButton(file.filterName, true);
          });
        }
      );
      it(
        "Users should be able to unpin multiple saved filters (as per role/permission defined) by selecting checkboxes and clicking the 'Unpin Saved Filter' button.",
        { tags: ["@pd36355", "@pd36357"] },
        () => {
          cy.createRandomString(3).then((randomString) => {
            newFilters.createNewFilter(
              filter.pinFilter + randomString,
              true,
              false
            );
          });
          cy.readFile(filePath).then((file) => {
            cy.reload();
            newFilters.verifyViewButton(file.filterName);
          });
        }
      );
    });

    context("Login with user who has no pin permission", () => {
      it("Users should not have access to delete and pin/Unpin Filters.", () => {
        cy.visit(Cypress.config("baseUrl"));
        cy.login(noPin.USERNAME, noPin.PASSWORD, noPin.KEY);
        regchangeV2Menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.feedRegister
        );
        cy.createRandomString(3).then((randomString) => {
          newFilters.createNewFilter(
            filter.pinFilter + randomString,
            true,
            false
          );
        });
        cy.readFile(filePath).then((file) => {
          cy.reload();
          newFilters.verifyViewButton(file.filterName, false, true);
        });
      });
    });
  }
);
