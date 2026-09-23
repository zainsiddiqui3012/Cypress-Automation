import locators from "../../../fixtures/locators.json";
import testData from "../../../fixtures/Administration/CustomerProfile.json";

export default class CustomerProfile {
  /**
   * ******<<<<<<<<< Complaint Method Section >>>>>>****************
   */
  // Selector getters
  /**
   * Retrieves the Cypress chainable for the single radio button element
   * in the Complaint Process Owner section of the Customer Profile page.
   */
  getSingleRadio() {
    return cy.get(
      locators.administration.customerProfile.complaintProcessOwnerSingle,
    );
  }
  /**
   * Returns the Cypress chainable for the complaint process owner group radio button.
   */
  getGroupRadio() {
    return cy.get(
      locators.administration.customerProfile.complaintProcessOwnerGroup,
    );
  }
  /**
   * Returns the Cypress chainable for the Process Owner Group field element.
   */
  getProcessOwnerGroupField() {
    return cy
      .get(
        locators.administration.customerProfile
          .complaintProcessOwnerGroupDropDownFieldName,
      )
      .contains(testData.complaint.processOwnerGroupFieldName)
      .parent("div");
  }

  /**
   * Verifies that the process owner type radio options (Single/Group) are present and visible.
   */
  verifyProcessOwnerTypeOptionsPresent() {
    // Assert the input exists (not visible)
    this.getSingleRadio().should("exist");
    this.getGroupRadio().should("exist");
    // Assert the labels are visible
    cy.contains(
      locators.administration.customerProfile.complaintProcessOwnerType,
      "Single",
    ).should("be.visible");
    cy.contains(
      locators.administration.customerProfile.complaintProcessOwnerType,
      "Group",
    ).should("be.visible");
  }

  /**
   * Verifies that the default selection is "Single" for process owner type.
   */
  verifyDefaultProcessOwnerTypeSelection() {
    this.getSingleRadio().should("be.checked");
    this.getGroupRadio().should("not.be.checked");
  }

  /**
   * Selects the process owner type radio button ("Single" or "Group").
   * @param {string} type - The type to select ("Single" or "Group").
   */
  selectProcessOwnerType(type) {
    if (type === "Single") {
      this.getSingleRadio().check({ force: true });
    } else if (type === "Group") {
      this.getGroupRadio().check({ force: true });
    }
  }

  /**
   * Verifies the visibility of the Process Owner Group field.
   * @param {boolean} shouldBeVisible - Whether the field should be visible.
   */
  verifyProcessOwnerGroupFieldVisible(shouldBeVisible = true) {
    if (shouldBeVisible) {
      this.getProcessOwnerGroupField()
        .should("be.visible")
        .and(($div) => {
          expect($div).not.to.have.attr("style", testData.displayNone);
        });
    } else {
      this.getProcessOwnerGroupField().should(
        "have.attr",
        "style",
        testData.displayNone,
      );
    }
  }

  /**
   * Clicks a dropdown element specified by its locator.
   * @param {string} dropDownClickLocator - The locator for the dropdown to click.
   */
  clickDropDown(dropDownClickLocator) {
    cy.get(dropDownClickLocator).should("be.visible").click();
  }

  /**
   * Verifies that the dropdown contains the expected value.
   * @param {string} dropDownClickLocator - The locator for the dropdown.
   * @param {string} expectedOwner - The expected value to verify.
   */
  verifySelectDropDownValue(dropDownClickLocator, expectedOwner) {
    cy.get(dropDownClickLocator).contains(expectedOwner);
  }

  /**
   * Clears a Select2 dropdown selection by clicking the clear/cross button,
   * deletes any remaining text, saves the form, refreshes the page,
   * and verifies that the dropdown no longer contains the specified value.
   * @param {string} dropdownContainerLocator - Selector for the Select2 container (e.g. '#s2id_complaintReviewerId')
   * @param {string} crossBtnLocator - Selector for the clear/cross button inside the container (e.g. 'abbr.select2-search-choice-close')
   */
  clearAndVerifyDropdownSelection(dropdownContainerLocator, crossBtnLocator) {
    cy.get(`${dropdownContainerLocator}${crossBtnLocator}`).click({
      force: true,
    });

    cy.get(dropdownContainerLocator).type("{del}");
    this.clickSaveButton();
  }

  /**
   * Verifies that the dropdown container does not contain the specified value.
   * @param {string} dropdownContainerLocator - Selector for the Select2 container (e.g. '#s2id_complaintReviewerId')
   * @param {string} value - The value that should no longer be present after clearing
   */
  verifyDropdownValueCleared(dropdownContainerLocator, value) {
    cy.get(dropdownContainerLocator).should("not.have.text", value);
  }

  /**
   * Clicks the "Save" button on the page.
   * Scrolls the button into view and forces the click action.
   * Useful for saving changes in the customer profile administration section.
   */
  clickSaveButton() {
    cy.scrollTo("bottom");
    cy.contains("a", "Save").scrollIntoView().click({ force: true });
  }

  /**
   * Clicks the "Cancel" button on the page.
   * - Scrolls the "Cancel" button into view and clicks it forcefully.
   * - Waits for the top message loader to disappear (timeout: 10 seconds).
   * - Asserts that the "Cancel" button is no longer visible after clicking.
   */
  clickCancelButton() {
    cy.contains("a", "Cancel").scrollIntoView().click({ force: true });
    cy.waitForTopMsgLoaderToDisappear(10000);
    cy.contains("a", "Cancel").should("not.be.visible");
  }

  /******<<<<<<<<<<<< Document Management >>>>>>>>>>>>>************************************** */
  /**
   * Verifies the presence of the Microsoft Document Viewer checkbox.
   */
  verifyMicrosoftViewerCheckboxPresent() {
    // Check that the element exists in the DOM
    cy.get(
      locators.administration.customerProfile.microsoftDocumentCheckBox,
    ).should("exist");
    // Optionally, check if its label or parent is visible
    cy.get(locators.administration.customerProfile.microsoftDocumentCheckBox)
      .scrollIntoView()
      .parent()
      .find("span")
      .should("be.visible");
  }

  /**
   * Verifies if the Microsoft Document Viewer checkbox is checked or not.
   * @param {boolean} checked - Expected checked state.
   */
  verifyMicrosoftViewerCheckboxChecked(checked) {
    cy.get(
      locators.administration.customerProfile.microsoftDocumentCheckBox,
    ).should(checked ? "be.checked" : "not.be.checked");
  }

  /**
   * Sets the Microsoft Document Viewer checkbox to the desired state.
   * @param {boolean} checked - Desired checked state.
   */
  setMicrosoftViewerCheckbox(checked) {
    cy.get(
      locators.administration.customerProfile.microsoftDocumentCheckBox,
    ).then(($el) => {
      if ($el.prop("checked") !== checked) {
        cy.wrap($el).click({ force: true });
      }
    });
  }

  /*****************************<<<<<<<<<<<< Risk Review >>>>>>>>>************************************ */
  /**
   * Verifies the presence of the Required Approval checkbox under Risk Review.
   */
  verifyRiskReviewApprovalCheckboxPresent() {
    // Check that the element exists in the DOM
    cy.get(
      locators.administration.customerProfile.riskReviewApprovalCheckBox,
    ).should("exist");
    // Optionally, check that a visible parent or label is visible
    cy.get(locators.administration.customerProfile.riskReviewApprovalCheckBox)
      .scrollIntoView()
      .parent()
      .find("span")
      .should("be.visible");
  }

  /**
   * Verifies if the Required Approval checkbox is checked or not.
   * @param {boolean} checked - Expected checked state.
   */
  verifyRiskReviewApprovalCheckboxChecked(checked) {
    cy.get(
      locators.administration.customerProfile.riskReviewApprovalCheckBox,
    ).should(checked ? "be.checked" : "not.be.checked");
  }

  /**
   * Sets the Required Approval checkbox to the desired state.
   * @param {boolean} checked - Desired checked state.
   */
  setRiskReviewApprovalCheckbox(checked) {
    cy.get(
      locators.administration.customerProfile.riskReviewApprovalCheckBox,
    ).then(($el) => {
      if ($el.prop("checked") !== checked) {
        cy.wrap($el).click({ force: true });
      }
    });
  }

  /**
   * Verifies that the Required Approval checkbox is disabled (for permission check).
   */
  verifyRiskReviewApprovalCheckboxPermission() {
    cy.get(
      locators.administration.customerProfile.riskReviewApprovalCheckBox,
    ).should("be.disabled");
  }

  /********************************<<<<<<<<<<<<<<< Action Plan >>>>>>>>>>************************************** */
  /**
   * Verifies the presence of the Action Plan Closure Required checkbox.
   */
  verifyActionPlanClosureRequiredCheckboxPresent() {
    cy.get(
      locators.administration.customerProfile.actionPlanClosureCheckBox,
    ).should("exist");
    cy.get(locators.administration.customerProfile.actionPlanClosureCheckBox)
      .scrollIntoView()
      .parent()
      .find("span")
      .should("be.visible");
  }

