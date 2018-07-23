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

import {Color as CrazyColor}  from './Color';
import {Matrix} from './Matrix';


/**
 * Generate graphics to ImageProcessor
 * @class RendererIJ
 *
 * @author Jean-Christophe Taveau
 */
export class RendererIJ {
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
    // Display Final Result
    r.imp.show();
  }

  drawRoot(node) {
    // TODO viewBox, margin, padding, etc.
    node.box = {x: 0, y: 0, w: node.attributes.width, h: node.attributes.height};
    node.matrix = [1,0,0,0,1,0,0,0,1]; // Identity
    
    // Propagate to children
    let self = this;
    node.children.forEach( (child) => child.draw(self));
  }
  
  drawGhost(node) {
    console.log('draw ghost');
    // Copy box from parent
    node.box = {
      x: node.parent.box.x, 
      y: node.parent.box.y, 
      w: node.parent.box.width, 
      h: node.parent.box.height
    };
    node.matrix = [...node.parent.matrix];

    // Propagate to children
    let self = this;
    node.children.forEach( (child) => child.draw(self));
  }
  
  /**
   * Draw Group
   *
   * @author Jean-Christophe Taveau
   */
  drawGroup(node) {
    console.log('draw group');
    console.log(node.parent.box);
    // TODO
    // Update box and matrix
    node.box = {
      x: node.parent.box.x, 
      y: node.parent.box.y, 
      w: node.attributes.width, 
      h: node.attributes.height
    };
    let m = (node.attributes.transform !== undefined) ? RendererIJ.getTransform(node.attributes.transform,node.box.x,node.box.y) : [1,0,0,0,1,0,0,0,1]; 
    node.matrix = Matrix.multiply(node.parent.matrix,m);
    // Propagate to children
    let self = this;
    node.children.forEach( (child) => child.draw(self));
  }

  /**
   * Draw Primitive
   *
   * @author Jean-Christophe Taveau
   */
  drawPrimitive(node) {
    
    const drawCircle = (node) => {
      let ip = this.imp.getProcessor();
      ip.setColor(CrazyColor.hexToRGB(node.attributes.fill));
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
      ip.setColor(CrazyColor.hexToRGB(node.attributes.fill));
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
    
    const drawArc2D = (node) => {
      // TODO
    }
    
    const drawPath = (node) => {
      // TODO
    }
    
    const drawPolygon = (node) => {
      // TODO
    }
    
    
    // Main
    console.log('draw Primitive ' + node.type);
    
    // TODO
    // Update box and matrix
    node.box = {
      x: node.parent.box.x, 
      y: node.parent.box.y, 
      w: node.attributes.width, 
      h: node.attributes.height
    };
    let m = (node.attributes.transform !== undefined) ? RendererIJ.getTransform(node.attributes.transform,node.box.x,node.box.y) : [1,0,0,0,1,0,0,0,1]; 
    node.matrix = Matrix.multiply(node.parent.matrix,m);

    switch (node.type) {
      case 'circle' : 
        drawCircle(node);
        break;
      case 'rect' : 
        drawRectangle(node);
        break;
      case 'text' : 
        drawText(node);
        break;
    }
  }

  /**
   * Draw String
   *
   * @author Jean-Christophe Taveau
   */
  drawText(node) {
    const textAnchor = (ip,s,key) => {
      const keys = {'start': -1, 'middle' : 2, 'end': 1};
      return Math.max(0, ip.getStringWidth(s) / keys[key.toLowerCase()]);
    }
    
    // Update Matrix
    let m = (node.attributes.transform !== undefined) ? RendererIJ.getTransform(node.attributes.transform,node.box.x,node.box.y) : [1,0,0,0,1,0,0,0,1]; 
    node.matrix = Matrix.multiply(node.parent.matrix,m);
    // Draw Text
    let ip = this.imp.getProcessor();
    ip.setAntialiasedText(true);
    ip.setColor(CrazyColor.builtins[node.attributes.fill] );
    let text = node.attributes.text_content;
    let xy = Matrix.transform([node.attributes.x, node.attributes.y,1.0],node.matrix);
    let dx = node.attributes.dx || 0.0;
    let dy = node.attributes.dy || 0.0;
    let text_anchor = (node.attributes['text-anchor'] !== undefined) ? textAnchor(ip,text,node.attributes['text-anchor']) : 0.0;
    console.log('draw Text ' + node.type + ' [' + xy + ']');
    ip.drawString(text,xy[0] + dx - text_anchor, xy[1] + dy);
  }
    
  
  /* 
   * Tool to compute the transform 3x3 matrix
   *
   * @author Jean-Christophe Taveau
   */
  static getTransform(transform_str,rotcenter_x = 0.0,rotcenter_y = 0.0) {
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
        switch (t.command) {
          case 'matrix': 
            m = [t.args[0],t.args[1],0.0,t.args[2], t.args[3],0.0,t.args[4],t.args[5], 1.0];
            break;
          case 'translate':
            m = Matrix.translate(m,t.args[0],t.args[1]);
          break;
          case 'scale': 
            let x = t.args[0];
            let y = t.args[1] || t.args[0];
            m[0] *= x;
            m[1] *= x;
            m[2] *= x;
            m[3] *= y;
            m[4] *= y;
            m[5] *= y;
            break;
          case 'rotate':
            let rot = t.args[0];
            let cx = rcx;
            let cy = rcy;
            cx += t.args[1] || 0.0;
            cy += t.args[2] || 0.0;
            
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
            
            break;
          case 'skewX': 
            let ax = Math.tan(t.args[0] / 180.0 * Math.PI);
            m[3] = ax * m[0] + m[3];
            m[4] = ax * m[1] + m[4];
            m[5] = ax * m[2] + m[5];
            break;
          case 'skewY':
            let ay = Math.tan(t.args[0] / 180.0 * Math.PI);
            m[0] = m[0] + ay * a[3];
            m[1] = m[1] + ay * a[4];
            m[2] = m[2] + ay * a[5];
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
} // End of class RendererIJ

