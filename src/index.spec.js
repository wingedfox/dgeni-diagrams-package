var diagramsPackage = require('./index');
var ngdocPackage = require('dgeni-packages/ngdoc/index');

var Dgeni = require('dgeni');
var mockLog = require('dgeni/lib/mocks/log');



describe('diagrams package', function() {
  it("should be instance of Package", function() {
      expect(diagramsPackage instanceof Dgeni.Package).toBeTruthy();
  });

  var _diagramMap;

  function runDgeni(docs) {
    var testPackage = new Dgeni.Package('testPackage', [diagramsPackage, ngdocPackage])
      .factory('log', function() { return mockLog(false); })
      .processor('provideTestDocs', function() {
        return {
          $runBefore: ['extractDiagramsProcessor'],
          $process: function() {
            return docs;
          }
        };
      })

      .config(function(readFilesProcessor, writeFilesProcessor, renderDocsProcessor, unescapeCommentsProcessor, diagramMap) {
        readFilesProcessor.$enabled = false;
        writeFilesProcessor.$enabled = false;
        renderDocsProcessor.$enabled = false;
        unescapeCommentsProcessor.$enabled = false;
        _diagramMap = diagramMap;
      })

    return new Dgeni([testPackage]).generate();
  }

  function processDiagram() {
    var doc = {
      content:
        '/** @ngdoc service\n' +
        ' * @description\n' +
        ' * <diagram name="testDiagram">\n' +
        ' *   graph TB\na-->b\n' +
        ' * </diagram>\n' +
        ' */',
    };

    return runDgeni([doc]).then(null, function(err) {
      console.log("ERROR:", err);
    });
  }


  it("should not generate additional docs", function(done) {
    processDiagram().then(function(docs) {

      expect(docs.length).toEqual(0);

      done();
    });
  });

  it("should add generated diagram to the map", function(done) {
    processDiagram().then(function(docs) {
      expect(_diagramMap.get('diagram-testDiagram')).not.toBeUndefined();

      done();
    });
  });
});
