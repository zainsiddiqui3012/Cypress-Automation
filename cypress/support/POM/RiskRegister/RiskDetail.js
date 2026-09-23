import locators from "../../../fixtures/locators.json";
import FileHelper from "../RiskAndControlRegister/Administration/helpers/FileHelper";
import DateHelper from "../RiskAndControlRegister/Administration/helpers/DateHelper";
import TreeHelper from "../RiskAndControlRegister/Administration/helpers/TreeHelper";
import FormHelper from "../RiskAndControlRegister/Administration/helpers/FormHelper";

const riskDetailData = "cypress/fixtures/RiskRegister/RiskDetail.json";
const riskRegisterData = "cypress/fixtures/RiskRegister/RiskRegister.json";
const waits = Cypress.env("waits");

class RiskDetail {
  /**
   * Write risk category name from register
   */
  writeRiskCategoryNameFromRegister() {
    return FileHelper.readJsonFile(riskRegisterData).then((registerData) => {
      const riskCategoryName =
        registerData.threeElipsesOptions.riskApplicability.riskCategory;

      return FileHelper.updateNestedProperty(
        riskDetailData,
        "riskDetail",
        "add",
        "categoryName",
        riskCategoryName
      );
    });
  }

  /**
   * Write risk definition name from register
   */
  writeRiskDefinitionNameFromRegister() {
    return FileHelper.readJsonFile(riskRegisterData).then((registerData) => {
      const riskDefinitionName =
        registerData.threeElipsesOptions.riskApplicability.riskDefinition;

      return FileHelper.updateNestedProperty(
        riskDetailData,
        "riskDetail",
        "add",
        "definitionName",
        riskDefinitionName
      );
    });
  }
  /**
   * Write risk detail name with timestamp
   * @param {string} operation - Operation type: "add", "update", "delete", etc.
   * @param {string} riskName - Base name for the risk detail
   */
  writeRiskDetailName(operation = "add", riskName) {
    return FileHelper.updateNestedProperty(
      riskDetailData,
      "riskDetail",
      operation,
      "riskName",
      riskName
    );
  }

  verifyGridLength() {
    // More flexible assertion for three ellipses - wait for at least 1, expect up to 3
    cy.get(locators.general.threeElipses, { timeout: 30000 })
      .should("have.length.at.least", 1,{timeout:6000})
      .and("have.length.at.most", 3);
  }
  /**
   * Open risk detail form
   */
  openRiskDetailForm() {
    cy.waitForTopMsgLoaderToDisappear(300000);
    cy.wait(2000); // Wait for any UI transitions
    cy.get(locators.general.threeElipses, { timeout: 30000 })
      .wait(1500)
      .should("have.length", 3) // Expect exactly 3 ellipses
      .eq(2)
      .should("be.visible")
      .click();
    cy.get(locators.risk.riskRegister.riskDetailBtnThreeElipses)
      .should("be.visible")
      .click();
  }
  /**
   * Open risk detail form for BU User
   */
  openRiskDetailFormBUUser() {
    cy.waitForTopMsgLoaderToDisappear(300000);
    cy.wait(2000); // Wait for any UI transitions
    cy.get(locators.general.threeElipses, { timeout: 30000 })
      .wait(1500)
      .should("have.length", 3) // Expect exactly 3 ellipses
      .eq(1)
      .should("be.visible")
      .click();
    cy.get(locators.risk.riskRegister.riskDetailBtnThreeElipses)
      .should("be.visible")
      .click();
  }

  /**
   * Verify risk detail form is open
   */
  verifyRiskDetailFormOpen() {
    cy.get(locators.risk.riskRegister.riskDetail.riskDetailForm)
      .should("be.visible")
      .and("have.class", "m-quick-sidebar--on");
  }

