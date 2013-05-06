function testPointFree() {
  var point = new bay.geom.base.PointFree(1,-5);
  var point1 = new bay.geom.base.PointFree(point);
  assert(point.isExists());
  assertEquals(1, point.x);
  assertEquals(-5, point.y);
  point.moveTo(5,7);
  assert(point.isExists());
  assertEquals(5, point.x);
  assertEquals(7, point.y);
  assert(point1.isExists());
  assertEquals(1, point1.x);
  assertEquals(-5, point1.y);
}

function testPointNonexistent() {
  var point = new bay.geom.base.PointFree(1,null);
  assertFalse(point.isExists());
}

function testPointMoveToNonexistent() {
  var point = new bay.geom.base.PointFree(200,10000);
  assert(point.isExists());
  assertEquals(200, point.x);
  assertEquals(10000, point.y);
  point.moveTo(-68687,null);
  assertFalse(point.isExists());
}

function testPointNonexistentMove() {
  var point = new bay.geom.base.PointFree(1,null);
  assertFalse(point.isExists());
  point.moveTo(15,-48);
  assert(point.isExists());
  assertEquals(15, point.x);
  assertEquals(-48, point.y);
}

function testPointDistance() {
  var point1 = new bay.geom.base.PointFree(0,0);
  var point2 = new bay.geom.base.PointFree(6,8);
  assertRoughlyEquals(10, point1.distanceTo(point2), 1e-9);
}

function testPointDistanceToNonexistent() {
  var point1 = new bay.geom.base.PointFree(0,0);
  var point2 = new bay.geom.base.PointFree(6,null);
  assertNaN(point1.distanceTo(point2));
}

