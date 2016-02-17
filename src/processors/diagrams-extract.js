var _ = require('lodash');

var DIAGRAM_REGEX = /<diagram([^>]*)>([\S\s]+?)<\/diagram>/g;
var ATTRIBUTE_REGEX = /(?:^\s*|\s+)([^=]+)\s*=\s*(?:(["'])(.*?))\2/g; // "

/**
 * @dgProcessor extractDiagramsProcessor
 * @description
 * Search the documentation for diagrams that need to be extracted
 */
module.exports = function extractDiagramsProcessor(log, diagramMap, trimIndentation, createDocMessage) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['parsing-tags'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        try {
          doc.content = doc.content.replace(DIAGRAM_REGEX, function processDiagram(match, attributeText, diagramText) {

            var diagram = extractAttributes(attributeText);
            var id = uniqueName(diagramMap, diagram.name ? 'diagram-' + diagram.name : 'diagram');
            diagram.id = id;
            diagram.content = diagramText;

            // store the diagram information for later
            log.debug('Storing diagram: %s',id);
            diagramMap.set(id, diagram);

            return '{@diagram ' + id + '}';
          });
        } catch(error) {
          throw new Error(createDocMessage('Failed to parse diagrams', doc, error));
        }
      });
    }
  };

  function extractAttributes(attributeText) {
    var attributes = {};
    attributeText.replace(ATTRIBUTE_REGEX, function(match, prop, quot, val){
      attributes[prop] = val;
    });
    return attributes;
  }

  function uniqueName(containerMap, name) {
    if ( containerMap.has(name) ) {
      var index = 1;
      while(containerMap.has(name + index)) {
        index += 1;
      }
      name = name + index;
    }
    return name;
  }
};