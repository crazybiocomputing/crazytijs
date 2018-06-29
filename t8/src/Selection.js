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
 
 
// Selection
class Selection {

  constructor(other,parent) {
    this.selected = other;
    this.enterSel = [];
    this.parent = parent;
    this.use = false; // false Default, use the selected objects. True, use the `enter` objects
  }

  data(dataset) {

    let num_selected = this.selected.length;
    let num_enter = dataset.length - num_selected;
    this.enterSel = Array.from( 
      {length: num_enter}, 
      (v,i) => ({dataIndex: i + num_selected, parent: this.parent})
    );

  //  console.log('Num dataset: ' + dataset.length);
  //  console.log('Num selected: ' + num_selected);
  //  console.log('Num enter: ' + num_enter);
  //  console.log(this.enterSel[0].index);
    
    if (num_selected > 0) {
  //    console.log('Add Data from selected');
      this.selected.forEach( (el,index) => el.data = dataset[index]);
    }
    if (num_enter > 0) {
  //    console.log('Add Data from enter');
      this.enterSel.forEach( (el) => el.data = dataset[el.dataIndex] );
    }
    return this;
  }

  append(type) {
  //  console.log('append ' + type);
    if (this.use) {
      let parent = this.parent;
      this.enterSel = this.enterSel.map( el => {
        let p = new Primitive(type,parent);
        parent.children.push(p);
        p.data = el.data;
        p.dataIndex = el.dataIndex;
        return p;
      });
    }
  //  console.log(' => ' + this.enterSel[0].type);
  //  console.log(' => ' + this.enterSel[0].attributes.fill);
  //  console.log(' => ' + this.enterSel[0].dataIndex);
  //  console.log(' => ' + this.enterSel[0].data);
    return this;
  }

  attr(key,v_or_func) {
    console.log(key + '::' + v_or_func);
    if (this.use) {
      if (typeof v_or_func === 'function') {
        this.enterSel.forEach ( p => {
          // console.log(v_or_func(p.data));
          // console.log('Modif ' + p.type);
          p.attr(key, v_or_func(p.data) );
        });
      }
      else {
        this.enterSel.forEach ( p => p.attr(key,v_or_func));
      }
    }
    else {
      if (typeof v_or_func === 'function') {
        this.selected.forEach ( p => {
          // console.log(v_or_func(p.data));
          p.attr(key, v_or_func(p.data) );
        });
      }
      else {
        this.selected.forEach ( p => p.attr(key,v_or_func));
      }
    }

    return this;
  }

  enter() {
    console.log('enter');
    this.use = true;
    return this;
  }

} // End of class Selection

export {Selection};


