import locators from "../../../fixtures/locators.json";
import dayjs from "dayjs";

export default class AddQB_PO {
  AddQB(QBName) {
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.administration).click();
    cy.get(locators.administration.Assessment).click();
    cy.get(locators.administration.QuestionBanks).click();
    cy.get(locators.administration.MyQuestionBanks).click();
    cy.get(locators.administration.QB.qbAdd).click();
    cy.get(locators.administration.QB.qbName).type(QBName);
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);
    cy.get(locators.administration.QB.qbName).type(timeStamp);

    cy.get(locators.administration.QB.FrameworkDropown).click();
    cy.get(locators.administration.QB.FrameWorkValue).click();
    cy.get(locators.administration.QB.TypeDropdown).select(
      "Simple Exception QB"
    );
    cy.get(locators.administration.QB.saveBtn).click();
    cy.get(locators.administration.QB.QBTab).click();
    cy.get(locators.administration.QB.AddQuestion).click();
  }
}
