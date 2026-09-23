import locators from "../../../fixtures/locators.json"

class RiskRegister{

  /**
  * entering the given risk definition tha comes from test data to filter the risk definition
  * need to wait before clearing to get the UI stable, else it concatenates garbage (with previous auto entered value)
  * @param {string} riskDefinition - the name of the risk definition to be entered in search box
  */
  enterRiskDefinition(riskDefinition){
    cy.wait(2000);
    cy.get(locators.risk.riskRegister.riskSearchTexBoxGrid).eq(0)
    .should('be.visible').and('be.enabled')
    .clear()
    .invoke("val", "");
    cy.get(locators.risk.riskRegister.riskSearchTexBoxGrid).eq(0)
    .type(riskDefinition)
    .should('have.value', riskDefinition);
  }

  /**
  * expanding category definition icon only if its not already expanded
  * (need to wait for proper result, as there are hidden icons as well)
  * @param {number} categoryIconLength - the number of category icons when all are collapsed
  */
  expandCategoryIfNotAlready(categoryIconLength){
    cy.wait(1000);
    cy.get(locators.risk.riskRegister.categoryIcon)
    .then(($icons) => {
        if($icons.length == categoryIconLength){
          cy.wrap($icons).eq(1).click();
        }
    });    
  }

  // expand ellipses to select controls option
  expandEllipses(){
    cy.get(locators.risk.riskRegister.ellipsesButton)
    .eq(0)
    .should("be.visible")
    .click(); 
  }

  // select controls from ellipses option
  selectControlsFromEllipsesOption(){
    cy.get(locators.risk.riskRegister.controlsInEllipses)
    .click({force: true});  // clicked other ellipses button without force    
  }

  /** 
  * this function will check if any control is linked with risk definition or not and close the Contro window.
  * it iterates through all the headings on Control page to find Control Instances heading then looks for records under it
  * to find the text "No record found." which indicates no control is linked then wraps true/false accordingly
  * and finally it closes the Control window. the caller function will use the alias to decide whether to link control or not
  * @param {string} controlInstanceRecordStatus - the text that indicates no control is linked
  * @param {string} controlFoundAlias - the alias name to save the result true/false to use later in caller function
  */
  checkIfAnyControlIsLinked(controlInstanceRecordStatus, controlFoundAlias) {
    cy.frameLoaded(locators.risk.riskRegister.controlFlyoverFrame);
    return cy.iframe(locators.risk.riskRegister.controlFlyoverFrame)
      .find(locators.risk.riskRegister.controlInstanceHeadCaption)
      .each(($heading) => {
        const text = $heading.text().trim();
        if(text.includes(locators.risk.riskRegister.controlInstanceHeading)){
          cy.wrap($heading).parents(locators.risk.riskRegister.controlInstanceHead)
          .find(locators.risk.riskRegister.controlInstanceBody)
          .then(($body) => {
            const text = $body.text().trim();
            const controlFound = text !== controlInstanceRecordStatus;
            // saving result to alias to use later
            cy.wrap(controlFound).as(controlFoundAlias);
            this.closeControlModal();
          })
        }
      });
  }

  // close the Control modal
  closeControlModal(){
    cy.get(locators.risk.riskRegister.controlModal)
    .should('be.visible').click();
  }

  /**
  * this function receives control type and control value from test data file
  * and links the control by calling multiple functions and passing these parameters
  * to those functions which will use these values to select control type and search control definition
  * finally it will link the control definition with risk definition
  * @param {string} scrollRight - the value to scroll right to see the tree icon
  * @param {string} linkControlInstanceText - the text to identify Link Control Instance option
  * @param {string} controlType - the control type to be selected from control type list
  * @param {string} control - the control definition to be searched and linked  
  */
  linkControl(scrollRight, linkControlInstanceText, controlType, control) {
    this.scrollAndexpandTree(scrollRight);
    this.linkControlInstance(linkControlInstanceText);
    this.clickSelectTypes();
    this.selectControlType(controlType);
    this.searchControlDefinition(control);
    this.selectFilteredControlDefinition();
    this.clickLinkButton();
    this.clickOKButton();
  }

