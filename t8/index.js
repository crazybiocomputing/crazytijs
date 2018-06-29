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


if (!window) {

  /*
   * Riding the Nashorn: Programming JavaScript on the JVM
   * @author Niko Köbler
   * @link https://www.n-k.de/riding-the-nashorn/
   */
   
  var global = this;
  var window = this;
  var process = {env:{}};

  var console = {};
  console.debug = print;
  console.log = print;
  console.warn = print;
  console.error = print;
}

import * as t8 from './src/index.js';

export {
  t8
}
