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
import {Group} from './Group';

// An empty node used for the enter selection
export class Ghost extends Leaf {
  /**
   * @constructor
   */
  constructor(type,parent) {
    super(type,parent);
    this.children = [];
  }

  append(type) {
    const creators = {
      g: new Group('g',this)
    };
    let element = t8.createNode(type,this); // creators[type] || new Primitive(type,this);
    this.children.push(element);
    return element;
  }
  
  /**
   * Generate graphics via a Renderer (SVG, ImageJ, WebGL, etc.)
   *
   * @author Jean-Christophe Taveau
   */
  draw(a_renderer) {
    a_renderer.drawGhost(this);
  }
  
} // End of class Ghost



