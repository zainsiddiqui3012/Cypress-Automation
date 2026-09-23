import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import NewFilters from "../../../support/POM/RegChangeManagementV2-Decisions/NewFilters";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Jira/RegChangeMenu.json";
import filter from "../../../fixtures/RegChangeManagementV2-Decisions/NewFiltersData.json";

describe(
  "Option to Create new Filter.",
  {
    tags: [
      "@regression",
      "@pd21550",
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
        cy.visit(Cypress.config("baseUrl"));
      });

      it(
        "Verify 'Create New' button and Add Pin filter",
        { tags: ["@pd35991", "@pd35992", "@pd35993"] },
        () => {
        cy.login(
            regchangeUser.USERNAME,
            regchangeUser.PASSWORD,
            regchangeUser.KEY
          );
          regchangeV2Menu.navigateToScreen(
            regChangeMenu.regulatoryChangeManagement.feedRegister
          );
          newFilters.createNewFilter(filter.pinFilter, true, false);
          cy.readFile(filePath).then((file) => {
            newFilters.verifyFilterInSelectFilterDropdown(file.filterName);
          });
        }
      );

      it(
        "Verify If a filter is pinned, it should be visible to all users.",
        { tags: "@pd35994" },
        () => {
        cy.login(
            noPin.USERNAME,
            noPin.PASSWORD,
            noPin.KEY
          );
          regchangeV2Menu.navigateToScreen(
            regChangeMenu.regulatoryChangeManagement.feedRegister
          );
          cy.readFile(filePath).then((file) => {
            newFilters.verifyFilterInSelectFilterDropdown(file.filterName);
          });
        }
      );
      it(
        "Add UnPin filter",
        { tags: ["@pd35991", "@pd35992", "@pd35993"] },
        () => {
        cy.login(
            regchangeUser.USERNAME,
            regchangeUser.PASSWORD,
            regchangeUser.KEY
          );
          regchangeV2Menu.navigateToScreen(
            regChangeMenu.regulatoryChangeManagement.feedRegister
          );
          newFilters.createNewFilter(filter.unpinFilter, false, false);
          cy.readFile(filePath).then((file) => {
            newFilters.verifyFilterInSelectFilterDropdown(file.filterName);
          });
        }
      );
      it(
        "Verify If a filter is not pinned, it should not be visible to all users.",
        { tags: "@pd35996" },
        () => {
        cy.login(
            noPin.USERNAME,
            noPin.PASSWORD,
            noPin.KEY
          );
          regchangeV2Menu.navigateToScreen(
            regChangeMenu.regulatoryChangeManagement.feedRegister
          );
          cy.readFile(filePath).then((file) => {
            newFilters.verifyFilterInSelectFilterDropdown(file.filterName);
          });
        }
      );

      it(
        "Verify when user give same Input in Name Field of 'Create New' modal. it should give validation message",
        { tags: "@pd36002" },
        () => {
        cy.login(
            noPin.USERNAME,
            noPin.PASSWORD,
            noPin.KEY
          );
          regchangeV2Menu.navigateToScreen(
            regChangeMenu.regulatoryChangeManagement.feedRegister
          );
          cy.readFile(filePath).then((file) => {
            newFilters.createNewFilter(null, false, false, file.filterName);
          });
        }
      );
      it(
        "Verify 'Name' field of 'Create New' modal should be mandatory",
        { tags: "@pd35997" },
        () => {
        cy.login(
            noPin.USERNAME,
            noPin.PASSWORD,
            noPin.KEY
          );
          regchangeV2Menu.navigateToScreen(
            regChangeMenu.regulatoryChangeManagement.feedRegister
          );

          newFilters.createNewFilter(null, true, true);
        }
      );
    
    });
  }
);
