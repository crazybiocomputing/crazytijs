/*
 *  TIJS: Tools for ImageJ JavaScript
 *  Copyright (C) 2017  Jean-Christophe Taveau.
 *
 *  This file is part of TIJS, module t8
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TIJS.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */
 
'use strict';

import {Color as CrazyColor}  from '../Color';
import {Matrix} from '../Matrix';
import * as Draw from './ij/drawPrimitives';


/**
 * Generate graphics into a ImageProcessor
 * @class RendererIJ
 *
 * @author Jean-Christophe Taveau
 */
export class RendererIJ {
  /**
   * @constructor
   */
  constructor(root) {
    this.imp;
    if (root.parent === null) {
      this.imp = IJ.createImage(
        "CrazyBioPlot", 
        "RGB white", 
        root.attributes.width, 
        root.attributes.height,
        1
      );
    }
    else {
      // TODO
      // Add an overlay
      this.imp = root.parent.anchor;
    }
  }
  
  static render(root) {
    
    let r = new RendererIJ(root);
    root.draw(r);
    // Add events if any
    // TODO
    // All the primitives with an attribute with :hover must be followed by the listeners...
    console.log('LISTENERS MOUSEOVER ' + root.listeners.mouseover.length);
    console.log('LISTENERS MOUSEOUT ' + root.listeners.mouseout.length);
    r.offscreen = IJ.createImage(
        "Picking", 
        "RGB black", 
        root.attributes.width, 
        root.attributes.height,
        1
      );
    root.listeners.mouseover.forEach( (target) => {
      let n = target.node;
      switch (n.type) {
        case 'circle' : 
          Draw.drawCircle(n,r.offscreen,n.ID);
          break;
        case 'ellipse' : 
          Draw.drawEllipse(n,r.offscreen,n.ID);
          break;
        case 'path' : 
          Draw.drawPath(n,r.offscreen,n.ID);
          break;
        case 'polygon' : 
          Draw.drawPolygon(n,r.offscreen,n.ID);
          break;
        case 'rect' : 
          Draw.drawRectangle(n,r.offscreen,n.ID);
          break;
      }
    });
    
    // In nashorn_polyfill.js
    setOverlay(r,root);

    // DEBUG only
    // r.offscreen.show();
    
    
    // Display Final Result
    r.imp.show();
    

  }

  /**
   * Draw Root (aka CrazyPlot)
   *
   * @author Jean-Christophe Taveau
   */
  drawRoot(node) {
    // TODO viewBox, margin, padding, etc.
    node.box = {x: 0, y: 0, w: node.attributes.width, h: node.attributes.height};
    node.matrix = [1,0,0,0,1,0,0,0,1]; // Identity
    
    // Propagate to children
    let self = this;
    node.children.forEach( (child) => {
      child._attributes = {}; // Cumulative attributes through the graph
      child.draw(self);
    });
  }
  
  /**
   * Draw Ghost - Empty Node
   *
   * @author Jean-Christophe Taveau
   */
  drawGhost(node) {
    console.log('draw ghost');
    RendererIJ.updateNode(node);

    // Propagate to children
    let self = this;
    node.children.forEach( (child) => {
      child._attributes = Object.assign({}, node._attributes); // clone
      child.draw(self);
    });
  }
  
  /**
   * Draw Group
   *
   * @author Jean-Christophe Taveau
   */
  drawGroup(node) {
    console.log('draw group');
    console.log(JSON.stringify(node.parent.box));
    // TODO
    RendererIJ.updateNode(node);
    
    // Propagate to children
    let self = this;
    node.children.forEach( (child) => {
      child._attributes = Object.assign({}, node._attributes); // clone
      console.log('child GROUP' + JSON.stringify(child._attributes));
      child.draw(self);
    });
  }

