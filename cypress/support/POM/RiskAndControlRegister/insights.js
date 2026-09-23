/// <reference types= '../../../support' />
import locators from "../../../fixtures/locators.json";
import dbQueries from "../../../fixtures/RiskAndControlRegister/dbQueries.json";
import { KriMyTaxonomy } from "../RiskModule_PO/KriMyTaxonomy";
import { riskDefName } from "../../../e2e/RiskAndControlRegister/ERMInsights/insights.cy";
import dayjs from "dayjs";

export class LinkedKXI {
  kri = new KriMyTaxonomy();

  /******************************* CLICK METHODS ***************************/

  //==============<<<<<(RISK--CATEGORIES)>>>>>============

  /**
   * clickSubGridCat will open subgrid on Category Level
   * @param {String} kxiDefName is KXI Definition name on KXI category level
   */
  clickSubGridCat(kxiDefName) {
    // this.clickOnLinkedSubGrid(kxiCatName, locators.kxi.insight.linkedKxI.kxiCategorySubGrid)
    this.kri.editRiskCatDef(
      kxiDefName,
      locators.kxi.insight.linkedKxI.kxiCategorySubGrid,
      locators.kxi.insight.linkedKxI.subGridLoc2,
      false
    );
  }

  /**
   * clickSubGridDef will open subgrid on Definition Level
   * @param {String} kxiDefName is KXI Definition name on KXI Definition level
   */

  clickSubGridDef(kxiDefName) {
    cy.waitForLoaderToDisappear("agGrid", 30000);
    this.kri.editRiskCatDef(
      kxiDefName,
      locators.kxi.insight.linkedKxI.kxiDefinitionSubGrid,
      locators.kxi.insight.linkedKxI.subGridLoc2,
      false
    );
  }

  /*
        clickLinkedKXIBtnCat will show all kxi definitions to the users, so 
        user can select and save his desired kxi definition to Risk Category
    */
  clickLinkedKxiBtnCat() {
    cy.get(locators.kxi.insight.linkedKxI.btnLinkedKXICategory).click();
  }

  //============<<<<<(RISK--DEFINITION)>>>>>==============

  /*
        clickLinkedKXIBtnDef will show all kxi definitions to the users, so 
        user can select and save his desired kxi definition to Risk Definition
    */

  clickLinkedKxiBtnDef() {
    cy.get(locators.kxi.insight.linkedKxI.btnLinkedKXIDefinition).click();
  }

  /*
        clickLinkedKXIBtnInstance will show all kxi definitions to the users, so 
        user can select his desired kxi instances to Risk Definition.

        Reason of Creating this function is To unlink previous added kxi definitions
        on Risk Definition
        we need to unCheck the same kxi defintion from the Risk instances as well so it will 
        be removed from the Subgrid
    */
  clickLinkedKxiBtnInstance() {
    cy.get(locators.kxi.insight.linkedKxI.btnLinkedKXIInstance).click();
  }

  /******************************* TYPE METHODS ***************************/

  //These methods are generic and can be use on both Risk Definition/Risk Categories

  /**  
    * selectAndSaveLinkedKxi will search the KXI definition on Link Window for RiskCategory
    *and Risk Definition
    
    *this method will check the visibility of the kxi definition.
    *select and save kxi definition to both Risk Category/Risk Definitions.
    *@param {String} kxiDefName is the name of the KXI definition that we want to add. 
    */
  selectAndSaveLinkedkxi(kxiDefName) {
    cy.waitForLinkedKriLoaderToDisappear(80000);
    cy.get(locators.kxi.insight.linkedKxI.searchKXI)
      .clear({ delay: 3000 })
      .type(kxiDefName);
    cy.get(locators.kxi.insight.linkedKxI.selectKXI)
      .contains(kxiDefName)
      .should("be.visible")
      .click({ delay: 1500 });
    cy.get(locators.kxi.insight.linkedKxI.saveGrid).click({ delay: 500 });
    cy.get(locators.kxi.insight.linkedKxI.saveGrid).should("not.be.visible");
  }

