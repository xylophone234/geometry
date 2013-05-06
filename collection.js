goog.provide('bay.geom.base.Collection')

bay.geom.base.Create = function(){
  return new bay.geom.base.Collection();
}

// *************************************** Collection **************************************** //
bay.geom.base.Collection = function(){
  this.list = [];
}

bay.geom.base.Collection.prototype.getElements = function(){
  return this.list;
}

bay.geom.base.Collection.prototype.clear = function(){
  for(var i=this.list.length - 1;i>=0;i--){
    this.list[i].deleteElement();
  }
  this.list = [];
}

bay.geom.base.Collection.prototype.add = function(e){
  this.list.push(e);
  return this.list.length;
}

// list of elements near the given point
bay.geom.base.Collection.prototype.getNeighbourList = function(p, d, onlyVisible, sorted){
  var neighbourList = [];
  for(var i=0;i<this.list.length;i++){
    if (this.list[i].distance && (!onlyVisible || !this.list[i].hidden)) {
      var dist = this.list[i].distance(p.x, p.y);
      if (dist <= d){
        neighbourList.push({element: this.list[i], distance: dist});
      }
    }
  }
  if (sorted)
    neighbourList.sort(function(a,b){return a.distance - b.distance;});
  return neighbourList;
}


bay.geom.base.Collection.prototype.jsonCode = function(){
  var str = '[';
  var list = this.getElements();
  for(var i=0;i<list.length;i++){
    if(list[i].toJson){
      if (i > 0) str += ',';
      str += '\n' + list[i].toJson(list, i);
    }
  }
  str += '\n]';
  return str;
}

// ********************** add behavior to geometrical elements ************************************* //
bay.geom.base.PointFree.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', type": "PointFree", "x": ' + this.x + ', "y":' + this.y + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Point_2l.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', type": "Point_2l", "obj1": ' + list.indexOf(this.obj1) + ', "obj2":' + list.indexOf(this.obj2) + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Point_2c.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', type": "Point_2c", "obj1": ' + list.indexOf(this.obj1) + ', "obj2":' + list.indexOf(this.obj2) + ', "num":' + this.intersectNum + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Point_lc.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', type": "Point_lc", "obj1": ' + list.indexOf(this.obj1) + ', "obj2":' + list.indexOf(this.obj2) + ', "num":' + this.intersectNum + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.LineGeneral.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', type": "LineGeneral", "a": ' + this.a + ', "b":' + this.b + ', "b":' + this.c + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Line_2p.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', type": "Line_2p", "p1": ' + list.indexOf(this.startPoint) + ', "p2":' + list.indexOf(this.endPoint) + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Segment.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', type": "Segment", "p1": ' + list.indexOf(this.startPoint) + ', "p2":' + list.indexOf(this.endPoint) + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.CircleGeneral.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', type": "CircleGeneral", "a": ' + this.a + ', "b":' + this.b + ', "b":' + this.c + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Circle_3p.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', type": "Circle_3p", "p1": ' + list.indexOf(this.centerPoint) + ', "p2":' + list.indexOf(this.startPoint) + ', "p3":' + list.indexOf(this.endPoint) + (this.hidden?', "hidden": true':'') +'}';
}
