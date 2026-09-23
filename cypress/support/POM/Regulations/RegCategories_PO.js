import locators from "../../../fixtures/locators.json";
import "cypress-file-upload";
export default class RegCategories_PO 
{

    clickAddBtn(){
        cy.get(locators.regulations.categories.addBtn).filter(":visible").click();
        cy.wait(2000);
    }
    getNamefield(){

        return cy.get(locators.regulations.categories.name);
    }
    clickSave(){
        cy.contains(locators.regulations.categories.saveBtn).click();
    }
    clickFilterBrn(){

        cy.get(locators.regulations.categories.filterBtn).click();
        cy.wait(2000);
    }
    getFilterNameField(){

        return cy.get(locators.regulations.categories.filterName);
    }
    clickApplyBtn(){
        cy.get(locators.regulations.categories.applyFilterBtn).click();
        cy.wait(1000);
    }
    clickSearchedCategory(){
        cy.get(locators.regulations.categories.searchedCategory).click();
        cy.wait(2000);
    }
}