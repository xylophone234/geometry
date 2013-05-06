goog.provide('bay.geom.ui')

goog.require('goog.events.MouseWheelHandler');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.ui.Button');
goog.require('goog.ui.BidiInput');
goog.require('goog.style');

bay.geom.ui.Handler = function(draw, toolbarElement, props){
  this.draw = draw;
  this.toolbarElement = toolbarElement;
  this.element = draw.getContentElement();
  this.tempCollection = bay.geom.base.Create();
  draw.geomCollections.push(this.tempCollection);
  this.properties = {
    hover:      true,
    onwheel:    true,
    onclick:    true,
    ondrag:     true,
    onrightclick: true
  };
  this.state = {
  };
  if (props != null)
    goog.object.extend(this.properties, props);

  if (this.element){
    this.addHoverListener();
    this.addWheelListener();
    this.addClickListener();
    this.addDragListener();
    this.addRightClickListener();
  }
  if (toolbarElement){
    this.addButtons();
  }
}

bay.geom.ui.Handler.prototype.addHoverListener = function(){
  if (this.properties.hover){
    var draw = this.draw;
    var state = this.state;
    var moveHandler = function(e){
      var pos = goog.style.getClientPosition(e.currentTarget);
      draw.markHoverElements(e.clientX - pos.x, e.clientY - pos.y);
      if (state.rulerEndTmp){
        var coords = draw.reverseTransform([e.clientX - pos.x, e.clientY - pos.y]);
        state.rulerEndTmp.moveTo(coords[0], coords[1]);
      }
      if (state.compassEndTmp){
        var coords = draw.reverseTransform([e.clientX - pos.x, e.clientY - pos.y]);
        state.compassEndTmp.moveTo(coords[0], coords[1]);
      }
      if (state.compassCenterTmp){
        var coords = draw.reverseTransform([e.clientX - pos.x, e.clientY - pos.y]);
        state.compassCenterTmp.moveTo(coords[0], coords[1]);
      }
      draw.redrawAll();
    }
    goog.events.listen(this.element, goog.events.EventType.MOUSEMOVE, moveHandler);
  }
}

bay.geom.ui.Handler.prototype.addWheelListener = function(){
  if(this.properties.onwheel){
    var draw = this.draw;
    var wheelHandler = function(e){
      if (e.altKey){
        var pos = goog.style.getClientPosition(e.currentTarget.element_);
        draw.scale(e.clientX - pos.x, e.clientY - pos.y, Math.pow(2, -e.detail/20));
        draw.redrawAll();
        e.preventDefault();
      } else if (e.shiftKey){
        draw.shift(-e.detail/40, 0);
        draw.redrawAll();
        e.preventDefault();
      } else if (!e.ctrlKey && !e.metaKey){
        draw.shift(0, -e.detail/40);
        draw.redrawAll();
        e.preventDefault();
      }
    };
    goog.events.listen(new goog.events.MouseWheelHandler(this.element), goog.events.MouseWheelHandler.EventType.MOUSEWHEEL, wheelHandler);
  }
}

bay.geom.ui.Handler.prototype.addClickListener = function(){
  if(this.properties.onclick){
    var handler = this;
    var draw = this.draw;
    var state = this.state;
    var clickHandler = function(e){
      if (state.isInfo){
        handler.showInfoDialog(e);
        e.preventDefault();
        return;
      }
      var pos = goog.style.getClientPosition(e.currentTarget);
      var coords = draw.reverseTransform([e.clientX - pos.x, e.clientY - pos.y]);
      var minDist = draw.properties.hoverdist / draw.transformation.getScaleX();
      var list = draw.geomCollections[0].getNeighbourList(coords[0], coords[1], minDist, true);
      list.sort(function(a,b){return a.distance - b.distance;});
      var point = null;
      for(var i=0;i<list.length;i++){
        if (list[i].element instanceof bay.geom.base.Point){
          point = list[i].element;
          break;
        }
      }
      if (!point){
        for(var i=0;i<list.length;i++){
          if (list[i].distance >= minDist) break;
          for(var j=i + 1;j<list.length;j++){
            var newPoint = bay.geom.base.getIntersection(list[i].element, list[j].element, coords[0], coords[1]);
            if (newPoint.isExists()){
              var dist = newPoint.distance(coords[0], coords[1]);
              if (dist <= minDist){
                point = newPoint;
                minDist = dist;
              }
            }
          }
        }
        if(point){
          draw.geomCollections[0].add(point);
        }
      }
      if (!point){
        point = new bay.geom.base.PointFree(coords[0], coords[1]);
        draw.geomCollections[0].add(point);
      }
      if (state.isRuler){
        if (state.rulerStart){
          draw.geomCollections[0].add(new bay.geom.base.Line_2p(state.rulerStart, point));
          handler.toggleRulerState(false);
        }else{
          state.rulerStart = point;
          state.rulerEndTmp = new bay.geom.base.PointFree(coords[0]+1, coords[1]+1);
          state.rulerEndTmp.hide();
          handler.tempCollection.add(state.rulerEndTmp);
          var line = new bay.geom.base.Line_2p(state.rulerStart, state.rulerEndTmp);
          line.current = true;
          handler.tempCollection.add(line);
        }
      }else if (state.isCompass){
        if (state.compassEnd){
          draw.geomCollections[0].add(new bay.geom.base.Circle_3p(point, state.compassStart, state.compassEnd));
          handler.toggleCompassState(false);
        }else if (state.compassStart){
          state.compassEnd = point;
          handler.tempCollection.clear();
          state.compassCenterTmp = new bay.geom.base.PointFree(coords[0], coords[1]);
          state.compassCenterTmp.hide();
          handler.tempCollection.add(state.compassCenterTmp);
          var circle = new bay.geom.base.Circle_3p(state.compassCenterTmp, state.compassStart, state.compassEnd)
          circle.current = true;
          handler.tempCollection.add(circle);
        } else{
          state.compassStart = point;
          state.compassEndTmp = new bay.geom.base.PointFree(coords[0]+1, coords[1]+1);
          state.compassEndTmp.hide();
          handler.tempCollection.add(state.compassEndTmp);
          var line = new bay.geom.base.Segment(state.compassStart, state.compassEndTmp);
          line.current = true;
          handler.tempCollection.add(line);
        }
      }
      draw.redrawAll();
      e.preventDefault();
    }
    goog.events.listen(this.element, goog.events.EventType.CLICK, clickHandler);
//    goog.events.listen(this.element, goog.events.EventType.TOUCHEND, clickHandler);
  }
}

