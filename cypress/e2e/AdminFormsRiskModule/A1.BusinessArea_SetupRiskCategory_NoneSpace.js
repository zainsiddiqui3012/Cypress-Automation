
import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskLibraries_BusinessArea_PO from "../../support/POM/RiskModule_PO/riskLibraries_BusinessArea_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";

/// <reference types= "cypress" />
////Data Provider ///
const riskCategory = require('../../fixtures/RiskModule/NoneSpaceRiskTaxomony/riskCategory.json')

before(function () {

    cy.fixture('RiskModule/NoneSpaceRiskTaxomony/RiskTaxomomy.json').then(function (data) {
        global.data = data;
    })
})


describe("Risk Libraries BusinessArea Data Setup of Risk Category frome None Space", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskLibraries_BusinessArea_PO = new RiskLibraries_BusinessArea_PO();
    const riskCategory_PO = new RiskCategory_PO();
    const noneUser = Cypress.env("USER").NONE

    riskCategory.forEach(test => {
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
            riskCategory_PO.addCategoryButtonNoneSpace();
            riskCategory_PO.addCategoryInfoNoneSpace(test.riskCategoryID, test.riskName, test.description);


        })
    })

})





