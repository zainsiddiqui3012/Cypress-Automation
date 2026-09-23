import locators from "../../../fixtures/locators.json"
import KXIBrandingLogo from "../../../fixtures/UserProfile/KXIBrandingLogo.json"


export class brandingLogo{

    /*Check for BrandingLogo 'src' attribute value it has Parameter which will give the key name to
    get the exact value from KXIBrandingLogo.json*/
    checkForBrandingLogo(Param){
        cy.get(locators.kxi.brandingLogo)
        .should('be.visible')
        .should('have.attr','src',KXIBrandingLogo.logo[Param])
    }

}