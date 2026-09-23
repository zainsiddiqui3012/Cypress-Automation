import locators from "../../../../fixtures/locators.json";
const loc = locators.cms.regChange.workflows;

class RegChangeFlowsHelper {
  switchToIframe() {
    cy.frameLoaded(loc.iframe);
    cy.iframe(loc.iframe).as("regChangeFrame");
    cy.wait(1000);
  }
  withinRegChangeFrame(callback) {
    cy.frameLoaded(loc.iframe);
    cy.iframe(loc.iframe).within(callback);
  }
}

export default RegChangeFlowsHelper;
