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

import {ScaleLinear} from './ScaleLinear';

export const min = (data) => {
  return data.reduce( (_min,d) => Math.min(_min,d), Number.MAX_VALUE );

}

export const max = (data) => {
  return data.reduce( (_max,d) => Math.max(_max,d), Number.MIN_VALUE );
}

export const scaleLinear = () => {
  return new ScaleLinear();
}

export const scaleTime = () => {

}

// Interpolators

export const interpolateNumber = (a, b) => (v) => a * (1.0 - v) + b * v;

export const interpolateRound = (a, b) => (v) => Math.round(a * (1.0 - v) + b * v);