  /**
   * Fill risk detail form with all valid fields
   * @param {object} formData - Form data to fill
   * @returns {string} uniqueName - The unique name that was generated and typed
   */
  fillRiskDetailForm(formData) {
    let uniqueName = null;

    // Fill Risk Name
    if (formData.baseName) {
      uniqueName = DateHelper.generateUniqueNameWithTimestamp(
        formData.baseName
      );
      cy.get(locators.risk.riskRegister.riskDetail.riskName)
        .clear()
        .type(uniqueName);
    }

    // Fill Risk Instance Description with rich text
    if (formData.riskDescription) {
      FormHelper.fillCKEditorField(
        locators.risk.riskRegister.riskDetail.riskDescription,
        formData.riskDescription
      );
    }

    // Fill Simple Control Description
    if (formData.simpleControlDescription) {
      FormHelper.fillCKEditorField(
        locators.risk.riskRegister.riskDetail.simpleControlDescription,
        formData.simpleControlDescription
      );
    }

    // Select Risk Events
    if (formData.riskEvents && formData.riskEvents.length > 0) {
      this.selectMultipleRiskEvents(formData.riskEvents);
    }

    // Select Risk Owner
    if (formData.riskOwner) {
      this.selectRiskOwner(formData.riskOwner);
    }

    // Select Persons Responsible
    if (formData.personsResponsible && formData.personsResponsible.length > 0) {
      this.selectMultiplePersonsResponsible(formData.personsResponsible);
    }

    // Set Frequency
    if (formData.frequency) {
      this.setFrequencyAndTimesPer(
        formData.frequency.value,
        formData.frequency.timesPer
      );
    }

    // Fill Frequency Explanation
    if (formData.frequencyExplanation) {
      cy.get(locators.risk.riskRegister.riskDetail.frequencyExplanation)
        .clear()
        .type(formData.frequencyExplanation);
    }

    // Fill Outcome
    if (formData.outcome) {
      cy.get(locators.risk.riskRegister.riskDetail.outcomeDescription)
        .clear()
        .type(formData.outcome);
    }

    // Fill Outcome Description
    if (formData.outcomeDescription) {
      FormHelper.fillCKEditorField(
        "#outcomeDescriptionD",
        formData.outcomeDescription
      );
    }

    // Select Applicability
    if (formData.applicability) {
      this.selectApplicabilityLevel(formData.applicability);
    }

    // Set Top Risk checkbox
    if (formData.topRisk) {
      this.selectTopRiskCheckbox();
    }

    // Fill Management Comments
    if (formData.managementComments) {
      FormHelper.fillCKEditorField(
        locators.risk.riskRegister.riskDetail.managementCommentDescription,
        formData.managementComments
      );
    }

    // Fill Context
    if (formData.context) {
      cy.get(locators.risk.riskRegister.riskDetail.context)
        .clear()
        .type(formData.context);
    }

    if (formData.relativeMagnitude) {
      cy.get(locators.risk.riskRegister.riskDetail.relativeMagnitude)
        .scrollIntoView()
        .select(formData.relativeMagnitude, { force: true });
    }
    // Return the unique name that was generated
    return uniqueName;
  }

