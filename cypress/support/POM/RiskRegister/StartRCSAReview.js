import locators from "../../../fixtures/locators.json";
import dayjs from 'dayjs';

class StartRCSAReview{

    /**
     * Open Start RCSA Review form
     */
    openRCSA(){
        cy.get(locators.risk.riskRegister.startRCSA.ellipses).trigger("mouseover");
        cy.contains(locators.risk.riskRegister.startRCSA.rcsaText).click();
    }

    /**
     * Scroll to the bottom of the page
     */
    scrollBottom(){
        cy.get(locators.risk.riskRegister.startRCSA.confirmModalMessageBody)
        .scrollTo('bottom', { duration: 500 });
    }

    /**
     * Stub window.open to open URL in the same tab
     */
    stubWindowOpen() {
        cy.window().then((win) => {
            cy.stub(win, 'open').callsFake((url) => {
            win.location.href = url;
            });
        });
    }


    /**
     * Validate all fields in the Start RCSA Review form
     */
    validateAllFields(){
        cy.get(locators.risk.riskRegister.startRCSA.submitButton).should('be.visible');
        cy.get(locators.risk.riskRegister.startRCSA.dueDateInput).should('be.visible');
        cy.get(locators.risk.riskRegister.startRCSA.buFilterTypeSelect, { timeout: 10000 }).should('be.visible');
        cy.get(locators.risk.riskRegister.startRCSA.baSelectButton).should('be.visible');
        this.scrollBottom();
        cy.get(locators.risk.riskRegister.startRCSA.baDefSelectDropdown).should('be.visible');
        cy.get(locators.risk.riskRegister.startRCSA.secondBaDefSelectDropdown).should('be.visible');
        cy.get(locators.risk.riskRegister.startRCSA.confirmModalYesButton).should('be.visible');
        cy.get(locators.risk.riskRegister.startRCSA.confirmModalNoButton).should('be.visible');
    }
    
    /**
     * Select current date in Due Date field
     */
    selectDate(){
        const formattedDate = dayjs().format('MM/DD/YYYY');
        cy.get(locators.risk.riskRegister.startRCSA.dueDateInput)
        .type(formattedDate);
    }

    /**
     * Click Yes button on confirmation modal
     */
    clickYesBtn(){
        cy.get(locators.risk.riskRegister.startRCSA.confirmModalYesButton).click();       
    }

    /**
     * Click No button on confirmation modal
     */
    clickNoBtn(){
        cy.get(locators.risk.riskRegister.startRCSA.confirmModalNoButton).click();
    }
    
    /**
     * Click on the close button to close the list
     */
    closeList(){
        cy.get(locators.risk.riskRegister.startRCSA.closeList)
        .filter(":visible").click();
    }

    /**
     * Validate error message displayed in the UI
     * @param {string} msg - expected error message
     */
    validateErrorMsg(msg){
        cy.get(locators.risk.riskRegister.controlsuccessMessageToast, { timeout: 10000 })
        .then(($ele) => {
            const text = $ele.text().trim();
            expect(text).to.equal(msg);
        })
    }

    /**
     * Click Business Unit dropdown
     */
    clickBUDropdown(){
        cy.get(locators.risk.riskRegister.startRCSA.buFilterTypeSelect).click();        
    }

    /**
     * Type Business Unit in the search input
     * @param {string} businessUnit - business unit to type
     */
    typeBU(businessUnit){
        cy.get(locators.risk.riskRegister.startRCSA.searchInput)
        .filter(":visible")
        .type(businessUnit);        
    }
    
    /**
     * Select Business Unit from the list
     * @param {string} businessUnit - business unit to select
     */
    selectBU(businessUnit){
        cy.get(locators.risk.riskRegister.startRCSA.buFilterTypeSelect, {timeout: 30000})
        .click().type(businessUnit + "{enter}");
    }

    /**
     * Unselect Business Unit from the list
     * @param {string} businessUnit - business unit to unselect
     */
    unSelectBU(businessUnit){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible")
        .contains(businessUnit).click();
         cy.get(locators.risk.riskRegister.startRCSA.checkbox)
        .filter(":visible")
        .should("not.be.checked");
    }

