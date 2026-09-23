import locators from "../../../fixtures/locators.json";

class InherentRiskCalculation {

  /**
   * it searches and selects the given customer from the customer filter in (Customer profile None Space) and scrolls to reach to the features section to toggle them.
   * @param {string} customerName - name of the customer to search in Customer filter modal
   * @param {string} applyText - text of the apply button to click on Apply button in customer filter modal
   * @param {string} scroll - value to scroll to after selecting customer in Customer Profile page
   */
  searchCustomer(customerName, applyText, scroll){
    cy.waitForStableGrid(10000);
    cy.get(locators.general.threeElipses).trigger("mouseover");
    cy.get(locators.general.customerFilter).click();   
    cy.get(locators.general.filterNameField).should("be.visible").and("have.length", 1).clear();
    cy.get(locators.general.filterNameField).type(customerName,{delay:100});    
    cy.contains(locators.general.autoSuggestion, customerName).click();    
    cy.contains("button", applyText).click();
    cy.contains("a", customerName).click();
    cy.scrollTo(0, scroll);    
  }

  /**
   * Clicks the warning confirmation button if it appears.
   */
  clickWarningBtn() {
    cy.get(locators.administration.customerProfile.warningYesBtn)
    .should("be.visible")
    .wait(500).click({force: true});
  }

  /**
   * Saves the customer settings by clicking the confirmation button and scrolling to the specified position.
   * @param {string} scroll - The scroll position to navigate to after clicking yes button.
   */
  saveCustomerSettings(scroll){    
    cy.scrollTo(scroll);
    cy.get(locators.risk.riskRegister.saveBtn).click();
  }

  /**
   * Selects answer/label of from the given questsion within a specified iframe.
   * @param {string} ques - The question from which the answer/label is to be selected.
   * @param {string} label - The answer label to select.
   * @param {string} frameType - The type of the iframe (e.g., 'likelihood' or 'impact').
   */
  selectQuestion(ques, label, frameType, frames) {

    const withAssessment = locators.risk.riskRegister.calculations.withAssessment;

    // Map frame types to iframe locators
    const frameMap = {
      [frames.likelihoodFrame]: withAssessment.likelihoodAssessmentFrame,
      [frames.impactFrame]: withAssessment.impactAssessmentFrame,
    };

    const frame = frameMap[frameType];
    if (!frame) {
      throw new Error(`Unsupported frameType: ${frameType}`);
    }

    cy.frameLoaded(frame);
    cy.iframe(frame)
    .find(`${withAssessment.surveyForm} ${withAssessment.formGroup}`)
    .contains(ques).closest(withAssessment.formGroup)
    .find(withAssessment.radioList)
    .find(withAssessment.singleRadio)
    .contains(label).click({ force: true });
}

  /**
   * Submits the survey form within the specified iframe.
   * @param {string} frameType - The type of the iframe (e.g., 'likelihood' or 'impact').
   */
  submitSurveyForm(frameType, refreshGridText, frames) {
    const withAssessment = locators.risk.riskRegister.calculations.withAssessment;

    // Map frame types to iframe locators
    const frameMap = {
      [frames.likelihoodFrame]: withAssessment.likelihoodAssessmentFrame,
      [frames.impactFrame]: withAssessment.impactAssessmentFrame,
    };

    const frame = frameMap[frameType];
    if (!frame) {
      throw new Error(`Unsupported frameType: ${frameType}`);
    }

    cy.frameLoaded(frame);
    cy.iframe(frame)
      .find(withAssessment.submitFormBtn)
      .filter(":visible")
      .click();

    cy.contains(
      locators.risk.riskRegister.controlsuccessMessageToast,
      refreshGridText,
      { timeout: 20000 }
    ).should("be.visible");
  }

  /**
   * Searches for a risk by its name in the risk register
   * @param {string} riskName - Name of the risk to search for. 
   */
  searchRisk(riskName) {
    cy.waitForStableGrid(50000);
    cy.get(locators.risk.riskRegister.riskGridSearchInput)
    .type(riskName)
    .clear()
    .type(riskName);
  }

  /**
   * it validates that the risk with the given name is displayed in the search results.
   * and if not found it throws an error.
   * @param {string} riskName - Name of the risk to validate in Risk Register.
   */
  validateRiskDisplayed(riskName) {
      cy.waitForStableGrid(10000);
      cy.get(locators.risk.riskRegister.searchedRisk)
      .should('be.visible')
      .and('have.length', 1)
      .and('contain.text', riskName);
  }

  /**
   * scrolls the risk register horizontally to a specified percentage.
   * @param {string} percentage - The percentage to scroll to (e.g., "5%").
   */
  scrollRight(percentage){
    cy.get(locators.risk.riskRegister.riskRegisterScrollRight)
    .scrollTo(percentage, { duration: 500 });
  }

