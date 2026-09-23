import locators from "../../../../fixtures/locators.json";
import IssueUtility from "./IssueUtility";
import issueManagementSetupData from "../../../../fixtures/IssueManagementDecisions/Decisions/IssueManagementSetupData.json";
import createIssueSetupData from "../../../../fixtures/IssueManagementDecisions/Decisions/CreateIssueSetupData.json"
import { value } from "jsonpath";
const path = require("path");
const fs = require("fs");
const issueUtility = new IssueUtility();
export default class CreateIssue {


    /**
     * Enters text into the Summary field.
     */
    enterDataInSummaryField(value) {

        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdSummryTextbox, value);
    }
    /**
     * Enters text into the "Description" field.
     * @param {string} text - The description to be entered.
     */
    enterDataInDescription(text) {
        issueUtility.typeInIframeEditor(locators.issueManagement.issueDashboard.createIssue.dataCompIdDescriptionBox, text);
    }
    
    /**
     * Selects a Severity value from the dropdown.
     */
    selectSeverity(severityName) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.datCompIdSeverityField, severityName)
    }
    /**
     * Enters data in the Summary field and selects the Severity value.
     *
     * @param {string} summaryValue - The value to be entered in the Summary field.
     * @param {string} severityName - The severity level to be selected.
     */
    enterDataInSummaryAndSeverity(summaryValue, severityName) {
        this.enterDataInSummaryField(summaryValue);
        this.selectSeverity(severityName);
    }
    /**
    * Selects an Issue Source from the dropdown.
    */
    selectIssueSource(issueSourceName) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.datCompIdIssueSourceField, issueSourceName)
    }
    /**
 * Selects a value from a dropdown by navigating using the down arrow key and pressing Enter.
 *
 * @param {string} locator - The data component ID locator of the dropdown.
 */
    selectTheValueFromEnterButton(locator) {
        issueUtility.getByDataComponentId(locator)
            .find("input")
            .type('{downarrow}{enter}');
    }
    /**
 * Selects and verifies the severity field by typing the given value and checking suggestions.
 *
 * @param {string} severityName - The severity name to be entered.
 * @param {boolean} isVerifySuggestion - Whether to verify the suggested values.
 */
    selecAndVerifySeverity(severityName, isVerifySuggestion) {
        issueUtility.typeInputAndVerifySuggestion(locators.issueManagement.issueDashboard.createIssue.datCompIdSeverityField, severityName, isVerifySuggestion);
    }

    /**
 * Selects and verifies the issue source field by typing the given value and checking suggestions.
 *
 * @param {string} issueSourceName - The issue source name to be entered.
 * @param {boolean} isVerifySuggestion - Whether to verify the suggested values.
 */
    selectAndVerifyIssueSource(issueSourceName, isVerifySuggestion) {
        issueUtility.typeInputAndVerifySuggestion(locators.issueManagement.issueDashboard.createIssue.datCompIdIssueSourceField, issueSourceName, isVerifySuggestion)
    }

    /**
 * Selects and verifies the issue type field by typing the given value and checking suggestions.
 *
 * @param {string} issueTypeName - The issue type name to be entered.
 * @param {boolean} isVerifySuggestion - Whether to verify the suggested values.
 */
    selectAndVerifyIssueType(issueTypeName, isVerifySuggestion) {
        issueUtility.typeInputAndVerifySuggestion(locators.issueManagement.issueDashboard.createIssue.dataCompIdTypeOfIssue, issueTypeName, isVerifySuggestion)
    }

    /**
 * Selects and verifies the business area field by typing the given value and checking suggestions.
 *
 * @param {string} BusinessAreaName - The business area name to be entered.
 * @param {boolean} isVerifySuggestion - Whether to verify the suggested values.
 */
    selectAndVerifyBusinessArea(BusinessAreaName, isVerifySuggestion) {
        issueUtility.typeInputAndVerifySuggestion(locators.issueManagement.issueDashboard.createIssue.dataCompIdBusinessArea, BusinessAreaName, isVerifySuggestion)
    }

    /**
 * Verifies that certain fields are **not present** when the severity is **simple**.
 *
 * @param {string} keyDates - The tab name for "Key Dates".
 * @param {string} details - The tab name for "Details".
 */
    fieldNotPresenceOfSimpleSeverity(keyDates, details) {
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdBusinessArea, false)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdApprover, false)
        this.clicksOnTab(keyDates)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdDueDate, false)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdEventOccurance, false)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.labelDataCompIdContainmentDate, false, "label")
        this.clicksOnTab(details)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdRootCause, false)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.labelDataCompIdRootCauseDescription, false, "label")
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdPotentialLoss, false)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdActualLoss, false)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdImpactedControls, false)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdNumberOfCustomersImpacted, false)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdHowCustomersImpacted, false)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdRootCause, false)
    }

    /**
 * Verifies that certain fields are **present** when the severity is **extended**.
 *
 * @param {string} keyDates - The tab name for "Key Dates".
 * @param {string} details - The tab name for "Details".
 */
    fieldPresenceOfExtendedSeverity(keyDates, details) {
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdBusinessArea, true)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdApprover, true)
        this.clicksOnTab(keyDates)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdDueDate, true)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdEventOccurance, true)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.labelDataCompIdContainmentDate, true, "label")
        this.clicksOnTab(details)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdRootCause, true)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.labelDataCompIdRootCauseDescription, true, "label")
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdPotentialLoss, true)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdActualLoss, true)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdImpactedControls, true)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdNumberOfCustomersImpacted, true)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdHowCustomersImpacted, true)
        issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdRootCause, true)
    }

    /**
 * Verifies whether the "Owner" field is displayed as a dropdown or a text box based on the provided field type.
 *
 * @param {string} fieldType - The expected field type, either "dropdown" or "textbox".
 */
    verifyOwnerFieldAsTextBoxOrDropDown(fieldType) {
        if (fieldType == "dropdown") {
            issueUtility.verifyFieldType(locators.issueManagement.issueDashboard.createIssue.dataCompIdOwnerDropdown, fieldType)
        }
        else {
            issueUtility.verifyFieldType(locators.issueManagement.issueDashboard.createIssue.dataCompIdOwner, fieldType);
        }
    }

    /**
     * Selects a Regulator or Agency from the dropdown.
     */
    selectRegulatorAgency(regulatorName, isPositive = true) {

        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdRegulatorOrAgency, regulatorName)
        //wait for data to visible in the dropdown
        cy.wait(500);
        this.selectTheValueFromEnterButton(locators.issueManagement.issueDashboard.createIssue.dataCompIdRegulatorOrAgency)
        issueUtility.verifyMultiSelectDropdown(locators.issueManagement.issueDashboard.createIssue.dataCompIdRegulatorOrAgency, regulatorName, isPositive)
    }

    /**
 * Selects multiple regulatory agencies by typing the name, selecting from the dropdown,
 * and verifying the selected values.
 *
 * @param {string} regulatorName - The name of the regulatory agency to select.
 * @param {string} prefix - The prefix used to filter additional agencies in the dropdown.
 * @param {number} count - The expected number of selected regulatory agencies.
 */
    selectMultipleRegulatoryAgency(regulatorName, prefix, count) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdRegulatorOrAgency, regulatorName)
        //wait for data to visible in the dropdown
        cy.wait(500);
        this.selectTheValueFromEnterButton(locators.issueManagement.issueDashboard.createIssue.dataCompIdRegulatorOrAgency)
        issueUtility.verifyMultiSelectDropdown(locators.issueManagement.issueDashboard.createIssue.dataCompIdRegulatorOrAgency, regulatorName)
        issueUtility.getByDataComponentId(locators.issueManagement.issueDashboard.createIssue.dataCompIdRegulatorOrAgency)
            .find("input").type(prefix);
        this.selectTheValueFromEnterButton(locators.issueManagement.issueDashboard.createIssue.dataCompIdRegulatorOrAgency)
        issueUtility.verifyMultiSelectItemCount(locators.issueManagement.issueDashboard.createIssue.dataCompIdRegulatorOrAgency, count);
    }

    /**
 * Selects an Issue Type from the dropdown.
 */
    selectIssueType(issueType) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdTypeOfIssue, issueType)
    }
    /**
         * Enters text into the Associated Project/Exam/Audit field.
         */
    enterAssociateProjectExamAudit(associatedProject) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdAssociatedProjectAudit, associatedProject)
    }
    /**
         * Selects a Responsible Department from the dropdown.
         */
    selectResponsibleDepartment(responsibleDepartment) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdResponsibleDepartment, responsibleDepartment);
    }

    /**
     * Selects a Business Area from the dropdown.
     */
    selectBusinessArea(businessArea) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdBusinessArea, businessArea);
    }
    /**
     * Selects a Submitter Name from the dropdown.
     */
    selectSubmitterName(submitterName) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdSubmitterName, submitterName);
    }
    /**
     * selectsAssigneeType selects the assignee type based on the provided parameters.
     * If the assignee type is "Single", it inputs the assignee name into the appropriate field.
     * Otherwise, it assumes a group assignment and performs a radio button click followed by entering the group assignee name.
     *
     * @param {string} assigneeType - The type of assignee ("Single" or another value like "Group").
     * @param {string} assigneeName - The assignee's name.
     * @param {boolean} [isAssignMe=false] - If true, uses the "Assign to Me" field (no manual name input is required).
     */
    selectsAssigneeType(assigneeType, assigneeName, isAssignMe = false) {
        if (assigneeType === "Single") {
            this.selectAssigneeName(assigneeName, isAssignMe)
        }
        // For group assignment, click the appropriate radio button and then input the group assignee name.
        else {
            issueUtility.radioButton(locators.issueManagement.issueDashboard.createIssue.dataCompIdAssigneeType, assigneeType)
            issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdGroupAssignee, assigneeName)
        }
    }
    /**
     * Verifies the presence of "Assignee" and "Group Assignee" fields based on the assignment type.
     *
     * @param {string} assignType - The type of assignment ("Single" or any other value).
     *                              - If "Single", verifies that the "Assignee" field is present and "Group Assignee" is absent.
     *                              - Otherwise, verifies that the "Assignee" field is absent and "Group Assignee" is present.
     */
    verifyAssignTypeAndAssignGroup(assignType) {
        if (assignType === "Single") {
            issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdAssignee, true)
            issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdGroupAssignee, false)
        }
        else {
            issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdAssignee, false)
            issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.dataCompIdGroupAssignee, true)
        }
    }

    /**
 * selectAssigneeName will input the assignee name into the appropriate field.
 * If isAssignMe is true, it uses the "Assign to Me" field which auto-populates
 * with the current user's name, so no additional name is input.
 *
 * @param {string} assigneeName - The name to be input if not assigning to self.
 * @param {boolean} [isAssignMe=false] - If true, uses the "Assign to Me" option.
 */
    selectAssigneeName(assigneeName, isAssignMe = false) {
        // Determine which locator to use based on the flag
        const locator = isAssignMe
            ? locators.issueManagement.issueDashboard.createIssue.dataCompIdAssignToMe
            : locators.issueManagement.issueDashboard.createIssue.dataCompIdAssignee;

        if (isAssignMe) {
            // When assigning to self, no need to input a name
            issueUtility.clickInputElement(locator);
        } else {
            // Otherwise, input the provided assignee name
            issueUtility.typeInInput(locator, assigneeName);
        }
    }
    /**
     * Validates that the "Assignee" field displays the correct error message when it is not specified.
     */
    assigneeValidation() {
        issueUtility.verifyLabelText(locators.issueManagement.issueDashboard.createIssue.validationDataCompIdAssignee, "'Assignee' must be specified.");
    }
    /**
     * Selects a Reporter from the dropdown.
     */
    selectReporter(reporter) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdReporter, reporter);
    }
    /**
     * Selects an Approver from the dropdown.
     */
    selectApprover(approver) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdApprover, approver);
    }
    /**
     * Selects a Subject Area from the dropdown.
     */
    selectSubjectArea(subjectArea, isPositive = true) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdSubjectArea, subjectArea)
        //wait for data to visible in the dropdown
        cy.wait(500);
        this.selectTheValueFromEnterButton(locators.issueManagement.issueDashboard.createIssue.dataCompIdSubjectArea)
        issueUtility.verifyMultiSelectDropdown(locators.issueManagement.issueDashboard.createIssue.dataCompIdSubjectArea, subjectArea, isPositive)
    }

    /**
 * Selects and verifies the responsible department by typing into the input field
 * and checking for suggestions.
 *
 * @param {string} responsibleDepartment - The name of the responsible department to select.
 * @param {boolean} isVerifySuggestion - Whether to verify the suggestion list appears.
 */
    selectAndVerifyResponsibleDepartment(responsibleDepartment, isVerifySuggestion) {
        issueUtility.typeInputAndVerifySuggestion(locators.issueManagement.issueDashboard.createIssue.dataCompIdResponsibleDepartment, responsibleDepartment, isVerifySuggestion)
    }

    /**
 * Selects multiple values in the "Subject Area" multi-select dropdown by typing the values and confirming them.
 *
 * @param {string} subjectArea - The first subject area value to be selected.
 * @param {string} prefix - The prefix for the second subject area value.
 * @param {number} count - The expected count of selected subject area values.
 */
    selectMultipleSubjectArea(subjectArea, prefix, count) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdSubjectArea, subjectArea)
        //wait for data to visible in the dropdown
        cy.wait(500);
        this.selectTheValueFromEnterButton(locators.issueManagement.issueDashboard.createIssue.dataCompIdSubjectArea)
        issueUtility.verifyMultiSelectDropdown(locators.issueManagement.issueDashboard.createIssue.dataCompIdSubjectArea, subjectArea)
        issueUtility.getByDataComponentId(locators.issueManagement.issueDashboard.createIssue.dataCompIdSubjectArea)
            .find("input").type(prefix);
        this.selectTheValueFromEnterButton(locators.issueManagement.issueDashboard.createIssue.dataCompIdSubjectArea)
        issueUtility.verifyMultiSelectItemCount(locators.issueManagement.issueDashboard.createIssue.dataCompIdSubjectArea, count);

    }
    /**
     * Enters an email in the Notify field.
     */
    enterDataInNotifyField(notifyEmail) {
        issueUtility.scrollToElement(locators.issueManagement.issueDashboard.createIssue.dataCompIdNotify);
        issueUtility.typeInTextArea(locators.issueManagement.issueDashboard.createIssue.dataCompIdNotify, notifyEmail)
    }
    /**
    * Enters a date in the "Identification Date" field.
    * @param {string} dateType - Type of date (e.g., 'current', 'past', 'future').
    * @param {number} days - Number of days to add/subtract from the current date.
    */
    enterDateInIdentificationDate(dateType, days) {
        const date = issueUtility.generateDate(dateType, days);
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdIdentificationDate, date);
    }
    /**
   * Enters data in the "Owner" field (Select2 Issue Process Owner dropdown).
   * @param {string} ownerName - Name or value of the owner to be selected. Must match the <option> value or visible text exactly.
   *
   * Note: Pass the full visible text (e.g., 'automation user1 (auto@mation)') or the value attribute (e.g., '50544').
   * Logs all available options for debugging.
   */
    enterDataInOwnerField(ownerName) {
      issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdOwner, ownerName);
    }
    /**
     * Clicks the "Create" button to submit the issue form.
     */
    clicksOnCreateButton() {
        return issueUtility.clicksAndReturnBySectionId(locators.issueManagement.issueDashboard.createIssue.dataCompIdCreateButton);
        // issueUtility.clickButtonBySectionId(locators.issueManagement.issueDashboard.createIssue.dataCompIdCreateButton)
    }
    /**
         * Clicks the "Cancel" button to cancel the issue form.
         */
    clicksOnCancelButton() {
        issueUtility.clickButtonBySectionId(locators.issueManagement.issueDashboard.createIssue.dataCompIdCancelButton)
    }

    /**
 * Validates the error messages displayed in the tooltip when the "Create Issue" button is clicked without required fields.
 *
 * @param {string[]} errorMessageArray - An array of expected error messages.
 * @param {number} length - The expected number of error messages.
 */
    createButtonValidationError(errorMessageArray, length) {
        //  Wait for iframe to load fully
        cy.get("#decisionsFrame", { timeout: 10000 }).should("be.visible");

        // Ensure iframe body is ready before interacting
        cy.get("#decisionsFrame").then($iframe => {
            const body = $iframe.contents().find("body");
            cy.wrap(body).should("be.visible");

            //Hover over the button first
            cy.wrap(body)
                .find(`[data-component-id='${locators.issueManagement.issueDashboard.createIssue.dataCompIdCreateButton}'] button`)
                .trigger("mouseover");

            // Click the button
            issueUtility.clickButtonBySectionId(locators.issueManagement.issueDashboard.createIssue.dataCompIdCreateButton);
            cy.wait(500);
            // Move the mouse away
            cy.wrap(body).trigger("mousemove", { clientX: 10, clientY: 10 });
            cy.wait(500);
            // Hover again to trigger validation tooltip
            cy.wrap(body)
                .find(`[data-component-id='${locators.issueManagement.issueDashboard.createIssue.dataCompIdCreateButton}'] button`)
                .trigger("mouseover");
            cy.wait(500);
            // Validate the tooltip appears
            cy.wrap(body).find(".ui-tooltip", { timeout: 7000 }).should("be.visible");

            // Validate error messages
            cy.wrap(body).find(".ui-tooltip-content .vi-tt-content.vi-bl-error")
                .should("have.length", length) // Ensure 7 validation messages appear
                .then(($errors) => {
                    const expectedErrors = errorMessageArray

                    //Assert each error message is present
                    cy.wrap($errors).each(($el, index) => {
                        cy.wrap($el).should("contain.text", expectedErrors[index]);
                    });
                });
        })
    }

    selectsTypeAssignee(assignType) {
        issueUtility.radioButton(locators.issueManagement.issueDashboard.createIssue.dataCompIdAssigneeType, assignType)
    }

    verifyAssignee(assigneeName) {
        issueUtility.validateInputText(locators.issueManagement.issueDashboard.createIssue.dataCompIdAssignee, assigneeName)
    }
    /**
        * Clicks on a specified tab in the issue form.
        * @param {string} tabName - Name of the tab to switch to.
        */
    clicksOnTab(tabName) {
        issueUtility.switchingTab(locators.issueManagement.issueDashboard.createIssue.dataCompIdTabs, tabName)
    }
    /**
         * Enters a date in the "Report Date" field.
         * @param {string} dateType - Type of date (e.g., 'current', 'past', 'future').
         * @param {number} days - Number of days to add/subtract from the current date.
         */
    enterReportDate(dateType, days) {
        const date = issueUtility.generateDate(dateType, days);
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdReportDate, date);
    }
    /**
     * Enters a date in the "Closed Date" field.
     * @param {string} dateType - Type of date (e.g., 'current', 'past', 'future').
     * @param {number} days - Number of days to add/subtract from the current date.
     */
    enterClosedDate(dateType, days) {
        const date = issueUtility.generateDate(dateType, days);
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdClosedDate, date);
    }
    /**
     * Selects a Requirement from the tree structure.
     * Regulations & Obligations ---> Administration ---> Manage Regulations & Obligations
     */
    selectRequirement(parentItem, childItem) {
        issueUtility.clickButtonBySectionId(locators.issueManagement.issueDashboard.createIssue.dataCompIdRequirementPlusIcon)
        issueUtility.clickTreeItem(locators.issueManagement.issueDashboard.createIssue.dataCompIdRequirementTree, parentItem, childItem);
        issueUtility.clickButtonBySectionId(locators.issueManagement.issueDashboard.createIssue.dataCompIdAddButtonOfRequirement);
        issueUtility.verifyLabelText(locators.issueManagement.issueDashboard.createIssue.dataCompIDVerifyRequirementFileText, childItem)

    }
    /**
    * Selects a Document from the tree structure.
    */
    selectDocument(parentItem, childItem) {
        issueUtility.clickButtonBySectionId(locators.issueManagement.issueDashboard.createIssue.dataCompIdDocumentPlusIcon);
        issueUtility.clickTreeItem(locators.issueManagement.issueDashboard.createIssue.dataCompIdDocumentTree, parentItem, childItem);
        issueUtility.clickButtonBySectionId(locators.issueManagement.issueDashboard.createIssue.dataCompIdAddButtonOfDocument);
        issueUtility.verifyFirstLabelText(locators.issueManagement.issueDashboard.createIssue.dataCompIDVerifyDocumentFileText, childItem);
    }
    /**
        * Selects a Risk from the tree structure.
        */
    selectRisk(parentItem, childItem, expectedText) {
        issueUtility.clickButtonBySectionId(locators.issueManagement.issueDashboard.createIssue.dataCompIdRiskPlusIcon);
        issueUtility.clickTreeItem(locators.issueManagement.issueDashboard.createIssue.dataCompIdDocumentTree, parentItem, childItem);
        issueUtility.clickButtonBySectionId(locators.issueManagement.issueDashboard.createIssue.dataCompIdAddButtonOfDocument);
        issueUtility.verifyInputText(locators.issueManagement.issueDashboard.createIssue.dataCompIDVerifyRiskText, expectedText)
    }

    viewRiskData(riskData) {
        issueUtility.clickButtonBySectionId(locators.issueManagement.issueDashboard.createIssue.dataCompIdViewRiskBtn)
        issueUtility.verifyLabelText(locators.issueManagement.issueDashboard.createIssue.dataCompIdRisDefViewText, riskData)
        issueUtility.clickInputElement(locators.issueManagement.issueDashboard.createIssue.dataCompIdRiskPopupOKBtn);
    }
    /**
    * Selects a Vendor from the dropdown.
    */
    selectVendor(text) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdVendor, text);
    }
    /**
     * Enters a date in the "Due Date" field.
     * @param {string} dateType - Type of date (e.g., 'current', 'past', 'future').
     * @param {number} days - Number of days to add/subtract from the current date.
     */
    enterDueDate(dateType, days) {
        const date = issueUtility.generateDate(dateType, days);
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdDueDate, date);
    }
    /**
         * Enters a date in the "In Validation Target Date" field.
         * @param {string} dateType - Type of date (e.g., 'current', 'past', 'future').
         * @param {number} days - Number of days to add/subtract from the current date.
         */
    enterInValidationTargetDate(dateType, days) {
        const date = issueUtility.generateDate(dateType, days);
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdInValidationTargetDate, date);
    }
    /**
     * Enters text into the "Original Report" field.
     * @param {string} text - The original report content.
     */
    enterDataInOriginalReport(text) {
        issueUtility.typeInIframeEditor(locators.issueManagement.issueDashboard.createIssue.dataCompIdOriginalReport, text);
    }
    
    /**
     * Enters text into rich text editor for external webforms (no iframe handling)
     * @param {string} componentId - The data-component-id of the rich text editor
     * @param {string} text - The text to enter
     */
    enterDataInExternalRichTextEditor(componentId, text) {
        // Direct approach for external webforms - no iframe needed
        cy.get(`[data-component-id='${componentId}']`, { timeout: 10000 })
            .should('be.visible')
            .within(() => {
                cy.get('[contenteditable="true"]')
                    .should('exist')
                    .and('be.visible')
                    .should('have.attr', 'contenteditable', 'true')
                    .click({ force: true })
                    .wait(500)
                    .clear({ force: true })
                    .type(text, { force: true });
            });
    }
    /**
         * Selects a root cause and enters its description.
         * @param {string} rootCauseName - The name of the root cause.
         * @param {string} rootCauseDescription - The description of the root cause.
         */
    selectRootCause(rootCauseName, rootCauseDescription) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdRootCause, rootCauseName)
        issueUtility.typeInIframeEditor(locators.issueManagement.issueDashboard.createIssue.dataCompIdRootCauseDescription, rootCauseDescription)
    }
    /**
     * Enters a value in the "Potential Loss" field.
     * @param {number} value - The potential loss amount.
     */
    enterDatInPotentialLoss(value) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdPotentialLoss, value);
    }

    /**
 * Enters a string value into date fields and validates that only numeric values are allowed.
 *
 * @param {string} value - The string value to be entered in the date fields.
 */
    enterStringDataInDatesField(value) {
        issueUtility.enterStringDataInNumericAndValidateEmptyValue(locators.issueManagement.issueDashboard.createIssue.dataCompIdIdentificationDateKEYDates, value)
        issueUtility.enterStringDataInNumericAndValidateEmptyValue(locators.issueManagement.issueDashboard.createIssue.dataCompIdReportDate, value)
        issueUtility.enterStringDataInNumericAndValidateEmptyValue(locators.issueManagement.issueDashboard.createIssue.dataCompIdDueDate, value)
        issueUtility.enterStringDataInNumericAndValidateEmptyValue(locators.issueManagement.issueDashboard.createIssue.dataCompIdInValidationTargetDate, value)

    }

    /**
 * Enters a string value into numeric fields and validates that only numeric values are allowed.
 *
 * @param {string} value - The string value to be entered in the numeric fields.
 */
    enterStringDataInNumericField(value) {
        issueUtility.enterStringDataInNumericAndValidateEmptyValue(locators.issueManagement.issueDashboard.createIssue.dataCompIdPotentialLoss, value)
        issueUtility.enterStringDataInNumericAndValidateEmptyValue(locators.issueManagement.issueDashboard.createIssue.dataCompIdActualLoss, value)
        issueUtility.enterStringDataInNumericAndValidateEmptyValue(locators.issueManagement.issueDashboard.createIssue.dataCompIdNumberOfCustomersImpacted, value);
    }

    /**
 * Enters a numeric value in specific fields and validates tooltips for maximum character input.
 *
 * @param {string} value - The numeric value to be entered in the fields.
 * @param {string} potentialLoss - Expected tooltip message for the potential loss field.
 * @param {string} actualLoss - Expected tooltip message for the actual loss field.
 * @param {string} CustomersImpacted - Expected tooltip message for the number of customers impacted field.
 */
    enterDataInNumericValueWithMaximumCharacters(value, potentialLoss, actualLoss, CustomersImpacted) {
        issueUtility.typeMaximumNumberInNumericFieldAndValidateTooltip(locators.issueManagement.issueDashboard.createIssue.dataCompIdPotentialLoss, value, potentialLoss)
        issueUtility.typeMaximumNumberInNumericFieldAndValidateTooltip(locators.issueManagement.issueDashboard.createIssue.dataCompIdActualLoss, value, actualLoss)
        issueUtility.typeMaximumNumberInNumericFieldAndValidateTooltip(locators.issueManagement.issueDashboard.createIssue.dataCompIdNumberOfCustomersImpacted, value, CustomersImpacted)
    }
    /**
        * Enters a value in the "Actual Loss" field.
        * @param {number} value - The actual loss amount.
        */
    enterDataInActualLoss(value) {
        issueUtility.typeInInput(
            locators.issueManagement.issueDashboard.createIssue.dataCompIdActualLoss,
            value
        );
    }
    /**
     * Enters a value in the "Impacted Controls" field.
     * @param {string} value - The impacted controls information.
     */
    enterDataInImpactedControls(value) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdImpactedControls, value);
    }
    /**
         * Enters a value in the "Risk Area" field.
         * @param {string} value - The risk area description.
         */
    enterDataInRiskArea(value) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdRiskArea, value);
    }
    /**
     * Enters a value in the "Number of Customers Impacted" field.
     * @param {string | number} value - The number of affected customers.
     */
    enterDataInNumberOfCustomersImpacted(value) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdNumberOfCustomersImpacted, value);
    }
    /**
     * Enters a value in the "How Customers Were Impacted" field.
     * @param {string} value - The explanation of customer impact.
     */
    enterDataInHowCustomersImpacted(value) {
        issueUtility.typeInInput(locators.issueManagement.issueDashboard.createIssue.dataCompIdHowCustomersImpacted, value);
    }
    /**
     * Enters a value in the "Recommendation" field.
     * @param {string} value - The recommendation text.
     */
    enterDataInRecommendation(value) {
        issueUtility.typeInIframeEditor(locators.issueManagement.issueDashboard.createIssue.dataCompIdRecommendation, value);
    }
    /**
         * Enters a value in the "Management Response" field.
         * @param {string} value - The management response text.
         */
    enterDataInManagementResponse(value) {
        issueUtility.typeInIframeEditor(locators.issueManagement.issueDashboard.createIssue.dataCompIdManagementResponse, value);
    }

    enterDataInAgGridAndVerifyStatus(textAreaType, textAreaText, selectType, statusValue, message, timeout, delay = 10) {
        cy.fillAgGridInlineField(textAreaType, textAreaText, delay);
        cy.log(textAreaText)
        cy.fillAgGridInlineField(selectType, statusValue);
        cy.verifyToastMessageText(message, timeout);
    }

    /**
    * Adds a linked item where the existing issue name is mandatory,
    * and the child issue name is optional with a different text.
    *
    * @param {string} filePath - The path to the JSON file.
    * @param {string} existingIssueText - The text to type in the "Existing Issue" dropdown.
    * @param {string} childIssueText - The text to type in the "Child Issue" dropdown (if applicable).
    * @param {string} modalText - The expected text in the modal for verification.
    * @param {boolean} isChildIssueOptional - If `true`, the child issue will be selected with `childIssueText`.
    */
    addLinkedItemWithCondition(filePath, existingIssueText, childIssueText, modalText, isChildIssueOptional) {
        cy.readFile(filePath).then((data) => {
            // Click the "Add Linked Item" button
            issueUtility.clickButtonBySectionId(
                locators.issueManagement.issueDashboard.createIssue.dataCompIdAddButtonLinkedItem
            );

            // Verify the modal text
            issueUtility.verifyLabelText(
                locators.issueManagement.issueDashboard.createIssue.dataCompIdLinkedItemText,
                modalText
            );
            const typeAndSelectFirstOption = (dataComponentId, text) => {
                issueUtility.getByDataComponentId(dataComponentId)
                    .find("input")
                    .should("be.visible")
                    .should("be.enabled")
                    .clear()
                    .type(text, { delay: 100 });

                // Wait for the dropdown options to load
                cy.wait(1000);

                // Select the first matching option
                issueUtility.getByDataComponentId(dataComponentId)
                    .find("input")
                    .type("{downarrow}{enter}", { delay: 100 });

                // Verify the selected value
                issueUtility.verifyMultiSelectDropdown(dataComponentId, text);

            };

            // **Always select Existing Issue (Mandatory)**
            typeAndSelectFirstOption(
                locators.issueManagement.issueDashboard.createIssue.dataCompIdLinkIssuesDropdown,
                existingIssueText
            );

            // **Select Child Issue with different text if isChildIssueOptional is true**
            if (isChildIssueOptional) {
                typeAndSelectFirstOption(
                    locators.issueManagement.issueDashboard.createIssue.dataCompIdLinkTaskDropdown,
                    childIssueText
                );
            }

            // Click the "Link" button after selecting values
            issueUtility.clickButtonBySectionId(
                locators.issueManagement.issueDashboard.createIssue.dataCompIdLinkButton
            );

            // Log success message
            cy.log(`Successfully added linked items: ${existingIssueText} (Existing) & ${childIssueText} (Child)`);
        });
    }



    /**
         * Verifies if a document file has been downloaded.
         * Functionality not working
         */
    verifyDownloadDocument(fileName) {
    }

    /**
 * Handles the visibility of the "Repeat Finding Issue" field based on the selected radio button option.
 *
 * - If "Yes" is selected, it verifies that the linked item field is present.
 * - If "No" is selected, it verifies that the linked item field is absent.
 *
 * @param {string} optionRadioButton - The option selected for the "Repeat Finding Issue" radio button. 
 *                                      Accepts "Yes" or "No".
 */
    repeatFindingIssueVisibility(optionRadioButton) {
        issueUtility.radioButton(locators.issueManagement.issueDashboard.createIssue.dataCompIdRepeatFindingIssueRadioButton, optionRadioButton)
        if (optionRadioButton == "Yes") {
            issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.labelDataCompIdLinkedItemTextOuter, true, "label")
        }
        else {
            issueUtility.verifyFieldPresence(locators.issueManagement.issueDashboard.createIssue.labelDataCompIdLinkedItemTextOuter, false, "label")
        }
    }
    /**
    * Handles the Linked Item button functionality.
    * Reads data from a JSON file, extracts values based on provided keys, 
    * and selects corresponding items in dropdowns before linking them.
    *
    * @param {string} filePath - The path to the JSON file containing setup data.
    * @param {string} key1 - The key for the existing issue name in the JSON file.
    * @param {string} key2 - The key for the child issue name in the JSON file.
    * @param {string} modalText - The expected text in the modal for verification.
    */
    handleLinkedItemButton(filePath, key1, key2, modalText) {
        cy.readFile(filePath).then((data) => {
            // Extract values dynamically based on the keys passed
            const value1 = data.setup[key1]?.trim() || "";
            const value2 = data.setup[key2]?.trim() || "";

            // Check if at least one of the values is present
            if (value1 || value2) {
                // Click the Add Button (only once)
                issueUtility.clickButtonBySectionId(
                    locators.issueManagement.issueDashboard.createIssue.dataCompIdAddButtonLinkedItem
                );

                // Verify Modal Text
                issueUtility.verifyLabelText(
                    locators.issueManagement.issueDashboard.createIssue.dataCompIdLinkedItemText,
                    modalText
                );

                // Helper function to select an item in a dropdown
                const selectDropdownItem = (dataComponentId, value, isMultiSelect = false) => {
                    issueUtility.getByDataComponentId(dataComponentId)
                        .find("input")
                        .should("be.visible")
                        .should("be.enabled")
                        .clear()
                        .type(value, { delay: 100 });

                    // Wait for the dropdown options to load
                    cy.wait(1000);

                    // Select the first matching option
                    issueUtility.getByDataComponentId(dataComponentId)
                        .find("input")
                        .type("{downarrow}{enter}", { delay: 100 });

                    // Verify the selected value
                    if (isMultiSelect) {
                        // For multi-select dropdowns, use verifyMultiSelectDropdown
                        issueUtility.verifyMultiSelectDropdown(dataComponentId, value);
                    } else {
                        // For single-select dropdowns, verify the input value
                        issueUtility.getByDataComponentId(dataComponentId)
                            .find("input")
                            .should("have.value", value);
                    }
                };

                // If key1 (existingIssueName) is valid, select it in the first dropdown
                if (value1) {
                    selectDropdownItem(
                        locators.issueManagement.issueDashboard.createIssue.dataCompIdLinkIssuesDropdown,
                        value1
                    );
                }

                // If key2 (childIssueName) is valid, select it in the second dropdown
                if (value2) {
                    selectDropdownItem(
                        locators.issueManagement.issueDashboard.createIssue.dataCompIdLinkTaskDropdown,
                        value2,
                        true // Indicates this is a multi-select dropdown
                    );
                }

                // Click the Link Button after selecting valid values
                issueUtility.clickButtonBySectionId(
                    locators.issueManagement.issueDashboard.createIssue.dataCompIdLinkButton
                );
            } else {
                cy.log("No valid keys found. Skipping LinkedItem step.");
            }
        });
    }
       /**
     * Enters text into the "Original Report" field in external webforms.
     * @param {string} text - The text to be entered.
     */
    enterDataInOriginalReportExternalWebform(text) {
        // For external webforms, the originalReport locator is just the component ID
        const componentId = locators.externalWebform.originalReport;
        issueUtility.typeInRichTextEditor(componentId, text);
    }
    
}
