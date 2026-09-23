import locators from "../../../../fixtures/locators.json"

export default class Issue_Severity {
    searchByStatus(finalText) {
        cy.get(locators.issueManagement.administration.searchTextBoxLoc).eq(2)
            .should('be.visible')
            .should('not.be.disabled')
            .type(finalText)
    }

    searchByWorkflow(finalText) {
        cy.get(locators.issueManagement.administration.searchTextBoxLoc).eq(1)
            .should('be.visible')
            .should('not.be.disabled')
            .type(finalText)
    }

    verifyWorkflowColumnStatus(statusValue) {
        cy.get(locators.issueManagement.administration.workflowGridValue)
            .should(($elements) => {
                // Ensure that all elements have the expected status value
                expect($elements).to.have.length.gt(0);
                $elements.each((index, el) => {
                    expect(el.innerText).to.equal(statusValue); // Verify the text of each element
                });
            });
    }

    doubleClickStatusDropdown() {
        cy.get(locators.issueManagement.administration.severity.statusDropDown)
            .last()
            .dblclick();
    }

    clicksOnDeleteIcon() {
        cy.get(locators.issueManagement.administration.severity.deleteIcon)
            .should("be.visible").click();
        cy.get(locators.issueManagement.administration.severity.deleteOption)
            .should("be.visible").click();
    }

    clicksOnEditIcon(isEditFromIcon = true) {
        if (isEditFromIcon) {
            cy.get(locators.issueManagement.administration.severity.editIconForSeverity).eq(0)
                .should("be.visible").click();
        }
        else {
            cy.get(locators.issueManagement.administration.severity.nameRowRecord).eq(0)
                .dblclick();
        }
    }

}