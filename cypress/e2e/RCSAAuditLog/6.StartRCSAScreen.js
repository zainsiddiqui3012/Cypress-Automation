import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO.js";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO.js";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO.js";
import Start_RCSA_PO from "../../support/POM/STARTRCSA_PO/Start_RCSA_PO.js";

/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />

////Data Provider ///
const RCSA_Process = require("../../fixtures/RCSAAuditLog/StartRCSAScreen.json");

describe("Start RCSA Process with the selection of Multiple Business Unit, Start RCSA Process with the selection of Multiple Business Area, Start RCSA Process with Multiple Business Area Def, Start RCSA Process with Business Area Def RD, Mark Applicabilty, Progress Field Validation, Close RCSA Process", () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const riskRegister_PO = new RiskRegister_PO();
  // const start_RCSA_PO = new Start_RCSA_PO();
  const start_RCSA_PO = new Start_RCSA_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  /////*****Start RCSA Screen - Validate Clear Button Functionality */
  RCSA_Process.forEach((test) => {
    it(test.ClearButtonFunctionality, () => {
      //Login Details
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300);
      riskRegister_PO.threeEllipsisMenu();
      start_RCSA_PO.startrcsaflyer();
      start_RCSA_PO.assertmodalTitle();
      start_RCSA_PO.assertmodalclearbtnfunctionality();
    });
  });

  /////*****Start RCSA Screen - Validate Close Button Functionality */
  RCSA_Process.forEach((test) => {
    it(test.CloseButtonFunctionality, () => {
      //Login Details
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300);
      riskRegister_PO.threeEllipsisMenu();
      start_RCSA_PO.startrcsaflyer();
      start_RCSA_PO.assertmodalclosebtnfunctionality();
    });
  });

  /////*****Start RCSA Screen - Select Duedate from Calendar and Input Duedate*/
  RCSA_Process.forEach((test) => {
    it(test.DuedateFieldSelectionFromBothCalendarAndInputField, () => {
      //Login Details
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300);
      riskRegister_PO.threeEllipsisMenu();
      start_RCSA_PO.startrcsaflyer();
      start_RCSA_PO.assertmodalTitle();
      start_RCSA_PO.selectdatefrombothinputfield();
    });
  });

  /////*****Start RCSA Screen - Validate Duedate Shouldn't past date*/
  RCSA_Process.forEach((test) => {
    it(test.AssertOldDateSelection, () => {
      //Login Details
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300);
      riskRegister_PO.threeEllipsisMenu();
      start_RCSA_PO.startrcsaflyer();
      start_RCSA_PO.assertmodalTitle();
      start_RCSA_PO.assertduedatebyselectingolddate();
    });
  });

  /////*****To check the RCSA Process Should Start with MultiSelect Business Unit*/
  RCSA_Process.forEach((test) => {
    it(test.RCSAProcessFromMultiSelectBusinessUnit, () => {
      //Login Details
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300);
      riskRegister_PO.threeEllipsisMenu();
      start_RCSA_PO.startrcsaflyer();
      start_RCSA_PO.assertmodalTitle();
      start_RCSA_PO.selectdatefrombothinputfield();
      start_RCSA_PO.BusinessUnit_MultiSelect(
        test.BusinessUnit01,
        test.BusinessUnit02
      );
      start_RCSA_PO.RCSA_Popup_Save_btn();
    });
  });
  /////*****Validate the selection criteria on parent ticket*/
  RCSA_Process.forEach((test) => {
    it(test.ParentTicketValidationCreatedwithMultipleBusiness, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.selectParentTicket();
      start_RCSA_PO.ParentAndChildTicketValidation(
        test.Summary,
        test.AssertBusinessUnit01,
        test.AssertBusinessUnit02,
        test.RCSAReviewAuditLogLinkVerification,
        test.ReviewBusinessUnitRisksLinkVerification,
        test.SubTasks01,
        test.SubTasks02,
        test.ParentAssignee,
        test.Reporter,
        test.initialProgress
      );
    });
  });

  /////*****Validate the selection criteria on First Child ticket*/
  RCSA_Process.forEach((test) => {
    it(test.FirstChildTicketValidationCreatedwithBusinessUnit, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.SelectFirstChildTicket();
      start_RCSA_PO.FirstChildTicketValidation(
        test.FirstChildSummary,
        test.AssertBusinessUnit01,
        test.ReviewBusinessUnitRisksLinkVerification,
        test.Assignee,
        test.Reporter,
        test.initialProgress
      );
    });
  });
  /////*****Validate the selection criteria on Second Child ticket*/
  RCSA_Process.forEach((test) => {
    it(test.SecondChildTicketValidationCreatedwithBusinessUnit, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.SelectSecondChildTicket();
      start_RCSA_PO.SecondChildTicketValidation(
        test.SecondChildSummary,
        test.AssertBusinessUnit02,
        test.ReviewBusinessUnitRisksLinkVerification,
        test.Assignee,
        test.Reporter,
        test.initialProgress
      );
    });
  });

  /////*****To check the RCSA Process Should Start with MultiSelect Business Area*/
  RCSA_Process.forEach((test) => {
    it(test.RCSAProcessFromMultiSelectBusinessArea, () => {
      //Login Details
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300);
      riskRegister_PO.threeEllipsisMenu();
      start_RCSA_PO.startrcsaflyer();
      start_RCSA_PO.assertmodalTitle();
      start_RCSA_PO.selectdatefrombothinputfield();
      start_RCSA_PO.BusinessArea_MultiSelect(
        test.BusinessArea01,
        test.BusinessArea02
      );
      start_RCSA_PO.RCSA_Popup_Save_btn();
    });
  });

  /////*****Validate the selection criteria on parent ticket*/
  RCSA_Process.forEach((test) => {
    it(test.validateBAParentTicket, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.selectParentTicket();
      start_RCSA_PO.ParentAndChildTicketValidation(
        test.Summary,
        test.AssertBusinessUnit01,
        test.AssertBusinessUnit02,
        test.RCSAReviewAuditLogLinkVerification,
        test.ReviewBusinessUnitRisksLinkVerification,
        test.SubTasks01,
        test.SubTasks02,
        test.ParentAssignee,
        test.Reporter,
        test.initialProgress
      );
      start_RCSA_PO.ValidateRiskSelectionCriteria(test.BARiskSelectionCriteria);
    });
  });

  /////*****Validate the selection criteria on First Child ticket*/
  RCSA_Process.forEach((test) => {
    it(test.validateBAFirstChildTicket, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.SelectFirstChildTicket();
      start_RCSA_PO.FirstChildTicketValidation(
        test.FirstChildSummary,
        test.AssertBusinessUnit01,
        test.ReviewBusinessUnitRisksLinkVerification,
        test.Assignee,
        test.Reporter,
        test.initialProgress
      );
    });
  });
  /////*****Validate the selection criteria on Second Child ticket*/
  RCSA_Process.forEach((test) => {
    it(test.validateBASecondChildTicket, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.SelectSecondChildTicket();
      start_RCSA_PO.SecondChildTicketValidation(
        test.SecondChildSummary,
        test.AssertBusinessUnit02,
        test.ReviewBusinessUnitRisksLinkVerification,
        test.Assignee,
        test.Reporter,
        test.initialProgress
      );
    });
  });

  /////*****To check the RCSA Process Should Start with MultiSelect Business Area Defination*/
  RCSA_Process.forEach((test) => {
    it(test.RCSAProcessFromMultiSelectBusinessAreaDefination, () => {
      //Login Details
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300);
      riskRegister_PO.threeEllipsisMenu();
      start_RCSA_PO.startrcsaflyer();
      start_RCSA_PO.assertmodalTitle();
      start_RCSA_PO.selectdatefrombothinputfield();
      start_RCSA_PO.BusinessAreaDef_MultiSelect(
        test.BusinessAreaDefination01,
        test.BusinessAreaDefination02
      );
      start_RCSA_PO.RCSA_Popup_Save_btn();
    });
  });

  /////*****Validate the selection criteria on Parent ticket*/
  RCSA_Process.forEach((test) => {
    it(test.validateBADParentTicket, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.selectParentTicket();
      start_RCSA_PO.ParentAndChildTicketValidation(
        test.Summary,
        test.AssertBusinessUnit01,
        test.AssertBusinessUnit02,
        test.RCSAReviewAuditLogLinkVerification,
        test.ReviewBusinessUnitRisksLinkVerification,
        test.SubTasks01,
        test.SubTasks02,
        test.ParentAssignee,
        test.Reporter,
        test.initialProgress
      );
      start_RCSA_PO.ValidateRiskSelectionCriteria(
        test.BADRiskSelectionCriteria
      );
    });
  });

  /////*****Validate the selection criteria on First Child ticket*/
  RCSA_Process.forEach((test) => {
    it(test.validateBADFirstChildTicket, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.SelectFirstChildTicket();
      start_RCSA_PO.FirstChildTicketValidation(
        test.FirstChildSummary,
        test.AssertBusinessUnit01,
        test.ReviewBusinessUnitRisksLinkVerification,
        test.Assignee,
        test.Reporter,
        test.initialProgress
      );
    });
  });

  /////*****Validate the selection criteria on Second Child ticket*/
  RCSA_Process.forEach((test) => {
    it(test.validateBADSecondChildTicket, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.SelectSecondChildTicket();
      start_RCSA_PO.SecondChildTicketValidation(
        test.SecondChildSummary,
        test.AssertBusinessUnit02,
        test.ReviewBusinessUnitRisksLinkVerification,
        test.Assignee,
        test.Reporter,
        test.initialProgress
      );
    });
  });

  /////*****To check the RCSA Process Should Start with MultiSelect Business Area Defination RD*/
  RCSA_Process.forEach((test) => {
    it(test.RCSAProcessFromMultiSelectBusinessAreaDefinationRD, () => {
      //Login Details
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300);
      riskRegister_PO.threeEllipsisMenu();
      start_RCSA_PO.startrcsaflyer();
      start_RCSA_PO.assertmodalTitle();
      start_RCSA_PO.selectdatefrombothinputfield();
      start_RCSA_PO.BusinessAreaDef_MultiSelectRD(
        test.BusinessAreaDefinationRD01,
        test.BusinessAreaDefinationRD02
      );
      start_RCSA_PO.RCSA_Popup_Save_btn();
    });
  });

  /////*****Validate the selection criteria on First Child ticket*/
  RCSA_Process.forEach((test) => {
    it(test.RCSAProcessFromMultiSelectBusinessUnit, () => {
      //Login Details
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300);
      riskRegister_PO.threeEllipsisMenu();
      start_RCSA_PO.startrcsaflyer();
      start_RCSA_PO.assertmodalTitle();
      start_RCSA_PO.selectdatefrombothinputfield();
      start_RCSA_PO.BusinessUnit_MultiSelect(
        test.BusinessUnit01,
        test.BusinessUnit02
      );
      start_RCSA_PO.RCSA_Popup_Save_btn();
    });
  });

  /////*****Risk Register - Mark Review*/
  RCSA_Process.forEach((test) => {
    it(test.MarkReview, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.SelectSecondChildTicket();
      start_RCSA_PO.MarkReviewOnParentANDChildTicket();
    });
  });
  /////*****Risk Register - Close RCSA Process*/
  RCSA_Process.forEach((test) => {
    it(test.CloseTicket, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.SelectSecondChildTicket();
      start_RCSA_PO.CloseRCSAProcessFromThressElipses();
    });
  });
  /////*****To check the RCSA Process Should Start with MultiSelect Business Unit*/
  RCSA_Process.forEach((test) => {
    it(test.RCSAProcessFromMultiSelectBusinessUnit, () => {
      //Login Details
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300);
      riskRegister_PO.threeEllipsisMenu();
      start_RCSA_PO.startrcsaflyer();
      start_RCSA_PO.assertmodalTitle();
      start_RCSA_PO.selectdatefrombothinputfield();
      start_RCSA_PO.BusinessUnit_MultiSelect(
        test.BusinessUnit01,
        test.BusinessUnit02
      );
      start_RCSA_PO.RCSA_Popup_Save_btn();
    });
  });
  /////*****Risk Register - Mark Review*/
  RCSA_Process.forEach((test) => {
    it(test.MarkReview, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.SelectSecondChildTicket();
      start_RCSA_PO.MarkReviewOnParentANDChildTicket();
    });
  });

  /////*****Risk Register - Close RCSA Process*/
  RCSA_Process.forEach((test) => {
    it(test.CloseRCSA, () => {
      cy.log(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("rcsa_username"),
        Cypress.env("rcsa_password"),
        Cypress.env("rcsa_key")
      );
      loginDetails_PO.clickOn_LoginButton();
      predictMenu_PO.menuClick();
      predictMenu_PO.activitiesAndTasksClick();
      predictMenu_PO.cmsAdministrationModuleClick();
      start_RCSA_PO.ClickOnAdvanceSearch();
      start_RCSA_PO.SelectSecondChildTicket();
      start_RCSA_PO.closeRCSAPercentagevaldation(test.Finalprogress);
    });
  });
});
