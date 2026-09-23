// Search for the message
const serverID = "xkwuqv1n";
const email = `testmailosaur@${serverID}.mailosaur.net`;

describe(
  "Email Example",
  {
    tags: ["@email-example"],
  },
  () => {
    it("Search for the message", () => {
      // Make a simple API call to find the name of your inbox
      cy.mailosaurListServers().then((result) => {
        cy.log(`Inbox name is ${result.items[0].name}`);
      });

      cy.mailosaurGetMessage(serverID, {
        sentTo: email,
      }).then((message) => {
        // Perform test assertions
        cy.log(`Subject: ${message.subject}`);
        cy.log(`From: ${message.from[0].email}`);
        cy.log(`Body: ${message.html.body}`);
      });
    });

    it("Email Example test", { tags: "@email" }, () => {
      expect(true).to.be.true;
    });
  }
);
