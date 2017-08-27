import React, { Component } from 'react';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import ColorPicker from './ColorPicker';
import '../../lib/react-contextmenu.css';
import './styles.css';
import { fabric } from 'fabric';

const scaleObject = (obj, factor)=>{
  const scalable = [
    "left",
    "top",
    "scaleX",
    "scaleY",
  ];

  scalable.forEach((prop)=>{
    obj[prop] *= factor;
  });

  if (obj.setCoords) {
    obj.setCoords(true);
  }
  return obj;
};

export default class PosterCreator extends Component {
  static MAX_WIDTH = 1000;

  state = {
    selection: null,
  };

  constructor(props){
    super(props);
    this.onCanvasMount = this.onCanvasMount.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.spawnPrimitive = this.spawnPrimitive.bind(this);
    this.renderSink = this.renderSink.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);

    this.sendAllWayBack = this.sendAllWayBack.bind(this);
    this.bringAllWayFront = this.bringAllWayFront.bind(this);

    this.id = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
  }

  handleColorChange(obj, prop, color) {
    obj.set(prop, color);
    this.artboard.renderAll();
  }

  renderSink() {
    if (!this.state.selection || this.props.disableInteractions) {
      return null;
    }

    const toolList = [
      'fill',
      'stroke',
    ];

    return (
      <div key={this.state.selection}>
        { toolList.map((prop)=>
          <ColorPicker
            color={this.state.selection[prop]}
            onChange={(color)=>this.handleColorChange(this.state.selection, prop, color)}
            label={prop}
          />
        )}
      </div>
    );
  }

  render() {
    const canvasId = this.state.selection ? 'selection' : 'canvas';
    const menuContent = this.state.selection ? this.getMenuForSelection() : this.getMenuForCanvas();
    return (
      <div>
        <ContextMenuTrigger holdToDisplay={-1} id={ canvasId } disable={this.props.disableInteractions}>
          <div {...this.props} ref={this.onCanvasMount}>
            <canvas id={ this.id } />
          </div>
        </ContextMenuTrigger>
        { this.renderSink() }

        { menuContent }
      </div>
    )
  }

  sendSelectionBack() {
    this.artboard.sendBackwards(this.state.selection);
  }

  bringSelectionForward() {
    this.artboard.bringForward(this.state.selection);
  }

  sendAllWayBack() {
    this.artboard.sendToBack(this.state.selection);
  }
  bringAllWayFront() {
    this.artboard.bringToFront(this.state.selection);
  }

  cloneActiveSelection() {
    this.state.selection.clone((clone)=>{
      clone.set('top', clone.top - 15);
      clone.set('left', clone.left + 15);

      this.artboard.add(clone);
    });
  }

  removeSelection(force){
    if(force === true || window.confirm('Are you sure you want to remove this?')){
      this.artboard.remove(this.state.selection).renderAll();
      this.saveCanvas();
    }
  }

  getMenuForSelection() {
    return (
      <ContextMenu hideOnLeave id="selection">
        <MenuItem onClick={this.cloneActiveSelection.bind(this)}>
          Duplicate
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={this.bringAllWayFront.bind(this)}>
          Bring To Front
        </MenuItem>
        <MenuItem onClick={this.bringSelectionForward.bind(this)}>
          Bring Forward
        </MenuItem>
        <MenuItem onClick={this.sendSelectionBack.bind(this)}>
          Send Backward
        </MenuItem>
        <MenuItem onClick={this.sendAllWayBack.bind(this)}>
          Send To Back
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={this.removeSelection.bind(this)}>
          Remove
        </MenuItem>
      </ContextMenu>
    );
  }

  spawnImage(which, ext = 'jpg') {
    return () => {
      fabric.Image.fromURL(`/${which}.${ext}`, (oImg)=>{
        oImg.set('left', this.artboard.getWidth() / 2);
        oImg.set('top', this.artboard.getHeight() / 2);

        this.artboard.add(oImg);
      });
    };
  }


  spawnPrimitive(type) {
    return () => {
      let newElement;

      switch (type) {
        case 'rect':
        newElement = new fabric.Rect({
          left: this.artboard.getWidth() / 2,
          top: this.artboard.getHeight() / 2,
          fill: 'rgba(255,0,0,1)',
          height: 25,
          width: 25,
        });
        break;
        case 'circle':
        newElement = new fabric.Circle({
          left: this.artboard.getWidth() / 2,
          top: this.artboard.getHeight() / 2,
          fill: 'rgba(255,0,0,1)',
          radius:  25,
        });
        break;
        case 'triangle':
        newElement = new fabric.Triangle({
          left: this.artboard.getWidth() / 2,
          top: this.artboard.getHeight() / 2,
          fill: 'rgba(255,0,0,1)',
          width: 25,
          height: 25,
        });
        break;
        case 'line':
        newElement = new fabric.Line([
          this.artboard.getWidth() / 2, 0, this.artboard.getWidth() / 2, this.artboard.getHeight()
        ]);
        break;
        case 'text':
        newElement = new fabric.IText('Double-Click to Edit Me!', {
          left: this.artboard.getWidth() / 2,
          top: this.artboard.getHeight() / 2,
          fill: 'rgba(255,255,255,1)',
          stroke: 'rgba(0,0,0,1)',
          strokeWidth: 2,
          fontFamily: "Impact, sans-serif",
          fontWeight: 900,
        });
        break;
        default:
        return;
      }

      this.artboard.add(newElement);

    }
  }

  getMenuForCanvas() {
    return (
      <ContextMenu hideOnLeave id="canvas">
          <SubMenu title='Add'>
            <SubMenu title='Basic'>
              <MenuItem onClick={this.spawnPrimitive('text')}>Text</MenuItem>
              <MenuItem onClick={this.spawnPrimitive('rect')}>Rect</MenuItem>
              <MenuItem onClick={this.spawnPrimitive('circle')}>Circle</MenuItem>
              <MenuItem onClick={this.spawnPrimitive('triangle')}>Triangle</MenuItem>
              <MenuItem onClick={this.spawnPrimitive('line')}>Line</MenuItem>
            </SubMenu>
            <SubMenu title='Items'>
              <MenuItem onClick={this.spawnImage('pots', 'png')}>Pots</MenuItem>
              <MenuItem onClick={this.spawnImage('lumberjack-box', 'png')}>Box (Lumberjack)</MenuItem>
              <MenuItem onClick={this.spawnImage('frisbee-box', 'png')}>Box (Frisbee)</MenuItem>
            </SubMenu>
            <SubMenu title='Weapons'>
              <MenuItem onClick={this.spawnImage('blue-grenade', 'png')}>Grenade (Blue)</MenuItem>
              <MenuItem onClick={this.spawnImage('blue-pistol', 'png')}>Pistol (Blue)</MenuItem>
              <MenuItem onClick={this.spawnImage('blue-repeater', 'png')}>Repeater (Blue)</MenuItem>
              <MenuItem onClick={this.spawnImage('blue-shotgun', 'png')}>Shotgun (Blue)</MenuItem>
              <MenuItem onClick={this.spawnImage('blue-sniper', 'png')}>Sniper (Blue)</MenuItem>
            </SubMenu>
            <SubMenu title='Backgrounds'>
              <MenuItem onClick={this.spawnImage('quest-start')}>Quest Room</MenuItem>
              <MenuItem onClick={this.spawnImage('clearcut')}>Clearcut</MenuItem>
              <MenuItem onClick={this.spawnImage('homestead')}>Homestead</MenuItem>
              <MenuItem onClick={this.spawnImage('quarry')}>Quarry</MenuItem>
              <MenuItem onClick={this.spawnImage('river')}>River</MenuItem>
              <MenuItem onClick={this.spawnImage('spillway')}>Spillway</MenuItem>
            </SubMenu>
        </SubMenu>
      </ContextMenu>
    );
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('keyup', this.keyupHandler);
  }

  loadJSON(saved, lastSeenSize) {
    if (typeof saved === 'string') { saved = JSON.parse(saved); }
    // Determine how big we are compared to full size.
    const currentWidth = Math.min(PosterCreator.MAX_WIDTH, parseFloat(getComputedStyle(this.canvasElement).width.replace('px', '')));
    const factor = currentWidth / parseFloat(lastSeenSize || '1');

    saved.objects = saved.objects.map((obj)=>{
      return scaleObject(obj, factor);
    });

    // Import the SVG elements.
    this.artboard.loadFromJSON(saved, ()=>{ this.artboard.renderAll(); });
  }

  onCanvasMount(el){
    if (!el) {
      return;
    }
    this.canvasElement = el;

    this.resizeHandler = window.addEventListener('resize', ()=>this.onWindowResize(el));
    this.keyupHandler = window.addEventListener('keyup', (event)=>{
      if (!this.state.selection || !this.artboard){ return; }

      if (event.keyCode === 8 && !this.state.selection.isEditing){
        this.removeSelection();
      } else if (event.keyCode === 27){
        this.artboard.discardActiveObject().renderAll();
      }
    })
    this.onWindowResize(el, true);

    const CanvasCreator = !this.props.disableInteractions ? fabric.Canvas : fabric.StaticCanvas;

    this.artboard = new CanvasCreator(this.id, {
      backgroundColor: 'rgba(100,100,200,1)',
      centeredRotation: true,
      preserveObjectStacking: true,
    });


    this.artboard.on('object:selected', ({ target })=>{
      this.setState({
        selection: target,
      });
    });

    this.artboard.on('selection:cleared', ()=>{
      this.setState({
        selection: null,
      });
    });


    this.artboard.on('object:modified', this.saveCanvas.bind(this));
    this.artboard.on('object:added', this.saveCanvas.bind(this));

    const inProgress = localStorage.getItem('poster');

    // #TODO: scale the initial objects. Small screens overflow, currently.
    if (!inProgress){
      fabric.Image.fromURL('/clearcut.jpg', (oImg)=>{
        oImg.left = oImg.width / -2;
        oImg.top = oImg.height / -2;

        var text = new fabric.IText('hello world', {
          left: 100, top: 100,
          fill: 'rgba(255,255,255,1)',
          stroke: 'rgba(0,0,0,1)',
          strokeWidth: 2,
          fontFamily: "Impact, sans-serif",
          fontWeight: 900,
        });

        this.artboard.add(oImg, text).renderAll();
        this.saveCanvas(true);
      });
    } else {
      const lastSeenSize = localStorage.getItem('poster-size');
      setTimeout(()=>this.loadJSON(inProgress, lastSeenSize), 1);
    }

    this.onWindowResize(el, true);
  }

  saveCanvas(force) {
    const saved = this.artboard.toObject();
    const savedString = JSON.stringify(saved);
    localStorage.setItem('poster', savedString);

    const baseWidth = Math.min(PosterCreator.MAX_WIDTH, parseFloat(getComputedStyle(this.canvasElement).width.replace('px', '')));
    localStorage.setItem('poster-size', baseWidth);

    this.props.onChange && this.props.onChange([savedString, baseWidth]);
  }

  onWindowResize() {
    const baseWidth = Math.min(PosterCreator.MAX_WIDTH, parseFloat(getComputedStyle(this.canvasElement).width.replace('px', '')));
    const newHeight = baseWidth / (16/9);

    let diff = 1;
    if(this.oldWidth){
      diff = baseWidth / this.oldWidth;
    }
    this.oldWidth = baseWidth;

    if(this.artboard){
      zoomIt(this.artboard, diff, baseWidth, newHeight);
    }
  }
}

function zoomIt(canvas, factor, bW, bH) {
  canvas.setWidth(bW);
  canvas.setHeight(bH);
  if (canvas.backgroundImage) {
      // Need to scale background images as well
      var bi = canvas.backgroundImage;
      bi.width *= factor;
      bi.height *= factor;
  }

  var objects = canvas.getObjects();
  for (var i in objects) {
    scaleObject(objects[i], factor)
  }
  canvas.renderAll();
  canvas.calcOffset();
}
