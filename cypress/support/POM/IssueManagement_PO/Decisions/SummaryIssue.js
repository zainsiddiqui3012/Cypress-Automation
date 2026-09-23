import { time } from "console";

const locators = require("../../../../fixtures/locators.json");
const testData = require("../../../../fixtures/IssueManagementDecisions/Decisions/CreateIssueSetupData.json");
const path = require("path");
const fs = require("fs");

export default class SummaryIssue {
  /**
   * Verify that the status has changed to the expected value
   * @param {string} expectedStatus - The expected status text (e.g., 'In Progress', 'Closed')
   * @param {number} timeout - Timeout for verification
   */
  verifyStatusChanged(expectedStatus, timeout = 30000) {
    cy.wait(5000); // Wait for 5 seconds to allow status update to reflect
    const statusLocator = locators.issueManagement.issueDashboard.createIssue.summaryScreen.dataCompIdStatusValidation;
    
    cy.switchToIframe(locators.kxi.decisionTask.decisionFrame)
      .find(statusLocator, { timeout })
      .should('be.visible')
      .should('contain.text', expectedStatus);
  }
  
  /**
   * Change issue status
   * @param {string} buttonText - Button text to click
   * @param {number} timeout - Timeout for finding button
   */
  changeStatus(buttonText, timeout = 30000) {
    // Find and click the button
    cy.switchToIframe(locators.kxi.decisionTask.decisionFrame)
      .contains('button', buttonText, { timeout })
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true });
  }
  
  /**
   * Verify buttons are visible
   * @param {string|string[]} buttonText - Button(s) to verify
   * @param {number} timeout - Timeout
   */
  verifyButtonVisibility(buttonText, timeout = 30000) {
    const buttons = Array.isArray(buttonText) ? buttonText : [buttonText];
    
    cy.switchToIframe(locators.kxi.decisionTask.decisionFrame, { timeout }).then($iframe => {
      buttons.forEach(text => {
        if (text === "Attach Files") {
          // Special handling for Attach Files button
          cy.wrap($iframe)
            .find('button', { timeout })
            .then($buttons => {
              const $attachButtons = Cypress.$($buttons).filter((i, el) => {
                const btnText = Cypress.$(el).text().trim().toLowerCase();
                return btnText.includes('attach') && btnText.includes('file');
              });
              
              expect($attachButtons.length).to.be.greaterThan(0, locators.issueManagement.issueDashboard.createIssue.summaryScreen.attachFilesButtonNotFound);
            });
        } else {
          // Standard button verification
          cy.wrap($iframe)
            .contains('button', text, { timeout })
            .should('be.visible')
            .and('not.be.disabled');
        }
      });
    });
  }

  /**
   * Extract the issue ID from the specific silverLabel element and save it to a file
   * @returns {Cypress.Chainable<string>} - The issue ID
   */
  extractIssueId() {
    const config = testData.issueIdManagement;
    
    return cy.switchToIframe(locators.kxi.decisionTask.decisionFrame)
      .find(locators.issueManagement.issueDashboard.createIssue.summaryScreen.issueid)
      .should('be.visible')
      .invoke('text')
      .then(text => {
        
        // Use regex pattern from JSON configuration
        const regex = new RegExp(config.patterns.issueRegex, 'i');
        const match = text.match(regex);
        
        if (match && match[1]) {
          const issueId = match[1];
          
          // Create temp directory and save the issue ID using paths from config
          cy.exec(`if not exist "${config.filePaths.tempDirectory}" mkdir "${config.filePaths.tempDirectory}"`, { failOnNonZeroExit: false })
            .then(() => {
              cy.writeFile(config.filePaths.fullPath, issueId);
            });
          
          return cy.wrap(issueId);
        } else {
          const errorMessage = config.messages.extractionError.replace('{text}', text);
          throw new Error(errorMessage);
        }
      });
  }

  /**
   * Navigate to an issue by its ID - uses dashboard search
   * Reads the issue ID from the saved file and searches for it
   */
  navigateToIssueById() {

    //Blocker for Automation ticket created https://360factors.atlassian.net/browse/PD-43956

    // cy.wait(50000); // Wait for 50 seconds to ensure the issue is created and searchable
    // // Lag time Bug reporeted - sometimes the issue is not immediately searchable after creation
    // const config = testData.issueIdManagement;
    
    // // Read the saved issue ID from file
    // cy.readFile(config.filePaths.fullPath).then(issueId => {
      
    //   // Switch to iframe and click search icon
    //   cy.switchToIframe(locators.kxi.decisionTask.decisionFrame)
    //     .find(locators.issueManagement.issueDashboard.createIssue.summaryScreen.searchIcon, { 
    //       timeout: config.timeouts.searchIcon 
    //     })
    //     .should('be.visible', config.timeouts.searchIcon)
    //     .click();
        
    //   // Clear search input and enter the issue ID using format from config
    //   const searchText = config.patterns.searchFormat
    //     .replace('{issueId}', issueId)
    //     .replace('{enter}', '{enter}');

    //   cy.wait(50000); // Lag Time Issue  
        
    //   cy.switchToIframe(locators.kxi.decisionTask.decisionFrame)
    //     .find(locators.issueManagement.issueDashboard.createIssue.summaryScreen.searchInput)
    //     .should('be.visible')
    //     .clear()
    //     .type(searchText);
      
      // Wait for search results and click

      // cy.wait(50000); // Lag Time Issue
      // cy.switchToIframe(locators.kxi.decisionTask.decisionFrame)
      //   .find(locators.issueManagement.issueDashboard.createIssue.summaryScreen.searchResults, {
      //     timeout: config.timeouts.searchResults
      //   })
      //   .should('be.visible')
      //   .click();
    //});

    //I have added new technique for accessing the ticket now

    cy.switchToIframe(locators.kxi.decisionTask.decisionFrame)
        .find(locators.issueManagement.issueDashboard.createIssue.summaryScreen.withoutsearch, {
          timeout: 60000
        })
        .first()
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
  }  

  /**
   * Handles the Root Cause popup that appears when clicking Contain button
   * @param {string} rootCauseValue - The root cause value to select (default: "Others")
   */
  handleRootCausePopup(rootCauseValue) {
    cy.log(`=== HANDLING ROOT CAUSE POPUP - SELECTING: ${rootCauseValue} ===`);
    
    // Wait for the popup to appear
    cy.switchToIframe(locators.kxi.decisionTask.decisionFrame).find(locators.issueManagement.issueDashboard.createIssue.summaryScreen.rootCauseDropdown, { timeout: 10000 })
        .should('be.visible').click().type(rootCauseValue + '{enter}');
    
    // Click Save button
    cy.switchToIframe(locators.kxi.decisionTask.decisionFrame).find(locators.issueManagement.issueDashboard.createIssue.summaryScreen.rootCausePopupSaveButton)
        .should('be.visible')
        .click();
    
    // Wait for popup to close
    cy.switchToIframe(locators.kxi.decisionTask.decisionFrame).find(locators.issueManagement.issueDashboard.createIssue.summaryScreen.rootCauseDropdown, { timeout: 5000 })
        .should('not.exist');
    
    cy.log(`=== ROOT CAUSE POPUP HANDLED SUCCESSFULLY ===`);
  }

  /**
   * Changes status to Contained (with Root Cause popup handling)
   * @param {string} buttonText - The button text to click
   * @param {string} rootCauseValue - The root cause value to select
   */
  changeStatusToContained(buttonText, rootCauseValue) {
    cy.log(`=== CHANGING STATUS TO CONTAINED WITH ROOT CAUSE: ${rootCauseValue} ===`);
    
    // Click the Contain button
    this.changeStatus(buttonText);
    
    // Handle the Root Cause popup
    this.handleRootCausePopup(rootCauseValue);
    
    cy.log(`=== STATUS SUCCESSFULLY CHANGED TO CONTAINED ===`);
  }

  /**
   * Handles the Comment popup that appears when clicking Cancel button
   * @param {string} commentText - The comment text to enter
   */
  handleCommentPopup(commentText) {
    cy.log(`=== HANDLING COMMENT POPUP - ENTERING: ${commentText} ===`);
    
    // Wait for the comment popup to appear and enter text
    cy.switchToIframe(locators.kxi.decisionTask.decisionFrame).find(locators.issueManagement.issueDashboard.createIssue.summaryScreen.CommentTextArea, { timeout: 100000 })
        .first().should('be.visible')
        .clear()
        .type(commentText);
    
    // Click Save button
    cy.switchToIframe(locators.kxi.decisionTask.decisionFrame).find(locators.issueManagement.issueDashboard.createIssue.summaryScreen.rootCausePopupSaveButton)
        .should('be.visible')
        .click();
    
    // Wait for popup to close
    cy.switchToIframe(locators.kxi.decisionTask.decisionFrame).find(locators.issueManagement.issueDashboard.createIssue.summaryScreen.CommentTextArea, { timeout: 5000 })
        .should('not.exist');
    
    cy.log(`=== COMMENT POPUP HANDLED SUCCESSFULLY ===`);
  }

  /**
   * Changes status to Cancelled (with Comment popup handling)
   * @param {string} buttonText - The button text to click
   * @param {string} commentText - The comment text to enter
   */
  changeStatusToCancelled(buttonText, commentText) {
    cy.log(`=== CHANGING STATUS TO CANCELLED WITH COMMENT: ${commentText} ===`);
    
    // Click the Cancel button
    this.changeStatus(buttonText);
    
    // Handle the Comment popup
    this.handleCommentPopup(commentText);
    
    cy.log(`=== STATUS SUCCESSFULLY CHANGED TO CANCELLED ===`);
  }

  /**
   * Changes status to Accept Risk (with Comment popup handling)
   * @param {string} buttonText - The button text to click
   * @param {string} commentText - The comment text to enter
   */
  changeStatusToAcceptRisk(buttonText, commentText) {
    cy.log(`=== CHANGING STATUS TO ACCEPT RISK WITH COMMENT: ${commentText} ===`);
    
    // Click the Accept Risk button
    this.changeStatus(buttonText);
    
    // Handle the Comment popup
    this.handleCommentPopup(commentText);
    
    cy.log(`=== STATUS SUCCESSFULLY CHANGED TO ACCEPT RISK ===`);
  }

}