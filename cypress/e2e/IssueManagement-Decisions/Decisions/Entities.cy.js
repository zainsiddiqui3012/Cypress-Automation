import IssueUtility from "../../../support/POM/IssueManagement_PO/Decisions/IssueUtility";
const issueManagementData = "cypress/fixtures/IssueManagementDecisions/Decisions/IssueManagementSetupData.json"

describe("Verify the funationality of Entities screen", { tags: ["@entities", "@regression", "@issue-management-administration", "@issue-managementv2", "@release5.21"] }, () => {

    const withIssueManag = Cypress.env("ISSUE_USER");
    const issueUtility = new IssueUtility();
    const itemPrefix = "Entity name ";

    beforeEach(() => {

        cy.session("issueManagementUserLogin", () => {

            cy.visit(Cypress.config("baseUrl"));
            cy.login(withIssueManag.USERNAME, withIssueManag.PASSWORD, withIssueManag.KEY);
        })
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
        cy.visitEntities();
    })

    it("Verify that user should be able to add Entity in Grid", { tags: "@29334" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueManagementData, itemPrefix)
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    })

    it("Verify that validation error message should be showing when user add same Entity in the Grid", { tags: "@29669" }, () => {
        cy.clickAddFromSubHeader();
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(itemPrefix + file.validationErrorToaster, file.timeOut);
        })
    })

    it("Verify that user can edit the Entity in the grid", { tags: "@29670" }, () => {
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

    it("Verify that user can search the Entity by its Name", { tags: "@29671" }, () => {
        cy.readFile(issueManagementData).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
    })

    it("Verify that the user can search the Entity by its Status", { tags: "@29672" }, () => {
        issueUtility.changeStatusToInactive()
        cy.readFile(issueManagementData).then((file) => {
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut);
            cy.searchByNameAndStatus(file.statusInActive, false)
            issueUtility.verifyStatus(file.statusInActive)
        })
    })

    it("Verify that user should be able to search the Entities by its Name and Status", { tags: "@30244" }, () => {
        cy.readFile(issueManagementData).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            cy.searchByNameAndStatus(file.statusActive, false)
            issueUtility.verifyStatus(file.statusActive)
        })
    })

    it("Verify that user should not be able to add an empty record!", { tags: "@29673" }, () => {

        cy.clickAddFromSubHeader();
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, " ");
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.validationErrorEmptyToaster, file.timeOut);
        })
    })

    it("Verify that user should not be able to add an empty record in edit mode", { tags: "@30245" }, () => {
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

    it("Verify that already existing Entity cannot be added in edit mode", { tags: "@30247" }, () => {
        cy.clicksOnActionEditIcon();
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(itemPrefix + file.validationErrorToaster, file.timeOut)
        })
    })
    //This test case failed because of a bug that has been reported
    it("Verify that user should not be able to add morethan 255 characters in Entity Grid", { tags: "@29674" }, () => {

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
    it("Verify that user should not be able to add morethan 255 characters in edit mode in Entities Grid", { tags: "@30246" }, () => {
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

    it("Verify that the user can add and edit records on the Entities screen without refreshing the page.", { tags: "@30248" }, () => {
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

    it("Verify that special characters and digits are accepted on the Entity Name field", { tags: "@33643" }, () => {
        cy.clickAddFromSubHeader();
        issueUtility.createRandomSpecialItemName(issueManagementData, itemPrefix)
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    });

    it.skip("Verify that no error is displayed when the user clicks the add button again after adding one record", { tags: "@33644" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueManagementData, itemPrefix)
        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.clickAddFromSubHeader()
        });
    })
})