import locators from "../../../../../fixtures/locators.json";

class FormHelper {
  static openForm(btnText) {
    cy.get(locators.general.addBtn)
      .parent()
      .contains("span", btnText)
      .should("be.visible")
      .click();
  }

  /**
   * Fill Risk Category form
   * @param {object} data - Form data
   */
  static fillRiskCategoryForm(data) {
    if (data.riskCategoryId) {
      cy.get(locators.risk.administration.riskCategory.catId)
        .clear()
        .type(data.riskCategoryId);
    }
    if (data.name) {
      cy.get(locators.risk.administration.riskCategory.formName)
        .clear()
        .type(data.name);
    }
    if (data.description) {
      cy.get(locators.risk.administration.riskCategory.formDescription)
        .clear({ force: true })
        .type(data.description, { force: true });
    }
  }

  /**
   * Fill Risk Definition form
   * @param {object} data - Form data
   */
  static fillRiskDefinitionForm(data) {
    if (data.riskDefinitionId) {
      cy.get(locators.risk.administration.riskDefinition.defId)
        .should("be.visible")
        .clear()
        .type(data.riskDefinitionId);
    }
    if (data.name) {
      cy.get(locators.risk.administration.riskDefinition.defName)
        .clear()
        .type(data.name);
    }
    if (data.description) {
      // Handle CKEditor properly
      this.fillCKEditorDescription(data.description);
    }
    if (data.cfrGuidance) {
      cy.get(locators.risk.administration.riskDefinition.cfrGuidance)
        .clear()
        .type(data.cfrGuidance);
    }
    if (data.status && !data.updated) {
      // Handle Select2 dropdown
      cy.get(
        locators.risk.administration.riskDefinition.statusDropDown
      ).click();
      cy.get(locators.risk.administration.riskDefinition.selectedStatus)
        .contains(data.status)
        .click();
    }
    if (data.status && data.updated) {
      cy.get(locators.risk.administration.riskDefinition.statusUpdated).select(
        data.status
      );
    }
  }

  /**
   * Fill CKEditor description field
   * @param {string} description - Description text to fill
   */
  static fillCKEditorDescription(description) {
    // Wait for CKEditor to be ready
    cy.window().then((win) => {
      cy.wrap(null).should(() => {
        expect(win.CKEDITOR).to.exist;
        expect(win.CKEDITOR.instances.description).to.exist;
      });
    });

    // Set data using CKEditor API
    cy.window().then((win) => {
      win.CKEDITOR.instances.description.setData(description);
    });
  }

  /**
   * Submit form using save button
   * @param {string} formType - Type of form (category/definition)
   */
  static submitForm(formType = "Category") {
    const saveButtonId =
      formType === "Category"
        ? locators.risk.administration.riskCategory.formSaveBtn
        : locators.risk.administration.riskDefinition.formSaveBtn;
    cy.get(saveButtonId).click();
  }

  /**
   * Cancel form
   */
  static cancelForm(index = 0) {
    cy.get(locators.risk.administration.riskCategory.cancelFormBtn)
      .eq(index)
      .scrollIntoView()
      .should("be.visible")
      .click();
  }

  /**
   * Select risk category in tree - Updated to handle hidden checkboxes
   * @param {string} categoryName - Name of the category to select
   */
  static selectRiskCategory(categoryName, previousCategory = false) {
    // Wait for tree to load
    cy.get(locators.risk.administration.riskCategory.riskCategoryTree).should(
      "be.visible"
    );

    // Find the category and scroll it into view
    cy.get(locators.risk.administration.riskCategory.riskCategoryTreeParent)
      .contains(
        locators.risk.administration.riskCategory.selectCategoryTree,
        categoryName
      )
      .should("be.visible")
      .scrollIntoView()
      .then(($el) => {
        // Find the checkbox within the same tree item
        let $checkbox;
        if (!previousCategory) {
          $checkbox = $el
            .closest(".aciTreeLi")
            .find(locators.risk.administration.riskCategory.checkCategory);
        } else {
          $checkbox = $el
            .closest(".aciTreeLi")
            .next()
            .find(locators.risk.administration.riskCategory.checkCategory);
        }

        // Click the checkbox with force if it's hidden
        cy.wrap($checkbox).click({ force: true });
      });

    // Verify selection by checking if parentIds is populated
    cy.get(
      locators.risk.administration.riskCategory.verifyCheckCategory
    ).should("not.have.value", "");
  }

