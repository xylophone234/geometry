goog.provide('bay.geom.diagram')

// *************************************** Recatngle ******************************************* //
bay.geom.diagram.Rectangle = function(p1, p2){
  bay.geom.base.Element.call(this);
  this.pointOne = p1;
  this.pointTwo = p2;
  p1.dependant.push(this);
  p2.dependant.push(this);
  this.pos = {
    left: null,
    right: null,
    top: null,
    bottom: null
  }
  this.recalc();
}

goog.inherits(bay.geom.diagram.Rectangle, bay.geom.base.Element);

bay.geom.diagram.Rectangle.prototype.toString = function(){
  if(!this.exists) return 'Point does not exist';
  return 'Block';
}

bay.geom.diagram.Rectangle.prototype.distance = function(x, y){
  var to = new bay.geom.base.Vector(x,y);
  var d = null;
  if (to.x <= this.pos.left){
    if (to.y < this.pos.bottom){
      d = Math.sqrt((to.x - this.pos.left)*(to.x - this.pos.left) + (to.y - this.pos.bottom)*(to.y - this.pos.bottom));
    }else if  (to.y >= this.pos.top){
      d = Math.sqrt((to.x - this.pos.left)*(to.x - this.pos.left) + (to.y - this.pos.top)*(to.y - this.pos.top));
    }else{
      d = this.pos.left  - to.x;
    }
  }else if  (to.x >= this.pos.right){
    if (to.y <= this.pos.bottom){
      d = Math.sqrt((to.x - this.pos.right)*(to.x - this.pos.right) + (to.y - this.pos.bottom)*(to.y - this.pos.bottom));
    }else if  (to.y >= this.pos.top){
      d = Math.sqrt((to.x - this.pos.right)*(to.x - this.pos.right) + (to.y - this.pos.top)*(to.y - this.pos.top));
    }else{
      d = to.x - this.pos.right;
    }
  }else{
    if (to.y <= this.pos.bottom){
      d = this.pos.bottom  - to.y;
    }else if  (to.y >= this.pos.top){
      d = to.y - this.pos.top;
    }else{
      d = this.pos.top - to.y;
      if (to.y - this.pos.bottom < d) d = to.y - this.pos.bottom;
      if (to.x - this.pos.left < d) d = to.x - this.pos.left;
      if (this.pos.right - to.x < d) d = this.pos.right - to.x;
    }
  }
  return d;
}

bay.geom.diagram.Rectangle.prototype.closestPoint = function(x, y){
  var to = new bay.geom.base.Vector(x,y);
  var s = null;
  var t = null;
  if (to.x <= this.pos.left){
    s = 'left';
    if (to.y < this.pos.bottom){
      t = 0;
    }else if  (to.y >= this.pos.top){
      t = 1;
    }else{
      t = (to.y - this.pos.bottom) / (this.pos.top - this.pos.bottom);
    }
  }else if  (to.x >= this.pos.right){
    s = 'right';
    if (to.y < this.pos.bottom){
      t = 0;
    }else if  (to.y >= this.pos.top){
      t = 1;
    }else{
      t = (to.y - this.pos.bottom) / (this.pos.top - this.pos.bottom);
    }
  }else{
    if (to.y <= this.pos.bottom){
      s = 'bottom';
      t = (to.x - this.pos.left) / (this.pos.right - this.pos.left);
    }else if  (to.y >= this.pos.top){
      s = 'top';
      t = (to.x - this.pos.left) / (this.pos.right - this.pos.left);
    }else{
      var d = this.pos.top - to.y;
      s = 'top';
      t = (to.x - this.pos.left) / (this.pos.right - this.pos.left);
      if (to.y - this.pos.bottom < d){
        d = to.y - this.pos.bottom;
        s = 'bottom';
        t = (to.x - this.pos.left) / (this.pos.right - this.pos.left);
      }
      if (to.x - this.pos.left < d) {
        d = to.x - this.pos.left;
        s = 'left';
        t = (to.y - this.pos.bottom) / (this.pos.top - this.pos.bottom);
      }
      if (this.pos.right - to.x < d) {
        d = this.pos.right - to.x;
        s = 'right';
        t = (to.y - this.pos.bottom) / (this.pos.top - this.pos.bottom);
      }
    }
  }
  return new bay.geom.diagram.PointAtRect(this, s, t);
}

