function testCollectionCount() {
  var collection = bay.geom.base.Create();
  assertNotNull(collection.getElements());
  assertEquals(0, collection.getElements().length);
  collection.add(new bay.geom.base.PointFree(1,1));
  collection.add(new bay.geom.base.PointFree(2,2));
  assertNotNull(collection.getElements());
  assertEquals(2, collection.getElements().length);
}

function testCollectionClear() {
  var collection = bay.geom.base.Create();
  collection.add(p1 = new bay.geom.base.PointFree(1,1));
  collection.add(p2 = new bay.geom.base.PointFree(2,2));
  collection.add(new bay.geom.base.Line_2p(p1, p2));
  assertNotNull(collection.getElements());
  assertEquals(3, collection.getElements().length);
  collection.clear();
  assertEquals(0, collection.getElements().length);
}

function testCollectionNeighbour() {
  var collection = bay.geom.base.Create();
  collection.add(p1 = new bay.geom.base.PointFree(0,0));
  collection.add(p2 = new bay.geom.base.PointFree(4,6));
  collection.add(new bay.geom.base.Line_2p(p1, p2));
  var list = collection.getNeighbourList(new bay.geom.base.Vector(2,3),0.1);
  assertEquals(1, list.length);
  assert(list[0].element instanceof bay.geom.base.Line_2p);
  var list = collection.getNeighbourList(new bay.geom.base.Vector(4,5.8),0.3, true, true);
  assertEquals(2, list.length);
  assert(list[0].element instanceof bay.geom.base.Line_2p);
  assert(list[1].element instanceof bay.geom.base.PointFree);
}

function testCollectionJson() {
  var collection = bay.geom.base.Create();
  collection.add(p1 = new bay.geom.base.PointFree(0,0));
  collection.add(p2 = new bay.geom.base.PointFree(4,6));
  collection.add(l1 = new bay.geom.base.Line_2p(p1, p2));
  assertEquals('[\n{"id": 0, "type": "PointFree", "x": 0, "y": 0},\n{"id": 1, "type": "PointFree", "x": 4, "y": 6},\n{"id": 2, "type": "Line_2p", "p1": 0, "p2": 1}\n]',collection.jsonCode());
}

function initCollection(){
  var collection = bay.geom.base.Create();
  collection.add(p1 = new bay.geom.base.PointFree(0,0));
  collection.add(p2 = new bay.geom.base.PointFree(4,6));
  collection.add(l1 = new bay.geom.base.Line_2p(p1, p2));
  collection.add(p3 = new bay.geom.base.PointFree(5,5));
  collection.add(l2 = new bay.geom.base.LineGeneral(1,2,3));
  collection.add(c1 = new bay.geom.base.Circle_3p(p1,p2,p3));
  collection.add(c2 = new bay.geom.base.CircleGeneral(5,6,7));
  collection.add(s = new bay.geom.base.Segment(p2,p3));
  return collection;
}

function testPointFreeJson() {
  var collection = initCollection();
  assertEquals('{"id": 0, "type": "PointFree", "x": 0, "y": 0}', p1.toJson(collection.getElements(), 0));
  assertEquals('{"id": 0, "type": "PointFree", "x": 4, "y": 6}', p2.toJson(collection.getElements(), 0));
  assertEquals('{"id": 0, "type": "PointFree", "x": 5, "y": 5}', p3.toJson(collection.getElements(), 0));
}

function testLineJson() {
  var collection = initCollection();
  assertEquals('{"id": 0, "type": "Line_2p", "p1": 0, "p2": 1}', l1.toJson(collection.getElements(), 0));
  assertEquals('{"id": 0, "type": "LineGeneral", "a": 1, "b": 2, "c": 3}',l2.toJson(collection.getElements(), 0));
  assertEquals('{"id": 3, "type": "Segment", "p1": 1, "p2": 3}',s.toJson(collection.getElements(), 3));
}

function testCircleJson() {
  var collection = initCollection();
  assertEquals('{"id": 0, "type": "Circle_3p", "p1": 0, "p2": 1, "p3": 3}',c1.toJson(collection.getElements(), 0));
  assertEquals('{"id": 6, "type": "CircleGeneral", "a": 5, "b": 6, "c": 7}',c2.toJson(collection.getElements(), 6));
}

function testPointFreeFromJson() {
  var collection = bay.geom.base.Create();
  var point = collection.parseJson('[{"id": 0, "type": "PointFree", "x": 4, "y": 7.5}]').getElements()[0];
  assert(point instanceof bay.geom.base.PointFree);
  assertEquals(4, point.x);
  assertEquals(7.5, point.y);
}

function testLineGeneralFromJson() {
  var collection = bay.geom.base.Create();
  var line = collection.parseJson('[{"id": 0, "type": "LineGeneral", "a": 1.1, "b": 2, "c": 3}]').getElements()[0];
  assert(line instanceof bay.geom.base.LineGeneral);
  assertEquals(1.1, line.a);
  assertEquals(2, line.b);
  assertEquals(3, line.c);
}

function testCircleGeneralFromJson() {
  var collection = bay.geom.base.Create();
  var circle = collection.parseJson('[{"id": 0, "type": "CircleGeneral", "a": 5, "b": 6, "c": 7}]').getElements()[0];
  assert(circle instanceof bay.geom.base.CircleGeneral);
  assertEquals(5, circle.a);
  assertEquals(6, circle.b);
  assertEquals(7, circle.c);
}