  /**
   * Alternative method to select risk category by clicking the label
   * @param {string} categoryName - Name of the category to select
   */
  static selectRiskCategoryByLabel(categoryName) {
    cy.get(locators.risk.administration.riskCategory.riskCategoryTreeParent)
      .contains(
        locators.risk.administration.riskCategory.selectCategoryTree,
        categoryName
      )
      .scrollIntoView()
      .closest("label")
      .click({ force: true });

    // Verify selection
    cy.get(
      locators.risk.administration.riskCategory.verifyCheckCategory
    ).should("not.have.value", "");
  }

  /**
   * Select multiple risk categories
   * @param {string[]} categoryNames - Array of category names to select
   */
  static selectMultipleRiskCategories(categoryNames) {
    categoryNames.forEach((categoryName) => {
      this.selectRiskCategory(categoryName);
      cy.wait(500); // Small delay between selections
    });
  }

  /**
   * Verify form field is required
   * @param {string} fieldSelector - CSS selector for the field
   */
  static verifyFieldRequired(fieldSelector) {
    cy.get(fieldSelector)
      .siblings("label, .col-form-label")
      .find(".required")
      .should("exist");
  }

  /**
   * Wait for form to be fully loaded
   * @param {string} formType - Type of form (category/definition)
   */
  static waitForFormLoad(formType = "category") {
    const formId =
      formType === "category"
        ? locators.risk.administration.riskCategory.formClosed
        : locators.risk.administration.riskDefinition.formClosed;
    cy.get(formId).should(
      "have.class",
      locators.risk.administration.riskCategory.closedClassName
    );

    if (formType === "definition") {
      // Wait for CKEditor to load
      cy.window().then((win) => {
        cy.wrap(null).should(() => {
          expect(win.CKEDITOR).to.exist;
        });
      });

      // Wait for tree to load
      cy.get(locators.risk.administration.riskCategory.riskCategoryTree).should(
        "be.visible"
      );
    }
  }

  /**
   * Verify form is closed
   * @param {string} formType - Type of form (category/definition)
   */
  static verifyFormClosed(formType = "Category") {
    const formId =
      formType === "Category"
        ? locators.risk.administration.riskCategory.formClosed
        : locators.risk.administration.riskDefinition.formClosed;
    cy.get(formId).should(
      "not.have.class",
      locators.risk.administration.riskCategory.closedClassName
    );
  }

  /**
   * Clear all form fields
   * @param {string} formType - Type of form (category/definition)
   */
  static clearForm(formType = "category") {
    if (formType === "category") {
      cy.get(locators.risk.administration.riskCategory.catId).clear();
      cy.get(locators.risk.administration.riskCategory.formName).clear();
      cy.get(locators.risk.administration.riskCategory.formDescription).clear();
    } else {
      cy.get(locators.risk.administration.riskDefinition.defId).clear();
      cy.get(locators.risk.administration.riskCategory.formName).clear();
      cy.get(locators.risk.administration.riskDefinition.cfrGuidance).clear();

      // Clear CKEditor
      cy.window().then((win) => {
        if (win.CKEDITOR && win.CKEDITOR.instances.description) {
          win.CKEDITOR.instances.description.setData("");
        }
      });
    }
  }

  /**
   * Handle Select2 dropdown selection
   * @param {string} selectId - ID of the select element
   * @param {string} optionText - Text of the option to select
   */
  static selectFromSelect2Dropdown(selectId, optionText) {
    cy.get(`#s2id_${selectId} .select2-choice`).click();
    cy.get(locators.risk.administration.riskDefinition.selectedStatus)
      .contains(optionText)
      .click();
  }

