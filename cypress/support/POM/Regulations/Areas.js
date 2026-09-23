import locators from "../../../fixtures/locators.json"
import IssueUtility from "../IssueManagement_PO/Decisions/IssueUtility";
import Categories from "./Categories";
export default class Areas {
    issueUtility = new IssueUtility();
    categories = new Categories();

    createAreasRecord(issueManagementData, areaItemPrefix) {
        cy.visitAreas();
        cy.clickAddFromSubHeader();
        this.issueUtility.generateAndStoreItemWithDynamicKey(issueManagementData, "area");
        cy.readFile(issueManagementData).then((file) => {
            this.issueUtility.enterDataInTextField(locators.regulations.agencies.name, file.setup.area.areaFullName);
            this.categories.selectValueFromDropdown(locators.regulations.areas.bsaSubCategoryField, locators.regulations.categories.industryDropDownValue);
            this.issueUtility.selectStatus(locators.regulations.agencies.radionBtnStatusActive);
            cy.clickSaveLink();
            cy.verifyToastMessageText(file.messages.successfulToasterAreaScreen, file.timeouts.default);
        });
    }

}