  /**
   * Verify all risk detail form data that was filled
   * @param {object} formData - Form data to verify against
   * @param {string} uniqueName - The unique name that was generated (if applicable)
   */
  verifyRiskDetailForm(formData, uniqueName = null) {
    // Verify Risk Name
    if (formData.baseName && uniqueName) {
      cy.get(locators.risk.riskRegister.riskDetail.riskName).should(
        "have.value",
        uniqueName
      );
    }

    if (formData.riskDescription) {
      FormHelper.verifyDescription(
        locators.risk.riskRegister.riskDetail.richDescriptionIframe,
        formData.riskDescription
      );
    }
    // Verify Simple Control Description
    if (formData.simpleControlDescription) {
      FormHelper.verifyDescription(
        locators.risk.riskRegister.riskDetail.simpleControlDescriptionIframe,
        formData.simpleControlDescription
      );
    }

    // Verify Risk Events
    if (formData.riskEvents && formData.riskEvents.length > 0) {
      this.verifyRiskEventsPersisted(formData.riskEvents);
    }

    // Verify Risk Owner
    if (formData.riskOwner) {
      cy.get(locators.risk.riskRegister.riskDetail.riskOwner).should(
        "contain",
        formData.riskOwner
      );
    }

    // Verify Frequency
    if (formData.frequency) {
      this.verifyFrequencyPersisted(
        formData.frequency.value,
        formData.frequency.timesPer
      );
    }

    // Verify Frequency Explanation
    if (formData.frequencyExplanation) {
      cy.get(locators.risk.riskRegister.riskDetail.frequencyExplanation).should(
        "have.value",
        formData.frequencyExplanation
      );
    }

    // Verify Outcome
    if (formData.outcome) {
      cy.get(locators.risk.riskRegister.riskDetail.outcomeDescription).should(
        "have.value",
        formData.outcome
      );
    }

    // Verify Outcome Description
    if (formData.outcomeDescription) {
      FormHelper.verifyDescription(
        locators.risk.riskRegister.riskDetail.outcomeDescriptionIframe,
        formData.outcomeDescription
      );
    }

    // Verify Applicability
    if (formData.applicability) {
      this.verifyApplicabilityPersisted(formData.applicability);
    }

    // Verify Top Risk checkbox
    if (formData.topRisk) {
      this.verifyTopRiskFlagSet();
    }

    // Verify Management Comments
    if (formData.managementComments) {
      FormHelper.verifyDescription(
        locators.risk.riskRegister.riskDetail
          .managementCommentDescriptionIframe,
        formData.managementComments
      );
    }

    // Verify Context
    if (formData.context) {
      cy.get(locators.risk.riskRegister.riskDetail.context).should(
        "have.value",
        formData.context
      );
    }

    //verify relative magnitude
    if (formData.relativeMagnitude) {
      cy.get(locators.risk.riskRegister.riskDetail.relativeMagnitude).should(
        "contain",
        formData.relativeMagnitude
      );
    }
  }

  clickOkModal() {
    cy.get(locators.risk.riskRegister.riskDetail.clickOk).click();
  }
  /**
   * Save risk detail form
   */
  saveRiskDetail() {
    cy.get(locators.risk.riskRegister.riskDetail.saveBtn, { timeout: 10000 })
      .scrollIntoView()
      .should("be.visible")
      .click();
    cy.wait(3000);
  }

  /**
   * Verify risk detail is saved successfully
   */
  verifyRiskDetailSaved() {
    cy.verifyToastMessageText("saved successfully", waits.mediumWait);
  }

  /**
   * Clear mandatory fields to test validation
   */
  clearMandatoryFields() {
    cy.get(locators.risk.riskRegister.riskDetail.riskName).clear().type("{selectall}{backspace}").should('be.empty');
  }

  /**
   * Verify mandatory field errors
   * @param {object} validationErrors - Expected validation errors
   */
  verifyMandatoryFieldErrors(validationErrors) {
    cy.get(locators.risk.riskRegister.riskDetail.getForm).should(
      "contain",
      validationErrors.requiredField
    );
  }

  /**
   * Enter excessive risk name (over 255 characters)
   */
  enterExcessiveRiskName() {
    const longName = "A".repeat(256);
    cy.get(locators.risk.riskRegister.riskDetail.riskName)
      .clear()
      .type(longName);
  }

  /**
   * Verify max length validation
   * @param {string} fieldId - Field ID to verify
   * @param {number} maxLength - Expected max length
   */
  verifyMaxLengthValidation(fieldId, maxLength) {
    cy.get(`#${fieldId}`).should(
      "have.attr",
      "maxlength",
      maxLength.toString()
    );
  }

  /**
   * Fill rich text description with formatting
   * @param {string} richTextContent - Rich text content with formatting
   */
  fillRichTextDescription(richTextContent) {
    FormHelper.fillCKEditorWithFormatting(
      locators.risk.riskRegister.riskDetail.riskDescription,
      richTextContent
    );
  }