  /*******************************************************
   * ******** Control Taxonomy Section ******************
   * *****************************************************/
  /**
   * Fill Control Taxonomy form
   * @param {object} data - Form data
   */
  static fillControlTaxonomyForm(data) {
    if (data.name) {
      cy.get(locators.general.gridName).eq(0).clear().type(data.name);
    }
    if (data.contentLibrary) {
      cy.get(
        locators.control.administration.controlTaxonomy.contentLibraryDropdown
      ).click();
      cy.get(
        locators.control.administration.controlTaxonomy.contentLibraryOption
      )
        .contains(data.contentLibrary)
        .click();
    }
    if (data.description) {
      cy.get(locators.control.administration.controlTaxonomy.formDescription)
        .clear()
        .type(data.description);
    }
    if (data.status) {
      cy.get(
        locators.control.administration.controlTaxonomy.statusDropdown
      ).select(data.status);
    }
  }

  /**
   * Fill Control Category form
   * @param {object} data - Form data
   */
  static fillControlCategoryForm(data) {
    if (data.controlCategoryId) {
      cy.get(locators.risk.controlTaxonomies.categoryIdInput)
        .should("not.be.disabled")
        .and("be.visible")
        .clear()
        .type(data.controlCategoryId);
    }
    if (data.name) {
      cy.get(locators.risk.controlTaxonomies.categoryNameInput)
        .should("not.be.disabled")
        .and("be.visible")
        .clear()
        .type(data.name);
    }
  }

  /**
   * Fill Control Definition form
   * @param {object} data - Form data
   */
  static fillControlDefinitionForm(data) {
    if (data.controlDefinitionId) {
      cy.get(locators.risk.controlDefinition.definitionIdInput)
        .should("be.visible")
        .clear()
        .type(data.controlDefinitionId, { force: true });
    }
    if (data.name) {
      cy.get(locators.risk.controlDefinition.definitionNameInput)
        .and("be.visible")
        .clear()
        .type(data.name);
    }
    if (data.description) {
      cy.switchToIframe(locators.risk.controlDefinition.descriptionIframe).then(
        ($iframe) => {
          cy.get($iframe).find("p").clear().type(data.description);
        }
      );
    }
    if (data.controlType) {
      cy.get(locators.risk.controlDefinition.controlTypeDropdown).then(
        ($controlType) => {
          cy.get($controlType).click();
          cy.dropDownSearchAndSelect(
            locators.general.selectSearch,
            data.controlType
          );
        }
      );
    }
  }

  /**
   * Select control category in tree
   * @param {string} categoryName - Name of the category to select
   */
  static selectControlCategory(categoryName) {
    // First scroll to the tree container to make it visible
    cy.get(locators.risk.controlDefinition.controlCategoryTree, {
      timeout: 10000,
    })
      .scrollIntoView({ offset: { top: -100, left: 0 } })
      .should("be.visible");
    // Wait a moment for the tree to stabilize
    cy.wait(500);
    cy.get(locators.risk.controlDefinition.controlCategoryTree).should(
      "be.visible"
    );

    cy.get(locators.risk.controlDefinition.controlCategoryTreeParent)
      .contains(
        locators.risk.administration.riskCategory.selectCategoryTree,
        categoryName
      )
      .scrollIntoView()
      .should("be.visible")
      .then(($el) => {
        const $checkbox = $el
          .closest(".aciTreeLi")
          .find(locators.risk.administration.riskCategory.checkCategory);
        cy.wrap($checkbox).click({ force: true });
      });

    cy.get(locators.risk.controlDefinition.controlCategoryTreeParent)
      .contains(categoryName)
      .closest(locators.risk.administration.treeOperations.treeLi)
      .should("have.class", "aciTreeChecked");
  }

  /**
   * Select dropdown option by value or text
   * @param {string} selector - CSS selector for the dropdown
   * @param {string} option - Option value or text to select
   */

  static selectDropdown(selector, option) {
    if (option) {
      // Click the dropdown (the wrapper element)
      cy.get(selector).first().click({ force: true });
    }
  }

