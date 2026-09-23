//****** "Created by Owais Khan on 3 June 2022  */
////***** Run all tests of Predict360 application. */

const { defineConfig } = require("cypress");
const mysql = require("cypress-mysql");
const { removeDirectory } = require("cypress-delete-downloads-folder");
// const { cypressMochawesomeReporter } = require('cypress-mochawesome-reporter/plugin');

module.exports = defineConfig({
  // import { defineConfig } from 'cypress'

  ///****Disable Video Recording */
  videoCompression: true,

  projectId: "7ehb18",

  //////#########Environment Credentials##########////////////////
  env: {
    MAILOSAUR_API_KEY: "WANebfYeYK6vFNo1b1ILmhueOwUrgYNw",

    kxi_Def_Url:
      "https://stage.360factors.com/predict360/web/kriDefination/kriDefinationGrid",

    rcsa_username: "automation.rcsa",
    rcsa_password: "Test@123",
    rcsa_key: "auto",
    username_dap: "automation.dapuser002",
    password_dap: "Test@123!",
    key_dap: "auto",

    username: "automation.user",
    password: "Test@1234",
    key: "auto",

    ////######Risk user feature Controls#######//////
    username1: "automation.fuser",
    password1: "Test@1234",
    key1: "autof",

    ////######Risk user: Feture off : Manage Detailed Controls and Use Assessments to Calculate Inherent Risk  #######//////
    username3: "automation.user02",
    password3: "Test@1234",
    key3: "autoact",

    username4: "auto.nonelib",
    password4: "Test@1234",
    key4: "ATN",

    cmsusername: "automationbfsi",
    cmspassword: "Test@1234",
    cmskey: "bcus",

    ////######Risk user: Feture off : Use Control Strength to calculate Residual Risk and Manage Detailed Controls#######//////

    username2: "automation.user01",
    password2: "Test@1234",
    key2: "ACT",

    ////######Risk user: Feture off : Use Control Strength to calculate Residual Risk and Manage Detailed Controls#######//////
    username3: "automation.user02",
    password3: "Test@1234",
    key3: "autoact",

    username4: "auto.nonelib",
    password4: "Test@1234",
    key4: "ATN",

    ////###### Stage: Super Admin none user #######//////
    username5: "automation@none",
    password5: "Test@123456",
    key5: "none",

    username6: "automation.stage",
    password6: "Test@123456",
    key6: "Lamda",
    ////###### CMS users #######//////
    cmsusername: "automationbfsi",
    cmspassword: "Test@1234",
    cmskey: "bcus",

    // #### QA2 Credentials###

    Noneusername: "automation@none",
    Nonepassword: "Test@123456",
    Nonekey: "None",

    kxi: {
      none: {
        username: "automation@none",
        password: "Test@123456",
        key: "NONE",
      },
    },

    ////###### CMS users #######//////
    bcususername: "cmsautomationuser001",
    bcuspassword: "Test12345",
    bcuskey: "bcus",

    ////###### CMS users #######//////
    bcususername: "cmsautomationuser001",
    bcuspassword: "Test12345",
    bcuskey: "bcus",

    ////###### Issue Management users #######//////
    usernameCPTL: "admin.CPTL",
    passwordCPTL: "Avof9c44zItm",
    keyCPTL: "CPTL",
    ////###### Issue Management users #######//////
    usernameGWYD: "gwy@gwydemo",
    passwordGWYD: "!360FactorsDemo!",
    keyGWYD: "gwydemo",
    ////###### Issue Management users #######//////
    usernameGrpGWYD: "gwyautomationuser",
    passwordGrpGWYD: "Test@123",
    keyGrpGWYD: "gwydemo",
    ////###### Issue Management users #######//////
    usernameCPDEMO: "cpdemo.admin",
    passwordCPDEMO: "@%Pred!ctP@$$",
    keyCPDEMO: "cpdemo",

    ////######SOX Review#######//////
    soxusername: "fnba.admin2",
    soxpassword: "Bankbank123!!!",
    soxkey: "FNBA",

    Regusername: "test.regchange",
    Regpassword: "Test@1234",
    Regkey: "BCUS",

    /** DATABASE USER **/
    db: {
      host: "172.16.251.133",
      user: "qa_automation",
      password: "5F3cn6zZrwpU",
      database: "predict360",
    },
    CPTLIssueform:
      "https://stage.360factors.com/predict360/web/issue/firstCapital/CPTL",
    GWYDEMOIssueForm:
      "https://stage.360factors.com/predict360/web/issue/GWYDEMO",
    CPDEMOIssueForm: "https://stage.360factors.com/predict360/web/issue/CPDEMO",
    MAIN_URL: "https://stage.360factors.com/predict360/",
    BASE_URL: "https://stage.360factors.com",
    COMPLIANCE_DASHBOARD:
      "https://stage.360factors.com/predict360/casemanagement.do",
    profile_Url:
      "https://stage.360factors.com/predict360/profile.do?method=viewUserProfile",
    grepOmitFiltered: true,
    grepFilterSpecs: true,
  },

  e2e: {
    // experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // cypressMochawesomeReporter(on);
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
      this.screenshotOnRunFailure = false;
      require("@bahmutov/cy-grep/src/plugin")(config);
      // IMPORTANT: return the config object
      return config;
    },
    //////########Environment URL ##########////////////////
    baseUrl: "https://stage.360factors.com/predict360/login.do",
    JiraUrl: "https://stage.360factors.com/casemanagement/issues/?jql=",
    CPTLIssueform:
      "https://qa.360factors.com/predict360/web/issue/firstCapital/CPTL",
    GWYDEMOIssueForm: "https://qa.360factors.com/predict360/web/issue/GWYDEMO",
    CPDEMOIssueForm: "https://qa.360factors.com/predict360/web/issue/CPDEMO",
    FBOCOMPLAINTFORMURL:
      "https://stage.360factors.com/predict360/web/complaint/fbo/FBO",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    specPattern: "cypress/e2e/IssueManagement/*.js",
    // excludeSpecPattern: "cypress/e2e/other/*.js",
    chromeWebSecurity: false,
    pageLoadTimeout: 200000,
    viewportHeight: 1080,
    viewportWidth: 1920,

    //SceeenShot and Video Configuration
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos/testExecutionVideos",
    video: false,
    screenshotOnRunFailure: true,
    //Report Configuration
    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      skipSkipped: true,
      reportDir: "cypress/reports/html",
      overwrite: false,
      html: true,
      json: true,
    },
    retries: {
      runMode: 0,
      openMode: 0,
    },
  },
});