bay.geom.ui.Handler.prototype.addDragListener = function(){
  if(this.properties.ondrag){
    var handler = this;
    var draw = this.draw;
    var state = this.state;
    var dragHandler = function(e){
      var pos = goog.style.getClientPosition(handler.element);
      var coords = draw.reverseTransform([e.clientX - pos.x, e.clientY - pos.y]);
      if (e.currentTarget.point)
        e.currentTarget.point.moveTo(coords[0],coords[1]);
    }

    goog.events.listen(this.element, goog.events.EventType.MOUSEDOWN, function(e) {
      var d = new goog.fx.Dragger(handler.element);
      var pos = goog.style.getClientPosition(e.currentTarget);
      var coords = draw.reverseTransform([e.clientX - pos.x, e.clientY - pos.y]);
      var minDist = draw.properties.hoverdist / draw.transformation.getScaleX();
      var list = draw.geomCollections[0].getNeighbourList(coords[0], coords[1], minDist, true);
      list.sort(function(a,b){return a.distance - b.distance;});
      var point = null;
      for(var i=0;i<list.length;i++){
        if (list[i].element instanceof bay.geom.base.PointFree){
          point = list[i].element;
          break;
        }
      }
      if(point)
        d.point = point;
      d.addEventListener(goog.fx.Dragger.EventType.DRAG, dragHandler );
      d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {d.dispose();});
      d.startDrag(e);
    });
  }
}

bay.geom.ui.Handler.prototype.addRightClickListener = function(){
  if(this.properties.onrightclick){
    goog.events.listen(this.element, goog.events.EventType.CONTEXTMENU, this.showInfoDialog, null, this);
  }
}

bay.geom.ui.Handler.prototype.toggleRulerState = function(newState){
  if (typeof newState === 'undefined'){
    newState = !this.state.isRuler;
  }
  if(newState){
    this.state.isRuler = 1;
    this.toggleCompassState(false);
    this.toggleInfoState(false);
    goog.dom.classes.add(this.buttons.bRuler.getElement(), 'pressedButton');
    goog.style.setStyle(this.element, 'cursor', 'url(ruler-pointer.gif),auto');
  }else{
    this.state.isRuler = 0;
    this.state.rulerStart = null;
    this.state.rulerEndTmp = null;
    this.tempCollection.clear();
    goog.dom.classes.remove(this.buttons.bRuler.getElement(), 'pressedButton');
    goog.style.setStyle(this.element, 'cursor', 'auto');
  }
}

bay.geom.ui.Handler.prototype.toggleCompassState = function(newState){
  if (typeof newState === 'undefined'){
    newState = !this.state.isCompass;
  }
  if(newState){
    this.state.isCompass = 1;
    this.toggleRulerState(false);
    this.toggleInfoState(false);
    goog.dom.classes.add(this.buttons.bCompass.getElement(), 'pressedButton');
    goog.style.setStyle(this.element, 'cursor', 'url(compass-pointer.gif),auto');
  }else{
    this.state.isCompass = 0;
    this.state.compassStart = null;
    this.state.compassEnd = null;
    this.state.compassEndTmp = null;
    this.state.compassCenterTmp = null;
    this.tempCollection.clear();
    goog.dom.classes.remove(this.buttons.bCompass.getElement(), 'pressedButton');
    goog.style.setStyle(this.element, 'cursor', 'auto');
  }
}