  /**
   * addingValues will verify if weight field of kxis is editable
   * if the field is editable it will insert the weight as given in the {dataValue} parameter
   * else, the kxi is non-threshold kxi and user can not edit its weight
   * this non-threshold kxi will not be factor in Predict Risk Calculation.
   *
   * @param {String} kxiDefName is the name of the kxi definition
   * @param {String} dataValue is the value which user will add in weight field
   * @param {String} parentLocator is the locator of linked kxi definition
   * @param {String} valueLocator is weight field Locator
   * @param {boolean} notApplicable if kxi is non-threshold notApplicable will be True.
   */
  addingValues(
    kxiDefName,
    dataValue,
    parentLocator,
    valueLocator,
    notApplicable
  ) {
    cy.waitForElementToVisible(parentLocator, 6000);
    cy.get(parentLocator, { timeout: 5000 })
      .contains(kxiDefName, { timeout: 5000 })
      .parent()
      .within(() => {
        cy.get(valueLocator).as("valueElement");
      });

    cy.waitForElementToVisible("@valueElement", 10000);

    /* Reason of Wait:
    *harcoded wait is required here, when multiple toast messages were appearing on the screen it was changing the focus
    of the element everytime*/
    cy.wait(2000);

    //Check for the conditions here if non-threshold kxi (notApplicable will be true)
    //else threshold kxi (notApplicable will be false)

    if (notApplicable) {
      cy.get("@valueElement", { timeout: 5000 })
        .should("have.text", "0")
        .dblclick()
        .should("have.class", "ag-cell-not-inline-editing");
    } else {
      cy.get("@valueElement", { timeout: 5000 }).then(($el) => {
        cy.wrap($el).focus().type(dataValue).type("{enter}");
      });
    }
  }

  /**
   * addKxiDataValueOnCat will add the data value in linked kxi data field in Risk Category
   * @param {String} kxiDefName is the kxi definition name
   * @param {String} dataValue is data value which user will input in Data field.
   */
  addKxiDataValueOnCat(kxiDefName, dataValue) {
    this.addingValues(
      kxiDefName,
      dataValue,
      locators.kxi.insight.linkedKxI.addedKxiInSubGridCategory,
      locators.kxi.kxiData.kriColValue,
      false
    );
  }

  /**
   *addKxiWeightValueonCat will add the value in linked kxi weight field in Risk Category
   *@param {String} kxiDefName is the kxi definition name
   *@param {String} weightValue is weight value which user will input in weight field
   */

  addKxiWeightValueOnCat(kxiDefName, weightValue) {
    this.addingValues(
      kxiDefName,
      weightValue,
      locators.kxi.insight.linkedKxI.addedKxiInSubGridCategory,
      locators.kxi.insight.linkedKxI.kxiWeightField,
      false
    );
  }

  //****************************(RISK--DEFINITION)******************************************** */
  /**
   * unSelectKxionDef will click on (Link a KRI on Risk Definition) btn
   * Search with kxi Definition name,Unselect already selected Definition and clicks on save
   *
   * Unselecting from Risk instances:
   * it will click on (Link a KRI on Risk Instance) btn
   * Search with kxi Definition name, unselect already selected Definition and clicks on save
   *
   * @param {String} kxiDefName is the name of the kxi definition that we want to select
   */

  unSelectKxionDef(kxiDefName) {
    this.clickLinkedKxiBtnDef();
    this.selectAndSaveLinkedkxi(kxiDefName);

    this.clickLinkedKxiBtnInstance();
    this.selectAndSaveLinkedkxi(kxiDefName);
  }

  /**
   * selectKxionDef will click on (Link a KRI on Risk Definition) btn
   * Search with kxi Definition name and save the selections.
   * @param {String} kxiDefName is the name of the kxi definition that we want to select
   */

