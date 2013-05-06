goog.provide('bay.geom.draw')

goog.require('goog.graphics');
goog.require('goog.graphics.Font');
goog.require('goog.dom.ViewportSizeMonitor');

bay.geom.draw.Area = function(domElement, geomCollection, props){
  if (!goog.graphics.isBrowserSupported()){
    alert("This browser doesn''t support graphics. Please use another web browser.");
  }
  this.domElement = domElement;
  var graphics = goog.graphics.createSimpleGraphics( goog.style.getContentBoxSize(this.domElement).width, goog.style.getContentBoxSize(this.domElement).height);
  goog.events.listen(new goog.dom.ViewportSizeMonitor(), goog.events.EventType.RESIZE, function(e) {
    graphics.setSize(goog.style.getContentBoxSize(domElement).width, goog.style.getContentBoxSize(domElement).height);
  });
  this.graphics = graphics;
  this.graphics.render(this.domElement);
  this.transformation = goog.graphics.AffineTransform.getTranslateInstance(this.graphics.getCoordSize().width/2, this.graphics.getCoordSize().height/2).scale(1, -1);
  this.onSetTransformation();
  if (!geomCollection)
    geomCollection = bay.geom.base.Create();
  this.geomCollections = [geomCollection];
  this.properties = {
    pointsize:  2,
    stroke:     new goog.graphics.Stroke(0.5, 'black'),
    fill:       new goog.graphics.SolidFill('black'),
    font:       new goog.graphics.Font(14, 'Times'),
    hover:      new goog.graphics.Stroke(2, 'blue'),
    hoverdist:  10,
    current:    new goog.graphics.Stroke(1, 'red')
  }
  if (goog.userAgent.MOBILE){
    this.properties.hoverdist = this.properties.hoverdist * 5;
    this.properties.pointsize = this.properties.pointsize * 2;
  }
  if (props != null)
    goog.object.extend(this.properties, props);
}

bay.geom.draw.Area.prototype.redrawAll = function(){
  this.graphics.clear();
  for(var c=0;c<this.geomCollections.length;c++){
    var list = this.geomCollections[c].getElements();
    for(var i=0;i<list.length;i++){
//      console.log(list[i]);
      if(list[i].draw && !list[i].hidden){
        list[i].draw(this)
      }
    }
  }
}

bay.geom.draw.Area.prototype.getContentElement = function(){
  return this.domElement;
}

bay.geom.draw.Area.prototype.getGeomElements = function(){
  return this.geomCollections[0].getElements  ();
}

bay.geom.draw.Area.prototype.transform = function(values){
  var transformed = [];
  this.transformation.transform(values, 0, transformed, 0, values.length/2);
  return transformed;
}

bay.geom.draw.Area.prototype.reverseTransform = function(values){
  var transformed = [];
  this.reverseTransformation.transform(values, 0, transformed, 0, values.length/2);
  return transformed;
}

bay.geom.draw.Area.prototype.onSetTransformation = function(){
  this.reverseTransformation = this.transformation.createInverse();
  var coords = this.reverseTransform([0, 0, this.graphics.getCoordSize().width, this.graphics.getCoordSize().height]);
  this.minX = coords[0];
  this.minY = coords[3];
  this.maxX = coords[2];
  this.maxY = coords[1];
//  console.log('minX='+ this.minX+' maxX='+ this.maxX+' minY = '+this.minY+' maxY = '+this.maxY+' scale='+this.transformation.getScaleX());
}

bay.geom.draw.Area.prototype.scale = function(x, y, n){
//  console.log('scale('+x+','+y+','+n+')');
  var coords = this.reverseTransform([x, y]);
  this.transformation = this.transformation.translate(coords[0], coords[1]).scale(n, n).translate(-coords[0], -coords[1]);
  this.onSetTransformation();
}

bay.geom.draw.Area.prototype.shift = function(x, y){
  this.transformation = this.transformation.preTranslate(this.graphics.getCoordSize().width * x, -this.graphics.getCoordSize().height * y);
  this.onSetTransformation();
}

bay.geom.draw.Area.prototype.markHoverElements = function(x, y){
  var list = this.geomCollections[0].getElements();
  for(var i=0;i<list.length;i++){
    list[i].hover = false;
  }
  var coords = this.reverseTransform([x, y]);
  list = this.geomCollections[0].getNeighbourList(coords[0], coords[1], this.properties.hoverdist / this.transformation.getScaleX());
  for(var i=0;i<list.length;i++){
    list[i].element.hover = true;
  }
}

bay.geom.base.Element.prototype.hide = function(){
  this.hidden = true;
}

bay.geom.base.Element.prototype.show = function(){
  this.hidden = false;
}

