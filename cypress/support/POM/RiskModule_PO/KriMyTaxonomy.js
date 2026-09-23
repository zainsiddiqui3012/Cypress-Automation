import locators from "../../../fixtures/locators.json";
import KxIDefinition from "../KXIModule/KxIDefinition";
import KXI_POM from "../KXIModule/KxI_POM";

import PredictMenu_PO from "../Menu_PO/PredictMenu_PO";
import RiskCategory_PO from "./RiskCategory_PO";
import RiskDefinition_PO from "./RiskDefinition_PO";

import myTaxonomyTab_PO from "./myTaxonomyTab_PO";

import myTaxanomyKri from "../../../fixtures/RiskModule/Risk_Process_Taxonomy/myTaxanomyKri.json";

import { RR_ApplicabilityFlyout } from "../RiskAndControlRegister/RiskRegisterApplicabilityFlyout_PO";

import KXIDefinition from "../../../fixtures/KXIModule/KXIDefinition.json";

export class KriMyTaxonomy {
  sharedData = {};
  kxiPom = new KXI_POM();
  kxiDef = new KxIDefinition();

  predictMenu_PO = new PredictMenu_PO();
  riskCategory_PO = new RiskCategory_PO();
  riskDefinition_PO = new RiskDefinition_PO();

  risktaxanomy = new myTaxonomyTab_PO();
  rr_ApplicabilityFlyout = new RR_ApplicabilityFlyout();

  // navigateMyTaxanomy will open MyTaxanomy Screen (Risk & Control Register / Administration / Risk Taxanomies)
  navigateMyTaxanomy() {
    this.predictMenu_PO.menuClick();
    this.predictMenu_PO.riskAndControlRegisterClick();
    this.predictMenu_PO.riskAdministrationClick();
    this.predictMenu_PO.riskTaxonomyClick();
    this.riskCategory_PO.clickOnMyTaxonomiesTab();
  }

  /**
   * createRiskCategory will create Risk Category with the given Category names and other parameters
   * @param {String} riskCatId is Risk Category ID
   * @param {String} riskCatName is Risk Category Name
   * @param {String} riskCatDescription is Risk Category Description
   * @returns {String} catName it will return the created Risk Category Name.
   */

  createRiskCategoryAndDefinition(riskCatId, riskCatName, riskCatDescription, riskDefId, riskDefName, riskDefDescription) {
    this.createRiskCategory(riskCatId, riskCatName, riskCatDescription)
    this.createRiskDefinition(riskDefId, riskDefName, riskDefDescription)
  }
  createRiskCategory(riskCatId, riskCatName, riskCatDescription) {
    return new Cypress.Promise((resolve) => {
      this.navigateMyTaxanomy();
      this.riskCategory_PO.addCategoryButton();
      cy.createNamewithTime(riskCatName).then((catName) => {
        this.riskCategory_PO.addCategoryInfo(
          riskCatId,
          riskCatName,
          riskCatDescription
        );
        this.riskCategory_PO.savebutton();
        this.setSharedData("generatedRiskCategory", catName);
        resolve(catName);
      });
    });
  }

  //allFilter will select AllFilter value from insights filter section
  allFilter() {
    cy.get("#kriFilter").select("All Values");
  }

  /**
   * editRiskCatDef will search the name in the grid and click on edit button
   * editRiskCatDef is a generic function that have multiple conditions
   * if nonInsight is true it will click on edit button in MyTaxanomy Screen
   * if nonInsight is false it will open subgrid in insights screen.
   * @param {String} searchedName is Risk Definition name in insights/MyTaxanomy Screen
   * @param {String} riskCatDef is the first locator of riskCategory, riskDefinitions
   * @param {String} editCatDef is the second locator of riskCategory, riskDefinition
   * @param {Boolean} notInsight is Boolean it will be (True, MyTaxanomy) and (False, Insight) screens
   */
  editRiskCatDef(searchedName, riskCatDef, editCatDef, notInsight) {
    if (notInsight) {
      this.risktaxanomy.searchDefintiontaxonomyGrid(searchedName);
    } else {
      cy.waitForLoaderToDisappear("myGrid", 40000);
      cy.waitForElementToVisible(
        locators.kxi.insight.linkedKxI.searchRiskDef,
        40000
      );
      cy.get(locators.kxi.insight.linkedKxI.searchRiskDef, {
        timeout: 10000,
      })
        .clear({ delay: 3000, force: true })
        .click({
          delay: 500,
        });

      cy.get(locators.kxi.insight.linkedKxI.searchRiskDef, {
        timeout: 10000,
      })
        .clear({ delay: 3000 })
        .type("{selectall}{backspace}")
        .type(searchedName)
        .type("{enter}");

      this.allFilter();

      cy.wait(2000);
      cy.waitForElementToVisible(
        locators.kxi.insight.grid.firstRowCategory,
        120000
      );
      cy.get(locators.kxi.insight.grid.firstRowCategory, { timeout: 90000 })
        .invoke("attr", "aria-expanded")
        .then((ariaExpanded) => {
          if (ariaExpanded == "false") {
            // Click on the dropdown arrow if aria-expanded is "false"
            cy.get(locators.kxi.insight.grid.firstRowCatExpandIcon, {
              timeout: 90000,
            }).click({ force: true });
          }
        });
    }

    cy.get(riskCatDef, { timeout: 5000 })
      .find(editCatDef, { timeout: 8000 })
      .click();
  }

