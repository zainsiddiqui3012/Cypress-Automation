import LumifyInsight from "../../../support/POM/KXIModule/Insight/LumifyInsight";

describe(
  "Root Level Category and Sub-Category Creation for Lumify on Risk Insights - PD-22243",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@insight",
      "@pd22278",
      "@release5.17",
      "@customer",
    ],
  },
  () => {
    const lumifyInsight = new LumifyInsight();

    const withoutRM = Cypress.env("kxi").customer.withoutRM;
    beforeEach(() => {
       cy.loginWithSession(
         "login - " + withoutRM.username,
         withoutRM.username,
         withoutRM.password,
         withoutRM.key
       );
    });
    it("Verify three ellipses should be shown on top right header of the Insights screen if customer has Lumify (only KXI module).", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.verifyEllipsesBtnVisible();
    });

    it("Verify Add Category option should be displayed when click on three ellipses on the Insights screen.", () => {
      // Also covering
      // Verify Add Risk Category should be displayed in menu option when click three ellipses on Insights grid in action column. When click Add Risk Category popup should open containing Name and Description field.
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.verifyEllipsesMenu();
      lumifyInsight.verifyEllipsesMenuIcons();
    });

    it("Verify Inline row should add with to input risk category name when click Add Category on three ellipses on Insights screen.", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.verifyInlineRowCategory();
    });

    it("Verify Risk Category should be added at root level on Insights grid when click tab after providing name on inline editor.", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.typeCategoryName(true);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewMainCategory();
      lumifyInsight.resetSearchState();
    });

    it("Verify validation message should be displayed if click tab tab without providing name on when new row is append on ag grid on Insights screen.", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.typeCategoryName_Negative(true, true);
    });

    it("Verify validation should display if user inputs more than 256 characters in name field on Add Risk Category inline editor.", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.typeCategoryName_Negative(true, false);
    });

    it("Verify validation message should display Risk Category with same already exists if user creates Parent Risk category with same name which is already added.", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.typeCategoryName(true);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewMainCategory();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.typeCategoryName_Same(true);
      lumifyInsight.resetSearchState();
    });

    it("Verify three ellipses option should be displayed in actions column against every risk category on Insights screen grid.", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyAddSubCategoryActionBtn();
    });

    it("Verify sub risk category should added under parent risk category on Insights screen.", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.typeCategoryName(true);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewMainCategory();
      lumifyInsight.clickAddCategoryActionBtn();
      lumifyInsight.typeCategoryName(false);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewSubCategory(true);
      lumifyInsight.resetSearchState();
    });

    it("Verify same validations on sub risk category which are Parent Risk Category like blank name while adding or updating.", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.typeCategoryName(true);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewMainCategory();
      lumifyInsight.clickAddCategoryActionBtn();
      lumifyInsight.typeCategoryName_Negative(false, true);
      lumifyInsight.resetSearchState();
    });

    it("Verify validation should display if user inputs more than 256 characters in name field on Add Risk Sub Category inline editor", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.typeCategoryName(true);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewMainCategory();
      lumifyInsight.clickAddCategoryActionBtn();
      lumifyInsight.typeCategoryName_Negative(false, false);
      lumifyInsight.resetSearchState();
    });

    it("Verify same validations on sub risk category which are Parent Risk Category like same name while adding or updating.", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.typeCategoryName(true);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewMainCategory();
      lumifyInsight.clickAddCategoryActionBtn();
      lumifyInsight.typeCategoryName(false);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewMainCategory();
      lumifyInsight.clickAddCategoryActionBtn();
      lumifyInsight.typeCategoryName_Same(false);
      lumifyInsight.resetSearchState();
    });

    it("Verify the Edit functionality for Main Category", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.typeCategoryName(true);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewMainCategory();
      lumifyInsight.clickEditCategoryActionBtn(true);
      lumifyInsight.typeCategoryName(true);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewMainCategory();
      lumifyInsight.resetSearchState();
    });

    it("Verify the Edit functionality for Sub Category", () => {
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
      lumifyInsight.clickEditCategoryActionBtn(false);
      lumifyInsight.typeCategoryName(false);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewSubCategory(true);
      lumifyInsight.resetSearchState();
    });

    it("Verify the Delete functionality for Main Category", () => {
      lumifyInsight.navigateToInsightScreen();
      lumifyInsight.resetSearchState();
      lumifyInsight.clickAddCategoryTopEllises();
      lumifyInsight.typeCategoryName(true);
      lumifyInsight.resetSearchState();
      lumifyInsight.verifyNewMainCategory();
      lumifyInsight.clickDeleteCategoryActionBtn(true);
      lumifyInsight.verifyDeleteFunctionality();
      lumifyInsight.resetSearchState();
    });

    it("Verify the Delete functionality for Main Category", () => {
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
      lumifyInsight.clickDeleteCategoryActionBtn(false);
      lumifyInsight.verifyDeleteFunctionality();
      lumifyInsight.resetSearchState();
    });
  }
);
