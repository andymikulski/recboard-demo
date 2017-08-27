import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router'
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";

import '../../lib/react-contextmenu.css';
import './styles.css';
import { fabric } from 'fabric';

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

    this.id = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
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

  cloneActiveSelection() {
    this.state.selection.clone((clone)=>{
      clone.set('top', clone.top - 15);
      clone.set('left', clone.left + 15);

      this.artboard.add(clone);
    });
  }

  removeSelection(force){
    if(force === true || window.confirm('Are you sure you want to remove this?')){
      this.artboard.remove(this.state.selection);
    }
  }

  getMenuForSelection() {
    return (
      <ContextMenu hideOnLeave id="selection">
        <MenuItem onClick={this.cloneActiveSelection.bind(this)}>
          Duplicate
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={this.bringSelectionForward.bind(this)}>
          Bring Forward
        </MenuItem>
        <MenuItem onClick={this.sendSelectionBack.bind(this)}>
          Send Backward
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
          fill: '#f00',
          height: Math.ceil(Math.random() * 25) + 5,
          width: Math.ceil(Math.random() * 25) + 5,
        });
        break;
        case 'circle':
        newElement = new fabric.Circle({
          left: this.artboard.getWidth() / 2,
          top: this.artboard.getHeight() / 2,
          fill: '#f00',
          radius:  Math.ceil(Math.random() * 25) + 5,
        });
        break;
        case 'triangle':
        newElement = new fabric.Triangle({
          left: this.artboard.getWidth() / 2,
          top: this.artboard.getHeight() / 2,
          fill: '#f00',
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
          fill: '#fff',
          stroke: '#000',
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
        <MenuItem divider />
        <MenuItem data={"some_data"} onClick={this.handleClicnk}>
          Save
        </MenuItem>
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
    console.log(currentWidth, lastSeenSize, factor);

    const scalable = [
      "left",
      "top",
      "scaleX",
      "scaleY",
    ];

    // Alter placements and scales accordingly.
    saved.objects = saved.objects.map((obj)=>{
      scalable.forEach((prop)=>{
        obj[prop] *= factor;
      })

      return obj;
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
        this.removeSelection(true);
      } else if (event.keyCode === 27){
        this.artboard.discardActiveObject().renderAll();
      }
    })
    this.onWindowResize(el, true);

    const CanvasCreator = !this.props.disableInteractions ? fabric.Canvas : fabric.StaticCanvas;

    this.artboard = new CanvasCreator(this.id, {
      backgroundColor: 'rgb(100,100,200)',
      centeredRotation: true,
      preserveObjectStacking: true,
    });


    this.artboard.on('object:selected', ({ target })=>{
      // Detect if a group has been selected.
      // if (target._objects) {
      //   return;
      // }
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
    if (!inProgress){
      fabric.Image.fromURL('/clearcut.jpg', (oImg)=>{
        oImg.left = oImg.width / -2;
        oImg.top = oImg.height / -2;

        var circle = new fabric.Rect({
          height: 20, width: 20, fill: 'red', left: 100, top: 100
        });

        var text = new fabric.IText('hello world', {
          left: 100, top: 100,
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 2,
          fontFamily: "Impact, sans-serif",
          fontWeight: 900,
        });

        this.artboard.add(oImg, circle, text).renderAll();
      });
    } else {
      const lastSeenSize = localStorage.getItem('poster-size');
      setTimeout(()=>this.loadJSON(JSON.parse(inProgress), lastSeenSize), 1);
    }

    this.onWindowResize(el, true);
  }

  saveCanvas() {
    const saved = this.artboard.toObject();
    const savedString = JSON.stringify(saved);

    console.log('saving..');
    localStorage.setItem('poster', savedString);

    const baseWidth = Math.min(PosterCreator.MAX_WIDTH, parseFloat(getComputedStyle(this.canvasElement).width.replace('px', '')));
    console.log(baseWidth);
    localStorage.setItem('poster-size', baseWidth);
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
      objects[i].set('scaleX', objects[i].scaleX * factor);
      objects[i].set('scaleY', objects[i].scaleY * factor);
      objects[i].set('left', objects[i].left * factor);
      objects[i].set('top', objects[i].top * factor);

      objects[i].setCoords(true);
  }
  canvas.renderAll();
  canvas.calcOffset();
}
