var StringMap = require('stringmap');

/**
 * @dgService diagramMap
 * @description
 * A map of diagrams parsed out of the doc content, keyed on
 */
module.exports = function diagramMap() {
  return new StringMap();
};