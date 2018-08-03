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

export class ScaleBand {
  constructor(range=[0,1]) {
    this._domain;
    this._range = range;
    this._step;
    this._padding = {inner:0,outer:0}; // Inner, Outer
    this._bandwidth = -1;
    this._align = 0.5;
    this._round = false;
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
  
  paddingInner(v) {
    this._padding.inner = v;
    return this;
  }
  
  paddingOuter(v) {
    this._padding.outer = v;
    return this;
  }
  
  padding(in_out) {
    this._padding.inner = in_out[0];
    this._padding.outer = in_out[1];
    return this;
  }
  
  /**
   * Set the output range that you would like your input values to map to.
   *
   * @author Jean-Christophe Taveau
   */
  range(boundaries) {
    this._range = boundaries;
    return this;
  }
  
  /**
   * Set the output range that you would like your input values to map to.
   *
   * @author Jean-Christophe Taveau
   */
  rangeRound(boundaries) {
    // TODO
    this._range = boundaries;
    this._round = true;
    return this;
  }


  align(v) {
    this._align = v;
    return this;
  }
  
  step() {
    // TODO BUG
    this._step = (this._range[1] - this._range[0] - 2 * this._padding.outer ) / this._domain.length;
    return this._step;
  }
  
  bandwidth() {
    return (this._bandwidth === -1) ? this._updateBandwidth() : this._bandwidth;
  }
  
  // Pseudo Private
  _updateBandwidth() {
    let num = this._domain.length;
    let len = this._range[1] - this._range[0];
    this._bandwidth = len / (num + 2 * this._padding.outer + (num - 1) * this._padding.inner);

    if (this._round === true) {
      // this._padding.outer = (len - Math.round(this._bandwidth) * (num + ( num - 1) * this.padding.inner) ) * this._align;
      this._bandwidth = Math.floor(this._bandwidth);
      this._padding.innerPix = Math.floor(this._padding.inner * this._bandwidth);
      this._padding.outerPix = Math.floor(this._padding.outer * this._bandwidth);
      let usePix = this._bandwidth * num + this._padding.innerPix * (num -1) + this._padding.outerPix * 2;
      this._padding.left = Math.floor((len - usePix) * this._align);
    }
    else {
      this._padding.innerPix = this._padding.inner * this._bandwidth;
      this._padding.outerPix = this._padding.outer * this._bandwidth;
      let usePix = this._bandwidth * num + this._padding.innerPix * (num -1) + this._padding.outerPix * 2;
      this._padding.left = Math.max(0,(len - usePix) * this._align);

    }
   console.log('BandWidth ' + this._bandwidth + ' ' + JSON.stringify(this._padding));
   return this._bandwidth;
  }
  
  band(domain_v) {
    let index = this._domain.indexOf(domain_v);
    if (index !== -1) {
      // Trigger padding and bandwidth calc if required
      let bandW = this.bandwidth();
      return this._padding.left + this._padding.outerPix + (bandW + this._padding.innerPix)* index;
    }
    return -1;
  }
  
  get(domain_v) {
    return this.band(domain_v);
  }
}
  
