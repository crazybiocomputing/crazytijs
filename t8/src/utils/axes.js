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

import {Axis} from './Axis';


/**
 * Constructs a new top-oriented axis for the given scale, 
 * with empty tick arguments, a tick size of 6 and padding of 3. 
 * In this orientation, ticks are drawn above the horizontal domain path.
 */
export const axisTop = (scale) => {
  let tick = {
    args : [],
    size: 6,
    padding: 3
  }
  return new Axis('top',scale,tick);
}


/**
 * Constructs a new right-oriented axis for the given scale, 
 * with empty tick arguments, a tick size of 6 and padding of 3. 
 * In this orientation, ticks are drawn to the right of the vertical domain path.
 */
export const axisRight = (scale) => {
  let tick = {
    args : [],
    size: 6,
    padding: 3
  }
  return new Axis('right',scale,tick);
}


/**
 * Constructs a new bottom-oriented axis for the given scale, 
 * with empty tick arguments, a tick size of 6 and padding of 3. 
 * In this orientation, ticks are drawn below the horizontal domain path.
 */
export const axisBottom = (scale=null) => {
  let tick = {
    args : [],
    size: 6,
    padding: 3
  }
  return new Axis('bottom',scale,tick);
}


/**
 * Constructs a new left-oriented axis for the given scale, 
 * with empty tick arguments, a tick size of 6 and padding of 3. 
 * In this orientation, ticks are drawn to the left of the vertical domain path.
 */
export const axisLeft = (scale) => {
  let tick = {
    args : [],
    size: 6,
    padding: 3
  }
  return new Axis('left',scale,tick);
}


