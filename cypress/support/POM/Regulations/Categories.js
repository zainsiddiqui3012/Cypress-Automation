import locators from "../../../fixtures/locators.json"
import IssueUtility from "../IssueManagement_PO/Decisions/IssueUtility";

export default class Categories {

    issueUtility = new IssueUtility();

    selectValueFromDropdown(field, value) {
        cy.get(field).should('be.visible').click();
        cy.get(value).eq(0).should('be.visible').click();
        cy.get(locators.regulations.categories.closeBtnForIndustryDropdown).click();
    }

    createCategory(fileName) {
        cy.readFile(fileName).then((file) => {
            this.issueUtility.enterDataInTextField(locators.regulations.agencies.name, file.setup.category.categoryFullName);
            this.issueUtility.enterDataInTextField(locators.regulations.categories.description, file.setup.category.description);
            this.selectValueFromDropdown(locators.regulations.categories.industryField, locators.regulations.categories.industryDropDownValue);
            this.selectValueFromDropdown(locators.regulations.categories.agencyField, locators.regulations.categories.agencyDropDownValue);
            this.selectValueFromDropdown(locators.regulations.categories.areaField, locators.regulations.categories.areaDropDownValue);
            cy.clickSaveLink();
            cy.verifyToastMessageText(file.messages.successfulToasterCategoryScreen, file.timeouts.default);
        });
    }
    createCategoriesRecord(issueManagementData) {
        cy.visitCategories();
        cy.clickAddFromSubHeader();
        this.issueUtility.generateAndStoreItemWithDynamicKey(issueManagementData, "category");
        this.createCategory(issueManagementData);
    }
    //this.issueUtility.enterDataInTextField(locators.administration.regulations.categories.filterName, file.setup.category.categoryFullName);
    renameExisitingCategory(fileName) {
        cy.visitCategories();
        cy.get(locators.administration.regulations.categories.filterBtn).click();
        cy.readFile(fileName).then((file) => {
            cy.get(locators.administration.regulations.categories.filterName).type(file.setup.category.categoryFullName)
                .wait(200)
                .clear()
                //.type("{backspace}{backspace}", { delay: 200 }) // Delete last two characters
                .type(file.setup.category.categoryFullName, { delay: 350 })
            cy.get(locators.administration.regulations.categories.applyFilterBtn).click();
            cy.get(locators.administration.regulations.categories.searchedCategory).click();
        })
        cy.readFile(fileName).then((file) => {
            this.issueUtility.generateAndStoreItemWithDynamicKey(fileName, "category");
            cy.get(locators.regulations.agencies.name).clear();
            this.issueUtility.enterDataInTextField(locators.regulations.agencies.name, file.setup.category.categoryFullName);
            cy.clickSaveLink();
            cy.verifyToastMessageText(file.messages.successfulToasterCategoryScreen, file.timeouts.default);
        })
    }

    createCategoriesWithSpecialCharactersRecord(issueManagementData) {
        cy.visitCategories();
        cy.clickAddFromSubHeader();
        this.issueUtility.generateAndStoreItemWithSpecialChars(issueManagementData, "category");
        this.createCategory(issueManagementData);
    }

    createCategoriesWithMaximumCharacters(issueManagementData) {
        cy.visitCategories();
        cy.clickAddFromSubHeader();
        this.issueUtility.generateAndStoreItemWithMaxLength(issueManagementData, "category");
        this.createCategory(issueManagementData);
    }

}