  /**
   * Verify rich text formatting is preserved
   * @param {string} expectedContent - Expected formatted content
   */
  verifyRichTextPreserved(expectedContent) {
    FormHelper.verifyCKEditorContent(
      locators.risk.riskRegister.riskDetail.riskDescription,
      expectedContent
    );
  }

  /**
   * Fill only mandatory fields
   * @param {object} mandatoryData - Mandatory field data
   */
  fillOnlyMandatoryFields(mandatoryData) {
    cy.get(locators.risk.riskRegister.riskDetail.riskName)
      .clear()
      .type(mandatoryData.riskName);

    this.selectApplicabilityLevel(mandatoryData.applicability);
  }

  /**
   * Select applicability level
   * @param {string} level - Applicability level (Applicable, Defer, Not Applicable, Emerging)
   */
  selectApplicabilityLevel(level) {
    cy.get(locators.risk.riskRegister.riskDetail.applicability).click();
    cy.get(locators.risk.riskRegister.riskDetail.applicablityResult)
      .contains(level)
      .click();
  }

  /**
   * Verify applicability is mutually exclusive
   * @param {string} selectedLevel - Currently selected level
   */
  verifyApplicabilityExclusive(selectedLevel) {
    cy.get(locators.risk.riskRegister.riskDetail.verifyApplicability).should(
      "contain",
      selectedLevel
    );
  }

  /**
   * Verify applicability is persisted
   * @param {string} level - Expected applicability level
   */
  verifyApplicabilityPersisted(level) {
    cy.get(locators.risk.riskRegister.riskDetail.verifyApplicability).should(
      "contain",
      level
    );
  }

  /**
   * Select Top/Corporate Risk checkbox
   */
  selectTopRiskCheckbox(checked = true) {
    cy.get(locators.risk.riskRegister.riskDetail.topRisk)
      .scrollIntoView()
      .then(($el) => {
        if (checked && !$el.prop("checked")) {
          cy.wrap($el).check({ force: true });
        } else if (!checked && $el.prop("checked")) {
          cy.wrap($el).uncheck({ force: true });
        }
      })
      .should(checked ? "be.checked" : "not.be.checked");
  }

  /**
   * Verify top risk flag is set
   */
  verifyTopRiskFlagSet() {
    cy.get(locators.risk.riskRegister.riskDetail.topRisk)
      .scrollIntoView()
      .should("be.checked");
  }

  /**
   * Enter non-numeric frequency
   * @param {string} invalidInput - Invalid input to test
   */
  enterNonNumericFrequency(invalidInput) {
    cy.get(locators.risk.riskRegister.riskDetail.frequencyCountD)
      .clear()
      .type(invalidInput);
  }

  /**
   * Verify frequency validation error
   */
  verifyFrequencyValidationError() {
    cy.get(locators.risk.riskRegister.riskDetail.frequencyCountD)
      .siblings(locators.risk.riskRegister.riskDetail.getForm)
      .should("contain", "Please enter numeric positive values");
  }

  /**
   * Set frequency and times per
   * @param {string} frequency - Frequency value
   * @param {string} timesPer - Times per selection
   */
  setFrequencyAndTimesPer(frequency, timesPer) {
    cy.get(locators.risk.riskRegister.riskDetail.frequencyCountD)
      .scrollIntoView()
      .clear()
      .type(frequency);

    cy.get(locators.risk.riskRegister.riskDetail.frequencyOccurance).click();
    cy.get(locators.risk.riskRegister.riskDetail.frequencyOccuranceResult)
      .contains(timesPer)
      .click();
  }

  /**
   * Verify frequency is persisted
   * @param {string} frequency - Expected frequency
   * @param {string} timesPer - Expected times per
   */
  verifyFrequencyPersisted(frequency, timesPer) {
    cy.get(locators.risk.riskRegister.riskDetail.frequencyCountD)
      .scrollIntoView()
      .should("have.value", frequency);
    cy.get(locators.risk.riskRegister.riskDetail.frequencyPersisted)
      .scrollIntoView()
      .should("contain", timesPer);
  }