    /**
     * Validate that the Business Unit is selected
     * @param {string} expectedPattern - expected pattern to match
     */
    validateBUSelected(businessUnit){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible").then(($elements) => {
            cy.wrap($elements).invoke("text").then((text) => {
                expect(text.trim()).to.contain(businessUnit);
            });
        });
    }

    /**
     * Validate that the Business Unit is unselected
     * @param {string} expectedText - expected text to match
     */
    validateBUUnSelected(expectedText){
        cy.get(locators.risk.riskRegister.startRCSA.buText)
        .invoke('text').then((text) => {
            expect(text).to.equal(expectedText);
        });
    }
    
    /**
     * Validate that no Business Unit is displayed
     */
    validateNoBUDisplayed(expectedLength){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible")
        .should("have.length", expectedLength);
        this.closeList();
    }

    /**
     * Clear Business Unit search input
     */
    clearBUSearch(){
        cy.get(locators.risk.riskRegister.startRCSA.searchInput)
        .filter(":visible")
        .clear();        
    }

    /**
     * Validate that multiple Business Units are selected
     * @param {string} expectedPattern - expected pattern to match
     */
    validateMultiBUSelected(businessUnit1, businessUnit2){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible").then(($elements) => {   
            cy.log($elements.length);
            cy.wrap($elements).invoke("text").then((text) => {
                expect(text.trim()).to.contain(businessUnit1);
                expect(text.trim()).to.contain(businessUnit2);
            });
        });


    }

    /**
     * Click Business Area dropdown
     */
    clickBADropdown(){
        cy.get(locators.risk.riskRegister.startRCSA.baSelectButton, {timeout: 30000})
        .click({force: true});
    }

    /**
     * Type Business Area in the search input
     * @param {string} businessArea - business area to type
     */
    typeBA(businessArea){
        cy.get(locators.risk.riskRegister.startRCSA.searchInput, {timeout:30000})
        .filter(":visible")
        .type(businessArea);
    }

    /**
     * Select Business Area from the list
     * @param {string} businessArea - business area to select
     */
    selectBA(businessArea){
        cy.get(locators.risk.riskRegister.startRCSA.baSelectButton, {timeout:30000})
        .click().type(businessArea + "{enter}");
        this.clearBASearch();
    } 

    /**
     * Validate that the Business Area is selected
     * @param {string} expectedPattern - expected pattern to match
     */
    validateBASelected(businessArea){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible").then(($elements) => {   
            cy.log($elements.length);
            cy.wrap($elements).invoke("text").then((text) => {
                expect(text.trim()).to.contain(businessArea);
            });
        });
    }

    /**
     * Clear Business Area search input
     */
    clearBASearch(){
        cy.get(locators.risk.riskRegister.startRCSA.searchInput)
        .filter(":visible").clear();
    }

    /**
     * Select multiple Business Units
     * @param {string} businessUnit1 - first business unit
     * @param {string} businessUnit2 - second business unit
     */
    selectMultipleBUs(businessUnit1, businessUnit2){
        cy.get(locators.risk.riskRegister.startRCSA.buFilterTypeSelect, {timeout:30000})
        .click().focused().type(businessUnit1 + "{enter}")
        .focused().clear().type(businessUnit2 + "{enter}").clear();
    }

    /**
     * Select multiple Business Areas
     * @param {string} businessArea1 - first business area
     * @param {string} businessArea2 - second business area
     */
    selectMultipleBAs(businessArea1, businessArea2){
        cy.get(locators.risk.riskRegister.startRCSA.baSelectButton, {timeout:30000})
        .should("be.visible").click()
        .focused().type(businessArea1 + "{enter}")
        .clear().type(businessArea2 + "{enter}").clear();
    }

    /**
     * Click first Business Area Definition dropdown
     */
    clickFirstBADefDropdown(){
        cy.get(locators.risk.riskRegister.startRCSA.baDefSelectDropdown, {timeout:100000}).click();        
    }

    /**
     * Type Business Area Definition in the search input
     * @param {string} businessAreaDefinition - business area definition to type
     */
    typeInFirstBADef(businessAreaDefinition){
        cy.get(locators.risk.riskRegister.startRCSA.searchInput, {timeout:30000})
        .filter(":visible").type(businessAreaDefinition);
    }

    /**
     * Select Business Area Definition from the list
     * @param {string} businessAreaDefinition - business area definition to select
     */
    selectFirstBADef(businessAreaDefinition){
        cy.get(locators.risk.riskRegister.startRCSA.baDefSelectDropdown, {timeout:30000})
        .click().type(businessAreaDefinition + "{enter}");
        cy.get(locators.risk.riskRegister.startRCSA.checkbox)
        .filter(":visible").should("be.checked");
    }

    /**
     * Clear Business Area Definition search input
     */
    clearFirstBADefSearch(){
        cy.get(locators.risk.riskRegister.startRCSA.searchInput)
        .filter(":visible").clear();
    }

    /**
     * Click second Business Area Definition dropdown
     */
    clickSecondBADefDropdown(){    
        cy.get(locators.risk.riskRegister.startRCSA.secondBaDefSelectDropdown).click();
    }

    /**
     * Type Business Area Definition in the search input
     * @param {string} businessAreaDefinition - business area definition to type
     */
    typeInSecondBADef(businessAreaDefinition){
        cy.get(locators.risk.riskRegister.startRCSA.searchInput)
        .filter(":visible").type(businessAreaDefinition);
    }

    /**
     * Select Business Area Definition from the list
     * @param {string} businessAreaDefinition - business area definition to select
     */
    selectSecondBADef(businessAreaDefinition){
        cy.get(locators.risk.riskRegister.startRCSA.secondBaDefSelectDropdown)
        .click().type(businessAreaDefinition + "{enter}");
        cy.get(locators.risk.riskRegister.startRCSA.checkbox)
        .filter(":visible").should("be.checked");    
    }

    /**
     * Clear Business Area Definition search input
     */
    clearSecondBADefSearch(){
        cy.get(locators.risk.riskRegister.startRCSA.searchInput)
        .filter(":visible").clear();        
    }
    
    /**
     * Validate that multiple Business Areas are selected
     * @param {string} expectedPattern - expected pattern to match
     */
    validateMultiBASelected(businessArea1, businessArea2){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible").then(($elements) => {   
            cy.log($elements.length);
            cy.wrap($elements).invoke("text").then((text) => {
                expect(text.trim()).to.contain(businessArea1);
                expect(text.trim()).to.contain(businessArea2);
                    
            });
        });
    }

    /**
     * Select multiple Business Area Definitions
     * @param {string} businessAreaDefinition1 - first business area definition - first value
     * @param {string} businessAreaDefinition2 - first business area definition - second value
     */
    selectMultipleFirstBADs(businessAreaDefinition1, businessAreaDefinition2){
        cy.wait(2000); // wait to ensure dropdown is stable before clicking, otherwise it fails to type full text even with dynamic wait
        cy.get(locators.risk.riskRegister.startRCSA.baDefSelectDropdown, {timeout:30000})
        .should("be.visible").trigger("mouseover").click();
        cy.focused().type(businessAreaDefinition1 + "{enter}");
        cy.focused().clear().type(businessAreaDefinition2 + "{enter}").clear();
    }

    /**
     * Select multiple Business Area Definitions
     * @param {string} businessAreaDefinition1 - second business area definition - first value
     * @param {string} businessAreaDefinition2 - second business area definition - second value
     */
    selectMultipleSecondBADs(businessAreaDefinition1, businessAreaDefinition2){
        cy.get(locators.risk.riskRegister.startRCSA.secondBaDefSelectDropdown,{timeout:30000})
        .click();
        cy.focused().type(businessAreaDefinition1 + "{enter}");
        cy.focused().clear().type(businessAreaDefinition2 + "{enter}").clear();
    }

    /**
     * Validate that the first Business Area Definition is selected
     * @param {string} expectedPattern - expected pattern to match
     */
    validateFirstMultiBADSelected(businessAreaDefinition1, businessAreaDefinition2){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible").then(($elements) => {   
            cy.log($elements.length);
            cy.wrap($elements).invoke("text").then((text) => {
                expect(text.trim()).to.contain(businessAreaDefinition1);
                expect(text.trim()).to.contain(businessAreaDefinition2);
            });
        });
    }

    /**
     * Validate that the second Business Area Definition is selected
     * @param {string} expectedPattern - expected pattern to match
     */
    validateSecondMultiBADSelected(businessAreaDefinition1, businessAreaDefinition2){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible").then(($elements) => {   
            cy.log($elements.length);   
            cy.wrap($elements).invoke("text").then((text) => {
                expect(text.trim()).to.contain(businessAreaDefinition1);
                expect(text.trim()).to.contain(businessAreaDefinition2);
            });
        });
    }

    /**
     * Validate that RCSA review has started
     */
    validateRCSAStarted(){
        cy.get(locators.risk.riskRegister.startRCSA.iFrame, { timeout: 100000 })
        .its(locators.risk.riskRegister.startRCSA.iFrameBody)
        .then(cy.wrap)
        .find(locators.risk.riskRegister.startRCSA.issueLink)
        .should('be.visible');
    }

    /**
     * Validate that the modal is closed
     */
    validateModelClosed(){
        cy.get(locators.risk.riskRegister.startRCSA.modal).should('not.be.visible');
    }

    /**
     * Validate that Business Units are displayed
     */
    validateBUsDisplayed(expectedLength){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible")
        .should("have.length.greaterThan", expectedLength);
        this.closeList(); 
    }

    /**
     * Validate that the searched Business Unit is displayed
     * @param {string} businessUnit - business unit to validate
     */
    validateSearchedBUDisplayed(businessUnit){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible")
        .invoke("text")
        .then((text) => {
            expect(text.trim()).to.contain(businessUnit);
        });
    }
    
    /**
     * Validate that the relevant Business Areas are displayed
     * @param {string} businessArea1 - first business area to validate
     * @param {string} businessArea2 - second business area to validate
     */
    validateRelevantBAsDisplayed(businessArea1, businessArea2){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible")
        .invoke("text")
        .then((text) => {
            expect(text.trim()).to.contain(businessArea1);
            expect(text.trim()).to.contain(businessArea2);
        });
    }

    /**
     * Validate that the updated Business Areas are displayed
     * @param {string} businessArea1 - first business area to validate
     * @param {string} businessArea2 - second business area to validate
     */
    validateUpdatedBAsDisplayed(businessArea1, businessArea2){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible")
        .invoke("text")
        .then((text) => {
            expect(text.trim()).to.not.contain(businessArea1);
            expect(text.trim()).to.contain(businessArea2);
        });        
    }

    /**
     * Validate that the relevant Business Area Definitions are displayed
     * @param {string} businessAreaDefinition1 - first business area definition to validate
     * @param {string} businessAreaDefinition2 - second business area definition to validate
     */
    validateRelevantBADsDisplayed(businessAreaDefinition1, businessAreaDefinition2){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible")
        .invoke("text")
        .then((text) => {
            expect(text.trim()).to.contain(businessAreaDefinition1);
            expect(text.trim()).to.contain(businessAreaDefinition2);
        });
    }

    /**
     * Click first Business Area Definition filter
     */
    clickFirstBADFilter(){
        cy.get(locators.risk.riskRegister.startRCSA.badFilter)
        .eq(0).click();
    }

    /**
     * Select a Business Area Definition type
     * @param {string} type - type of the Business Area Definition
     */
    selectType(type){
        cy.get(locators.risk.riskRegister.startRCSA.baType)
        .filter(":visible").click();
        cy.get(locators.risk.riskRegister.startRCSA.baTypeOption)
        .contains(type).click();
    }

    /**
     * Close the filter
     */
    closeFilter(){
        cy.get(locators.risk.riskRegister.startRCSA.closeFilter)
        .filter(":visible")
        .click(); 
    }

    /**
     * Validate that the Business Area Definitions are displayed
     * @param {string} type - type of the Business Area Definition
     */
    validateBADsType(type){
        cy.get(locators.risk.riskRegister.startRCSA.leftInput)
        .filter(":visible")
        .each(($BAD) => {
            cy.wrap($BAD).invoke("text").then((text) => {
                expect(text.trim().startsWith(type)).to.be.true;
            });
        });        
    }

    /**
     * Unselect all first Business Area Definitions
     */
    unSelectAllFirstBADef(){
        cy.get(locators.risk.riskRegister.startRCSA.selectAll)
        .filter(":visible")
        .click({force: true});
    }

    /**
     * Validate that no first Business Area Definition is selected
     */
    validateNoFirstBADSelected(expectedLength){
        cy.get(locators.risk.riskRegister.startRCSA.checkbox)
        .filter(":visible")
        .filter(":checked")
        .should("have.length", expectedLength);
    }

    /**
     * Validate the subtasks for a specific Business Unit
     * @param {string} businessUnit - the Business Unit to validate
     * @param {string} replacingText - text to replace in the Business Unit
     * @param {string} replaceWith - text to replace with in the Business Unit
     */
    validateSubTasksForBU(businessUnit, replacingText, replaceWith){        
        businessUnit = businessUnit.replace(replacingText,replaceWith);
        cy.get(locators.risk.riskRegister.startRCSA.iFrame, { timeout: 100000 })
        .its(locators.risk.riskRegister.startRCSA.iFrameBody)
        .then(cy.wrap)
        .find(locators.risk.riskRegister.startRCSA.issueLink)
        .eq(0).should('be.visible')
        .invoke("text").then((text) => {   
            expect(text.trim()).to.contain(businessUnit);
        });
    }

    /**
     * Validate that the Business Unit sub-task is opened
     * @param {string} businessUnit - the Business Unit to validate
     * @param {string} replacingText - text to replace in the Business Unit
     * @param {string} replaceWith - text to replace with in the Business Unit
     */
    validateBUSubTaskOpened(businessUnit, replacingText, replaceWith){
        businessUnit = businessUnit.replace(replacingText,replaceWith);
        cy.get(locators.risk.riskRegister.startRCSA.iFrame, { timeout: 100000 })
        .its(locators.risk.riskRegister.startRCSA.iFrameBody)
        .then(cy.wrap)
        .find(locators.risk.riskRegister.startRCSA.summaryVal)
        .should('be.visible');
    }

    /**
     * Click on the Review Business Unit link
     * @param {string} review - the text of the link to click
     */
    clickReviewBusinessUnitLink(reviewText){
        cy.get(locators.risk.riskRegister.startRCSA.iFrame, { timeout: 100000 })
        .its(locators.risk.riskRegister.startRCSA.iFrameBody)
        .should('not.be.empty')
        .then(cy.wrap)
        .contains('a', reviewText)
        .should('have.attr', 'href')
        .then((href) => {
            cy.visit(href);
        });
    }

    /**
     * Validate the Risk Register is in Review Mode
     * @param {string} expected - the expected text to validate
     */
        validateRiskRegisterInReviewMode(){
            this.validateReviewCheckBoxEnabled();
            this.validateNoFilterDisplayed();  
    }

    /**
     * Validate that all Review checkboxes are enabled. This function closed the trees first if there are any expanded.
     * Then, it expands all tree nodes and then validates that all Review checkboxes are enabled.
     */
    validateReviewCheckBoxEnabled(){
        cy.get(locators.risk.riskRegister.startRCSA.treeOpen, {timeout: 30000})
        .filter(":visible")
        .then(($nodes) => {
            if($nodes.length > 0){
                for(let i=0;i<$nodes.length;i++){
                    cy.wrap($nodes[i]).click();
                    cy.wait(1000);
                }
            }
        });

        cy.get(locators.risk.riskRegister.startRCSA.treeClosed, {timeout: 10000})
        .filter(":visible")
        .each(($node) => {
            cy.wait(1000);
            cy.wrap($node).click();
        })

        cy.get(locators.risk.riskRegister.startRCSA.reviewCheck, { timeout: 10000 })
        .filter(':visible') // only visible checkboxes
        .each(($checkbox) => {
            cy.wrap($checkbox)
            .should('not.have.attr', 'disabled'); // validates it doesn’t have disabled attribute
        });
    }

    /**
     * Validate that no filter is displayed
     */
    validateNoFilterDisplayed(){
        cy.get(locators.risk.riskRegister.startRCSA.riskReviewFilters)
        .should("not.be.visible");
    }

    /**
     * Click on the first Review checkbox
     */
    clickReviewCheckBox(){
        cy.get(locators.risk.riskRegister.startRCSA.reviewCheck, {timeout: 30000})
        .eq(0)
        .click();
    }

    /**
     * Click on all Review checkboxes
     */
    clickAllReviewCheckBoxes(){
        cy.get(locators.risk.riskRegister.startRCSA.reviewCheck, {timeout: 30000})
        .each(($checkbox) => {
            cy.wait(1000); // wait to ensure click on all the trees to expand properly
            cy.wrap($checkbox).click();
            this.clickSaveBtn();
        });

        cy.get(locators.risk.riskRegister.startRCSA.modalBUDropdown).first().click();  
        cy.get(locators.risk.riskRegister.startRCSA.selectModalBU).click(); 
    }

    /**
     * Close the modal
     */
    closeModal(){
        cy.get(locators.risk.riskRegister.startRCSA.closeModal).click();
    }

    /**
     * Validate that the comment box is visible
     */
    validateCommentBox(comment){
        cy.wait(2000); // wait to ensure comment box is stable to enter text, otherwise half text is typed and focus is lost even with dynamic wait
        cy.get(locators.risk.riskRegister.startRCSA.commentText, {timeout:10000})
        .should("be.visible")
        .click().type(comment, {delay: 100});
    }

    /**
     * Validate that the entered comment is displayed correctly
     * @param {string} comment - the comment to validate
     */
    validateEnteredComment(comment){
        cy.wait(1000); // wait to ensure comment is saved and displayed before validating it, otherwise it fails intermittently even with dynamic wait
        cy.get(locators.risk.riskRegister.startRCSA.changeExplanation)
        .eq(1).then(($ele) => { 
            const text = $ele.text().trim();
            cy.log(text);
            expect(text).to.contain(comment);
        })
    }

    /**
     * Type comment in the comment box
     */
    clickSaveBtn(){
        cy.get(locators.risk.riskRegister.startRCSA.saveBtn).click();
    }

    /**
     * Validate that the Reviewed status is displayed in the Review column
     */
    validateReviewedStatusInReviewColumn(expectedText, expectedLength){
       cy.get(locators.risk.riskRegister.startRCSA.reviewCheck, {timeout: 100000})
       .filter(":visible")
       .should("have.length", expectedLength);
       this.scrollRight();
       cy.get(locators.risk.riskRegister.startRCSA.riskReviewCol)
       .eq(1).invoke("text")
            .then((text) => {
                expect(text.trim()).to.equal(expectedText);
        });
    }

    /**
     * Scroll to the right side of the Risk Review page
     */
    scrollRight(){
        cy.get(locators.risk.riskRegister.startRCSA.horizontalScroll).eq(1)
       .scrollTo("right", {duration: 500});
    }

    /**
     * Click on the Audit Log link
     * @param {string} audit - the text of the link to click
     */
    clickAuditLog(auditLogText){
        cy.get(locators.risk.riskRegister.startRCSA.iFrame, { timeout: 100000 })
        .its(locators.risk.riskRegister.startRCSA.iFrameBody)
        .should('not.be.empty')
        .then(cy.wrap)
        .contains('a', auditLogText)
        .should('have.attr', 'href')
        .then((href) => {
            cy.visit(href);
        });
    }

    /**
     * Validate that the Audit Log is opened
     */
    validateAuditLogOpened(){
        cy.get(locators.risk.riskRegister.startRCSA.auditLog).should('be.visible');
    }

    /**
     * Validate that the RCSA Task progress is partially or fully completed depending on the input
     * @param {string} progress - the expected progress text to validate
     */
    validateRCSATaskProgress(progress){
        cy.reload();
        cy.get(locators.risk.riskRegister.startRCSA.iFrame, { timeout: 100000 })
        .its(locators.risk.riskRegister.startRCSA.iFrameBody)
        .then(cy.wrap)
        .find(locators.risk.riskRegister.startRCSA.progress)
        .should(($el) => {
          expect($el.text().trim()).to.contain(progress);
        });
    }

    /**
     * Validate that the Business Unit is available
     * @param {string} businessUnit - the Business Unit to validate
     * @param {string} businessUnitText - the text to replace
     * @param {string} riskReviewText - the text to replace with
     */
    validateBUAvailable(businessUnit, businessUnitText, riskReviewText){
        businessUnit = businessUnit.replace(businessUnitText, riskReviewText);
        cy.get(locators.risk.riskRegister.startRCSA.iFrame, { timeout: 100000 })
        .its(locators.risk.riskRegister.startRCSA.iFrameBody)
        .should('not.be.empty')
        .then(cy.wrap)
        .contains('a', businessUnit)
        .should('be.visible');
    }

    /**
     * Click on a Business Unit sub-task
     * @param {string} businessUnit - the Business Unit to validate
     * @param {string} replacingText - the text to replace
     * @param {string} replaceWith - the text to replace with
     */
    clickOnBUSubTask(businessUnit, replacingText, replaceWith){
        businessUnit = businessUnit.replace(replacingText, replaceWith);
        cy.get(locators.risk.riskRegister.startRCSA.iFrame, { timeout: 100000 })
        .its(locators.risk.riskRegister.startRCSA.iFrameBody)
        .then(cy.wrap)              
        .contains('a', businessUnit, { timeout: 30000 }) 
        .should("be.visible")    
        .click();
    }

}

export default StartRCSAReview;