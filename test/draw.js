function testDrawAreaCreateByString() {
  var area = new bay.geom.draw.Area('testArea');
  assertNotNull(area.getContentElement());
  assertNotNull(area.getHoverDist());
}

function testDrawAreaCreateByDom() {
  var area = new bay.geom.draw.Area(goog.dom.getElement('testArea'));
  assertNotNull(area.getContentElement());
  assertNotNull(area.getHoverDist());
}

function testDrawAreaCollection() {
  var area = new bay.geom.draw.Area('testArea');
  assertNotNull(area.getMainCollection());
  assertEquals(0, area.getMainCollection().getElements().length);
  assertEquals(0, area.getGeomElements().length);
}

function testDrawAreaTransform() {
  var area = new bay.geom.draw.Area('testArea');
  var vec = new bay.geom.base.Vector(2,3);
  var transformed = area.transform(vec);
  assertNotNull(transformed);
  assert(transformed instanceof bay.geom.base.Vector);
}

function testDrawAreaReverseTransform() {
  var area = new bay.geom.draw.Area('testArea');
  var vec = new bay.geom.base.Vector(2,3);
  var transformed = area.reverseTransform(area.transform(vec));
  assertNotNull(transformed);
  assert(transformed instanceof bay.geom.base.Vector);
  assertRoughlyEquals(vec.x, transformed.x, 1e-9);
  assertRoughlyEquals(vec.y, transformed.y, 1e-9);
}
