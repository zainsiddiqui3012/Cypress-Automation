/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

//****** "Created by Owais Khan on 3 June 2022  */
////***** Run all tests of Predict360 application. */

// promisified fs module
const fs = require('fs-extra')
const path = require('path')
const { downloadFile } = require('cypress-downloadfile/lib/addPlugin');

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`)

  if (!fs.existsSync(pathToConfigFile)) {
    console.log('No custom config file found.')
    return {};
  }

  return fs.readJson(pathToConfigFile)
}

// plugins file
module.exports = (on, config) => {
  // accept a configFile value or use development by default
  const file = config.env.configFile //we will use no default value

  return getConfigurationByFile(file)
}



const readXlsx = require('./read-xlsx')

module.exports = (on, config) => {
  on('task', {
    'readXlsx': readXlsx.read
  })
  require('cypress-mochawesome-reporter/plugin')(on);
}


// // cypress/plugins/index.ts
// module.exports = (on, config) => {
//   on('before:browser:launch', (browser, launchOptions) => {
//     launchOptions.args.push('--disable-gpu');
//     launchOptions.args.push('--disable-software-rasterizer');
//     return launchOptions;
//   });
// }

// module.exports = (on, config) => {
//   on('before:browser:launch', (browser, launchOptions) => {
//     if (browser.name === 'chrome' && browser.isHeadless) {
//       launchOptions.args.push('--disable-gpu');
//       return launchOptions
//     }
//   });
// }


module.exports = (on, config) => {
  on('before:browser:launch', (browser, args) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      args.push(
        '--disable-gpu'
      );
      return args;
    }
  });
}

/////Cucumber Integration
const cucumber = require('cypress-cucumber-preprocessor').default 

module.exports = (on, config) => {

  on('file:preprocessor', cucumber())

}


module.exports = (on, config) => {
  on('task', { 
    downloadFile,
    checkFileExists({ folder, filePrefix }) {
      const fs = require('fs');
      if (!fs.existsSync(folder)) return false;
      const files = fs.readdirSync(folder);
      return files.some(file => file.startsWith(filePrefix));
    }
  });
};