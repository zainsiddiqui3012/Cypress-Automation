import IssueUtility from "../IssueManagement_PO/Decisions/IssueUtility";

export default class BSASubCategory {
    issueUtility = new IssueUtility();
    createBSASubCategory(issueManagementData, itemPrefix) {
        cy.visitBSASubCategory();
        cy.clickAddFromSubHeader();
        this.issueUtility.doubleClicksOnNameFieldGrid();
        this.issueUtility.generateAndStoreItemWithDynamicKey(issueManagementData, "bsaSubCategory");

        cy.readFile(issueManagementData).then((file) => {
            cy.fillAgGridInlineField(file.fields.textArea, file.setup.bsaSubCategory.bsaSubCategoryFullName);
            cy.fillAgGridInlineField(file.fields.select, file.statuses.active);
            cy.verifyToastMessageText(file.messages.successfulStatus, file.timeouts.default);
        });
    }


}
