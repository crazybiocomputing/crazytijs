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

import {Layout} from './layouts/Layout';

// Drawing Primitives 
export class Leaf {
  /**
   * @constructor
   */
  constructor(type,parent) {
    // console.log('Create Primitive ' + type);
    this.type = type;
    this.name = type;
    this.parent = parent;
    this.attributes = {};
  }

  /**
   * Set attribute to this node
   */
  attr(key,v_or_func) {
    if (typeof v_or_func === 'function') {
      this.attributes[key] = v_or_func(this.dataset);
    }
    else if (v_or_func instanceof Layout) {
      this.attributes[key] = v_or_func.generate(this.dataset);
    }
    else {
      // isNumeric => parseFloat
      this.attributes[key] = (!isNaN(parseFloat(v_or_func)) && isFinite(v_or_func)) ? parseFloat(v_or_func) : v_or_func;
    }
    return this;
  }
  
  /**
   * Set data to this node
   */
  datum(dataset) {
    this.dataset = dataset;
    return this;
  }
  
  text(a_string) {
    this.text = a_string;
  }
  
  traverse(func) {;
    func(this);
  }
  
  toSVG() {
    let self = this;
    // console.log('Primitive: ' + JSON.stringify(this.name) + ' ' + this.dataIndex);
    let attrList = Object.keys(this.attributes).reduce ((str,key) => `${str} ${key}="${self.attributes[key]}" `,' ');
    let xml = `<${self.type} ${attrList}></${self.type}>\n`;
    return xml;
  }
  
} // End of class Leaf



