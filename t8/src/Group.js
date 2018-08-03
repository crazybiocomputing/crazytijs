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
// import {Primitive} from './Primitive';
import {Selection} from './Selection';

 // Group
export class Group extends Leaf {
  /**
   * @constructor
   */
  constructor(type,parent) {
    super(type,parent);
    if (this.root !== null) {
      this.ID = this.root.requestID();
    }
    this.children = [];
  }

  append(type) {
    let element = t8.createNode(type,this);
    this.children.push(element);
    return element;
  }

  call(node) {
    // TODO Dirty because modify `this` node.
    // Modify `this` and append subgraph.
    // Could be a function or something else....
    node.subgraph(this);
    return this;
  }
  
  /**
   * @author Jean-Christophe Taveau
   */
  selectAll(type) {
    let selection = this.querySelector(type);
    return new Selection(selection,this);
  }

  /**
   * @author Jean-Christophe Taveau
   */
  select(type) {
    return this;
  }

  /**
   * @author Jean-Christophe Taveau
   */
  querySelector(selectors) {
    const selectFunc = (sel) => (el) => {
      if (selectors.split(/\s+/).every( sel => el.name.indexOf(sel) !== -1)) {
        sel.push(el);
      }
      return sel;
    }
    let selected = [];
    this.traverse( selectFunc(selected));
    return selected;
  }

  traverse(func) {
    func(this);
    this.children.forEach( child => child.traverse(func));
  }

  /**
   * Generate graphics via a Renderer (SVG, ImageJ, WebGL, etc.)
   *
   * @author Jean-Christophe Taveau
   */
  draw(a_renderer) {
    a_renderer.drawGroup(this);
  }
  
/*
  toSVG() {
    let self = this;
    let attrList = Object.keys(this.attributes).reduce ((str,key) => `${str} ${key}="${self.attributes[key]}" `,' ');
    let xml = `<${self.type} ${attrList}>\n`;
    this.children.forEach( (child) => xml += child.toSVG());
    xml += `</${self.type}>\n`;
    return xml;
  }
*/
  
} // End of class Group