bay.geom.base.Point.prototype.draw = function(area){
//    console.log('this.x='+this.x+' this.y = ' +this.y+' area.minX='+ area.minX+' area.maxX='+ area.maxX+' area.minY = '+area.minY+' area.maxY = '+area.maxY);

  if(!this.exists) return;
  if(this.x >= area.minX &&
     this.x <= area.maxX &&
     this.y >= area.minY &&
     this.y <= area.maxY){
     var coords = area.transform([this.x, this.y]);
     if (this.hover){
       area.graphics.drawCircle(coords[0], coords[1], area.properties.pointsize, area.properties.hover, area.properties.fill);
     }else if (this.current){
       area.graphics.drawCircle(coords[0], coords[1], area.properties.pointsize, area.properties.current, area.properties.fill);
     }else{
       area.graphics.drawCircle(coords[0], coords[1], area.properties.pointsize, area.properties.stroke, area.properties.fill);
     }
     if (this.label){
       area.graphics.drawText(this.label, coords[0], coords[1], null, null, 'left', null, area.properties.font, area.properties.stroke, area.properties.fill);
     }
  }
}

bay.geom.base.Circle.prototype.draw = function(area){
  if(!this.exists) return;
  if(this.centerPoint.x >= area.minX - this.radius &&
     this.centerPoint.x <= area.maxX + this.radius &&
     this.centerPoint.y >= area.minY - this.radius &&
     this.centerPoint.y <= area.maxY + this.radius){
     var coords = area.transform([this.centerPoint.x, this.centerPoint.y]);
     if (this.hover){
       area.graphics.drawCircle(coords[0], coords[1], this.radius * area.transformation.getScaleX(), area.properties.hover, null);
     }
     if (this.current){
       area.graphics.drawCircle(coords[0], coords[1], this.radius * area.transformation.getScaleX(), area.properties.current, null);
     } else {
       area.graphics.drawCircle(coords[0], coords[1], this.radius * area.transformation.getScaleX(), area.properties.stroke, null);
     }
  }
}

bay.geom.base.Line.prototype.draw = function(area){
  if(!this.exists) return;
  var l1 = -Number.MAX_VALUE;
  var r1 = Number.MAX_VALUE;
  if (this.direction.x != 0){
    l1 = (area.minX - this.startPoint.x)/this.direction.x;
    r1 = (area.maxX - this.startPoint.x)/this.direction.x;
    if (l1 > r1){
      var swap = r1;
      r1 = l1;
      l1 = swap;
    }
  }
  var l2 = -Number.MAX_VALUE;
  var r2 = Number.MAX_VALUE;
  if (this.direction.y != 0){
    l2 = (area.minY - this.startPoint.y)/this.direction.y;
    r2 = (area.maxY - this.startPoint.y)/this.direction.y;
    if (l2 > r2){
      var swap = r2;
      r2 = l2;
      l2 = swap;
    }
  }
  if (l1 < r2 && r1 > l2){
    var l = l2;
    if(l1 > l2) l = l1;
    var r = r2;
    if(r1 < r2) r = r1;

    var coords = area.transform([this.startPoint.x + l * this.direction.x, this.startPoint.y + l * this.direction.y,
                                 this.startPoint.x + r * this.direction.x, this.startPoint.y + r * this.direction.y]);
    var path = new goog.graphics.Path();
    path.moveTo( coords[0], coords[1] );
    path.lineTo( coords[2], coords[3] );
    if (this.hover)
      area.graphics.drawPath(path, area.properties.hover, null);
     if (this.current){
        area.graphics.drawPath(path, area.properties.current, null);
     } else {
        area.graphics.drawPath(path, area.properties.stroke, null);
     }
  }
}

bay.geom.base.Segment.prototype.draw = function(area){
  if(!this.exists) return;
  var l1 = -Number.MAX_VALUE;
  var r1 = Number.MAX_VALUE;
  if (this.direction.x != 0){
    l1 = (area.minX - this.startPoint.x)/this.direction.x;
    r1 = (area.maxX - this.startPoint.x)/this.direction.x;
    if (l1 > r1){
      var swap = r1;
      r1 = l1;
      l1 = swap;
    }
  }
  var l2 = -Number.MAX_VALUE;
  var r2 = Number.MAX_VALUE;
  if (this.direction.y != 0){
    l2 = (area.minY - this.startPoint.y)/this.direction.y;
    r2 = (area.maxY - this.startPoint.y)/this.direction.y;
    if (l2 > r2){
      var swap = r2;
      r2 = l2;
      l2 = swap;
    }
  }
  if (l1 < r2 && r1 > l2 && r1 > 0 && r2 > 0 && l1 < 1 && l2 < 1){
    var l = l2;
    if(l1 > l2) l = l1;
    var r = r2;
    if(r1 < r2) r = r1;
    if (l < 0) l=0;
    if (r > 1) r = 1;

    var coords = area.transform([this.startPoint.x + l * this.direction.x, this.startPoint.y + l * this.direction.y,
                                 this.startPoint.x + r * this.direction.x, this.startPoint.y + r * this.direction.y]);
    var path = new goog.graphics.Path();
    path.moveTo( coords[0], coords[1] );
    path.lineTo( coords[2], coords[3] );
    if (this.hover)
      area.graphics.drawPath(path, area.properties.hover, null);
     if (this.current){
        area.graphics.drawPath(path, area.properties.current, null);
     } else {
        area.graphics.drawPath(path, area.properties.stroke, null);
     }
  }
}