  /**
   * Draw Primitive
   *
   * @author Jean-Christophe Taveau
   */
  drawPrimitive(node) {

/*
    const drawCircle = (node) => {
      let ip = this.imp.getProcessor();
      ip.setColor(CrazyColor.toRGB(node.attributes.fill));
      // Apply matrix
      let xy = [node.attributes.cx - node.attributes.r, node.attributes.cy - node.attributes.r];
      let txy = Matrix.transform(xy,node.matrix);
      console.log(txy);

      if (node.attributes.fill === 'none') {
        ip.drawOval(
          node.attributes.cx - node.attributes.r, 
          node.attributes.cy - node.attributes.r, 
          node.attributes.r*2.0, 
          node.attributes.r*2.0
        );
      }
      else {
        ip.fillOval(
          node.attributes.cx - node.attributes.r, 
          node.attributes.cy - node.attributes.r, 
          node.attributes.r*2.0, 
          node.attributes.r*2.0);
      }
    }
    
    const drawRectangle = (node) => {
      let ip = this.imp.getProcessor();
      ip.setColor(CrazyColor.toRGB(node.attributes.fill));
      // Apply matrix
      let w = node.attributes.width;
      let h = node.attributes.height;
      let topleft = [node.attributes.x || 0.0, node.attributes.y || 0.0];
      let topright = [topleft[0] + w, topleft[1]];
      let bottomright = [topleft[0] + w, topleft[1] + h];
      let bottomleft = [topleft[0], topleft[1] + h];
      let x = new Array(4);
      let y = new Array(4);
      [x[0],y[0]] = Matrix.transform(topleft,node.matrix);
      [x[1],y[1]] = Matrix.transform(topright,node.matrix);
      [x[2],y[2]] = Matrix.transform(bottomright,node.matrix);
      [x[3],y[3]] = Matrix.transform(bottomleft,node.matrix);
      
      console.log('topleft ' + topleft);
      console.log('X= ' + x);
      console.log('Y= ' + y);
      // console.log('w= ' + Math.sqrt((x[0] - x[1])*(x[0] - x[1]) + (y[0] - y[1])*(y[0] - y[1])) );
      
      if (node.attributes.fill === 'none') {
        ip.drawPolygon(new java.awt.Polygon(x, y, 4));
      }
      else {
        ip.fillPolygon(new java.awt.Polygon(x, y, 4));
      }
    }
    

    
    // Draw Line
    const drawLine = (node) => {
      let ip = this.imp.getProcessor();
      // Setup
      ip.setColor(CrazyColor.toRGB(node.attributes.stroke));
      ip.setLineWidth(node.attributes['stroke-width'] || 1);
      // Apply matrix
      let xy1 = [node.attributes.x1 || 0.0, node.attributes.y1 || 0.0];
      let txy1 = Matrix.transform(xy1,node.matrix);
      let xy2 = [node.attributes.x2 || 0.0, node.attributes.y2 || 0.0];
      let txy2 = Matrix.transform(xy2,node.matrix);
      // Draw...
      ip.drawLine(txy1[0], txy1[1], txy2[0], txy2[1]);
      console.log('End of draw line');
    }
*/

    // Main
    //console.log('update Box and Matrix of Primitive ' + node.type);
    
    // TODO
    // Update box and matrix
    RendererIJ.updateNode(node);
    
    // console.log('draw Primitive ' + node.type);
    switch (node.type) {
      case 'circle' : 
        Draw.drawCircle(node,this.imp);
        break;
      case 'ellipse' : 
        Draw.drawEllipse(node,this.imp);
        break;
      case 'line' : 
        Draw.drawLine(node,this.imp);
        break;
      case 'path' : 
        Draw.drawPath(node,this.imp);
        break;
      case 'polygon' : 
        Draw.drawPolygon(node,this.imp);
        break;
      case 'polyline' : 
        Draw.drawPolyline(node,this.imp);
        break;
      case 'rect' : 
        Draw.drawRectangle(node,this.imp);
        break;
      case 'text' : 
        drawText(node);
        break;
    }
  }

