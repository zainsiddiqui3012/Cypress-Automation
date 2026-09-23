
import IssueUtility from "../../../support/POM/IssueManagement_PO/Decisions/IssueUtility";
const issueSource = "cypress/fixtures/IssueManagementDecisions/Decisions/IssueManagementSetupData.json";

describe("Verify the Issue Sources Setup screen", { tags: ["@issue-source", "@regression", "@issue-management-administration", "@issue-managementv2", "@release5.21", "@decision"] }, () => {
    const withIssueManag = Cypress.env("ISSUE_USER");
    const issueUtility = new IssueUtility();
    const itemPrefix = "Issue Source ";
    beforeEach(() => {
        cy.session("issueManagementUserLogin", () => {
            cy.visit(Cypress.config("baseUrl"))
            cy.login(withIssueManag.USERNAME, withIssueManag.PASSWORD, withIssueManag.KEY)
        })
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
        cy.visitIssueSource();
    })

    it("Verify that user should be able to add Issue Source in Grid", { tags: "@28549" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueSource, itemPrefix)
        cy.readFile(issueSource).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    })

    it("Verify that validation error message should be showing when user add same issue source in the Grid", { tags: "@28550" }, () => {
        cy.clickAddFromSubHeader()
        cy.readFile(issueSource).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName)
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive)
            cy.verifyToastMessageText(itemPrefix + file.validationErrorToaster, file.timeOut)

        })
    })

    it("Verify that edit functionality of Issue Source Grid!", { tags: "@28551" }, () => {
        cy.readFile(issueSource).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
        cy.clicksOnActionEditIcon()
        issueUtility.createRandomItemName(issueSource, itemPrefix)
        cy.readFile(issueSource).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName)
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive)
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    })

    it("Verify that user should be able to search the Issue Source By its Name", { tags: "@28552" }, () => {
        cy.readFile(issueSource).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
    })

    it("Verify that user should be able to search the Issue Source By its Status", { tags: "@28553" }, () => {
        issueUtility.changeStatusToInactive()
        cy.readFile(issueSource).then((file) => {
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
            cy.searchByNameAndStatus(file.statusInActive, false)
            issueUtility.verifyStatus(file.statusInActive)
        })
    })

    it("Verify that user should be able to search the Issue Source by its Name and Status", { tags: "@30216" }, () => {
        cy.readFile(issueSource).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            cy.searchByNameAndStatus(file.statusActive, false)
            issueUtility.verifyStatus(file.statusActive)
        })
    })
    it("Verify that user should not be able to add empty record on issue source form", { tags: "@28785" }, () => {
        cy.clickAddFromSubHeader()
        cy.readFile(issueSource).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, " ")
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive)
            cy.verifyToastMessageText(file.validationErrorEmptyToaster, file.timeOut)
        })
    })
    it("Verify that user should not be able to add an empty record in edit mode", { tags: "@30217" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueSource, itemPrefix)
        cy.readFile(issueSource).then((file) => {
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

    it("Verify that already existing Issue Source cannot be added in edit mode", { tags: "@30218" }, () => {
        cy.clicksOnActionEditIcon();
        cy.readFile(issueSource).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(itemPrefix + file.validationErrorToaster, file.timeOut)
        })
    })
    //This test case failed because of a bug that has been reported
    it("Verify that user should not be able to add morethan 255 characters in issue Source Grid", { tags: "@29666" }, () => {

        cy.clickAddFromSubHeader();
        issueUtility.createRandomItemName(issueSource, itemPrefix, true)
        cy.readFile(issueSource).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName, file.delay);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.searchByNameAndStatus(file.itemFullName, true, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            issueUtility.getTextForAgGridRow(file.itemFullName)
        })
    })

    //This test case failed because of a bug that has been reported
    it("Verify that user should not be able to add morethan 255 characters in edit mode in issue Source Grid", { tags: "@30220" }, () => {
        cy.readFile(issueSource).then((file) => {
            cy.searchByNameAndStatus(file.itemFullName, true, true);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        });
        issueUtility.createRandomItemName(issueSource, itemPrefix, true);
        cy.clicksOnActionEditIcon();
        cy.readFile(issueSource).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName, file.delay);
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
            issueUtility.getTextForAgGridRow(file.itemFullName);
        })
    })

    it("Verify that the user can add and edit records on the Issue Source screen without refreshing the page.", { tags: "@30221" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueSource, itemPrefix)
        cy.readFile(issueSource).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusInActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
            cy.waitForToastMessageToDisappear(10000)
            cy.searchByNameAndStatus(file.itemFullName, true)
            issueUtility.verifyNoOfRecord(file.lengthOfRecord);
        })
        cy.clicksOnActionEditIcon();
        issueUtility.createRandomItemName(issueSource, itemPrefix)
        cy.readFile(issueSource).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName)
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    })

    it("Verify that special characters and digits are accepted on the Issue Source Name field", { tags: "@33639" }, () => {
        cy.clickAddFromSubHeader();
        issueUtility.createRandomSpecialItemName(issueSource, itemPrefix)
        cy.readFile(issueSource).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.verifyToastMessageText(file.successfulStatus, file.timeOut)
        })
    });

    it.skip("Verify that no error is displayed when the user clicks the add button again after adding one record", { tags: "@33640" }, () => {
        cy.clickAddFromSubHeader()
        issueUtility.createRandomItemName(issueSource, itemPrefix)
        cy.readFile(issueSource).then((file) => {
            cy.fillAgGridInlineField(file.fieldTypeTextArea, file.itemFullName);
            cy.fillAgGridInlineField(file.fieldTypeSelect, file.statusActive);
            cy.clickAddFromSubHeader()
        });
    })
})