  selectKxionDef(kxiDefName) {
    this.clickLinkedKxiBtnDef();
    this.selectAndSaveLinkedkxi(kxiDefName);
  }

  /**
   * addKxiDataValueOnDef will add the data value in linked kxi weight field
   * @param {String} kxiDefName is the kxi definition name
   * @param {String} dataValue is data value which user will input in Data field.
   */
  addKxiDataValueOnDef(kxiDefName, dataValue) {
    this.addingValues(
      kxiDefName,
      dataValue,
      locators.kxi.insight.linkedKxI.addedKxiInSubGridDefinition,
      locators.kxi.kxiData.kriColValue,
      false
    );
  }

  /**
   *addKxiWeightValueonDef will add the value in linked kxi weight field
   *@param {String} kxiDefName is the kxi definition name
   *@param {String} weightValue is weight value which user will input in weight field
   */

  addKxiWeightValueOnDef(kxiDefName, weightValue) {
    this.addingValues(
      kxiDefName,
      weightValue,
      locators.kxi.insight.linkedKxI.addedKxiInSubGridDefinition,
      locators.kxi.insight.linkedKxI.kxiWeightField,
      false
    );
  }

  /**
   * checkForWeightonDef will check that for non-threshold linked kxi the weight field is not editable
   * also it will have '0' weight value when added in grid.
   * @param {String} kxiDefName is kxi definition name
   * @param {String} weightValue is weight value
   */
  checkForWeightOnDef(kxiDefName, weightValue) {
    this.addingValues(
      kxiDefName,
      weightValue,
      locators.kxi.insight.linkedKxI.addedKxiInSubGridDefinition,
      locators.kxi.insight.linkedKxI.kxiWeightField,
      true
    );
  }

  //****************************(RISK--CATEGORY)******************************************** */
  /**
   * selectKxionCat will click on (Link a KRI on Risk Category) btn
   * Search with kxi Definition name and save the selections.
   * @param {String} kxiDefName is the name of the kxi definition that we want to select
   */
  selectKxionCat(kxiDefName) {
    this.clickLinkedKxiBtnCat();
    this.selectAndSaveLinkedkxi(kxiDefName);
  }

  /**
   * on Risk Category Level:
   * unSelectKxionCat will click on (Link a KRI on Risk Category) btn
   * Search with kxi Definition name,Unselect already selected Definition and clicks on save
   * @param {String} kxiDefName is the name of the kxi definition that we want to select
   */
  unSelectKxionCat(kxiDefName) {
    this.clickLinkedKxiBtnCat();
    this.selectAndSaveLinkedkxi(kxiDefName);
  }

  /**
   * checkForWeightonCat will check that for non-threshold linked kxi the weight field is not editable
   * also it will have '0' weight value when added in grid.
   * @param {String} kxiDefName is kxi definition name
   * @param {String} weightValue is weight value
   */

  checkForWeightOnCat(param, Value) {
    this.addingValues(
      param,
      Value,
      locators.kxi.insight.linkedKxI.addedKxiInSubGridCategory,
      locators.kxi.insight.linkedKxI.kxiWeightField,
      true
    );
  }

  /**
   * verifyPredictRisk will verify that recalculated Predict risk is correct and as expected
   * @param {String} expectedlevel is Predict Risk Expected level that given by the user
   * @param {String} expectedpredictRisk is Predict Risk Expected Value that given by the user
   */

