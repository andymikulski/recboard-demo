import React, { Component } from 'react';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import ColorPicker from './ColorPicker';
import KeyboardHelper from './KeyboardHelper';
import '../../lib/react-contextmenu.css';
import './styles.css';
import { fabric } from 'fabric';
import autobind from 'autobind-decorator'


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

@autobind
export default class PosterCreator extends Component {
  static MAX_WIDTH = 1000;

  state = {
    selection: null,
    hasArtboard: false,
  };

  constructor(props){
    super(props);
    this.id = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
  }

  handleColorChange(obj, prop, color) {
    obj.set(prop, color);
    this.artboard.renderAll();
  }

  renderSink() {
    if (!this.state.hasArtboard || this.props.disableInteractions) {
      return null;
    }

    const toolList = [
      'fill',
      'stroke',
    ];

    return (
      <div className="sink" key={this.state.selection}>
        <ColorPicker
          color={this.artboard.backgroundColor}
          onChange={(color)=>this.handleColorChange(this.artboard, 'backgroundColor', color)}
          label={'Canvas Background'}
        />

        { this.state.selection &&
          toolList.map((prop)=>
            <ColorPicker
              color={this.state.selection[prop]}
              onChange={(color)=>this.handleColorChange(this.state.selection, prop, color)}
              label={prop}
            />
          )
        }

        <KeyboardHelper />
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

  clearSelection() {
    this.artboard.discardActiveObject();
    this.artboard.renderAll();
  }

  sendSelectionBack() {
    this.artboard.sendBackwards(this.state.selection);
    this.artboard.renderAll();
  }

  bringSelectionForward() {
    this.artboard.bringForward(this.state.selection);
    this.artboard.renderAll();
  }

  flipHorizontal() {
    this.state.selection.set('flipX', !this.state.selection.flipX);
    this.artboard.renderAll();
  }

  flipVertical() {
    this.state.selection.set('flipY', !this.state.selection.flipY);
    this.artboard.renderAll();
  }

  sendAllWayBack() {
    this.artboard.sendToBack(this.state.selection);
    this.artboard.renderAll();
  }
  bringAllWayFront() {
    this.artboard.bringToFront(this.state.selection);
    this.artboard.renderAll();
  }

  cloneActiveSelection() {
    this.state.selection.clone((clone)=>{
      clone.set('top', clone.top + 15);
      clone.set('left', clone.left + 15);

      this.artboard.add(clone);
      this.artboard.setActiveObject(clone);
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
        <MenuItem onClick={this.clearSelection}>
          Deselect
        </MenuItem>
        <MenuItem onClick={this.cloneActiveSelection}>
          Duplicate
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={this.flipHorizontal}>
          Flip Horizontal
        </MenuItem>
        <MenuItem onClick={this.flipVertical}>
          Flip Vertical
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={this.bringAllWayFront}>
          Bring To Front
        </MenuItem>
        <MenuItem onClick={this.bringSelectionForward}>
          Bring Forward
        </MenuItem>
        <MenuItem onClick={this.sendSelectionBack}>
          Send Backward
        </MenuItem>
        <MenuItem onClick={this.sendAllWayBack}>
          Send To Back
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={this.removeSelection}>
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
        this.artboard.setActiveObject(oImg);
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
      this.artboard.setActiveObject(newElement);
    }
  }

  getMenuForCanvas() {
    return (
      <ContextMenu hideOnLeave id="canvas">
          <SubMenu title='Add' hoverDelay={0}>
            <SubMenu title='Basic' hoverDelay={0}>
              <MenuItem onClick={this.spawnPrimitive('text')}>Text</MenuItem>
              <MenuItem onClick={this.spawnPrimitive('rect')}>Rect</MenuItem>
              <MenuItem onClick={this.spawnPrimitive('circle')}>Circle</MenuItem>
              <MenuItem onClick={this.spawnPrimitive('triangle')}>Triangle</MenuItem>
              <MenuItem onClick={this.spawnPrimitive('line')}>Line</MenuItem>
            </SubMenu>
            <SubMenu title='Items' hoverDelay={0}>
              <MenuItem onClick={this.spawnImage('pots', 'png')}>Pots</MenuItem>
              <MenuItem onClick={this.spawnImage('lumberjack-box', 'png')}>Box (Lumberjack)</MenuItem>
              <MenuItem onClick={this.spawnImage('frisbee-box', 'png')}>Box (Frisbee)</MenuItem>
            </SubMenu>
            <SubMenu title='Weapons' hoverDelay={0}>
              <MenuItem onClick={this.spawnImage('blue-grenade', 'png')}>Grenade (Blue)</MenuItem>
              <MenuItem onClick={this.spawnImage('blue-pistol', 'png')}>Pistol (Blue)</MenuItem>
              <MenuItem onClick={this.spawnImage('blue-repeater', 'png')}>Repeater (Blue)</MenuItem>
              <MenuItem onClick={this.spawnImage('blue-shotgun', 'png')}>Shotgun (Blue)</MenuItem>
              <MenuItem onClick={this.spawnImage('blue-sniper', 'png')}>Sniper (Blue)</MenuItem>
            </SubMenu>
            <SubMenu title='Backgrounds' hoverDelay={0}>
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
    const factor = currentWidth / PosterCreator.MAX_WIDTH;
    console.log('factor', factor);
    saved.objects = saved.objects.map((obj)=>{
      return scaleObject(obj, factor);
    });

    // Apply the background color to our artboard. loadFromJSON doesn't do it for us, apparently.
    this.artboard.backgroundColor = saved.background || saved.backgroundColor || this.artboard.backgroundColor;

    // Import the SVG elements.
    this.artboard.loadFromJSON(saved, ()=>{ this.artboard.renderAll(); });
  }

  onCanvasMount(el){
    if (!el) {
      return;
    }
    this.canvasElement = el;

    // Need to do some weird attribute removal in order to prevent the canvas from
    // being huge when embedded.
    setTimeout(()=>{
      const canvases = Array.prototype.slice.call(this.canvasElement.querySelectorAll('canvas'));
      canvases.forEach(canvas=>{
        canvas.removeAttribute('height');
        canvas.removeAttribute('width');
      });
      this.artboard.renderAll();
    }, 10);

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

    this.setState({
      hasArtboard: true,
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

    const inProgress = this.props.value; // || localStorage.getItem('poster');

    if (this.props.disableInteractions && !this.props.value) {
      return;
    }

    if (inProgress) {
      const lastSeenSize = localStorage.getItem('poster-size');
      setTimeout(()=>this.loadJSON(inProgress, lastSeenSize), 1);
    }

    this.onWindowResize(el, true);
  }

  saveCanvas() {
    // const saved = this.artboard.toObject();
    // const savedString = JSON.stringify(saved);
    // localStorage.setItem('poster', savedString);
    //
    // const baseWidth = Math.min(PosterCreator.MAX_WIDTH, parseFloat(getComputedStyle(this.canvasElement).width.replace('px', '')));
    // localStorage.setItem('poster-size', baseWidth);

    if (this.props.onChange){
      this.props.onChange([this.artboard.toObject(), this.artboard.toSVG()]);
    }
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
  objects = objects.map((obj)=>scaleObject(obj, factor));

  canvas.renderAll();
  canvas.calcOffset();
}
