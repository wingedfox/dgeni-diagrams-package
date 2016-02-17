/**
 * @dgService diagramInlineTagDef
 * @description
 * Inject the specified diagram into the doc
 */
module.exports = function diagramInlineTagDef(diagramMap, createDocMessage) {
  return {
    name: 'diagram',

    handler: function(doc, tagName, description) {

      // The tag description should contain the id of the diagram doc
      var diagram = diagramMap.get(description);
      if ( !diagram ) {
        throw new Error(createDocMessage('No diagram exists with id "' + description + '".', doc));
      }

      return '<div class="diagram mermaid">' + diagram.renderedContent + '</div>';
    }
  };
};