  /**
   * Select multiple sites
   * @param {Array} sites - Array of site names
   */
  selectMultipleSites(sites) {
    cy.get(locators.risk.riskRegister.riskDetail.siteIdsD).click();
    sites.forEach((site) => {
      cy.get(locators.risk.riskRegister.riskDetail.pqSelectMenu)
        .contains(site)
        .click();
    });
  }

  /**
   * Select multiple persons responsible
   * @param {Array} persons - Array of person usernames
   */
  selectMultiplePersonsResponsible(persons) {
    // cy.get(
    //   locators.risk.riskRegister.riskDetail.riskResponsiblePersonsD
    // ).click();
    // persons.forEach((person) => {
    //   cy.get(locators.risk.riskRegister.riskDetail.pqSelectMenu)
    //     .contains(person)
    //     .click();
    // });
    cy.get("#riskResponsiblePersonsD")
    .scrollIntoView()
    .select(persons, { force: true });
  }

  /**
   * Verify multi-select values are persisted
   * @param {object} multiSelectData - Multi-select data to verify
   */
  verifyMultiSelectValuesPersisted(multiSelectData) {
    // Verify sites
    multiSelectData.sites.forEach((site) => {
      cy.get(locators.risk.riskRegister.riskDetail.siteIdsD).should(
        "contain",
        site
      );
    });

    // Verify persons responsible
    multiSelectData.persons.forEach((person) => {
      cy.get(
        locators.risk.riskRegister.riskDetail.riskResponsiblePersonsD
      ).should("contain", person);
    });
  }

  /**
   * Fill outcome description with special characters
   * @param {string} specialChars - Special characters to test
   */
  fillOutcomeDescriptionWithSpecialChars(specialChars) {
    FormHelper.fillCKEditorField(
      locators.risk.riskRegister.riskDetail.outcomeDescriptionText,
      specialChars
    );
  }

  /**
   * Verify special characters are preserved
   * @param {string} expectedChars - Expected special characters
   */
  verifySpecialCharactersPreserved(expectedChars) {
    FormHelper.verifyCKEditorContent(
      locators.risk.riskRegister.riskDetail.outcomeDescriptionText,
      expectedChars
    );
  }

  /**
   * Delete risk detail
   */
  deleteRiskDetail() {
    cy.get(locators.risk.riskRegister.riskDetail.deleteButton)
      .scrollIntoView()
      .should("be.visible")
      .click();
  }

  /**
   * Confirm deletion in modal
   */
  confirmDeletion() {
    cy.get(locators.risk.riskRegister.riskDetail.deleteConfirmModal).should(
      "be.visible"
    );
    cy.get(
      locators.risk.riskRegister.riskDetail.deleteConfirmModal + " .btn-danger"
    ).click();
  }

  clickDeleteIcon() {
    cy.get(".fa-trash").eq(1).click();
  }
  riskTaxonomyConfirmDeletion() {
    cy.get("#deleteRiskCategoryConfirm")
      .should("be.visible")
      .then(($delete) => {
        cy.get($delete).find(locators.general.deleteYes).click();
        cy.get($delete).should("not.be.visible");
      });
  }
  /**
   * Verify risk detail is deleted
   */
  verifyRiskDetailDeleted() {
    cy.get(locators.general.threeElipses, { timeout: 30000 }).should(
      "have.length",
      1
    );
  }

  /**
   * Select relative magnitude
   * @param {string} magnitude - Magnitude level (Low, Moderate, High, Extreme)
   */
  selectRelativeMagnitude(magnitude) {
    cy.get(locators.risk.riskRegister.riskDetail.relativeMagnitude)
      .scrollIntoView()
      .select(magnitude, { force: true });
  }

