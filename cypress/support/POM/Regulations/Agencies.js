import locators from "../../../fixtures/locators.json"
import IssueUtility from "../IssueManagement_PO/Decisions/IssueUtility";
export default class Agencies {

    issueUtility = new IssueUtility();
    createAgencyRecord(issueManagementData) {
        cy.visitAgencies();
        cy.clickAddFromSubHeader();
        this.issueUtility.generateAndStoreItemWithDynamicKey(issueManagementData, "agency");
        cy.readFile(issueManagementData).then((file) => {
            this.issueUtility.enterDataInTextField(locators.regulations.agencies.name, file.setup.agency.agencyFullName);
            this.issueUtility.selectStatus(locators.regulations.agencies.radionBtnStatusActive);
            cy.clickSaveLink();
            cy.verifyToastMessageText(file.messages.successfulToasterAgencyScreen, file.timeouts.default);
        });
    }


}