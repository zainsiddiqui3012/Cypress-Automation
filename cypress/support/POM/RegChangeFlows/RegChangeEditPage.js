import locatorsData from "../../../fixtures/locators.json";
import testData from "../../../fixtures/RegChangeFlows/RegulatoryChange.json";

const loc = locatorsData.cms.regChange.workflows;
const IFRAME = loc.iframe;

class RegChangeEditPage {
  constructor() {
    this.selectors = {
      iframe: IFRAME,
      editBtn: loc.editMode.editBtn,
      updateBtn: loc.editMode.updateBtn,
      cancelBtn: loc.editMode.cancelBtn,
      summaryField: loc.formFields.summaryField,
      summaryDisplay: loc.formFields.summaryDisplay,
      summaryError: loc.validation.summaryError,
      descriptionField: loc.formFields.descriptionField,
      descriptionDisplay: loc.formFields.descriptionDisplay,
      descTextButton: loc.formFields.descTextButton,
      businessUnitDropdown: loc.formFields.businessUnitDropdown,
      businessUnitInput: loc.formFields.businessUnitInput,
      natureOfChangeDropdown: loc.formFields.natureOfChangeDropdown,
      typeOfChangeDropdown: loc.formFields.typeOfChangeDropdown,
      magnitudeDropdown: loc.formFields.magnitudeDropdown,
      priorityDropdown: loc.formFields.priorityDropdown,
      dropdownOption: loc.formFields.dropdownOption,
      browseBtn: loc.attachments.browseBtn,
      fileInput: loc.attachments.fileInputName,
      attachBtn: loc.attachments.attachBtn,
      errorMessage: loc.validation.errorMessage,
      evaluateImpactError: loc.validation.evaluateImpactError,
      successMessage: loc.validation.successMessage,
      fieldError: loc.validation.fieldError,
      assigneeTypeSingle: loc.editMode.assigneeTypeSingle,
      assigneeTypeGroup: loc.editMode.assigneeTypeGroup,
      assigneeField: loc.formFields.assigneeField,
      assigneeDisplay: loc.formFields.assigneeDisplay,
      groupAssigneeDisplay: loc.formFields.groupAssigneeDisplay,
      groupSelectorBtn: loc.editMode.groupSelectorBtn,
      groupNameInput: loc.editMode.groupNameInput,
      groupFilterBtn: loc.editMode.groupFilterBtn,
      groupListItem: loc.editMode.groupListItem,
      dueDateField: loc.formFields.dueDateField,
      dueDateCalendarBtn: loc.editMode.dueDateCalendarBtn,
      effectiveDateCalendarBtn: loc.formFields.effectiveDateCalendarBtn,
      dueDateDisplay: loc.formFields.dueDateDisplay,
      effectiveDateDisplay: loc.formFields.effectiveDateDisplay,
      datePicker: loc.editMode.datePicker,
      datePickerTitle: loc.editMode.datePickerTitle,
      datePickerMonth: loc.editMode.datePickerMonth,
      datePickerYear: loc.editMode.datePickerYear,
      datePickerCalendar: loc.editMode.datePickerCalendar,
      datePickerDay: loc.editMode.datePickerDay,
      datePickerNext: loc.editMode.datePickerNext,
      datePickerPrev: loc.editMode.datePickerPrev,
      datePickerToday: loc.editMode.datePickerToday,
      subjectAreaDropdown: loc.formFields.subjectAreaDropdown,
      subjectAreaVal: loc.formFields.subjectAreaVal,
      select2Results: loc.formFields.select2Results,
      assignToMeLink: loc.editMode.assignToMeLink,
      fieldValue: (fieldName) =>
        `#${fieldName.toLowerCase().replace(/ /g, "-")}-val`,
    };
  }
  withinRegChangeFrame(callback) {
    cy.frameLoaded(IFRAME);
    cy.iframe(IFRAME).within(callback);
  }
  enterEditMode() {
    cy.cmsWaitForIframe(this.selectors.editBtn, 30000);
    cy.iframe(IFRAME).within(() => {
      cy.get(this.selectors.editBtn).click();
    });
    cy.iframeReady(IFRAME, this.selectors.summaryField, 10000);
  }
  clickUpdate() {
    cy.findInIframe(IFRAME, this.selectors.updateBtn, 10000).click();
  }
  clickCancel() {
    cy.findInIframe(IFRAME, this.selectors.cancelBtn, 10000).click();
  }
  editSummary(newSummary) {
    this.enterEditMode();
    cy.findInIframe(IFRAME, this.selectors.summaryField, 30000)
      .clear()
      .type(newSummary);
    this.clickUpdate();
  }
  verifySummaryText(expectedSummary) {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.summaryDisplay,
      expectedSummary,
      30000,
    );
  }
  testEmptySummaryValidation() {
    this.enterEditMode();
    cy.findInIframe(IFRAME, this.selectors.summaryField, 10000).clear();
    this.clickUpdate();
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.errorMessage,
      testData.errorMessages.summaryRequired,
      10000,
    );
  }
  testSummaryCharacterLimit(length, flag = false) {
    this.enterEditMode();
    cy.createRandomAlphaNumeric(length).then((randomText) => {
      cy.findInIframe(IFRAME, this.selectors.summaryField, 30000)
        .clear()
        .type(randomText);
    });
    this.clickUpdate();
    if (flag === true) {
      cy.iframeContentEquals(
        IFRAME,
        this.selectors.evaluateImpactError,
        testData.errorMessages.summaryTooLongEvaluateImpact,
        30000,
      );
    } else {
      cy.iframeContentEquals(
        IFRAME,
        this.selectors.errorMessage,
        testData.errorMessages.summaryTooLong,
        30000,
      );
    }
  }
  editDescription(newDescription) {
    this.enterEditMode();

    cy.iframeReady(IFRAME, loc.subtaskForm.tinyMceFrame, 15000);

    cy.get(IFRAME).then(($iframe) => {
      const body = $iframe[0].contentDocument.body;
      const $mceIframe = Cypress.$(body).find(loc.subtaskForm.tinyMceFrame);
      const $tinymce = $mceIframe.contents().find("body");
      cy.wrap($tinymce).clear().type(newDescription);
    });

    this.clickUpdate();
  }
  verifySuccessMessage() {
    cy.get(IFRAME, { timeout: 10000 }).should(($iframe) => {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      const $updateBtn = Cypress.$(body).find(this.selectors.updateBtn);
      expect($updateBtn.length, "Update button should not exist").to.equal(0);
    });
  }
  editNatureOfChange(value) {
    this.enterEditMode();

    cy.findInIframe(
      IFRAME,
      this.selectors.natureOfChangeDropdown,
      10000,
    ).click();
    cy.iframeReady(IFRAME, loc.formFields.businessUnitOptionLabel, 10000);
    cy.switchToIframe(IFRAME)
      .find(loc.formFields.businessUnitOptionLabel)
      .contains(value)
      .click();

    this.clickUpdate();
  }
  editTypeOfChange(value) {
    this.enterEditMode();

    cy.findInIframe(IFRAME, this.selectors.typeOfChangeDropdown, 10000).click();
    cy.iframeReady(IFRAME, loc.formFields.businessUnitOptionLabel, 10000);
    cy.switchToIframe(IFRAME)
      .find(loc.formFields.businessUnitOptionLabel)
      .contains(value)
      .click();

    this.clickUpdate();
  }
  editMagnitude(value) {
    this.enterEditMode();

    cy.findInIframe(IFRAME, this.selectors.magnitudeDropdown, 10000).click();
    cy.iframeReady(IFRAME, loc.formFields.businessUnitOptionLabel, 10000);
    cy.switchToIframe(IFRAME)
      .find(loc.formFields.businessUnitOptionLabel)
      .contains(value)
      .click();

    this.clickUpdate();
  }
  clickAssigneeTypeSingle() {
    cy.findInIframe(
      IFRAME,
      this.selectors.assigneeTypeSingle,
      30000,
      true,
    ).click({
      force: true,
    });
  }
  clickAssignToMe() {
    cy.iframe(IFRAME).within(() => {
      cy.get(this.selectors.assignToMeLink, { timeout: 50000 })
        .should("be.visible")
        .click();
    });
  }
  clickInlineAssigneeField() {
    cy.findInIframe(IFRAME, this.selectors.assigneeField, 30000).click();
  }
  clearInlineAssigneeField() {
    cy.findInIframe(IFRAME, this.selectors.assigneeField, 30000).clear();
  }
  enterInlineAssignee(username) {
    cy.findInIframe(IFRAME, this.selectors.assigneeField, 10000)
      .type(username, { delay: 100 })
      .wait(3000)
      .type("{Enter}");
  }
  verifyAssigneeIs(expectedAssignee) {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.assigneeDisplay,
      expectedAssignee,
      100000,
    );
  }
  clickDueDateCalendarButton() {
    cy.iframe(IFRAME).within(() => {
      cy.get(this.selectors.dueDateCalendarBtn).click();
    });
  }
  selectDateFromPicker(day, month, year) {
    cy.get(IFRAME, { timeout: 30000 }).should(($iframe) => {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      const $dp = Cypress.$(body).find(loc.editMode.datePicker);
      expect($dp.length, "Date picker visible").to.be.greaterThan(0);
    });

    cy.switchToIframe(IFRAME)
      .find(loc.editMode.datePicker)
      .then(($datepicker) => {
        const hasYearDropdown =
          $datepicker.find(loc.editMode.datePickerYear).length > 0;

        if (hasYearDropdown) {
          cy.switchToIframe(IFRAME)
            .find(loc.editMode.datePickerYear)
            .select(year);
          cy.switchToIframe(IFRAME)
            .find(loc.editMode.datePickerMonth)
            .select(month);
          cy.switchToIframe(IFRAME)
            .find(loc.editMode.datePickerDay)
            .contains(day)
            .click();
        } else {
          const expectedMonthYear = `${month}, ${year}`;

          const navigateToMonth = (attempts = 0, maxAttempts = 24) => {
            if (attempts >= maxAttempts) {
              throw new Error(
                `Could not find month "${expectedMonthYear}" after ${maxAttempts} attempts`,
              );
            }

            cy.switchToIframe(IFRAME)
              .find(loc.editMode.datePickerTitle)
              .invoke("text")
              .then((currentMonthYear) => {
                if (currentMonthYear.trim() === expectedMonthYear) {
                  cy.switchToIframe(IFRAME)
                    .find(loc.editMode.datePickerCalendar)
                    .contains("td.day", day)
                    .click();
                } else {
                  cy.switchToIframe(IFRAME)
                    .find(loc.editMode.datePickerNext)
                    .contains("›")
                    .click();
                  navigateToMonth(attempts + 1, maxAttempts);
                }
              });
          };

          navigateToMonth();
        }
      });
  }
  verifyDueDateIs(expectedDate) {
    cy.iframeContentEquals(
      IFRAME,
      this.selectors.dueDateDisplay,
      expectedDate,
      10000,
    );
  }
  clickSubjectAreaDropdown() {
    cy.findInIframe(IFRAME, this.selectors.subjectAreaDropdown, 10000).click();
  }
  selectSubjectArea(subjectArea) {
    cy.iframeReady(IFRAME, this.selectors.select2Results, 10000);
    cy.findInIframe(IFRAME, this.selectors.select2Results, 10000)
      .contains(subjectArea)
      .click();
  }
  verifySubjectAreasContain(expectedAreas) {
    expectedAreas.forEach((area) => {
      cy.iframeContentEquals(
        IFRAME,
        this.selectors.subjectAreaVal,
        area,
        10000,
      );
    });
  }
}

export default RegChangeEditPage;