  /**
   * Click radio button based on value
   * @param {string} activeSelector - Selector for active radio button
   * @param {string} inactiveSelector - Selector for inactive radio button
   * @param {string} status - Status to select ('Active' or 'Inactive')
   */
  static selectRadioStatus(activeSelector, inactiveSelector, status) {
    if (status === "Active") {
      cy.get(activeSelector).click({ force: true });
    } else if (status === "Inactive") {
      cy.get(inactiveSelector).should("be.visible").click();
    }
  }

  /**
   * Fill date input with proper formatting
   * @param {string} selector - CSS selector for the date input
   * @param {string} date - Date string to enter
   */

  static fillDateInput(selector, date, previousDate, futureDate) {
    if (date) {
      cy.get(selector)
        .first() // pick only the first match
        .clear({ force: true })
        .type(date, { force: true }); // Press Enter to confirm
    }
    if (previousDate) {
      cy.get(selector)
        .first() // pick only the first match
        .clear({ force: true })
        .type(previousDate, { force: true }); // Press Enter to confirm
    }
    if (futureDate) {
      cy.get(selector)
        .first() // pick only the first match
        .clear({ force: true })
        .type(futureDate, { force: true }); // Press Enter to confirm
    }
  }

  /**
   * Click button with visibility check
   * @param {string} selector - CSS selector for the button
   * @param {number} timeout - Timeout for visibility check (default: 10000)
   * // cancelBtm locator: "a.btn.btn-outline-primary.m-btn.quickSidebarCloseBtn"
   */
  static clickButton(selector, timeout = 10000) {
    cy.get(selector).should("be.visible", { timeout }).click({ force: true });
  }

  // static clickCanButton(selector, timeout = 10000) {
  //   cy.get(selector).scrollIntoView().click({ force: true });
  // }
  static clickCanButton(selector, timeout = 20000) {
    cy.waitForTopMsgLoaderToDisappear(20000);
    cy.get(selector, { timeout })
      .scrollIntoView()
      .wait(500)
      .click({ force: true, delay: 100 });
  }

  /**
   * Wait for modal or form to appear
   * @param {string} modalSelector - Selector for modal/form container
   * @param {number} timeout - Timeout for modal appearance (default: 10000)
   */
  static waitForModalToAppear(modalSelector, timeout = 10000) {
    cy.get(modalSelector).should("be.visible", { timeout });
  }

  //*************** R I S K --- T Y P E --- Methods *********************************************
  // ******************************************************************************************** */

  /**
   * Fill Risk Type form specifically
   * @param {object} data - Form data containing name and description
   */
  static fillRiskTypeForm(data) {
    if (data.name !== undefined && data.name !== null) {
      if (data.name === "") {
        cy.get("#eventName").clear();
      } else {
        cy.get("#eventName").clear().type(data.name);
      }
    }

    if (data.description !== undefined && data.description !== null) {
      if (data.description === "") {
        cy.get("#description").clear();
      } else {
        cy.get("#description").clear().type(data.description);
      }
    }
  }

  /**
   * Open Risk Type add form
   */
  static openRiskTypeForm() {
    cy.get('a[data-target="#addEventTypeSlider"]').should("be.visible").click();
    cy.get("#addEventTypeSlider").should("be.visible");
    cy.get("#eventName").should("be.visible");
  }

  /**
   * Save Risk Type form
   */
  static saveRiskTypeForm() {
    cy.get("#btn_save").click();
  }

  /**
   * Cancel Risk Type form
   */
  static cancelRiskTypeForm() {
    cy.get(".quickSidebarCloseBtn").click();
  }

  /**
   * Close Risk Type form using X button
   */
  static closeRiskTypeForm() {
    cy.get(".m-quick-sidebar__close").click();
  }

  /**
   * Verify form modal visibility
   * @param {boolean} shouldBeVisible - Whether modal should be visible
   */
  static verifyFormModalVisibility(shouldBeVisible = true) {
    if (shouldBeVisible) {
      cy.get("#addEventTypeSlider").should("be.visible");
    } else {
      cy.get("#addEventTypeSlider").should("not.be.visible");
    }
  }

  /**
   * Clear all Risk Type form fields
   */
  static clearAllRiskTypeFields() {
    cy.get("#eventName").clear();
    cy.get("#description").clear();
  }

