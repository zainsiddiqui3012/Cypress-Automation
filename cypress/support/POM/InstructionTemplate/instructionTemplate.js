import locators from '../../../fixtures/locators.json';  // Import locators
import data from '../../../fixtures/InstructionTemplate/instructionTemplate.json';  // Import data

class InstructionTemplatePage {

  // Fill the description in CKEditor iframe
  fillDescription(description = '') {
    cy.frameLoaded(locators.editor.editorIframe);  // Ensure iframe is loaded before interacting
    const descriptionToType = description || data.description;  // If no description is passed, use data.description
    cy.switchToIframe(locators.editor.editorIframe).clear().type(descriptionToType);  // Clear and type the description
  }

  // Clear the description in CKEditor iframe
  clearDescription() {
    cy.frameLoaded(locators.editor.editorIframe);  // Ensure iframe is loaded before interacting
    cy.switchToIframe(locators.editor.editorIframe).clear();  // Just clear the content
  }

  // Fill the description with formatted text (bold in this case)
  fillFormattedDescription(text = data.boldText) {
    cy.frameLoaded(locators.editor.editorIframe);  // Wait for iframe to load
    cy.switchToIframe(locators.editor.editorIframe).clear().type(text);  // Clear and type the plain text
    cy.switchToIframe(locators.editor.editorIframe)
      .focus()
      .type('{selectall}');
    cy.xpath(locators.editor.boldButton, { timeout: 20000 })
      .should('be.visible')
      .click();
    // Verify bold formatting is applied by checking the editor state
    cy.switchToIframe(locators.editor.editorIframe).should('contain', text);
  }

  // Select the text and apply formatting (bold, for instance)
  selectTextAndApplyFormatting() {
    // Ensure iframe is loaded before interacting
    cy.frameLoaded(locators.editor.editorIframe);

    // Select all text and apply bold formatting
    cy.switchToIframe(locators.editor.editorIframe)
      .focus()  // Focus on the CKEditor body
      .type('{selectall}');  // Select all text inside the editor

    // Click the Bold button to apply formatting
    cy.xpath(locators.editor.boldButton).click({ force: true });
  }

  // Click on the link button in the editor
  clickLinkButton() {
    // Click the link button in CKEditor to open the link popup
    cy.xpath(locators.editor.linkButton).click();  // Click the link button using the provided XPath locator
  }

  // Enter the link URL and click "Ok"
  enterLinkUrl(url) {
    // Wait for the URL input field inside the popup to be visible and then type
    cy.get(locators.editor.linkInputField, { timeout: 10000 })  // Wait for the URL input to be visible
      .first()  // Get the first input element in case there are multiple
      .type(url);  // Type the URL into the input field

    // Click Ok to apply the link
    cy.get(locators.editor.linkOkButton).click();  // Click Ok to apply the link
  }

  // Open the font color palette (click the text color button)
openFontColorPalette() {
  cy.get(locators.editor.fontColorButton)  // Locate the font color button
    .should('be.visible')
    .click();  // Open the color picker
}

// Select the red color from the color palette and wait for the color to be applied
selectRedColor() {
  // Open the font color palette
  this.openFontColorPalette();
  
  // Wait for the iframe containing the color palette
  cy.get(locators.editor.colorPaletteIframe, { timeout: 10000 })  // Use the colorPaletteIframe from locators
    .its('0.contentDocument.body')  // Access the content of the iframe
    .then(cy.wrap)
    .find(locators.editor.redColorSwatch, { timeout: 10000 })  // Use the redColorSwatch from locators
    .should('exist')  // Ensure the swatch exists in the DOM
  
  // Check that the swatch has a non-zero size
  cy.get(locators.editor.colorPaletteIframe)  // Use the colorPaletteIframe again
    .its('0.contentDocument.body')
    .then(cy.wrap)
    .find(locators.editor.redColorSwatch)
    .should(($el) => {
      const width = $el.width();
      const height = $el.height();
      expect(width).to.be.greaterThan(0);  // Ensure non-zero width
      expect(height).to.be.greaterThan(0);  // Ensure non-zero height
    });

  // Force click the swatch (even if it's not visible)
  cy.get(locators.editor.colorPaletteIframe)  // Use the colorPaletteIframe again
    .its('0.contentDocument.body')
    .then(cy.wrap)
    .find(locators.editor.redColorSwatch)
    .click({ force: true });

  // Verify the color is applied in the editor
  cy.get(locators.editor.editorIframe)  // Access the main editor iframe
    .its('0.contentDocument.body')  // Access the content of the editor iframe
    .then(cy.wrap)
    .find(locators.editor.coloredTextSpan)  // Use the coloredTextSpan from locators
    .should('have.attr', 'style')
    .and('include', 'color:#e02222');  // Check if the color applied is red
}

// Types text into the CKEditor body
typeText(text) {
  // Ensure iframe and the editor body are loaded
  cy.frameLoaded(locators.editor.editorIframe);  // Use the locator from locators.json

  cy.switchToIframe(locators.editor.editorIframe)  // Switch to the CKEditor iframe
    .focus()  // Focus the editor
    // .clear()  // Clear any existing content
    .type(text);  // Type the provided text into the editor
}


  // Types special characters into the CKEditor
  insertSpecialCharacters(text = data.specialCharacters) {
    cy.frameLoaded(locators.editor.editorIframe);
    cy.switchToIframe(locators.editor.editorIframe)
      .focus()
      .clear()
      .type(text);
  }

  // Insert a link into CKEditor using the toolbar
  insertLink(linkText = data.linkDisplayText, url = data.linkFullUrl) {
    cy.frameLoaded(locators.editor.editorIframe);
    cy.switchToIframe(locators.editor.editorIframe)
      .focus()
      .clear()
      .type(linkText);
    cy.switchToIframe(locators.editor.editorIframe).type('{selectall}');
    cy.xpath(locators.editor.linkButton).click();
    cy.get(locators.editor.linkInputField)
      .first()
      .clear()
      .type(url);
    cy.get(locators.editor.linkOkButton).click();
  }

  // Verify and visit the inserted link
  verifyAndVisitLink(url = data.linkFullUrl, linkText = data.linkDisplayText) {
    cy.get(locators.editor.editorIframe)
      .its('0.contentDocument.body')
      .then(cy.wrap)
      .find(`a[href="${url}"]`)
      .should('contain', linkText)
      .click({ force: true })
      .then(($a) => {
        cy.visit($a.attr('href'));
      });
  }

  // Click the Save button
  clickSave() {
    cy.get(locators.editor.saveButton).click();  // Click on the Save button
  }

  // Verify save error appears in URL
  verifySaveError() {
    cy.url().should('include', 'error=Errors+in+Saving+Template+Instruction');
  }

  // Verify long text content in editor
  verifyLongTextContent(longText) {
    cy.get(locators.editor.editorIframe).its('0.contentDocument.body').should('contain.text', longText.substring(0, 100));
  }

  // Reload page
  reloadPage() {
    cy.reload();
  }

  // Verify content length in editor
  verifyContentLength(expectedLength) {
    cy.get(locators.editor.editorIframe, { timeout: data.iframeTimeout })
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .invoke('text')
      .then((text) => {
        expect(text.trim().length).to.eq(expectedLength);
      });
  }

  // Verify URL contains specific text
  verifyUrlContains(text) {
    cy.url().should('include', text);
  }

  // Log document HTML for debugging
  logDocumentHtml() {
    cy.document().then((doc) => {
      console.log(doc.body.innerHTML);
    });
  }
}

export default InstructionTemplatePage;