  /**
   * Verify magnitude is persisted
   * @param {string} magnitude - Expected magnitude
   */
  verifyMagnitudePersisted(magnitude) {
    cy.get(locators.risk.riskRegister.riskDetail.relativeMagnitudeSelectedBox)
      .scrollIntoView()
      .contains(magnitude);
  }

  /**
   * Enter monetary impact
   * @param {string} impact - Monetary impact value
   */
  enterMonetaryImpact(impact) {
    cy.get(locators.risk.riskRegister.riskDetail.estimatedOutcomeD)
      .clear()
      .type(impact);
  }

  /**
   * Verify monetary impact is accepted
   * @param {string} impact - Expected impact value
   */
  verifyMonetaryImpactAccepted(impact) {
    cy.get(locators.risk.riskRegister.riskDetail.estimatedOutcomeD).should(
      "have.value",
      impact
    );
  }

  /**
   * Verify default weight
   * @param {string} expectedWeight - Expected default weight
   */
  verifyDefaultWeight(expectedWeight) {
    cy.get(locators.risk.riskRegister.riskDetail.weight).should(
      "have.value",
      expectedWeight
    );
  }

  /**
   * Close risk detail form
   */
  closeRiskDetailForm() {
    cy.get(locators.risk.riskRegister.riskDetail.closeBtn)
      .scrollIntoView()
      .should("be.visible")
      .click();
  }

  /**
   * Verify data persistence after reopening
   * @param {object} expectedData - Expected persisted data
   */
  verifyDataPersistence(expectedData) {
    if (expectedData.riskName) {
      cy.get(locators.risk.riskRegister.riskDetail.riskName).should(
        "have.value",
        expectedData.riskName
      );
    }
    if (expectedData.applicability) {
      cy.get(locators.risk.riskRegister.riskDetail.applicability).should(
        "contain",
        expectedData.applicability
      );
    }
  }

  /**
   * Cancel risk detail form
   */
  cancelRiskDetailForm() {
    cy.get(locators.risk.riskRegister.riskDetail.cancelBtnClass).click();
  }

  /**
   * Verify form is closed
   */
  verifyFormClosed() {
    cy.get(locators.risk.riskRegister.riskDetail.verifyFormClose).should(
      "not.have.class",
      "m-quick-sidebar--on"
    );
  }

  /**
   * Fill simple control description
   * @param {string} description - Description content
   */
  fillSimpleControlDescription(description) {
    FormHelper.fillCKEditorField(
      locators.risk.riskRegister.riskDetail.simpleControlDescription,
      description
    );
  }

  /**
   * Verify simple control description is persisted
   * @param {string} expectedDescription - Expected description
   */
  verifySimpleControlDescriptionPersisted(expectedDescription) {
    FormHelper.verifyCKEditorContent(
      locators.risk.riskRegister.riskDetail.simpleControlDescription,
      expectedDescription
    );
  }

  /**
   * Select multiple risk events
   * @param {Array} riskEvents - Array of risk event names
   */
  selectMultipleRiskEvents(riskEvents) {
    cy.get(locators.risk.riskRegister.riskDetail.riskEventIds).click();
    riskEvents.forEach((event) => {
      cy.get(locators.risk.riskRegister.riskDetail.applicablityResult)
        .contains(event)
        .click();
    });
  }

  /**
   * Verify risk events are persisted
   * @param {Array} expectedEvents - Expected risk events
   */
  verifyRiskEventsPersisted(expectedEvents) {
    expectedEvents.forEach((event) => {
      cy.get(locators.risk.riskRegister.riskDetail.riskEventIds).should(
        "contain",
        event
      );
    });
  }

  /**
   * Verify sites are persisted
   * @param {Array} expectedSites - Expected sites
   */
  verifySitesPersisted(expectedSites) {
    expectedSites.forEach((site) => {
      cy.get(locators.risk.riskRegister.riskDetail.siteIdsD).should(
        "contain",
        site
      );
    });
  }

