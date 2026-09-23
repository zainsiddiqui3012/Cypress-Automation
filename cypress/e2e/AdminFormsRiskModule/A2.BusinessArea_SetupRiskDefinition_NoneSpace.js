
import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskLibraries_BusinessArea_PO from "../../support/POM/RiskModule_PO/riskLibraries_BusinessArea_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../support/POM/RiskModule_PO/RiskDefinition_PO";

/// <reference types= "cypress" />
////Data Provider ///
const riskDefinition = require('../../fixtures/RiskModule/NoneSpaceRiskTaxomony/riskDefinition.json')
const noneUser = Cypress.env("USER").NONE
//Data Provider ///
before(function () {
    cy.fixture('RiskModule/NoneSpaceRiskTaxomony/_Writefile_RiskCategoryNoneSpace.json').then(function (rc) {
        global.rc = rc;
    })
    cy.fixture('RiskModule/NoneSpaceRiskTaxomony/RiskTaxomomy.json').then(function (data) {
        global.data = data;
    })
    
})

describe("Risk Libraries BusinessArea Data Setup of Risk Definition frome None Space", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskLibraries_BusinessArea_PO = new RiskLibraries_BusinessArea_PO();
    const riskCategory_PO = new RiskCategory_PO();
    const riskDefinition_PO = new RiskDefinition_PO();


    riskDefinition.forEach(test => {
        it(test.name, () => {
            //Login Details
            cy.log(noneUser.USER_NAME, noneUser.PASSWORD, noneUser.KEY);
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(noneUser.USER_NAME, noneUser.PASSWORD, noneUser.KEY);
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClickNoneSpace();
            riskLibraries_BusinessArea_PO.riskTaxomomySearch(data.RiskTaxomomy);
            riskDefinition_PO.addDefinitionButtonNoneSpace();
            riskDefinition_PO.addDefinitionInfoNoneSpace(test.riskDefinitionId, test.definitionName, test.description, test.BusinessAreaDefinition);


        })

        it("Add Definition Successfully from None Space without Business Area", () => {
            //Login Details
            cy.log(noneUser.USER_NAME, noneUser.PASSWORD, noneUser.KEY);
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(noneUser.USER_NAME, noneUser.PASSWORD, noneUser.KEY);
            loginDetails_PO.clickOn_LoginButton();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClickNoneSpace();
            riskLibraries_BusinessArea_PO.riskTaxomomySearch(data.RiskTaxomomy);
            riskDefinition_PO.addDefinitionButtonNoneSpace();
            riskDefinition_PO.addDefinitionInfoNoneSpaceWithBA(test.riskDefinitionId, test.definitionName, test.description);

        })
    })

})



