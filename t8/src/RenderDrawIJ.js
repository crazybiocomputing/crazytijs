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

/**
 * Static helper functions for drawing primitive
 *
 * @author Jean-Christophe Taveau
 */
const RenderDrawIJ = {};

/**
 * Draw Arc
 */
RenderDrawIJ.drawArc = (node,imp) => {
  // Syntax: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // Step #1 - Create an oval and Convert in a java.awt.Polygon
  let oval = new OvalRoi(0,0,node.attributes.rx * 2, node.attributes.ry * 2).getPolygon();
  // Step #2 -  Apply rotation(s) and Remove extra points 
  
  // Step #3 - Remove extra points and draw polygon
  if (node.attributes.fill === 'none' || node.attributes.fill === 'transparent') {
    ip.drawPolygon(new java.awt.Polygon(x, y, x.length));
  }
  else {
    ip.fillPolygon(new java.awt.Polygon(x, y, x.length));
  }
}


/**
 * Draw Circle
 */
RenderDrawIJ.drawCircle = (node,imp) => {
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
    
/**
 * Draw Ellipse
 */
RenderDrawIJ.drawArc = (node,imp) => {
  // Syntax: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // Step #1 - Create an oval
  let oval = new OvalRoi();
  // Step #2 - Convert in a java.awt.Polygon
  let polygon = oval.getPolygon();
  let 
  // Step #3 - Remove extra points and draw polygon
  if (node.attributes.fill === 'none' || node.attributes.fill === 'transparent') {
    ip.drawPolygon(new java.awt.Polygon(x, y, 4));
  }
  else {
    ip.fillPolygon(new java.awt.Polygon(x, y, 4));
  }
}

/**
 * Draw Line
 */
RenderDrawIJ.drawLine = (node,imp) => {
    let ip = this.imp.getProcessor();
    // Setup
    ip.setColor(CrazyColor.hexToRGB(node.attributes.stroke));
    ip.setLineWidth(node.attributes['stroke-width'] || 1);
    // Apply matrix
    let xy1 = [node.attributes.x1 || 0.0, node.attributes.y1 || 0.0];
    let txy1 = Matrix.transform(xy1,node.matrix);
    let xy2 = [node.attributes.x2 || 0.0, node.attributes.y2 || 0.0];
    let txy2 = Matrix.transform(xy2,node.matrix);
    // Draw...
    ip.drawLine(txy1[0], txy1[1], txy2[0], txy2[1]);
  }
  
/**
 * Draw Path
 */
RenderDrawIJ.drawPath = (node,imp) => {
  // TODO
  let  = RenderDrawIJ.parsePath(node.attributes.d);
  
}
    
/**
 * Parse SVG Path
 */
RenderDrawIJ.parsePath = (path,imp) => {
  // TODO
  // From https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
  // Parse SVG path:
  // M x y: Move,
  // V y: Vertical move,
  // H x: Horizontal move,
  // L x y: Line
  // Z: Close path
  // C + S: Cubic Curve
  // Q + T: Quadratic Curve
  // A: Arc
  
  let matches = path.match(/([MVHLZCQA](.+)));
  console.log(matches);
}


RenderDrawIJ.drawPolygon = (node,imp) => {
      // TODO
    }
    
/**
 * Draw Rectangle
 */
RenderDrawIJ.drawRectangle = (node,imp) => {
  let ip = this.imp.getProcessor();
  // Setup
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
  
  if (node.attributes.fill === 'none' || node.attributes.fill === 'transparent') {
    ip.drawPolygon(new java.awt.Polygon(x, y, 4));
  }
  else {
    ip.fillPolygon(new java.awt.Polygon(x, y, 4));
  }
}
