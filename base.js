goog.provide('bay.geom.base')

// *************************************** Element **************************************** //
bay.geom.base.Element = function(){
  this.label = '';
  this.exists = false;
  this.dependant = [];
  this.needRecalc = false;
}

bay.geom.base.Element.prototype.recalcDependat = function(){
  if(this.dependant){
    for(var i=0;i < this.dependant.length;i++){
      if (this.dependant[i].recalc)
        this.dependant[i].recalc();
    }
  }
}

bay.geom.base.Element.prototype.deleteElement = function(){
}

bay.geom.base.Element.prototype.deleteDependant = function(obj){
  index = this.dependant.indexOf(obj);
  this.dependant.splice(index, 1);
}

bay.geom.base.Element.prototype.isExists = function(){
  return this.exists;
}

bay.geom.base.Element.prototype.distanceTo = function(p){
  if(!p || !p.exists || !this.exists) return NaN;
  return this.distance(p.x, p.y);
}

bay.geom.base.Vector = function(x, y){
  if (x instanceof bay.geom.base.Vector || x instanceof bay.geom.base.Point){
    this.x = x.x;
    this.y = x.y;
  }else{
    this.x = x;
    this.y = y;
  }
}

// *************************************** Point ******************************************* //
bay.geom.base.Point = function(){
  bay.geom.base.Element.call(this);
  this.intersectType = null;
  this.x = null;
  this.y = null;
}

goog.inherits(bay.geom.base.Point, bay.geom.base.Element);

bay.geom.base.Point.prototype.toString = function(){
  if(!this.exists) return 'Point does not exist';
  return 'Point: [' + this.x.toFixed(2) + ', ' + this.y.toFixed(2) + ']';
}

bay.geom.base.Point.prototype.distance = function(x, y){
  var to = new bay.geom.base.Vector(x,y);
  return Math.sqrt((to.x - this.x)*(to.x - this.x) + (to.y - this.y)*(to.y - this.y))
}

// *************************************** FreePoint ******************************************* //

bay.geom.base.PointFree = function(x, y){
  bay.geom.base.Point.call(this);
  this.moveTo(x, y);
}

goog.inherits(bay.geom.base.PointFree, bay.geom.base.Point);

bay.geom.base.PointFree.prototype.moveTo = function(x, y){
  bay.geom.base.Vector.call(this, x, y);
  this.recalc();
}

bay.geom.base.PointFree.prototype.recalc = function(){
  if(this.x != null && this.y != null)
    this.exists = true;
  else
    this.exists = false;
  this.recalcDependat();
}

// *************************************** TwoLineIntersectionPoint ******************************************* //
bay.geom.base.Point_2l = function(l1, l2){
  bay.geom.base.Point.call(this);
  this.obj1 = l1;
  this.obj2 = l2;
  l1.dependant.push(this);
  l2.dependant.push(this);
  this.recalc();
}

goog.inherits(bay.geom.base.Point_2l, bay.geom.base.Point);

bay.geom.base.Point_2l.prototype.deleteElement = function(){
  this.obj1.deleteDependant(this);
  this.obj2.deleteDependant(this);
}

bay.geom.base.Point_2l.prototype.recalc = function(){
  if (!this.obj1 || !this.obj2 || !this.obj1.exists || !this.obj2.exists){
    this.exists = false;
  }else{
    // two lines intersection points
    var a = this.obj1.direction.x;
    var b = this.obj1.direction.y;
    var a1 = this.obj2.direction.x;
    var b1 = this.obj2.direction.y;
    var d = a1*b - b1*a;
    // check if the lines are parallel
    if (d == 0){
      this.exists = false;
    }else{
      this.exists = true;
      var t = (b*(this.obj1.startPoint.x - this.obj2.startPoint.x) - a*(this.obj1.startPoint.y - this.obj2.startPoint.y))/d;
      this.x = this.obj2.startPoint.x + a1 * t;
      this.y = this.obj2.startPoint.y + b1 * t;
    }
  }
  this.recalcDependat();
}

// *************************************** TwoCircleIntersectionPoint ******************************************* //