  /**
   * Get Risk Type form field value
   * @param {string} fieldName - Field name (name, description)
   * @returns {Cypress.Chainable} Field value
   */
  static getRiskTypeFieldValue(fieldName) {
    const selectors = {
      name: "#eventName",
      description: "#description",
    };
    return cy.get(selectors[fieldName]).invoke("val");
  }

  /**
   * *******************************************************************************************
   * ************* Risk Taxonomy - Customer Space - Risk Definition - Methods *****************
   * *******************************************************************************************
   */

  /**
   * Fill Risk Definition form
   * @param {object} data - Form data
   */
  static fillRiskDefinitionCSForm(data, section = "add") {
    const riskDefinitionForm = "#manageRiskRegisterNameForm";
    if (data.riskDefinitionId) {
      cy.get(`${riskDefinitionForm} #riskId`)
        .scrollIntoView()
        .clear()
        .type(data.riskDefinitionId);
    }
    if (data.name) {
      cy.get(`${riskDefinitionForm} #field-name`)
        .scrollIntoView()
        .clear()
        .type(data.name);
    }
    if (data.description) {
      const frameLoc =
        section === "add"
          ? "[title='Rich Text Editor, riskDefinitionDescription']"
          : "[title='Rich Text Editor, description']";
      cy.switchToIframe(frameLoc).then(($iframe) => {
        cy.get($iframe).find("p").clear().type(data.description);
      });
    }
    if (data.cfrGuidance) {
      cy.get(`${riskDefinitionForm} #cfrGuidance`)
        .scrollIntoView()
        .clear()
        .type(data.cfrGuidance);
    }
    if (data.status) {
      cy.get(locators.risk.administration.riskDefinition.statusUpdated).scrollIntoView().select(data.status, { force: true });
    }
  }

  /**
   * Fill CKEditor description field for Risk Definition
   * @param {string} description - Description text to fill
   * @param {string} editorId - ID of the CKEditor instance
   */
  static fillCKEditorDescription(description, editorId = "description") {
    // Wait for CKEditor to be ready
    cy.window().then((win) => {
      cy.wrap(null).should(() => {
        expect(win.CKEDITOR).to.exist;
        expect(win.CKEDITOR.instances[editorId]).to.exist;
      });
    });

    // Set data using CKEditor API
    cy.window().then((win) => {
      win.CKEDITOR.instances[editorId].setData(description);
    });
  }

  static fillMandatoryFields(data) {
    if (data.name) {
      cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.name)
        .scrollIntoView()
        .clear({ force: true })
        .type("{selectall}{backspace}")
        .type(data.name);
    }