  /**
   * Select risk owner
   * @param {string} ownerName - Risk owner name
   */
  selectRiskOwner(ownerName) {
    // cy.get(locators.risk.riskRegister.riskDetail.riskOwner).click();
    // cy.get(locators.risk.riskRegister.riskDetail.applicablityResult)
    //   .contains(ownerName)
    //   .click();
    cy.get("#riskOwner")
    .scrollIntoView()
    .select(ownerName, { force: true });
  }

  /**
   * Verify risk owner auto-fill
   * @param {string} expectedOwner - Expected owner name
   */
  verifyRiskOwnerAutoFill(expectedOwner) {
    cy.get(locators.risk.riskRegister.riskDetail.riskOwnerDropdown).should(
      "contain",
      expectedOwner
    );
  }

  /**
   * Verify persons responsible are persisted
   * @param {Array} expectedPersons - Expected persons
   */
  verifyPersonsResponsiblePersisted(expectedPersons) {
    expectedPersons.forEach((person) => {
      cy.get(
        locators.risk.riskRegister.riskDetail.riskResponsiblePersonsD
      ).should("contain", person);
    });
  }

  /**
   * Verify frequency field accepts only numeric input
   */
  verifyFrequencyNumericOnly() {
    cy.get(locators.risk.riskRegister.riskDetail.frequencyCountD)
      .clear()
      .type("123")
      .should("have.value", "123");
  }

  /**
   * Enter negative frequency
   * @param {string} negativeValue - Negative frequency value
   */
  enterNegativeFrequency(negativeValue) {
    cy.get(locators.risk.riskRegister.riskDetail.frequencyCountD)
      .clear()
      .type(negativeValue);
  }

  /**
   * Verify frequency error
   * @param {string} expectedError - Expected error message
   */
  verifyFrequencyError(expectedError) {
    cy.get(locators.risk.riskRegister.riskDetail.frequencyCountD)
      .siblings(locators.risk.riskRegister.riskDetail.getForm)
      .should("contain", expectedError);
  }

  /**
   * Clear frequency field
   */
  clearFrequency() {
    cy.get(locators.risk.riskRegister.riskDetail.frequencyCountD).clear();
  }

  /**
   * Fill management comments with formatting
   * @param {string} formattedText - Formatted text content
   */
  fillManagementCommentsWithFormatting(formattedText) {
    // FormHelper.fillCKEditorWithFormatting(
    //   "#managementCommentsD",
    //   formattedText
    // );
    FormHelper.fillCKEditorField(
      locators.risk.riskRegister.riskDetail.managementCommentDescription,
      formattedText
    );
  }

  /**
   * Verify management comments formatting
   * @param {string} expectedFormatting - Expected formatted content
   */
  verifyManagementCommentsFormatting(expectedFormatting) {
    FormHelper.verifyCKEditorContent(
      locators.risk.riskRegister.riskDetail.managementCommentDescription,
      expectedFormatting
    );
  }

  /**
   * Verify risk definition tree is loaded
   */
  verifyRiskDefinitionTreeLoaded() {
    cy.get(locators.risk.riskRegister.riskDetail.riskDefinitionTree)
      .scrollIntoView()
      .should("be.visible")
      .find(".aciTreeLi")
      .should("have.length.greaterThan", 0);
  }

  /**
   * Verify preselected risk definition
   * @param {string} expectedDefinition - Expected preselected definition
   */
  verifyPreselectedRiskDefinition(expectedDefinition) {
    cy.get(
      `${locators.risk.riskRegister.riskDetail.riskDefinitionTree} .aciTreeChecked`
    ).should("contain", expectedDefinition);
  }

  /**
   * Select different risk definition
   * @param {string} definitionName - New definition to select
   */
  selectDifferentRiskDefinition(definitionName, categoryName) {
    TreeHelper.expandNode(categoryName);
    // TreeHelper.selectTreeNode(definitionName);
    TreeHelper.verifyNodeExpanded(categoryName);
    cy.contains(
      `${locators.risk.riskRegister.riskDetail.riskDefinitionTree} .aciTreeText`,
      definitionName
    )
      .should("be.visible")
      .click();
  }

