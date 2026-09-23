require("cypress-xpath");

require("cypress-plugin-tab");

//Report library
import "cypress-mochawesome-reporter/register";

//cypress-ag-grid
import "cypress-ag-grid";
import "./commands";
import "./CustomCommands/utilityCommands";
import "./CustomCommands/predictCommands";
import "cypress-iframe";

const mysql = require("cypress-mysql");
mysql.addCommands();

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

const registerCypressGrep = require("@bahmutov/cy-grep");
registerCypressGrep();

require("cypress-mailosaur");
