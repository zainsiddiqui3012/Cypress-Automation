const fileName = "exportFile";
const filePath = `../cypress/fixtures/Examples/myExportData/${fileName}.xlsx`;
const outputFilePath = `cypress/fixtures/Examples/myExportData/${fileName}.json`;
const fixtureFile = `Examples/${fileName}.json`;
const dataFile = `Examples/Data/dataFile.json`;
import * as XLSX from "xlsx";

describe("This is an example test file for Export file functionality", () => {
  let sheetNames = [];
  let fileData = {};
  before(() => {
    cy.parseXlsx(filePath).then((jsonData) => {
      cy.exportXlsxFile(jsonData, outputFilePath);
    });
  });

  beforeEach(() => {
    cy.fixture(fixtureFile).as("exportFile");
    cy.fixture(dataFile).as("dataFile");
    cy.get("@dataFile").then((dataFile) => {
      sheetNames = dataFile.sheetNames;
      fileData = dataFile;
    });
  });

  it.only("Example test for Export Functionality", () => {
    cy.get("@exportFile")
      .should("not.be.empty")
      .should("be.a", "object")
      .then((file) => {
        sheetNames.forEach((sheetName, index, list) => {
          // expect(file[sheetName], `${sheetName} should not be empty`).to.not.to
          //   .be.empty;
        });

        expect(file["KxI Definitions"][0].Id).eq(fileData.kxidef.id);
      });
  });

  it("Import Functionality", () => {
    cy.readFile(outputFilePath).then((file) => {
      file["KxI Definitions"][0].Id = 6220;
      expect(file).to.be.a("object");

      const sheet = XLSX.utils.json_to_sheet(file);
      XLSX.writeFile(sheet, "cypress/fixtures/Examples/importFile.xlsx");

      // cy.writeFile(outputFilePath, file);
    });
  });
});
