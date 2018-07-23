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
 * This program is distributed in the hope that it will be useful,
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
 * Static matrix operations
 * @class RendererIJ
 *
 * @author Jean-Christophe Taveau
 */
export const Matrix = {};

Matrix.identity = () => {
  return [1,0,0,0,1,0,0,0,1]; // Identity
  
};

Matrix.from = (other) => {
  return [...other];
}

Matrix.fromSVG = (other) => {
  let m = new Array(9);
  m = [other[0],other[1],0.0,other[2], other[3],0.0,other[4],other[5], 1.0];
  return m;
};

Matrix.transform = (a,m) => {
  let x = a[0], y = a[1], z = a[2] || 1.0;

  let out = new Array(3);
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
};
  
  
Matrix.multiply = (a,b) => {
  let out = new Array(9);
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
};
    
Matrix.scale = (matrix,sx,sy) => {
  let x = sx;
  let y = sy || sx;
  let m = [...matrix]; // copy
  m[0] *= x;
  m[1] *= x;
  m[2] *= x;
  m[3] *= y;
  m[4] *= y;
  m[5] *= y;
  return m;
}

Matrix.rotate = (matrix, rot_in_degrees,rot_centerx,rot_centery) => {
  let rot = rot_in_degrees;
  let cx = rot_centerx;
  let cy = rot_centery;
  cx += t.args[1] || 0.0;
  cy += t.args[2] || 0.0;

  // Copy
  let m = [...matrix];
  
  
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
  return m;
}


Matrix.translate = (matrix,tx,ty) => {
  let out = [...matrix]; // copy
  out[6] = tx * matrix[0] + ty * matrix[3] + matrix[6];
  out[7] = tx * matrix[1] + ty * matrix[4] + matrix[7];
  out[8] = tx * matrix[2] + ty * matrix[5] + matrix[8];
  return out;
};

Matrix.skewX = (matrix,ax_in_degrees) => {
  let m = [...matrix]; // copy
  let ax = Math.tan(ax_in_degrees / 180.0 * Math.PI);
  m[3] = ax * m[0] + m[3];
  m[4] = ax * m[1] + m[4];
  m[5] = ax * m[2] + m[5];
  return m;
}

Matrix.skewY = (matrix,ay_in_degrees) => {
  let m = [...matrix]; // copy
  let ay = Math.tan(ay_in_degrees / 180.0 * Math.PI);
  m[0] = m[0] + ay * a[3];
  m[1] = m[1] + ay * a[4];
  m[2] = m[2] + ay * a[5];
  return m;
};

Matrix.toString = (m) => {
  return `[
    [ ${m[0]} , ${m[3]} , ${m[6]} ]
    [ ${m[1]} , ${m[4]} , ${m[7]} ]
    [ ${m[2]} , ${m[5]} , ${m[8]} ]
    ]`;
}