bay.geom.base.Point_2c = function(c1, c2, num){
  bay.geom.base.Point.call(this);
  this.obj1 = c1;
  this.obj2 = c2;
  c1.dependant.push(this);
  c2.dependant.push(this);
  this.intersectNum = num;
  this.recalc();
}

goog.inherits(bay.geom.base.Point_2c, bay.geom.base.Point);

bay.geom.base.Point_2c.prototype.deleteElement = function(){
  this.obj1.deleteDependant(this);
  this.obj2.deleteDependant(this);
}

bay.geom.base.Point_2c.prototype.recalc = function(){
  if (!this.obj1 || !this.obj2 || !this.obj1.exists || !this.obj2.exists){
    this.exists = false;
  }else{
    // two circles intersection point
    var r1 = this.obj1.radius;
    var r2 = this.obj2.radius;
    var a = this.obj2.centerPoint.x - this.obj1.centerPoint.x;
    var b = this.obj2.centerPoint.y - this.obj1.centerPoint.y;
    var d2 = a*a + b*b;
    var d = Math.sqrt(a*a + b*b);
    if (d > r1+r2 || d < r2-r1 || d < r1-r2 || d==0){
      this.exists = false;
    }else{
      var p = (r1*r1 - r2*r2 + d2 ) / (2*d);
      var h = Math.sqrt( r1*r1 - p*p );
      var x = this.obj1.centerPoint.x + p*(this.obj2.centerPoint.x - this.obj1.centerPoint.x) / d;
      var y = this.obj1.centerPoint.y + p*(this.obj2.centerPoint.y - this.obj1.centerPoint.y) / d;
      this.exists = true;
      if (this.intersectNum == 1){
        this.x = x + h * (this.obj2.centerPoint.y - this.obj1.centerPoint.y) / d;
        this.y = y - h * (this.obj2.centerPoint.x - this.obj1.centerPoint.x) / d;
      }else{
        this.x = x - h * (this.obj2.centerPoint.y - this.obj1.centerPoint.y) / d;
        this.y = y + h * (this.obj2.centerPoint.x - this.obj1.centerPoint.x) / d;
      }
    }
  }
  this.recalcDependat();
}

// *************************************** LineAndCircleIntersectionPoint ******************************************* //

bay.geom.base.Point_lc = function(l, c, num){
  bay.geom.base.Point.call(this);
  this.obj1 = l;
  this.obj2 = c;
  l.dependant.push(this);
  c.dependant.push(this);
  this.intersectNum = num;
  this.recalc();
}

goog.inherits(bay.geom.base.Point_lc, bay.geom.base.Point);

bay.geom.base.Point_lc.prototype.deleteElement = function(){
  this.obj1.deleteDependant(this);
  this.obj2.deleteDependant(this);
}

bay.geom.base.Point_lc.prototype.recalc = function(){
  if (!this.obj1 || !this.obj2 || !this.obj1.exists || !this.obj2.exists){
    this.exists = false;
  }else{
    if (this.obj1.distanceTo(this.obj2.centerPoint) > this.obj2.radius){
      this.exists = false;
    }else{
      var a = this.obj1.direction.x * this.obj1.direction.x + this.obj1.direction.y * this.obj1.direction.y;
      var b = 2*this.obj1.direction.x*(this.obj1.startPoint.x - this.obj2.centerPoint.x) + 2*this.obj1.direction.y*(this.obj1.startPoint.y - this.obj2.centerPoint.y)
      var c = (this.obj1.startPoint.x - this.obj2.centerPoint.x)*(this.obj1.startPoint.x - this.obj2.centerPoint.x) +
              (this.obj1.startPoint.y - this.obj2.centerPoint.y)*(this.obj1.startPoint.y - this.obj2.centerPoint.y) -
               this.obj2.radius * this.obj2.radius;
      var D = Math.sqrt(b * b - 4 * a * c);
      this.exists = true;
      if (this.intersectNum == 1){
        var t = (-b + D ) / (2 * a);
      }else{
        var t = (-b - D ) / (2 * a);
      }
      this.x = this.obj1.startPoint.x + t * this.obj1.direction.x;
      this.y = this.obj1.startPoint.y + t * this.obj1.direction.y;
    }
  }
  this.recalcDependat();
}

