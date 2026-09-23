import locators from "../../../fixtures/locators.json";
import IssueUtility from "./Decisions/IssueUtility";
import "cypress-file-upload";

const issueUtility = new IssueUtility();
export default class IssueDashboard {

    openIssueForm() {

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            cy.waitForElementToVisible(locators.issueManagement.issueDashboard.createIssue, 60000);
            cy.get(locators.issueManagement.issueDashboard.createIssue)
                .click({ force: true });
            cy.waitForElementToVisible(locators.issueManagement.createForm.summaryTab, 60000);
        })
    }

    openIssuesTab() {

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            cy.waitForElementToVisible(locators.issueManagement.issueDashboard.issuesTab, 60000);
            cy.get(locators.issueManagement.issueDashboard.issuesTab)
                .click({ force: true });
            cy.wait(4000);
        })

    }

    searchIssueTicket(name) {
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {

            cy.get(locators.issueManagement.issueDashboard.searchIcon).click({ force: true })
                .then(() => {
                    cy.wait(2000);
                    cy.get(locators.issueManagement.issueDashboard.SearchBar).filter(':visible')
                        .clear().type(name, { force: true }).type('{enter}');
                    cy.wait(10000);
                })


        })

    }
    openFirstTicket() {

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            cy.get(locators.issueManagement.issueDashboard.firstTicket).first().click();
            cy.wait(40000);
        })
    }
    clicksOnCreateIssueButton() {
        // issueUtility.clickButtonBySectionId("01HW5QWNT22Q7VFB5K7546AMPP")
        issueUtility.clickButtonBySectionId(locators.issueManagement.issueDashboard.dataCompIdCreateIssueBtn);
    }


}