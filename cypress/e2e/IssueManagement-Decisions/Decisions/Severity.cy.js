import IssueUtility from "../../../support/POM/IssueManagement_PO/Decisions/IssueUtility"
const issueManagementSetupData = "cypress/fixtures/IssueManagementDecisions/Decisions/IssueManagementSetupData.json"
import Issue_Severity from "../../../support/POM/IssueManagement_PO/Decisions/Issue_Severity";

describe("Verify the functionality of Severity screen", { tags: ["@severity", "@regression", "@issue-management-administration", "@issue-managementv2", "@release5.21"] }, () => {
    const withIssueManag = Cypress.env("ISSUE_USER");
    const issueUtility = new IssueUtility();
    const issueSeverity = new Issue_Severity();
    const itemPrefix = "Issue severity name ";

    beforeEach(() => {

        cy.session("issueManagementUserLogin", () => {
            cy.clearAllCookies();
            cy.visit(Cypress.config("baseUrl"));
            cy.login(withIssueManag.USERNAME, withIssueManag.PASSWORD, withIssueManag.KEY);
        })
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
        cy.visitSeverity();
    })

    it("Verify that user should be able to add severity in the Grid", { tags: "@30110" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueManagementSetupData, itemPrefix)
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeveritySimple)
            issueSeverity.doubleClickStatusDropdown();
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    })

    it("Verify that an already existing Severity name cannot be added!", () => {

        cy.clickAddFromSubHeader()
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeveritySimple)
            issueSeverity.doubleClickStatusDropdown();
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(itemPrefix + file.validationErrorToaster, file.timeOut)
        })
    })


    it("Verify that edit functionality of Severity Grid screen!", () => {
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
        issueSeverity.clicksOnEditIcon()
        issueUtility.createRandomItemName(issueManagementSetupData, itemPrefix)
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName)
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeverityExtended)
            issueSeverity.doubleClickStatusDropdown();
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusInActive)
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    })

    it("Verify that user can search the Severity by its Name", { tags: "@30114" }, () => {
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
    })

    it("Verify that user can search the Severity by its Workflow", { tags: "@30115" }, () => {
        cy.readFile(issueManagementSetupData).then((file) => {
            issueSeverity.searchByWorkflow(file.statusSeverityExtended)
            issueSeverity.verifyWorkflowColumnStatus(file.statusSeverityExtended)
        })
    })

    it("Verify that user can search the Severity by its Status", { tags: "@30116" }, () => {
        cy.readFile(issueManagementSetupData).then((file) => {
            issueSeverity.searchByStatus(file.statusInActive)
            issueUtility.verifyStatus(file.statusInActive);
        })
    })

    it("Verify that user can search the Severity by its Name, workflow and Statuses", { tags: "@30199" }, () => {

        cy.readFile(issueManagementSetupData).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
        issueUtility.changeStatusToActive();
        cy.waitForToastMessageToDisappear(10000);
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut);
            issueSeverity.searchByStatus(file.statusActive)
            issueSeverity.searchByWorkflow(file.statusSeverityExtended)
            issueUtility.verifyStatus(file.statusActive)
            issueSeverity.verifyWorkflowColumnStatus(file.statusSeverityExtended)
        })
    })



    it("Verify that user should not be able to add an empty record!", { tags: "@30112" }, () => {

        cy.clickAddFromSubHeader();
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, " ");
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeveritySimple)
            issueSeverity.doubleClickStatusDropdown();
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageContains(file.validationErrorEmptyToaster, file.timeOut);
        })
    })

    it("Verify that user should not be able to add empty records in edit mode!", { tags: "@33645" }, () => {

        cy.clickAddFromSubHeader();
        issueUtility.createRandomItemName(issueManagementSetupData, itemPrefix)
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeveritySimple)
            issueSeverity.doubleClickStatusDropdown();
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
            cy.waitForToastMessageToDisappear(10000);
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            issueSeverity.clicksOnEditIcon()

            cy.fillAgGridInlineField(file.fieldTypeTextArea, " ");
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeveritySimple)
            issueSeverity.doubleClickStatusDropdown();
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageContains(file.validationErrorEmptyToaster, file.timeOut);
        })
    })


    it("Verify that an already existing severity cannot be added in edit mode!", { tags: "@30113" }, () => {
        issueSeverity.clicksOnEditIcon(false)
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeverityExtended)
            cy.verifyToastMessageText(file.validationErrorToasterForSeverity, file.timeOut)
        })
    })
    //This test case failed because of a bug that has been reported
    it("Verify that user should not be able to add morethan 255 characters in Severity Grid", { tags: "@30117" }, () => {

        cy.clickAddFromSubHeader();
        issueUtility.createRandomItemName(issueManagementSetupData, itemPrefix, true);
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName, file.delay);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeveritySimple)
            issueSeverity.doubleClickStatusDropdown();
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
            cy.searchByNameAndStatus(file.itemFullName, true, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            issueUtility.getTextForAgGridRow(file.itemFullName);
        })
    })
    //This test case failed because of a bug that has been reported
    it("Verify that user should not be able to add morethan 255 characters in edit mode in Severity Grid", { tags: "@30202" }, () => {
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        });
        issueUtility.createRandomItemName(issueManagementSetupData, itemPrefix, true);
        issueSeverity.clicksOnEditIcon();
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName, file.delay);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeverityExtended)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            issueUtility.getTextForAgGridRow(file.itemFullName);
        })

    })

    //This test case failed because of a bug that has been reported
    it("Verify that the user can add and edit records on the Severity screen without refreshing the page.", { tags: "@30214" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueManagementSetupData, itemPrefix)
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeveritySimple)
            issueSeverity.doubleClickStatusDropdown();
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusInActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
            cy.waitForToastMessageToDisappear(10000)
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
        issueSeverity.clicksOnEditIcon(false)
        issueUtility.createRandomItemName(issueManagementSetupData, itemPrefix)
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName)
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    })

    it("Verify that user should be able to delete the Severity!", { tags: "@30119" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueManagementSetupData, itemPrefix)
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeveritySimple)
            issueSeverity.doubleClickStatusDropdown();
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
            cy.waitForToastMessageToDisappear(10000)
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            issueSeverity.clicksOnDeleteIcon();
            cy.verifyToastMessageText(file.deletToasterText, file.timeOut)
        })
    })

    it("Verify that special characters and digits are accepted on the Severity Name field", { tags: "@33646" }, () => {
        cy.clickAddFromSubHeader();
        issueUtility.createRandomSpecialItemName(issueManagementSetupData, itemPrefix)
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeveritySimple)
            issueSeverity.doubleClickStatusDropdown();
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    });


    it.skip("Verify that no error is displayed when the user clicks the add button again after adding one record", () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueManagementSetupData, itemPrefix)
        cy.readFile(issueManagementSetupData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusSeveritySimple)
            issueSeverity.doubleClickStatusDropdown();
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.clickAddFromSubHeader()
        });
    })
})