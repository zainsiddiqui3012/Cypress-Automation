import locators from "../../../fixtures/locators.json";
import "cypress-file-upload";
export default class IssueMangementDashboard_PO 
{
    assertIssueManagementMenuDisplayed()
    {
        cy.get(locators.leftMenuBtn).click({force:true});
        cy.contains(locators.menu.complianceManagement).click({force:true});
        cy.contains(locators.menu.issueManagement).click({force:true});
        cy.contains(locators.menu.issueDashboard).should('be.visible').click();
    }

    assertCreateIssueAndTaskDisplayed()
    {
        cy.switchIframe(locators.IssueManagement.IssueDashboard.IssueFrame).within(()=>{
            cy.contains('button', locators.IssueManagement.IssueDashboard.CreateIssue, {timeout:40000}).
            should('be.visible');
            cy.contains('button', locators.IssueManagement.IssueDashboard.CreateTask).
            should('be.visible');
        })
    }

    getTotalTaskCount() {
        cy.switchIframe(locators.IssueManagement.IssueDashboard.IssueFrame).within(() => {
        cy.contains('a', locators.IssueManagement.IssueDashboard.AllIssues).click({force:true}); 
        cy.wait(3000);  
        cy.get(locators.IssueManagement.IssueDashboard.DashboardScroll).scrollTo('bottom'); 
            cy.get(locators.IssueManagement.IssueDashboard.IssueCount)
                .each(($el, index, $list) => {
                    const rowNumber = parseInt($el.text(), 10);
                })
                .then(($list) => {
                    // Log the total number of rows
                    cy.log(`Total Issue Created = : ${$list.length}`);
                });
        });
    }


    getOpenTaskCount()
    {
        cy.switchIframe(locators.IssueManagement.IssueDashboard.IssueFrame).within(() => {
                cy.get(locators.IssueManagement.IssueDashboard.OpenIssueCount)
                    .each(($el, index, $list) => {
                        const rowNumber = parseInt($el.text(), 10);
                    })
                    .then(($list) => {
                        // Log the total number of rows
                        cy.log(`Total Issue Created = : ${$list.length}`);
                    });
            });

    }

    getcloseTaskCount()
    {
        cy.switchIframe(locators.IssueManagement.IssueDashboard.IssueFrame).within(() => {
            cy.get(locators.IssueManagement.IssueDashboard.CloseIssueCount)
                .each(($el, index, $list) => {
                    const rowNumber = parseInt($el.text(), 10);
                })
                .then(($list) => {
                    // Log the total number of rows
                    cy.log(`Total Issue Created = : ${$list.length}`);
                });
        });

    }
    
}