import { defineConfig } from "cypress";
import mysql = require("cypress-mysql");
const { removeDirectory } = require("cypress-delete-downloads-folder");
const excelUtils = require("../cypress/support/POM/RiskAndControlRegister/Administration/helpers/excelUtils.js");

// Add fs import for the isFileExist task
const fs = require("fs");

export default defineConfig({
  //   const { defineConfig } = require('cypress')
  //   const { defineConfig } = require('cypress')

  // module.exports = defineConfig({
  // extends: './cypress.json',

  //////#########Environment Credentials##########////////////////
  env: {
    username_dap: "automation.dapuser002",
    password_dap: "Test@123!",
    key_dap: "auto",

    username: "automation.user",
    password: "Test@1234",
    key: "auto",
    USER_ID: 33448,
    NAME: "Automation User",

    // #### STAGE URLs ####
    CONTROL_TYPES:
      "https://stage.360factors.com/predict360/manageControlType.do?method=listControlTypes",

    ////#### KXI User : Kxi Manager
    kxiusername: "axuser01",
    kxipassword: "Test@123",
    kxikey: "AXIO",

    rcsa_username: "automation.rcsa",
    rcsa_password: "Test@123",
    rcsa_key: "auto",

    ////######Risk user feature Controls#######//////
    username1: "automation.fuser",
    password1: "Test@1234",
    key1: "autof",

    ////######Risk user: Feture off : Manage Detailed Controls and Use Assessments to Calculate Inherent Risk  #######//////
    username2: "automation.user01",
    password2: "Test@1234",
    key2: "ACT",

    ////######Risk user: Feture off : Use Control Strength to calculate Residual Risk and Manage Detailed Controls#######//////
    username3: "automation.user02",
    password3: "Test@1234",
    key3: "autoact",

    cmsusername: "automationbfsi",
    cmspassword: "Test@1234",
    cmskey: "bcus",

    // CMS Automation User
    cms_auto_username: "cmsautomationuser001",
    cms_auto_password: "Test12345",
    cms_auto_customerKey: "bcus",
    
    // ADD Issue Management User HERE
    ISSUE_USER: {
      USERNAME: "qamaq2",
      PASSWORD: "Danat123$",
      KEY: "vtwoqa",
    },
    // #### stage Credentials###

    USER: {
      FNBA: {
        USERNAME: "fnba.admin",
        PASSWORD: "Bankbank123!!!",
        KEY: "FNBA",
      },
      NEW_FNBA_USER: {
        USERNAME: "demouqamgvvqzavcgmb",
        PASSWORD: "Test@123!",
        KEY: "FNBA",
      },
      Dms: { USERNAME: "DMS.admin", PASSWORD: "Test@123", KEY: "Livee" },
      NONE: {
        USER_NAME: "automation@none",
        PASSWORD: "Test@123456",
        KEY: "None",
      },
      RCSA_REVIEWER: {
        USERNAME: "fnba.admin",
        PASSWORD: "Bankbank123!!!",
        KEY: "FNBA",
      },
      APFCUS: {
        username: "admin.apfcusb",
        password: "mRJqRyB16$!4@puN",
        key: "apfcusb",
      },
      ONE_FINANCE: {
        username: "admin.onesb",
        password: "U8fx42G8MW6w",
        key: "onesb",
      },
      SIMS: {
        username: "admin.sims",
        password: "ES8WoWywjJDP6R#G",
        key: "sims",
      },
      Kxi_Customer: {
        USERNAME: "kxicustomer",
        PASSWORD: "Test@123!",
        KEY: "KXICUST",
      },
      CBBANK: {
        username: "admin.cbbsb",
        password: "Kb5CuW1DCmTj",
        key: "cbbsb",
      },
      REG_CHANGE: {
        RESELLER: {
          USERNAME: "reseller.regUser",
          PASSWORD: "Test@123",
          KEY: "wcru",
        },
        CUSTOMER: {
          USERNAME: "reg.User",
          PASSWORD: "Test@123",
          KEY: "CRCJ",
        },
        CUSTOMER1: {
          USERNAME: "feed.jira",
          PASSWORD: "Test@123",
          KEY: "Regfeed",
        },
      },
    },

    /** KXI USERS **/

    riskManagement: {
      rmUser: {
        username: "adminfive",
        password: "Test@123",
        key: "hawkins",
      },
      rmUserA: {
        username: "riskuserA",
        password: "Test@1234",
        key: "riskcusta",
      },
      withRMB: {
        username: "admindoc",
        password: "Test@123",
        key: "DOCS",
      },
      subgridUser: {
        username: "subgriduser",
        password: "Test@123456",
        key: "sgcust",
      },
    },
    documentManagement: {
      dmUser: {
        username: "mnba3012",
        password: "Test@123",
        key: "cprod",
      },
    },
    kxi: {
      none: {
        username: "automation@none",
        password: "Test@123456",
        key: "NONE",
      },

      reseller: {
        username: "kxireseller",
        password: "Test@123!",
        key: "KXIAUTO",
      },
      customer: {
        withRM: {
          username: "kxicustomernew",
          password: "Test@123!",
          key: "ANALYSIS",
        },
        withRM2: {
          username: "admindoc",
          password: "Test@123",
          key: "DOCS",
        },
        withRM3: {
          username: "produser",
          password: "Test@123",
          key: "prodcu",
        },
        withoutRM: {
          username: "kxicustworm",
          password: "Test@123!",
          key: "LUMIFYCUST",
        },
        withRM4: {
          username: "fnba.admin2",
          password: "Bankbank123!!!",
          key: "fnba",
        },
        BUUser: {
          username: "testbuuser",
          password: "Test@123!",
          key: "CUSTKXI",
        },
        withoutRM_PEER: {
          username: "kxicustwormpeer",
          password: "Test@123!",
          key: "KXIWOPEER",
        },
        dummyPassword: {
          password: "Test@123",
        },
        DMS: {
          username: "PROD",
          password: "Test@12345",
          key: "Livee",
        },
        decision: {
          username: "ahsan.stgdeci",
          password: "Test@123",
          key: "STGDECI",
          fullName: "ahsan stgdeci",
          user: "ahsan.stgdeci",
        },
        decisionRead: {
          username: "kxi.read",
          password: "Test@123",
          key: "STGDECI",
        },
      },
    },
    /** DATABASE USER **/

    db: {
      host: "172.16.251.140",
      user: "stg_automation",
      password: "uC7rj15JuePr",
      database: "predict360",
    },

    waits: {
      veryLongWait: 100000,
      longWait: 700000,
      mediumWait: 85000,
      shortWait: 15000,
    },

    URL: {
      ADMINISTRATION: {
        ROLES:
          "https://stage.360factors.com/predict360/manage.do?method=listRole",
        ORGANIZATIONAL_HIERARCHY:
          "https://qa2.360factors.com/predict360/facility.do?method=listFacility",
      },
      INSTRUCTION_TEMPLATE:
        "https://stage.360factors.com/predict360/web/riskReviewInstructions/getInstructions",
      CONTROL_TYPES:
        "https://stage.360factors.com/predict360/manageControlType.do?method=listControlTypes",
    },

    profile_Url:
      "https://stage.360factors.com/predict360/profile.do?method=viewUserProfile",
    GENERATE_TOKEN:
      "https://predict-micro-stage-api.360factors.com/api/v1/auth/generate-token",
    kri_Data_Grid_Url:
      "https://stage.360factors.com/predict360/web/kriDataManagment/kriDataGrid",
    import_API:
      "https://stage.360factors.com/predict360/web/kriDataManagment/importKriDat",
    ADD_KXI_DATA_API:
      "https://predict-micro-stage-api.360factors.com/api/v1/kxi/data",
    kxi_Def_Url:
      "https://stage.360factors.com/predict360/web/kriDefination/kriDefinationGrid",
    kxi_Insight_Grid_Url:
      "https://stage.360factors.com/predict360/web/lumify/grid",
    KXI_INSIGHT_RISK_URL:
      "https://stage.360factors.com/predict360/web/riskInsight/riskInsightGrid",
    KXI_CATEGORIES:
      "https://stage.360factors.com/predict360/web/kriCategory/kriCategoryGrid",

    RISK_APPETITE_URL:
      "https://stage.360factors.com/predict360/web/riskAppetite/riskAppetiteGrid",
    RISK_TAXONOMIES:
      "https://stage.360factors.com/predict360/web/risk-control-taxonomy/load-mytaxonomy",
    CONTROL_OPERATIONS:
      "https://stage.360factors.com/predict360/web/controlOperation/controlOperationGrid",
    RISK_ANALYSIS_DIMENSIONS:
      "https://stage.360factors.com/predict360/riskanalysisDimensions.do?method=listRiskAnalysisDimensions",
    BUSINESS_AREA:
      "https://stage.360factors.com/predict360/web/business-areas/business-areas-grid",
    ORGANIZATIONAL_HIERARCHY:
      "https://stage.360factors.com/predict360/facility.do?method=listFacility",
    LOCATION:
      "https://stage.360factors.com/predict360/facility.do?method=listSite",
    MAIN_URL: "https://stage.360factors.com/predict360/",
    BASE_URL: "https://qa.360factors.com",
    MAIN_URL2: "https://stage.360factors.com/",

    RISK_LIBRARIES_CUSTOMER_SPACE:
      "https://stage.360factors.com/predict360/web/risk-control-taxonomy/load-grid",
    RISK_REGISTER:
      "https://stage.360factors.com/predict360/web/usablityController/riskRegisterGrid",
    CONTROL_DEFINITION_CATEGORIES_NONE_SPACE:
      "https://stage.360factors.com/predict360/web/controlDefination/controlDefinationGrid",
    RISK_EVENT:
      "https://stage.360factors.com/predict360/manageRiskEvent.do?method=listRiskEvents",
    EVENT_TYPE:
      "https://stage.360factors.com/predict360/manageEventType.do?method=listEventTypes",
    notificationSetting_url:
      "https://stage.360factors.com/predict360/setting/notificationsetting/view?isCustomerLevel=false",

    ROLES: "https://stage.360factors.com/predict360/manage.do?method=listRole",
    RESELLER:
      "https://stage.360factors.com/predict360/manage.do?method=listReseller",
    MY_QUESTION_BANK:
      "https://stage.360factors.com/predict360/manageFrameworks.do",
    FRAMEWORK:
      "https://stage.360factors.com/predict360/manageCategory.do?method=listFramework&type=frameworks",

    TEMPLATE:
      "https://stage.360factors.com/predict360/manageSurveys.do?method=searchSurveys",

    CONTENT_SOURCE:
      "https://stage.360factors.com/predict360/web/contentSources/contentSourcesGrid",
    QUESTION_BANK:
      "https://stage.360factors.com/predict360/manageFrameworks.do?method=searchManageSurveyBanks",
    MY_COMPANY_DOCUMENT:
      "https://stage.360factors.com/predict360/docmanagement.do",

    CONTENT_LIBRARY:
      "https://stage.360factors.com/predict360/web/contentLibrary/contentLibraryGrid",
    DEFINITION_URL:
      "https://stage.360factors.com/predict360/web/kriDefination/activeKriDefinationGridData/?_=*",
    ISSUE_MANAGEMENT_DASHBOARD:
      "https://stage.360factors.com/predict360/decisions.do?page=Issue_Dashboard",
    COMPANY_DOCUMENT:
      "https://stage.360factors.com/predict360/docmanagement.do",
    MY_DOCUMENT:
      "https://stage.360factors.com/predict360/docmanagement.do?page=myhome",
    TRASH:
      "https://stage.360factors.com/predict360/docmanagement.do?page=trash",

    // Dynamic Decision URLs - Base URL constructed once
    DECISION_BASE_URL() {
      return `https://decisions-stg.360factors.com/${
        Cypress.env("kxi").customer.decision.key
      }`;
    },
    DECISION_GRID_LOAD() {
      return `${this.DECISION_BASE_URL}/API/ReportViewService/js/GetGridViewResultData?rand=*`;
    },
    DECISION_API_GETALLMESSAGES() {
      return `${this.DECISION_BASE_URL}/API/TranslationService/js/GetAllHelpMessages?rand=*`;
    },
    DECISION_API_SELECTPATH() {
      return `${this.DECISION_BASE_URL}/API/FormService/js/SelectPath?rand=*`;
    },
    DECISION_API_FORMLOAD() {
      return `${this.DECISION_BASE_URL}/API/FormService/js/FormLoadComplete?rand=*`;
    },
    DECISION_LOGIN_URL() {
      return `${this.DECISION_BASE_URL}/Account/Login`;
    },

    CUSTOMER:
      "https://stage.360factors.com/predict360/manage.do?method=listCustomer",

    USERS: "https://stage.360factors.com/predict360/manage.do?method=listUser",
    RISK_TAXONOMY:
      "https://stage.360factors.com/predict360/web/riskTaxonomy/riskTaxonomyGrid",
    CONTROL_TAXONOMY:
      "https://stage.360factors.com/predict360/web/controlTaxonomy/controlTaxonomyGrid",
    VENDOR_RISK_MANAGEMENT:
      "https://stage.360factors.com/predict360/web/vrm/vendorRiskRegister",
    COMPLAINT_WEB_FORM:
      "https://stage.360factors.com/predict360/web/complaint/apfcu/APFCUSB",
    COMPLAINT_EXTERNAL_FORM:
      "https://stage.360factors.com/predict360/web/complaint/SIMS",
    COMPLIANCE_DASHBOARD:
      "https://stage.360factors.com/predict360/casemanagement.do",
    ASSIGNED_TO_ME:
      "https://stage.360factors.com/predict360/docmanagement.do?page=pending-documents",
    CUSTOMFIELD_SCREEN:
      "https://stage.360factors.com/predict360/manageCustomFields.do?method=listCustomFields",
    RCSA_FORM:
      "https://stage.360factors.com/predict360/web/riskReviewInstructions/getInstructions",
    COMPLAINT_FORM:
      "https://stage.360factors.com/casemanagement/secure/CreateIssue!default.jspa?issuetype=11000",
    USER_GROUP:
      "https://stage.360factors.com/predict360/manage.do?method=listGroup",
    CUSTOMER_PROFILE:
      "https://stage.360factors.com/predict360/manage.do?method=preference",
    CONTROL_TAXONOMY_CUSTOMER_SPACE:
      "https://stage.360factors.com/predict360/manageRiskRegisterControlItem.do?method=listRiskRegisterControlItems",
    CONTROL_TYPES_NONE_SPACE:
      "https://stage.360factors.com/predict360/manageControlType.do?method=listControlTypes",
    Location:
      "https://stage.360factors.com/predict360/facility.do?method=listSite",
    Category:
      "https://stage.360factors.com/predict360/manageCategory.do?method=listCategory",
    AREAS: "https://stage.360factors.com/predict360/web/area/list",
    Area: "https://stage.360factors.com/predict360/web/area/list",
    BSA_SUBCATEGORY:
      "https://stage.360factors.com/predict360/web/subcategory/subcategoryGrid",
    AGENCIES: "https://stage.360factors.com/predict360/web/agency/list",
    KXI_TASK_DASHBOARD:
      "https://stage.360factors.com/predict360/decisions.do?page=Kxi_Task_Dashboard",
    CONTROL_DEFINITION_CATEGORIES_CUSTOMER_SPACE:
      "https://stage.360factors.com/predict360/web/controlDefination/controlDefinationGrid",
    CONTROL_OPERATION_CUSTOMER_SPACE:
      "https://stage.360factors.com/predict360/web/controlOperation/controlOperationGrid",
    ISSUE_EXTERNAL_WEBFORM:
      "https://decisions-stg.360factors.com/STGDECI/STGDECI/?FlowId=01J6F59BCX06HD08H2386GVRV8&&sessionid=NS-01JRANQVWA6NWM9EJ27N8SZ6HY&ForceFormat=true&Location=Maximized&Chrome=Off",
  },

  projectId: "egb9q8",
  e2e: {
    trashAssetsBeforeRuns: false,
    watchForFileChanges: false,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
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
        // Use the utility functions
        // FIXED: Return actual results, not config
        fileExists(filePath) {
          console.log(
            `=== DEBUG: fileExists task called with: ${filePath} ===`
          );
          try {
            const result = excelUtils.fileExists(filePath);
            console.log(`excelUtils.fileExists returned: ${result}`);
            return result;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            console.log(`ERROR in fileExists: ${errorMessage}`);
            return false;
          }
        },

        checkFileExists({ folder, filePrefix }) {
          console.log(
            `=== DEBUG: checkFileExists task called with folder: ${folder}, prefix: ${filePrefix} ===`
          );
          try {
            const result = excelUtils.fileExistsWithPrefix(folder, filePrefix);
            console.log(`excelUtils.fileExistsWithPrefix returned: ${result}`);
            return result;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            console.log(`ERROR in checkFileExists: ${errorMessage}`);
            return false;
          }
        },

        updateRiskTaxonomyNameInExcel(params) {
          console.log(`=== DEBUG: updateRiskTaxonomyNameInExcel called ===`);
          console.log(`Params:`, params);
          try {
            const result = excelUtils.updateRiskTaxonomyNameInExcel(params);
            console.log(`updateRiskTaxonomyNameInExcel returned:`, result);
            return result;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            console.log(
              `ERROR in updateRiskTaxonomyNameInExcel: ${errorMessage}`
            );
            return { success: false, error: errorMessage };
          }
        },
      });
      //to remove directory
      // Conditionally skip cleanup
      if (process.env.CYPRESS_SKIP_CLEANUP != "true") {
        on("task", { removeDirectory });
        require("cypress-mochawesome-reporter/plugin")(on);
      }

      mysql.configurePlugin(on);
      return config;
    },

    // To avoid white blank screen during Test execution by cypress open
    numTestsKeptInMemory: 1,
    //////########Environment URL ##########////////////////

    baseUrl: "https://stage.360factors.com/predict360/login.do",

      specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
      chromeWebSecurity: false,
      // defaultCommandTimeout: 20000,
      pageLoadTimeout: 750000,
      viewportHeight: 1080,
      viewportWidth: 1920,
      experimentalMemoryManagement: true,
      excludeSpecPattern: [
        "cypress/e2e/RegChangeManagementV2-Decisions/**/*.cy.js",
      ],
      retries: {
        // Configure retry attempts for `cypress run`
        // Default is 0
        runMode: 0,
        // Configure retry attempts for `cypress open`
        // Default is 0
        openMode: 0,
      },
      //Report Configuration
      reporter: "cypress-mochawesome-reporter",
      reporterOptions: {
        configFile: "../reporter-config.json",
        inlineAssets: true,
        toConsole: true,
      },
    },
  }
);
