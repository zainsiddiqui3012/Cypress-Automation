import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import NewFilters from "../../../support/POM/RegChangeManagementV2-Decisions/NewFilters";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Jira/RegChangeMenu.json";
import filter from "../../../fixtures/RegChangeManagementV2-Decisions/NewFiltersData.json";
import FeedRegister from "../../../support/POM/RegChangeManagementV2-Decisions/FeedRegister";

describe(
  "Option to Display Saved Filter and Save Existing Filter. ",
  {
    tags: [
      "@regression",
      "@pd21551",
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
    const feedRegister = new FeedRegister();
    const regchangeUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
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
        "Verify 'Saved Filter Dropdown' should be located at the top of the Reg Change Feed Register Grid.",
        { tags: ["@pd36262", "@pd36263", "@pd36264"] },
        () => {
          feedRegister.searchTitleInGrid("title");
         
          cy.readFile(filePath).then((file) => {
            cy.reload();
            newFilters.verifyFilterInSelectFilterDropdown(file.filterName);
            newFilters.saveButtonFunctionality(true, file.filterName);
          });
        }
      );
      it(
        "Verify 'Save' button should be positioned beside the Saved Filter Dropdown at the top of the Reg Change Feed Register Grid",
        { tags: ["@pd36265","@pd36267","@pd36268"] },
        () => {
          newFilters.saveButtonFunctionality();
          cy.readFile(filePath).then((file) => {
            newFilters.saveButtonFunctionality(false, file.filterName, true);
          });
        }
      );
    });
  }
);
