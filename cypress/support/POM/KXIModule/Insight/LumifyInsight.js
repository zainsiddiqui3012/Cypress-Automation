import locators from "../../../../fixtures/locators.json";
import dataFile from "../../../../fixtures/KXIModule/Insight/LumifyInsight.json";
import toleranceFilterDataFile from "../../../../fixtures/KXIModule/Insight/InsightToleranceFilter.json";
const writeDataFilePath =
  "cypress/fixtures/KXIModule/Insight/writeLumifyInsight.json";
const insight = locators.kxi.insight;
const tolFilter = insight.toleranceFilter;

class LumifyInsight {
  /******************************* NAVIGATE METHODS ***********************/

  /**
   * navigateToInsightScreen will visit the profile page then navigate to insight screen
   * and verify url and sub header title
   */
  navigateToInsightScreen() {
    cy.visitProfile();
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.insight).click();
    this.verifyURL();
    this.verifySubHeaderTitle();
  }

  /**
   * navigateToInsightScreen_ERM will visit the profile page then navigate to insight screen for ERM user
   * and verify url and sub header title
   */
  navigateToInsightScreen_ERM() {
    cy.visitProfile();
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.kxIManagement).click().wait(500);
    cy.get(locators.menu.kxIManagement)
      .parentsUntil("ul")
      .find(locators.menu.insight)
      .should("be.visible")
      .click();
    this.verifyURL(true);
    this.verifySubHeaderTitle();
  }

  /******************************* CLICK METHODS ***************************/

  /**
   * clickEllipsesBtn will verify visibility and click on the ellipses button
   */
  clickEllipsesBtn() {
    cy.get(insight.ellipsesBtn).should("be.visible").click();
  }

  /**
   * clickColumnBtn will click on Column button on the side bar
   */
  clickColumnBtn() {
    cy.get(insight.sideBar.columnsBtn).should("be.visible").click().wait(1000);
  }

  /**
   * clickAddCategoryTopEllises will click on Three ellipses
   * and click on Add Category button from ellipses menu
   */
  clickAddCategoryTopEllises() {
    cy.wait(1000);
    cy.get(insight.ellipsesBtn).click();
    cy.get(insight.ellipsesMenuItems).first().click({ force: true });
  }

  /**
   * clickAddCategoryActionBtn will click on Action add category button from category row
   * then expand the main category and double click on new sub category input field
   */
  clickAddCategoryActionBtn() {
    cy.wait(1000)
      .get(insight.grid.actionsBtnAddCat)
      .first()
      .click({ force: true });
    // cy.get(insight.grid.firstRowCatExpandIcon).click({ force: true });
    cy.get(insight.grid.newSubCategoryName).dblclick({ force: true }).wait(200);
  }

  clickEditCategoryActionBtn(isMainCat) {
    if (isMainCat)
      cy.wait(1000)
        .get(insight.grid.editCategoryActions)
        .first()
        .click({ force: true });
    else
      cy.wait(1000)
        .get(insight.grid.editCategoryActions)
        .eq(1)
        .click({ force: true });
  }

  clickDeleteCategoryActionBtn(isMainCat) {
    if (isMainCat)
      cy.wait(1000)
        .get(insight.grid.deleteCategoryActions)
        .first()
        .click({ force: true });
    else
      cy.wait(1000)
        .get(insight.grid.deleteCategoryActions)
        .eq(1)
        .click({ force: true });

    cy.get(insight.grid.deleteModalBtn)
      .should("be.visible")
      .click({ force: true });
  }

  /**
   * clickKXIExpandBtn will read the category name from writeLumifyInsight.json file
   * search the category and click on KXI icon in KXI column from first row
   */
  clickKXIExpandBtn() {
    cy.readFile(writeDataFilePath).then((file) => {
      cy.get(insight.grid.searchCategory)
        .type(file.category, { delay: 2 })
        .wait(500)
        .blur()
        .wait(500);
    });
    cy.get(insight.grid.kXIArrowGrid).first().click({ force: true });
  }

  /******************************** TYPE METHODS *******************************/

  /**
   * typeCategoryName will create random Alpha Numeric string using cy.createRandomAlphaNumeric(length)
   * custom command and then concatinate the random string with Category Name got from Data file
   * then type the new string in Input Category name field
   * and Wait for Toast Message with success text
   * Save the Category value in writeLumifyInsight.json file
   * @param {boolean} isMainCat Is main category or Sub Category
   * @example typeCategoryName(true) for Main Category
   * typeCategoryName(false) for Sub Category
   */
  typeCategoryName(isMainCat) {
    cy.wait(1000);
    const catName = isMainCat ? dataFile.category : dataFile.subCategory;
    cy.createRandomAlphaNumeric(7).then((randomString) => {
      const categoryName = catName + randomString;

      cy.get(insight.grid.newCategoryNameInput, { timeout: 20000 })
        .type(`${categoryName}{enter}`)
        .wait(500);

      cy.verifyToastMessageText(dataFile.successMsgTxt, 25000);
      cy.readFile(writeDataFilePath).then((file) => {
        if (isMainCat) file.category = categoryName;
        else file.subCategory = categoryName;
        cy.writeFile(writeDataFilePath, file);
      });
    });
  }

  /**
   * typeCategoryName_Same will read the category or sub category name from writeLumifyInsight.json file
   * then type the new string in Input Category name field
   * and Wait for Toast Message with error text
   * Save the Category value in writeLumifyInsight.json file
   * @param {boolean} isMainCat Is main category or Sub Category
   * @example typeCategoryName_Same(true) for Main Category
   * typeCategoryName_Same(false) for Sub Category
   */
  typeCategoryName_Same(isMainCat) {
    cy.readFile(writeDataFilePath).then((file) => {
      cy.wait(1000);
      const catName = isMainCat ? file.category : file.subCategory;

      if (!isMainCat)
        cy.get(insight.grid.newSubCategorySameName)
          .dblclick({ force: true })
          .wait(200);

      cy.get(insight.grid.newCategoryNameInput)
        .type(`${catName}{enter}`)
        .wait(500);

      cy.verifyToastMessageText(dataFile.uniqueCategoryNameTxt, 25000);
    });
  }

  /**
   * typeCategoryName_Negative will create random Alpha Numeric string using cy.createRandomAlphaNumeric(length)
   * custom command and then concatinate the random string with Category Name got from Data file
   * then type the new string in Input Category name field
   * and Wait for Toast Message with success text
   * Save the Category value in writeLumifyInsight.json file
   * @param {boolean} isMainCat Is main category or Sub Category
   * @param {boolean} isEmpty Is Empty record text
   * @example typeCategoryName_Negative(true, false) for Main Category and character length
   * typeCategoryName_Negative(false, false) for sub Category and character length
   * typeCategoryName_Negative(true, true) for empty Main Category
   * typeCategoryName_Negative(false, false) for empty sub Category
   */
  typeCategoryName_Negative(isMainCat, isEmpty) {
    cy.wait(1000);
    if (isEmpty) {
      cy.get(insight.grid.newCategoryNameInput).type("{enter}").wait(500);
      this.clickAddCategoryTopEllises();
      cy.verifyToastMessageText(dataFile.emptyfieldMsgTxt, 25000);
    } else {
      const catName = isMainCat ? dataFile.category : dataFile.subCategory;
      cy.createRandomAlphaNumeric(dataFile.characterLength).then(
        (randomString) => {
          const categoryName = catName + randomString;

          cy.get(insight.grid.newCategoryNameInput)
            .type(`${categoryName}{enter}`)
            .wait(500);

          cy.verifyToastMessageText(dataFile.characterLimitMsgTxt, 25000);
          cy.readFile(writeDataFilePath).then((file) => {
            if (isMainCat) file.category = categoryName;
            else file.subCategory = categoryName;
            cy.writeFile(writeDataFilePath, file);
          });
        }
      );
    }
  }

  /**
   * typeCategoryWithTab will create random Alpha Numeric string using cy.createRandomAlphaNumeric(length)
   * custom command and then concatinate the random string with Category Name got from Data file
   * then type the new string in Input Category name field and press tab key
   * and Wait for Toast Message with success text
   * Save the Category value in writeLumifyInsight.json file
   * @param {boolean} isMainCat Is main category or Sub Category
   * @param {boolean} isEmpty is the input string to be typed is empty
   * @example typeCategoryWithTab(true, false) for Main Category
   * typeCategoryWithTab(false, false) for Sub Category
   * typeCategoryWithTab(true, true) for Empty
   */
  typeCategoryWithTab(isMainCat, isEmpty) {
    cy.wait(1000);
    const catName = isMainCat ? dataFile.category : dataFile.subCategory;
    cy.createRandomAlphaNumeric(7).then((randomString) => {
      const categoryName = catName + randomString;
      if (isEmpty) {
        cy.get(insight.grid.newCategoryNameInput).type("{enter}").wait(500);
      } else {
        cy.get(insight.grid.newCategoryNameInput)
          .type(`${categoryName}`)
          .tab()
          .wait(500);

        cy.verifyToastMessageText(dataFile.successMsgTxt, 25000);
        cy.readFile(writeDataFilePath).then((file) => {
          if (isMainCat) file.category = categoryName;
          else file.subCategory = categoryName;
          cy.writeFile(writeDataFilePath, file);
        });
      }
    });
  }

  /******************************** SELECT METHODS ******************************/

  /**
   * selectAllColPicker will select all the column filter options if it is not checked
   */
  selectAllColPicker() {
    cy.get(insight.sideBar.colFilter.selectAll).then((el) => {
      if (el.is(":not(:checked)")) {
        cy.wrap(el).click({ force: true });
        cy.get(insight.sideBar.colFilter.selectAll).should("be.checked");
      }
    });
  }

  /******************************** CLEAR/RESET METHODS ***************************/

  /**
   * resetSearchState will wait for Grid Loader to disappear
   * and clear the search category field on Risk Insight
   */
  resetSearchState() {
    cy.waitForLoaderToDisappear("agGrid", 50000);
    cy.waitUntilLoaderNotVisible(25000);
    cy.get(insight.grid.searchCategory)
      .wait(3000)
      .click()
      .wait(3000)
      .clear({ force: true })
      .wait(3000)
      .should("have.value", "");
  }

  /*************************** VERIFY METHODS ********************************/

  /**
   * verifyURL will verify the pathname of the insight screen
   * @param {boolean} isERM Is the current user have ERM or Lumify?
   * @example Lumify: verifyURL(false)
   * ERM: verifyURL(true)
   */
  verifyURL(isERM) {
    const pathname = isERM ? dataFile.pathname.erm : dataFile.pathname.lumify;
    cy.location("pathname", { log: true }).should("eq", pathname);
  }

  /**
   * verifyBreadCrumb will verify the breadcrumb values on insight screen
   */
  verifyBreadCrumb() {
    // Verify Lumify Text and it should be visible
    cy.get(insight.breadCrumbs.lumify)
      .should("be.visible")
      .then((el) => {
        expect(el.text().trim()).to.eq(
          dataFile.breadcrumbs.lumify.txt,
          dataFile.breadcrumbs.lumify.assertMsg
        );
      });

    // Verify Insight Text and it should be visible
    cy.get(insight.breadCrumbs.insight)
      .should("be.visible")
      .then((el) => {
        expect(el.text().trim()).to.eq(
          dataFile.breadcrumbs.insight.txt,
          dataFile.breadcrumbs.insight.assertMsg
        );
      });

    // Verify Risk Register should not exist in BreadCrumbs for Lumify
    cy.get(insight.breadCrumbs.riskRegister).should("not.exist");
  }

  /**
   * verifySubHeaderTitle will verify the sub header title and its text
   */
  verifySubHeaderTitle() {
    cy.get(insight.subHeaderTitle)
      .should("be.visible")
      .then((el) => {
        expect(el.text().trim()).to.eq(dataFile.subHeaderTitle);
      });
  }

  /**
   * verifyEllipsesBtnVisible will verify the Elipses btn is visible
   */
  verifyEllipsesBtnVisible() {
    cy.get(insight.ellipsesBtn).should("be.visible");
  }

  /**
   * verifyKXISubGrid will verify the Elements in KXI Sub grid
   * first it will verify that Sub Grid Flyer is visible
   * then verify the text of KXI Sub Grid Flyer heading
   * and will verify the buttons on KXI Sub Grid Flyer
   */
  verifyKXISubGrid() {
    cy.get(insight.kxiSubgridFlyer.kxiSubgridFlyer).should("be.visible");
    cy.get(insight.kxiSubgridFlyer.heading).then((el) => {
      expect(el.text().trim()).to.eq(dataFile.kxiSubGridFlyer.heading);
    });
    cy.get(insight.kxiSubgridFlyer.buttons)
      .should("be.visible")
      .and("have.length", 2)
      .each((btn, index, btnList) => {
        expect(btn.text().trim()).to.eq(
          dataFile.kxiSubGridFlyer.buttons[index]
        );
      });
  }

  /**
   * verifyAddSubCategoryActionBtn will verify that each category have actions column
   * and have add category icon/btn present and visible
   */
  verifyAddSubCategoryActionBtn() {
    cy.get(insight.grid.gridRows, { timeout: 5000 }).should("be.visible");

    cy.get(insight.grid.addCategoryActions).should("be.visible");
  }

  /**
   * verifyEllipsesMenu will verify menu items of ellipses
   */
  verifyEllipsesMenu() {
    this.clickEllipsesBtn();
    cy.get(insight.ellipsesMenuItems)
      .should("be.visible")
      .and("have.length", dataFile.ellipsesMenuItems.length)
      .each((menuItem, index, list) => {
        expect(menuItem.text().trim()).to.eq(dataFile.ellipsesMenuItems[index]);
      });
  }

  /**
   * verifyEllipsesMenuIcons will verify the ellipses menu items icons
   */
  verifyEllipsesMenuIcons() {
    this.clickEllipsesBtn();
    cy.get(insight.ellipsesMenuItemIcons[0]).should("be.visible");
  }

  /**
   * verifyRiskApplicabilityNotExist will verify that Risk Applicability is not present in the ellipses menu
   */
  verifyRiskApplicabilityNotExist() {
    this.clickEllipsesBtn();
    cy.get(insight.riskApplicability).should("not.exist");
  }

  /**
   * verifyGridHeaderCells will verify the Grid header cells as per the passed parameter
   * @param {boolean} isERM Is the current user have ERM or Lumify?
   * @example Lumify: verifyGridHeaderCells(false)
   * ERM: verifyGridHeaderCells(true)
   */
  verifyGridHeaderCells(isERM) {
    const cellTxt = isERM
      ? dataFile.gridHeaderCells.withERM
      : dataFile.gridHeaderCells.withoutERM;
    cy.get(insight.gridHeaderCells)
      .should("be.visible")
      .and("have.length", cellTxt.length)
      .each((cell, index, list) => {
        expect(cell.text().trim()).to.eq(cellTxt[index]);
      });
  }

  /**
   * verifyRiskColNotPresent will verify the Grid header cells
   */
  verifyRiskColNotPresent() {
    const cellTxt = dataFile.gridHeaderCells.notPresent;
    cy.get(insight.gridHeaderCells)
      .should("be.visible")
      .each((cell, index, list) => {
        cellTxt.forEach((col) => {
          expect(cell.text().trim()).to.not.eq(col);
        });
      });
  }

  /**
   * verifyColPicker will verify Columns is present in side bar and it has text Columns
   */
  verifyColPicker() {
    cy.get(insight.sideBar.columnsBtn)
      .should("be.visible")
      .and("have.text", dataFile.sideBar.columns);
  }

  /**
   * verifyColFilter will first open column filter tab from right side bar
   * then verify each filter option by clicking checbox
   */
  verifyColFilter() {
    this.clickColumnBtn();
    this.selectAllColPicker();
    dataFile.sideBar.colArr.forEach((col) => {
      if (col != "statePersist") {
        cy.wait(1000);
        cy.get(insight.sideBar.colFilter[col]).click({ force: true });
        cy.wait(1000);
        this.verifyGridHeaderCells_ColumnFilter(col);
        cy.wait(500);
        this.selectAllColPicker();
        cy.wait(1000);
      }
    });
  }

  /**
   * verifyGridHeaderCells_ColumnFilter will verify the Grid Header cells after applying the column option passed
   * @param {string} filter key of the column filter array object from data file
   */
  verifyGridHeaderCells_ColumnFilter(filter) {
    const headerArr = dataFile.sideBar.colFilter[filter];
    cy.get(insight.gridHeaderCells)
      .should("be.visible")
      .and("have.length", headerArr.length)
      .each((cell, index, list) => {
        expect(cell.text().trim()).to.eq(headerArr[index]);
      });
  }

  /**
   * verifyInlineRowCategory will check the visibility of Inline row input for category
   */
  verifyInlineRowCategory() {
    cy.get(insight.grid.newCategoryNameInput).should("be.visible");
  }

  /**
   * verifyInlineRowCategory will check the visibility of Inline row input for category
   */
  verifyInlineRowCategory() {
    cy.get(insight.grid.newCategoryNameInput).should("be.visible");
  }

  /**
   * verifyNewMainCategory will verify the new Main Category created by reading the
   * category name from writeLumifyInsight.json file and searching the category
   * then verify that first category row is visible and have category text
   */
  verifyNewMainCategory() {
    cy.wait(1000);
    cy.readFile(writeDataFilePath).then((file) => {
      cy.get(insight.grid.searchCategory)
        .type(file.category)
        .wait(500)
        .blur()
        .wait(500);

      cy.get(insight.grid.firstRowCategory)
        .should("be.visible")
        .then((el) => {
          expect(el.text().trim()).to.eq(file.category);
        });
    });
  }

  /**
   * verifyNewSubCategory will verify the new Sub Category created by reading the
   * category name from writeLumifyInsight.json file and searching the category
   * then verify that category row is visible and have category text
   * @param {boolean} isMainCat is verifying main category
   * @example verifyNewSubCategory(true) for verifying Sub Category is under main category
   * verifyNewSubCategory(false) for verifying sub category
   */
  verifyNewSubCategory(isMainCat) {
    cy.wait(1000);
    cy.readFile(writeDataFilePath).then((file) => {
      cy.get(insight.grid.searchCategory)
        .type(file.subCategory)
        .wait(500)
        .blur()
        .wait(500);

      if (isMainCat) {
        cy.get(insight.grid.firstRowCategory)
          .should("be.visible")
          .then((el) => {
            expect(el.text().trim()).to.eq(file.category);
          });
      } else {
        cy.get("body").then(($body) => {
          // Check if the 'Arrow Icon not expand'
          if ($body.find(insight.grid.categoryArrow).length === 0) {
            // If not present, click the closed arrow icon
            cy.get(insight.grid.categoryArrowIcon).should("be.visible").click();
          }
        });

        cy.get(insight.grid.secondRowSubCategory)
          .should("be.visible")
          .then((el) => {
            expect(el.text().trim()).to.eq(file.subCategory);
          });
      }
    });
  }

  verifyDeleteFunctionality() {
    cy.verifyToastMessageText(dataFile.categoryDeleteTxt, 25000);
  }

  /**
   * verifyGroupColHeaders will verify the headers of Grid by which data is grouped
   * In Lumify Insight case data should be only grouped by Category so only group
   * header column should be Category
   */
  verifyGroupColHeaders() {
    cy.get(insight.grid.header.groupColHeaderDivs)
      .should("be.visible")
      .and("have.length", 1)
      .each((cell, index, list) => {
        expect(cell.text().trim()).to.eq(dataFile.groupColHeaders[index]);
      });
  }

  /****************************** STATE PERSIST *******************************/

  /**
   * setColFilter_StatePersist will uncheck the name column option
   * and verify the grid header state for name option as uncheck
   */
  setColFilter_StatePersist() {
    this.clickColumnBtn();
    this.selectAllColPicker();
    cy.get(insight.sideBar.colFilter.name).wait(500).click({ force: true });
    this.verifyGridHeaderCells_ColumnFilter(dataFile.sideBar.colArr[0]);
  }

  /**
   * verifyColFilter_StatePersist will verify the name column option grid header state
   * and check the name column option and then verify the default grid header state
   */
  verifyColFilter_StatePersist() {
    cy.wait(1500);
    this.verifyGridHeaderCells_ColumnFilter(dataFile.sideBar.colArr[0]);
    this.clickColumnBtn();
    this.selectAllColPicker();
    this.verifyGridHeaderCells_ColumnFilter(dataFile.sideBar.colArr[4]);
  }

  /**
   * typeCategoryName_StatePersist will assign value of either category or subCategory
   * then type the value in search name field
   * @param {boolean} isMainCat Is main category or Sub Category
   * @example typeCategoryName_StatePersist(true) for Main Category
   * typeCategoryName_StatePersist(false) for Sub Category
   */
  typeCategoryName_StatePersist(isMainCat) {
    cy.wait(1000);
    cy.readFile(writeDataFilePath).then((file) => {
      const value = isMainCat ? file.category : file.subCategory;
      cy.get(insight.grid.searchCategory)
        .type(value)
        .wait(500)
        .blur()
        .wait(500);
    });
  }

  /**
   * verifySearchValue_StatePersist will take the value from data file verify the value of Search name field
   * @param {boolean} isMainCat Is main category or Sub Category
   * @example verifySearchValue_StatePersist(true) for Main Category
   * verifySearchValue_StatePersist(false) for Sub Category
   */
  verifySearchValue_StatePersist(isMainCat) {
    cy.wait(1000);
    cy.readFile(writeDataFilePath).then((file) => {
      const value = isMainCat ? file.category : file.subCategory;
      cy.get(insight.grid.searchCategory).should("have.value", value);
    });
  }

  /*************************** TOLERANCE FILTER ********************************/

  selectToleranceFilter(filter) {
    cy.get(tolFilter.select).select(filter);
  }

  verifyToleranceFilterValues(filter) {
    const selectedFilter = toleranceFilterDataFile[filter];
    this.resetSearchState();
    cy.get(insight.grid.searchCategory)
      .type(toleranceFilterDataFile.search)
      .wait(500)
      .blur()
      .wait(500);

    cy.get(insight.grid.kriToolTip).should(
      "have.length",
      selectedFilter.kriToolTip
    );
  }

  verifyToleranceFilterGrid(filter) {
    const selectedFilter = toleranceFilterDataFile[filter];
    this.resetSearchState();
    selectedFilter.positiveCase.forEach((filterName) => {
      cy.get(insight.grid.searchCategory)
        .clear({ force: true })
        .wait(500)
        .type(filterName)
        .wait(500)
        .blur()
        .wait(500);

      cy.get(insight.grid.kriToolTip).should("have.length.gte", 1);
    });

    selectedFilter.negativeCase.forEach((filterName) => {
      cy.get(insight.grid.searchCategory)
        .clear({ force: true })
        .wait(500)
        .type(filterName)
        .wait(500)
        .blur()
        .wait(500);

      cy.get(insight.grid.kriToolTip).should("not.exist");
    });

    this.resetSearchState();
  }
}
export default LumifyInsight;
