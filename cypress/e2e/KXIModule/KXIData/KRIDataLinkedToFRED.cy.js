import query from "../../../fixtures/KXIModule/FredQuery.json";
describe(
  "Inaccurate Unemployment Rate KRI Data Linked to FRED",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd20758",
      "@release5.17",
      "@predict",
      "@customer",
    ],
  },
  () => {
    it("Comparing Created Time values after running of scheduler", () => {
      cy.query(query.FredQuery).then((res) => {
        // Assuming res is an array of objects with createdDate field
        res.forEach((result) => {
          let date = new Date(
            result.createdDate.toLocaleString("en-US", {
              timeZone: "Asia/Karachi",
              hour12: false,
            })
          );

          let today = new Date();
          today.setHours(today.getHours() - 10);

          expect(date).to.be.lte(today);
        });
      });
    });
  }
);
