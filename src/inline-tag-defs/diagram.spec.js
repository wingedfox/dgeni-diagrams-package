var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("diagramInlineTagDef", function() {

  var diagramMap, tagDef;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    diagramMap = injector.get('diagramMap');
    diagramMap.set('some-diagram', {
      renderedContent: 'The rendered content of the some-diagram diagram'
    });
    tagDef = injector.get('diagramInlineTagDef');
  });

  it("should have the correct name", function() {
    expect(tagDef.name).toEqual('diagram');
  });

  it("should lookup the diagramDoc identified in the tag description and return its renderedContent", function() {
    expect(tagDef.handler({}, 'diagram', 'some-diagram')).toEqual('<div class="diagram mermaid">The rendered content of the some-diagram diagram</div>');
  });
});