bay.geom.ui.Handler.prototype.toggleInfoState = function(newState){
  if (typeof newState === 'undefined'){
    newState = !this.state.isInfo;
  }
  if(newState){
    this.state.isInfo = 1;
    this.toggleRulerState(false);
    this.toggleCompassState(false);
    goog.dom.classes.add(this.buttons.bInfo.getElement(), 'pressedButton');
    goog.style.setStyle(this.element, 'cursor', 'url(info-pointer.gif),auto');
  }else{
    this.state.isInfo = 0;
    if (this.infoDialog){
      this.infoDialog.dispose();
      this.infoDialog = null;
    }
    goog.dom.classes.remove(this.buttons.bInfo.getElement(), 'pressedButton');
    goog.style.setStyle(this.element, 'cursor', 'auto');
  }
}

bay.geom.ui.Handler.prototype.addButtons = function(newState){
  var handler = this;
  var createButton = function(className, action){
    size = goog.style.getSize(handler.toolbarElement);
    var button = new goog.ui.Button();
    button.render(handler.toolbarElement);
    goog.style.setSize(button.getElement(), size.width-2, size.width-2);
    goog.dom.classes.add(button.getElement(), 'toolbarButton ' + className);
    goog.events.listen(button, goog.ui.Component.EventType.ACTION, action);
    return button;
  }
  this.buttons = {};
  this.buttons.bRuler = createButton('ruler', function(e) { handler.toggleRulerState();});
  this.buttons.bCompass = createButton('compass', function(e) { handler.toggleCompassState();});
  this.buttons.bZoomIn = createButton('zoom-in', function(e) { handler.zoomIn();});
  this.buttons.bZoomOut = createButton('zoom-out', function(e) { handler.zoomOut();});
  this.buttons.bInfo = createButton('info', function(e) { handler.toggleInfoState();});
}

bay.geom.ui.Handler.prototype.zoomIn = function(){

  this.draw.scale(this.draw.graphics.getCoordSize().width/2, this.draw.graphics.getCoordSize().height/2, 2);
  this.draw.redrawAll();
}

bay.geom.ui.Handler.prototype.zoomOut = function(){
  this.draw.scale(this.draw.graphics.getCoordSize().width/2, this.draw.graphics.getCoordSize().height/2, 0.5);
  this.draw.redrawAll();
}

bay.geom.ui.Handler.prototype.showInfoDialog = function(e){
  var handler = this;
  var pos = goog.style.getClientPosition(e.currentTarget);
  var coords = this.draw.reverseTransform([e.clientX - pos.x, e.clientY - pos.y]);
  var minDist = this.draw.properties.hoverdist / this.draw.transformation.getScaleX();
  var list = this.draw.geomCollections[0].getNeighbourList(coords[0], coords[1], minDist, true);
  list.sort(function(a,b){return a.distance - b.distance;});
  if(list.length > 0){
    handler.showInfo(e.clientX, e.clientY, list, 0);
  }else{
    if (this.infoDialog){
      this.infoDialog.dispose();
      this.infoDialog = null;
    }
  }
  e.preventDefault();
}

bay.geom.ui.Handler.prototype.showInfo = function(x, y, list, current){
  if(current < 0){
    current = list.length - 1;
  }
  if(current >= list.length){
    current = 0;
  }
  var handler = this;
  if(this.infoDialog){
    this.infoDialog.dispose();
    this.infoDialog = null;
  }
  var infoDialog = new goog.ui.Component();
  infoDialog.render(document.body);
  goog.dom.classes.add(infoDialog.getElement(), 'infoDialog');
  this.infoDialog = infoDialog;
  goog.style.setPosition(this.infoDialog.getElement(), x, y);
  if (list.length > 1){
    var leftButton = new goog.ui.Button('<');
    this.infoDialog.addChild(leftButton, true);
    goog.events.listen(leftButton, goog.ui.Component.EventType.ACTION, function(){handler.showInfo(x, y, list, current-1);});
    goog.dom.classes.add(leftButton.getElement(), 'navigate left');
    var rightButton = new goog.ui.Button('>');
    this.infoDialog.addChild(rightButton, true);
    goog.events.listen(rightButton, goog.ui.Component.EventType.ACTION, function(){handler.showInfo(x, y, list, current+1);});
    goog.dom.classes.add(rightButton.getElement(), 'navigate right');
  }
  element = list[current].element;
  var desc = new goog.ui.Control(element.toString());
  this.infoDialog.addChild(desc, true);
  goog.dom.classes.add(desc.getElement(), 'objDesc');
  if (element instanceof bay.geom.base.Point){
    var label = new goog.ui.BidiInput();
    this.infoDialog.addChild(label, true);
    label.setValue(element.label);
    goog.dom.classes.add(label.getElement(), 'labelInput');
  }
  var hideButton = new goog.ui.Button('Hide');
  this.infoDialog.addChild(hideButton, true);
  goog.dom.classes.add(hideButton.getElement(), 'hideButton');
  goog.events.listen(hideButton, goog.ui.Component.EventType.ACTION, function(){element.hide();handler.draw.redrawAll(); infoDialog.dispose();handler.infoDialog = null;});
  if(label)
    goog.events.listen(label.getElement(), goog.ui.Component.EventType.BLUR, function(){element.label = label.getValue();});
  goog.style.showElement(this.infoDialog.getElement(), true);
}
