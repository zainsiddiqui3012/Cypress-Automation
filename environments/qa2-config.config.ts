//****** "Created by Owais Khan on 3 June 2022  */
////***** Run all tests of Predict360 application. */

import { defineConfig } from "cypress";
import mysql = require("cypress-mysql");
const fs = require("fs");
const { removeDirectory } = require("cypress-delete-downloads-folder");
const excelUtils = require("../cypress/support/POM/RiskAndControlRegister/Administration/helpers/excelUtils.js");

const xlsx = require("node-xlsx").default;

export default defineConfig({
  // extends: './cypress.json',
  env: {
    //////#########Environment Credentials##########////////////////
    username: "automation.user",
    password: "Test@1234",
    key: "auto",
    USER_ID: 33448,
    NAME: "Automation User",

    // #### QA2 URLs ####
    CONTROL_TYPES:
      "https://qa2.360factors.com/predict360/manageControlType.do?method=listControlTypes",

    ////######Risk user feature Controls#######//////
    username1: "automation.fuser",
    password1: "Test@1234",
    key1: "autof",

    ////#### KXI User : Kxi Manager
    kxiusername: "axuser01",
    kxipassword: "Test@123",
    kxikey: "AXIO",

    ////######Risk user: Feture off : Manage Detailed Controls and Use Assessments to Calculate Inherent Risk  #######//////
    username2: "automation.user01",
    password2: "Test@1234",
    key2: "ACT",

    ////######Risk user: Feture off : Use Control Strength to calculate Residual Risk and Manage Detailed Controls#######//////
    username3: "automation.user02",
    password3: "Test@1234",
    key3: "autoact",

    //Regular Task Creation and Verify the Status of Task in Decision Platform and regular task kxi definition link unlink concept.

    username4: "kxiauto",
    password4: "Test@1234",
    key4: "DECII",

    ////###### CMS users #######//////
    bcususername: "cmsautomationuser001",
    bcuspassword: "Test12345",
    bcuskey: "bcus",

    // #### qa2 Credentials###

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

    OH: {
      CUSTOMER: {
        USER_NAME: "ixkvuobgqi",
        PASSWORD: "Right$e1234",
        KEY: "xbRbMeoi",
      },
    },
    /** KXI USERS **/

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
          username: "kxicustomer",
          password: "Test@123!",
          key: "KXICUST",
        },
        withRM2: {
          username: "kxicustomer01_qa",
          password: "Test@1234!",
          key: "KXICUST",
        },
        withRM3: {
          username: "kxiuser_01",
          password: "Test@123!",
          key: "UPDATEKXIC",
        },
        withoutRM: {
          username: "kxicustworm",
          password: "Test@123!",
          key: "KXICUSTWO",
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
        decision: {
          username: "autodecisions",
          password: "Test@123!",
          key: "KXICUST",
          fullName: "decision user",
        },
        decisionRead: {
          username: "kxiread",
          password: "Test@123",
          key: "KXICUST",
        },
      },
      DMS: {
        username: "PROD",
        password: "Letmein123*",
        key: "Livee",
      },
    },

    dms: {
      user1: {
        username: "dms_user_automation",
        password: "Test@123456",
        key: "DMSKey",
      },
    },

    riskManagement: {
      rmUser: {
        username: "riskuser1",
        password: "Test@1234",
        key: "riskcust",
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
    },
    decisionManagement: {
      dmsUser: {
        username: "dms_user_automation",
        password: "Test@123456",
        key: "DMSKey",
      },
      dmsRead: {
        username: "dms.read",
        password: "Test@123",
        key: "DMSKey",
      },
      dmsOnly: {
        username: "dms.user",
        password: "Test@123",
        key: "DMSKey",
      },
      dmsCustomerAdmin: {
        username: "dms.cust",
        password: "Test@123",
        key: "DMSKey",
      },
    },
    ISSUE_USER: {
      USERNAME: "auto@mation",
      PASSWORD: "Test@123",
      KEY: "QAAUTO",
    },

    REG_CHANGE_V2: {
      RESELLER: {
        USERNAME: "testreselleradmin",
        PASSWORD: "Test@123",
        KEY: "SABA",
      },
      CUSTOMER: {
        USERNAME: "fnba.feed",
        PASSWORD: "Test@123",
        KEY: "FNBA",
      },
      CUSTOMER2: {
        USERNAME: "feed.nopin",
        PASSWORD: "Test@123",
        KEY: "FNBA",
      },
    },
    /** DATABASE USER **/
    db: {
      host: "172.16.251.134",
      user: "qa_automation",
      password: "5F3cn6zZrwpU",
      database: "predict360",
    },

    URL: {
      ADMINISTRATION: {
        ROLES:
          "https://qa2.360factors.com/predict360/manage.do?method=listRole",
      },
    },

    waits: {
      longWait: 700000,
      mediumWait: 85000,
      shortWait: 15000,
    },

    profile_Url:
      "https://qa2.360factors.com/predict360/profile.do?method=viewUserProfile",
    Location:
      "https://qa2.360factors.com/predict360/facility.do?method=listSite",
    Category:
      "https://qa2.360factors.com/predict360/manageCategory.do?method=listCategory",
    Area: "https://qa2.360factors.com/predict360/web/area/list?sort=2&column=1",
    NewAgency: "https://qa2.360factors.com/predict360/web/agency/list",
    BSASubCategories:
      "https://qa2.360factors.com/predict360/web/subcategory/subcategoryGrid",
    kri_Data_Grid_Url:
      "https://qa2.360factors.com/predict360/web/kriDataManagment/kriDataGrid",
    import_API:
      "https://qa2.360factors.com/predict360/web/kriDataManagment/importKriDat",
    kxi_Def_Url:
      "https://qa2.360factors.com/predict360/web/kriDefination/kriDefinationGrid",
    kxi_Insight_Grid_Url:
      "https://qa2.360factors.com/predict360/web/lumify/grid",

    DATA_ENTRY_MODE:
      "https://qa2.360factors.com/predict360/web/kriDataManagment/kriDataGrid?isDataEntryMode=true",
    MAIN_URL: "https://qa2.360factors.com/predict360/",
    BASE_URL: "https://qa2.360factors.com",
    KXI_INSIGHT_RISK_URL:
      "https://qa2.360factors.com/predict360/web/riskInsight/riskInsightGrid",
    TASK_DASHBOARD_URL: "decisions.do?page=Kxi_Task_Dashboard",
    CONTROL_TAXONOMY_CUSTOMER_SPACE:
      "https://qa2.360factors.com/predict360/manageRiskRegisterControlItem.do?method=listRiskRegisterControlItems",
    RISK_APPETITE_URL:
      "https://qa2.360factors.com/predict360/web/riskAppetite/riskAppetiteGrid",
    RISK_TAXONOMIES:
      "https://qa2.360factors.com/predict360/web/risk-control-taxonomy/load-mytaxonomy",
    CONTROL_OPERATIONS:
      "https://qa2.360factors.com/predict360/web/controlOperation/controlOperationGrid",
    RISK_REGISTER:
      "https://qa2.360factors.com/predict360/web/usablityController/riskRegisterGrid",
    CONTROL_DEFINITION_CATEGORIES_NONE_SPACE:
      "https://qa2.360factors.com/predict360/web/controlDefination/controlDefinationGrid",
    CONTROL_TYPES_NONE_SPACE:
      "https://stage.360factors.com/predict360/manageControlType.do?method=listControlTypes",
    RISK_ANALYSIS_DIMENSIONS:
      "https://qa2.360factors.com/predict360/riskanalysisDimensions.do?method=listRiskAnalysisDimensions",
    ROLES: "https://qa2.360factors.com/predict360/manage.do?method=listRole",
    DEFINITION_URL:
      "https://qa2.360factors.com/predict360/web/kriDefination/activeKriDefinationGridData/?_=*",
    RESELLER:
      "https://qa2.360factors.com/predict360/manage.do?method=listReseller",
    MY_QUESTION_BANK:
      "https://qa2.360factors.com/predict360/manageFrameworks.do",
    FRAMEWORK:
      "https://qa2.360factors.com/predict360/manageCategory.do?method=listFramework&type=frameworks",
    TEMPLATE:
      "https://qa2.360factors.com/predict360/manageSurveys.do?method=searchSurveys",
    CONTENT_SOURCE:
      "https://qa2.360factors.com/predict360/web/contentSources/contentSourcesGrid",
    CONTENT_LIBRARY:
      "https://qa2.360factors.com/predict360/web/contentLibrary/contentLibraryGrid",
    COMPANY_DOCUMENT: "https://qa2.360factors.com/predict360/docmanagement.do",
    MY_DOCUMENT:
      "https://qa2.360factors.com/predict360/docmanagement.do?page=myhome",
    UPLOAD_DOCUMENT_API:
      "https://qa2.360factors.com/predict360/docmanagement/secure/DocumentUpload!uploadDocument.ajax",
    MY_COMPANY_DOCUMENT:
      "https://qa2.360factors.com/predict360/docmanagement.do",
    ASSIGN_TO_ME:
      "https://qa2.360factors.com/predict360/docmanagement.do?page=pending-documents",
    TRASH: "https://qa2.360factors.com/predict360/docmanagement.do?page=trash",
    // Dynamic Decision URLs - Base URL constructed once
    DECISION_BASE_URL() {
      return `https://decisions-qa2.360factors.com/${
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
    GENERATE_TOKEN:
      "https://predict-micro-qa2-api.360factors.com/api/v1/auth/generate-token",
    ADD_KXI_DATA_API:
      "https://predict-micro-qa2-api.360factors.com/api/v1/kxi/data",
    ISSUE_MANAGEMENT_DASHBOARD:
      "https://qa2.360factors.com/predict360/decisions.do?page=Issue_Dashboard",
    ISSUE_SOURCE:
      "https://qa2.360factors.com/predict360/web/manageIssueSources/manageIssueSourcesGrid",
    ISSUE_TYPES:
      "https://qa2.360factors.com/predict360/web/manageIssueTypes/manageIssueTypesGrid",
    ROOT_CAUSE:
      "https://qa2.360factors.com/predict360/web/manageMplRootCause/manageMplRootCauseGrid",
    ENTITIES:
      "https://qa2.360factors.com/predict360/web/manageEntities/manageEntitiesGrid",
    CUSTOMER:
      "https://qa2.360factors.com/predict360/manage.do?method=listCustomer",
    USERS: "https://qa2.360factors.com/predict360/manage.do?method=listUser",
    RISK_TAXONOMY:
      "https://qa2.360factors.com/predict360/web/riskTaxonomy/riskTaxonomyGrid",
    CONTROL_TAXONOMY:
      "https://qa2.360factors.com/predict360/web/controlTaxonomy/controlTaxonomyGrid",
    SEVERITY: "https://qa2.360factors.com/predict360/web/issueseverity/grid",
    ORGANIZATIONAL_HIERARCHY:
      "https://qa2.360factors.com/predict360/facility.do?method=listFacility",
    BSA_SUBCATEGORY:
      "https://qa2.360factors.com/predict360/web/subcategory/subcategoryGrid",
    AREAS: "https://qa2.360factors.com/predict360/web/area/list",
    AGENCIES: "https://qa2.360factors.com/predict360/web/agency/list",
    CATEGORIES:
      "https://qa2.360factors.com/predict360/manageCategory.do?method=listCategory",
    BUSINESS_AREA:
      "https://qa2.360factors.com/predict360/web/business-areas/business-areas-grid",
    VENDOR_RISK_MANAGEMENT:
      "https://qa2.360factors.com/predict360/web/vrm/vendorRiskRegister",
    RISK_LIBRARIES_CUSTOMER_SPACE:
      "https://qa2.360factors.com/predict360/web/risk-control-taxonomy/load-grid",
    RISK_EVENT:
      "https://qa2.360factors.com/predict360/manageRiskEvent.do?method=listRiskEvents",
    USER_GROUP:
      "https://qa2.360factors.com/predict360/manage.do?method=listGroup",
    COMPLAINT_WEB_FORM:
      "https://qa2.360factors.com/predict360/web/complaint/apfcu/APFCUSB",
    COMPLIANCE_DASHBOARD:
      "https://qa2.360factors.com/predict360/casemanagement.do",
    COMPLAINT_EXTERNAL_FORM:
      "https://qa2.360factors.com/predict360/web/complaint/SIMS",
    COMPLAINT_FORM:
      "https://qa2.360factors.com/casemanagement/secure/CreateIssue!default.jspa?issuetype=11000",
    CUSTOMER_PROFILE:
      "https://qa2.360factors.com/predict360/manage.do?method=preference",
    MAIN_URL2: "https://qa2.360factors.com/",
    KXI_CATEGORIES:
      "https://qa2.360factors.com/predict360/web/kriCategory/kriCategoryGrid",
    ISSUE_EXTERNAL_WEBFORM:
      "https://decisions-qa2.360factors.com/QAAUTO/QAAUTO/?FlowId=01J6F59BCX06HD08H2386GVRV8&&sessionid=NS-01JYECSR1KFS64F53QKMB45ES1&ForceFormat=true&Location=Maximized&Chrome=Off",
    CONTROL_DEFINITION_CATEGORIES_CUSTOMER_SPACE:
      "https://qa2.360factors.com/predict360/web/controlDefCategory/controlDefCategoryGrid",
    CONTROL_OPERATION_CUSTOMER_SPACE:
      "https://qa2.360factors.com/predict360/web/controlOperation/controlOperationGrid",
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },

  projectId: "egb9q8",
  e2e: {
    watchForFileChanges: false,

    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      //  return require('./cypress/plugins/index.js')(on, config)

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
            `=== DEBUG: fileExists task called with: ${filePath} ===`,
          );
          try {
            const result = excelUtils.fileExists(filePath);
            console.log(`excelUtils.fileExists returned: ${result}`);
            return result;
          } catch (error) {
            console.log(`ERROR in fileExists: ${error.message}`);
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
            console.log(
              `ERROR in updateRiskTaxonomyNameInExcel: ${error.message}`,
            );
            return { success: false, error: error.message };
          }
        },
      });

      //saving the EXCELL File
      on("task", {
        // Force-save or rewrite the file to ensure it is valid
        saveFile(filePath) {
          return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
              if (err) {
                return reject(`Error reading file: ${filePath}`);
              }
              // Re-write the same data to "touch" the file
              fs.writeFile(filePath, data, (err) => {
                if (err) {
                  return reject(`Error writing file: ${filePath}`);
                }
                resolve(true);
              });
            });
          });
        },
      });

      //to remove directory
      on("task", { removeDirectory });
      // Conditionally skip cleanup
      if (process.env.CYPRESS_SKIP_CLEANUP != "true") {
        on("task", { removeDirectory });
        require("cypress-mochawesome-reporter/plugin")(on);
      }
      mysql.configurePlugin(on);

      on("task", {
        parseXlsx({ filePath }) {
          return new Promise((resolve, reject) => {
            try {
              const jsonData = xlsx.parse(fs.readFileSync(filePath), {
                defval: "",
              });
              resolve(jsonData);
            } catch (e) {
              reject(e);
            }
          });
        },
      });
      return config;
    },

    //////########Environment URL ##########////////////////

    // To avoid white blank screen during Test execution by cypress open
    numTestsKeptInMemory: 8,
    experimentalMemoryManagement: true,
    baseUrl: "https://qa2.360factors.com/predict360/login.do",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    excludeSpecPattern: [
      "cypress/e2e/RegChangeManagementV2-Decisions/**/*.cy.js",
    ],
    chromeWebSecurity: false,
    screenshotOnRunFailure: true,
    pageLoadTimeout: 200000,
    viewportHeight: 1080,
    viewportWidth: 1920,
    retries: {
      runMode: 0,
    },
    //Clear Download, Screenshot and Video folders
    trashAssetsBeforeRuns: true,
    //Report Configuration
    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      configFile: "../reporter-config.json",
      inlineAssets: true,
      toConsole: true,
    },
  },
});
