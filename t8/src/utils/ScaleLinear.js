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

export class ScaleLinear {
  constructor(domain=[0,1],range=[0,1],clamp=false) {
    this._domain = domain;
    this._range = range;
    this._clamp = clamp;
    this.interpolator = t8.interpolateNumber(this._range[0],this._range[1]);
    this._clamp = false;
  }
  
  clamp(flag) {
    this._clamp = flag;
    return this;
  }
  
  /**
   * Set minimum and maximum values of the input data
   *
   * @author Jean-Christophe Taveau
   */
  domain(boundaries) {
    this._domain = boundaries;
    return this;
  }
  
  /**
   * Set the output range that you would like your input values to map to.
   *
   * @author Jean-Christophe Taveau
   */
  range(boundaries) {
    this._range = boundaries;
    this.interpolator = t8.interpolateNumber(this._range[0],this._range[1]);
    return this;
  }
  
  interpolate(interpolatorFunc) {
    this.interpolator = interpolatorFunc;
    return this;
  }
  
  invert(range_v) {
    let output =  this.interpolator(range_v,this._range,this._domain);
    return (this._clamp) ? Math.min(Math.max(this._domain[0],output),this._domain[1]): output;
  }
  
  get(domain_v) {
    let output =  this.interpolator((domain_v - this._domain[0])/(this._domain[1] - this._domain[0]));
    return (this._clamp) ? Math.min(Math.max(this._range[0],output),this._range[1]): output;
  }
}