// *************************************** Line **************************************** //
bay.geom.base.Line = function(){
  bay.geom.base.Element.call(this);
  this.startPoint = null;
  this.direction = null;
}

goog.inherits(bay.geom.base.Line, bay.geom.base.Element);

bay.geom.base.Line.prototype.toString = function(){
  if(!this.exists) return 'Line does not exist';
  return 'Line [' + this.startPoint.x.toFixed(2) + ', ' + this.startPoint.y.toFixed(2) + '] - [' + (this.startPoint.x + this.direction.x).toFixed(2) + ', ' + (this.startPoint.y + this.direction.y).toFixed(2) + ']';
}

bay.geom.base.Line.prototype.distance = function(x, y){
  var to = new bay.geom.base.Vector(x,y);
  return Math.abs(this.direction.x * (to.y - this.startPoint.y) - this.direction.y * (to.x - this.startPoint.x)) / Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y)
}

// *************************************** GeneralLine **************************************** //
// Line represented by general equation a*x + b*y = c
bay.geom.base.LineGeneral = function(a, b, c){
  bay.geom.base.Line.call(this);
  this.a = a;
  this.b = b;
  this.c = c;
  this.recalc();
}

goog.inherits(bay.geom.base.LineGeneral, bay.geom.base.Line);

bay.geom.base.LineGeneral.prototype.recalc = function(){
  if (this.a != null && this.b != null && this.c != null){
    if (this.a==0 && this.b==0){
      this.exists = false;
    }else{
      this.exists = true;
      if (this.a == 0){
        this.startPoint = new bay.geom.base.PointFree(0, this.c / this.b);
        this.direction = new bay.geom.base.Vector(1, 0);
      }else if (this.b == 0){
        this.startPoint = new bay.geom.base.PointFree(this.c / this.a, 0);
        this.direction = new bay.geom.base.Vector(0, 1);
      }else{
        this.startPoint = new bay.geom.base.PointFree(0, this.c / this.b);
        this.direction = new bay.geom.base.Vector(1 / this.a, -1 / this.b);
      }
    }
  } else {
    this.exists = false;
  }
  this.recalcDependat();
}

// *************************************** TwoPointLine **************************************** //
// line going through two points
bay.geom.base.Line_2p = function(p1, p2){
  bay.geom.base.Line.call(this);
  this.startPoint = p1;
  this.endPoint = p2;
  p1.dependant.push(this);
  p2.dependant.push(this);
  this.recalc();
}

goog.inherits(bay.geom.base.Line_2p, bay.geom.base.Line);

bay.geom.base.Line_2p.prototype.deleteElement = function(){
  this.startPoint.deleteDependant(this);
  this.endPoint.deleteDependant(this);
}

bay.geom.base.Line_2p.prototype.recalc = function(){
  if (!this.startPoint || !this.endPoint || !this.startPoint.exists || !this.endPoint.exists){
    this.exists = false;
  } else {
    this.exists = true;
    this.direction = new bay.geom.base.Vector(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y);
  }
  this.recalcDependat();
}

// *************************************** Segment **************************************** //
// line segment connected two points
bay.geom.base.Segment = function(p1, p2){
  bay.geom.base.Line_2p.call(this, p1, p2);
}

goog.inherits(bay.geom.base.Segment, bay.geom.base.Line_2p);

bay.geom.base.Segment.prototype.length = function(){
  return Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
}

bay.geom.base.Segment.prototype.distance = function(x, y){
  var to = new bay.geom.base.Vector(x,y);
  var a = this.startPoint.y - to.y;
  var b = this.endPoint.y - to.y;
  if (this.direction.x != 0){
    a = this.startPoint.x - to.x + this.direction.y * (this.startPoint.y - to.y) / this.direction.x;
    b = this.endPoint.x - to.x + this.direction.y * (this.endPoint.y - to.y) / this.direction.x;
  }
  if (a*b <= 0){
    return Math.abs(this.direction.x * (to.y - this.startPoint.y) - this.direction.y * (to.x - this.startPoint.x)) / Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y)
  }else{
    a = this.startPoint.distance(to.x, to.y);
    b = this.endPoint.distance(to.x, to.y);
    if(a < b) return a;
    else return b;
  }
}