    if (data.controlType) {
      cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.controlType).select(data.controlType, { force: true });
    }
  }

  static fillOptionalFields(data) {
    if (data.controlDefId) {
      cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.controlDefId)
        .scrollIntoView()
        .clear()
        .type(data.controlDefId);
    }
    if (data.description) {
      const frameLoc = locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.description;
      cy.switchToIframe(frameLoc).then(($iframe) => {
        cy.get($iframe).find("p").clear().type(data.description);
      });
    }
    if (data.controlOperations) {
      cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.controlOperations).select(data.controlOperations, {
        force: true,
      });
    }
    if (data.controlDefinitionCategories) {
      cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.controlDefCat).select(data.controlDefinitionCategories, {
        force: true,
      });
    }
    if (data.primaryControl) {
      cy.get(`[name='isPrimaryControl'][value='${data.primaryControl}']`).check(
        { force: true }
      );
    }
    if (data.controlFrequency) {
      cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.controlFrequency).select(data.controlFrequency, {
        force: true,
      });
    }
    if (data.preventFraud) {
      cy.get(`[name='preventsFraud'][value='${data.preventFraud}']`).check({
        force: true,
      });
    }
    if (data.designAssessment) {
      cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.designAssessment).select(data.designAssessment, {
        force: true,
      });
    }
    if (data.operatingEffectivenessAssessment) {
      cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.operatingEffectivenessAssessment)
        .should("not.be.disabled")
        .select(data.operatingEffectivenessAssessment, { force: true });
    }
    if (data.optimalRole) {
      cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.optimalRole)
        .should("be.visible")
        .clear()
        .type(data.optimalRole);
    }
    if (data.comments) {
      cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.comments)
        .should("be.visible")
        .clear()
        .type(data.comments);
    }
    if (data.controlExecution) {
      cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.controlExecution).select(data.controlExecution, {
        force: true,
      });
    }
    if (data.tags) {
      cy.createRandomString(18).then((randomString) => {
        cy.get(
          locators.risk.administration.riskTaxonomies.addLinkControls
            .addControlForm.tags
        )
          .first()
          .scrollIntoView()
          .should("be.visible")
          .clear()
          .type(randomString, { force: true });

        cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.tagSuggest)
          .should("have.length", 1)
          .contains(randomString)
          .click({ force: true });
      });
    }
  }

  static selectParentControlCategory(categoryName){
    cy.get(locators.risk.administration.riskTaxonomies.addLinkControls.addControlForm.parentControlCategory)
    .scrollIntoView()
    .should("exist")
    .contains("span", categoryName)
    .click();
  }

  static fillAddRecommendedControlForm(data, categoryName) {
  
    this.fillMandatoryFields(data);
    this.fillOptionalFields(data);
    if(categoryName){
      this.selectParentControlCategory(categoryName);
    }
  }


  /**
   * Fill CKEditor field with content
   * @param {string} fieldSelector - CKEditor field selector
   * @param {string} content - Content to fill
   */
  static fillCKEditorField(fieldSelector, content) {
    cy.get(fieldSelector).then(($field) => {
      const editorId = $field.attr("id");
      cy.window().then((win) => {
        if (win.CKEDITOR && win.CKEDITOR.instances[editorId]) {
          win.CKEDITOR.instances[editorId].setData(content);
        }
      });
    });
  }

  static verifyDescription(fieldSelector, content, tagElement="p"){
    cy.switchToIframe(fieldSelector).then(($iframe) => {
      // Remove any <Updated> prefix from the expected content if it exists
      cy.get($iframe).find(tagElement,{timeout:10000}).scrollIntoView().should("contain.text", content);
    });
  }

  /**
 * Fill CKEditor with formatted content
 * @param {string} fieldSelector - CKEditor field selector
 * @param {string} formattedContent - Formatted HTML content
 */
static fillCKEditorWithFormatting(fieldSelector, formattedContent) {
  cy.get(fieldSelector).then(($field) => {
    const editorId = $field.attr("id");
    
    // Wait for CKEditor to be initialized
    cy.window().then((win) => {
      cy.wrap(null).should(() => {
        expect(win.CKEDITOR).to.exist;
        expect(win.CKEDITOR.instances[editorId]).to.exist;
      });
    });

    // Check for source mode textarea first
    cy.get(`#cke_${editorId}_contents`, { timeout: 10000 })
      .should("be.visible")
      .then(($contents) => {
        const $sourceTextarea = $contents.find("textarea.cke_source");

        if ($sourceTextarea.length > 0) {
          // Source mode - fill textarea
          cy.wrap($sourceTextarea)
            .should("be.visible")
            .clear()
            .type(formattedContent, { force: true, delay: 0 });
        } else {
          // WYSIWYG mode - use API
          cy.window().then((win) => {
            win.CKEDITOR.instances[editorId].setData(formattedContent);
          });
        }
      });
  });
}

  /**
   * Verify CKEditor content
   * @param {string} fieldSelector - CKEditor field selector
   * @param {string} expectedContent - Expected content
   */
  static verifyCKEditorContent(fieldSelector, expectedContent) {
    cy.get(fieldSelector).then(($field) => {
      const editorId = $field.attr("id");
      cy.window().then((win) => {
        if (win.CKEDITOR && win.CKEDITOR.instances[editorId]) {
          const actualContent = win.CKEDITOR.instances[editorId].getData();
          expect(actualContent).to.contain(expectedContent);
        }
      });
    });
  }
}

export default FormHelper;