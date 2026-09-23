import IssueUtility from "../../../support/POM/IssueManagement_PO/Decisions/IssueUtility";
const issueTypes = "cypress/fixtures/IssueManagementDecisions/Decisions/IssueManagementSetupData.json";

describe("Verify the Issue Types Setup screen functionality", { tags: ["@issue-types", "@decision", "@regression", "@issue-management-administration", "@issue-managementv2", "@release5.21"] }, () => {

    const issueUtility = new IssueUtility();
    const withIssueManag = Cypress.env("ISSUE_USER");
    const itemPrefix = "Issue Type name ";

    beforeEach(() => {

        cy.session("issueManagementUserLogin", () => {
            cy.visit(Cypress.config("baseUrl"))
            cy.login(withIssueManag.USERNAME, withIssueManag.PASSWORD, withIssueManag.KEY)
        })

        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
        cy.visitIssueTypes();
    })

    it("Verify that user should be able to add Issue Types in Grid", { tags: "@28599" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueTypes, itemPrefix)
        cy.readFile(issueTypes).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    })

    it("Verify that validation error message should be showing when user add same issue types in the Grid", { tags: "@28601" }, () => {
        cy.clickAddFromSubHeader();
        cy.readFile(issueTypes).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(itemPrefix + file.validationErrorToaster, file.timeOut);
        })
    })

    it("Verify that user can edit the issue type in the grid", { tags: "@28604" }, () => {
        cy.readFile(issueTypes).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
        cy.clicksOnActionEditIcon();
        issueUtility.createRandomItemName(issueTypes, itemPrefix)
        cy.readFile(issueTypes).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut);
        })
    })

    it("Verify that user can search an Issue Type by its Name", { tags: "@28611" }, () => {
        cy.readFile(issueTypes).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
    })

    it("Verify that the user can search the Issue Type by its Status", { tags: "@28616" }, () => {
        issueUtility.changeStatusToInactive()
        cy.readFile(issueTypes).then((file) => {
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut);
            cy.searchByNameAndStatus(file.statusInActive, false)
            issueUtility.verifyStatus(file.statusInActive)
        })
    })

    it("Verify that user should be able to search the Issue Types by its Name and Status", { tags: "@30222" }, () => {
        cy.readFile(issueTypes).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            cy.searchByNameAndStatus(file.statusActive, false)
            issueUtility.verifyStatus(file.statusActive)
        })
    })

    it("Verify that user should not be able to add an empty record!", { tags: "@28790" }, () => {

        cy.clickAddFromSubHeader();
        cy.readFile(issueTypes).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, " ");
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.validationErrorEmptyToaster, file.timeOut);
        })
    })

    it("Verify that user should not be able to add an empty record in edit mode", { tags: "@30230" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueTypes, itemPrefix)
        cy.readFile(issueTypes).then((file) => {
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

    it("Verify that already existing Issue Types cannot be added in edit mode", { tags: "@30235" }, () => {
        cy.clicksOnActionEditIcon();
        cy.readFile(issueTypes).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(itemPrefix + file.validationErrorToaster, file.timeOut)
        })
    })
    //This test case failed because of a bug that has been reported
    it("Verify that user should not be able to add morethan 255 characters in issueTypes Grid", { tags: "@29667" }, () => {

        cy.clickAddFromSubHeader();
        issueUtility.createRandomItemName(issueTypes, itemPrefix, true);
        cy.readFile(issueTypes).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName, file.delay);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.searchByNameAndStatus(file.itemFullName, true, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            issueUtility.getTextForAgGridRow(file.itemFullName);
        })
    })
    //This test case failed because of a bug that has been reported
    it("Verify that user should not be able to add morethan 255 characters in edit mode in issue Source Grid", { tags: "@30234" }, () => {
        cy.readFile(issueTypes).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        });
        issueUtility.createRandomItemName(issueTypes, itemPrefix, true);
        cy.clicksOnActionEditIcon();
        cy.readFile(issueTypes).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName, file.delay);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            issueUtility.getTextForAgGridRow(file.itemFullName);
        })
    })

    it("Verify that the user can add and edit records on the Issue Source screen without refreshing the page.", { tags: "@30236" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueTypes, itemPrefix)
        cy.readFile(issueTypes).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusInActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
            cy.waitForToastMessageToDisappear(10000)
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
        cy.clicksOnActionEditIcon();
        issueUtility.createRandomItemName(issueTypes, itemPrefix)
        cy.readFile(issueTypes).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName)
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    })

    it("Verify that special characters and digits are accepted on the Issue Type Name field", { tags: "@33642" }, () => {
        cy.clickAddFromSubHeader();
        issueUtility.createRandomSpecialItemName(issueTypes, itemPrefix)
        cy.readFile(issueTypes).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    });

    it.skip("Verify that no error is displayed when the user clicks the add button again after adding one record", () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueTypes, itemPrefix)
        cy.readFile(issueTypes).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.clickAddFromSubHeader()
        });
    })
})