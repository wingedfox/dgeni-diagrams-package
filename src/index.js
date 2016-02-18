var path = require('path');
var packagePath = __dirname;
var Package = require('dgeni').Package;

/**
 * @dgPackage diagrams
 * @description Processors to support the diagrams.
 */
module.exports = new Package('diagrams', ['jsdoc'])

.processor(require('./processors/diagrams-extract'))
.processor(require('./processors/diagrams-generate'))

.factory(require('./services/diagramMap'))
.factory(require('./inline-tag-defs/diagram'))

.config(function(templateFinder) {
  templateFinder.templateFolders.push(path.resolve(packagePath, 'templates'));

})

.config(function(inlineTagProcessor, diagramInlineTagDef) {
  inlineTagProcessor.inlineTagDefinitions.push(diagramInlineTagDef);
});
