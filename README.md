# Cypress Framework

Cypress Framework is a set of guidelines or rules used for creating and designing test cases. The framework is comprised of a combination of industry practices and modern tools that are designed to help professionals test more efficiently.

The framework includes guidelines to coding standards, design patterns, test-data handling methods, page object classes, processes for storing test results, and custom utility functions on how to access external resources.

## Tech Stack

- Cypress for Frontend Automation Testing
- Javascript
- NPM as Build Tool
- VS Code
- Git

## Framework Layers Mapping

- The Utilities & Resources Layer (L1): CustomCommands, fixtures, environments, cypress.config.js and support/e2e.js
- The Pages Layer (L2): support/POM
- The Test Suite Layer (L3): test files(\*.cy.js)

## Building the Project

Create Build

```bash
  npm install
```

Run the Test by using the GUI

```bash
    npm run open
```

Run the Test by using command line

```bash
    npm run cy:run
```

Run the Test by using command line with Configuration

```bash
    npm run cy:run --config-file environments/qa2-config.config.ts
```

Run the Test by using command line with Configuration and spec

```bash
    npm run cy:run --config-file environments/qa2-config.config.ts --spec cypress/e2e/Example/Example.cy.js
```

### Break down into end to end tests

The project contains multiple folders inside the e2e folder that contains all the test file,
These folders are created following Predict modules

### JS and Cypress Coding Standards

- Use `const` and `let` instead of `var`.
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
- Use camelCase for variable and function names.
- Write descriptive comments and JSDoc for functions.
- Use `cy.get` for selecting elements and avoid using `cy.wait` unless absolutely necessary.
- Prefer using custom commands for repetitive actions.
- Use `data-*` attributes for selecting elements to avoid coupling tests to CSS or JS changes.
- Ensure tests are idempotent and can run independently.
- Use `before`, `beforeEach`, `after`, and `afterEach` hooks appropriately to set up and clean up state.
- Avoid hardcoding values; use fixtures and environment variables instead.
- Use `cy.intercept` to stub network requests and responses.
- Write tests that are fast, reliable, and easy to understand.
- Use `cy.contains` for text-based assertions to make tests more readable.
- Structure tests to follow the Arrange-Act-Assert pattern.
- Use `cy.wrap` to work with non-Cypress promises and objects.
- Leverage Cypress's built-in retry-ability for commands and assertions.
- Keep test files small and focused on specific functionality.
- Use `cy.viewport` to test responsiveness across different screen sizes.
- Regularly update and maintain tests to reflect changes in the application.

### Naming Example:

- For POM classes: use Screen_Feature.spec e.g. **RiskRegister.js**
- For Test file: use Screen_Feature e.g. **RiskRegister.cy.js**
- For fixture file aka data file: use Screen_Feature.json e.g **RiskRegister.json**
- For locator file: use Screen_Feature-loc.json e.g **RiskRegister-loc.json**

## Folder Structure

- **cypress** Root Folder
- **cypress/CustomCommands** Support files aka Custom commands
- **cypress/fixtures** data-files aka fixture files
- **environments** environment files:\*\*
- **cypress/e2e** test files
- **cypress/support/CustomCommands** Custom Commands files
- **cypress/support/POM** POM files
- **cypress/plugins** plugins
- **cypress.config.json** configuration file
- **Copy_Files_In_Job.bat** Bat file to copy report in email job
- **Jenkinsfilewin** Jenkins config file for jenkins jobs execution

### Module wise Folder Structure

The folder structure is organized by modules, with each module containing its respective test files, data files, and Page Object Model (POM) files. This structure ensures modularity and maintainability by grouping related files for each module and screen.

