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
import {RendererIJ} from './render/RendererIJ';
import {RendererSVG} from './render/RendererSVG';

 
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
  show(output = 'SVG') {
    switch (output.toUpperCase()) {
      case 'IMAGEJ': 
      case 'IJ': 
        RendererIJ.render(this); 
        break;
      case 'SVG': 
        RendererSVG.render(this);  
        break;
    }
  }

  /**
   * Generate graphics via a Renderer (SVG, ImageJ, WebGL, etc.)
   *
   * @author Jean-Christophe Taveau
   */
  draw(a_renderer) {
    a_renderer.drawRoot(this);
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
    
    // Attach SVG to HTML5 Element from DOM if any
    if (! window.IJ && this.parent !== null) {
      let div = document.createElement('div');
      div.className = 'crazy_plot';
      this.parent.anchor.appendChild(div);
      div.innerHTML = xml;
    }
    return xml;
  }


} // End of class CrazyPlot