  /**
  * scrolling right and expanding the tree icon to click Link Control Instance
  * @param {string} scrollRight - the value to scroll right to see the tree icon
  */
  scrollAndexpandTree(scrollRight){
    cy.get(locators.risk.riskRegister.scrollHorizontal)
    .scrollTo(scrollRight)
    .then(() => {
      cy.get(locators.risk.riskRegister.controlsTreeIcon)
        .click();
    });
  }

  /**
  * clicking Link Control Instance
  * @param {string} linkControlInstanceText - the text to identify Link Control Instance option
  */
  linkControlInstance(linkControlInstanceText){
    cy.contains(linkControlInstanceText)
    .click();
  }

  // clicking Select Types. need to wait so the list is shown properly otherwise fails sometimes
  clickSelectTypes(){
    cy.wait(1000);
    cy.get(locators.risk.riskRegister.controlInstanceTypes)
    .click();    
  }

  /**
  * this function receives the controlType from 'linkControl' function 
  * and selects given control type from the list dynamically
  * @param {string} controlType - the control type to be selected from control type list
  */
  selectControlType(controlType){ 
    cy.get(locators.risk.riskRegister.controlInstanceTypesList)
    .should("be.visible")
    .each(($ele) => {
     const text = $ele.text();
     if(text.includes(controlType)){
      cy.wrap($ele).should("be.visible").click();
     }
    })
  }

  
  /**
   * it searches for the given control definition that received from 'linkControl' function
   * @param {string} control - the control definition to be searched
   */
  searchControlDefinition(control){
    cy.get(locators.risk.riskRegister.controlDefinitionSearch)
    .should("be.visible")
    .type(control);
  }

  // selecting the filtered control definition
  selectFilteredControlDefinition(){
    cy.wait(1000); // waiting for the search result to be shown properly
    cy.get(locators.risk.riskRegister.controlDefinitionCheckbox)
    .eq(0).should("be.visible").check();
  }

  // click Link button after selecting control definition
  clickLinkButton(){
    cy.get(locators.risk.riskRegister.controlLinkButton)
      .should("be.visible")
      .click();
  }

  // this method will click OK button only when its shown in Modal after clicking Link button
  clickOKButton(){
    // First, wait a bit for the UI to stabilize
    cy.wait(1000);
    
    // Check if the OK button is visible (not just present in DOM)
    cy.get(locators.risk.riskRegister.controlOKButton).then(($okButton) => {
      if ($okButton.is(':visible')) {
        if (!$okButton.prop('disabled')) {
          cy.wrap($okButton).click();
        } 
      } 
    });
  }

  /**
  * this function receives the successMessage text from test file 
  * and verifies the success message after control has been linked
  * @param {string} successMessage - the success message text to be verified
  */ 
  verifySuccessMessage(successMessage){
    cy.get(locators.risk.riskRegister.controlsuccessMessageToast)
    .should('be.visible').contains(successMessage);
  }

  /**
  * this function receives the values for effectiveness, implemented, weight & Control Strength
  * from test file and pass these values to respective functions 
  * to enters these values in respective fields in Control details grid
  * @param {string} scrollRight - the value to scroll right to see the fields in grid
  * @param {string} effectivenessVal - the effectiveness value to be entered in Effectiveness field
  * @param {string} implementedVal - the implemented value to be entered in Implemented field
  * @param {string} weightVal - the weight value to be entered in Weight field
  * @param {string} controlStrengthVal - the control strength value to be selected in Control Strength field
  */
  enterControlDetails(scrollRight, effectivenessVal, implementedVal, weightVal, controlStrengthVal){
    cy.get(locators.risk.riskRegister.subGridHorizontalScroll)
    .should('be.visible').scrollTo(scrollRight)
    .then(() => {
      this.openAndSelectControlStrength(controlStrengthVal);
      this.typeEffectiveness(effectivenessVal);
      this.typeImplemented(implementedVal);
      this.typeWeight(weightVal);
    });
  }
  
