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

import {Leaf} from './Leaf';

// Drawing Primitives 
export class Primitive extends Leaf {
  /**
   * @constructor
   */
  constructor(type,parent) {
    super(type,parent);
    this.attributes = {
      fill: 'none',
      stroke: 'none'
    };
  }

  /**
   * Generate graphics to ImageProcessor
   *
   * @author Jean-Christophe Taveau
   */
  toProcessor(ip) {
    const hexToRGB = (v) => {
      let hexa = v.slice(1); // Remove #
      if (hexa.length === 3) {
        // Dirty way :-()
        let w = `${hexa[0]}${hexa[0]}${hexa[1]}${hexa[1]}${hexa[2]}${hexa[2]}`;
        return parseInt(w,16);
      }
      else if (hexa.length === 6) {
        return parseInt(hexa,16);
      }
    }
    
    const drawCircle = (ip) => {
      ip.setColor(hexToRGB(this.attributes.fill));
      
      if (this.attributes.fill === 'none') {
        ip.drawOval(
          this.attributes.cx - this.attributes.r, 
          this.attributes.cy - this.attributes.r, 
          this.attributes.r*2.0, 
          this.attributes.r*2.0
        );
      }
      else {
        ip.fillOval(
          this.attributes.cx - this.attributes.r, 
          this.attributes.cy - this.attributes.r, 
          this.attributes.r*2.0, 
          this.attributes.r*2.0);
      }
    }
    
    const drawRectangle = (ip) => {
      // TODO
    }
    
    switch (this.type) {
      case 'circle' : 
        drawCircle(ip);
        break;
      case 'rect' : 
        drawRectangle(ip);
        break;
    }
  }

} // End of class Primitive



