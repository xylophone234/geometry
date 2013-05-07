goog.provide('bay.geom.ui')

goog.require('goog.events.MouseWheelHandler');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Button');
goog.require('goog.ui.BidiInput');
goog.require('goog.ui.Textarea');
goog.require('goog.ui.KeyboardShortcutHandler');
goog.require('goog.style');

bay.geom.ui.Handler = function(drawArea, toolbarElement, props){
  if(typeof drawArea === 'string')
    this.draw = new bay.geom.draw.Area(drawArea);
  else
    this.draw = drawArea;
  if(typeof toolbarElement === 'string')
    this.toolbarElement = goog.dom.getElement(toolbarElement);
  else
    this.toolbarElement = toolbarElement;
  this.element = this.draw.getContentElement();
  this.tempCollection = bay.geom.base.Create();
  this.draw.geomCollections.push(this.tempCollection);
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
    this.addKeyboardListener();
  }
  if (toolbarElement){
    this.addButtons();
  }
}

// *************************** event utilities *************************************** //
bay.geom.ui.Handler.prototype.findPoint = function(list){
  for(var i=0;i<list.length;i++){
    if (list[i].element instanceof bay.geom.base.Point){
      return list[i].element;
    }
  }
  return null;
}

bay.geom.ui.Handler.prototype.pointAtEventPosition = function(e){
  // add point at click position
  var coords = this.getConvertEventPos(e);
  var minDist = this.draw.getHoverDist();
  var list = this.draw.getMainCollection().getNeighbourList(coords, minDist, true, true);
  // try to find already existed point
  var point = this.findPoint(list);
  // try to find closest intersectionpoint
  if (!point){
    for(var i=0;i<list.length;i++){
      if (list[i].distance >= minDist) break;
      for(var j=i + 1;j<list.length;j++){
        var newPoint = bay.geom.base.getIntersection(list[i].element, list[j].element, coords);
        if (newPoint.isExists()){
          var dist = newPoint.distance(coords);
          if (dist <= minDist){
            point = newPoint;
            minDist = dist;
          }
        }
      }
    }
    if(point){
      this.draw.getMainCollection().add(point);
    }
  }
  if (!point){
    // if point not exists and no intersections - add new
    point = new bay.geom.base.PointFree(coords);
    this.draw.getMainCollection().add(point);
  }
  return point;
}

bay.geom.ui.Handler.prototype.getEventPos = function(e){
  var pos = goog.style.getClientPosition(this.element);
  return new bay.geom.base.Vector(e.clientX - pos.x, e.clientY - pos.y);
}

bay.geom.ui.Handler.prototype.getConvertEventPos = function(e){
  return this.draw.reverseTransform(this.getEventPos(e));
}


// *********************************** listeners *********************************************//
bay.geom.ui.Handler.prototype.addHoverListener = function(){
  if (this.properties.hover){
    var moveHandler = function(e){
      this.draw.markHoverElements(this.getEventPos(e));
      if (this.state.rulerEndTmp) this.state.rulerEndTmp.moveTo(this.getConvertEventPos(e));
      if (this.state.compassEndTmp) this.state.compassEndTmp.moveTo(this.getConvertEventPos(e));
      if (this.state.compassCenterTmp) this.state.compassCenterTmp.moveTo(this.getConvertEventPos(e));
      this.draw.redrawAll();
    }
    goog.events.listen(this.element, goog.events.EventType.MOUSEMOVE, moveHandler, null, this);
  }
}

bay.geom.ui.Handler.prototype.addWheelListener = function(){
  if(this.properties.onwheel){
    var draw = this.draw;
    var wheelHandler = function(e){
      if (e.altKey){
        draw.scale(this.getEventPos(e), Math.pow(2, -e.detail/20));
      } else if (e.shiftKey){
        draw.shift(new bay.geom.base.Vector(-e.detail/40, 0));
      } else if (!e.ctrlKey && !e.metaKey){
        draw.shift(new bay.geom.base.Vector(0, -e.detail/40));
      }
      draw.redrawAll();
      e.preventDefault();
    };
    goog.events.listen(new goog.events.MouseWheelHandler(this.element), goog.events.MouseWheelHandler.EventType.MOUSEWHEEL, wheelHandler, null, this);
  }
}