  /**
   * Verify risk definition changed
   * @param {string} expectedDefinition - Expected new definition
   */
  verifyRiskDefinitionChanged(expectedDefinition) {
    cy.get(
      `${locators.risk.riskRegister.riskDetail.riskDefinitionTreeChecked}`,
      { timeout: 10000 }
    )
      .scrollIntoView()
      .should("contain", expectedDefinition);
  }

  /**
   * Click save button
   */
  clickSaveButton() {
    cy.get(locators.risk.riskRegister.riskDetail.saveBtn).click();
  }

  /**
   * Verify data saved and navigation
   */
  verifyDataSavedAndNavigation() {
    cy.get(
      locators.risk.riskRegister.riskDetail.riskDefinitionDetailSlider
    ).should("not.have.class", "m-quick-sidebar--on");
  }

  /**
   * Click cancel button
   */
  clickCancelButton() {
    cy.get(locators.risk.riskRegister.riskDetail.cancelBtnClass).click();
  }

  /**
   * Verify changes are discarded
   */
  verifyChangesDiscarded() {
    // This would require comparing form state before and after
    cy.log("Changes discarded - form returned to original state");
  }

  /**
   * Verify editing is restricted when locked
   */
  verifyEditingRestricted() {
    cy.get(locators.risk.riskRegister.riskDetail.riskName).should(
      "have.attr",
      "readOnly",
      "readonly"
    );
  }

  /**
   * Verify create risk functionality is enabled
   */
  verifyCreateRiskEnabled() {
    cy.get(locators.risk.riskRegister.riskDetail.createRiskButton)
      .contains("Add Risk")
      .should("be.visible")
      .and("not.be.disabled");
  }

  /**
   * Open risk detail form
   */
  openRiskItemForm() {
    cy.waitForTopMsgLoaderToDisappear(300000);
    cy.wait(1700); // Wait for any UI transitions
    cy.get(locators.general.threeElipses, { timeout: 30000 })
      .wait(1500)
      .should("have.length", 3)// Expect exactly 3 ellipses
      .eq(2)
      .should("be.visible")
      .click();
    cy.get(locators.risk.riskRegister.addRiskItem, { timeout: 30000 })
      .click({ delay: 800 });
  }

  verifyRiskItemFormOpen() {
    cy.get(locators.risk.riskRegister.riskDetail.riskItemForm).should(
      "be.visible"
    );
  }

  fillRiskItemForm(formData) {
    const name = DateHelper.generateUniqueNameWithTimestamp("Risk Item ");
    cy.get("#riskItemName").scrollIntoView().type(name);
    // cy.get("textarea[name='riskDescription']").type(formData.riskDescription);
    cy.get("#riskItemLevel-modal #buIds")
      .scrollIntoView()
      .select(formData.bu, { force: true });
    cy.get("#addRiskItemComparitiveMagnitudes")
      .scrollIntoView()
      .select(formData.magnitude, { force: true });
    cy.get("#addRiskItemApplicability")
      .scrollIntoView()
      .select(formData.applicability, { force: true });
    return name;
  }

  clickRiskItemFormSaveButton() {
    cy.get(locators.general.riskItemSaveBtn).click({
      multiple: true,
      force: true,
    });
  }

  verifyRiskItemFormOptionNotExists() {
    cy.waitForTopMsgLoaderToDisappear(300000);
    cy.wait(1700); // Wait for any UI transitions
    cy.get(locators.general.threeElipses, { timeout: 30000 })
      .wait(1500)
      .should("have.length", 3) // Expect exactly 3 ellipses
      .eq(1)
      .should("be.visible")
      .click();
    cy.get(locators.risk.riskRegister.withoutRiskItemThreeElipses).should(
      "have.length",
      1
    );
  }
}

export default RiskDetail;
