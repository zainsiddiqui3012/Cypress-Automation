//****** "Created by Owais Khan on 3 June 2022  */
////***** Run all tests of Predict360 application. */

import { defineConfig } from "cypress";
import mysql = require("cypress-mysql");
const { removeDirectory } = require("cypress-delete-downloads-folder");

export default defineConfig({
  // extends: './cypress.json',

  env: {
    //////#########Environment Credentials##########////////////////
    username: "automation.user",
    password: "Test@1234",
    key: "auto",
    USER_ID: 33448,
    NAME: "Automation User",

    // #### QA URLs ####
    CONTROL_TYPES:
      "https://qa.360factors.com/predict360/manageControlType.do?method=listControlTypes",

    ////######Risk user feature Controls#######//////
    username1: "automation.fuser",
    password1: "Test@1234",
    key1: "autof",
    ////#### KXI User : Kxi Manager
    kxiusername: "axuser01",
    kxipassword: "Test@123",
    kxikey: "AXIO",

    ////###### CMS users #######//////
    bcususername: "cmsautomationuser001",
    bcuspassword: "Test12345",
    bcuskey: "bcus",

    ////######Risk user: Feture off : Manage Detailed Controls and Use Assessments to Calculate Inherent Risk  #######//////
    username2: "automation.user01",
    password2: "Test@1234",
    key2: "ACT",

    // CMS Automation User
    cms_auto_username: "cmsautomationuser001",
    cms_auto_password: "Test12345",
    cms_auto_customerKey: "bcus",

    ////######Risk user: Feture off : Use Control Strength to calculate Residual Risk and Manage Detailed Controls#######//////
    username3: "automation.user02",
    password3: "Test@1234",
    key3: "autoact",
    kxi: {
      kxiusername: "autouser",
      kxipassword: "Test@123",
      kxikey: "TEED",
    },

    ////######Issue Management Decisions #######//////
    issueUsername: "autotest.user",
    issuePassword: "Test@123",
    issueKey: "IDT",

    ISSUE_USER: {
      USERNAME: "zahidqurat",
      PASSWORD: "Admin@123",
      KEY: "DDEV",
    },
    ISSUE_USER1: {
      USERNAME: "qa.testing01",
      PASSWORD: "Test@123",
      KEY: "ewbqa",
    },

    REG_CHANGE_V2: {
      RESELLER: {
        USERNAME: "resel.reg",
        PASSWORD: "Test@123",
        KEY: "resel",
      },
      CUSTOMER: {
        USERNAME: "regv2.user",
        PASSWORD: "Test@123",
        KEY: "reg",
      },
      CUSTOMER2: {
        USERNAME: "fnba.admin",
        PASSWORD: "Bankbank123!!!",
        KEY: "fnba",
      },
    },

    NONE_USER: {
      USER_NAME: "automation@none",
      PASSWORD: "Test@123456",
      KEY: "None",
    },

    // #### qa Credentials###

    USER: {
      APFCUS: {
        username: "admin.apfcusb",
        password: "mRJqRyB16$!4@puN",
        key: "apfcusb",
      },
      SIMS: {
        username: "admin.sims",
        password: "ES8WoWywjJDP6R#G",
        key: "sims",
      },
      CBBANK: {
        username: "360factors@cbbank",
        password: "Test1234",
        key: "cbbank",
      },
    },

    /** DATABASE USER **/
    db: {
      host: "172.16.251.133",
      user: "qa_automation",
      password: "5F3cn6zZrwpU",
      database: "predict360",
    },

    waits: {
      longWait: 700000,
      mediumWait: 85000,
      shortWait: 15000,
    },

    profile_Url:
      "https://qa.360factors.com/predict360/profile.do?method=viewUserProfile",
    kri_Data_Grid_Url:
      "https://qa.360factors.com/predict360/web/kriDataManagment/kriDataGrid",
    import_API:
      "https://qa.360factors.com/predict360/web/kriDataManagment/importKriDat",
    kxi_Def_Url:
      "https://qa.360factors.com/predict360/web/kriDefination/kriDefinationGrid",
    FRAMEWORK:
      "https://qa.360factors.com/predict360/manageFrameworks.do?method=searchManageSurveyBanks",
    kxi_Insight_Grid_Url:
      "https://qa.360factors.com/predict360/web/lumify/grid",
    GENERATE_TOKEN:
      "https://predict-micro-qa-api.360factors.com/api/v1/auth/generate-token",
    ADD_KXI_DATA_API:
      "https://predict-micro-qa-api.360factors.com/api/v1/kxi/data",
    GET_TAGS: "https://qa.360factors.com/predict360/tags.do?method=search*",

    DATA_ENTRY_MODE:
      "https://qa.360factors.com/predict360/web/kriDataManagment/kriDataGrid?isDataEntryMode=true",
    MAIN_URL: "https://qa.360factors.com/predict360/",
    BASE_URL: "https://qa.360factors.com",
    KXI_INSIGHT_RISK_URL:
      "https://qa.360factors.com/predict360/web/riskInsight/riskInsightGrid",
    TASK_DASHBOARD_URL: "decisions.do?page=Kxi_Task_Dashboard",
    RISK_APPETITE_URL:
      "https://qa.360factors.com/predict360/web/riskAppetite/riskAppetiteGrid",
    RISK_TAXONOMIES:
      "https://qa.360factors.com/predict360/web/risk-control-taxonomy/load-mytaxonomy",
    CONTROL_OPERATIONS:
      "https://qa.360factors.com/predict360/web/controlOperation/controlOperationGrid",
    RISK_ANALYSIS_DIMENSIONS:
      "https://qa.360factors.com/predict360/riskanalysisDimensions.do?method=listRiskAnalysisDimensions",
    ISSUE_MANAGEMENT_DASHBOARD:
      "https://qa.360factors.com/predict360/decisions.do?page=Issue_Dashboard",
    CONTROL_DEFINITION_CATEGORIES_NONE_SPACE:
      "https://qa.360factors.com/predict360/web/controlDefination/controlDefinationGrid",
    CONTROL_TYPES_NONE_SPACE:
      "https://stage.360factors.com/predict360/manageControlType.do?method=listControlTypes",
    CONTROL_TAXONOMY_CUSTOMER_SPACE:
      "https://qa.360factors.com/predict360/manageRiskRegisterControlItem.do?method=listRiskRegisterControlItems",
    RESELLER:
      "https://qa.360factors.com/predict360/manage.do?method=listReseller",
    MY_QUESTION_BANK:
      "https://qa.360factors.com/predict360/manageFrameworks.do",
    TEMPLATE:
      "https://qa.360factors.com/predict360/manageSurveys.do?method=searchSurveys",
    CONTENT_SOURCE:
      "https://qa.360factors.com/predict360/web/contentSources/contentSourcesGrid",
    CONTENT_LIBRARY:
      "https://qa.360factors.com/predict360/web/contentLibrary/contentLibraryGrid",
    CUSTOMER:
      "https://qa.360factors.com/predict360/manage.do?method=listCustomer",
    USERS: "https://qa.360factors.com/predict360/manage.do?method=listUser",
    CUSTOMER_PROFILE:
      "https://qa.360factors.com/predict360/manage.do?method=preference",
    RISK_TAXONOMY:
      "https://qa.360factors.com/predict360/web/riskTaxonomy/riskTaxonomyGrid",
    CONTROL_TAXONOMY:
      "https://qa.360factors.com/predict360/web/controlTaxonomy/controlTaxonomyGrid",
    ORGANIZATIONAL_HIERARCHY:
      "https://qa2.360factors.com/predict360/facility.do?method=listFacility",

    RISK_EVENT:
      "https://qa.360factors.com/predict360/manageRiskEvent.do?method=listRiskEvents",

    BSA_SUBCATEGORY:
      "https://qa.360factors.com/predict360/web/subcategory/subcategoryGrid",
    AREAS: "https://qa.360factors.com/predict360/web/area/list",
    AGENCIES: "https://qa.360factors.com/predict360/web/agency/list",
    CATEGORIES:
      "https://qa.360factors.com/predict360/manageCategory.do?method=listCategory",
    SEVERITY: "https://qa2.360factors.com/predict360/web/issueseverity/grid",
    ISSUE_SOURCE:
      "https://qa2.360factors.com/predict360/web/manageIssueSources/manageIssueSourcesGrid",
    ISSUE_TYPES:
      "https://qa2.360factors.com/predict360/web/manageIssueTypes/manageIssueTypesGrid",
    ROOT_CAUSE:
      "https://qa2.360factors.com/predict360/web/manageMplRootCause/manageMplRootCauseGrid",
    ENTITIES:
      "https://qa2.360factors.com/predict360/web/manageEntities/manageEntitiesGrid",

    ROLES: "https://qa.360factors.com/predict360/manage.do?method=listRole",
    DEFINITION_URL:
      "https://qa.360factors.com/predict360/web/kriDefination/activeKriDefinationGridData/?_=*",
    VENDOR_RISK_MANAGEMENT:
      "https://qa.360factors.com/predict360/web/vrm/vendorRiskRegister",
    DECISION_GRID_LOAD:
      "https://decisions-qa.360factors.com/REG/API/ReportViewService/js/GetGridViewResultData?rand=*",
    DECISION_API_GET_ALL_MESSAGES:
      "https://decisions-qa.360factors.com/REG/API/TranslationService/js/GetAllHelpMessages?rand=*",
    DECISION_API_SELECTPATH:
      "https://decisions-qa.360factors.com/REG/API/FormService/js/SelectPath?rand=*",
    DECISION_API_FORMLOAD:
      "https://decisions-qa.360factors.com/REG/API/FormService/js/FormLoadComplete?rand=*",
    COMPLAINT_WEB_FORM:
      "https://qa.360factors.com/predict360/web/complaint/apfcu/APFCUSB",
    COMPLIANCE_DASHBOARD:
      "https://qa.360factors.com/predict360/casemanagement.do",
    COMPLAINT_EXTERNAL_FORM:
      "https://qa.360factors.com/predict360/web/complaint/SIMS",
    COMPLAINT_FORM:
      "https://qa.360factors.com/casemanagement/secure/CreateIssue!default.jspa?issuetype=11000",
    USER_GROUP:
      "https://qa.360factors.com/predict360/manage.do?method=listGroup",
    MAIN_URL2: "https://qa.360factors.com/",
    KXI_CATEGORIES:
      "https://qa.360factors.com/predict360/web/kriCategory/kriCategoryGrid",
    CONTROL_DEFINITION_CATEGORIES_CUSTOMER_SPACE:
      "https://qa.360factors.com/predict360/web/controlDefCategory/controlDefCategoryGrid",
    CONTROL_OPERATION_CUSTOMER_SPACE:
      "https://qa.360factors.com/predict360/web/controlOperation/controlOperationGrid",
    COMPANY_DOCUMENT: "https://qa.360factors.com/predict360/docmanagement.do",
    MY_DOCUMENT:
      "https://qa.360factors.com/predict360/docmanagement.do?page=myhome",
    MY_COMPANY_DOCUMENT:
      "https://qa.360factors.com/predict360/docmanagement.do",
    TRASH: "https://qa.360factors.com/predict360/docmanagement.do?page=trash",
  },

  projectId: "egb9q8",
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      //return require('./cypress/plugins/index.js')(on, config)
      //task to check if file exist
      on("task", {
        isFileExist(filePath) {
          return new Promise((resolve, reject) => {
            try {
              let isExists = fs.existsSync(filePath);
              resolve(isExists);
            } catch (e) {
              reject(e);
            }
          });
        },
      });
      //to remove directory
      on("task", { removeDirectory });

      mysql.configurePlugin(on);
      require("cypress-mochawesome-reporter/plugin")(on);
    },

    //////########Environment URL ##########////////////////

    // To avoid white blank screen during Test execution by cypress open
    numTestsKeptInMemory: 10,
    baseUrl: "https://qa.360factors.com/predict360/login.do",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    chromeWebSecurity: false,
    screenshotOnRunFailure: false,
    // defaultCommandTimeout: 20000,
    pageLoadTimeout: 100000,
    viewportHeight: 1080,
    viewportWidth: 1920,
    retries: {
      runMode: 2,
    },
    //Report Configuration
    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      configFile: "../reporter-config.json",
      inlineAssets: true,
      toConsole: true,
    },
  },
});
