import locators from "../../../fixtures/locators.json";
import testData from "../../../fixtures/RCSAAuditLog/RiskreviewCustomField.json";
class NotificationSettings {
  reloadPage() {
    cy.reload();
  }

  clickoncolumns() {
    cy.contains("Columns").click();
  }

  clickonRiskcontrol() {
    cy.contains("Risk and Control Register").click({ force: true });
  }

  clickonRiskRegister() {
    cy.contains("Risk Register").click({ force: true });
  }

  ClickoncolumnButton() {
    cy.get(locators.riskReview.clickCloumn).click();
  }

  clickCheckbox() {
    testData.customfieldsNames.forEach((fieldName) => {
      cy.get(locators.riskReview.checkbox)
        .eq(0)
        .clear()
        .type(fieldName, { delay: 300 });
      cy.get(locators.riskReview.agColoumn, { timeout: 10000 })
        .eq(0) // Parent element // Scroll to the bottom initially // Wait until it contains the required text
        .contains(fieldName, { timeout: 100000 }) // Find the text inside the container // Ensure it's visible in viewport
        .click(); // Click on it
    });
  }
  clickthreedot() {
    cy.get(locators.riskReview.ClickthreeDot).click();
  }
  startRcsa() {
    cy.contains("span", "Start RCSA Review").click({ force: true });
  }

  currentDate() {
    const today = new Date();
    const day = today.getDate(); // Get today's date (1-31)
    cy.get(locators.riskReview.addIcon).should("be.visible").click(); // Open calendar
    cy.contains(".active.day", day)
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true }); // Click on today's date
  }

  selectBusinessUnit() {
    cy.get(locators.riskReview.buSearch, { timeout: 10000 }).click({
      force: true,
    });
    // Open the Select2 dropdown
    cy.get(locators.riskReview.selectBu, {
      timeout: 10000,
    })
      .should("be.visible")
      .first()
      .click({ force: true });
  }

  clickonYesbutton() {
    cy.get(locators.riskReview.yesButton).click();
    cy.get(locators.riskReview.clickhere, { timeout: 20000 })
      .invoke("attr", "href")
      .then((href) => {
        const fullUrl = href.startsWith("http")
          ? href
          : `https://stage.360factors.com${href}`;
        cy.get(locators.riskReview.clickhere, { timeout: 100000 })
          .invoke("removeAttr", "target")
          .click(); // Spy on window.open
      });
  }

  clickRiskReview() {
    // I add wait because risk register takes time to open, and it has also iframe.
    cy.wait(8000);
    cy.switchIframe("#mytarget").then(($iframe) => {
      cy.get($iframe).as("iframe");
      cy.get("@iframe").find(locators.riskReview.externalLink).as("find");

      cy.get("@find")
        .contains("Review Business Unit Risks")
        .invoke("attr", "href")
        .then((href) => {
          cy.log("Extracted Href:", href); // Debugging
          cy.visit(href); // Navigate if needed
        });
    });
  }

  OnriskReview() {
    testData.customfieldsNames.forEach((fieldName) => {
      cy.get(locators.riskReview.scrollRight)
        .scrollTo("right", { duration: 5000 })
        .then(() => {
          cy.get(locators.riskReview.headCell) // Get header labels
            .should("be.visible")
            .contains(fieldName, { timeout: 10000 })
            .click();
        });
    });
  }

  clickonRCSA() {
    cy.visitRiskRegister();
    this.clickoncolumns();
    this.clickonRiskcontrol();
    this.clickonRiskRegister();
    this.ClickoncolumnButton();
    this.clickCheckbox();
    this.reloadPage();
    this.clickthreedot();
    this.startRcsa();
    this.currentDate();
    this.selectBusinessUnit();
    this.clickonYesbutton();
    this.clickhere();
    this.clickonRiskviewlable();
    this.OnriskReview();
  }
}

export default NotificationSettings;
