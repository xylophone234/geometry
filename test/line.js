function testLineGeneral() {
  var line = new bay.geom.base.LineGeneral(1, -1, 0);
  assert(line.isExists());
  assertRoughlyEquals(1, line.direction.x / line.direction.y, 1e-9);
}

function testLineGeneralVertical() {
  var line = new bay.geom.base.LineGeneral(1, 0, 5);
  assert(line.isExists());
  assertRoughlyEquals(0, line.direction.x, 1e-9);
}

function testLineGeneralHorisontal() {
  var line = new bay.geom.base.LineGeneral(0, 2, 5);
  assert(line.isExists());
  assertRoughlyEquals(0, line.direction.y, 1e-9);
}

function testLineGeneralNonexistent() {
  var line = new bay.geom.base.LineGeneral(0, 0, 5);
  assertFalse(line.isExists());
  assertEquals("Line does not exist", line.toString());
}

function testLineGeneralParallel() {
  var line1 = new bay.geom.base.LineGeneral(2, 1, 3);
  var line2 = new bay.geom.base.LineGeneral(4, 2, 0);
  var point = new bay.geom.base.Point_2l(line1, line2)
  assertFalse(point.isExists());
}

function testLineGeneralIntersection() {
  var line1 = new bay.geom.base.LineGeneral(2, 1, 3);
  var line2 = new bay.geom.base.LineGeneral(1, 3, 5);
  var point = new bay.geom.base.Point_2l(line1, line2)
  assert(point.isExists());
  assertRoughlyEquals(0.8, point.x, 1e-9);
  assertRoughlyEquals(1.4, point.y, 1e-9);
}

function testLineTwoPoint() {
  var point1 = new bay.geom.base.PointFree(0,0);
  var point2 = new bay.geom.base.PointFree(5,5);
  var line = new bay.geom.base.Line_2p(point1, point2);
  assert(line.isExists());
  assertRoughlyEquals(0, line.startPoint.x, 1e-9);
  assertRoughlyEquals(0, line.startPoint.y, 1e-9);
  assertRoughlyEquals(1, line.direction.x / line.direction.y, 1e-9);
}

function testLineTwoPointNonexistent() {
  var point1 = new bay.geom.base.PointFree(0,0);
  var point2 = new bay.geom.base.PointFree(5,null);
  var line = new bay.geom.base.Line_2p(point1, point2);
  assertFalse(line.isExists());
}

function testLineTwoPointMovePoint() {
  var point1 = new bay.geom.base.PointFree(0,0);
  var point2 = new bay.geom.base.PointFree(-2,2);
  var line = new bay.geom.base.Line_2p(point1, point2);
  assert(line.isExists());
  assertRoughlyEquals(0, line.startPoint.x, 1e-9);
  assertRoughlyEquals(0, line.startPoint.y, 1e-9);
  assertRoughlyEquals(-1, line.direction.x / line.direction.y, 1e-9);
  point2.moveTo(0, 5);
  assertRoughlyEquals(0, line.startPoint.x, 1e-9);
  assertRoughlyEquals(0, line.startPoint.y, 1e-9);
  assertRoughlyEquals(0, line.direction.x, 1e-9);
}

function testLineSegment() {
  var point1 = new bay.geom.base.PointFree(1,1);
  var point2 = new bay.geom.base.PointFree(5,5);
  var segment = new bay.geom.base.Segment(point1, point2);
  assert(segment.isExists());
  assertRoughlyEquals(1, segment.startPoint.x, 1e-9);
  assertRoughlyEquals(1, segment.startPoint.y, 1e-9);
  assertRoughlyEquals(4, segment.direction.x, 1e-9);
  assertRoughlyEquals(4, segment.direction.y, 1e-9);
  assertRoughlyEquals(4 * Math.sqrt(2), segment.length(), 1e-9);
}

function testLineSegmentNonexistent() {
  var point1 = new bay.geom.base.PointFree(8,16);
  var point2 = new bay.geom.base.PointFree(345,null);
  var segment = new bay.geom.base.Segment(point1, point2);
  assertFalse(segment.isExists());
}

function testLineSegmentChange() {
  var point1 = new bay.geom.base.PointFree(10,10);
  var point2 = new bay.geom.base.PointFree(5,5);
  var segment = new bay.geom.base.Segment(point1, point2);
  assert(segment.isExists());
  assertRoughlyEquals(10, segment.startPoint.x, 1e-9);
  assertRoughlyEquals(10, segment.startPoint.y, 1e-9);
  assertRoughlyEquals(-5, segment.direction.x, 1e-9);
  assertRoughlyEquals(-5, segment.direction.y, 1e-9);
  assertRoughlyEquals(5 * Math.sqrt(2), segment.length(), 1e-9);
  point1.moveTo(0, 5);
  assertRoughlyEquals(0, segment.startPoint.x, 1e-9);
  assertRoughlyEquals(5, segment.startPoint.y, 1e-9);
  assertRoughlyEquals(0, segment.direction.y, 1e-9);
  assertRoughlyEquals(5, segment.length(), 1e-9);
}

function testLineDistance() {
  var line = new bay.geom.base.LineGeneral(1,-1,0);
  var point = new bay.geom.base.PointFree(0,2);
  assertRoughlyEquals(Math.sqrt(2), line.distanceTo(point), 1e-9);
}

function testLineDistanceToNonexistent() {
  var line = new bay.geom.base.LineGeneral(10,10,10);
  var point = new bay.geom.base.PointFree(6,null);
  assertNaN(line.distanceTo(point));
}

function testLineSegmentDistance() {
  var point1 = new bay.geom.base.PointFree(1,1);
  var point2 = new bay.geom.base.PointFree(5,5);
  var segment = new bay.geom.base.Segment(point1, point2);
  assertRoughlyEquals(0, segment.distanceTo(point1), 1e-9);
  assertRoughlyEquals(0, segment.distanceTo(point2), 1e-9);
  var point = new bay.geom.base.PointFree(0,0);
  assertRoughlyEquals(Math.sqrt(2), segment.distanceTo(point), 1e-9);
  point = new bay.geom.base.PointFree(5,7);
  assertRoughlyEquals(2, segment.distanceTo(point), 1e-9);
  point = new bay.geom.base.PointFree(4,0);
  assertRoughlyEquals(2*Math.sqrt(2), segment.distanceTo(point), 1e-9);
}

function testLineDelete() {
  var point1 = new bay.geom.base.PointFree(0,0);
  var point2 = new bay.geom.base.PointFree(-2,2);
  var point3 = new bay.geom.base.PointFree(-2,2);
  var line1 = new bay.geom.base.Line_2p(point1, point2);
  var line2 = new bay.geom.base.Line_2p(point2, point3);
  assertEquals(1, point1.dependant.length);
  assertEquals(2, point2.dependant.length);
  assertEquals(1, point3.dependant.length);
  line1.deleteElement();
  assertEquals(0, point1.dependant.length);
  assertEquals(1, point2.dependant.length);
  assertEquals(1, point3.dependant.length);
  line2.deleteElement();
  assertEquals(0, point1.dependant.length);
  assertEquals(0, point2.dependant.length);
  assertEquals(0, point3.dependant.length);
}

