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

import {ScaleBand} from './ScaleBand';
import {ScaleLinear} from './ScaleLinear';


/**
 * From "Graphics Gems, Volume 1" by Andrew S. Glassner. 
 * An excellent description of the problem is given in the chapter on "Nice Numbers for Graph Labels".
 */
 
export class Axis {
  /**
   * @constructor
   */
  constructor(orient,scaleObj,ticks) {
    this.scaler = scaleObj;
    this.ticks = ticks;
    this.ticks.orient = orient;
    this.nicelabel = true;
    this._format = (v) => v;
    
    switch (orient) {
      case 'top':
        // Function
        this.ticks.axisPath = (axisLength) => `M0.0,${-ticks.size}V0.0H${axisLength}V${-ticks.size}`;
        this.ticks.maxTicks = (axisLength) => 10;
        // Geometry default parameters
        this.ticks.geom = {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: -ticks.size,
          marginX: 0,
          marginY: -9,
          shiftX: 0,
          shiftY: '-0.71em',
        };
        break;
      case 'bottom': 
        // Function
        this.ticks.axisPath = (axisLength) => `M0.0,${ticks.size}V0.0H${axisLength}V${ticks.size}`;
        this.ticks.maxTicks = (axisLength) => 10;
        // Geometry default parameters
        this.ticks.geom = {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: ticks.size,
          marginX: 0,
          marginY: 9,
          shiftX: 0,
          shiftY: '0.71em',
        };
        break;
      case 'left': 
        // Function
        this.ticks.axisPath = (axisLength) => `M${-ticks.size},${axisLength}H0.0V0.0H${-ticks.size}`;
        // Simple heuristic: An overall font height is about 15px + 15px as padding for sake of good looking
        this.ticks.maxTicks = (axisLength) => Math.min(axisLength / 15, 20);
        // Geometry default parameters
        this.ticks.geom = {
          x1: 0,
          y1: 0,
          x2: -ticks.size,
          y2: 0,
          marginX: -9,
          marginY: 0,
          shiftX: 0,
          shiftY: '0.32em',
        };
        break;
      case 'right':
        this.ticks.axisPath = (axisLength) => `M${ticks.size},${axisLength}H0.0V0.0H${ticks.size}`;
        // Simple heuristic: An overall font height is about 15px + 15px as padding for sake of good looking
        this.ticks.maxTicks = (axisLength) => Math.min(axisLength / 15, 20);
        // Geometry default parameters
        this.ticks.geom = {
          x1: 0,
          y1: 0,
          x2: ticks.size,
          y2: 0,
          marginX: 9,
          marginY: 0,
          shiftX: 0,
          shiftY: '0.32em',
        };
        break;
    }
  }
  
  /**
   * Set the Scale 
   *
   */
  scale(scaleObj) {
    this.scaler = scaleObj;
    return this;
  }
  
  /**
   *
   */
  ticks(num) {
    this.ticks.maxTicks = num;
    return this;
  }
  
  /**
   *
   */
  tickArguments(args) {
    return this;
  }
  
  /**
   *
   */
  tickValues(arr) {
    this.nicelabel = false;
    this.ticks.labels = arr;
    return this;
  }
  
  /**
   *
   */
  tickFormat(formatFunc) {
    this._format = formatFunc
    return this;
  }

  /**
   *
   */
  tickSize(v) {
    this.ticks.size = v;
    return this;
  }
  
  /**
   *
   */
  tickSizeInner() {
    // TODO
    return this;
  }
  
  /**
   *
   */
  tickSizeOuter() {
    // TODO
    return this;
  }
  
  /**
   *
   */
  tickPadding() {
    // TODO
    return this;
  }

