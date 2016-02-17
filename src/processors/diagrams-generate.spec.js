var _ = require('lodash');
var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("diagrams-generate processor", function() {
  var templateFolder, deployments, docs, diagramMap;

  beforeEach(function() {

    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    diagramMap = injector.get('diagramMap');
    diagramMap.set('diagram-foo', {
      id: 'diagram-foo',
      doc: content,
    });

    processor = injector.get('generateDiagramsProcessor');

    processor.$process(docs);

  });
});
