var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("extractDiagramsProcessor", function() {

  var processor, diagramMap;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    processor = injector.get('extractDiagramsProcessor');
    diagramMap = injector.get('diagramMap');
  });

  it("should extract diagram tags from the doc content", function() {
    var docs = [
      {
        content: 'some text <diagram name="foo" >graph TB\nfoo</diagram> more text\n' +
                 'some text <diagram name="bar" >graph TB\nbar-->foo</diagram> more text\n'
      },
      {
        content: 'text \n<diagram>gantt</diagram>'
      },
      {
        content: 'some text <diagram name="bar" >graph TB\na-->b</diagram> more text\n'
      },
      {
        content: 'some text <diagram name="bar" >graph LR\ne</diagram> more text\n'
      }
    ];
    processor.$process(docs);
    expect(diagramMap.get('diagram-foo')).toEqual(jasmine.objectContaining({ name:'foo', id: 'diagram-foo', content: 'graph TB\nfoo' }));
    expect(diagramMap.get('diagram-bar')).toEqual(jasmine.objectContaining({ name:'bar', id: 'diagram-bar', content: 'graph TB\nbar-->foo' }));
    expect(diagramMap.get('diagram')).toEqual(jasmine.objectContaining({ id: 'diagram', content: 'gantt' }));
    expect(diagramMap.get('diagram-bar1')).toEqual(jasmine.objectContaining({ name: 'bar', id: 'diagram-bar1', content: 'graph TB\na-->b' }));
    expect(diagramMap.get('diagram-bar2')).toEqual(jasmine.objectContaining({ name: 'bar', id: 'diagram-bar2', content: 'graph LR\ne' }));
  });


  it("should compute unique ids for each diagram", function() {
    var docs = [{
      content: '<diagram name="bar">diagram 1</diagram>\n' +
               '<diagram name="bar">diagram 2</diagram>'
    }];
    processor.$process(docs);
    expect(diagramMap.get('diagram-bar').id).toEqual('diagram-bar');
    expect(diagramMap.get('diagram-bar1').id).toEqual('diagram-bar1');
  });

  it("should inject a new set of elements in place of the diagram into the original markup to be used by the template", function() {
    doc = {
      content: 'Some content before <diagram name="bar">some diagram content 1</diagram> and some after'
    };

    processor.$process([doc]);

    expect(doc.content).toEqual('Some content before {@diagram diagram-bar} and some after');

  });

});