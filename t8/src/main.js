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
 

import {CrazyPlot} from './CrazyPlot';
import {Element} from './Element';
import {Group} from './Group';
import {Primitive} from './Primitive';
import {Ghost} from './Ghost';
import {Text} from './Text';

export const createNode = (type,parentNode) => {
  const creators = {
    g: new Group('g',parentNode),
    ghost: new Ghost('ghost', parentNode),
    circle: new Primitive('circle',parentNode),
    line: new Primitive('line',parentNode),
    path: new Primitive('path',parentNode),
    rect: new Primitive('rect',parentNode),
    text: new Text('text',parentNode)
  }
  return creators[type];
};
    
export const create = (type) => {
  switch (type) {
    case 'plot': 
    case 'svg': return new CrazyPlot('svg',null);
  }
}

export const select = (selector) => {
  if (window.IJ) {
    console.log(WindowManager.getImage(selector));
    return new Element(WindowManager.getImage(selector));
  }
  else {
    return new Element(document.querySelector(selector));
  }
}

/**
 * Set Format according to Python 3 specifications
 *
 * From https://docs.python.org/3/library/string.html#format-specification-mini-language
 * format_spec     ::=  [[fill]align][sign][#][0][width][grouping_option][.precision][type]
 * fill            ::=  <any character>
 * align           ::=  "<" | ">" | "=" | "^"
 * sign            ::=  "+" | "-" | " "
 * width           ::=  digit+
 * grouping_option ::=  "_" | ","
 * precision       ::=  digit+
 * type            ::=  "b" | "c" | "d" | "e" | "E" | "f" | "F" | "g" | "G" | "n" | "o" | "s" | "x" | "X" | "%"
 */
export const format = (format_str) => (v) => {
  // TODO
  
  return v;

}

