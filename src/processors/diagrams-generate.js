var os = require('os');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var mermaid = require('mermaid/lib/');
var mermaidCss = fs.readFileSync(path.join(path.dirname(require.resolve('mermaid')), '../dist/mermaid.forest.css'));
//var phantomjs = require('phantomjs-prebuilt');
var phantomjs = require('phantomjs');
var phantomPath = phantomjs.path;
var Sync = require('sync');
var Q = require('q');

var TMP = os.tmpdir();
/**
 * @dgProcessor generateDiagramsProcessor
 * @description
 * Generates diagrams for use in docs
 */
module.exports = function generateDiagramsProcessor(log, diagramMap, createDocMessage) {

  return {
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {
      var defer = Q.defer();

      Sync(function () { 
        diagramMap.forEach(function(diagram) {

            var id = diagram.id;
            var diagramText = diagram.content;

            try {
              var inFile = path.join(TMP, id);
              var outDir = path.join(TMP, 'mermaid');
              var outFile = path.join(outDir, id);

              fs.writeFileSync(inFile, diagramText);
              mermaid.process.sync(null, [inFile], {
                outputDir: outDir,
                phantomPath: phantomPath,
                svg: true,
                css: mermaidCss,
                width: '600'
              })
              diagram.renderedContent = String(fs.readFileSync(outFile + '.svg')).replace(/class="(\w+)"/g, function(m, m1) {
                // TODO: remove hack when mermaid will be fixed - it lowercases inline styles in svg
                /* istanbul ignore else */ 
                if (m1) {
                  m1 = m1.toLowerCase();
                }
                return 'class="' + m1 + '"';
              });
            } catch(error) {
              defer.reject(new Error(createDocMessage('Failed to generate diagram', doc, error)));
            } 
        });

        defer.resolve(docs);
      });
      return defer.promise;
    }
  };
};