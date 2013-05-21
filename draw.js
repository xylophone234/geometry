goog.provide('bay.geom.draw')

goog.require('goog.graphics');
goog.require('goog.graphics.Font');
goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');

bay.geom.draw.Area = function(domElement, props){
  if(typeof domElement === 'string')
    this.domElement = goog.dom.getElement(domElement);
  else
    this.domElement = domElement;
  this.getMainCollection();
  var graphics = this.getGraphics();
  this.transformation = goog.graphics.AffineTransform.getTranslateInstance(graphics.getCoordSize().width/2, graphics.getCoordSize().height/2).scale(1, -1);
  this.onSetTransformation();
  this.initProperties();
  if (props != null)
    goog.object.extend(this.properties, props);
}

bay.geom.draw.Area.prototype.initProperties = function(){
  this.properties = {
    pointsize:  2,
    stroke:     new goog.graphics.Stroke(1, 'black'),
    fill:       new goog.graphics.SolidFill('black'),
    font:       new goog.graphics.Font(14, 'Times'),
    hover:      new goog.graphics.Stroke(3, 'blue'),
    hoverdist:  10,
    current:    new goog.graphics.Stroke(1, 'red')
  }
  if (goog.userAgent.MOBILE){
    this.properties.hoverdist = this.properties.hoverdist * 5;
    this.properties.pointsize = this.properties.pointsize * 2;
  }
}

// ********************************* getters ********************************
bay.geom.draw.Area.prototype.getContentElement = function(){
  return this.domElement;
}

bay.geom.draw.Area.prototype.getHoverDist = function(){
  return this.properties.hoverdist / this.transformation.getScaleX();
}

bay.geom.draw.Area.prototype.getMainCollection = function(){
  if (!this.geomCollections){
    geomCollection = bay.geom.base.Create();
    this.geomCollections = [geomCollection];
  }
  return this.geomCollections[0];
}

bay.geom.draw.Area.prototype.getGeomElements = function(){
  return this.getMainCollection().getElements();
}

bay.geom.draw.Area.prototype.getGraphics = function(){
  if (!this.graphics){
    if (!goog.graphics.isBrowserSupported()){
      alert("This browser doesn''t support graphics. Please use another web browser.");
    }
    var domElement = this.domElement;
    var graphics = goog.graphics.createSimpleGraphics( goog.style.getContentBoxSize(this.domElement).width, goog.style.getContentBoxSize(this.domElement).height);
    goog.events.listen(new goog.dom.ViewportSizeMonitor(), goog.events.EventType.RESIZE, function(e) {
      graphics.setSize(goog.style.getContentBoxSize(domElement).width, goog.style.getContentBoxSize(domElement).height);
    });
    graphics.render(this.domElement);
    this.graphics = graphics;
  }
  return this.graphics;
}

// ********************************** utilities ***********************************
bay.geom.draw.Area.prototype.transform = function(values){
  var transformed = [];
  if (values instanceof bay.geom.base.Vector){
    this.transformation.transform([values.x, values.y], 0, transformed, 0, 1);
    return new bay.geom.base.Vector(transformed[0], transformed[1]);
  }else{
    this.transformation.transform(values, 0, transformed, 0, values.length/2);
    return transformed;
  }
}

bay.geom.draw.Area.prototype.reverseTransform = function(values){
  var transformed = [];
  if (values instanceof bay.geom.base.Vector){
    this.reverseTransformation.transform([values.x, values.y], 0, transformed, 0, 1);
    return new bay.geom.base.Vector(transformed[0], transformed[1]);
  }else{
    this.reverseTransformation.transform(values, 0, transformed, 0, values.length/2);
    return transformed;
  }
}

bay.geom.draw.Area.prototype.onSetTransformation = function(){
  this.reverseTransformation = this.transformation.createInverse();
  var coords = this.reverseTransform([0, 0, this.graphics.getCoordSize().width, this.graphics.getCoordSize().height]);
  this.minX = coords[0];
  this.minY = coords[3];
  this.maxX = coords[2];
  this.maxY = coords[1];
}

// ************************************************ actions ****************************************
bay.geom.draw.Area.prototype.redrawAll = function(){
  this.graphics.clear();
  for(var c=0;c<this.geomCollections.length;c++){
    var list = this.geomCollections[c].getElements();
    for(var i=0;i<list.length;i++){
      if(list[i].draw && !list[i].hidden){
        list[i].draw(this)
      }
    }
  }
}

bay.geom.draw.Area.prototype.scale = function(p, n){
  var coords = this.reverseTransform(p);
  this.transformation = this.transformation.translate(coords.x, coords.y).scale(n, n).translate(-coords.x, -coords.y);
  this.onSetTransformation();
}

bay.geom.draw.Area.prototype.shift = function(p){
  this.transformation = this.transformation.preTranslate(this.graphics.getCoordSize().width * p.x, -this.graphics.getCoordSize().height * p.y);
  this.onSetTransformation();
}

bay.geom.draw.Area.prototype.markHoverElements = function(p){
  var list = this.getGeomElements();
  for(var i=0;i<list.length;i++){
    list[i].hover = false;
  }
  var coords = this.reverseTransform(p);
  list = this.getMainCollection().getNeighbourList(coords, this.getHoverDist());
  for(var i=0;i<list.length;i++){
    list[i].element.hover = true;
  }
}

// ********************** add behavior to geometrical elements ************************************* //
bay.geom.base.Element.prototype.hide = function(){
  this.hidden = true;
}

bay.geom.base.Element.prototype.show = function(){
  this.hidden = false;
}

