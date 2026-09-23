import locators from "../../../fixtures/locators.json";
import "cypress-file-upload";
export default class IssueSources_PO 
{

    clickAddBtn(){
        cy.get(locators.issueManagement.administration.issueSources.addBtn).click({force:true});
    }

    textArea(){

        return cy.get(locators.issueManagement.administration.issueSources.textArea);
    }
    searchBox(){
        return cy.get(locators.issueManagement.administration.issueSources.search);
    }
    clickActionIcon(){
        cy.get(locators.issueManagement.administration.issueSources.actionIcon).click();
    }

    clearSearchedTextBox(){
        return cy.get(locators.issueManagement.administration.issueSources.searchedTextArea).click().clear();
        
    }
    openStatusDropdown(){
        cy.get(locators.issueManagement.administration.issueSources.statusBtn).dblclick();
    }

    clickInactiveOption(){

        cy.contains(locators.issueManagement.administration.issueSources.inactiveOption).click();
    }
    clickActiveOption(){

        cy.get(locators.issueManagement.administration.issueSources.activeOption).click({force:true});
    }
    
    clickDropdownActiveOption(){

        cy.contains(locators.issueManagement.administration.issueSources.dropdownActiveOption).click();
    }
}