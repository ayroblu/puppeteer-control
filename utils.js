async function isElementVisible(element) {
  return element.evaluate(node => {
    return !!(
      node &&
      (node.offsetWidth || node.offsetHeight || node.getClientRects().length)
    );
  });
}
module.exports = { isElementVisible };
