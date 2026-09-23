import { RiskTaxonomyLibrariesPage } from "../../../support/POM/RiskAndControlRegister/Administration/RiskTaxonomyLibrariesCustomerSpace.js";

/**
 * @description Test suite for verifying the Risk Libraries import process.
 * @module RiskLibrariesImport
 */
describe(
  "Risk Libraries Import Process",
  {
    tags: [
      "@risk-management",
      "@risk-libraries",
      "@regression",
      "@customer",
      "@predict",
      "@pd36731",
    ],
  },
  () => {
    context(
      "Risk Libraries data import to Customer space",
      () => {
        
        const withRMB = Cypress.env("riskManagement").withRMB;
        const page = new RiskTaxonomyLibrariesPage();

        /** @type {object} Test data imported from fixture */
        const jsonData = page.data;

        /** @type {string} Category name used for import */
        const category = jsonData.importCategory;

        /** @type {string} Library name for dropdown selection */
        const libName = jsonData.libraryName;

        /** @type {Array<string>} Expected categories list */
        const categories = jsonData.expectedCategories;

        /** @type {string} Filter text for 'Name' column */
        const filterText = jsonData.filterCategoryName;

        /** @type {string} Filter text for 'Business Area Definition' column */
        const baFilterText = jsonData.fliterBaName;
        
        /** @type {string} Parent category for expansion */
        const parentCategory = jsonData.parentCategory;

        /** @type {Array<string>} Expected child categories */
        const childCategories = jsonData.childCategories;
        
        /** @type {Array<string>} Expected Special Char*/
        const specialCharFilter = jsonData.invalidFilter;

        /** @type {Array<string>} Expected myTaxonomyRisk */
        const taxonomyRisk = jsonData.myTaxonomyRisk;
        
        /** @type {Array<string>} Expected child categories */
        const checkboxIndexes = jsonData.checkboxIndexes;


        beforeEach(() => {
          cy.loginWithSession(
            "login - with Risk Management",
            withRMB.username,
            withRMB.password,
            withRMB.key
          );
          
          cy.visitRiskTaxonomyLibraries();

        });

                /**
         * @test TC1
         * @description Select multiple risk definitions across different groups and import them.
         * @tags @pd41599
         */
       it(
          "TC1: Select multiple risk definitions across different groups",
          { tags: ["@pd41599","@pd41604","@smoke"] },
          () => {
            page.selectMultipleCategoryInGrid(checkboxIndexes);
            page.clickImport();
            page.expectMultipleCategoryInFlyout(categories);
          }
        );

        /**
         * @test TC2
         * @description Verify that selecting a library from the dropdown displays the respective data in the grid.
         * @tags @pd40980 @smoke
         */
       it(
          "TC2: Verify on selecting library from the drop down list selected library data should appear on the grid",
          { tags: ["@pd40980", "@smoke"] },
          () => {
            page.openLibraryDropdown();
            page.searchAndSelectLibrary(libName);
            page.expectCategoriesInGrid(categories);
          }
        );

        /**
         * @test TC3
         * @description Verify import to My Taxonomies after selecting rows.
         * @tags @pd42603 @smoke
         */
       it(
          "TC3: Import to My Taxonomies after selecting rows",
          { tags: ["@pd42603","@pd41597","@pd41608","@pd41620","@smoke"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.expectFlyoutVisible();
            page.expectCategoryInFlyout(category);
          }
        );

        /**
         * @test TC4
         * @description Verify reset functionality after making selections.
         * @tags @pd41587 @smoke
         */
       it(
          "TC4: Click Reset after making selections",
          { tags: ["@pd41587","@pd41641"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.expectCategoryInFlyout(category);
            page.clickReset();
            page.expectSelectionCleared(category);
          }
        );

        /**
         * @test TC5
         * @description Verify navigation to step 2 after selecting mapped rows.
         * @tags @pd41586 @smoke
         */
       it(
          "TC5: Click Next after selecting mapped rows",
          { tags: ["@pd41586", "@smoke"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.expectCategoryInFlyout(category);
            page.clickNextStep1();
            page.validateStep2Grid();
          }
        );

        /**
         * @test TC6
         * @description Validate mapping columns inside the flyout.
         * @tags @pd41590 @smoke
         */
       it(
          "TC6: Validate mapping columns",
          { tags: ["@pd41590"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.expectCategoryInFlyout(category);
            page.validateFlyoutColumns();
          }
        );

        /**
         * @test TC7
         * @description Verify summary accuracy of what will be committed.
         * @tags @pd41588 @smoke
         */
       it(
          "TC7: Check summary accuracy of what will be committed",
          { tags: ["@pd41588","@pd41610","@smoke"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.expectCategoryInFlyout(category);
            page.clickNextStep1();
            page.clickNextStep2();
            page.validateSummaryCategory(category);
          }
        );

        /**
         * @test TC8
         * @description Verify the undo action in Action column.
         * @tags @pd41595 @smoke
         */
       it(
          "TC8: Click the Undo icon in Action column",
          { tags: ["@pd41595","@pd41617"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.expectCategoryInFlyout(category);
            page.clickNextStep1();
            page.clickNextStep2();
            page.performUndoAction();
          }
        );

        /**
         * @test TC9
         * @description Verify cancel functionality after making selections.
         * @tags @pd41600
         */
       it(
          "TC9: Click cancel after making selections",
          { tags: ["@pd41600","@pd41609"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.expectCategoryInFlyout(category);
            page.clickCancel();
          }
        );

        /**
         * @test TC10
         * @description Verify Next button is disabled when no rows are selected.
         * @tags @pd41598
         */
       it(
          "TC10: Click Next without selecting any rows",
          { tags: ["@pd41598","@pd41618","@smoke"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.disableNextBtn();
          }
        );

        /**
         * @test TC11
         * @description Apply filter on “Name” column with full match and verify filtered result.
         * @tags @pd41593
         */
       it(
          "TC11: Apply filter on 'Name' column with full match",
          { tags: ["@pd41593","@pd41603","@pd41640","@smoke"] },
          () => {
            page.openLibraryDropdown();
            page.searchAndSelectLibrary(libName);
            page.expectCategoriesInGrid(categories);
            page.applyFilterOnNameColumn(filterText);
            cy.waitForMyGridLoaderToDisappear(10000);
            page.expectOnlyFilteredCategoryVisible(filterText);
          }
        );

        /**
         * @test TC12
         * @description Apply filter on “Business Area Definition” column with partial match and verify result.
         * @tags @pd41593
         */
       it(
          "TC12: Apply filter on 'Business Area Definition' with partial match",
          { tags: ["@pd41593","@pd41603","@pd41626"] },
          () => {
            page.openLibraryDropdown();
            page.searchAndSelectLibrary(libName);
            page.applyFilterOnBaColumn(baFilterText);
            cy.waitForMyGridLoaderToDisappear(10000);
            page.expectFilteredBusinessAreaVisible(baFilterText);
          }
        );

        /**
         * @test TC13
         * @description Verify Continue Mapping action after selections.
         * @tags @pd41595
         */
       it(
          "TC13: Click Continue Mapping",
          { tags: ["@pd41606","@pd41607","@smoke"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.expectCategoryInFlyout(category);
            page.clickNextStep1();
            page.clickNextStep2();
            page.performContinueMapping();
          }
        );
         /**
         * @test TC14
         * @description Verify Click Commit.
         * @tags @pd41594
         */
       it(
          "TC14: Click Commit",
          { tags: ["@pd41594","@pd41622","@smoke"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.expectCategoryInFlyout(category);
            page.clickNextStep1();
            page.clickNextStep2();
            page.clickCommit();
            page.validateJobQueueAfterCommit();
          }
        );
        
        /**
         * @test TC15
         * @description Expand a library group (e.g., Compliance Risk)
         * @tags @pd41631 @smoke
         */
       it(
          "TC15: Expand a library group (e.g., Compliance Risk)",
          { tags: ["@pd41631"] },
          () => {
            page.expandLibraryGroupAndVerify(parentCategory, childCategories);
          }
        );

                /**
         * @test TC16
         * @description Expand a mapped group like “Compliance Risk.
         * @tags @pd40980
         */
        it(
          "TC16: Expand a mapped group like “Compliance Risk”",
          { tags: ["@pd40980"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.expectFlyoutVisible();
            page.expandMappedGroupInFlyout(parentCategory, childCategories);
       });

        /**
         * @test TC17
         * @description Enter invalid or special characters in filters.
         * @tags @pd41593
         */
       it(
          "TC17: Enter invalid or special characters in filters",
          { tags: ["@pd41612"] },
          () => {
            page.openLibraryDropdown();
            page.searchAndSelectLibrary(libName);
            page.expectCategoriesInGrid(categories);
            cy.waitForMyGridLoaderToDisappear(10000);
            page.expectNoDataOnInvalidFilter(specialCharFilter);
          }
        );

        /**
         * @test TC18
         * @description On Step 2 we select my Taxonomy Risk Categories If we want to map selected Library data My Taxonomy existing data
         * @tags @pd41595 @smoke
         */
       it(
          "TC18: On Step 2 we select my Taxonomy Risk Categories If we want to map selected Library data My Taxonomy existing data",
          { tags: ["@pd41627","@smoke"] },
          () => {
            page.selectCategoryInGrid(category);
            page.clickImport();
            page.expectCategoryInFlyout(category);
            page.clickNextStep1();
            page.selectTaxonomyAndValidate(taxonomyRisk)

          }
        );
      }
    );
    
    /**
     * @context Separate context for TC16 because it requires
     * visiting Risk Taxonomies page instead of Libraries.
     */
    context("Risk Libraries Commit Validation", () => {
      const withRMB = Cypress.env("riskManagement").withRMB;
      const page = new RiskTaxonomyLibrariesPage();
      beforeEach(() => {
        cy.loginWithSession(
          "login - with Risk Management",
          withRMB.username,
          withRMB.password,
          withRMB.key
        );

        cy.visitRiskTaxonomies();
      });

     /**
         * @test TC19
         * @description Verify that after committing, the library data is successfully moved and appears in the Risk Taxonomy grid..
         * @tags @pd41594
         */
       it(
          "TC19: Verify that after committing, the library data is successfully moved and appears in the Risk Taxonomy grid.",
          { tags: ["@pd43716"] },
          () => {
            page.verifyCommittedCategoryInRiskTaxonomies();
      });
    });
  }
);
