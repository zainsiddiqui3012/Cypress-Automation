import locators from "../../../../fixtures/locators.json";
import MyDocumentsHelpers from "./../helpers/MyDocumentsHelper";
import companyDocLocators from "../../../../fixtures/DMS/CompanyDocument/CompanyDocument.json";

export default class AccessSettings {
  /**
   * withinDmsFrame - Execute callback within DMS iframe context
   * @description Wraps Cypress commands to execute within the DMS frame element
   * @param {Function} callback - Callback function containing Cypress commands to execute within frame
   * @returns {void}
   * @side-effects Executes callback within iframe context
   */
  withinDmsFrame(callback) {
    cy.get("@dmsFrame", { timeout: 30000 }).within(callback);
  }

  /**
   * clickThreeEllipses - Click three-dot menu icon for a grid row
   * @description Opens dropdown menu by clicking ellipsis icon at specified index
   * @param {number} index - Row index (0-based)
   * @returns {void}
   * @side-effects Opens dropdown menu for the row
   * @note Uses force:true and scrollIntoView to handle elements clipped by overflow containers
   */
  clickThreeEllipses(index = 0) {
    this.withinDmsFrame(() => {
      // Use direct CSS selector (more reliable than locators.json)
      // force: true handles elements clipped by overflow: hidden
      cy.get(locators.general.threeElipsesOptions, { timeout: 5000 })
        .eq(index)
        .scrollIntoView({ behavior: "smooth", block: "center" })
        .click({ force: true });

      cy.log(`✓ Clicked ellipsis menu at index ${index}`);
    });
  }
  /**
   * clickAccessSettingsFromThreeDots - Click Access Settings menu option from dropdown
   * @description Opens Access Settings modal by clicking the link within the open dropdown menu
   * @returns {void}
   * @side-effects Opens Access Settings modal
   */
  clickAccessSettingsFromThreeDots() {
    this.withinDmsFrame(() => {
      // Step 1: Wait for Access Settings link to appear (might be in dropdown-menu or other container)
      cy.get(locators.general.accessModal, { timeout: 10000 })
        .first() // Get the first visible instance
        .scrollIntoView({ behavior: "smooth", block: "center" })
        .should("exist");
      cy.get(locators.general.accessModal).first().click({ force: true });

      cy.log("✓ Clicked Access Settings from dropdown");
      this.assertAccessFieldsVisible();
    });
  }

  /**
   * assertAccessFieldsVisible - Verify all access setting dropdowns are visible
   * @description Validates that user, user group, and org group select fields exist and are visible
   * @returns {void}
   * @side-effects Asserts visibility of access setting fields
   */
  assertAccessFieldsVisible() {
    [
      "#s2id_selectAccessUser",
      "#s2id_selectAccessUserGrp",
      "#s2id_selectAccessOrgGrp",
    ].forEach((selector) => {
      cy.get(selector).should("exist").and("be.visible");
    });
  }

  /**
   * selectAccessFields - Select access field dropdown and set corresponding checkbox
   * @description Selects a value from user/userGroup/orgGroup dropdown and sets edit checkbox
   * @param {string} fieldName - Field type: "user", "userGroup", or "orgGroup"
   * @param {string} value - Value to select from dropdown
   * @param {boolean} [check=false] - Whether to check or uncheck the edit checkbox
   * @returns {void}
   * @throws {Error} Throws error if fieldName is not recognized
   * @side-effects Selects dropdown value and toggles checkbox state
   */
  selectAccessFields(fieldName, value, check = false) {
    cy.get("@dmsFrame").within(() => {
      switch (fieldName) {
        case "user":
          cy.get("#selectAccessUser").select(value, { force: true });
          this.setEditCheckbox(check, 0);
          break;
        case "userGroup":
          cy.get("#selectAccessUserGrp").select(value, { force: true });
          this.setEditCheckbox(check, 2);
          break;
        case "orgGroup":
          cy.get("#selectAccessOrgGrp").select(value, { force: true });
          this.setEditCheckbox(check, 4);
          break;
        default:
          throw new Error(`Unknown field name: ${fieldName}`);
      }
    });
  }

  /**
   * setEditCheckbox - Check or uncheck a specific checkbox in security settings
   * @description Toggles checkbox state and verifies the change
   * @param {boolean} [check=false] - True to check, false to uncheck
   * @param {number} [index=0] - Index of checkbox to target (0-based)
   * @returns {void}
   * @side-effects Checks/unchecks checkbox and asserts final state
   */
  setEditCheckbox(check = false, index = 0) {
    check
      ? cy
          .get("@dmsFrame")
          .find("#securityDiv input[type='checkbox']")
          .eq(index)
          .check({ force: true })
          .should("be.checked")
      : cy
          .get("@dmsFrame")
          .find("#securityDiv input[type='checkbox']")
          .eq(index)
          .uncheck({ force: true })
          .should("not.be.checked");
  }

