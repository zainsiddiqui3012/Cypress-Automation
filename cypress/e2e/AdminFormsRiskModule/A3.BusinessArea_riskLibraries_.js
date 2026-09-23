import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskLibraries_BusinessArea_PO from "../../support/POM/RiskModule_PO/riskLibraries_BusinessArea_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";

/// <reference types= "cypress" />
////Data Provider ///
const businessAreaGridColSearchable = require('../../fixtures/RiskModule/Business Area/businessAreaGridColSearchable.json')
const ContentLibrariesDropdown = require('../../fixtures/RiskModule/Business Area/ContentLibrariesDropdown.json')
const BAVerifyagGridGroupData = require('../../fixtures/RiskModule/Business Area/BAVerifyagGridGroupData.json')

const loginDetails_PO = new LoginDetails_PO();
const predictMenu_PO = new PredictMenu_PO();
const riskLibraries_BusinessArea_PO = new RiskLibraries_BusinessArea_PO();

before(function () {

    cy.fixture('RiskModule/NoneSpaceRiskTaxomony/RiskTaxomomy.json').then(function (data) {
        global.data = data;
    })
    cy.fixture('RiskModule/NoneSpaceRiskTaxomony/_Writefile_RiskDefinitionNoneSpaceUncategorized.json').then(function (rd) {
        global.rd = rd;
    })
    cy.fixture('RiskModule/NoneSpaceRiskTaxomony/_Writefile_RiskDefinitionNoneSpace.json').then(function (rdc) {
        global.rdc = rdc;
    })
    cy.fixture('RiskModule/NoneSpaceRiskTaxomony/_Writefile_RiskCategoryNoneSpace.json').then(function (rc) {
        global.rc = rc;
    })

    cy.fixture('RiskModule/NoneSpaceRiskTaxomony/_Writefile_RiskCategoryNoneSpace.json').then(function (rc) {
        global.rc = rc;
    })

})

describe("Business Toggle: Verify if no business area definitions are not attached to risk definitions, then such risk definitions should be shown in the category named uncategorized which will be showing on the top of grid", () => {

    ContentLibrariesDropdown.forEach(test => {
        it("Verify these columns will be shown on the business area toggle when risk library tab is selected group, name, risk category, controls, mapping, status", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            predictMenu_PO.riskLibrariesTab();
            riskLibraries_BusinessArea_PO.businessAreaToggleClick();
            riskLibraries_BusinessArea_PO.contentlibDropdown(test.ContentLibrary);
            riskLibraries_BusinessArea_PO.clickOnRestoreDefaultLayout();
            riskLibraries_BusinessArea_PO.businessAreaGridColVerify();
        })

        it("Verify if no business area definitions are not attached to risk definitions, then such risk definitions should be shown in the category named uncategorized which will be showing on the top of grid", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            predictMenu_PO.riskLibrariesTab();
            riskLibraries_BusinessArea_PO.businessAreaToggleClick();
            riskLibraries_BusinessArea_PO.contentlibDropdown(test.ContentLibrary);
            riskLibraries_BusinessArea_PO.searchNameRiskLibrariesGrid(rd.RiskDefinitionSearchUncategorized);
            riskLibraries_BusinessArea_PO.verifyagGridData(rd.RiskDefinitionSearchUncategorized);
            riskLibraries_BusinessArea_PO.agGridIconOpen();
        })

    })
});

describe("Business Toggle: Verify in group column data will be displayed in hierarchy BA-Type > BA Category 1 > BA Category 2. This grouping of data will be shown on grid when any business are definition is linked with business area category", () => {

    BAVerifyagGridGroupData.forEach(test => {
        it("Verify in group column data will be displayed in hierarchy BA-Type > BA Category 1 > BA Category 2. This grouping of data will be shown on grid when any business are definition is linked with business area category", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            predictMenu_PO.riskLibrariesTab();
            riskLibraries_BusinessArea_PO.businessAreaToggleClick();
            riskLibraries_BusinessArea_PO.searchRiskLibrariesGrid(rdc.RiskDefinitionSearch);
            riskLibraries_BusinessArea_PO.agGridGroupIconExpend();
            riskLibraries_BusinessArea_PO.verifyagGridGroupData(test.Type, test.Cat1, test.Cat2, rdc.RiskDefinitionSearch);
        })

    })

});

