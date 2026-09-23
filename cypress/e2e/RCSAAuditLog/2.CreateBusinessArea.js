import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import Business_Area_PO from "../../support/POM/STARTRCSA_PO/Business_Area_PO";

/// <reference types= "cypress" />


const Business_Area = require('../../fixtures/RCSAAuditLog/BusinessArea.json')


//Data Provider ///
before(function () {  
    cy.fixture('RCSA Audit Log/_write_business_unit.json').then(function (data) {
        global.data = data;

    });

});

describe("Add Business Area category 1, Add Business Area category 2, Add Business Area Defination, Linked Business Area Def with Cat 1 and Cat 2, Add Business Area, Linked Single ROC BU with BA, Linked Group ROC BU with BA", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const business_Area_PO = new Business_Area_PO();

   
    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();
    })

     /////*****Business Area - Linked with Single ROC BU */
    Business_Area.forEach(test => {
        it(test.BusinessAreaSingle, () => {

            //login
            cy.log(Cypress.env("rcsa_username"),Cypress.env("rcsa_password"),Cypress.env("rcsa_key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"),Cypress.env("rcsa_password"),Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();
            predictMenu_PO.menuClick();
            predictMenu_PO.administrationModuleClickupdate();
            predictMenu_PO.BusinessAreaClick();
            //Business Area First Tab
            business_Area_PO.BusinessAreaCat1Addbtn();
            business_Area_PO.BusinessAreaCat1NameField();
            //Business Area Second Tab
            business_Area_PO.BusinessAreaCat2redirection();
            business_Area_PO.BusinessAreaCat2Addbtn();
            business_Area_PO.BusinessAreaCat2NameField();
            //Business Area Third Tab 
            business_Area_PO.BusinessAreaCat3redirection();
            business_Area_PO.BusinessAreaCat3Addbtn();
            business_Area_PO.BusinessAreaCat3NameField(test.BusinessAreaDefSingle);
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
            business_Area_PO.BusinessAreaCat1dropdown();
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
            business_Area_PO.BusinessAreaCat2dropdown();
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
            //Business Area Fourth Tab
            business_Area_PO.BusinessAreasredirection();
            business_Area_PO.BusinessAreasAddbtn();
            business_Area_PO.BusinessAreaCat3NameField(test.BusinessAreaSingle);
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
            business_Area_PO.BusinessUnitdropdown(test.SingleBU);
            business_Area_PO.BusinessAreaCat1dropdownlattab();
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
            business_Area_PO.BusinessAreaCat2dropdownlattab();
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
        })

    })

     /////*****Business Area - Linked with Group ROC BU */
    Business_Area.forEach(test => {
        it(test.BusinessAreaGroup, () => {

            //login
            cy.log(Cypress.env("rcsa_username"),Cypress.env("rcsa_password"),Cypress.env("rcsa_key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"),Cypress.env("rcsa_password"),Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();
            predictMenu_PO.menuClick();
            predictMenu_PO.administrationModuleClickupdate();
            predictMenu_PO.BusinessAreaClick();
            //Business Area First Tab
            business_Area_PO.BusinessAreaCat1Addbtn();
            business_Area_PO.BusinessAreaCat1NameField();
            //Business Area Second Tab
            business_Area_PO.BusinessAreaCat2redirection();
            business_Area_PO.BusinessAreaCat2Addbtn();
            business_Area_PO.BusinessAreaCat2NameField();
            //Business Area Third Tab 
            business_Area_PO.BusinessAreaCat3redirection();
            business_Area_PO.BusinessAreaCat3Addbtn();
            business_Area_PO.BusinessAreaCat3NameField(test.BusinessAreaDefGroup);
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
            business_Area_PO.BusinessAreaCat1dropdown();
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
            business_Area_PO.BusinessAreaCat2dropdown();
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
            //Business Area Fourth Tab
            business_Area_PO.BusinessAreasredirection();
            business_Area_PO.BusinessAreasAddbtn();
            business_Area_PO.BusinessAreaCat3NameField(test.BusinessAreaGroup);
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
            business_Area_PO.BusinessUnitdropdownGroup(test.GroupBU);
            business_Area_PO.BusinessAreaCat1dropdownlattab();
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
            business_Area_PO.BusinessAreaCat2dropdownlattab();
            business_Area_PO.ValidateBusinessAreaCatToasterMessage();
        })

    })

})           