// *************************************** Circle **************************************** //
bay.geom.base.Circle = function(){
  bay.geom.base.Element.call(this);
  this.centerPoint = null;
  this.radius = null;
}

goog.inherits(bay.geom.base.Circle, bay.geom.base.Element);

bay.geom.base.Circle.prototype.toString = function(){
  if(!this.exists) return 'Circle does not exist';
  return 'Circle [' + this.centerPoint.x.toFixed(2) + ', ' + this.centerPoint.y.toFixed(2) + '] -> ' + this.radius.toFixed(2);
}

bay.geom.base.Circle.prototype.distance = function(x, y){
  var to = new bay.geom.base.Vector(x,y);
  return Math.abs(this.centerPoint.distance(to.x, to.y) - this.radius);
}

// *************************************** GeneralCircle **************************************** //
// Circle represented by general equation (x - a)^2 + (x - и)^2 = с^2
bay.geom.base.CircleGeneral = function(a, b, c){
  bay.geom.base.Circle.call(this);
  this.a = a;
  this.b = b;
  this.c = c;
  this.recalc();
}

goog.inherits(bay.geom.base.CircleGeneral, bay.geom.base.Circle);

bay.geom.base.CircleGeneral.prototype.recalc = function(){
  if (this.a != null && this.b != null && this.c != null){
    this.exists = true;
    this.centerPoint = new bay.geom.base.PointFree(this.a, this.b);
    this.radius = Math.abs(this.c);
  } else {
    this.exists = false;
  }
  this.recalcDependat();
}

// *************************************** ThreePointsCircle **************************************** //
// circle given by center point and two points which define radius
bay.geom.base.Circle_3p = function(c, p1, p2){
  bay.geom.base.Circle.call(this);
  this.centerPoint = c;
  this.startPoint = p1;
  this.endPoint = p2;
  c.dependant.push(this);
  p1.dependant.push(this);
  p2.dependant.push(this);
  this.recalc();
}

goog.inherits(bay.geom.base.Circle_3p, bay.geom.base.Circle);

bay.geom.base.Circle_3p.prototype.deleteElement = function(){
  this.centerPoint.deleteDependant(this);
  this.startPoint.deleteDependant(this);
  this.endPoint.deleteDependant(this);
}

bay.geom.base.Circle_3p.prototype.recalc = function(){
  if (!this.centerPoint || !this.startPoint || !this.endPoint || !this.centerPoint.exists || !this.startPoint.exists || !this.endPoint.exists){
    this.exists = false;
  } else {
    this.exists = true;
    this.radius = this.startPoint.distanceTo(this.endPoint);
  }
  this.recalcDependat();
}

// ************************************* static methods ***************************************************//
bay.geom.base.getIntersection = function(obj1, obj2, x, y){
  if(obj1 instanceof bay.geom.base.Line && obj2 instanceof bay.geom.base.Line){
    return new bay.geom.base.Point_2l(obj1, obj2);
  }else if(obj1 instanceof bay.geom.base.Circle && obj2 instanceof bay.geom.base.Circle){
    var point1 = new bay.geom.base.Point_2c(obj1, obj2, 0);
    var point2 = new bay.geom.base.Point_2c(obj1, obj2, 1);
    if (point1.distance(x, y) < point2.distance(x, y)){
      return point1;
    }else{
      return point2;
    }
  }else if(obj1 instanceof bay.geom.base.Circle && obj2 instanceof bay.geom.base.Line){
    var point1 = new bay.geom.base.Point_lc(obj2, obj1, 0);
    var point2 = new bay.geom.base.Point_lc(obj2, obj1, 1);
    if (point1.distance(x, y) < point2.distance(x, y)){
      return point1;
    }else{
      return point2;
    }
  }else if(obj1 instanceof bay.geom.base.Line && obj2 instanceof bay.geom.base.Circle){
    var point1 = new bay.geom.base.Point_lc(obj1, obj2, 0);
    var point2 = new bay.geom.base.Point_lc(obj1, obj2, 1);
    if (point1.distance(x, y) < point2.distance(x, y)){
      return point1;
    }else{
      return point2;
    }
  }
}
