describe("Example test suite for Database testing", () => {
  it.skip("How to get results using Select statement", () => {
    const sql = "SHOW COLUMNS FROM predict360.riskappetiteregisteritem;";
    cy.query(sql).then((res) => {
      // expect(res).contains('createdBy')
      res.forEach((element) => {
        if (element.Field === "createdBy") {
          console.log("found field " + element.Field);
          return;
        }
      }); // outputs json array of selected rows
    });
  });

  it.skip("How to assert the query result object", () => {
    const sql =
      "SELECT * FROM riskregister WHERE riskName LIKE '%Test%' ORDER BY id desc LIMIT 5";
    cy.query(sql).then((res) => {
      expect(res[0].riskRegisterItemId).eq(
        464280,
        "First result of query has Risk Register Item Id as 464280"
      );
      expect(res[0].riskName).contain(
        "Automation Testing",
        "First result of query should contains Automation Testing in Risk Name value"
      );
      expect(res).to.have.length.gt(1, "Results should be greater than 1");
    });
  });

  it.skip("Comparing Created Time values after running of scheduler", () => {
    const query = `select * FROM kridata kd join kridefination k on k.id = kd.kriDefinationId WHERE kd.sampleDate BETWEEN DATE_SUB(CURDATE(), INTERVAL 5 MONTH) AND NOW() and k.fredSeriesId is not NULL;`;

    cy.query(query).then((res) => {
      res.forEach((result) => {
        console.log(result);
        console.log(result.createdDate);

        const date = new Date(result.createdDate);
        const today = new Date();

        expect(date).to.be.lte(today);
      });
    });
  });
});