bay.geom.ui.Handler.prototype.addClickListener = function(){
  if(this.properties.onclick){
    var clickHandler = function(e){
      if (this.state.isInfo){
        // the same as right click
        this.showInfoDialog(e);
        e.preventDefault();
        return;
      }
      // find or add point at click position
      var point = this.pointAtEventPosition(e);
      if (this.state.isRuler){
        // now user is using ruler
        if (this.state.rulerStart){
          this.draw.getMainCollection().add(new bay.geom.base.Line_2p(this.state.rulerStart, point));
          this.toggleRulerState(false);
        }else{
          this.tempCollection.clear();
          this.state.rulerStart = point;
          this.tempCollection.add(this.state.rulerEndTmp = new bay.geom.base.PointFree(point));
          this.state.rulerEndTmp.hide();
          this.tempCollection.add(line = new bay.geom.base.Line_2p(this.state.rulerStart, this.state.rulerEndTmp));
          line.current = true;
        }
      }else if (this.state.isCompass){
        // now user is using compass
        if (this.state.compassEnd){
          this.draw.getMainCollection().add(new bay.geom.base.Circle_3p(point, this.state.compassStart, this.state.compassEnd));
          this.toggleCompassState(false);
        }else if (this.state.compassStart){
          this.tempCollection.clear();
          this.state.compassEnd = point;
          this.tempCollection.add(this.state.compassCenterTmp = new bay.geom.base.PointFree(point));
          this.state.compassCenterTmp.hide();
          this.tempCollection.add(circle = new bay.geom.base.Circle_3p(this.state.compassCenterTmp, this.state.compassStart, this.state.compassEnd));
          circle.current = true;
        } else{
          this.state.compassStart = point;
          this.tempCollection.add(this.state.compassEndTmp = new bay.geom.base.PointFree(point));
          this.state.compassEndTmp.hide();
          this.tempCollection.add(line = new bay.geom.base.Segment(this.state.compassStart, this.state.compassEndTmp));
          line.current = true;
        }
      }
      this.draw.redrawAll();
      e.preventDefault();
    }
    goog.events.listen(this.element, goog.events.EventType.CLICK, clickHandler, null, this);
  }
}

bay.geom.ui.Handler.prototype.addDragListener = function(){
  if(this.properties.ondrag){
    var dragHandler = function(e){
      if (this.dragger.point)
        this.dragger.point.moveTo(this.getConvertEventPos(e));
    }
    goog.events.listen(this.element, goog.events.EventType.MOUSEDOWN, function(e) {
      var minDist = this.draw.getHoverDist();
      var list = this.  draw.getMainCollection().getNeighbourList(this.getConvertEventPos(e), minDist, true, true);
      var point = this.findPoint(list);
      this.dragger = new goog.fx.Dragger(this.element);
      if(point)
        this.dragger.point = point;
      goog.events.listen(this.dragger, goog.fx.Dragger.EventType.DRAG, dragHandler, null, this );
      goog.events.listen(this.dragger, goog.fx.Dragger.EventType.END, function(e) {if (this.dragger) {this.dragger.dispose(); this.dragger = null;}}, null, this );
      this.dragger.startDrag(e);
    }, null, this);
  }
}

bay.geom.ui.Handler.prototype.addRightClickListener = function(){
  if(this.properties.onrightclick){
    goog.events.listen(this.element, goog.events.EventType.CONTEXTMENU, this.showInfoDialog, null, this);
  }
}

bay.geom.ui.Handler.prototype.addKeyboardListener = function(){
  var shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
  var CTRL = goog.ui.KeyboardShortcutHandler.Modifiers.CTRL;
  shortcutHandler.registerShortcut('CTRL_J', goog.events.KeyCodes.J, CTRL);
  var onKeyPress = function(e){
    if(e.identifier == 'CTRL_J'){
      this.showCodePanel();
    }
  }
  goog.events.listen(shortcutHandler, goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED, onKeyPress, null, this);
}

// ******************************* toolbar buttons ***********************************//
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

// *********************************** info Dialog *********************************************//
bay.geom.ui.Handler.prototype.showInfoDialog = function(e){
  var minDist = this.draw.getHoverDist();
  var list = this.draw.getMainCollection().getNeighbourList(this.getConvertEventPos(e), minDist, true, true);
  if(list.length > 0){
    this.showInfo(e.clientX, e.clientY, list, 0);
  }else{
    if (this.infoDialog){
      this.infoDialog.dispose();
      this.infoDialog = null;
    }
  }
  e.preventDefault();
}