  /**
   * Draw Text
   *
   * @author Jean-Christophe Taveau
   */
  drawText(node) {
    console.log('Draw Text');
    
    const textAnchor = (ip,s,key) => {
      const keys = {'start': -1, 'middle' : 2, 'end': 1};
      return Math.max(0, ip.getStringWidth(s) / keys[key.toLowerCase()]);
    }
    
    const em2pix = (value,ip) => {
      console.log('em2pix ' + value);
      if (value === undefined) {
        return value;
      }
      
      if (typeof value === 'string') {
        if (value.indexOf('em') > -1) {
          let em = parseFloat(value.match(/[\d\.]+/)[0]);
          let screenResolution = Toolkit.getDefaultToolkit().getScreenResolution();
          let metrics = ip.getFontMetrics();
          // HACK Need screen resolution
          return Math.round(metrics.height * screenResolution / 72 * em);
        }
        else if (value.indexOf('px') > -1) {
          return parseFloat(value.match(/\d+/)[0]);
        }
      }
      else {
        // Assume the number is expressed in pixels
        return value;
      }

      console.log(metrics);
      return pix;
    }
    
    const getFamily = (fontnames) => {
      const families = {
        'arial': java.awt.Font.SANS_SERIF,
        'courier' : java.awt.Font.MONOSPACED,
        'helvetica' : java.awt.Font.SANS_SERIF,
        'sans-serif': java.awt.Font.SANS_SERIF,
        'sansserif': java.awt.Font.SANS_SERIF,
        'times': java.awt.Font.SERIF
      }
      let family;
      console.log('Family: ' + fontnames);
      (fontnames.split(',') || [fontnames]).forEach (font => {
        if ( (family = families[font.trim().toLowerCase()]) !== undefined)  {
          return family;
        }
      })
      return java.awt.Font.SANS_SERIF;
    }
    
    const getStyle = (fontstyle) => {
      const fontWeights = ['normal','lighter','100','bold','bolder','200','300','400','500','600','700','800','900'];
      const fontStyles = ['normal','italic','oblique'];
      if (fontstyle === 'normal' || fontstyle === 'lighter' || fontstyle === '100') {
        return java.awt.Font.PLAIN;
      }
      else {
        return (fontWeights.slice(3).filter( w => fontstyle == w).length !== 0) ? java.awt.Font.BOLD : 
          ( (fontStyles.slice(1).filter( s => fontstyle === s).length !== 0) ? java.awt.Font.ITALIC : java.awt.Font.PLAIN);
      }
      return java.awt.Font.PLAIN;
    };
    
    RendererIJ.updateNode(node);
    
    // Init Text Props
    let ip = this.imp.getProcessor();
    ip.setAntialiasedText(true);
    // Set Font
    let defaultMetrics = ip.getFontMetrics();
    let fontFamily = getFamily(node._attributes['font-family'] || defaultMetrics.font.family);
    let fontStyle = getStyle(node._attributes['font-style']) | getStyle(node._attributes['font-weight']); ; // TODO Font.ITALIC Font.BOLD 
    let fontSize = em2pix(node._attributes['font-size'] || defaultMetrics.font.size);
    let textFont = new java.awt.Font(fontFamily,fontStyle,fontSize);
    ip.setFont(textFont);
    
    console.log('font ' + fontFamily + ' ' + fontStyle + ' ' + fontSize);

    // Set text
    let text = node._attributes.t8_text;
    // Set position and orientation
    let dx = em2pix(node._attributes.dx,ip) || 0.0;
    let dy = em2pix(node._attributes.dy,ip) || 0.0;

    let text_anchor = (node._attributes['text-anchor'] !== undefined) ? textAnchor(ip,text,node._attributes['text-anchor']) : 0.0;
    
    let posx = parseFloat((node._attributes.x || 0.0) + Math.round(dx) - text_anchor);
    let posy = parseFloat((node._attributes.y || 0.0) + Math.round(dy) );
    let xy = Matrix.transform([posx,posy,1.0],node.matrix);
    console.log('draw Text ' + node.type + ' [' + xy + '] [' + dx + ',' + dy + '] ' + textAnchor(ip,text,node._attributes['text-anchor']));
    // Display text
    let roi = new TextRoi(`${text}`, xy[0] + 0.0, xy[1] + 0.0 , textFont);
    // Set Font Color
    roi.setStrokeColor(new java.awt.Color(CrazyColor.predefined(node._attributes.fill)));
    // Set Angle
    roi.setAngle(-Math.atan2(node.matrix[1],node.matrix[0])/Math.PI * 180.0);

    ip.drawRoi(roi);
    // ip.drawString(text,xy[0] + Math.round(dx) - text_anchor, xy[1] + Math.round(dy));
  }
    
  
  /* 
   * Tool to compute the transform 3x3 matrix
   *
   * @author Jean-Christophe Taveau
   */
  static getTransform(transform_str,rotcenter_x = 0.0,rotcenter_y = 0.0) {
  /*
    const multiply = (a,b) => {
      out = new Array(9);
      out[0] = b[0] * a[0] + b[1] * a[3] + b[2] * a[6];
      out[1] = b[0] * a[1] + b[1] * a[4] + b[2] * a[7];
      out[2] = b[0] * a[2] + b[1] * a[5] + b[2] * a[8];

      out[3] = b[3] * a[0] + b[4] * a[3] + b[5] * a[6];
      out[4] = b[3] * a[1] + b[4] * a[4] + b[5] * a[7];
      out[5] = b[3] * a[2] + b[4] * a[5] + b[5] * a[8];

      out[6] = b[6] * a[0] + b[7] * a[3] + b[8] * a[6];
      out[7] = b[6] * a[1] + b[7] * a[4] + b[8] * a[7];
      out[8] = b[6] * a[2] + b[7] * a[5] + b[8] * a[8];
      return out;
    }
    
    const translate = (matrix,tx,ty) => {
      let out = [...matrix]; // copy
      out[6] = tx * matrix[0] + ty * matrix[3] + matrix[6];
      out[7] = tx * matrix[1] + ty * matrix[4] + matrix[7];
      out[8] = tx * matrix[2] + ty * matrix[5] + matrix[8];
      return out;
    }
    */
    const calcMatrix = (str,rcx,rcy) => {
      /*
       * SVG Transforms
       * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
       *
       * matrix(<a> <b> <c> <d> <e> <f>)
       * translate(<x> [<y>])
       * scale(<x> [<y>])
       * rotate(<a> [<x> <y>])
       * skewX(<a>)
       * skewY(<a>)
       */
      // Parse
      let trsfrms = str.split(/[\n)]/).filter( (w) => w.length > 1);
      let transf = trsfrms.map( (s) => {
        let t = {};
        let words = s.split('(');
        t.command = words[0].trim();
        t.args = words[1].split(/\s+|\s?,/).map( (v) => parseFloat(v));
        return t;
      });

      // Calc Matrix
      let m = [1,0,0,0,1,0,0,0,1]; // Identity
      let self = this;
      transf.forEach( (t) => {
        console.log(JSON.stringify(t));
        switch (t.command) {
          case 'matrix': 
            m = Matrix.fromSVG(t.args[0],t.args[1],t.args[2],t.args[3],t.args[4],t.args[5]);
            break;
          case 'translate':
            m = Matrix.translate(m,t.args[0],t.args[1]);
          break;
          case 'scale':
            let sx = t.args[0];
            let sy = t.args[1] || t.args[0];
            m = Matrix.scale(m,sx,sy);
            /*
            let x = t.args[0];
            let y = t.args[1] || t.args[0];
            m[0] *= x;
            m[1] *= x;
            m[2] *= x;
            m[3] *= y;
            m[4] *= y;
            m[5] *= y;
            */
            break;
          case 'rotate':
            let rot = t.args[0];
            let cx = rcx; // Topleft corner from parent
            let cy = rcy;
            cx += t.args[1] || 0.0;
            cy += t.args[2] || 0.0;
            m = Matrix.rotate(m,rot,cx,cy);
            /*

            
            // translate to origin
            m = translate(m,cx,cy);

            // rotate
            let s = Math.sin(rot / 180.0 * Math.PI);
            let c = Math.cos(rot / 180.0 * Math.PI);
            let a00 = m[0], a01 = m[1], a02 = m[2],
                a10 = m[3], a11 = m[4], a12 = m[5],
                a20 = m[6], a21 = m[7], a22 = m[8];
                
            m[0] = c * a00 + s * a10;
            m[1] = c * a01 + s * a11;
            m[2] = c * a02 + s * a12;

            m[3] = c * a10 - s * a00;
            m[4] = c * a11 - s * a01;
            m[5] = c * a12 - s * a02;
            
            m[6] = a20;
            m[7] = a21;
            m[8] = a22;

            // translate to center
            m = translate(m,-cx,-cy);
            */
            
            break;
          case 'skewX': 
            m = Matrix.skewX(m,t.args[0]);
            /*
            let ax = Math.tan(t.args[0] / 180.0 * Math.PI);
            m[3] = ax * m[0] + m[3];
            m[4] = ax * m[1] + m[4];
            m[5] = ax * m[2] + m[5];
            */
            break;
          case 'skewY':
            m = Matrix.skewY(m,t.args[0]);
            /*
            let ay = Math.tan(t.args[0] / 180.0 * Math.PI);
            m[0] = m[0] + ay * a[3];
            m[1] = m[1] + ay * a[4];
            m[2] = m[2] + ay * a[5];
            */
            break;
        }
      });
      console.log(`[
    [ ${m[0]} , ${m[3]} , ${m[6]} ]
    [ ${m[1]} , ${m[4]} , ${m[7]} ]
    [ ${m[2]} , ${m[5]} , ${m[8]} ]
    ]`);
      return m;
    } // End of getMatrix
    
    
    // M A I N
    return calcMatrix(transform_str,rotcenter_x,rotcenter_y);
  }
  
  static updateNode(node) {
    // Update attributes
    Object.keys(node.attributes).forEach(function(key) { node._attributes[key] = node.attributes[key]; });
    // console.log(JSON.stringify(node._attributes));
    
    // Update box
    node.box = {
      x: node.parent.box.x, 
      y: node.parent.box.y, 
      w: node.attributes.width, 
      h: node.attributes.height
    };
    
    // Update matrix
    let m = (node.attributes.transform !== undefined) ? RendererIJ.getTransform(node.attributes.transform,node.box.x,node.box.y) : [1,0,0,0,1,0,0,0,1]; 
    node.matrix = Matrix.multiply(node.parent.matrix,m); 
  }
  
} // End of class RendererIJ

