goog.provide('bay.geom.ui')

goog.require('goog.events.MouseWheelHandler');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Button');
goog.require('goog.ui.BidiInput');
goog.require('goog.ui.Textarea');
goog.require('goog.ui.KeyboardShortcutHandler');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.PopupMenu');
goog.require('goog.ui.ColorMenuButton');
goog.require('goog.ui.CustomColorPalette');
goog.require('goog.ui.Checkbox');
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
  this.traceCollection = bay.geom.base.Create();
  this.draw.geomCollections.push(this.traceCollection);
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
    if (list.length > 0 && list[0].element.closestPoint){
      // closest point on a line
      point = list[0].element.closestPoint(coords);
    }else{
      // free point
      point = new bay.geom.base.PointFree(coords);
    }
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
      if (this.state.rectEndTmp) this.state.rectEndTmp.moveTo(this.getConvertEventPos(e));
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
    }
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
      }else if (this.state.isRect){
        // now user is using rect tool
        if (this.state.rectStart){
          this.draw.getMainCollection().add(new bay.geom.diagram.Rectangle(this.state.rectStart, point));
          this.toggleRectState(false);
        }else{
          this.tempCollection.clear();
          this.state.rectStart = point;
          this.tempCollection.add(this.state.rectEndTmp = new bay.geom.base.PointFree(point));
          this.state.rectEndTmp.hide();
          this.tempCollection.add(rect = new bay.geom.diagram.Rectangle(this.state.rectStart, this.state.rectEndTmp));
          rect.current = true;
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
      if (this.dragger.point && this.dragger.point.moveTo)
        this.dragger.point.moveTo(this.getConvertEventPos(e));
        this.Tracer();
    }
    goog.events.listen(
      this.element,
      goog.events.EventType.MOUSEDOWN,
      function(e) {
        var minDist = this.draw.getHoverDist();
        var list = this.  draw.getMainCollection().getNeighbourList(this.getConvertEventPos(e), minDist, true, true);
        var point = this.findPoint(list);
        this.dragger = new goog.fx.Dragger(this.element);
        if(point)
          this.dragger.point = point;
        goog.events.listen(this.dragger, goog.fx.Dragger.EventType.DRAG, dragHandler, null, this );
        goog.events.listen(this.dragger, goog.fx.Dragger.EventType.END, function(e) {if (this.dragger) {this.dragger.dispose(); this.dragger = null;}}, null, this );
        this.dragger.startDrag(e);
      },
      null,
      this);
  }
}

bay.geom.ui.Handler.prototype.addRightClickListener = function(){
  if(this.properties.onrightclick){
    goog.events.listen(this.element, goog.events.EventType.CONTEXTMENU, this.showInfoDialog, null, this);
  }
}

bay.geom.ui.Handler.prototype.addKeyboardListener = function(){
  var shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
  shortcutHandler.registerShortcut('CTRL_J', goog.events.KeyCodes.J, goog.ui.KeyboardShortcutHandler.Modifiers.CTRL);
  var onKeyPress = function(e){
    if(e.identifier == 'CTRL_J'){
      this.showCodePanel();
    }
  }
  goog.events.listen(shortcutHandler, goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED, onKeyPress, null, this);
}

