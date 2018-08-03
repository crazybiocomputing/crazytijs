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
import {ScaleBand} from './ScaleBand';

export const min = (data) => {
  return data.reduce( (_min,d) => Math.min(_min,d), Number.MAX_VALUE );
}

export const max = (data,func= (d) => d ) => {
  return data.map( (d,i) => func(d,i)).reduce( (_max,d) => Math.max(_max,d), Number.MIN_VALUE );
}

export const extent = (data) => {
  return data.reduce( (_minmax,d) => [Math.min(_minmax[0],d),Math.max(_minmax[1],d)], [Number.MAX_VALUE,Number.MIN_VALUE]);
}

export const scaleLinear = () => {
  //domain [0,1]
  return new ScaleLinear();
}

export const scalePow = () => {
  // TODO
}

export const scaleSqrt = () => {
  // TODO
}

export const scaleLog = () => {
  // TODO
}


export const scaleTime = () => {
  // TODO
}

export const scaleSequential = () => {
  // TODO
}

export const scaleQuantize = () => {
  // TODO
}

export const scaleQuantile = () => {
  // TODO
}

export const scaleThreshold = () => {
  // TODO
}

export const scaleOrdinal = () => {
  // TODO
}

export const scaleBand = () => {
  // TODO
  return new ScaleBand();
}

export const scalePoint = () => {
  // TODO
}

// Interpolators

export const interpolateNumber = (a, b) => (v) => a * (1.0 - v) + b * v;

export const interpolateRound = (a, b) => (v) => Math.round(a * (1.0 - v) + b * v);