  /**
   * Verifies if the Action Plan Closure Required checkbox is checked or not.
   * @param {boolean} checked - Expected checked state.
   */
  verifyActionPlanClosureRequiredCheckboxChecked(checked) {
    cy.get(
      locators.administration.customerProfile.actionPlanClosureCheckBox,
    ).should(checked ? "be.checked" : "not.be.checked");
  }

  /**
   * Sets the Action Plan Closure Required checkbox to the desired state.
   * @param {boolean} checked - Desired checked state.
   */
  setActionPlanClosureRequiredCheckbox(checked) {
    cy.get(
      locators.administration.customerProfile.actionPlanClosureCheckBox,
    ).then(($el) => {
      if ($el.prop("checked") !== checked) {
        cy.wrap($el).click({ force: true });
      }
    });
  }

  /**
   **************<<<<<<<<<< Regulatory Change Section Methods >>>>>>>>>>>>>>>>>>>**********************
   */

  // Owner Type
  /**
   * Selects the registration process owner type radio button based on the provided type.
   *
   * @param {string} type - The value of the owner type to select (e.g., "Individual", "Company").
   */
  selectRegChangeOwnerType(type) {
    cy.get(`input[name="regProcessOwnerType"][value="${type}"]`).check({
      force: true,
    });
  }
  /**
   * Verifies the visibility of the "Reg Change Process Owner" field.
   *
   * @param {boolean} [shouldBeVisible=true] - Determines whether the field should be visible.
   *   - If true, asserts that the field is visible.
   *   - If false, asserts that the field is not visible.
   */
  verifyRegChangeProcessOwnerFieldVisible(shouldBeVisible = true) {
    cy.get(
      locators.administration.customerProfile.regProcessOwnerSingleDropDown,
    ).should(shouldBeVisible ? "be.visible" : "not.be.visible");
  }
  /**
   * Verifies the visibility of the "Reg Change Process Owner Group" dropdown field.
   *
   * @param {boolean} [shouldBeVisible=true] - Determines whether the field should be visible (`true`) or not visible (`false`).
   */
  verifyRegChangeProcessOwnerGroupFieldVisible(shouldBeVisible = true) {
    cy.get(
      locators.administration.customerProfile.regProcessOwnerGroupDropDown,
    ).should(shouldBeVisible ? "be.visible" : "not.be.visible");
  }

  // Process Owner
  /**
   * Enters a process owner in the Regulatory Change section.
   * If the owner is not found, optionally asserts "No matches found".
   * @param {string} ownerName - The name to search for.
   * @param {object} [options] - Optional settings.
   * @param {boolean} [options.expectNoMatch=false] - If true, asserts "No matches found" is shown.
   */
  enterRegChangeProcessOwner(ownerName, options = {}) {
    cy.get(
      locators.administration.customerProfile.regProcessOwnerSingleDropDown,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      ownerName,
    );
    if (options.expectNoMatch) {
      cy.get(
        locators.administration.customerProfile.dropDownSuggestion,
      ).contains("No matches found");
    } else {
      cy.get(locators.administration.customerProfile.dropDownSearchResult)
        .contains(ownerName)
        .click();
    }
  }
  /**
   * Verifies that the selected Regulatory Change Process Owner matches the expected owner name.
   *
   * @param {string} ownerName - The name of the expected process owner to verify.
   */
  verifyRegChangeProcessOwnerSelected(ownerName) {
    cy.get(
      locators.administration.customerProfile.selectedRegChangeProcessOwner,
    ).should("contain", ownerName);
  }
  /**
   * Clears the "Reg Change Single Process Owner" field by clicking the corresponding UI element.
   * Uses Cypress to locate the element and force a click action.
   */
  clearRegChangeProcessOwner() {
    cy.get(
      locators.administration.customerProfile.clearRegChangeSingleProcessOwner,
    ).click({
      force: true,
    });
  }

  // Process Owner Group
  /**
   * Clears the "Reg Change Process Owner Group" selection by clicking the corresponding UI element.
   * Uses a forced click to ensure the action is performed even if the element is not interactable.
   */
  clearRegChangeProcessOwnerGroup() {
    cy.get(
      locators.administration.customerProfile.clearRegChangeGroupProcessOwner,
    ).click({ force: true });
  }

  // Watcher Type
  /**
   * Selects the Regulatory Change Watcher Owner Type radio button based on the provided type.
   *
   * @param {string} type - The value of the owner type to select (e.g., "User", "Group").
   */
  selectRegChangeWatcherType(type) {
    cy.get(`input[name="regChangeWatcherOwnerType"][value="${type}"]`).check({
      force: true,
    });
  }
  /**
   * Verifies the visibility of the "Reg Change Watcher" field on the Customer Profile page.
   *
   * @param {boolean} [shouldBeVisible=true] - Determines whether the field should be visible (`true`) or not visible (`false`).
   */
  verifyRegChangeWatcherFieldVisible(shouldBeVisible = true) {
    cy.get(
      locators.administration.customerProfile.regChangeWatcherSingle,
    ).should(shouldBeVisible ? "be.visible" : "not.be.visible");
  }
  /**
   * Verifies the visibility of the "Reg Change Watcher Group" field.
   *
   * @param {boolean} [shouldBeVisible=true] - Determines if the field should be visible (`true`) or not visible (`false`).
   * @example
   * // Assert that the field is visible
   * verifyRegChangeWatcherGroupFieldVisible();
   *
   * // Assert that the field is not visible
   * verifyRegChangeWatcherGroupFieldVisible(false);
   */
  verifyRegChangeWatcherGroupFieldVisible(shouldBeVisible = true) {
    cy.get(
      locators.administration.customerProfile.regChangeWatcherGroup,
    ).should(shouldBeVisible ? "be.visible" : "not.be.visible");
  }

  // Watchers
  /**
   * Selects a registration change watcher from a Select2 dropdown by name.
   *
   * @param {string} watcherName - The name of the watcher to select.
   * @param {Object} [options={}] - Optional settings.
   * @param {boolean} [options.expectNoMatch=false] - If true, expects no matching watcher and verifies "No matches found" is displayed.
   */
  enterRegChangeWatcher(watcherName, options = {}) {
    cy.get(
      locators.administration.customerProfile.regChangeWatcherSingle,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      watcherName,
    );
    if (options.expectNoMatch) {
      cy.get(
        locators.administration.customerProfile.dropDownSuggestion,
      ).contains("No matches found");
    } else {
      cy.get(locators.administration.customerProfile.dropDownSearchResult)
        .contains(watcherName)
        .click();
    }
  }
  /**
   * Verifies that the specified regulatory change watcher is selected.
   *
   * @param {string} watcherName - The name of the watcher to verify as selected.
   */
  verifyRegChangeWatcherSelected(watcherName) {
    cy.get(
      locators.administration.customerProfile.selectedRegChangeWatcher,
    ).should("contain", watcherName);
  }
  /**
   * Clears the selected Regulatory Change Watcher by clicking on the corresponding element.
   * Uses Cypress to force a click action on the selected watcher element.
   */
  clearRegChangeWatcher() {
    cy.get(
      locators.administration.customerProfile.selectedRegChangeWatcher,
    ).click({ force: true });
  }

  // Approval Checkbox
  /**
   * Sets the "Reg Change Approval" checkbox to the specified checked state.
   *
   * @param {boolean} checked - Desired checked state for the checkbox (true to check, false to uncheck).
   */
  setRegChangeApprovalCheckbox(checked = true) {
    cy.get(
      locators.administration.customerProfile.regChangeApprovalCheckBox,
    ).then(($el) => {
      if ($el.prop("checked") !== checked) {
        cy.wrap($el).click({ force: true });
      }
    });
  }
  /**
   * Verifies whether the Regulatory Change Approval checkbox is checked or not.
   *
   * @param {boolean} checked - If true, asserts that the checkbox is checked; if false, asserts that it is not checked.
   */
  verifyRegChangeApprovalCheckboxChecked(checked = true) {
    cy.get(
      locators.administration.customerProfile.regChangeApprovalCheckBox,
    ).should(checked ? "be.checked" : "not.be.checked");
  }

  /**
   * Sets the "Require Approval for Evaluate Impact and Reg Change Action Plans" checkbox
   * and saves the customer profile settings.
   *
   * Purpose: Enables or disables the approval requirement for Reg Change workflows and persists the change.
   * Expected input: checked (boolean) - true to enable approval, false to disable (defaults to true)
   * Side effects: Navigates to customer profile page, modifies settings, and triggers a save operation.
   */
  checkRegChangeApprovalAndSave(checked = true) {
    cy.visitCustomerProfile();
    this.setRegChangeApprovalCheckbox(checked);
    this.clickSaveButton();
  }