  /**
   * createRiskDefinition will create Risk Definition with the given Definition names and other parameters
   * @param {String} riskDefId is Risk Definition ID
   * @param {String} riskDefName is Risk Definition Name
   * @param {String} riskDefDescription is Risk Definition Description
   * @returns {String} riskDefName it will return the created Risk Definition Name.
   */
  createRiskDefinition(riskDefId, riskDefName, riskDefDescription) {
    return new Cypress.Promise((resolve) => {
      this.riskDefinition_PO.addDefinitionButton();
      cy.createNamewithTime(riskDefName).then((defName) => {
        this.riskDefinition_PO.addDefinitionInfo(
          riskDefId,
          riskDefName,
          riskDefDescription
        );
        cy.get(locators.risk.administration.riskTaxonomies.riskDefSaveBtn)
          .contains("button", "Save")
          .click();
        this.setSharedData("generatedDefName", defName);
        resolve(defName);
      });
    });
  }

  /**
   * setShareData and getShareData are two generic functions
   * their reason is to use the Definition values in the testcase file with adding respecive keys, values
   * @param {String} key (generatedCatName, generatedDefName, generatedKxiName)
   * @param {String} value (CatName, DefName, kxiName )
   */
  setSharedData(key, value) {
    this.sharedData[key] = value;
  }
  getSharedData(key) {
    return this.sharedData[key];
  }

  /**
   * kxiDefinition is generic template function for creating KXI Definition
   * @param {String} kxiDefName is KXI Definition name
   * @returns {String} kxiName is the created kxi def name.
   */
  kxiDefinition(kxiDefName, ownerName = Cypress.env("kxi").customer.withRM2.username) {
    cy.visitkxiDef();
    return new Cypress.Promise((resolve) => {
      this.kxiPom.addkxi();
      this.kxiDef.selectDataEntryType("Manual");
      cy.createNamewithTime(kxiDefName).then((kxiName) => {
        this.kxiDef.addKxIDefinitionInfo(kxiDefName, kxiDefName, kxiDefName);
        this.kxiDef.selectOwner(ownerName);
        this.setSharedData("generatedKxiName", kxiName);
        resolve(kxiName);
      });
    });
  }