//This test is skipped because it is not applicable for the current implementation
describe.skip("Business Toggle: Verify If no controls are attached with content library then controls column will be blank", () => {

    it("Verify If no controls are attached with content library then controls column will be blank", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        predictMenu_PO.riskLibrariesTab();
        riskLibraries_BusinessArea_PO.businessAreaToggleClick();
        riskLibraries_BusinessArea_PO.searchRiskLibrariesGrid(rdc.RiskDefinitionSearch);
        riskLibraries_BusinessArea_PO.agGridGroupIconExpend();
        riskLibraries_BusinessArea_PO.noControlsAttachedWithContentLibrary();

    })
});

describe("Business Toggle: Verify name, risk category, controls, mapped to my taxonomy in the grid should be searchable.", () => {

    businessAreaGridColSearchable.forEach(test => {
        it("Verify name, risk category, controls, mapped to my taxonomy in the grid should be searchable.", () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskTaxonomyClick();
            predictMenu_PO.riskLibrariesTab();
            riskLibraries_BusinessArea_PO.businessAreaToggleClick();
            riskLibraries_BusinessArea_PO.contentlibDropdown(test.ContentLibrary);
            riskLibraries_BusinessArea_PO.businessAreaGridColSearchable(rd.RiskDefinitionSearchUncategorized, rc.RiskCategorySearch, test.MappedtoMyTaxonomy, test.Controls);

        })

    })

});

describe("Business Toggle: Verify that grid will have columns and filter options on the left side of the grid", () => {

    it("Verify that grid will have columns and filter options on the left side of the grid", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        predictMenu_PO.riskLibrariesTab();
        riskLibraries_BusinessArea_PO.businessAreaToggleClick();
        riskLibraries_BusinessArea_PO.gridColumnsOption();
        riskLibraries_BusinessArea_PO.GridfiltersOption();

    })

});

describe("Business Toggle: Verify when BA toggle is selected, check boxes should be shown on the grid in order to select single or multiple risk categories or select all at once.", () => {

    it("Verify when BA toggle is selected, check boxes should be shown on the grid in order to select single or multiple risk categories or select all at once.", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        predictMenu_PO.riskLibrariesTab();
        riskLibraries_BusinessArea_PO.businessAreaToggleClick();
        riskLibraries_BusinessArea_PO.searchRiskLibrariesGrid(rdc.RiskDefinitionSearch);
        riskLibraries_BusinessArea_PO.agGridGroupIconExpend();
        riskLibraries_BusinessArea_PO.checkBoxGridSelectionOfGroup();
        riskLibraries_BusinessArea_PO.checkBoxGridSelectionOfSingle();
        riskLibraries_BusinessArea_PO.checkBoxGridSelectionOfMultiple(rdc.RiskDefinitionSearch);

    })
});
describe("Business Toggle: Ensure that the selected risk categories/definitions are moved successfully to my taxonomy tab", () => {

    it("Ensure that the selected risk categories/definitions are moved successfully to my taxonomy tab", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        predictMenu_PO.riskLibrariesTab();
        riskLibraries_BusinessArea_PO.businessAreaToggleClick();
        riskLibraries_BusinessArea_PO.searchRiskLibrariesGrid(rdc.RiskDefinitionSearch);
        riskLibraries_BusinessArea_PO.agGridGroupIconExpend();
        riskLibraries_BusinessArea_PO.moveCategoryDefinition(rdc.RiskDefinitionSearch);
        predictMenu_PO.riskLibrariesTab();
        riskLibraries_BusinessArea_PO.businessAreaToggleClick();
        // riskLibraries_BusinessArea_PO.agGridGroupClosedExpend(rdc.RiskDefinitionSearch);

    })
});

describe("Business Toggle: Verify that in the risk category column it will show associated risk category of risk definition. If one BA definition is linked with multiple risk definitions, then risk categories will be shown concatenated separated by comma separated values.", () => {

    it("Verify that in the risk category column it will show associated risk category of risk definition. If one BA definition is linked with multiple risk definitions, then risk categories will be shown concatenated separated by comma separated values.", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskTaxonomyClick();
        predictMenu_PO.riskLibrariesTab();
        riskLibraries_BusinessArea_PO.businessAreaToggleClick();
        riskLibraries_BusinessArea_PO.searchRiskLibrariesGrid(rdc.RiskDefinitionSearch);
        riskLibraries_BusinessArea_PO.agGridGroupIconExpend();
        riskLibraries_BusinessArea_PO.verifyRiskCategoryCommaSeparated_BA(rc.RiskCategorySearch)
        riskLibraries_BusinessArea_PO.agGridGroupClosedExpend(rdc.RiskDefinitionSearch);
        riskLibraries_BusinessArea_PO.clearSearchNameRiskLibrariesGrid();


    })
});
