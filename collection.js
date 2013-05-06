goog.provide('bay.geom.Collection')

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
