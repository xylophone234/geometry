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
    if (this.list[i] && this.list[i].deleteElement)
      this.list[i].deleteElement();
  }
  this.list = [];
  return this;
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

bay.geom.base.Collection.prototype.parseJson = function(str){
  var data = eval('(' + str + ')');
  this.rebuild(data);
  return this;
}

bay.geom.base.Collection.prototype.rebuild = function(data){
  this.clear();
  for(var i=0;i<data.length;i++){
    var func = this.getFromJsonFunc(data[i].type);
    if (func)
      this.list[i] = func(data[i], this.list);
  }
  return this;
}

// ********************** add behavior to geometrical elements ************************************* //
bay.geom.base.PointFree.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', "type": "PointFree", "x": ' + this.x + ', "y": ' + this.y +
         (this.label?', "label": "' + this.label + '"':'') + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.PointFree.fromJson = function(item, list){
  var point = new bay.geom.base.PointFree( item.x, item.y);
  if (item.label) point.label = item.label;
  if (item.hidden) point.hidden = true;
  return point;
}

bay.geom.base.PointAtLine.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', "type": "PointAtLine", "obj": ' + list.indexOf(this.obj) + ', "t": ' + this.param +
         (this.label?', "label": "' + this.label + '"':'') + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.PointAtLine.fromJson = function(item, list){
  var point = new bay.geom.base.PointAtLine( list[item.obj], item.t);
  if (item.label) point.label = item.label;
  if (item.hidden) point.hidden = true;
  return point;
}

bay.geom.base.PointAtCircle.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', "type": "PointAtCircle", "obj": ' + list.indexOf(this.obj) + ', "x": ' + this.direction.x + ', "y": ' + this.direction.y +
         (this.label?', "label": "' + this.label + '"':'') + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.PointAtCircle.fromJson = function(item, list){
  var point = new bay.geom.base.PointAtCircle( list[item.obj], new bay.geom.base.Vector(item.x, item.y));
  if (item.label) point.label = item.label;
  if (item.hidden) point.hidden = true;
  return point;
}

bay.geom.base.Point_2l.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', "type": "Point_2l", "obj1": ' + list.indexOf(this.obj1) + ', "obj2": ' + list.indexOf(this.obj2) +
         (this.label?', "label": "' + this.label + '"':'') + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Point_2l.fromJson = function(item, list){
  var point = new bay.geom.base.Point_2l( list[item.obj1], list[item.obj2]);
  if (item.label) point.label = item.label;
  if (item.hidden) point.hidden = true;
  return point;
}

bay.geom.base.Point_2c.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', "type": "Point_2c", "obj1": ' + list.indexOf(this.obj1) + ', "obj2": ' + list.indexOf(this.obj2) + ', "num": ' + this.intersectNum +
         (this.label?', "label": "' + this.label + '"':'') + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Point_2c.fromJson = function(item, list){
  var point = new bay.geom.base.Point_2c( list[item.obj1], list[item.obj2], item.num);
  if (item.label) point.label = item.label;
  if (item.hidden) point.hidden = true;
  return point;
}

bay.geom.base.Point_lc.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', "type": "Point_lc", "obj1": ' + list.indexOf(this.obj1) + ', "obj2": ' + list.indexOf(this.obj2) + ', "num": ' + this.intersectNum +
         (this.label?', "label": "' + this.label + '"':'') + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Point_lc.fromJson = function(item, list){
  var point = new bay.geom.base.Point_lc( list[item.obj1], list[item.obj2], item.num);
  if (item.label) point.label = item.label;
  if (item.hidden) point.hidden = true;
  return point;
}

bay.geom.base.LineGeneral.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', "type": "LineGeneral", "a": ' + this.a + ', "b": ' + this.b + ', "c": ' + this.c +
         (this.label?', "label": "' + this.label + '"':'') + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.LineGeneral.fromJson = function(item, list){
  var line = new bay.geom.base.LineGeneral( item.a, item.b, item.c);
  if (item.hidden) line.hidden = true;
  return line;
}

bay.geom.base.Line_2p.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', "type": "Line_2p", "p1": ' + list.indexOf(this.startPoint) + ', "p2": ' + list.indexOf(this.endPoint) + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Line_2p.fromJson = function(item, list){
  var line = new bay.geom.base.Line_2p( list[item.p1], list[item.p2]);
  if (item.hidden) line.hidden = true;
  return line;
}

bay.geom.base.Segment.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', "type": "Segment", "p1": ' + list.indexOf(this.startPoint) + ', "p2": ' + list.indexOf(this.endPoint) + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Segment.fromJson = function(item, list){
  var line = new bay.geom.base.Segment( list[item.p1], list[item.p2]);
  if (item.hidden) line.hidden = true;
  return line;
}

bay.geom.base.CircleGeneral.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', "type": "CircleGeneral", "a": ' + this.a + ', "b": ' + this.b + ', "c": ' + this.c + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.CircleGeneral.fromJson = function(item, list){
  var circle = new bay.geom.base.CircleGeneral( item.a, item.b, item.c);
  if (item.hidden) circle.hidden = true;
  return circle;
}

bay.geom.base.Circle_3p.prototype.toJson = function(list, id){
  return '{"id": ' + id + ', "type": "Circle_3p", "p1": ' + list.indexOf(this.centerPoint) + ', "p2": ' + list.indexOf(this.startPoint) + ', "p3": ' + list.indexOf(this.endPoint) + (this.hidden?', "hidden": true':'') +'}';
}

bay.geom.base.Circle_3p.fromJson = function(item, list){
  var circle = new bay.geom.base.Circle_3p( list[item.p1], list[item.p2], list[item.p3]);
  if (item.hidden) circle.hidden = true;
  return circle;
}

// ************************** determine parse function ***********************************
bay.geom.base.Collection.prototype.getFromJsonFunc = function(objName){
  if (objName=="PointFree") return bay.geom.base.PointFree.fromJson;
  else if (objName=="PointAtLine") return bay.geom.base.PointAtLine.fromJson;
  else if (objName=="PointAtCircle") return bay.geom.base.PointAtCircle.fromJson;
  else if (objName=="Point_2l") return bay.geom.base.Point_2l.fromJson;
  else if (objName=="Point_2c") return bay.geom.base.Point_2c.fromJson;
  else if (objName=="Point_lc") return bay.geom.base.Point_lc.fromJson;
  else if (objName=="LineGeneral") return bay.geom.base.LineGeneral.fromJson;
  else if (objName=="Line_2p") return bay.geom.base.Line_2p.fromJson;
  else if (objName=="Segment") return bay.geom.base.Segment.fromJson;
  else if (objName=="CircleGeneral") return bay.geom.base.CircleGeneral.fromJson;
  else if (objName=="Circle_3p") return bay.geom.base.Circle_3p.fromJson;
}