  /**
   * Calculate and update values for tick spacing and nice
   * minimum and maximum data points on the axis.
   */
  heckbert(domainMin, domainMax, maxTicks = 10) {
  
    /*
     * Returns a "nice" number approximately equal to range Rounds
     * the number if round = true Takes the ceiling if round = false.
     *
     * @param {number} localRange - the data range
     * @param {boolean} round - If true round the data minimum down and the data maximum up. Loose labeling
     * @returns {number} A "nice" number to be used for the data range
     */
    const niceNum = (localRange, round) => {

      // exponent of localRange 
      let exponent = Math.floor(Math.log10(localRange));
      
      // fractional part of localRange between 1 to 10
      let fraction = localRange / Math.pow(10, exponent);
      
      // nice, rounded fraction
      let niceFraction; 
      let QF_round = [{q: 1.5, f: 1},{q: 3, f: 2},{q: 7, f: 5},{q: Number.MAX_VALUE, f: 10}];
      
      
      
      if (round) {
        if (fraction < 1.5) {
          niceFraction = 1;
        }
        else if (fraction < 3) {
          niceFraction = 2;
        }
        else if (fraction < 7) {
          niceFraction = 5;
        }
        else {
          niceFraction = 10;
        }
        niceFraction = QF_round.filter( (v) => fraction < v.q)[0].f;
      }
      else {
        if (fraction <= 1)
          niceFraction = 1;
        else if (fraction <= 2)
          niceFraction = 2;
        else if (fraction <= 5)
          niceFraction = 5;
        else
          niceFraction = 10;
      }

      return niceFraction * Math.pow(10, exponent);
    }
    
    ////////////// MAIN //////////////
    let range = niceNum(domainMax - domainMin, false);
    let tickSpacing = niceNum(range / (maxTicks - 1), true);
    let niceMin = Math.floor(domainMin / tickSpacing) * tickSpacing;
    let niceMax = Math.ceil(domainMax / tickSpacing) * tickSpacing;
        
    // Return tickValues
    return Array.from( {length: (niceMax - niceMin)/ tickSpacing + 1}, (v,i) => niceMin + i * tickSpacing);
  }

  // axis(context) ? 
  getFunc() {
    let ticks = this.ticks;
    // Get nice labels with Heckbert Algorithm

    let nicelabels = this.heckbert(this.scaler.domain[0],this.scaler.domain[1]);
    console.log(nicelabels);
    
    return function (parent) {
    // TODO
        
      return parent;
    } 
  }

  subgraph(parent) {
    let ticks = this.ticks;
    let scale = this.scaler;
    
    console.log('AXIS ' + JSON.stringify(ticks));
    let axisLength = t8.max(scale._range) - t8.min(scale._range);
    
    if (scale instanceof ScaleLinear) {
      ticks.data = this._calcTicksFromLinear(scale,ticks.size);
    }
    else if (scale instanceof ScaleBand) {
      ticks.data = this._calcTicksFromBand(scale,ticks.size);
    }
    
    console.log(ticks);
    
    // Depending of orientation (top, bottom)/(left,right) add vertical or horizontal translate(..)
    let path = ticks.axisPath(axisLength);
    
    console.log(path);
    console.log(parent.type);
    
    // Create branchgroup
    let axis = parent.attr('fill', 'none')
      .attr('font-size', '10')
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', (ticks.geom.y2 !== 0) ? 'middle' : ((ticks.geom.x2 < 0) ? 'end': 'start'));

    
    axis.append('path')
        .attr('class', 'domain')
        .attr('stroke', '#000')
        .attr('d', path);

    let gticks = axis.selectAll('domain_tick')
      .data(ticks.data)
      .enter()
      .append('g')
        .attr('opacity',1)
        .attr('transform', (tick) => (ticks.geom.y2 === 0) ? `translate(0,${tick.value})` : `translate(${tick.value},0)`);

    gticks.append('line')
      .attr('stroke', '#000')
      .attr('x1', ticks.geom.x1)
      .attr('y1', ticks.geom.y1)
      .attr('x2', ticks.geom.x2)
      .attr('y2', ticks.geom.y2);

    gticks.append('text')
      .attr('fill', '#000')
      .attr('x', ticks.geom.marginX)
      .attr('y', ticks.geom.marginY)
      .attr('dx', ticks.geom.shiftX)
      .attr('dy', ticks.geom.shiftY)
      .text( (tick) => this._format(tick.text));

    return parent;
    
  }
  
  _calcTicksFromLinear(scale,ticksize) {
    let labels;
    let axisLength = t8.max(scale._range) - t8.min(scale._range);
    if (this.nicelabel) {
      // Get nice labels with Heckbert Algorithm
      labels = this.heckbert(scale._domain[0],scale._domain[1], this.ticks.maxTicks(axisLength));
      console.log(labels);
      // Clamp `outside` labels
      labels = labels.filter( (lab) => lab >= scale._domain[0] && lab <= scale._domain[1]);
    }
    let data = [];
    labels.forEach( (lab, index) =>{
      data[index] = {
        text: lab,
        value: scale.get(lab),
        size: ticksize,
        x: 0,
        y: index
      }
    });
    return data;
  }
  
  
  _calcTicksFromBand(scale,ticksize) {
    let data = [];
    scale._domain.forEach( (lab, index) =>{
      data[index] = {
        text: lab,
        value: scale.get(lab) + scale.bandwidth() / 2,
        size: ticksize,
        x: 0,
        y: index
      }
    });
    return data;
  }
} // End of class Axis
