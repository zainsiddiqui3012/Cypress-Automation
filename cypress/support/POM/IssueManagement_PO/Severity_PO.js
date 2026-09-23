import locators from "../../../fixtures/locators.json";
export default class Severity_PO 
{
    clickSeverityEditBtn(){
        cy.get(locators.issueManagement.administration.severity.editBtn).click();
    }
    clickSeverityDeleteBtn(){
        cy.get(locators.issueManagement.administration.severity.deleteBtn).click();
        cy.wait(2000);
    }
    clickSeverityPopupDeleteBtn(){
        cy.get(locators.issueManagement.administration.severity.popupDeleteBtn).click();
        cy.wait(2000);
    }
}