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


 // Element
export class RendererSVG {
  constructor(root,renderer) {
  }
  
  static render(root) {
    let r = new RendererSVG(root);
    let xml = r.drawNode(root);
    // Display Final Result
    // root.children.forEach( (child) => self.xml += node.toSVG());
    if (window.IJ) {
      // Non sense, just display SVG source code
      root.xml = xml;
    }
    else {
      // Do nothing ?
    }
    root.xml = xml;
  }


  drawNode(node) {
    let xml = '';
    switch (node.type) {
    case 'g': xml = this.drawGroup(node); break;
    case 'ghost' : xml = this.drawGhost(node); break;
    case 'circle':
    case 'line':
    case 'path':
    case 'polygon':
    case 'polyline':
    case 'rect': xml = this.drawPrimitive(node); break;
    case 'text': xml = this.drawText(node); break;
    case 'svg': xml = this.drawSVG(node); break;
    }
    return xml;
  }
  
  /**
   * Draw CrazyPlot
   *
   * @author Jean-Christophe Taveau
   */
  drawSVG(node) {
    let attrList = Object.keys(node.attributes)
      .reduce ((str,key) => `${str} ${key}="${node.attributes[key]}" `,' ');
    
    // Tag
    let xml = `<svg  xmlns="http://www.w3.org/2000/svg" ${attrList}>\n`;
    // Get XML stuff from children
    let self = this;
    console.log(node.children);
    node.children.forEach( (child) => {
      console.log('Draw Children');
      xml += this.drawNode(child);
    });
    // Close tag
    xml += '</svg>\n';
    
    // Attach SVG to HTML5 Element from DOM if any
    if (! window.IJ && node.parent !== null) {
      let div = document.createElement('div');
      div.className = 'crazy_plot';
      node.parent.anchor.appendChild(div);
      div.innerHTML = xml;
    }
    return xml;
  }
  
  
  /**
   * Draw Ghost
   *
   * @author Jean-Christophe Taveau
   */
  drawGhost(node) {
    console.log('Draw Ghost');
    let xml = '';
    let self = this;
    node.children.forEach( (child) => xml += self.drawNode(child));
    return xml;
  }
  
  /**
   * Draw Group
   *
   * @author Jean-Christophe Taveau
   */
  drawGroup(node) {
    let self = this;
    let xml = '';
    let attrList = Object.keys(node.attributes).reduce ((str,key) => `${str} ${key}="${node.attributes[key]}" `,' ');
    xml += `<${node.type} ${attrList}>\n`;
    node.children.forEach( (child) => xml += self.drawNode(child));
    xml += `</${node.type}>\n`;

    return xml;
  }
  
  /**
   * Draw Primitive
   *
   * @author Jean-Christophe Taveau
   */
  drawPrimitive(node) {
    let xml = '';
    let attrList = Object.keys(node.attributes).reduce ((str,key) => `${str} ${key}="${node.attributes[key]}" `,' ');
    xml += `<${node.type} ${attrList}></${node.type}>\n`;

    return xml;
  }
  
  /**
   * Draw Text
   *
   * @author Jean-Christophe Taveau
   */
  drawText(node) {
    console.log('Text: ' + node.attributes.text_content);
    let xml = '';
    let attrList = Object.keys(node.attributes).reduce ((str,key) => `${str} ${key}="${node.attributes[key]}" `,' ');
    xml += `<${node.type} ${attrList}>${node.attributes.text_content}</${node.type}>\n`;

    return xml;
  }
  
} // End of class RendererSVG

