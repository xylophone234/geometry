function testCircleGeneral() {
  var circle = new bay.geom.base.CircleGeneral(1, 2, 5);
  assert(circle.isExists());
  assertRoughlyEquals(1, circle.centerPoint.x, 1e-9);
  assertRoughlyEquals(2, circle.centerPoint.y, 1e-9);
  assertRoughlyEquals(5, circle.radius, 1e-9);
}

function testCircleNonexistent() {
  var circle = new bay.geom.base.CircleGeneral(0, 0, null);
  assertFalse(circle.isExists());
}

function testCircleIntersection() {
  var circle1 = new bay.geom.base.CircleGeneral(0, 0, 5);
  var circle2 = new bay.geom.base.CircleGeneral(0, 8, 5);
  var point = new bay.geom.base.Point_2c(circle1, circle2, 1);
  assert(point.isExists());
  assertRoughlyEquals(3, point.x, 1e-9);
  assertRoughlyEquals(4, point.y, 1e-9);
}

function testCircleTouch() {
  var circle1 = new bay.geom.base.CircleGeneral(0, 0, 4);
  var circle2 = new bay.geom.base.CircleGeneral(8, 0, 4);
  var point1 = new bay.geom.base.Point_2c(circle1, circle2, 0);
  assert(point1.isExists());
  assertRoughlyEquals(4, point1.x, 1e-9);
  assertRoughlyEquals(0, point1.y, 1e-9);
  var point2 = new bay.geom.base.Point_2c(circle1, circle2, 1);
  assert(point2.isExists());
  assertRoughlyEquals(4, point2.x, 1e-9);
  assertRoughlyEquals(0, point2.y, 1e-9);
}

function testCircleNonIntersecting() {
  var circle1 = new bay.geom.base.CircleGeneral(20, 10, 4);
  var circle2 = new bay.geom.base.CircleGeneral(8, 0, 4);
  var point = new bay.geom.base.Point_2c(circle1, circle2, 0);
  assertFalse(point.isExists());
}

function testCircleDistance() {
  var circle = new bay.geom.base.CircleGeneral(10,10,10);
  var point = new bay.geom.base.PointFree(6,7);
  assertRoughlyEquals(5, circle.distanceTo(point), 1e-9);
}

function testCircleDistanceToNonexistent() {
  var circle = new bay.geom.base.CircleGeneral(10,10,10);
  var point = new bay.geom.base.PointFree(6,null);
  assertNaN(circle.distanceTo(point));
}

function testCircleLineIntersection() {
  var circle = new bay.geom.base.CircleGeneral(0,0,Math.sqrt(2));
  var line = new bay.geom.base.LineGeneral(1,-1,0);
  var point = new bay.geom.base.Point_lc(line, circle, 1);
  assert(point.isExists());
  assertRoughlyEquals(1, point.x, 1e-9);
  assertRoughlyEquals(1, point.y, 1e-9);
}

function testCircleDelete() {
  var point1 = new bay.geom.base.PointFree(0,0);
  var point2 = new bay.geom.base.PointFree(-2,2);
  var point3 = new bay.geom.base.PointFree(-5,5);
  var circle = new bay.geom.base.Circle_3p(point1, point2, point3);
  assertEquals(1, point1.dependant.length);
  assertEquals(1, point2.dependant.length);
  assertEquals(1, point3.dependant.length);
  circle.deleteElement();
  assertEquals(0, point1.dependant.length);
  assertEquals(0, point2.dependant.length);
  assertEquals(0, point3.dependant.length);
}

