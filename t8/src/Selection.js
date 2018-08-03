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

import {Primitive} from './Primitive';
import {Group} from './Group';
import {Ghost} from './Ghost';
 
// Selection
export class Selection {

  constructor(other,parent) {
    this.selected = other;
    this.updateSel = {nodes:other,dataset:[]};
    this.enterSel = {nodes:[],dataset:[]};
    this.exitSel = {nodes:[],dataset:[]};
    this.parent = parent;
    this._enter = false; // false Default, _enter the selected objects. True, _enter the `enter` objects
    this.active = this.updateSel;
  }

  data(dataset) {
    let num_selected = this.updateSel.nodes.length;
    let num_enter = dataset.length - num_selected;
    let num_exit = Math.max(0,this.updateSel.nodes.length - dataset.length);
    console.log(num_selected+ ' ' + num_enter + ' ' + num_exit);
    // Split in three sub-selections depending of data joining
    this.updateSel.dataset = dataset.slice(0,num_selected);
    this.enterSel.dataset = dataset.slice(num_selected);

    this._data = dataset;
    
    let self = this;
    this.enterSel.nodes = this.enterSel.dataset.map( (d,index) => self.parent.append('ghost') );

    return this;
  }

  datum(dataset) {
    // TODO
    this.selected = dataset;
  }
  
  /**
   * Append
   */
  append(type) {
  //  console.log('append ' + type);
    let new_nodes = this.active.nodes.map ( (n,i) => {
      // console.log('append::Create Node #' +i + ' ' + type);
      // console.log(n);
      // let child = t8.createNode(type,n);
      return n.append(type);
    });

    let sel = new Selection(new_nodes,null).data(this.active.dataset);
    return sel;
  }

  enter() {
    this._enter = true;
    this.active = this.enterSel;
    return this;
  }

  exit() {
    this.active = this.exitSel;
    return this;
  }
  
  
  /**
   * Set Attributes
   *
   * @param 
   *
   * @author Jean-Christophe Taveau
   */
  attr(key,v_or_func) {
    //console.log(key + '::' + v_or_func);
    if (typeof v_or_func === 'function') {
      let self = this;
      //console.log(self._data)
      this.active.dataset.forEach ( (d,i,arr) => {
        // console.log(v_or_func(p.data));
        // console.log('Modif ' + p.type);
        this.active.nodes[i].attr(key, v_or_func(d,i) );
      });
    }
    else {
      this.active.nodes.forEach ( p => p.attr(key,v_or_func));
    }
    return this;
  }

  /**
   * Set Action depending of event_type
   *
   * @author Jean-Christophe Taveau
   */
  on(event_type,func) {
    console.log('Add EVENT ' +  event_type + ' ' + this.active.nodes.length);
    this.active.nodes.forEach( (n) => n.root.register(n,event_type,func) );
    return this;
  }
  
  
  /**
   * Specific attributes
   *
   * @author Jean-Christophe Taveau
   */
  text(str) {
    return this.attr('t8_text',str);
  }
  


} // End of class Selection



