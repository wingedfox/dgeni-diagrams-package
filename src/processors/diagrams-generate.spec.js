var _ = require('lodash');
var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("diagrams-generate processor", function() {
  var diagramMap, injector, docs = [];

  beforeEach(function() {

    var dgeni = new Dgeni([mockPackage()]);
    injector = dgeni.configureInjector();

    diagramMap = injector.get('diagramMap');

  });

  it('should provide rendered content', function (done) {
    diagramMap.set('diagram-foo', {
      id: 'diagram-foo',
      content: 'graph TB;\na-->b;',
    });

    processor = injector.get('generateDiagramsProcessor');

    processor.$process(docs).then(function () {
      expect(diagramMap.get('diagram-foo').renderedContent).not.toBeUndefined();
      done();
    });
  });

  it('should throw error if malformed diagram rendered', function (done) {
    diagramMap.set('diagram-bar', {
      content: 'graph Z',
    });

    processor = injector.get('generateDiagramsProcessor');

    processor.$process(docs).catch(function (error) {
      expect(diagramMap.get('diagram-bar').renderedContent).toBeUndefined();
      expect(error).not.toBeUndefined();
      done();
    });
  });
});