  /**
   * Opens a dropdown in the risk register.
   * @param {string} locator - The locator for the dropdown.
   */
  openDropdown(locator){
    cy.waitForStableGrid(10000);
    cy.get(locators.risk.riskRegister[locator])
    .should("be.visible")
    .should('have.length', 1)
    .dblclick();
  }


  /**
   * validates the options present in the likelihood dropdown.
   * @param {string} expectedOptions - The expected options in the dropdown as a concatenated string.
   */
  validateOptionsInDropdown(expectedOptions) {
    cy.get(locators.risk.riskRegister.selectLikelihoodImpactOptions)
      .find(locators.risk.riskRegister.listIndividualOption)
      .then(($options) => {
        cy.wrap($options).invoke("text") .then((text) => {
          expect(text).to.include(expectedOptions);
        });
      }); 
  }

  /**
   * Selects the given value from the opened dropdown.
   * @param {string} optionToSelect - The option to select from the dropdown.
   */
  selectValue(optionToSelect){
    cy.get(locators.risk.riskRegister.selectLikelihoodImpactOptions)
    .find(locators.risk.riskRegister.listIndividualOption)
    .contains(optionToSelect)
    .click();
  }

  /**
   * Validates the label and color of a specific field in the risk register.
   * @param {string} locatorFieldText - The locator field text to identify the element.
   * @param {string} expectedValue - The expected label text.
   * @param {string} colorClass - The expected color class.
   */
   validateLabelAndColor(locatorFieldText, expectedValue, colorClass){
    const locator = locators.risk.riskRegister[locatorFieldText];
    cy.get(locator)
    .should('be.visible')
    .and('have.length', 1)
    .should(($el) => {
      const actualText = $el.text().trim();
      expect(actualText).to.equal(expectedValue);
    });

    cy.get(locator)
    .should('have.class', colorClass);
  }

 /**
   * Clicks on the Risk Analysis Dimensions tab.
   */
  clickRiskAnalysisDimensionsTab(text){
    cy.contains(locators.risk.riskRegister.link, text).click();
  }

  /**
   * Updates the inherent value in Risk Analysis Dimensions.
   * @param {string} newValue - The new value to set.
   */
  updateRiskAnalysisDimension(oldVal, newVal){
    const locator = locators.risk.administration.riskAnalysisDimensions.inherentValueInput.replace("${value}", oldVal)
    cy.get(locator).click();
    this.clearAndType(newVal);
  }

   /**
   * Clicks the save button in Risk Analysis Dimensions.
   */
  clickSaveButton(saveText){
    cy.get(locators.risk.riskRegister.saveBtn)
    .filter(":visible").should("have.length", 1).click();
    cy.get(locators.risk.riskRegister.controlsuccessMessageToast, {timeout: 10000})
    .should("contain.text", saveText);
  }

  /**
   * Types a value into the control strength combobox.
   * @param {string} value - The value to type.
   */
  typeControlStrengthValue(value){
    cy.waitForStableGrid(10000);
    cy.get(locators.risk.riskRegister.controlSearchCombo)
    .filter(":visible")
    .should("have.length", 1)
    .type(value + "{enter}");
    cy.get(locators.risk.riskRegister.implementedValue).click();
  }

   /**
   * types efficacy/implemented value for a risk.
   * @param {string} locator - The locator of the field to update.
   * @param {string} value - The efficacy or implemented value to set.
   */
    typeEfficacyImplementedValue(locator, value){
    cy.waitForStableGrid(10000);
    cy.get(locators.risk.riskRegister[locator])
    .should('be.visible')
    .dblclick();
    this.clearAndType(value);
  }

  /**
   * A utility to clears the focused input field and types a new value followed by an enter key.
   * @param {string} value - The value to type into the input field.
   */
  clearAndType(value){
     cy.focused().clear()
    .type("{selectall}{backspace}")
    .type(value + '{enter}');
  }

  /**
  * Fetches the risk data for a specific customer and risk ID from the database.
  * @param {number} customerId - The ID of the customer.
  * @param {number} riskId - The ID of the risk.
  * @returns {Promise<Object>} - A promise that resolves to a single risk data object (first row).
  */
  getRiskFromDB(customerId, riskId) {

  const sql = "SELECT * FROM riskregisteroverallanalysis WHERE customerId = ? and riskId = ?";
  return cy.query(sql, [customerId, riskId]).then((res) => {
    expect(res, `Risk data query result for customerId: ${customerId}, riskId: ${riskId}`)
      .to.have.length.greaterThan(0);
    return res[0]; // Return the first row (risk data object)
  });
  }

}

export default InherentRiskCalculation;