bay.geom.ui.Handler.prototype.showInfo = function(x, y, list, current){
  // recreate dialog
  if(this.infoDialog){
    this.infoDialog.dispose();
    this.infoDialog = null;
  }
  var infoDialog = new goog.ui.Component();
  infoDialog.render(document.body);
  goog.dom.classes.add(infoDialog.getElement(), 'infoDialog');
  this.infoDialog = infoDialog;
  goog.style.setPosition(this.infoDialog.getElement(), x, y);
  // add navigate buttons if number of elements more then one
  if (list.length > 1){
    var leftButton = new goog.ui.Button('<');
    this.infoDialog.addChild(leftButton, true);
    goog.events.listen(leftButton, goog.ui.Component.EventType.ACTION, function(){this.showInfo(x, y, list, current-1);}, null, this);
    goog.dom.classes.add(leftButton.getElement(), 'navigate left');
    var rightButton = new goog.ui.Button('>');
    this.infoDialog.addChild(rightButton, true);
    goog.events.listen(rightButton, goog.ui.Component.EventType.ACTION, function(){this.showInfo(x, y, list, current+1);}, null, this);
    goog.dom.classes.add(rightButton.getElement(), 'navigate right');
  }
  // build descriptor for the current element
  if(current < 0) current = list.length - 1;
  if(current >= list.length) current = 0;
  element = list[current].element;
  // text with elements decription
  var desc = new goog.ui.Control(element.toString());
  this.infoDialog.addChild(desc, true);
  goog.dom.classes.add(desc.getElement(), 'objDesc');
  // input to set label for points
  if (element instanceof bay.geom.base.Point){
    var label = new goog.ui.BidiInput();
    this.infoDialog.addChild(label, true);
    label.setValue(element.label);
    goog.events.listen(label.getElement(), goog.ui.Component.EventType.BLUR, function(){element.label = label.getValue();}, null, this);
    goog.dom.classes.add(label.getElement(), 'labelInput');
  }
  // button to hide element
  var hideButton = new goog.ui.Button('Hide');
  this.infoDialog.addChild(hideButton, true);
  goog.dom.classes.add(hideButton.getElement(), 'hideButton');
  goog.events.listen(hideButton, goog.ui.Component.EventType.ACTION, function(){element.hide();this.draw.redrawAll(); this.infoDialog.dispose();this.infoDialog = null;}, null, this);
  // show the descriptor
  goog.style.showElement(this.infoDialog.getElement(), true);
}

// *********************************** codePanel *********************************************//
bay.geom.ui.Handler.prototype.showCodePanel = function(){
  var dialog = new goog.ui.Dialog();
  dialog.setTitle('JSON code for drawing');
  dialog.setButtonSet(goog.ui.Dialog.ButtonSet.OK_CANCEL);
  var textArea = new goog.ui.Textarea(this.draw.getMainCollection().jsonCode());
  textArea.setMinHeight(300);
  dialog.addChild(textArea, true);
  goog.dom.classes.add(textArea.getElement(), 'codeArea');
  goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT, function(e) {
    if (e.key == 'ok'){
      this.draw.getMainCollection().parseJson(textArea.getValue());
      this.draw.redrawAll();
    }
    dialog.dispose();
  }, null, this);
  dialog.setVisible(true);
}

// *********************************** actions *********************************************//
bay.geom.ui.Handler.prototype.toggleRulerState = function(newState){
  if (typeof newState === 'undefined'){
    newState = !this.state.isRuler;
  }
  if(newState){
    this.state.isRuler = 1;
    this.toggleCompassState(false);
    this.toggleInfoState(false);
    goog.dom.classes.add(this.buttons.bRuler.getElement(), 'pressedButton');
    goog.dom.classes.add(this.element, 'rulerDrawing');
  }else{
    this.state.isRuler = 0;
    this.state.rulerStart = null;
    this.state.rulerEndTmp = null;
    this.tempCollection.clear();
    goog.dom.classes.remove(this.buttons.bRuler.getElement(), 'pressedButton');
    goog.dom.classes.remove(this.element, 'rulerDrawing');
  }
  this.draw.redrawAll();
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
    goog.dom.classes.add(this.element, 'compassDrawing');
  }else{
    this.state.isCompass = 0;
    this.state.compassStart = null;
    this.state.compassEnd = null;
    this.state.compassEndTmp = null;
    this.state.compassCenterTmp = null;
    this.tempCollection.clear();
    goog.dom.classes.remove(this.buttons.bCompass.getElement(), 'pressedButton');
    goog.dom.classes.remove(this.element, 'compassDrawing');
  }
  this.draw.redrawAll();
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
    goog.dom.classes.add(this.element, 'infoDrawing');
  }else{
    this.state.isInfo = 0;
    if (this.infoDialog){
      this.infoDialog.dispose();
      this.infoDialog = null;
    }
    goog.dom.classes.remove(this.buttons.bInfo.getElement(), 'pressedButton');
    goog.dom.classes.remove(this.element, 'infoDrawing');
  }
  this.draw.redrawAll();
}

bay.geom.ui.Handler.prototype.zoomIn = function(){
  this.draw.scale(new bay.geom.base.Vector(this.draw.graphics.getCoordSize().width/2, this.draw.graphics.getCoordSize().height/2), 2);
  this.toggleInfoState(false);
  this.draw.redrawAll();
}

bay.geom.ui.Handler.prototype.zoomOut = function(){
  this.draw.scale(new bay.geom.base.Vector(this.draw.graphics.getCoordSize().width/2, this.draw.graphics.getCoordSize().height/2), 0.5);
  this.toggleInfoState(false);
  this.draw.redrawAll();
}
