import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router'

import './styles.css';
import { fabric } from 'fabric';

export default class PosterCreator extends Component {
  static MAX_WIDTH = 1000;

  constructor(props){
    super(props);
    this.onCanvasMount = this.onCanvasMount.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.id = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
  }

  render() {
    return <div {...this.props} ref={this.onCanvasMount}><canvas id={ this.id } /></div>;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('keyup', this.keyupHandler);
  }

  loadJSON(saved, inProgressSize) {
    if (typeof saved === 'string') { saved = JSON.parse(saved); }
    // Determine how big we are compared to full size.
    let factor = Math.min(PosterCreator.MAX_WIDTH, parseFloat(getComputedStyle(this.canvasElement).width.replace('px', '')));
    factor = factor / inProgressSize;

    // Alter placements and scales accordingly.
    saved.objects = saved.objects.map((obj)=>{
      obj.scaleX *= factor;
      obj.scaleY *= factor;
      obj.left *= factor;
      obj.top *= factor;
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
      if (!this.selection || !this.artboard){ return; }

      if (event.keyCode === 8 && !this.selection.isEditing){
        this.artboard.remove(this.selection);
      } else if (event.keyCode === 27){
        this.artboard.discardActiveObject().renderAll();
      }
    })
    this.onWindowResize(el, true);

    const CanvasCreator = !this.props.disableInteractions ? fabric.Canvas : fabric.StaticCanvas;

    this.artboard = new CanvasCreator(this.id, {
      backgroundColor: 'rgb(100,100,200)',
      centeredRotation: true,
    });


    this.artboard.on('object:selected', ({ target })=>{
      // Detect if a group has been selected.
      if (target._objects) {
        return;
      }

      this.selection = target;
    });

    this.artboard.on('selection:cleared', ()=>{
      this.selection = null;
      this.saveCanvas();
    });

    this.artboard.on('object:modified', this.saveCanvas.bind(this));
    this.artboard.on('object:added', this.saveCanvas.bind(this));

    const inProgress = localStorage.getItem('poster');
    if (!inProgress){
      fabric.Image.fromURL('/clearcut.jpg', (oImg)=>{
        console.log('ooook', oImg);
        var circle = new fabric.Rect({
          height: 20, width: 20, fill: 'red', left: 100, top: 100
        });

        var text = new fabric.IText('hello world', {
          left: 100, top: 100,
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 2,
          fontFamily: "Impact, sans-serif",
        });

        this.artboard.add(oImg, circle, text).renderAll();
      });
    } else {
      const inProgressSize = localStorage.getItem('poster-size');
      this.loadJSON(JSON.parse(inProgress), inProgressSize);
    }

    this.onWindowResize(el, true);
  }

  saveCanvas(){
    const saved = this.artboard.toObject();
    const savedString = JSON.stringify(saved);

    console.log('saving..');
    localStorage.setItem('poster', savedString);

    const baseWidth = Math.min(PosterCreator.MAX_WIDTH, parseFloat(getComputedStyle(this.canvasElement).width.replace('px', '')));

    localStorage.setItem('poster-size', baseWidth);
  }

  onWindowResize(el, dontSave) {
    const baseWidth = Math.min(PosterCreator.MAX_WIDTH, parseFloat(getComputedStyle(el).width.replace('px', '')));
    const newHeight = baseWidth / (16/9);

    let diff = 1;
    if(this.oldWidth){
      diff = baseWidth / this.oldWidth;
    }
    this.oldWidth = baseWidth;

    if(this.artboard){
      zoomIt(this.artboard, diff, baseWidth, newHeight);

      if(dontSave){
        return;
      }
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