// ******************************* toolbar buttons ***********************************//
bay.geom.ui.Handler.prototype.addButtons = function(){
  var handler = this;
  var createButton = function(className, action){
    var size = goog.style.getSize(handler.toolbarElement);
    var button = new goog.ui.Button();
    button.render(handler.toolbarElement);
    goog.style.setSize(button.getElement(), size.width - 2, size.width - 2);
    goog.dom.classes.add(button.getElement(), 'toolbarButton ' + className);
    if (action)
      goog.events.listen(button, goog.ui.Component.EventType.ACTION, action);
    return button;
  }
  this.buttons = {};
  this.buttons.bRuler = createButton('ruler', function(e) { handler.toggleRulerState();});
  this.buttons.bCompass = createButton('compass', function(e) { handler.toggleCompassState();});
  this.buttons.bRect = createButton('rect', function(e) { handler.toggleRectState();});
  this.buttons.bZoomIn = createButton('zoom-in', function(e) { handler.zoomIn();});
  this.buttons.bZoomOut = createButton('zoom-out', function(e) { handler.zoomOut();});
  this.buttons.bInfo = createButton('info', function(e) { handler.toggleInfoState();});
  if (this.properties.demoList){
    this.buttons.bDemos = createButton('demo');
    var pm = new goog.ui.PopupMenu();
    for(var i=0; i < this.properties.demoList.length; i++){
      pm.addItem(new goog.ui.MenuItem(this.properties.demoList[i].label));
    }
    goog.events.listen(pm, goog.ui.Component.EventType.ACTION, function(e){this.showDemo(e.target.getCaption());}, null, this);
    pm.render(document.body);
    pm.attach(
        this.buttons.bDemos.getElement(),
        goog.positioning.Corner.BOTTOM_RIGHT,
        goog.positioning.Corner.BOTTOM_LEFT);
  }
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
    leftButton.setTooltip('Click to select other element');
    goog.events.listen(leftButton, goog.ui.Component.EventType.ACTION, function(){this.showInfo(x, y, list, current-1);}, null, this);
    goog.dom.classes.add(leftButton.getElement(), 'navigate left');
    var rightButton = new goog.ui.Button('>');
    rightButton.setTooltip('Click to select other element');
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
  hideButton.setTooltip('Click to hide element');
  this.infoDialog.addChild(hideButton, true);
  goog.dom.classes.add(hideButton.getElement(), 'hideButton');
  goog.events.listen(hideButton, goog.ui.Component.EventType.ACTION, function(e){element.hide();this.draw.redrawAll(); this.infoDialog.dispose();this.infoDialog = null;}, null, this);
  // check box to turn on trace
  var traceCb = new goog.ui.Checkbox(element.trace);
  this.infoDialog.addChild(traceCb, true);
  var traceCbLabel = new goog.ui.Control('Trace');
  this.infoDialog.addChild(traceCbLabel, true);
  goog.dom.classes.add(traceCbLabel.getElement(), 'traceCheck');
  goog.dom.classes.add(traceCb.getElement(), 'traceCheck');
  goog.events.listen(traceCb, goog.ui.Component.EventType.ACTION, function(e){element.trace = true;this.draw.redrawAll();}, null, this);
  // button to colorize element
  var colorButton = new goog.ui.ColorMenuButton('Color');
  colorButton.setTooltip('Click to select color');
  if (element.color)
    colorButton.setSelectedColor(element.color);
  else
    colorButton.setSelectedColor('#000000');
  this.infoDialog.addChild(colorButton, true);
  goog.dom.classes.add(colorButton.getElement(), 'colorButton');
  goog.events.listen(colorButton, goog.ui.Component.EventType.ACTION, function(e){element.color=colorButton.getSelectedColor();this.draw.redrawAll();}, null, this);
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
    this.toggleRectState(false);
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
    this.toggleRectState(false);
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
    this.toggleRectState(false);
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

bay.geom.ui.Handler.prototype.toggleRectState = function(newState){
  if (typeof newState === 'undefined'){
    newState = !this.state.isRect;
  }
  if(newState){
    this.state.isRect = 1;
    this.toggleRulerState(false);
    this.toggleCompassState(false);
    this.toggleInfoState(false);
    goog.dom.classes.add(this.buttons.bRect.getElement(), 'pressedButton');
    goog.dom.classes.add(this.element, 'infoRect');
  }else{
    this.state.isRect = 0;
    this.state.rectStart = null;
    this.state.rectEndTmp = null;
    this.tempCollection.clear();
    goog.dom.classes.remove(this.buttons.bRect.getElement(), 'pressedButton');
    goog.dom.classes.remove(this.element, 'infoRect');
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

bay.geom.ui.Handler.prototype.showDemo = function(demoLabel){
  this.toggleCompassState(false);
  this.toggleRulerState(false);
  this.toggleInfoState(false);
  for(var i=0; i < this.properties.demoList.length; i++){
    if (this.properties.demoList[i].label == demoLabel){
      this.traceCollection.clear();
      this.draw.getMainCollection().rebuild(this.properties.demoList[i].data);
      this.draw.redrawAll();
    }
  }
}

// ************************************** tracing elements ****************************************** //
bay.geom.ui.Handler.prototype.Tracer = function(){
  var list = this.draw.getGeomElements();
  for(var i = 0; i < list.length; i++){
    if(list[i].trace && list[i].exists){
      if(list[i] instanceof bay.geom.base.Point){
        var tracer = new bay.geom.base.PointFree(list[i]);
      }
      else if(list[i] instanceof bay.geom.base.Segment){
        var tracer = new bay.geom.base.Segment(new bay.geom.base.PointFree(list[i].startPoint), new bay.geom.base.PointFree(list[i].endPoint));
      }
      else if(list[i] instanceof bay.geom.base.Line){
        var tracer = new bay.geom.base.Line();
        tracer.startPoint = new bay.geom.base.PointFree(list[i].startPoint);
        tracer.direction = new bay.geom.base.Vector(list[i].direction);
      }
      else if(list[i] instanceof bay.geom.base.Circle){
        var tracer = new bay.geom.base.Circle();
        tracer.centerPoint = new bay.geom.base.PointFree(list[i].centerPoint);
        tracer.radius = list[i].radius;
      }
      tracer.exists = true;
      this.traceCollection.add(tracer);
    }
  }
}