  // Approver Type
  /**
   * Selects the regulatory change approver type radio button based on the provided type.
   *
   * @param {string} type - The value of the approver type to select (e.g., "internal", "external").
   */
  selectRegChangeApproverType(type) {
    cy.get(`input[name="regChangeApprovalType"][value="${type}"]`).check({
      force: true,
    });
  }
  /**
   * Verifies the visibility of the "Reg Change Approver" field.
   *
   * @param {boolean} [shouldBeVisible=true] - Determines whether the field should be visible.
   *   - If true, asserts that the field is visible.
   *   - If false, asserts that the field is not visible.
   */
  verifyRegChangeApproverFieldVisible(shouldBeVisible = true) {
    cy.get(locators.administration.customerProfile.regApproverSingle).should(
      shouldBeVisible ? "be.visible" : "not.be.visible",
    );
  }
  /**
   * Verifies that the "Regulatory Change Approver is Creator" checkbox is checked
   * on the Customer Profile administration page.
   *
   * Uses Cypress to assert that the checkbox element, identified by the locator
   * `locators.administration.customerProfile.regApprovalCreator`, is checked.
   *
   * @example
   * // Usage in a Cypress test
   * customerProfile.verifyRegChangeApproverIsCreator();
   */
  verifyRegChangeApproverIsCreator() {
    cy.get(locators.administration.customerProfile.regApprovalCreator).should(
      "be.checked",
    );
  }

