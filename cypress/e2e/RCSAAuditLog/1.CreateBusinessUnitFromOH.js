import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import Business_Unit_PO from "../../support/POM/STARTRCSA_PO/Business_Unit_PO";


/// <reference types= "cypress" />


const BusinessUnit = require('../../fixtures/RCSAAuditLog/BusinessUnit.json')


describe("Add Business Unit, Set as Business Unit, Search Business Unit, Add Business unit with single user ROC, Add Business Unit with group user ROC, Set N/A ROC, Add BU with Risk Executive both single and group, Add BU with Process Owner both Single and group", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const business_Unit_PO = new Business_Unit_PO();



    before(function () {
        cy.fixture('RCSAAuditLog/_write_business_unit.json').then(function (data) {
            global.data = data;

        });

    });

    /////*****Business Unit - Add BU for Single ROC */   
    BusinessUnit.forEach(test => {
        it(test.CreateSingleBU, () => {

            //login
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();
            cy.visitOrganizationalHierarchy();
            business_Unit_PO.OrganinzationHierarchyaddBtn();
            const savedBusinessUnitValue = business_Unit_PO.CreateBU(test.SetSingleROC);
            cy.log('Saved Business Unit Value:', savedBusinessUnitValue);
            business_Unit_PO.submitbuform();
        })

    })

    /////*****Business Unit - Set Single ROC */
    BusinessUnit.forEach(test => {
        it(test.SetSingleROC, () => {
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();
            cy.visitOrganizationalHierarchy();
            business_Unit_PO.OrganinzationHierarchyaddBtn();
            const savedBusinessUnitValue = business_Unit_PO.CreateBU(test.SetSingleROC);
            cy.log('Saved Business Unit Value:', savedBusinessUnitValue);
            business_Unit_PO.submitbuform();
            business_Unit_PO.BU_Modal_close();
            business_Unit_PO.BU_Reopen_AND_SelectROCSingle(savedBusinessUnitValue);
            business_Unit_PO.BU_Update();
        })

    })

    /////*****Business Unit - Add BU for Group ROC */   
    BusinessUnit.forEach(test => {
        it(test.CreateGroupBU, () => {
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();
            cy.visitOrganizationalHierarchy();
            business_Unit_PO.OrganinzationHierarchyaddBtn();
            business_Unit_PO.CreateBU(test.SetGroupROC);
            business_Unit_PO.submitbuform();
        })
    })

    /////*****Business Unit - Set Group ROC */
    BusinessUnit.forEach(test => {
        it(test.SetGroupROC, () => {
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();
            cy.visitOrganizationalHierarchy();
            business_Unit_PO.OrganinzationHierarchyaddBtn();
            const savedBusinessUnitValue = business_Unit_PO.CreateBU(test.SetGroupROC);
            cy.log('Saved Business Unit Value:', savedBusinessUnitValue);
            business_Unit_PO.submitbuform();
            business_Unit_PO.BU_Modal_close();
            business_Unit_PO.BU_Reopen_AND_SelectROC_Group(savedBusinessUnitValue);
            business_Unit_PO.BU_Update();
        })
    })

    /////*****Business Unit - Add BU for N/A ROC */
    BusinessUnit.forEach(test => {
        it(test.CreateNABU, () => {
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();
            cy.visitOrganizationalHierarchy();
            business_Unit_PO.OrganinzationHierarchyaddBtn();
            business_Unit_PO.CreateBU(test.SetNAROC);
            business_Unit_PO.submitbuform();
        })
    })

    /////*****Business Unit - Set BU for N/A ROC */
    BusinessUnit.forEach(test => {
        it(test.SetNAROC, () => {
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();
            cy.visitOrganizationalHierarchy();
            business_Unit_PO.OrganinzationHierarchyaddBtn();
            const savedBusinessUnitValue = business_Unit_PO.CreateBU(test.SetNAROC);
            cy.log('Saved Business Unit Value:', savedBusinessUnitValue);
            business_Unit_PO.submitbuform();
            business_Unit_PO.BU_Modal_close();
            business_Unit_PO.BU_Reopen_AND_SelectROC_NA(savedBusinessUnitValue);
            business_Unit_PO.BU_Update();

        })
    })
})