```
cypress/
├── CustomCommands/
├── e2e/
│   ├── Examples/
│   ├── Module1/
|   │   ├── Screen1.cy.js/
|   │   ├── Screen2.cy.js/
│   ├── Module2/
│   |   ├── SubModule/
|   │   |   ├── Screen1.cy.js/
|   │   ├── Screen2.cy.js/
├── fixtures/
│   ├── Module1/
|   │   ├── Screen1.cy.json/
|   │   ├── Screen2.cy.json/
│   ├── Module2/
│   |   ├── SubModule/
|   │   |   ├── Screen1.cy.json/
|   │   ├── Screen2.cy.json/
├── plugins/
├── support/
│   ├── CustomCommands/
│   ├── POM/
|   │   ├── Module1/
|   |   │   ├── Screen1.js/
|   |   │   ├── Screen2.js/
|   │   ├── Module2/
│   |   |   ├── SubModule/
|   |   │   |   ├── Screen1.js/
|   |   │   ├── Screen2.js/
│   ├── commands.js
│   └── e2e.js
environments/
cypress.config.json
Copy_Files_In_Job.bat
Jenkinsfilewin
```

### Plugin Details

- **cypress-plugin-xhr-toggle**: Allows toggling of XHR requests in Cypress tests. [Documentation](https://github.com/archfz/cypress-plugin-xhr-toggle)
- **@bahmutov/cy-grep**: Enables filtering of Cypress tests using grep-like syntax. [Documentation](https://github.com/bahmutov/cy-grep)
- **cypress-codegen**: Generates Cypress test code from user interactions. [Documentation](https://github.com/bahmutov/cypress-codegen)
- **cypress-if**: Adds conditional testing capabilities to Cypress. [Documentation](https://github.com/bahmutov/cypress-if)
- **eslint**: A tool for identifying and reporting on patterns in JavaScript. [Documentation](https://eslint.org/docs/user-guide/getting-started)
- **eslint-plugin-cypress**: ESLint plugin for Cypress-specific linting rules. [Documentation](https://github.com/cypress-io/eslint-plugin-cypress)
- **eslint-plugin-mocha**: ESLint plugin for Mocha-specific linting rules. [Documentation](https://github.com/lo1tuma/eslint-plugin-mocha)
- **typescript**: A strongly typed programming language that builds on JavaScript. [Documentation](https://www.typescriptlang.org/docs/)

### Database Querying

    For querying database, please use ```js cy.query(string) ``` method which will take one parameter - sqlQuery in string format;
    Example of test is given in e2e/Examples/DatabaseExample.cy.js file.

### Email Testing

    We are using [Mailosaur](https://www.npmjs.com/package/cypress-mailosaur) and [MailSlurp](https://docs.mailslurp.com/cypress-mailslurp/) for Email testing. 

## To see custom commands intellisense

- Install Cypress Helper extention for VS Code by Oleksandr Shevtsov
- Open commands file from cypress/support/commands.js
- Right click and select 'Cypress: Generate Custom command types'
- It will create customCommands.d.ts file
- Rename the file to index.d.ts
- add following code in your test or POM file
  `/// <reference types="../../support" />`
- Now you will be able to see custom commands in the intellisense fo VS Code

## Cypress Grep usage - Cypress Tags

You can filter tests to run using part of their title via `grep`, and via explicit tags via `grepTags` Cypress environment variables.

```shell
# run only the tests with "auth user" in the title
$ npx cypress run --env grep="auth user"
# run tests with "hello" or "auth user" in their titles
# by separating them with ";" character
$ npx cypress run --env grep="hello; auth user"
# run tests tagged @fast
$ npx cypress run --env grepTags=@fast
# run only the tests tagged "smoke"
# that have "login" in their titles
$ npx cypress run --env grep=login,grepTags=smoke
# only run the specs that have any tests with "user" in their titles
$ npx cypress run --env grep=user,grepFilterSpecs=true
# only run the specs that have any tests tagged "@smoke"
$ npx cypress run --env grepTags=@smoke,grepFilterSpecs=true
# run only tests that do not have any tags
# and are not inside suites that have any tags
$ npx cypress run --env grepUntagged=true
```

### Usage in Test Files

```js
it("works as an array", { tags: ["@config", "some-other-tag"] }, () => {
  expect(true).to.be.true;
});

it("works as a string", { tags: "config" }, () => {
  expect(true).to.be.true;
});
```
