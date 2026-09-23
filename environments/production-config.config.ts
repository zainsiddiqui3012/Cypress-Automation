//****** "Created by Owais Khan on 3 June 2022  */
////***** Run all tests of Predict360 application. */

import { defineConfig } from "cypress";
//  import mysql = require("cypress-mysql");
const { removeDirectory } = require("cypress-delete-downloads-folder");

export default defineConfig({
  // extends: './cypress.json',

  //////#########Environment Credentials##########////////////////

  env: {
    username: "automation.user",
    password: "Test@1234",
    key: "auto",
    USER_ID: 33448,
    NAME: "Automation User",

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

    NONE_USER: {
      USER_NAME: "automation@none",
      PASSWORD: "Test@123456",
      KEY: "None",
    },

    profile_Url:
      "https://apps.360factors.com/predict360/profile.do?method=viewUserProfile",
    kri_Data_Grid_Url:
      "https://apps.360factors.com/predict360/web/kriDataManagment/kriDataGrid",
    import_API:
      "https://apps.360factors.com/predict360/web/kriDataManagment/importKriDat",
    kxi_Def_Url:
      "https://apps.360factors.com/predict360/web/kriDefination/kriDefinationGrid",
    kxi_Insight_Grid_Url:
      "https://apps.360factors.com/predict360/web/lumify/grid",

    DATA_ENTRY_MODE:
      "https://apps.360factors.com/predict360/web/kriDataManagment/kriDataGrid?isDataEntryMode=true",
    MAIN_URL: "https://apps.360factors.com/predict360/",
    KXI_INSIGHT_RISK_URL:
      "https://apps.360factors.com/predict360/web/riskInsight/riskInsightGrid",
    TASK_DASHBOARD_URL: "decisions.do?page=Kxi_Task_Dashboard",
    RISK_APPETITE_URL:
      "https://apps.360factors.com/predict360/web/riskAppetite/riskAppetiteGrid",
    RISK_TAXONOMIES:
      "https://apps.360factors.com/predict360/web/risk-control-taxonomy/load-mytaxonomy",
    RISK_ANALYSIS_DIMENSIONS:
      "https://stage.360factors.com/predict360/riskanalysisDimensions.do?method=listRiskAnalysisDimensions",
  },

  projectId: "7ehb18",
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // return require('./cypress/plugins/index.js')(on, config)
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

      // mysql.configurePlugin(on);
    },

    //////########Environment URL ##########////////////////

    // To avoid white blank screen during Test execution by cypress open
    numTestsKeptInMemory: 10,
    baseUrl: "https://apps.360factors.com/predict360/login.do",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    chromeWebSecurity: false,
    // defaultCommandTimeout: 10000,
    pageLoadTimeout: 90000,
    viewportHeight: 1080,
    viewportWidth: 1920,

    retries: {
      // Configure retry attempts for `cypress run`
      // Default is 0
      runMode: 0,
      // Configure retry attempts for `cypress open`
      // Default is 0
      openMode: 0,
    },
  },
});