bay.geom.diagram.Rectangle.prototype.recalc = function(){
  if(this.pointOne != null && this.pointTwo != null && this.pointOne.exists && this.pointTwo.exists){
    this.exists = true;
    if (this.pointOne.x < this.pointTwo.x) {
      this.pos.left = this.pointOne.x;
      this.pos.right = this.pointTwo.x;
    }else{
      this.pos.left = this.pointTwo.x;
      this.pos.right = this.pointOne.x;
    }
    if (this.pointOne.y < this.pointTwo.y) {
      this.pos.top = this.pointTwo.y;
      this.pos.bottom = this.pointOne.y;
    }else{
      this.pos.top = this.pointOne.y;
      this.pos.bottom = this.pointTwo.y;
    }
  } else {
    this.exists = false;
  }
  this.recalcDependat();
}

bay.geom.diagram.Rectangle.prototype.draw = function(area){
  // draw line if it exists and intersectthe area
  if(!this.exists) return;
  var coords = area.transform([this.pos.left, this.pos.bottom,
                               this.pos.right, this.pos.top]);
  var path = new goog.graphics.Path();
  path.moveTo( coords[0], coords[1] );
  path.lineTo( coords[0], coords[3] );
  path.lineTo( coords[2], coords[3] );
  path.lineTo( coords[2], coords[1] );
  path.lineTo( coords[0], coords[1] );
  if (this.current){
    area.graphics.drawPath(path, area.properties.current, null);
  }else{
    if (this.hover){
      area.graphics.drawPath(path, area.properties.hover, null);
    }
    if (this.color){
      var stroke = new goog.graphics.Stroke(1, this.color);
      var fill = new goog.graphics.SolidFill(this.color, 0.1)
    }else{
      var stroke = new goog.graphics.Stroke(1, 'black' );
      var fill = new goog.graphics.SolidFill('black', 0.1)
    }
    area.graphics.drawPath(path, stroke, fill);
  }
}

bay.geom.diagram.Rectangle.prototype.toJson = function(list, id){
  return '{' + this.jsonHeader(id) + ', "type": "DiagramRect", "p1": ' + list.indexOf(this.pointOne) + ', "p2": ' + list.indexOf(this.pointTwo) + '}';
}

bay.geom.diagram.Rectangle.fromJson = function(item, list){
  var rect = new bay.geom.base.Rectangle( list[item.p1], list[item.p2]);
  rect.restoreFromJson(item);
  return rect;
}


// *************************************** PointAtRect ******************************************* //
bay.geom.diagram.PointAtRect = function(l, s, t){
  bay.geom.base.Point.call(this);
  this.obj = l;
  l.dependant.push(this);
  this.side = s;
  this.param = t;
  this.recalc();
}

goog.inherits(bay.geom.diagram.PointAtRect, bay.geom.base.Point);

bay.geom.diagram.PointAtRect.prototype.moveTo = function(x, y){
  if (this.obj){
    var point = this.obj.closestPoint(x, y);
    this.side = point.side;
    this.param = point.param;
  }
  this.recalc();
}

bay.geom.diagram.PointAtRect.prototype.recalc = function(){
  if(!this.obj || !this.obj.exists || this.param == null || this.side == null){
    this.exists = false;
  }else{
    this.exists = true;
    if (this.side == 'left'){
      this.x = this.obj.pos.left;
      this.y = this.obj.pos.bottom  + (this.obj.pos.top - this.obj.pos.bottom) * this.param;
    }else if (this.side == 'right'){
      this.x = this.obj.pos.right;
      this.y = this.obj.pos.bottom  + (this.obj.pos.top - this.obj.pos.bottom) * this.param;
    }else if (this.side == 'top'){
      this.x = this.obj.pos.left + (this.obj.pos.right - this.obj.pos.left)  * this.param;
      this.y = this.obj.pos.top;
    }else if (this.side == 'bottom'){
      this.x = this.obj.pos.left + (this.obj.pos.right - this.obj.pos.left)  * this.param;
      this.y = this.obj.pos.bottom;
    }
  }
  this.recalcDependat();
}

bay.geom.diagram.PointAtRect.prototype.toJson = function(list, id){
  return '{' + this.jsonHeader(id) + ', "type": "DiagramPointAtRect", "obj": ' + list.indexOf(this.obj) + ', "s": "' + this.side + '", "t": ' + this.param + '"}';
}

bay.geom.diagram.PointAtRect.fromJson = function(item, list){
  var point = new bay.geom.base.PointAtRect( list[item.obj], item.s, item.t);
  point.restoreFromJson(item);
  return point;
}