  /**
   * setTriggers is generic function used to input the trigger level values for all kxi types
   * @param {String} kxiType is kxitype (applicable, notApplicable, partialNotApplicable)
   * @param {String} targetValue is target value
   * @param {String} leftTriggerLevel1 is leftTriggerlevel 1
   * @param {String} leftTriggerLevel2 is leftTriggerlevel 2
   * @param {String} leftTriggerLevel3 is leftTriggerLevel 3
   * @param {String} rightTriggerLevel1 is rightTriggerLevel1
   * @param {String} rightTriggerLevel2 is rightTriggerLevel2
   * @param {String} rightTriggerLevel3 is rightTriggerLevel3
   */
  setTriggers(
    kxiType,
    targetValue,
    leftTriggerLevel1,
    leftTriggerLevel2,
    leftTriggerLevel3,
    rightTriggerLevel1,
    rightTriggerLevel2,
    rightTriggerLevel3
  ) {
    if (kxiType == "applicable") {
      this.kxiDef.setTriggerCompareApplicable(
        targetValue,
        leftTriggerLevel1,
        leftTriggerLevel2,
        leftTriggerLevel3,
        rightTriggerLevel1,
        rightTriggerLevel2,
        rightTriggerLevel3
      );
    }

    if (kxiType == "notApplicable") {
      cy.get(
        locators.kxi.kxiDefinition.kriDefinitionForm.leftTriggerNotApplicable
      ).click({ force: true });
      cy.get(
        locators.kxi.kxiDefinition.kriDefinitionForm.rightTriggerNotApplicable
      ).click({ force: true });

      this.disableTriggers(KXIDefinition.notApplicable.leftTrigger);
      this.disableTriggers(KXIDefinition.notApplicable.rightTrigger);
    }

    if (kxiType == "partialNotApplicable") {
      this.kxiDef.setTriggerComparerPartialNotApplicable(
        targetValue,
        leftTriggerLevel1,
        leftTriggerLevel2,
        leftTriggerLevel3
      );
      cy.get(
        locators.kxi.kxiDefinition.kriDefinitionForm.rightTriggerNotApplicable
      ).click({ force: true });

      this.disableTriggers(KXIDefinition.notApplicable.rightTrigger);
    }
  }
  /**
   * createKxiDefinitionTrigger will create KxI Definition
   * @param {String} kxiDefName is the name of kxi
   * @returns {String} defName it will return the created kxi Definition Name.
   */
  createKxiDefinitionTrigger(kxiDefName, ownerName, sectionName='add') {
    let defName = this.kxiDefinition(kxiDefName, ownerName);

    this.setTriggers(
      "applicable",
      KXIDefinition[sectionName].targetValue,
      KXIDefinition[sectionName].leftTriggerLvl1,
      KXIDefinition[sectionName].leftTriggerLvl2,
      KXIDefinition[sectionName].leftTriggerLvl3,
      KXIDefinition[sectionName].rightTriggerLvl1,
      KXIDefinition[sectionName].rightTriggerLvl2,
      KXIDefinition[sectionName].rightTriggerLvl3
    );

    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveBtn).click();
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveBtn).should(
      "not.be.visible",
      { timeout: 8000 }
    );
    return defName;
  }

  /**
   * disableTriggers will check that when User clicks on Not Applicable the trigger levels should be disabled
   * @param {String} triggerSide will be trigger side that we want to check
   * for left Trigger disable verification (triggerSide will be leftTrigger),
   * for Right Trigger disable verification (triggerSide will be rightTrigger)
   */
  disableTriggers(triggerSide) {
    triggerSide.forEach((disableName) => {
      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.disableTriggerLevels)
        .find(`[name="${disableName}"]`)
        .should("have.attr", "disabled");
    });
  }

  /**
   * createKxiDefinitionWithoutTrigger will create KxI Definition with NotApplicable option
   * and check that the trigger levels should be disabled and not editable.
   * @param {String} kxiDefName is the name of kxi
   * @returns {String} defName it will return the created kxi Definition Name.
   */
  createKxiDefinitionWithoutTrigger(kxiDefName, ownerName) {
    let defName = this.kxiDefinition(kxiDefName, ownerName);

    this.setTriggers("notApplicable", null, null, null, null, null, null, null);
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveBtn).click();
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveBtn).should(
      "not.be.visible",
      { timeout: 8000 }
    );
    return defName;
  }

  /**
   * createKxiDefinitionPartialNotApplicable will create KXI Definition with only Left Trigger Values
   * Right side will be not Applicable without values.
   * this KXI definition will factor in insights Predict Risk Calculations
   * @param {String} kxiDefName is the name of kxi
   * @returns {String} defName it will return the created kxi Definition Name.
   */
  createKxiDefinitionPartialNotApplicable(kxiDefName, ownerName, sectionName='add') {
    let defName = this.kxiDefinition(kxiDefName, ownerName);

    this.setTriggers(
      "partialNotApplicable",
      KXIDefinition[sectionName].targetValue,
      KXIDefinition[sectionName].leftTriggerLvl1,
      KXIDefinition[sectionName].leftTriggerLvl2,
      KXIDefinition[sectionName].leftTriggerLvl3,
      null,
      null,
      null
    );
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveBtn).click();
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveBtn).should(
      "not.be.visible",
      { timeout: 8000 }
    );
    return defName;
  }

  /**
   * updateKriNotApplicable will search and edit the kxi Definition from define KXI and
   * ensure to clicks on Not Applicable to both left, right trigger values and without target
   * @param {String} kriName is the KXI definition name which we want to search and edit
   */

  updateKriNotApplicable(kriName) {
    cy.waitForLoaderToDisappear("myGrid", 50000);
    cy.get(locators.kxi.kxiDefinition.nameSearch, { timeout: 10000 }).clear({
      force: true,
    });
    cy.get(locators.kxi.kxiDefinition.nameSearch, { timeout: 2000 })
      .type(kriName)
      .type("{enter}");
    cy.get(locators.risk.riskAppetite.editRiskAppetite, {
      timeout: 50000,
    }).then((editKxi) => {
      cy.wrap(editKxi).should("have.length", 1, { delay: 200 });
      cy.get(locators.risk.riskAppetite.editRiskAppetite, {
        timeout: 50000,
      }).click({ delay: 800 });
    });

    //clicking on Not Applicable in Left Triggers.
    cy.get(
      locators.kxi.kxiDefinition.kriDefinitionForm.leftTriggerNotApplicable
    ).click({ force: true });

    //clicking on Not Applicable in Right Triggers.
    cy.get(
      locators.kxi.kxiDefinition.kriDefinitionForm.rightTriggerNotApplicable
    ).click({ force: true });

    this.disableTriggers(KXIDefinition.notApplicable.leftTrigger);
    this.disableTriggers(KXIDefinition.notApplicable.rightTrigger);

    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveBtn).click();
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveBtn).should(
      "not.be.visible",
      { timeout: 8000 }
    );
  }

  //clickKxiOption will click & open kxi Option in My taxanomy
  clickKxiOption() {
    cy.get(locators.risk.administration.kri.kxiOption).contains("KxI").click();
  }

  //weightRebalanceOption will open rebalance window when adding kri in this function we are clicking on 'Cancel' btn
  weightRebalanceOption() {
    cy.get(locators.risk.administration.kri.cancelWeightBtn).click();
  }

  /**
   * kriMendatoryFields will check that weight field is mendatory when user add kri
   * @param {String} kxiDefName in kxi Definition Name
   */
  kriMendatoryFields(kxiDefName) {
    this.clickKxiOption();
    this.addKri(kxiDefName);
    cy.get(locators.administration.organizationalHierarchy.saveBtn).click();

    cy.verifyToastMessageText(
      myTaxanomyKri.toastMsg["mendatoryFieldMsg"],
      1000
    );
  }

  /**
   * addKri will add kri in my taxanomy it will save the kri with the given kxi definition
   * @param {*} kxiDefName is kxi Defintion name
   */
  addKri(kxiDefName) {
    cy.get(locators.risk.administration.kri.addKri).click();
    cy.get(locators.risk.administration.kri.selectKxiBtn).click();
    cy.get(locators.risk.administration.kri.searchKxiBtn).then(() => {
      cy.get(locators.risk.administration.kri.kxiNameOnSearch)
        .type(kxiDefName)
        .type("{enter}");
    });
  }

  /**
   * kriWeightCheck will check that user can not add weights in kri more than 100 it will show toast error
   * @param {String} kxiDefName is Kxi Definition name
   */
  kriWeightCheck(kxiDefName) {
    this.clickKxiOption();
    this.addKri(kxiDefName);
    cy.get(locators.risk.administration.kri.kriWeight).type(
      myTaxanomyKri.weightValues.invalidValue
    );
    cy.get(locators.administration.organizationalHierarchy.saveBtn).click();

    cy.verifyToastMessageText(
      myTaxanomyKri.toastMsg["weightValidationMsg"],
      500
    );
  }

  /**
   * sameKriValidation will check that user can not add the same already added kri.
   * @param {String} kxiDefName is Kxi Definition name
   */
  sameKriValidation(kxiDefName) {
    this.clickKxiOption();

    for (let i = 0; i < 2; i++) {
      this.addKri(kxiDefName);
      cy.get(locators.risk.administration.kri.kriWeight).type(
        myTaxanomyKri.weightValues.validValue
      );
      cy.get(locators.administration.organizationalHierarchy.saveBtn).click();
      this.weightRebalanceOption();
    }

    cy.verifyToastMessageText(myTaxanomyKri.toastMsg["sameKriMsg"], 5000);
  }

  /**
   * addRiskApplicablity will add RiskCategories/Risk definitions in Risk insight screen it will mark applicable to the recent created category/def
   * @param {String} riskDefName is Risk Definition name
   * @param {Boolean} nonActiveRiskItem is Boolean it will be (True, MyTaxanomy) and (False, Insight) screens
   */
  addRiskApplicablity(riskDefName,nonActiveRiskItem=false, BU = "BU") {
    cy.clickSubMenuItem("Risk and Control Register", "Risk Register");
    cy.waitForLoaderToDisappear("myGrid", 10000);
    cy.get(locators.risk.riskRegister.ellipsesBtn).click();
    this.rr_ApplicabilityFlyout.clickRiskApplicabilityItem();
    cy.waitForLoaderToDisappear("agGrid", 10000);
    this.rr_ApplicabilityFlyout.selectBU_AF(BU);
    this.rr_ApplicabilityFlyout.searchRiskDefinition_AF(riskDefName);
    if(!nonActiveRiskItem){
      this.rr_ApplicabilityFlyout.clickApplicableCheckbox_AF();
      this.rr_ApplicabilityFlyout.clickSaveBtn_AF();
      this.rr_ApplicabilityFlyout.clickSaveAndCloseBtn_AF();
      cy.wait(2000);
      cy.reload();
      cy.waitForLoaderToDisappear("myGrid", 10000);
    }
  }
}
