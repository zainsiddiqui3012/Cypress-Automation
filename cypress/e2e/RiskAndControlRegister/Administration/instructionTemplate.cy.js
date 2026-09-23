import InstructionTemplatePage from '../../../support/POM/InstructionTemplate/instructionTemplate.js';
import data from '../../../fixtures/InstructionTemplate/instructionTemplate.json';  // Import data
import LoginDetails_PO from "../../../support/POM/LoginPredict_PO/LoginDetails_PO.js";  // Correct import for Login PO

describe('Instruction Template Test Suite', {
  tags: ["@regression"]
}, () => {

  // Login Details (Runs before each test)
  beforeEach(() => {
    cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));  // Log credentials for debugging

    // Perform login steps before each test
    const loginDetails = new LoginDetails_PO();
    loginDetails.visitUrl();  // Visit the login URL
    loginDetails.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key")); // Provide login details
    loginDetails.clickOn_LoginButton();  // Click the login button

    // Visit the page for each test after login
    cy.visit(Cypress.env("URL").INSTRUCTION_TEMPLATE);
  });

  // Test case 1: Instruction text is saved successfully
  it('should save the instruction text successfully', {
    tags: ["@PD-36726", "@risk-management", "@customer", "@instruction-template", "@smoke"]
  }, () => {
    const instructionTemplatePage = new InstructionTemplatePage();
    instructionTemplatePage.fillDescription();
    instructionTemplatePage.clickSave();
  });

  // Test case 2: Validation error is shown or save is blocked
  it('should show validation error or block save when description is empty', {
    tags: ["@PD-36726", "@risk-management", "@customer", "@instruction-template", "@smoke"]
  }, () => {
    const instructionTemplatePage = new InstructionTemplatePage();
    instructionTemplatePage.clearDescription();
    instructionTemplatePage.clickSave();
    instructionTemplatePage.verifySaveError();
  });

  // Test case 3: Formatting is retained after save
  it('should apply bold formatting to text in CKEditor', {
    tags: ["@PD-36726", "@risk-management", "@customer", "@instruction-template"]
  }, () => {
    const instructionTemplatePage = new InstructionTemplatePage();
    instructionTemplatePage.fillFormattedDescription(data.boldText);
    instructionTemplatePage.clickSave();
  });

  // Test case 4: Link is displayed correctly and clickable
  it('should display the link correctly and it should be clickable', {
    tags: ["@PD-36726", "@risk-management", "@customer", "@instruction-template"]
  }, () => {
    const instructionTemplatePage = new InstructionTemplatePage();
    instructionTemplatePage.fillDescription(data.linkText);
    instructionTemplatePage.selectTextAndApplyFormatting();
    instructionTemplatePage.clickLinkButton();
    instructionTemplatePage.enterLinkUrl(data.linkUrl);
    instructionTemplatePage.clickSave();
  });

  // Test case 5: Styles are preserved or sanitized as per policy
  it("should apply red color to text and save it", {
    tags: ["@PD-36726", "@risk-management", "@customer", "@instruction-template"]
  }, () => {
    const instructionTemplatePage = new InstructionTemplatePage();
    instructionTemplatePage.openFontColorPalette();
    instructionTemplatePage.selectRedColor();
    instructionTemplatePage.typeText(data.description);
    instructionTemplatePage.clickSave();
  });


  // Test case 6: Error or input is restricted to allowed length
  it('should restrict input to allowed length', {
    tags: ["@PD-36726", "@risk-management", "@customer", "@instruction-template"]
  }, () => {
    const instructionTemplatePage = new InstructionTemplatePage();
    instructionTemplatePage.fillDescription(data.longText1000);
    instructionTemplatePage.clickSave();
    instructionTemplatePage.verifyLongTextContent(data.longText1000);
  });

  // Test case 7: Special characters are encoded and displayed properly
  it("should insert special characters and save", {
    tags: ["@PD-36726", "@risk-management", "@customer", "@instruction-template"]
  }, () => {
    const instructionTemplatePage = new InstructionTemplatePage();
    instructionTemplatePage.insertSpecialCharacters(data.specialCharacters);
    instructionTemplatePage.clickSave();
  });

  // Test case 8: Saved instruction appears correctly post-refresh
  it('should display the saved instruction correctly after refresh', {
    tags: ["@PD-36726", "@risk-management", "@customer", "@instruction-template"]
  }, () => {
    const instructionTemplatePage = new InstructionTemplatePage();
    instructionTemplatePage.fillDescription(data.savedDescription);
    instructionTemplatePage.clickSave();
    instructionTemplatePage.reloadPage();
  });


  // Test case 9: Saved successfully and link works as expected
  it('should save successfully and link works as expected', {
    tags: ["@PD-36726", "@risk-management", "@customer", "@instruction-template"]
  }, () => {
    const instructionTemplatePage = new InstructionTemplatePage();
    instructionTemplatePage.insertLink(data.linkDisplayText, data.linkFullUrl);
    instructionTemplatePage.clickSave();
    instructionTemplatePage.verifyAndVisitLink(data.linkFullUrl, data.linkDisplayText);
    instructionTemplatePage.verifyUrlContains(data.linkUrlInclude);
  });

  // Test case 10: Save works within size limits, rendering is preserved
  it('should save within size limits and render properly', {
    tags: ["@PD-36726", "@risk-management", "@customer", "@instruction-template"]
  }, () => {
    const instructionTemplatePage = new InstructionTemplatePage();
    instructionTemplatePage.fillDescription(data.longText300);
    instructionTemplatePage.clickSave();
    instructionTemplatePage.verifyContentLength(data.length300);
  });


  // Test case 11: Script is stripped or sanitized; no XSS risk
  it('should strip scripts or sanitize content to avoid XSS risk', {
    tags: ["@PD-36726", "@risk-management", "@customer", "@instruction-template"]
  }, () => {
    const instructionTemplatePage = new InstructionTemplatePage();
    instructionTemplatePage.fillDescription(data.xssScript);
    instructionTemplatePage.clickSave();
    instructionTemplatePage.logDocumentHtml();
  });

  })