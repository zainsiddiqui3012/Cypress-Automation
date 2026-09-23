import APIExample from "../../fixtures/Examples/API/APIExample.json";

describe("API Example", () => {
  const calls = APIExample.getAllUsers;
  calls.forEach((apiCall) => {
    it(apiCall.name, () => {
      cy.request(apiCall.request).then((response) => {
        expect(response).to.not.empty;
        expect(response.status).to.eq(apiCall.response.statusCode);
        expect(response.body).to.deep.eq(apiCall.response.body);
      });
    });
  });
});
