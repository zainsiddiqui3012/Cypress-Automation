import {Menu} from "../../support/POM/Menu_PO/ERMMenu"
import KXIMenu from "../../support/POM/KXIModule/KXIMenu"
import ERMMenu from "../../fixtures/ERM_User_Menu/ERMMenu.json"


describe("Checking For ERM User's Menu keywords and Breadcrumb Changes", () => {
    
    const sessionSetup=() => {
        cy.session("Logging with ERM User Credentials including Peer Banks", () => {
            const withRm = Cypress.env("kxi").customer.withRM2;
            cy.visit(Cypress.config("baseUrl"));
            cy.login(withRm.username, withRm.password, withRm.key);
        });
    } 
    const menu = new Menu();
    const kxi = new KXIMenu();

        /*
        *Verify the Menu when customer has both Risk Management and KXI modules assigned.
        */

    context("Verifying For Menu Keywords", () => {
        
        
        beforeEach(()=>{
            sessionSetup()
        })



        /**
         ************************ For Risk & Control Register Module. ******************************
         */
  

        it(("Check for insights in (Risk & Control Register)"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.verifyMenuKeywordAndLink(ERMMenu.withRM.riskAndControlRegister.riskInsights);
        })

        it("Check For Risk Register Under (Risk and Control Management)", () => {
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.verifyMenuKeywordAndLink(ERMMenu.withRM.riskAndControlRegister.riskRegister)
        })
  
        it("Check for Risk Taxanomies Under (Risk & Control Register / Administration)",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.clickAdministrationUnderParent()
            menu.verifyMenuUnderParentAdministration(ERMMenu.withRM.riskAndControlRegister.administration.riskTaxonomy)
        })
    
        it("Check for Control Taxonomy Under (Risk & Control Register / Administration)",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.clickAdministrationUnderParent()
            menu.verifyMenuUnderParentAdministration(ERMMenu.withRM.riskAndControlRegister.administration.controlTaxonomy)
        })
    
        it("Check for Risk Analysis Under (Risk & Control Register / Administration)",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.clickAdministrationUnderParent()
            menu.verifyMenuUnderParentAdministration(ERMMenu.withRM.riskAndControlRegister.administration.riskAnalysisDimensions)
        })
        
        it("Check for Event Types (Risk & Control Register / Administration)",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.clickAdministrationUnderParent()
            menu.verifyMenuUnderParentAdministration(ERMMenu.withRM.riskAndControlRegister.administration.eventType)
        })
     
        it("Check for Control Types Under (Risk & Control Register / Administration)",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.clickAdministrationUnderParent()
            menu.verifyMenuUnderParentAdministration(ERMMenu.withRM.riskAndControlRegister.administration.controlType)
        })
     
        it("Check for Risk Events Under (Risk & Control Register / Administration)",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.clickAdministrationUnderParent()
            menu.verifyMenuUnderParentAdministration(ERMMenu.withRM.riskAndControlRegister.administration.riskEvents)
        })
        
        it("Check for Default Assessments Under (Risk & Control Register / Administration)",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.clickAdministrationUnderParent()
            menu.verifyMenuUnderParentAdministration(ERMMenu.withRM.riskAndControlRegister.administration.defaultAssessments)
        })
        
        it("Check for Instruction Templates Under (Risk & Control Register / Administration)",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.clickAdministrationUnderParent()
            menu.verifyMenuUnderParentAdministration(ERMMenu.withRM.riskAndControlRegister.administration.instructionTemplate)
        })
   
        it("Check for Control Operations Under (Risk & Control Register / Administration)",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.clickAdministrationUnderParent()
            menu.verifyMenuUnderParentAdministration(ERMMenu.withRM.riskAndControlRegister.administration.controlOperations)
        })

        it("Check for Control Definition Categories Under (Risk & Control Register / Administration)",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.clickAdministrationUnderParent()
            menu.verifyMenuUnderParentAdministration(ERMMenu.withRM.riskAndControlRegister.administration.controlDefinitionCategories)
        })




        /**
         ************************ For KXI Management Module. ******************************
         */

        it(("Check for Define KXI in KXI Management"), ()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickKxiManagement()
            menu.verifyMenuKeywordAndLink(ERMMenu.withRM.kxiManagement.defineKxi);
        })
 
        it(("Check for Data in KXI Management"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickKxiManagement()
            menu.verifyMenuKeywordAndLink(ERMMenu.withRM.kxiManagement.data);
        })

        it(("Check for Insights in KXI Management"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickKxiManagement()
            menu.verifyMenuKeywordAndLink(ERMMenu.withRM.riskAndControlRegister.riskInsights);
        })

        it(("Check for Risk Appetite in KXI Management"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickKxiManagement()
            menu.verifyMenuKeywordAndLink(ERMMenu.withRM.kxiManagement.riskAppetite);
        })

        it("Check for KXI Category Under (KXI Management / Administration)",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickKxiManagement()
            menu.clickAdministrationUnderParent()
            menu.verifyMenuUnderParentAdministration(ERMMenu.withRM.kxiManagement.administration.kxiCategories)
        })


        /**
         ************************ For Administration Module. ******************************
         */
 
        it("Check for Peer Banks in Administration",()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            kxi.clickAdministration()
            menu.verifyinAdministration(ERMMenu.withRM.administration.peerBanks)
        })

        it(("Check For Location/Branches in Administration"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            kxi.clickAdministration()
            menu.verifyinAdministration(ERMMenu.withRM.administration.locationBranches)

        })

        it(("Check for Organizational Hierarchy in Administration"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            kxi.clickAdministration()
            menu.verifyinAdministration(ERMMenu.withRM.administration.orgHierarchy)

        })

        it(("Check for Roles in Administration"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            kxi.clickAdministration()
            menu.verifyinAdministration(ERMMenu.withRM.administration.roles)

        })

        it(("Check for User's group in Administration"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            kxi.clickAdministration()
            menu.verifyinAdministration(ERMMenu.withRM.administration.userGroups)

        })

        it(("Check for Users in Administration"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            kxi.clickAdministration()
            menu.verifyinAdministration(ERMMenu.withRM.administration.users)

        })


        it(("Check for Custom fields in Administration"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            kxi.clickAdministration()
            menu.verifyinAdministration(ERMMenu.withRM.administration.customFields)

        })

        it(("Check for Customer Profile in Administration"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            kxi.clickAdministration()
            menu.verifyinAdministration(ERMMenu.withRM.administration.customerProfile)

        })

        it(("Check for Business Areas in Administration"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            kxi.clickAdministration()
            menu.verifyinAdministration(ERMMenu.withRM.administration.businessAreas)

        })
 
    })


    //This context is used for verifying the new keywords are added in the breadcrumbs
    context(("Check for Breadcrumbs when Respective Screen is opened..."),()=>{

        beforeEach(()=>{
            sessionSetup()
        })


        /**
         ************************ For Risk & Control Register Module. ******************************
         */

        it(("Check for [Risk and Control Register - Insights]"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickRiskAndControlRegister()
            menu.verifyBreadcrumb(ERMMenu.withRM.riskAndControlRegister.riskInsights)

        })


        /**
         ************************ For KxI Management Module. ******************************
         */
        
        it(("Check for [KxI Management - Define KxIs Management]"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickKxiManagement()
            menu.verifyBreadcrumb(ERMMenu.withRM.kxiManagement.defineKxi)

        })


        it(("Check for [KxI Management - Data Management]"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickKxiManagement()
            menu.verifyBreadcrumb(ERMMenu.withRM.kxiManagement.data)

        })

        it(("Check for [Risk and Control Register - Insights]"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickKxiManagement()
            menu.verifyBreadcrumb(ERMMenu.withRM.riskAndControlRegister.riskInsights)

        })

        it(("Check for [KxI Management - Risk Appetite]"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickKxiManagement()
            menu.verifyBreadcrumb(ERMMenu.withRM.kxiManagement.riskAppetite)

        })


        it(("Check for [KxI Management - Administration - KxI Categories]"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            menu.clickKxiManagement()
            menu.clickAdministrationUnderParent()
            menu.verifyBreadcrumbUnderParentAdministration(ERMMenu.withRM.kxiManagement.administration.kxiCategories)

        })


        /**
         ************************ For Administration Module. ******************************
         */


        it(("Check for [Administration - Peer Banks]"),()=>{
            cy.visitProfile()
            kxi.clickLeftMenu()
            kxi.clickAdministration()
            menu.verifyBreadcrumb(ERMMenu.withRM.administration.peerBanks)
        })  


    })

})
   