  /**
   * allowAccessSettingsOptionVisible - Toggle the last access settings checkbox
   * @description Checks or unchecks the last checkbox in the security div (typically "Allow Access Settings")
   * @param {boolean} [check=false] - True to check, false to uncheck
   * @returns {void}
   * @side-effects Toggles the last checkbox and verifies state
   */
  allowAccessSettingsOptionVisible(check = false) {
    cy.get("@dmsFrame").within(() => {
      const checkbox = cy
        .get("#securityDiv [type='checkbox']")
        .last()
        .scrollIntoView();
      check
        ? checkbox.check({ force: true }).should("be.checked")
        : checkbox.uncheck({ force: true }).should("not.be.checked");
    });
  }

  /**
   * verifyOptionNotVisible - Verify a menu option is not present in action menu
   * @description Asserts that specified option text does not appear in the action menu
   * @param {string} optionName - Name of the option that should not be visible
   * @returns {void}
   * @side-effects Asserts option absence in action menu
   */
  verifyOptionNotVisible(optionName) {
    this.withinDmsFrame(() => {
      cy.get(locators.myDocuments.itemActions.actionMenu)
        .eq(-1)
        .should("be.visible")
        .within((menu) => {
          cy.get(menu).should("not.contain", optionName);
        });
    });
  }

  /**
   * verifyOptionVisible - Verify a menu option is present in action menu
   * @description Asserts that specified option text appears in the action menu
   * @param {string} optionName - Name of the option that should be visible
   * @returns {void}
   * @side-effects Asserts option presence in action menu
   */
  verifyOptionVisible(optionName) {
    this.withinDmsFrame(() => {
      cy.get(locators.myDocuments.itemActions.actionMenu)
        .eq(-1)
        .should("be.visible")
        .within((menu) => {
          cy.get(menu).should("contain", optionName);
        });
    });
  }

  /**
   * Open Access Settings modal from three-dot menu
   * @description Clicks on Access Settings option from the dropdown menu
   * @returns {void}
   */
  openAccessSettingsModal() {
    cy.get("@dmsFrame").within(() => {
      cy.get("a")
        .contains("Access Settings")
        .scrollIntoView()
        .click({ force: true });
      cy.get(locators.general.modalContent, { timeout: 10000 }).should(
        "be.visible"
      );
    });
  }

  /**
   * Save access settings
   * @description Clicks the Save button to persist access settings changes
   * @returns {void}
   */
  clickAccessSettingsSaveButton() {
    this.withinDmsFrame(() => {
      cy.get(locators.general.saveButtonA, { timeout: 5000 })
        .should("be.visible")
        .click({ force: true });

      // Wait for success message
      cy.get(locators.general.toastMessage, {
        timeout: 10000,
      }).should("exist");
    });
  }

  /**
   * verifyReadOnlyAccess - Verify user has read-only access
   * @description Asserts that user has only view access (no edit/upload permissions)
   * @returns {void}
   * @side-effects Asserts that edit and upload checkboxes are unchecked
   */
  verifyReadOnlyAccess() {
    cy.get("@dmsFrame").within(() => {
      cy.get(locators.general.userCheckbox).should("not.be.checked");
      cy.get(locators.general.userUploadCheckbox).should("not.be.checked");
    });
  }

  /**
   * verifyEditAccess - Verify user has edit access
   * @description Asserts that user has edit permission enabled (checkbox is checked)
   * @returns {void}
   * @side-effects Asserts that edit checkbox is checked
   */
  verifyEditAccess() {
    this.withinDmsFrame(() => {
      cy.get(locators.general.userCheckbox, { timeout: 5000 }).should(
        "be.checked"
      );
    });
  }

  /**
   * verifyUploadAccess - Verify user has upload access
   * @description Asserts that user has upload permission enabled (checkbox is checked)
   * @returns {void}
   * @side-effects Asserts that upload checkbox is checked
   */
  verifyUploadAccess() {
    this.withinDmsFrame(() => {
      cy.get(locators.general.userUploadCheckbox, { timeout: 5000 }).should(
        "be.checked"
      );
    });
  }

  /**
   * Verify modal title matches
   * @description Asserts that the modal title contains expected text
   * @param {string} expectedText - Expected title text
   * @returns {void}
   */
  verifyModalTitle(expectedText = "Access Settings") {
    cy.get("@dmsFrame").within(() => {
      cy.get(locators.general.modalTitle).should("contain.text", expectedText);
    });
  }

  /**
   * waitForModalLoad - Wait for modal to load
   * @description Waits for the access settings modal to be fully loaded and spinner to disappear
   * @returns {void}
   * @side-effects Waits for modal visibility and spinner to be hidden
   */
  waitForModalLoad() {
    cy.get("@dmsFrame").within(() => {
      cy.get(locators.general.modalContent, { timeout: 15000 }).should(
        "be.visible"
      );
      cy.get(locators.general.modalSpinner).should("not.be.visible");
    });
  }
}
