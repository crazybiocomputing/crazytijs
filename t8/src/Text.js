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

import {Primitive} from './Primitive';

// Drawing Primitives 
export class Text extends Primitive {
  /**
   * @constructor
   */
  constructor(type,parent) {
    super(type,parent);
    console.log('Create Text');
    this.attributes = {}; // Reset attributes
  }

  /**
   * Text
   *
   * @author Jean-Christophe Taveau
   */
  text(str) {
    this.attr('t8_text',str);
  }
  
  /**
   * Text
   *
   * @author Jean-Christophe Taveau
   */
  draw(a_renderer) {
    a_renderer.drawText(this);
  }
  

} // End of class Primitive



