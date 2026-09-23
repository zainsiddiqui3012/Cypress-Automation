import * as fs from "fs";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const characters = "abcdefghijklmnopqrstuvwxyz";
const alphaNumeric =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const specialNumericCharacters = "!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789";


/**
 * createRandomString will create random string with only characters
 * @param {number} length of the string
 */
Cypress.Commands.add("createRandomString", (length) => {
  let result = "";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  console.log("***************** " + result);
  return result;
});

/**
 * createRandomAlphaNumeric will create random alpha numeric string
 * @param {number} length of the string
 */
Cypress.Commands.add("createRandomAlphaNumeric", (length) => {
  let result = "";
  const charactersLength = alphaNumeric.length;
  let counter = 0;
  while (counter < length) {
    result += alphaNumeric.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
});

/**
 * createRandomNumber will create a random number string composed only of digits.
 * 
 * @param {number} length - The number of digits to generate.
 * @returns {string} A random number string of the specified length.
 */
Cypress.Commands.add("createRandomNumber", (length) => {
  let result = "";
  const digits = "0123456789";
  const digitsLength = digits.length;
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digitsLength));
  }
  return result;
});


//ignoreNetworkLogs will ignore the fetch,xhr logs in Cypress Test Runner
Cypress.Commands.add("ignoreNetworkLogs", () => {
  cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
})
// clearAllBrowserData will clear all browser data including cookies, local storage, session storage, indexedDB, and caches.
Cypress.Commands.add('clearAllBrowserData', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  Cypress.session.clearAllSavedSessions();
  
  cy.window().then((win) => {
    // Clear all possible storage mechanisms
    win.sessionStorage.clear();
    win.localStorage.clear();
    
    // Clear IndexedDB
    if (win.indexedDB && win.indexedDB.databases) {
      win.indexedDB.databases().then((dbs) => {
        dbs.forEach(db => win.indexedDB.deleteDatabase(db.name));
      });
    }
    
    // Clear caches
    if ('caches' in win) {
      win.caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => win.caches.delete(cacheName));
      });
    }
  });
  
  cy.reload(true);
  cy.wait(2000);
});
/**
   * createNamewithTime Returning the name with adding current Time and data
  *@param {String} defName will be given name by the user.
  *@returns {String} updatedName will be the updated Name. 
  */
Cypress.Commands.add("createNamewithTime", (defName) => {
  const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
  const updatedName = defName + timeStamp;
  return updatedName
});
/**
 * createRandomSpecialCharactersNumeric will create a random string containing special characters and digits.
 * @param {number} length - The desired length of the generated string.
 * @returns {string} A random string composed of special characters and digits.
 */
Cypress.Commands.add("createRandomSpecialCharactersNumeric", (length) => {
  let result = "";
  const allowedLength = specialNumericCharacters.length;
  for (let i = 0; i < length; i++) {
    result += specialNumericCharacters.charAt(Math.floor(Math.random() * allowedLength));
  }
  console.log("Generated special numeric string:", result);
  return result;
});

  // Custom Command to delete the download folder
  require("cypress-delete-downloads-folder").addCustomCommand();

/**
 * parseXlsx custom command will call the parseXlsx task
 * @param {string} inputFile xlsx file path
 * @returns {object} JSON object of the xlsx file
 */
Cypress.Commands.add("parseXlsx", (inputFile) => {
  return cy.task("parseXlsx", { filePath: inputFile });
});

/**
 * exportXlsxFile custom command will get json object as param
 * and save that object in json format sheet wise in the specified output file path
 * @param {object} jsonData json object of the sheet data
 * @param {string} outputFilePath path of the json file
 */
Cypress.Commands.add("exportXlsxFile", (jsonData, outputFilePath) => {
  // Initializing empty array
  let tempArr = [];

  // First clear the content of output json file
  cy.writeFile(outputFilePath, {});

  for (let index = 0; index < jsonData.length; index++) {
    // Creating variable for data
    const sheetData = jsonData[index].data;

    // Converting the Array to sheet and then Sheet to JSON
    const data = XLSX.utils.sheet_to_json(XLSX.utils.aoa_to_sheet(sheetData));

    // Add json converted data into temp array
    tempArr.push(data);
  }

  cy.readFile(outputFilePath).then((file) => {
    // Looping through the array and saving relative Sheet data with it's name
    tempArr.forEach((item, index) => {
      file[jsonData[index].name] = item;
    });

      // Writing the JSON data into the file
      cy.writeFile(outputFilePath, file);
    });
  });

 


