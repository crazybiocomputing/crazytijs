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

import * as Path from './pathSVG';
import {Matrix} from '../../Matrix';
import {Color as CrazyColor}  from '../../Color';

/**
 * Static helper functions for drawing primitive
 *
 * @author Jean-Christophe Taveau
 */


const drawJavaPolygon = (imp,polygon,style,color=-1) => {
  let ip = imp.getProcessor();
  // Setup
  ip.setLineWidth(style['stroke-width'] || 1);
  
  // Draw...
  if (color !== -1) {
    ip.setColor(color);
    ip.fillPolygon(new java.awt.Polygon(polygon.x, polygon.y, polygon.x.length));
  }
  else {
    if (style.stroke !== 'none' && style.stroke !== 'transparent') {
      ip.setColor(CrazyColor.toRGB(style.stroke));
      ip.moveTo(polygon.x[0], polygon.y[0]);
      polygon.x.forEach ( (x,i) => ip.lineTo(x, polygon.y[i])); 
    }
    if (style.fill !== 'none' && style.fill !== 'transparent') {
      ip.setColor(CrazyColor.toRGB(style.fill));
      ip.fillPolygon(new java.awt.Polygon(polygon.x, polygon.y, polygon.x.length));
    }
  }
}




/**
 * Draw Arc
 */
export const drawArc = (node,imp,color=-1) => {
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
export const drawCircle = (node,imp,color=-1) => {
  let ip = imp.getProcessor();
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
    
/**
 * Draw Ellipse
 */
export const drawEllipse = (node,imp,color=-1) => {
  // Syntax: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // Step #1 - Create an oval
  
  // Step #2 - Convert in a java.awt.Polygon
  let polygon = Path.drawEllipse(node.attributes.cx, node.attributes.cy, node.attributes.rx, node.attributes.ry, 0);

  // Step #3 Apply matrix
  for (let i = 0; i < polygon.x.length; i++) {
    let xy = [polygon.x[i], polygon.y[i], 1.0];
    let txy = Matrix.transform(xy,node.matrix);
    polygon.x[i] = txy[0];
    polygon.y[i] = txy[1];
   }

  // Step #4 - Draw...
  drawJavaPolygon(imp,polygon,node.attributes,color);
}

/**
 * Draw Line
 */
export const drawLine = (node,imp) => {
    let ip = imp.getProcessor();
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
  }
  
  
/**
 * Draw Path
 */
export const drawPath = (node,imp,color=-1) => {
  console.log('Draw PATH....');
  // Step #1: Get Polygon...
  let polygon = Path.getPolygonFromPath(node.attributes.d);
  console.log(JSON.stringify(polygon));
  
  // Step #2: Apply matrix
  for (let i = 0; i < polygon.x.length;i++) {
    let xy = [polygon.x[i], polygon.y[i], 1.0];
    let txy = Matrix.transform(xy,node.matrix);
    console.log(txy);
    polygon.x[i] = txy[0];
    polygon.y[i] = txy[1];
   }
   
  // Step #3: Draw...
  drawJavaPolygon(imp,polygon,node.attributes,color);
}
    

export const drawPolygon = (node,imp,color=-1) => {
  // Step #1: Get Polygon...
  let polygon = {x:[],y:[]};
  
  node.attributes.points.split(/[,\s]+/).forEach( (d,index) => {
    if ( (index % 2) === 0) {
      polygon.x.push(parseFloat(d));
    }
    else {
      polygon.y.push(parseFloat(d));
    }
  });
  
  // Step #2: Apply matrix
  for (let i = 0; i < polygon.x.length;i++) {
    let xy = [polygon.x[i], polygon.y[i], 1.0];
    let txy = Matrix.transform(xy,node.matrix);
    polygon.x[i] = txy[0];
    polygon.y[i] = txy[1];
   }
   
  // Step #3: Draw...
  drawJavaPolygon(imp,polygon,node.attributes,color);
}
    
/**
 * Draw Rectangle
 */
export const drawRectangle = (node,imp,color=-1) => {
  let ip = imp.getProcessor();
  // Setup
  let w = +node.attributes.width;
  let h = +node.attributes.height;
  let polygon = {x:new Array(4),y:new Array(4)};
  
  polygon.x[0] = node.attributes.x || 0.0; polygon.y[0] = node.attributes.y || 0.0;
  polygon.x[1] = polygon.x[0] + w; polygon.y[1] = polygon.y[0];
  polygon.x[2] = polygon.x[0] + w; polygon.y[2] = polygon.y[0] + h;
  polygon.x[3] = polygon.x[0]    ; polygon.y[3] = polygon.y[0] + h;
  

  // Step #2: Apply matrix
  for (let i = 0; i < polygon.x.length;i++) {
    let xy = [polygon.x[i], polygon.y[i], 1.0];
    let txy = Matrix.transform(xy,node.matrix);
    polygon.x[i] = txy[0];
    polygon.y[i] = txy[1];
   }
    
  //console.log('X= ' + polygon.x);
  //console.log('Y= ' + polygon.y);
  
  drawJavaPolygon(imp,polygon,node.attributes,color);
  
}


export const drawPolyline = (node,imp) => {
  // Same as polygon
  drawPolygon(polygon,node.attributes,imp);
}



