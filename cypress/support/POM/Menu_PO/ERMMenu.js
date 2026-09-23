import locators from "../../../fixtures/locators.json"


export class Menu{

    //clickRiskAndControlRegister will open RiskAndControl Register Module Nav.
    clickRiskAndControlRegister(){
        cy.get(locators.menu.riskAndControlRegister).click()
    }

    //clickKxiManagement  will open kxi Managment Module Nav.
    clickKxiManagement(){
        cy.get(locators.menu.kxIManagement).click()
    }

    //clickComplianceManagement  will open Compliance Management Module Nav.
    clickComplianceManagement(){
        cy.get(locators.menu.ComplianceManagement).click()
    }
    
    //clickAdministrationUnderParent will open Administration in Nav of already opened Module from the dropdown
    clickAdministrationUnderParent(){
        cy.get(locators.menu.openDropdown)
        .contains("span","Administration").click()
    }

    /**
     * verifyMenuKeywordAndLink will validates menus when they are accessed from the top-level dropdown in the navigation 
     * Module should not have Administration option.
     * @param {String} param is menu name 
     */
    verifyMenuKeywordAndLink(param){
        cy.get(locators.menu.openDropdown)
        .find("ul")
        .should('be.visible')
        .contains("span",param['name'])
        .parent()
        .should('have.attr','href',param['link'])
    }



    /**
     * verifyMenuUnderParentAdministration will validates Administration menus when accessed from the top-level dropdown
     * Module must have added Administration option.
     * @param {String} param is menu name 
     */
    verifyMenuUnderParentAdministration(param){
        cy.get(locators.menu.administrationRisk)
        .should('be.visible')
        .parentsUntil("li")
        .siblings("ul")
        .contains("span",param["name"])
        .parent()
        .should('have.attr','href',param['link'])
        }


    /**
     * verifyinAdministration will validates all menus within the Administration module.
     * @param {String} param will be Administration menu names
     */
    verifyinAdministration(param) {
        cy.get(locators.menu.administration)
        .should("be.visible")
        .parent()
        .siblings("ul")
        .contains("span", param["name"])
        .parent()
        .should('have.attr','href',param['link'])
    }


/******************************------BREAD CRUMB--------********************************** */

/**
 * verifyVisibleText is generic function it can validate screen Breadcrumb added is expected as added in ERMMenu.json file
 * @param {String} moduleName is screen name locator 
 * @param {String} visibleNames is visible text locator
 * @param {String} param is screen Name
 */
    verifyVisibleText(moduleName, visibleNames, param){

        cy.get(moduleName)
        .within(()=>{
            cy.get(visibleNames)
        .invoke('text')
        .then((text)=>{
            const trimmedText= text.trim();
             // Remove extra whitespace and newlines
            const cleanedText = text.replace(/\s+/g, ' ').trim();
            expect(cleanedText).to.eq(param["breadcrumbLabel"])
        })
    })
    }



    /**
     * verifyBreadcrumb will validate breadcrumb text of the screen.
     * Module should not have Administration option.
     * it will open the screen from the Module dropdown menu and check for the breadcrumb text of the screen 
     * @param {String} param  is the menu name
     */
    verifyBreadcrumb(param){
        cy.get(locators.menu.openDropdown)
        .contains("span",param["name"]).click()
        this.verifyVisibleText(locators.breadcrumbs.moduleName, locators.breadcrumbs.visibleNames, param)
    }


    /**
     * verifyBreadCrumbUnderParentAdministration will validate breadcrumb text of the screen,
     * Module should have Administration option when opened from top-level dropdown.
     * it will validate the Administration menus screens breadcrumbs
     * @param {String} param is added Administration's menu name
     */
    verifyBreadcrumbUnderParentAdministration(param){
        cy.get(locators.menu.administrationRisk)
        .parent()
        .siblings("ul")
        .contains("span",param["name"])
        .click()

        this.verifyVisibleText(locators.breadcrumbs.moduleName, locators.breadcrumbs.visibleNames, param)
    }


}
    

