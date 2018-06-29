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


import {Group} from './Group';
import {Selection} from './Selection';

 
 // Tiny Plot - trying to - follow the D3.js API and create an ImageJ Plot
// Enter, Update, Exit
// An Introduction to D3.js, The Web’s Most Popular Visualization Toolkit
// https://medium.com/@c_behrens/enter-update-exit-6cafc6014c36


export class CrazyPlot extends Group {
  // Constructor
  constructor(type,parent) {
    super(type,parent);
  }

  /**
   * @author Jean-Christophe Taveau

  attr(key,v_or_func) {
  IJ.log(key + ' ' + v_or_func);
  this.attributes[key] = v_or_func;
  return this;
}
   */
   
  /**
   * @author Jean-Christophe Taveau

  append(type) {
    const creators = {
      g: new Group()
    };
    let element = creators[type] || new Primitive(type);
    element.parent = this;
    this.children.push(element);
    return element;
  }
   */
   
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
      // TODO regex
      if (el.name === selectors) {
        sel.push(el);
      }
      return sel;
    }
    let selected = [];
    this.traverse( selectFunc(selected));
    // selected.forEach( (e,i) => console.log(i + ': ' + e.name));
    return selected;
  }

  /**
   * @author Jean-Christophe Taveau
   */
  traverse(func) {;
    let result = func(this);
    this.children.forEach( child => child.traverse(func));
  }

  /**
   * Generate graphics in a ImagePlus
   *
   * @author Jean-Christophe Taveau
   */
  show() {
    // Step #1 - Scan all the attributes for generating the ImageJ Plot
    let imp = IJ.createImage(
      "CrazyBioPlot", 
      "RGB white", 
      this.attributes.width, 
      this.attributes.height,
      1
    );
    let ip = imp.getProcessor();

    
    // plot.setFrameSize(this.attributes.width,this.attributes.height);
    // Step #2 - Draw all the primitives attached to this Plot
    this.toProcessor(ip);
    imp.show();
  }

  /**
   * Generate SVG code
   *
   * @author Jean-Christophe Taveau
   */
  toSVG() {
    let self = this;
    let attrList = Object.keys(this.attributes)
      .reduce ((str,key) => `${str} ${key}="${self.attributes[key]}" `,' ');
    
    // Tag
    let xml = `<svg  xmlns="http://www.w3.org/2000/svg" ${attrList}>\n`;
    // Get XML stuff from children
    this.children.forEach( (child) => {
      xml += child.toSVG();
    });
    // Close tag
    xml += '</svg>\n';
    return xml;
  }


} // End of class CrazyPlot




