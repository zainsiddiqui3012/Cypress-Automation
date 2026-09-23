import {
  RiskTaxonomy,
  RiskCategory,
} from "../../../support/POM/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.js";
import ValidationHelper from "../../../support/POM/RiskAndControlRegister/Administration/helpers/ValidationHelper.js";
import locators from "../../../fixtures/locators.json";
const writeDataFilePath =
  "cypress/fixtures/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.json";
const riskTaxonomy = new RiskTaxonomy();
const riskCategory = new RiskCategory();

describe(
  "Risk Taxonomy Customer Space - Comprehensive Tests",
  {
    tags: [
      "@risk-management",
      "@customer",
      "@regression",
      "@risk-taxonomy",
      "@pd36730",
    ],
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
    let getData;
    before(()=>{
      cy.readFile(writeDataFilePath).then((data) => {
        getData = data.riskCatagory.validationErrors;
      });
    });

    context("Risk Category - Negative Test Cases",
      {tags:["@add", "@pd40988", "@pd40987"]}, () => {
      beforeEach(() => {
        session();
      });
      it("Clear All Search Field",{tags:"@smoke"},
         () => {
          riskTaxonomy.clearSearches(0);
          riskTaxonomy.clearSearches(1);
          riskTaxonomy.clearSearches(2);
        });
        
      it(
        "Add Risk Category without filling the Name field",
        {
          tags: ["@pd41821", "@smoke", "@negative"],
        },
        () => {
          riskCategory.clickAddRiskCategory();
          // Test validation for missing name field
          riskCategory.addRiskCategoryWithoutName();
          riskTaxonomy.saveRiskCategory();
          ValidationHelper.verifyValidationError(
            getData.missingField
          );
        }
      );

      it(
        "Add Risk Category without selecting Business Area",
        {
          tags: ["@pd41789", "@negative", "@missing-fields"],
        },
        () => {
          riskTaxonomy.generateAndWriteRiskCategoryDataInFile(
            writeDataFilePath
          );
          riskCategory.clickAddRiskCategory();
          riskCategory.addRiskCategoryWithoutBusinessArea();
          riskTaxonomy.saveRiskCategory();
        }
      );

      it("verify the added Risk Category without BA Definitions is added & visible in Grid", () => {
        // Verify category appears in taxonomy grid
        riskCategory
          .getCategoryDataFromFile(writeDataFilePath, "add")
          .then((categoryData) => {
            riskCategory.verifyGridContainsMinimumRows();
            riskCategory.verifyRiskCategoryInGrid(
              categoryData.riskCatagory.add.name
            );
          });
      });

      it(
        "Edit Risk Category and remove Risk Appetite",
        {
          tags: ["@pd44448", "@edit", "@negative", "@missing-fields"],
        },
        () => {
          // Get category data and attempt to remove risk appetite
          cy.wait(3000); // Wait for grid to stabilize
          riskCategory.verifyGridContainsMinimumRows();
          riskCategory.scrollingToBottomOfGrid();
          riskCategory.clickEditIconForCategory();
          riskCategory.removeRiskAppetite();
          riskTaxonomy.saveRiskCategory();
        }
      );

      it("After Removing RiskAppetite verify Risk Category is visible in Grid and no toast msg found", () => {
        // Verify category appears in taxonomy grid
        riskCategory
          .getCategoryDataFromFile(writeDataFilePath, "add")
          .then((categoryData) => {
            riskCategory.verifyRiskCategoryInGrid(
              categoryData.riskCatagory.add.name
            );
          });
      });

      it(
        "Add Risk Category without selecting Risk Appetite",
        {
          tags: ["@pd44449", "@negative", "@missing-fields"],
        },
        () => {
          // Test validation for missing risk appetite
          riskTaxonomy.generateAndWriteRiskCategoryDataInFile(
            writeDataFilePath
          );
          riskCategory.clickAddRiskCategory();
          riskCategory.addRiskCategoryWithoutRiskAppetite();
          riskTaxonomy.saveRiskCategory();
        }
      );

      it("verify the added Risk Category without Risk Appetite is added & visible in Grid", () => {
        // Verify category appears in taxonomy grid
        riskCategory
          .getCategoryDataFromFile(writeDataFilePath, "add")
          .then((categoryData) => {
            riskCategory.verifyRiskCategoryInGrid(
              categoryData.riskCatagory.add.name
            );
          });
      });
    });

    context("Risk Category - Positive Test Cases",
      {tags:["@pd40982", "@pd40984","positive","edit"]}, () => {
      beforeEach(() => {
        session();
      });
      it(
        "For Assessments fields visibility customer should have Assessments module enabled",
        {
          tags: ["@assessments", "@module-dependency", "@positive","@smoke"],
        },
        () => {
          // Verify assessment fields are visible when module is enabled
          riskCategory.clickAddRiskCategory();
          riskCategory.verifyAssessmentFieldsVisibility({
            probability: true,
            impact: true,
            controlEnvironment: true,
          });

          riskCategory.cancelRiskCategory();
        }
      );

      it(
        "Add Risk Category with valid data",
        {
          tags: ["@pd44450", "@smoke", "@positive"],
        },
        () => {
          // Generate test data and create category
          riskTaxonomy.generateAndWriteRiskCategoryDataInFile(
            writeDataFilePath
          );
          riskCategory.clickAddRiskCategory();
          riskCategory.addRiskCategoryValidData("add");
          riskTaxonomy.saveRiskCategory();
        }
      );

      it("verify that Newly Added Risk Category is added and visible in the grid",{tags:"@smoke"}, () => {
        // Verify category appears in taxonomy grid
        riskCategory
          .getCategoryDataFromFile(writeDataFilePath, "add")
          .then((categoryData) => {
            riskCategory.verifyRiskCategoryInGrid(
              categoryData.riskCatagory.add.name
            );
          });
      });

      it(
        "Add Risk Category and associate multiple Business Area definitions",
        {
          tags: ["@pd44451", "@positive", "@multiple-selections"],
        },
        () => {
          // Create category with multiple business areas
          // Generate test data and create category
          riskTaxonomy.generateAndWriteRiskCategoryDataInFile(
            writeDataFilePath
          );
          riskCategory.clickAddRiskCategory();
          riskCategory.addRiskCategoryValidData("add", false, true);
          riskTaxonomy.saveRiskCategory();
        }
      );

      it("verify that Newly Added Risk Category is added and visible in the grid", () => {
        // Verify category appears in taxonomy grid
        riskCategory
          .getCategoryDataFromFile(writeDataFilePath, "add")
          .then((categoryData) => {
            riskCategory.verifyRiskCategoryInGrid(
              categoryData.riskCatagory.add.name
            );
          });
      });

      it(
        "Verify tree structure of categories in selection panel",
        {
          tags: ["@pd41875", "@tree", "@positive"],
        },
        () => {
          cy.readFile(writeDataFilePath).then((data) => {
            riskCategory.clickAddRiskCategory();
            riskCategory.verifyTreeStructureInSelectionPanel(
              data.riskCatagory.add.name
            );
            riskCategory.cancelRiskCategory();
          });
        }
      );

      it(
        "Add Risk Category with maximum length name (255 characters)",
        {
          tags: ["@pd44453", "@boundary", "@positive"],
        },
        () => {
          // Create test data with maximum length boundary
          riskCategory.clickAddRiskCategory();
          const maxLengthName =
            riskCategory.addRiskCategoryExceedingNameLength();
          riskTaxonomy.saveRiskCategory();
        }
      );

      it(
        "Add Risk Category with special characters in name",
        {
          tags: ["@pd41759", "@positive", "@special-chars"],
        },
        () => {
          // Create test data with special characters
          const specialCharRiskCatagory =
            riskCategory.addRiskCategoryWithSpecialCharacters();
          riskTaxonomy.saveRiskCategory();
        }
      );

      it(
        "Add Risk Category with duplicate name on same hierarchy level",
        {
          tags: ["@pd44454", "@positive", "@duplicate-same-level"],
        },
        () => {
          riskCategory.clickAddRiskCategory();
          riskCategory.addRiskCategoryValidData("add");
          riskTaxonomy.saveRiskCategory();
          ValidationHelper.verifyValidationError("Category already exists");
        }
      );

      it(
        "Add Risk Category with duplicate name on different hierarchy level",
        {
          tags: ["@pd44455", "@positive", "@duplicate-different-level"],
        },
        () => {
          riskCategory.clickAddRiskCategory();
          riskCategory.addRiskCategoryValidData("add", true);
          riskTaxonomy.saveRiskCategory();
        }
      );

      it(
        "Edit existing Risk Category to change its description",
        {
          tags: ["@pd44456", "@edit", "@positive","@smoke"],
        },
        () => {
          riskCategory.verifyGridContainsMinimumRows();
          riskCategory.scrollingToBottomOfGrid();
          riskCategory.clickEditIconForCategory();
          riskTaxonomy.generateAndWriteRiskCategoryDataInFile(
            writeDataFilePath,
            "update"
          );
          // riskCategory.addCompleteRiskCategory('add');
          riskCategory.addRiskCategoryValidData("update");
          riskTaxonomy.saveRiskCategory();
        }
      );
      it("verify that Risk Category is Updated and visible in Grid",{tags:"@smoke"}, () => {
        // Verify Updated category appears in taxonomy grid
        riskCategory
          .getCategoryDataFromFile(writeDataFilePath, "update")
          .then((categoryData) => {
            riskCategory.verifyRiskCategoryInGrid(
              categoryData.riskCatagory.update.name
            );
          });
      });

      it(
        "Verify Cancel button discards entered data",
        {
          tags: ["@pd41845", "@cancel", "@positive"],
        },
        () => {
          // Test cancel functionality
          riskCategory.clickAddRiskCategory();
          riskCategory.addRiskCategoryValidData("add");
          riskCategory.cancelRiskCategory();
        }
      );

      it(
        "Verify list view shows all added risk categories",
        {
          tags: ["@pd41882", "@list-view", "@positive", "@smoke"],
        },
        () => {
          riskCategory.verifyGridContainsMinimumRows();
        }
      );

      it(
        "Select and assign Risk Appetite, Probability, Impact, and Control Env",
        {
          tags: ["@pd44457", "@assessments", "@positive"],
        },
        () => {
          // Generate test data and create category
          riskTaxonomy.generateAndWriteRiskCategoryDataInFile(
            writeDataFilePath
          );
          riskCategory.clickAddRiskCategory();
          riskCategory.addRiskCategoryValidData("add");
          riskTaxonomy.saveRiskCategory();
        }
      );

      it(
        "verify the added Risk Category is added & visible in Grid",
        { tags: "@pd44458" },
        () => {
          // Verify category appears in taxonomy grid
          riskCategory
            .getCategoryDataFromFile(writeDataFilePath, "add")
            .then((categoryData) => {
              riskCategory.verifyRiskCategoryInGrid(
                categoryData.riskCatagory.add.name
              );
            });
        }
      );
    });
  }
);