bay.geom.base.Point.prototype.draw = function(area){
  // draw point if it exists and inside the area
  if(!this.exists) return;
  if(this.x >= area.minX && this.x <= area.maxX && this.y >= area.minY && this.y <= area.maxY){
    var coords = area.transform([this.x, this.y]);
    if (this.current){
      area.graphics.drawCircle(coords[0], coords[1], area.properties.pointsize, area.properties.current, area.properties.fill);
    }else{
      if (this.hover){
        area.graphics.drawCircle(coords[0], coords[1], area.properties.pointsize, area.properties.hover, area.properties.fill);
      }
      if (this.color){
        var stroke = new goog.graphics.Stroke(1, this.color);
        var fill = new goog.graphics.SolidFill(this.color);
        area.graphics.drawCircle(coords[0], coords[1], area.properties.pointsize, stroke, fill);
      }else{
        area.graphics.drawCircle(coords[0], coords[1], area.properties.pointsize, area.properties.stroke, area.properties.fill);
      }
    }
    if (this.label){
      area.graphics.drawText(this.label, coords[0], coords[1], null, null, 'left', null, area.properties.font, area.properties.stroke, area.properties.fill);
    }
  }
}

bay.geom.base.Circle.prototype.draw = function(area){
  // draw circle if it exists and can touch the area
  if(!this.exists) return;
  if(this.centerPoint.x >= area.minX - this.radius &&
     this.centerPoint.x <= area.maxX + this.radius &&
     this.centerPoint.y >= area.minY - this.radius &&
     this.centerPoint.y <= area.maxY + this.radius){
     var coords = area.transform([this.centerPoint.x, this.centerPoint.y]);
     if (this.current){
       area.graphics.drawCircle(coords[0], coords[1], this.radius * area.transformation.getScaleX(), area.properties.current, null);
     } else {
       if (this.hover){
         area.graphics.drawCircle(coords[0], coords[1], this.radius * area.transformation.getScaleX(), area.properties.hover, null);
       }
      if (this.color){
        var stroke = new goog.graphics.Stroke(1, this.color);
        area.graphics.drawCircle(coords[0], coords[1], this.radius * area.transformation.getScaleX(), stroke, null);
      }else{
        area.graphics.drawCircle(coords[0], coords[1], this.radius * area.transformation.getScaleX(), area.properties.stroke, null);
      }
     }
  }
}

bay.geom.base.Line.prototype.getMinAndMaxParamValue = function (area){
  // intersections with vertical boundaries
  var l1 = -Number.MAX_VALUE;
  var r1 = Number.MAX_VALUE;
  if (this.direction.x != 0){
    l1 = (area.minX - this.startPoint.x)/this.direction.x;
    r1 = (area.maxX - this.startPoint.x)/this.direction.x;
    if (l1 > r1){ var swap = r1; r1 = l1; l1 = swap; }
  }
  // intersections with horizontal boundaries
  var l2 = -Number.MAX_VALUE;
  var r2 = Number.MAX_VALUE;
  if (this.direction.y != 0){
    l2 = (area.minY - this.startPoint.y)/this.direction.y;
    r2 = (area.maxY - this.startPoint.y)/this.direction.y;
    if (l2 > r2){ var swap = r2; r2 = l2; l2 = swap; }
  }
  if (l1 < r2 && r1 > l2){
    var l = l2;
    if(l1 > l2) l = l1;
    var r = r2;
    if(r1 < r2) r = r1;
    return {min: l, max: r};
  }else{
    return null;
  }
}

bay.geom.base.Line.prototype.draw = function(area){
  // draw line if it exists and intersectthe area
  if(!this.exists) return;
  var val = this.getMinAndMaxParamValue(area);
  if (val){
    var coords = area.transform([this.startPoint.x + val.min * this.direction.x, this.startPoint.y + val.min * this.direction.y,
                                 this.startPoint.x + val.max * this.direction.x, this.startPoint.y + val.max * this.direction.y]);
    var path = new goog.graphics.Path();
    path.moveTo( coords[0], coords[1] );
    path.lineTo( coords[2], coords[3] );
    if (this.current){
      area.graphics.drawPath(path, area.properties.current, null);
    }else{
      if (this.hover){
        area.graphics.drawPath(path, area.properties.hover, null);
      }
      if (this.color){
        var stroke = new goog.graphics.Stroke(1, this.color);
        area.graphics.drawPath(path, stroke, null);
      }else{
        area.graphics.drawPath(path, area.properties.stroke, null);
      }
    }
  }
}

bay.geom.base.Segment.prototype.draw = function(area){
  // draw segment if it exists and intersectthe area
  if(!this.exists) return;
  var val = this.getMinAndMaxParamValue(area);
  if (val && val.max > 0 && val.min < 1){
    // bound drawing with ends of segment
    if (val.min < 0) val.min = 0;
    if (val.max > 1) val.max = 1;
    var coords = area.transform([this.startPoint.x + val.min * this.direction.x, this.startPoint.y + val.min * this.direction.y,
                                 this.startPoint.x + val.max * this.direction.x, this.startPoint.y + val.max * this.direction.y]);
    var path = new goog.graphics.Path();
    path.moveTo( coords[0], coords[1] );
    path.lineTo( coords[2], coords[3] );
    if (this.current){
      area.graphics.drawPath(path, area.properties.current, null);
    }else{
      if (this.hover){
        area.graphics.drawPath(path, area.properties.hover, null);
      }
      if (this.color){
        var stroke = new goog.graphics.Stroke(1, this.color);
        area.graphics.drawPath(path, stroke, null);
      }else{
        area.graphics.drawPath(path, area.properties.stroke, null);
      }
    }
  }
}

