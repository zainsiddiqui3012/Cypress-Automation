import locators from "../../../../../fixtures/locators.json";
class TreeHelper {
  /**
   * Expand tree node
   * @param {string} nodeText - Text of the node to expand
   */
  static expandNode(nodeText) {
    cy.contains(
      locators.risk.administration.treeOperations.containsRiskCategory,
      nodeText
    )
      .parent()
      .siblings(locators.risk.administration.treeOperations.treeBtn)
      .find(locators.risk.administration.treeOperations.treePush)
      .click();
  }

  /**
   * Collapse tree node
   * @param {string} nodeText - Text of the node to collapse
   */
  static collapseNode(nodeText) {
    cy.contains(locators.risk.administration.treeOperations.treeText, nodeText)
      .parent()
      .siblings(locators.risk.administration.treeOperations.treeBtn)
      .find(locators.risk.administration.treeOperations.treePush)
      .click();
  }

  /**
   * Click expand all link
   * @param {string} categoryName - Name of the category to expand all
   */
  static expandAll(categoryName) {
    cy.contains(
      locators.risk.administration.treeOperations.treeText,
      categoryName
    )
      .should("be.visible")
      .closest(locators.risk.administration.treeOperations.treeEntry)
      .contains("Expand All")
      .click();
  }

  /**
   * click expand when asking in expand window
   */
  static askExpandBtn() {
    cy.get(".btn").contains("Expand").dblclick({ delay: 1000 }).click({ force: true });
  }

  /**
   * Click expand all link
   * @param {string} categoryName - Name of the category to expand all
   */
  static expandControlCategory(categoryName) {
    cy.contains(
      locators.risk.administration.treeOperations.treeText,
      categoryName
    )
      .should("be.visible")
      .closest(locators.risk.administration.treeOperations.treeEntry)
      .find(locators.risk.administration.treeOperations.treePush)
      .click();
  }

  /**
   * Click collapse all link
   */
  static collapseAll() {
    cy.contains(
      locators.risk.administration.treeOperations.treeColumn,
      "Collapse All"
    ).click();
  }

  /**
   * Delete tree item with confirmation
   * @param {string} itemName - Name of the item to delete
   * @param {boolean} confirm - Whether to confirm deletion
   */
  static deleteTreeItem(itemName, confirm = true) {
    cy.contains(locators.risk.administration.treeOperations.treeText, itemName)
      .parent()
      .parent()
      .find(locators.risk.administration.treeOperations.deleteTreeItem)
      .click();

    if (confirm) {
      cy.get(locators.risk.administration.treeOperations.confirmationDialog)
        .should("be.visible")
        .filter(":visible")
        .within(() => {
          cy.contains("button", "Delete", { matchCase: false }).click();
        });
    } else {
      cy.get(locators.risk.administration.treeOperations.confirmationDialog)
        .should("be.visible")
        .filter(":visible")
        .within(() => {
          cy.contains("button", "Cancel", { matchCase: false }).click();
        });
    }
  }

  /**
   * Verify tree node exists
   * @param {string} nodeText - Text of the node to verify
   */
  static verifyNodeExists(nodeText) {
    cy.contains(
      locators.risk.administration.treeOperations.treeText,
      nodeText
    )
    .scrollIntoView()
    // .should("be.visible");
  }

  /**
   * Verify tree node does not exist
   * @param {string} nodeText - Text of the node to verify doesn't exist
   */
  static verifyNodeNotExists(nodeText) {
    cy.contains(
      locators.risk.administration.treeOperations.treeText,
      nodeText
    ).should("not.exist");
  }

  /**
   * Verify node is expanded
   * @param {string} nodeText - Text of the node to check
   */
  static verifyNodeExpanded(nodeText) {
    cy.contains(locators.risk.administration.treeOperations.treeText, nodeText)
      .closest(locators.risk.administration.treeOperations.treeLi)
      .should("have.class", "aciTreeOpen");
  }

  /**
   * Verify node is collapsed
   * @param {string} nodeText - Text of the node to check
   */
  static verifyNodeCollapsed(nodeText) {
    cy.contains(locators.risk.administration.treeOperations.treeText, nodeText)
      .closest(locators.risk.administration.treeOperations.treeLi)
      .should("not.have.class", "aciTreeOpen");
  }
}

export default TreeHelper;