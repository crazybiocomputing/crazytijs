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

import {Helper} from './Helper';

/**
 * Helper class for Polylines
 *
 * @author Jean-Christophe Taveau
 */
export class Line extends Helper {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.type = 'line';
    this.attributes = {
      fill: 'none',
      stroke: 'none'
    };
  }
  
  generate(dataset) {
    return dataset.map( (data,index) => {
      let point = {x:0,y:0};
      point.type = (index === 0) ? 'M': 'L';
      point.x = this.xFunc(data);
      point.y = this.yFunc(data);
      return point;
    });
  }

  /**
   * Generate graphics via a Renderer (SVG, ImageJ, WebGL, etc.)
   *
   * @author Jean-Christophe Taveau
   */
  draw(a_renderer) {
    a_renderer.drawLine(this);
  }
  
  x(func) {
    this.xFunc = func;
    return this;
  }
  
  y(func) {
    this.yFunc = func;
    return this;
  }
  

} // End of class Line