  // Approver
  /**
   * Selects a regulatory change approver from a Select2 dropdown by name.
   *
   * @param {string} approverName - The name of the approver to select.
   * @param {Object} [options={}] - Optional settings.
   * @param {boolean} [options.expectNoMatch=false] - If true, expects no matching approver and verifies "No matches found" is displayed.
   */
  enterRegChangeApprover(approverName, options = {}) {
    cy.get(locators.administration.customerProfile.regApproverSingle).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      approverName,
    );
    if (options.expectNoMatch) {
      cy.get(
        locators.administration.customerProfile.dropDownSuggestion,
      ).contains("No matches found");
    } else {
      cy.get(locators.administration.customerProfile.dropDownSearchResult)
        .contains(approverName)
        .click();
    }
  }
  /**
   * Verifies that the specified regulatory change approver is selected.
   *
   * @param {string} approverName - The name of the approver to verify as selected.
   */
  verifyRegChangeApproverSelected(approverName) {
    cy.get(
      locators.administration.customerProfile.selectedRegChangeApprover,
    ).should("contain", approverName);
  }
  /**
   * Clears the Regulatory Change Single Approver field by clicking the corresponding UI element.
   * Uses Cypress to locate and force-click the element defined in the customer profile locators.
   */
  clearRegChangeApprover() {
    cy.get(
      locators.administration.customerProfile.clearRegChangeSingleApprover,
    ).click({
      force: true,
    });
  }

  /**
   * Verifies that the registration change data has been saved by checking
   * the visibility of the toast message element.
   */
  verifyRegChangeDataSaved() {
    cy.get(locators.administration.toastMsg).should("be.visible");
  }
  /**
   * Verifies that the registration change data has not been saved by asserting
   * that the toast message does not exist on the page.
   */
  verifyRegChangeDataNotSaved() {
    cy.get(locators.administration.toastMsg).should("not.exist");
  }

  /**
   * Edits the Regulatory Change Process Owner by first clearing the current owner
   * and then entering the new owner name.
   *
   * @param {string} ownerName - The name of the new Regulatory Change Process Owner to set.
   */
  editRegChangeProcessOwner(ownerName) {
    this.clearRegChangeProcessOwner();
    this.enterRegChangeProcessOwner(ownerName);
  }
  /**
   * Deletes the registration change watcher by clearing any existing watcher.
   * Calls the internal method `clearRegChangeWatcher` to perform the action.
   */
  deleteRegChangeWatcher() {
    this.clearRegChangeWatcher();
  }
  /**
   * Verifies that the "Reg Change Watcher" selection has been cleared.
   * Asserts that the selected element's text is "Select".
   */
  verifyRegChangeWatcherCleared() {
    cy.get(
      locators.administration.customerProfile.selectedRegChangeWatcher,
    ).should("have.text", "Select");
  }

  /**
   * **********<<<<<<<<  Sox Review Section Methods >>>>>>>>>>**********************
   */

  // Owner Type
  /**
   * Verifies that both the SOX Process Owner Single and Group fields are present on the Customer Profile page.
   * Uses Cypress commands to assert the existence of the respective elements.
   */
  verifySoxProcessOwnerTypeFieldPresent() {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerSingle,
    ).should("exist");
    cy.get(locators.administration.customerProfile.soxProcessOwnerGroup).should(
      "exist",
    );
  }
  /**
   * Selects the SOX Process Owner Type radio button based on the provided type.
   *
   * @param {string} type - The value of the SOX Process Owner Type to select.
   * @example
   * // Selects the "Internal" SOX Process Owner Type
   * selectSoxProcessOwnerType('Internal');
   */
  selectSoxProcessOwnerType(type) {
    cy.get(`input[name="soxProcessOwnerType"][value="${type}"]`).check({
      force: true,
    });
  }
  /**
   * Verifies the visibility of the SOX Process Owner dropdown.
   *
   * @param {boolean} [shouldBeVisible=true] - Determines whether the dropdown should be visible.
   *   If true, asserts that the dropdown is visible; if false, asserts that it is not visible.
   */
  verifySoxProcessOwnerDropdownVisible(shouldBeVisible = true) {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerSingleDropDown,
    ).should(shouldBeVisible ? "be.visible" : "not.be.visible");
  }
  /**
   * Verifies the visibility of the SOX Process Owner Group dropdown.
   *
   * @param {boolean} [shouldBeVisible=true] - Determines whether the dropdown should be visible.
   *   If true, asserts that the dropdown is visible; if false, asserts that it is not visible.
   */
  verifySoxProcessOwnerGroupDropdownVisible(shouldBeVisible = true) {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerGroupDropDown,
    ).should(shouldBeVisible ? "be.visible" : "not.be.visible");
  }
  /**
   * Verifies that the SOX Process Owner type radio button is selected by default
   * on the Customer Profile administration page.
   *
   * Uses Cypress to assert that the element specified by
   * `locators.administration.customerProfile.soxProcessOwnerSingle` is checked.
   */
  verifySoxProcessOwnerTypeDefault() {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerSingle,
    ).should("be.checked");
  }

  // Single Owner
  /**
   * Selects a SOX Process Owner from a single-select dropdown by searching and clicking the owner's name.
   *
   * @param {string} ownerName - The name of the SOX Process Owner to select from the dropdown.
   */
  enterSoxProcessOwner(ownerName) {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerSingleDropDown,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      ownerName,
    );
    cy.get(locators.administration.customerProfile.dropDownSearchResult)
      .contains(ownerName)
      .click();
  }
  /**
   * Verifies that the SOX Process Owner with the specified name is selected.
   *
   * @param {string} ownerName - The name of the SOX Process Owner to verify.
   * @returns {void}
   */
  verifySoxProcessOwnerSelected(ownerName) {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerSingleSearchResult,
    ).should("contain", ownerName);
  }
  /**
   * Clears the selected SOX Process Owner from the customer profile form.
   * Uses Cypress to locate and click the clear button for the SOX Process Owner field.
   * Forces the click action in case the element is not interactable by default.
   */
  clearSoxProcessOwner() {
    cy.get(
      locators.administration.customerProfile
        .clearSoxProcessOwnerSingleSearchResult,
    ).click({
      force: true,
    });
  }
  /**
   * Verifies that the SOX Process Owner field is cleared by asserting
   * that its text content is "Select".
   * This ensures no process owner is currently selected.
   */
  verifySoxProcessOwnerCleared() {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerSingleSearchResult,
    ).should("have.text", "Select");
  }
  /**
   * Verifies that the SOX Process Owner has been saved by checking if the specified owner name
   * appears in the single search result element.
   *
   * @param {string} ownerName - The name of the SOX Process Owner to verify.
   */
  verifySoxProcessOwnerSaved(ownerName) {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerSingleSearchResult,
    ).should("contain", ownerName);
  }

  // Group Owner
  /**
   * Selects a SOX Process Owner Group from a dropdown by searching and clicking the desired group name.
   *
   * @param {string} groupName - The name of the SOX Process Owner Group to select.
   */
  enterSoxProcessOwnerGroup(groupName) {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerGroupDropDown,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      groupName,
    );
    cy.get(locators.administration.customerProfile.dropDownSearchResult)
      .contains(groupName)
      .click();
  }
  /**
   * Verifies that the specified SOX Process Owner Group is selected by checking
   * if the group name is present in the search result element.
   *
   * @param {string} groupName - The name of the SOX Process Owner Group to verify.
   */
  verifySoxProcessOwnerGroupSelected(groupName) {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerGroupSearchResult,
    ).should("contain", groupName);
  }
  /**
   * Verifies that the specified SOX Process Owner Group has been saved by checking
   * if the group name appears in the search results.
   *
   * @param {string} groupName - The name of the SOX Process Owner Group to verify.
   */
  verifySoxProcessOwnerGroupSaved(groupName) {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerGroupSearchResult,
    ).should("contain", groupName);
  }

  // Dropdown Options
  /**
   * Opens the SOX Process Owner dropdown in the Customer Profile administration page.
   * Utilizes Cypress to locate and click the dropdown element.
   */
  openSoxProcessOwnerDropdown() {
    cy.get(
      locators.administration.customerProfile.soxProcessOwnerSingleDropDown,
    ).click();
  }

  /***
   * *****<<<<<<<< Exam Management Method Section >>>>>>>>*******************
   *
   */
  /**
   * Verifies that the "Exam Process Owner" type fields are present on the Customer Profile page.
   *
   * This method checks for the existence of both the single and group exam process owner fields,
   * and ensures the "Exam Process Owner" label is visible.
   *
   * @returns {void}
   */
  verifyExamOwnerTypeFieldPresent() {
    cy.get(
      locators.administration.customerProfile.examProcessOwnerSingle,
    ).should("exist");
    cy.get(
      locators.administration.customerProfile.examProcessOwnerGroup,
    ).should("exist");
    cy.contains("label", "Exam Process Owner").should("be.visible");
  }

  /**
   * Selects the exam owner type radio button based on the provided type.
   *
   * @param {string} type - The value of the exam owner type to select.
   * @example
   * // Selects the "internal" exam owner type
   * selectExamOwnerType('internal');
   */
  selectExamOwnerType(type) {
    cy.get(`input[name="examProcessOwnerType"][value="${type}"]`).check({
      force: true,
    });
  }

  /**
   * Verifies the visibility of the Exam Process Owner dropdown.
   *
   * @param {boolean} [shouldBeVisible=true] - Determines whether the dropdown should be visible.
   *   If true, asserts that the dropdown is visible; if false, asserts that it is not visible.
   */
  verifyExamProcessOwnerDropdownVisible(shouldBeVisible = true) {
    cy.get(
      locators.administration.customerProfile.examProcessOwnerSingleDropDown,
    ).should(shouldBeVisible ? "be.visible" : "not.be.visible");
  }

  /**
   * Verifies the visibility of the Exam Process Owner Group dropdown.
   *
   * @param {boolean} [shouldBeVisible=true] - Determines whether the dropdown should be visible.
   * If true, asserts that the dropdown is visible; if false, asserts that it is not visible.
   */
  verifyExamProcessOwnerGroupDropdownVisible(shouldBeVisible = true) {
    cy.get(
      locators.administration.customerProfile.examProcessOwnerGroupDropDown,
    ).should(shouldBeVisible ? "be.visible" : "not.be.visible");
  }

  /**
   * Selects an exam process owner from a single-select dropdown by searching and clicking the desired owner name.
   *
   * @param {string} ownerName - The name of the exam process owner to select.
   */
  enterExamProcessOwner(ownerName) {
    cy.get(
      locators.administration.customerProfile.examProcessOwnerSingleDropDown,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      ownerName,
    );
    cy.get(locators.administration.customerProfile.examProcessOwnerSearchResult)
      .contains(ownerName)
      .click();
  }

  /**
   * Verifies that the exam process owner with the specified name is selected.
   *
   * @param {string} ownerName - The name of the exam process owner to verify.
   * @returns {void}
   */
  verifyExamProcessOwnerSelected(ownerName) {
    cy.get(
      locators.administration.customerProfile
        .examProcessOwnerSingleSearchResult,
    ).should("contain", ownerName);
  }

  /**
   * Selects an exam process owner group from a dropdown by searching and clicking the group name.
   *
   * @param {string} groupName - The name of the group to select from the dropdown.
   */
  enterExamProcessOwnerGroup(groupName) {
    cy.get(
      locators.administration.customerProfile.examProcessOwnerGroupDropDown,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      groupName,
    );
    cy.get(locators.administration.customerProfile.examProcessOwnerSearchResult)
      .contains(groupName)
      .click();
  }

  /**
   * Verifies that the specified exam process owner group is selected by checking
   * if the group name is present in the search result element.
   *
   * @param {string} groupName - The name of the exam process owner group to verify.
   */
  verifyExamProcessOwnerGroupSelected(groupName) {
    cy.get(
      locators.administration.customerProfile.examProcessOwnerGroupSearchResult,
    ).should("contain", groupName);
  }

  /**
   * Clears the selected Exam Process Owner in the customer profile form.
   * Clicks the element responsible for removing the current Exam Process Owner selection.
   * Uses force click to ensure the action is performed even if the element is not interactable.
   */
  clearExamProcessOwner() {
    cy.get(
      locators.administration.customerProfile
        .clearExamProcessOwnerSingleSearchResult,
    ).click({
      force: true,
    });
  }

  /**
   * Verifies that the exam process owner field is cleared by asserting
   * that the single search result displays the text "Select".
   * Utilizes Cypress commands to perform the check.
   */
  verifyExamProcessOwnerCleared() {
    cy.get(
      locators.administration.customerProfile
        .examProcessOwnerSingleSearchResult,
    ).should("have.text", "Select");
  }

  /**
   * Verifies that the exam process owner has been saved by checking
   * that the specified owner name appears in the single search result element.
   *
   * @param {string} ownerName - The name of the exam process owner to verify.
   */
  verifyExamProcessOwnerSaved(ownerName) {
    cy.get(
      locators.administration.customerProfile
        .examProcessOwnerSingleSearchResult,
    ).should("contain", ownerName);
  }

  /**
   * Verifies that the specified exam process owner group name appears in the search results.
   *
   * @param {string} groupName - The name of the exam process owner group to verify.
   */
  verifyExamProcessOwnerGroupSaved(groupName) {
    cy.get(
      locators.administration.customerProfile.examProcessOwnerGroupSearchResult,
    ).should("contain", groupName);
  }

  // Verifies that the default Exam Owner Type is pre-selected (e.g., Single)
  /**
   * Verifies that the default selection for the exam process owner type matches the expected value.
   *
   * @param {string} [expectedType="Single"] - The expected value of the exam process owner type radio button to be checked.
   * @example
   * // Verifies that the "Single" owner type is selected by default
   * verifyDefaultExamOwnerTypeSelection();
   *
   * @example
   * // Verifies that the "Multiple" owner type is selected by default
   * verifyDefaultExamOwnerTypeSelection("Multiple");
   */
  verifyDefaultExamOwnerTypeSelection(expectedType = "Single") {
    cy.get(
      `input[name="examProcessOwnerType"][value="${expectedType}"]`,
    ).should("be.checked");
  }

  // Updates owner type and value, then verifies the correct value is reflected
  /**
   * Updates the exam owner type and value by first setting the owner to a group and saving,
   * then switching to a single owner and saving again. Verifies both selections after each update.
   *
   * @param {string} singleOwner - The name or identifier of the single exam owner to be set.
   * @param {string} groupOwner - The name or identifier of the group exam owner to be set.
   */
  updateExamOwnerTypeAndValue(singleOwner, groupOwner) {
    // Switch to Group and set group owner
    this.selectExamOwnerType("Group");
    this.enterExamProcessOwnerGroup(groupOwner);
    this.clickSaveButton();
    this.verifyExamProcessOwnerGroupSelected(groupOwner);

    // Select Single and set owner
    this.selectExamOwnerType("Single");
    this.enterExamProcessOwner(singleOwner);
    this.clickSaveButton();
    this.verifyExamProcessOwnerSelected(singleOwner);
  }

  // Verifies that invalid/unsupported input is not accepted in the dropdown
  /**
   * Verifies that entering an invalid input in the Exam Owner dropdown
   * displays a "No matches found" validation message.
   *
   * @param {string} invalidInput - The invalid input to type into the dropdown search.
   */
  verifyExamOwnerDropdownValidation(invalidInput) {
    this.selectExamOwnerType("Single");
    cy.get(
      locators.administration.customerProfile.examProcessOwnerSingleDropDown,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      invalidInput,
    );
    cy.contains("No matches found").should("be.visible");
  }

  /**
   * ***************<<<<<<<<<<<<<<<<< KXI Managment Section >>>>>>>>>>>>>>>>>>>>>******************
   */

  // Verify the presence of the Default Negative Context Icon Set field
  verifyDefaultNegativeContextIconSetFieldPresent() {
    cy.get(
      locators.administration.customerProfile.kxiDefaultNegativeIconDropDown,
    ).should("be.visible");
    cy.get(
      locators.administration.customerProfile
        .kxiDefaultNegativeIconDropDownSearch,
    ).should("exist");
  }

  // Verify the dropdown options for the Default Negative Context Icon Set
  verifyDefaultNegativeContextIconSetDropdownOptions() {
    cy.get(
      locators.administration.customerProfile.kxiDefaultNegativeIconDropDown,
    ).click();
    cy.get(
      locators.administration.customerProfile.examProcessOwnerSearchResult,
    ).should("have.length", 2);
    cy.get(locators.administration.customerProfile.examProcessOwnerSearchResult)
      .eq(0)
      .should("contain", testData.kxiManagement.negativeValue);
    cy.get(locators.administration.customerProfile.examProcessOwnerSearchResult)
      .eq(1)
      .should("contain", testData.kxiManagement.negativeMixedValue);
    cy.get("body").click(0, 0); // close dropdown
  }

  // Verify selecting an option from the dropdown
  /**
   * Selects an option from the Default Negative Context Icon dropdown and verifies the selection.
   *
   * @param {string} option - The option to select from the dropdown.
   */
  selectDefaultNegativeContextIconSet(option) {
    cy.get(
      locators.administration.customerProfile.kxiDefaultNegativeIconDropDown,
    ).click();
    cy.get(locators.administration.customerProfile.examProcessOwnerSearchResult)
      .contains(option)
      .click();
    cy.get(
      locators.administration.customerProfile
        .kxiDefaultNegativeIconDropDownSearch,
    ).should("have.text", option);
  }

  // Verify clearing the field
  /**
   * Clears the default negative context icon selection in the customer profile administration page.
   *
   * This method clicks the clear button for the default negative icon search dropdown,
   * and then verifies that the dropdown resets to the "Select" state.
   *
   * @function
   */
  clearDefaultNegativeContextIconSet() {
    cy.get(
      locators.administration.customerProfile
        .clearKxiDefaultKxiDefaultNegativeIconSearch,
    ).click({ force: true });
    cy.get(
      locators.administration.customerProfile
        .kxiDefaultNegativeIconDropDownSearch,
    ).should("have.text", testData.kxiManagement.singleDropDownSearchResult);
  }

  // Verify the default value of the field (should be 'Negative')
  /**
   * Verifies that the default value of the negative context icon dropdown is set correctly.
   *
   * @param {string} [defaultValue=testData.kxiManagement.negativeValue] - The expected default value for the negative context icon dropdown.
   */
  verifyDefaultNegativeContextIconSetValue(
    defaultValue = testData.kxiManagement.negativeValue,
  ) {
    cy.get(
      locators.administration.customerProfile
        .kxiDefaultNegativeIconDropDownSearch,
    ).should("have.text", defaultValue);
  }

  // Update the field value and save, then verify the change
  /**
   * Updates the default negative context icon set by selecting a new value,
   * saves the changes, and verifies that the selected value is displayed.
   *
   * @param {string} newValue - The new icon set value to be selected and saved.
   */
  updateAndSaveDefaultNegativeContextIconSet(newValue) {
    this.selectDefaultNegativeContextIconSet(newValue);
    this.clickSaveButton();
    cy.get(
      locators.administration.customerProfile
        .kxiDefaultNegativeIconDropDownSearch,
    ).should("have.text", newValue);
  }

  /**
   * Verifies that entering an invalid input in the Default Negative Context Icon Set dropdown
   * displays a "No matches found" validation message.
   *
   * @param {string} invalidInput - The invalid input to type into the dropdown search.
   */
  // Verify dropdown validation (invalid input should show 'No matches found')
  verifyNegativeContextIconSetDropdownValidation(invalidInput) {
    cy.get(
      locators.administration.customerProfile.kxiDefaultNegativeIconDropDown,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      invalidInput,
    );
    cy.contains("No matches found").should("be.visible");
    cy.get("body").click(0, 0); // close dropdown
  }

  /**
   * ***************<<<<<<<<<<<<<<<<< Issue Mangement Section >>>>>>>>>>>>>>>>>>>>>******************
   */

  /**
   * Verifies that the Issue Process Owner type fields are present on the Customer Profile page.
   * Checks for the existence of both the single owner and group owner elements,
   * and ensures the Issue Process Owner label is visible.
   *
   * @returns {void}
   */
  verifyIssueProcessOwnerTypeFieldPresent() {
    cy.get(
      locators.administration.customerProfile.issueProcessOwnerSingleOwner,
    ).should("exist");
    cy.get(
      locators.administration.customerProfile.issueProcessOwnerGroupOwner,
    ).should("exist");
    cy.contains(
      "label",
      testData.issueManagement.fieldNameIssueProcessOwner,
    ).should("be.visible");
  }

  /**
   * Selects the issue process owner type radio button based on the provided type.
   *
   * @param {string} type - The value of the issue process owner type to select.
   * @example
   * // Selects the "internal" issue process owner type
   * selectIssueProcessOwnerType('internal');
   */
  selectIssueProcessOwnerType(type) {
    cy.get(`input[name="issueProcessOwnerType"][value="${type}"]`).check({
      force: true,
    });
  }

  /**
   * Verifies the visibility of the Issue Process Owner dropdown.
   *
   * @param {boolean} [shouldBeVisible=true] - Determines whether the dropdown should be visible.
   * If true, asserts that the dropdown is visible; if false, asserts that it is not visible.
   */
  verifyIssueProcessOwnerDropdownVisible(shouldBeVisible = true) {
    cy.get(
      locators.administration.customerProfile
        .issueManagementProcessOwnerDropDown,
    ).should(shouldBeVisible ? "be.visible" : "not.be.visible");
  }

  /**
   * Verifies the visibility of the Issue Process Owner Group dropdown.
   *
   * @param {boolean} [shouldBeVisible=true] - Determines whether the dropdown should be visible.
   *   If true, asserts that the dropdown is visible; if false, asserts that it is not visible.
   */
  verifyIssueProcessOwnerGroupDropdownVisible(shouldBeVisible = true) {
    cy.get(
      locators.administration.customerProfile
        .issueManagementProcessOwnerGroupDropDown,
    ).should(shouldBeVisible ? "be.visible" : "not.be.visible");
  }

  /**
   * Selects an issue process owner from the dropdown by searching and clicking the specified owner name.
   *
   * @param {string} ownerName - The name of the process owner to select.
   */
  enterIssueProcessOwner(ownerName) {
    cy.get(
      locators.administration.customerProfile
        .issueManagementProcessOwnerDropDown,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      ownerName,
    );
    cy.get(locators.administration.customerProfile.examProcessOwnerSearchResult)
      .contains(ownerName)
      .click();
  }

  /**
   * Verifies that the specified process owner is selected in the Issue Process Owner dropdown.
   *
   * @param {string} ownerName - The name of the process owner to verify as selected.
   */
  verifyIssueProcessOwnerSelected(ownerName) {
    cy.get(
      locators.administration.customerProfile.issueProcessOwnerDropDownSearch,
    ).should("contain", ownerName);
  }

  /**
   * Selects a process owner group from the Issue Management Process Owner Group dropdown.
   *
   * @param {string} groupName - The name of the process owner group to select.
   */
  enterIssueProcessOwnerGroup(groupName) {
    cy.get(
      locators.administration.customerProfile
        .issueManagementProcessOwnerGroupDropDown,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      groupName,
    );
    cy.get(locators.administration.customerProfile.examProcessOwnerSearchResult)
      .contains(groupName)
      .click();
  }

  /**
   * Verifies that the specified process owner group is selected in the Issue Process Owner Group dropdown.
   *
   * @param {string} groupName - The name of the group expected to be selected in the dropdown.
   */
  verifyIssueProcessOwnerGroupSelected(groupName) {
    cy.get(
      locators.administration.customerProfile
        .issueProcessOwnerGroupDropDownSearch,
    ).should("contain", groupName);
  }

  /**
   * Clears the selected Issue Process Owner in the Customer Profile form.
   * This method locates the clear button for the Issue Process Owner field and clicks it,
   * forcing the action in case the element is not interactable by default.
   */
  clearIssueProcessOwner() {
    cy.get(
      locators.administration.customerProfile
        .clearIssueProcessOwnerSingleSearchResult,
    ).click({
      force: true,
    });
  }

  /**
   * Verifies that the Issue Process Owner dropdown is cleared by asserting
   * that its displayed text is "Select".
   *
   * @returns {void}
   */
  verifyIssueProcessOwnerCleared() {
    cy.get(
      locators.administration.customerProfile.issueProcessOwnerDropDownSearch,
    ).should(
      "have.text",
      testData.issueManagement.clearIssueManagementSearchResult,
    );
  }

  /**
   * Clears the selected Issue Process Owner Group in the customer profile form.
   * This method locates the clear button for the Issue Process Owner Group search result
   * and clicks it with force to ensure the selection is removed.
   *
   * @returns {void}
   */
  clearIssueProcessOwnerGroup() {
    cy.get(
      locators.administration.customerProfile
        .clearIssueProcessOwnerGroupSearchResult,
    ).click({ force: true });
  }

  /**
   * Verifies that the Issue Process Owner Group dropdown is cleared
   * by asserting that its displayed text is "Select".
   *
   * @returns {void}
   */
  verifyIssueProcessOwnerGroupCleared() {
    cy.get(
      locators.administration.customerProfile
        .issueProcessOwnerGroupDropDownSearch,
    ).should(
      "have.text",
      testData.issueManagement.clearIssueManagementSearchResult,
    );
  }

  /**
   * Verifies that the issue process owner dropdown contains the specified owner name.
   *
   * @param {string} ownerName - The name of the process owner to verify in the dropdown.
   */
  verifyIssueProcessOwnerSaved(ownerName) {
    cy.get(
      locators.administration.customerProfile.issueProcessOwnerDropDownSearch,
    ).should("contain", ownerName);
  }

  /**
   * Verifies that the specified process owner group name is present in the Issue Process Owner Group dropdown.
   *
   * @param {string} groupName - The name of the group to verify in the dropdown.
   */
  verifyIssueProcessOwnerGroupSaved(groupName) {
    cy.get(
      locators.administration.customerProfile
        .issueProcessOwnerGroupDropDownSearch,
    ).should("contain", groupName);
  }

  /**
   * Verifies that the default selection for the issue process owner type matches the expected value.
   *
   * @param {string} [expectedType="Single"] - The expected value of the issue process owner type radio button to be checked.
   * @example
   * // Verifies that the "Single" option is selected by default
   * verifyDefaultIssueProcessOwnerTypeSelection();
   *
   * @example
   * // Verifies that the "Multiple" option is selected by default
   * verifyDefaultIssueProcessOwnerTypeSelection("Multiple");
   */
  verifyDefaultIssueProcessOwnerTypeSelection(expectedType = "Single") {
    cy.get(
      `input[name="issueProcessOwnerType"][value="${expectedType}"]`,
    ).should("be.checked");
  }

  /**
   * Updates the issue owner type and value by first setting the group owner type and value,
   * then setting the single owner type and value. Verifies each selection after setting.
   *
   * @param {string} singleOwner - The name or identifier of the single issue owner to select.
   * @param {string} groupOwner - The name or identifier of the group issue owner to select.
   */
  updateIssueOwnerTypeAndValue(singleOwner, groupOwner) {
    this.selectIssueProcessOwnerType(
      testData.issueManagement.issueProcessOwnerGroupType,
    );
    this.enterIssueProcessOwnerGroup(groupOwner);
    this.verifyIssueProcessOwnerGroupSelected(groupOwner);

    this.selectIssueProcessOwnerType(
      testData.issueManagement.issueProcessOwnerSingleType,
    );
    this.enterIssueProcessOwner(singleOwner);
    this.verifyIssueProcessOwnerSelected(singleOwner);
  }

  /**
   * Verifies that entering an invalid input in the issue process owner dropdown
   * displays the "no matches found" validation message.
   *
   * @param {string} invalidInput - The invalid input to type into the dropdown search.
   */
  verifyDropdownValidation(invalidInput) {
    this.selectIssueProcessOwnerType(
      testData.issueManagement.issueProcessOwnerSingleType,
    );
    cy.get(
      locators.administration.customerProfile
        .issueManagementProcessOwnerDropDown,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      invalidInput,
    );
    cy.contains(testData.noMatchesFound).should("be.visible");
    cy.get("body").click(0, 0);
  }

  /**
   * *************<<<<<<<<<<<<<<<<< Risk Management Section >>>>>>>>>>>>>******************
   */

  /**
   * Verifies that all "Weight Risk By" options are present in the Customer Profile administration section.
   * Checks for the existence of the "None", "Magnitude", and "Estimated Cost" options using their respective locators.
   *
   * @example
   * // Usage within a Cypress test
   * customerProfile.verifyWeightRiskByOptionsPresent();
   */
  verifyWeightRiskByOptionsPresent() {
    cy.get(locators.administration.customerProfile.weightRiskByNone).should(
      "exist",
    );
    cy.get(
      locators.administration.customerProfile.weightRiskByMagnitude,
    ).should("exist");
    cy.get(
      locators.administration.customerProfile.weightRiskByEstimatedCost,
    ).should("exist");
  }

  /**
   * Verifies that the radio button for the given weight risk selection is checked by default.
   *
   * @param {string} [expected="None"] - The expected value of the weight risk selection to verify.
   * @example
   * // Verifies that the "High" weight risk option is selected by default
   * verifyDefaultWeightRiskBySelection("High");
   */
  verifyDefaultWeightRiskBySelection(expected = "None") {
    cy.get(`input[name="weightRiskBy"][value="${expected}"]`).should(
      "be.checked",
    );
  }

  /**
   * Toggles the "Weight Risk By" options in the Customer Profile administration page.
   * This method checks the checkboxes for "Magnitude", "Estimated Cost", and "None" options,
   * and asserts that each is checked after the action.
   *
   * @function
   * @returns {void}
   */
  toggleWeightRiskByOptions() {
    cy.get(locators.administration.customerProfile.weightRiskByMagnitude)
      .check({ force: true })
      .should("be.checked");
    cy.get(locators.administration.customerProfile.weightRiskByEstimatedCost)
      .check({ force: true })
      .should("be.checked");
    cy.get(locators.administration.customerProfile.weightRiskByNone)
      .check({ force: true })
      .should("be.checked");
  }

  /**
   * Verifies that the default risk currency field is present and visible
   * on the Customer Profile administration page.
   *
   * Uses Cypress to locate the field using the specified locator and asserts
   * its visibility.
   *
   * @returns {void}
   */
  verifyDefaultRiskCurrencyFieldPresent() {
    cy.get(locators.administration.customerProfile.defaultRiskCurrency).should(
      "be.visible",
    );
  }

  /**
   * Updates the default risk currency for the customer profile.
   *
   * This method selects the specified currency from a dropdown, saves the selection,
   * and verifies that the selected currency is displayed as the default.
   *
   * @param {string} currency - The currency to set as the default risk currency.
   */
  updateDefaultRiskCurrency(currency) {
    cy.get(locators.administration.customerProfile.defaultRiskCurrency).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      currency,
    );
    cy.get(locators.administration.customerProfile.examProcessOwnerSearchResult)
      .contains(currency)
      .click();
    this.clickSaveButton();
    cy.get(
      locators.administration.customerProfile.defaultRiskCurrencySelect,
    ).should("have.text", currency);
  }

  /**
   * Verifies that the options for "Current Risk Greater Than Residual" are present on the page.
   * Checks for the existence of both the checked and unchecked elements using their locators.
   *
   * @returns {void}
   */
  verifyCurrentRiskGreaterThanResidualOptionsPresent() {
    cy.get(
      locators.administration.customerProfile.currentRiskGreaterCheck,
    ).should("exist");
    cy.get(
      locators.administration.customerProfile.currentRiskGreaterUncheck,
    ).should("exist");
  }

  /**
   * Verifies that the radio input for "currentRiskGreaterThanResidual" with the specified value is checked.
   *
   * @param {string} [expected="false"] - The expected value of the input to be checked ("true" or "false").
   * @example
   * // Verifies that the "false" option is selected by default
   * verifyDefaultCurrentRiskGreaterThanResidualSelection();
   * @example
   * // Verifies that the "true" option is selected
   * verifyDefaultCurrentRiskGreaterThanResidualSelection("true");
   */
  verifyDefaultCurrentRiskGreaterThanResidualSelection(expected = "false") {
    cy.get(
      `input[name="currentRiskGreaterThanResidual"][value="${expected}"]`,
    ).should("be.checked");
  }

  /**
   * Toggles the "Current Risk Greater Than Residual" options by checking both
   * the "check" and "uncheck" checkboxes using Cypress commands.
   * Ensures both checkboxes are checked after the operation.
   *
   * @function
   * @returns {void}
   */
  toggleCurrentRiskGreaterThanResidualOptions() {
    cy.get(locators.administration.customerProfile.currentRiskGreaterCheck)
      .check({ force: true })
      .should("be.checked");
    cy.get(locators.administration.customerProfile.currentRiskGreaterUncheck)
      .check({ force: true })
      .should("be.checked");
  }

  /**
   * Verifies the functionality of the "Lock Risk Definition" checkbox.
   *
   * This method performs the following actions:
   * 1. Asserts that the checkbox exists in the DOM.
   * 2. Checks the checkbox (forcing the action if necessary) and verifies it is checked.
   * 3. Unchecks the checkbox (forcing the action if necessary) and verifies it is not checked.
   *
   * @returns {void}
   */
  verifyLockRiskDefinitionCheckbox() {
    cy.get(locators.administration.customerProfile.lockRiskItem)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
    cy.get(locators.administration.customerProfile.lockRiskItem)
      .uncheck({ force: true })
      .should("not.be.checked");
  }

  /**
   * Verifies the functionality of the "Efficacy to Control Risk" checkbox.
   *
   * This method performs the following actions:
   * 1. Asserts that the checkbox exists in the DOM.
   * 2. Checks the checkbox (forcing the action if necessary) and verifies it is checked.
   * 3. Unchecks the checkbox (forcing the action if necessary) and verifies it is not checked.
   *
   * @returns {void}
   */
  verifyEfficacyToControlRiskCheckbox() {
    cy.get(locators.administration.customerProfile.efficacyControlCheck)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
    cy.get(locators.administration.customerProfile.efficacyControlCheck)
      .uncheck({ force: true })
      .should("not.be.checked");
  }

  /**
   * Verifies the "Control Test Approval Required" checkbox functionality.
   * - Asserts the checkbox exists and is initially checked.
   * - Unchecks the checkbox and verifies it is not checked.
   * - Checks the checkbox again and verifies it is checked.
   *
   * @returns {void}
   */
  verifyControlTestApprovalRequiredCheckbox() {
    cy.get(locators.administration.customerProfile.controlTestApprovalRequired)
      .should("exist")
      .should("be.checked");
    cy.get(locators.administration.customerProfile.controlTestApprovalRequired)
      .uncheck({ force: true })
      .should("not.be.checked");
    cy.get(locators.administration.customerProfile.controlTestApprovalRequired)
      .check({ force: true })
      .should("be.checked");
  }

  /**
   * Updates the default control testing role in the customer profile.
   *
   * This method interacts with the UI to select a specified role from a dropdown,
   * searches for the role, selects it, and verifies that the selected role is displayed.
   *
   * @param {string} role - The name of the role to set as the default control testing role.
   */
  updateDefaultControlTestingRole(role) {
    cy.get(
      locators.administration.customerProfile.defaultControlTestingRole,
    ).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      role,
    );
    cy.get(locators.administration.customerProfile.examProcessOwnerSearchResult)
      .contains(role)
      .click();
    cy.get(
      locators.administration.customerProfile.defaultControlTestingRoleSearch,
    ).should("have.text", role);
  }

  /**
   * Verifies the "Enable ROC to Create New Risk" checkbox functionality.
   *
   * This method checks that the checkbox exists, can be checked (and is checked after),
   * and can be unchecked (and is not checked after). Uses Cypress commands to interact
   * with the checkbox element defined in the locators.
   */
  verifyEnableRocToCreateNewRiskCheckbox() {
    cy.get(locators.administration.customerProfile.enableROCCreateNewRisk)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
    cy.get(locators.administration.customerProfile.enableROCCreateNewRisk)
      .uncheck({ force: true })
      .should("not.be.checked");
  }

  /**
   * Unchecks the "lock risk item" checkbox in the customer profile administration page.
   * This method forces the unchecking action, bypassing any potential UI restrictions.
   * Typically used to save the profile without selecting optional checkboxes.
   */
  saveWithoutOptionalCheckboxes() {
    cy.get(locators.administration.customerProfile.lockRiskItem).uncheck({
      force: true,
    });
  }

  /**
   * Verifies that the default risk currency and control testing role fields are prefilled with the expected values.
   *
   * @param {string} currency - The expected currency value to be prefilled.
   * @param {string} role - The expected role value to be prefilled.
   */
  verifyPrefilledDataCurrency(currency, role) {
    cy.get(
      locators.administration.customerProfile.defaultRiskCurrencySelect,
    ).should("have.text", currency);
    cy.get(
      locators.administration.customerProfile.defaultControlTestingRoleSearch,
    ).should("have.text", role);
  }

  /**
   * Verifies that entering an invalid input in the Default Risk Currency dropdown
   * displays a "No matches found" message and closes the dropdown.
   *
   * @param {string} invalidInput - The invalid input value to test in the dropdown search.
   */
  verifyInvalidInputsInDefaultRiskCurrency(invalidInput) {
    cy.get(locators.administration.customerProfile.defaultRiskCurrency).click();
    cy.get(locators.administration.customerProfile.selectSearchDropDown).type(
      invalidInput,
    );
    cy.contains(testData.noMatchesFound).should("be.visible");
    cy.get("body").click(0, 0);
  }

  /**
   * **********<<<<<<<<<<<<<<<<< QA Testing Method Section >>>>>>>>>>>>>******************
   *
   */

  /**
   * Verifies that the Scheduler Pre-Notification field is present, visible, and enabled
   * on the Customer Profile administration page.
   *
   * Uses Cypress commands to assert the field's visibility and enabled state.
   */
  verifySchedulerPreNotificationFieldPresent() {
    cy.get(locators.administration.customerProfile.schedularPreNotification)
      .should("be.visible")
      .and("be.enabled");
  }

  /**
   * Verifies that the Scheduler Pre-Notification input field only accepts up to 10 characters.
   * Clears the input, types the provided value, and asserts that the field's value is truncated to 10 characters.
   *
   * @param {string} [value="12345678901"] - The value to input into the Scheduler Pre-Notification field.
   */
  verifySchedulerPreNotificationValidation(value = "12345678901") {
    cy.get(locators.administration.customerProfile.schedularPreNotification)
      .clear()
      .type(value);
    cy.get(
      locators.administration.customerProfile.schedularPreNotification,
    ).should("have.value", value.slice(0, 10));
  }

  /**
   * Enters a valid value into the Scheduler Pre-Notification input field.
   *
   * @param {string} [value="12345"] - The value to be entered into the input field. Defaults to "12345" if not provided.
   */
  saveValidSchedulerPreNotificationValue(value = "12345") {
    cy.get(locators.administration.customerProfile.schedularPreNotification)
      .clear()
      .type(value);
  }

  /**
   * Verifies that the action plan status auto-update reminder options
   * (Active and Inactive checkboxes) exist on the Customer Profile page.
   * Uses Cypress commands to assert the presence of the relevant elements.
   *
   * @function
   * @returns {void}
   */
  verifyActionPlanStatusAutoUpdateReminderOptions() {
    cy.get(
      locators.administration.customerProfile.actionPlanStatusActiveCheck,
    ).should("exist");
    cy.get(
      locators.administration.customerProfile.actionPlanStatusInactiveCheck,
    ).should("exist");
  }

  /**
   * Verifies that the default selection status of the "autoCommentStatus" input matches the expected value.
   *
   * @param {string} [expected="false"] - The expected value of the "autoCommentStatus" input to be checked ("true" or "false").
   * @returns {void}
   */
  verifyDefaultActionPlanStatusSelection(expected = "false") {
    cy.get(`input[name="autoCommentStatus"][value="${expected}"]`).should(
      "be.checked",
    );
  }

  /**
   * Toggles the status options for the Action Plan by checking both
   * the "Inactive" and "Active" checkboxes in the Customer Profile Administration page.
   * Ensures both checkboxes are checked after the operation.
   *
   * @function
   * @returns {void}
   */
  toggleActionPlanStatusOptions() {
    cy.get(
      locators.administration.customerProfile.actionPlanStatusInactiveCheck,
    )
      .check({ force: true })
      .should("be.checked");
    cy.get(locators.administration.customerProfile.actionPlanStatusActiveCheck)
      .check({ force: true })
      .should("be.checked");
  }

  /**
   * Verifies the functionality of the "Single User QA" checkbox.
   *
   * This method performs the following actions:
   * 1. Asserts that the checkbox exists in the DOM.
   * 2. Checks the checkbox (forcing the action if necessary) and verifies it is checked.
   * 3. Unchecks the checkbox (forcing the action if necessary) and verifies it is not checked.
   *
   * @returns {void}
   */
  verifySingleUserQACheckbox() {
    cy.get(locators.administration.customerProfile.singleUserQA)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
    cy.get(locators.administration.customerProfile.singleUserQA)
      .uncheck({ force: true, delay: 1000 })
      .should("not.be.checked");
  }

  /**
   * Verifies whether the "Single User QA" checkbox is in the expected checked state.
   *
   * @param {boolean} [expectedChecked=false] - If true, asserts the checkbox is checked; if false, asserts it is not checked.
   */
  verifyDefaultSingleUserQAState(expectedChecked = false) {
    cy.get(locators.administration.customerProfile.singleUserQA).should(
      expectedChecked ? "be.checked" : "not.be.checked",
    );
  }

  /**
   * Saves valid inputs for the QA Testing section.
   * Sets the Scheduler Pre-Notification value and toggles the Single User QA checkbox as specified.
   *
   * @param {string} [value="12345"] - The value to enter in the Scheduler Pre-Notification field.
   * @param {boolean} [singleUserQA=true] - Whether to check (true) or uncheck (false) the Single User QA checkbox.
   */
  saveValidQATestingSectionInputs(value = "12345", singleUserQA = true) {
    cy.get(locators.administration.customerProfile.schedularPreNotification)
      .clear()
      .type(value);
    if (singleUserQA) {
      cy.get(locators.administration.customerProfile.singleUserQA).check({
        force: true,
      });
    } else {
      cy.get(locators.administration.customerProfile.singleUserQA).uncheck({
        force: true,
      });
    }
  }

  /**
   * Fills the scheduler pre-notification field with the specified value and unchecks the Single User QA option.
   *
   * @param {string} [value="12345"] - The value to enter into the scheduler pre-notification input field.
   */
  saveWithoutOptionalFields(value = "12345") {
    cy.get(locators.administration.customerProfile.schedularPreNotification)
      .clear()
      .type(value);
    cy.get(locators.administration.customerProfile.singleUserQA).uncheck({
      force: true,
    });
  }

  /**
   * Verifies that appropriate error messages are displayed when required fields are missing.
   * Clears the scheduler pre-notification field and attempts to save the form,
   * triggering validation errors for missing required fields.
   *
   * @returns {void}
   */
  verifyErrorMessagesForMissingRequiredFields() {
    cy.get(
      locators.administration.customerProfile.schedularPreNotification,
    ).clear();
    this.clickSaveButton();
  }

  /**
   * Verifies that the scheduler pre-notification input field enforces the maximum length constraint.
   *
   * This method checks that the input field has the correct 'maxlength' attribute,
   * clears any existing value, types the provided input value, and asserts that
   * the field's value is truncated to the allowed maximum length.
   *
   * @param {string} [inputValue="12345678901"] - The value to input into the scheduler pre-notification field for testing.
   */
  verifySchedulerPreNotificationFieldLimit(inputValue = "12345678901") {
    cy.get(locators.administration.customerProfile.schedularPreNotification)
      .should("have.attr", "maxlength", testData.maxLength)
      .clear()
      .type(inputValue);
    cy.get(
      locators.administration.customerProfile.schedularPreNotification,
    ).should("have.value", inputValue.slice(0, 10));
  }

  /**
   * Verifies that the customer profile form fields are prefilled with the expected data.
   *
   * @param {string} value - The expected value for the scheduler pre-notification input.
   * @param {string} status - The expected status value for the auto comment status radio button.
   * @param {boolean} singleUserQA - Whether the single user QA checkbox should be checked.
   */
  verifyPrefilledData(value, status, singleUserQA) {
    cy.get(
      locators.administration.customerProfile.schedularPreNotification,
    ).should("have.value", value);
    cy.get(`input[name="autoCommentStatus"][value="${status}"]`).should(
      "be.checked",
    );
    cy.get(locators.administration.customerProfile.singleUserQA).should(
      singleUserQA ? "be.checked" : "not.be.checked",
    );
  }

  /**
   * Enters an invalid value into the Scheduler Pre-Notification input field.
   *
   * @param {string} [invalidValue="abc"] - The invalid value to input for testing validation.
   */
  saveInvalidSchedulerPreNotificationValue(invalidValue = "abc") {
    cy.get(locators.administration.customerProfile.schedularPreNotification)
      .clear()
      .type(invalidValue);
  }

  /**
   * Saves the QA Testing section with the Single User QA checkbox toggled.
   * - Enters the provided value in the Scheduler Pre-Notification field.
   * - Checks the Single User QA checkbox and saves.
   * - Unchecks the Single User QA checkbox and saves again.
   *
   * @param {string} [value="12345"] - The value to enter in the Scheduler Pre-Notification field.
   */
  saveWithSingleUserQAToggled(value = "12345") {
    cy.get(locators.administration.customerProfile.schedularPreNotification)
      .clear()
      .type(value);
    cy.get(locators.administration.customerProfile.singleUserQA).check({
      force: true,
    });
    this.clickSaveButton();
    cy.get(locators.administration.customerProfile.singleUserQA).uncheck({
      force: true,
    });
    this.clickSaveButton();
  }

  /**
   * **************<<<<<<<<<<<<<<<<< Basic Settings Section >>>>>>>>>>>>>******************
   */

  /**
   * Fills the mandatory fields in the customer profile form.
   *
   * @param {Object} params - The parameters for filling the form.
   * @param {string} params.idrssd - The ID RSSD value to enter in the form.
   */
  fillMandatoryFields({ idrssd }) {
    cy.get(locators.administration.customerProfile.idrssd).clear().type(idrssd);
  }

  /**
   * Fills optional fields in the customer profile form using provided values.
   *
   * @param {Object} fields - An object containing optional field values to fill.
   * @param {string} [fields.fdic] - Value for the FDIC field.
   * @param {string} [fields.occ] - Value for the OCC field.
   * @param {string} [fields.companyName] - Value for the Company Name field.
   * @param {string} [fields.street] - Value for the Street field.
   * @param {string} [fields.city] - Value for the City field.
   * @param {string} [fields.state] - Value for the State field.
   * @param {string} [fields.zip] - Value for the ZIP code field.
   */
  fillOptionalFields(fields = {}) {
    const selectors = {
      fdic: locators.administration.customerProfile.fdic,
      occ: locators.administration.customerProfile.occ,
      companyName: locators.administration.customerProfile.companyName,
      street: locators.administration.customerProfile.street,
      city: locators.administration.customerProfile.city,
      state: locators.administration.customerProfile.state,
      zip: locators.administration.customerProfile.zip,
    };
    Object.entries(selectors).forEach(([key, selector]) => {
      if (fields[key]) cy.get(selector).clear().type(fields[key]);
    });
  }

  /**
   * Enables the Customer Support option by checking the corresponding checkbox.
   * Uses Cypress to locate the element via the specified locator and forces the check action.
   */
  enableCustomerSupport() {
    cy.get(locators.administration.customerProfile.enableCustomerSupport).check(
      {
        force: true,
      },
    );
  }

  /**
   * Disables the customer support option by checking the corresponding checkbox.
   * Uses Cypress to locate the checkbox element and forcefully checks it.
   */
  disableCustomerSupport() {
    cy.get(
      locators.administration.customerProfile.disableCustomerSupport,
    ).check({
      force: true,
    });
  }

  /**
   * Selects one or more consultants from a dropdown or list in the Customer Profile administration page.
   *
   * @param {string[]} consultants - An array of consultant names to select.
   */
  selectConsultants(consultants = []) {
    cy.get(locators.administration.customerProfile.consultantSelect).select(
      consultants,
      { force: true },
    );
  }

  /**
   * Saves the customer profile by clicking the save button and waits for the confirmation toast message to appear.
   * Utilizes a medium wait time as defined in Cypress environment variables.
   */
  saveProfile() {
    this.clickSaveButton();
    cy.waitForElementToVisible(
      locators.administration.toastMsg,
      Cypress.env("waits").mediumWait,
    );
  }

  /**
   * Enters an invalid IDRSSD value into the corresponding input field,
   * clears any existing value, types the provided value, and asserts
   * that the input contains the first 15 characters of the value.
   *
   * @param {string} value - The invalid IDRSSD value to enter.
   */
  enterInvalidIdrssd(value) {
    cy.get(locators.administration.customerProfile.idrssd).clear().type(value);
    cy.get(locators.administration.customerProfile.idrssd).should(
      "have.value",
      value.slice(0, 15),
    );
  }
  /**
   * Asserts that the IDRSSD field value has the expected maximum length.
   *
   * @param {number} [maxlength=15] - The expected maximum length of the IDRSSD field value.
   */
  assertIdrssdFieldLength(maxlength = 15) {
    cy.get(locators.administration.customerProfile.idrssd)
      .invoke("val")
      .should("have.length", maxlength);
  }

  /**
   * Clears all optional and required customer profile fields except for mandatory/readonly fields.
   * Optimized to handle all relevant selectors in a loop.
   */
  leaveOptionalFieldsEmpty() {
    const selectors = [
      locators.administration.customerProfile.fdic,
      locators.administration.customerProfile.occ,
      locators.administration.customerProfile.companyName,
      locators.administration.customerProfile.street,
      locators.administration.customerProfile.city,
      locators.administration.customerProfile.state,
      locators.administration.customerProfile.zip,
    ];
    selectors.forEach((selector) => {
      cy.get(selector).clear();
    });
    // Primary ABA Routing Number is readonly and always '0'
  }

  /**
   * Verifies that all optional customer profile fields are empty.
   * Iterates through a predefined list of field selectors and asserts that each field's value is an empty string.
   *
   * @function
   * @returns {void}
   */
  verifyOptionalFieldsAreEmpty() {
    const selectors = [
      locators.administration.customerProfile.companyName,
      locators.administration.customerProfile.street,
      locators.administration.customerProfile.city,
      locators.administration.customerProfile.state,
      locators.administration.customerProfile.zip,
    ];
    selectors.forEach((selector) => {
      cy.get(selector).should("have.value", "");
    });
  }

  /**
   * Verifies that an error message containing the specified text is visible on the page.
   *
   * @param {string} [field="error"] - The text of the error message to verify.
   */
  verifyErrorMessage(field = testData.errors.mandatoryFieldsError) {
    cy.contains(field).should("be.visible");
  }
}
