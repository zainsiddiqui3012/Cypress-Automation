import IssueUtility from "../../../support/POM/IssueManagement_PO/Decisions/IssueUtility";
const issueManagementData = "cypress/fixtures/IssueManagementDecisions/Decisions/IssueManagementSetupData.json"

describe("Verify the functioality of RootCause screen", { tags: ["@root-cause", "@decision", "@regression", "@issue-management-administration", "@issue-managementv2", "@release5.21"] }, () => {
    const withIssueManag = Cypress.env("ISSUE_USER");
    const issueUtility = new IssueUtility();
    const itemPrefix = "Root Cause name ";

    beforeEach(() => {

        cy.session("issueManagementUserLogin", () => {

            cy.visit(Cypress.config("baseUrl"));
            cy.login(withIssueManag.USERNAME, withIssueManag.PASSWORD, withIssueManag.KEY);
        })
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
        cy.visitRootCause();
    })

    it("Verify that user should be able to add Root Cause in Grid", { tags: "@28624" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueManagementData, itemPrefix)
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    })

    it("Verify that validation error message should be showing when user add same Root Cause in the Grid", { tags: "@28627" }, () => {
        cy.clickAddFromSubHeader();
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(itemPrefix + file.validationErrorToaster, file.timeOut);
        })
    })

    it("Verify that user can edit the Root Cause in the grid", { tags: "@28629" }, () => {
        cy.readFile(issueManagementData).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
        cy.clicksOnActionEditIcon();
        issueUtility.createRandomItemName(issueManagementData, itemPrefix)
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut);
        })
    })

    it("Verify that user can search the Root Cause by its Name", { tags: "@28631" }, () => {
        cy.readFile(issueManagementData).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
    })

    it("Verify that the user can search the Root Cause by its Status", { tags: "@28732" }, () => {
        issueUtility.changeStatusToInactive()
        cy.readFile(issueManagementData).then((file) => {
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut);
            cy.searchByNameAndStatus(file.statusInActive, false)
            issueUtility.verifyStatus(file.statusInActive)
        })
    })

    it("Verify that user should be able to search the Root Cause by its Name and Status", { tags: "@30237" }, () => {
        cy.readFile(issueManagementData).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            cy.searchByNameAndStatus(file.statusActive, false)
            issueUtility.verifyStatus(file.statusActive)
        })
    })

    it("Verify that user should not be able to add an empty record!", { tags: "@28791" }, () => {

        cy.clickAddFromSubHeader();
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, " ");
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.validationErrorEmptyToaster, file.timeOut);
        })
    })

    it("Verify that user should not be able to add an empty record in edit mode", { tags: "@30238" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueManagementData, itemPrefix)
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut);
            cy.waitForToastMessageToDisappear(10000);
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            cy.clicksOnActionEditIcon()
            cy.fillAgGridInlineField(file.fieldTypeTextArea, " ")
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive)
            cy.verifyToastMessageText(file.validationErrorEmptyToaster, file.timeOut)
        })
    })

    it("Verify that already existing Root Cause cannot be added in edit mode", { tags: "@30241" }, () => {
        cy.clicksOnActionEditIcon();
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(itemPrefix + file.validationErrorToaster, file.timeOut)
        })
    })
    //This test case failed because of a bug that has been reported
    it("Verify that user should not be able to add morethan 255 characters in Root Cause Grid", { tags: "@29668" }, () => {

        cy.clickAddFromSubHeader();
        issueUtility.createRandomItemName(issueManagementData, itemPrefix, true);
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName, file.delay);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.searchByNameAndStatus(file.itemFullName, true, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            issueUtility.getTextForAgGridRow(file.itemFullName);
        })
    })

    //This test case failed because of a bug that has been reported
    it("Verify that user should not be able to add morethan 255 characters in edit mode in Root Cause Grid", { tags: "@30239" }, () => {
        cy.readFile(issueManagementData).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        });
        issueUtility.createRandomItemName(issueManagementData, itemPrefix, true);
        cy.clicksOnActionEditIcon();
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName, file.delay);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            issueUtility.getTextForAgGridRow(file.itemFullName);
        })
    })

    it("Verify that the user can add and edit records on the Root Cause screen without refreshing the page.", { tags: "@30242" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueManagementData, itemPrefix)
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusInActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
            cy.waitForToastMessageToDisappear(10000)
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
        cy.clicksOnActionEditIcon();
        issueUtility.createRandomItemName(issueManagementData, itemPrefix)
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName)
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    })
    it("Verify that special characters and digits are accepted on the Root Cause Name field", { tags: "@33648" }, () => {
        cy.clickAddFromSubHeader();
        issueUtility.createRandomSpecialItemName(issueManagementData, itemPrefix)
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    });

    it("Verify that no error is displayed when the user clicks the add button again after adding one record", () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueManagementData, itemPrefix)
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.clickAddFromSubHeader()
        });
    })
})