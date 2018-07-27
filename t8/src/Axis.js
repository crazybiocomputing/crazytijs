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


/**
 * From "Graphics Gems, Volume 1" by Andrew S. Glassner. 
 * An excellent description of the problem is given in the chapter on "Nice Numbers for Graph Labels".
 */
 
export class Axis {
  /**
   * @constructor
   */
  constructor(orient,scale,ticks) {
    this.scale = scale;
    this.ticks = ticks;
    switch (orient) {
      case 'top': break;
      case 'bottom': break;
      case 'left': 
        this.ticks.axisPath = (axisLength) => `M${-ticks.size},${axisLength}H0.5V0.5H${-ticks.size}`;
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
      case 'right': break;
    }
  }
  
  /**
   *
   */
  scale(scaleFunc) {
    return this;
  }
  
  /**
   *
   */
  ticks() {
    return this;
  }
  
  /**
   *
   */
  tickArguments() {
    return this;
  }
  
  /**
   *
   */
  tickValues() {
    return this;
  }
  
  /**
   *
   */
  tickFormat() {
    return this;
  }

  /**
   *
   */
  tickSize() {
    return this;
  }
  
  /**
   *
   */
  tickSizeInner() {
    return this;
  }
  
  /**
   *
   */
  tickSizeOuter() {
    return this;
  }
  
  /**
   *
   */
  tickPadding() {
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

    let nicelabels = this.heckbert(this.scale.domain[0],this.scale.domain[1]);
    console.log(nicelabels);
    
    return function (parent) {
    // TODO
        
      return parent;
    } 
  }

  subgraph(parent) {
    let ticks = this.ticks;
    let scale = this.scale;
    
    console.log('AXIS ' + JSON.stringify(ticks));
    
    // Get nice labels with Heckbert Algorithm
    // Simple heuristic: An overall font height is about 15px + 15px as padding for sake of good looking
    let axisLength = t8.max(this.scale._range) - t8.min(this.scale._range);
    let maxTicks = Math.min(axisLength / 15, 20);
    let nicelabels = this.heckbert(this.scale._domain[0],this.scale._domain[1], maxTicks);
    console.log(nicelabels);
    ticks.data = [];
    nicelabels.forEach( (lab, index) =>{
      ticks.data[index] = {
        text: lab,
        value: lab,
        size: ticks.size,
        x: 0,
        y: index
      }
    });
    console.log(ticks);
    
    // Depending of orientation (top, bottom)/(left,right) add vertical or horizontal translate(..)
    let path = ticks.axisPath(axisLength);
    
    console.log(path);
    console.log(parent.type);
    
    // Create branchgroup
    let axis = parent.attr('fill', 'none')
      .attr('font-size', '10')
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', 'end');

    
    axis.append('path')
        .attr('class', 'domain')
        .attr('stroke', '#000')
        .attr('d', path);

    let gticks = axis.selectAll('domain_tick')
      .data(ticks.data)
      .enter()
      .append('g')
        .attr('opacity',1)
        .attr('transform', (tick) => `translate(${tick.x},${scale.get(tick.value)})`);

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
      .text( (tick) => tick.text);

    return parent;
    
  }
  
} // End of class Axis