  /**
   * this function receives the effectiveness value from 'enterControlDetails' function
   * and types the value in Effectiveness field
   * @param {string} effectivenessVal - the effectiveness value to be entered in Effectiveness field
   */
  typeEffectiveness(effectivenessVal){
    cy.wait(1000); // wait required as UI refreshes at this moment, so incorrect value will be input without wait
    cy.get(locators.risk.riskRegister.controlGridCell.replace(locators.risk.riskRegister.controlGrid, locators.risk.riskRegister.effectivenessColumn)).dblclick();
    cy.get(locators.risk.riskRegister.controlGridCell.replace(locators.risk.riskRegister.controlGrid, locators.risk.riskRegister.effectivenessColumn)).type(effectivenessVal+"{enter}");
  }

  /**
   * this function receives the implemented value from 'enterControlDetails' function
   * and types the value in Implemented field
   * @param {string} implementedVal - the implemented value to be entered in Implemented field
   */
  typeImplemented(implementedVal){
    cy.wait(1000); // wait required as UI refreshes at this moment, so incorrect value will be input without wait
    cy.get(locators.risk.riskRegister.controlGridCell.replace(locators.risk.riskRegister.controlGrid, locators.risk.riskRegister.implementedColumn)).dblclick();
    cy.get(locators.risk.riskRegister.controlGridCell.replace(locators.risk.riskRegister.controlGrid, locators.risk.riskRegister.implementedColumn)).type(implementedVal+"{enter}"); 
  }

  /**
   * this function receives the weight value from 'enterControlDetails' function
   * and types the value in Weight field
   * @param {string} weightVal - the weight value to be entered in Weight field
   */
  typeWeight(weightVal){
    cy.wait(1000); // wait required as UI refreshes at this moment, so incorrect value will be input without wait
    cy.get(locators.risk.riskRegister.controlGridCell.replace(locators.risk.riskRegister.controlGrid, locators.risk.riskRegister.weightColumn)).dblclick();
    cy.get(locators.risk.riskRegister.controlGridCell.replace(locators.risk.riskRegister.controlGrid, locators.risk.riskRegister.weightColumn)).type(weightVal+"{enter}");  
  }

  /**
   * this function receives the control strength value from 'enterControlDetails' function
   * and it opens and selects control strength options
   * @param {string} controlStrengthText - the control strength value to be selected in Control Strength field
   */
  openAndSelectControlStrength(controlStrengthText) {
    cy.get(locators.risk.riskRegister.controlGridCell.replace(locators.risk.riskRegister.controlGrid, locators.risk.riskRegister.controlStrengthColumn))
    .should('be.visible').click().focus()
    .then(() => {    
      cy.get(locators.risk.riskRegister.controlStrengthItems)
        .contains(controlStrengthText)
        .should('be.visible') 
        .click();                       
    });
  }

  // force:true is used as sometimes it is covered by another element because of UI refreshing at that moment
  closeGrid(){
    cy.get(locators.risk.riskRegister.closeGridButton)
    .should('be.visible').click({force:true});
  }

  /**
   * this function receives the control strength value from 'enterControlDetails' function
   * and validates the calculated value shown in Control Strength label
   * @param {string} controlStrengthVal - the control strength value to be validated
   */
  validateLinkedControlCalculatedValue(controlStrengthVal){
    cy.get(locators.risk.riskRegister.controlStrengthLabel)
    .should("be.visible")
    .then(($controlStrength) => {
      const text = $controlStrength.text().trim();
      expect(text).to.be.equal(controlStrengthVal);
    });   
  }

  /**
   * this function receives the scrollLeft value and scrolls the horizontal container to the left
   * @param {string} scrollLeft - the value to scroll left to search more the risk definition
   */
  scrollToLeft(scrollLeft){
    cy.get(locators.risk.riskRegister.scrollHorizontal)
    .should('be.visible').scrollTo(scrollLeft);
  }
}

export default RiskRegister;