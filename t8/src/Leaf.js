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

// Drawing Primitives 
export class Leaf {
  /**
   * @constructor
   */
  constructor(type,parent) {
    console.log('Create Primitive ' + type);
    this.type = type;
    this.name = type;
    this.parent = parent;
    this.attributes = {};
  }

  attr(key,v_or_func) {
    this.attributes[key] = v_or_func;
    return this;
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

  toProcessor(ip) {
    console.log('TODO');
  }

} // End of class Leaf