  verifyPredictRisk(expectedlevel, expectedpredictRisk) {
    cy.get(locators.kxi.insight.linkedKxI.btnLinkedKXIInstance)
      .parent()
      .find("a")
      .click();
    cy.get(locators.kxi.insight.linkedKxI.predictedRiskValue)
      .invoke("attr", "title")
      .then((title) => {
        //using regex for removing extra spaces and letters
        const regex = /Level:\s*(-?[0-9]+)\s*Predicted Risk:\s*(-?[0-9.]+)/;
        const match = title.match(regex);

        if (match) {
          const level = match[1].trim();
          const predictedRisk = match[2].trim();

          expect(level).to.equal(
            expectedlevel,
            `Expected Level to be ${expectedlevel} but got ${level} in actual`
          );
          expect(predictedRisk).to.equal(
            expectedpredictRisk,
            `Expected Predicted Risk to be ${expectedpredictRisk} but got ${predictedRisk} in actual`
          );
        } else {
          throw new Error("Title Value had not found");
        }
      });
  }

  //Adding Generic Function for reducing Redundency

  // Common reusable function to handle KXI setup and validation
  /**
   * checkKxiWeight is using in almost all the testcases i have created this function so that i dont need to repeat my self
   * some conditions are added in this function
   * when any type category/Definition is selected and selectKri, isEditable is true it will add the kri in insights
   * when any type category/Definition is selected and selectKri, isEditable is false it will not add the kri from the kri subgrid form
   * but check for the weights of already added kri in subgrid insight section
   * @param {String} type this is type of case ("category","definition")
   * @param {String} kxi kxi is kxi name
   * @param {String} data data we want to provide for not adding the data input null in this param
   * @param {String} weight weight value for not adding the weight it will be '0'
   * @param {Boolean} selectKri is boolean it can be (True,False) based on we want to select KRI or not
   * @param {Boolean} isEditable is boolean it can be (True,False) based on we want to add weights or not
   */
  checkKxiWeight = (
    type,
    kxi,
    data,
    weight,
    selectKri = true,
    isEditable = true
  ) => {
    const isCategoryLevel = type === "category";
    const isDefinitionLevel = type === "definition";

    //For True Conditions..
    if (isCategoryLevel && selectKri && !isEditable) {
      this.clickSubGridCat(riskDefName);
      this.selectKxionCat(kxi);
      this.checkForWeightOnCat(kxi, weight); // Check if weight is set properly
    } else if (isCategoryLevel && selectKri && isEditable) {
      this.clickSubGridCat(riskDefName);
      this.selectKxionCat(kxi);
      this.addKxiDataValueOnCat(kxi, data);
    } else if (isDefinitionLevel && selectKri && isEditable) {
      this.clickSubGridDef(riskDefName);
      this.selectKxionDef(kxi);
      this.addKxiDataValueOnDef(kxi, data);
      this.addKxiWeightValueOnDef(kxi, weight);
    }

    // For False Conditions....
    if (isCategoryLevel && !selectKri && !isEditable) {
      this.clickSubGridCat(riskDefName);
      this.checkForWeightOnCat(kxi, 0); // Weight should be 0 for non-threshold KXI
    } else if (isDefinitionLevel && !selectKri && !isEditable) {
      this.clickSubGridDef(riskDefName);
      this.checkForWeightOnDef(kxi, 0);
    }
  };

  /**
   * verifyData will verify that the predicted risk is calculated on category level is added in the dbtable
   * @param {String} localtimeConvert is the current converted local time we will assert based on our current converted time and db server time
   */
  verifyDbData(localTimeConvert) {
    cy.query(dbQueries.predictedRiskCategory).then((res) => {
      res.forEach((element) => {
        localTimeConvert = dayjs(localTimeConvert).format("YYYY-MM-DD HH:mm");
        const dbTime = dayjs(element.createdDate).format("YYYY-MM-DD HH:mm");

        expect(element.createdBy).eq(48619, "User ID");
        // Allowing a margin of error of 1 minute
        const timeDifference = Math.abs(
          dayjs(localTimeConvert).diff(dayjs(dbTime), "minute")
        );
        expect(timeDifference).to.be.lessThan(
          3,
          "Asserting the time of data creation"
        );
        expect(element.predictedRisk).eq(-3);
      });
    });
  }
}
