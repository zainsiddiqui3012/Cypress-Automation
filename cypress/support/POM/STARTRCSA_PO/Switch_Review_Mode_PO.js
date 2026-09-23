import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';
import locators from '../../../fixtures/locators.json';
import RiskRegister_PO from '../RiskModule_PO/RiskRegister_PO';
const riskRegister_PO = new RiskRegister_PO();
class Switch_Review_Mode_PO{

   switch_Review_Mode_flyer()
   {        
   
      cy.get('a:contains(Switch to Review Mode)').click();
         cy.wait(10000);
   } 

   validate_Switch_Review_Mode_Flyer()
   {
      cy.wait(5000);
      cy.get('div#confirm-review-mode-modal > div > div > div:first-child > h5').should('be.visible');
   }

   validate_toggle_btn()
   {
      cy.get('label.btn.btn-primary.toggle-on#close').contains('Closed').should('be.visible');
   }

   validate_cancel_functionality()
   {
      cy.get('#confirm-review-mode-modal #cancelModalId').click({force: true});
      cy.wait(2000);
      cy.get('div#confirm-review-mode-modal > div > div > div:first-child > h5').should('not.be.visible');
   }

   riskReviewIDMustArrangeInAscendingOder()
   {

         // Assuming your dropdown element has a specific selector, like 'select#dropdown'
      cy.get('#s2id_riskReviewIds').wait(5000).then($dropdown => {
         // Get the options from the dropdown
         const options = $dropdown.find('option');
      
         // Extract the text values from the options
         const values = options.toArray().map(option => option.text);
      
         // Check if the values are in ascending order
         const isAscending = values.every((value, index) => index === 0 || value >= values[index - 1]);
      
         // Assert that the values are in ascending order
         cy.wrap(isAscending).should('be.true');
      });
   }

   /**
    * Selects an open parent risk review ID from the dropdown.
    * If `invalidRiskReviewName` is true, searches for a random risk review name instead.
    *
    * @param {boolean} [invalidRiskReviewName=false] - Whether to select an invalid risk review name.
    */
   selectOpenParentRiskReviewID(invalidRiskReviewName= false)
   {
      cy.wait(5000);
      cy.get('#s2id_riskReviewIds').should('be.visible').click();
      cy.wait(10000);
      !invalidRiskReviewName
      ? cy.get('ul.select2-results > li:first-child > div:first-child').click({force: true})
      : cy.get(locators.general.riskReviewModeSearchRiskReview).type(Math.random()).type('{enter}');
      cy.wait(5000);
   }

   selectOpenChildRiskReviewID()
   {
      cy.wait(5000);
      cy.get('#s2id_subtaskBuIds').should('be.visible').click();
      cy.wait(10000);
      cy.get('ul.select2-results > li:last-of-type > div:first-child').click({force: true});
      cy.wait(2000);

   }

   clickonclosebtn()
   {
      cy.wait(3000);
      cy.get("#confirm-review-mode-modal #save-change-btn").click({force: true});

   }

   assertSwitchReviewToosterMessage()
   {
      cy.wait(2000);
      cy.get('.toast-message').contains('Switched to Review Mode.').should('be.visible');
      cy.wait(5000);

   }

   /**
    * Validates the functionality of the "Exit Review" tab in the RCSA risk register.
    * - Clicks the "Exit Review" button after ensuring it is visible.
    * - Waits for the grid to stabilize for up to 5 minutes.
    * - Opens the three ellipsis menu.
    * - Verifies that the "Switch Review Mode" button is visible.
    */
   validateExitReviewTab()
   {
      cy.get(locators.risk.riskRegister.rcsa.exitReviewBtn).should('be.visible').click();
      cy.waitForStableGrid(300000);
      riskRegister_PO.threeEllipsisMenu();
      cy.get(locators.risk.riskRegister.rcsa.switchReviewModeBtn).should('be.visible');
   }

   /**
    * Validates the visibility of the edit button (three ellipses) in the review tab,
    * clicks it, and waits for the grid to stabilize.
    *
    * @function
    * @returns {void}
    */
   validateEditReviewTab()
   {
      cy.get(locators.risk.riskRegister.rcsa.editBtnThreeElipses).should('be.visible').click();
      cy.waitForStableGrid(300000);
   }

   /**
    * Validates that all review checkboxes in the risk register are disabled.
    * Iterates through each checkbox element and asserts that it has the 'disabled' class.
    *
    * @returns {void}
    */
   validateReviewCheckDisabled(){
   cy.get(locators.risk.riskRegister.rcsa.reviewedCheckbox).each(($element) => {
      cy.wrap($element).should('have.class', 'disabled');
   });
   }

   /**
    * Expands all collapsed risk category rows in the risk register grid.
    * 
    * This method locates all contracted (collapsed) risk category rows within the grid container
    * and clicks their expand icons to expand them. It waits for the expansion animation after each click.
    *
    * @function
    * @returns {void}
    */
   expandClosedRiskCategory(){
      // Find only contracted (collapsed) rows and expand them
      cy.get(locators.risk.riskRegister.rcsa.riskRowGrid,{timeout:20000}).then(($container) => {
         const contractedRows = $container.find(locators.risk.riskRegister.rcsa.riskCategoryCollapsed,{timeout:20000});

         if (contractedRows.length > 0) {
            // Click on each contracted row to expand it
            cy.wrap(contractedRows).each(($row) => {
               // Click on the expand icon to expand the row
               cy.wrap($row).find(locators.risk.riskRegister.rcsa.riskCategoryExpanded).click({force: true});
               cy.wait(1000); // Wait for expansion animation
            });
         }
      });
}

   MarkReviewFromSwitchReviewMode()
   {
      cy.wait(10000);
      cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport').scrollTo('bottomRight');
      cy.wait(5000);

      cy.get('a#reviewBtn[title="Review"]').then(($elements) => {
      const iterations = $elements.length;

      for (let i = 0; i < iterations; i++) {
         //text += cars[i] + "<br>";
       
      cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport').scrollTo('bottomRight');
      cy.wait(10000);
      cy.get('a#reviewBtn[title="Review"]').eq(i).click();
      cy.get('#save-change-btn').first().click();
      cy.wait(1000);
      cy.get('.toast-message').contains('Risk Review Comments saved successfully').should('be.visible'); 
      
   }
         })
   }

   /**
    * Closes all risk reviews by selecting the first option in the dropdown
    * and clicking the close button. Waits for the top message loader to disappear.
    *
    * @function closeAllRiskReviews
    * @returns {void}
    */
   closeAllRiskReviews(){
      cy.get("#closingBuIds")
      .select(0,{force:true})  // Select first option by index
      cy.get("[onclick='closeRiskReview()']").click();
      cy.waitForTopMsgLoaderToDisappear(50000);
   }

   ScrollRight()
   {
      cy.wait(10000);
      cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport').scrollTo('bottomRight');
      cy.wait(10000);
   }


   /**
    * Waits for the risk taxonomy search grid to be fully loaded by asserting
    * that the number of grid result elements is greater than one.
    *
    * @returns {void}
    */
   gridFullyLoaded(){
      cy.get(locators.risk.administration.riskTaxonomies.searchGridResult)
      .should('have.length.greaterThan',1)
   }

   /**
    * Toggles the review modal by clicking the toggle button.
    * Ensures the toggle button is visible before performing the click action.
    *
    * @returns {void}
    */
   toggleReviewModal(){
      cy.get(locators.risk.riskRegister.rcsa.toggleBtn)
      .should('be.visible')
      .click();
   }
}

export default Switch_Review_Mode_PO;