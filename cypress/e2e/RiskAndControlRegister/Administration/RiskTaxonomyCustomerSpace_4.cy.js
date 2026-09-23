import {
  RiskCategory,
  RiskDefinition,
  RiskTaxonomy,
  RiskTaxonomyFilterAndDelete,
} from "../../../support/POM/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.js";
import ValidationHelper from "../../../support/POM/RiskAndControlRegister/Administration/helpers/ValidationHelper.js";
import UIHelper from "../../../support/POM/RiskAndControlRegister/Administration/helpers/UIHelper.js";
import locators from "../../../fixtures/locators.json";
const writeDataFilePath =
  "cypress/fixtures/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.json";
const filterAndDelete = new RiskTaxonomyFilterAndDelete();
const riskCategory = new RiskCategory();
const riskDefinition = new RiskDefinition();
const riskTaxonomy = new RiskTaxonomy();

describe(
  "Risk Taxonomy - Filter and Delete Operations",
  {
    tags: ["@risk-management", "@filter", "@delete", "@regression","@pd36730"],
  },
  () => {
    const session = () => {
      const withRM = Cypress.env("kxi").customer.withRM;
      cy.loginWithSession(
        "login with Risk Management User",
        withRM.username,
        withRM.password,
        withRM.key
      );
      cy.visitRiskTaxonomies();
    };
    context(
      "Filter Operations",
      {
        tags: ["@filter", "@positive"],
      },
      () => {
        beforeEach(() => {
          session();
        });
        it("Clear All Search Field", () => {
          riskTaxonomy.clearSearches(0);
          riskTaxonomy.clearSearches(1);
          riskTaxonomy.clearSearches(2);
        });

        it(
          "Filter by Name - should display only matching categories/definitions",
          {
            tags: ["@filter-name", "@positive"],
          },
          () => {
            filterAndDelete.getFilterTestScenarios().then((scenarios) => {
              filterAndDelete.filterByName(scenarios.validName);
              riskDefinition.expandRiskCategory();
              filterAndDelete.verifyFilterResults(scenarios.validName);
            });
          }
        );

        it(
          "Filter by Business Area Definition - should display only matching rows",
          {
            tags: ["@filter-business-area", "@positive"],
          },
          () => {
            cy.readFile(writeDataFilePath).then((data) => {
              const riskDefinitionData = data.riskDefinition.add;

              filterAndDelete
                .filterByBusinessArea(
                  riskDefinitionData.filterBusinessAreaDefinition
                )
                .filterByName(riskDefinitionData.name)
                .verifyFilterResults(riskDefinitionData.name);
            });
          }
        );

        it(
          "Filter by Risk Definition ID - should display matching definitions",
          {
            tags: ["@filter-risk-id", "@positive"],
          },
          () => {
            cy.readFile(writeDataFilePath).then((data) => {
              const riskDefData = data.riskDefinition.add;

              filterAndDelete
                .filterByRiskDefinitionId(riskDefData.riskDefinitionId)
                .verifyFilterResults(riskDefData.riskDefinitionId);
            });
          }
        );

        it.skip(
          "Filter by Status = Active - should display only active rows",
          {
            tags: ["@filter-status", "@positive"],
          },
          () => {
            cy.readFile(writeDataFilePath).then((data) => {
              filterAndDelete
                .filterByStatus("Active")
                .filterByName(data.riskDefinition.add.name)
                .verifyFilterResults("Active")
                .clearAllFilters();
            });
          }
        );
      }
    );

    context(
      "Delete Operations",
      {
        tags: ["@delete"],
      },
      () => {
        beforeEach(() => {
          session();
        });

        it(
          "Delete Risk Definition - successful deletion",
          {
            tags: ["@delete-definition", "@positive"],
          },
          () => {
            cy.readFile(writeDataFilePath).then((data) => {
              const definitionName = data.riskDefinition.add.name;
              UIHelper.verifyTextContent(
                locators.general.gridName,
                definitionName,
                1
              );
              riskCategory.clickEditIconForCategory();
              // Delete the definition
              filterAndDelete
                .deleteRiskDefinition(true)
                .verifyItemDeleted(definitionName);
            });
          }
        );

        it("Clear All Search Field", () => {
          riskTaxonomy.clearSearches(0);
          riskTaxonomy.clearSearches(1);
          riskTaxonomy.clearSearches(2);
        });

        it(
          "Delete Risk Category - successful deletion",
          {
            tags: ["@delete-category", "@positive"],
          },
          () => {
            cy.readFile(writeDataFilePath).then((data) => {
              const categoryName = data.riskCatagory.add.name;

              // Verify category exists first
              riskCategory.verifyGridContainsMinimumRows();
              riskTaxonomy.clearSearches(0);
              riskCategory.scrollingToBottomOfGrid();
              // Delete the category
              filterAndDelete
                .deleteRiskCategory(categoryName, true)
                .verifyItemDeleted(categoryName);
            });
          }
        );
      }
    );
  }
);
