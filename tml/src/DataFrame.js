/*
 *  TIJS: Tools for ImageJ JavaScript
 *  Copyright (C) 2017-2019  Jean-Christophe Taveau.
 *
 *  This file is part of TIJS, module tml
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


// Class
export class DataFrame {

  /**
   * @constructor
   */
  constructor() {
      // FloatProcessor
      this._data;
      this._width;
      this._height;
      this._rows;
      this._columns;

    /**
     * Data Types:
     * 1 = boolean
     * 4 = date
     * 6 = categorical
     * 8 = byte
     * 16 = 16-bit integer (pixel value)
     * 24 = 24-bit RGB (pixel value)
     * 32 = 32-bit float (pixel value)
     * 64 = number
     */
      this._dtypes;

    /**
     * Categorical Data
     * The categorical data are stored in a dictionary and only the index is stored in the underlying DataFrame/FloatProcessor
     */
      this._categoricals;
    }

  static timestamp(a_date) {
    // Number of seconds since 1970
    // TODO
    return 12345678;
  }

  static BOOLEAN() {
    return 1;
  }

  static NUMBER() {
    return  42;
  }

  get dtypes() {
    const dataTypes = [
      '-','boolean','-','-','date','-','category','-','byte',
      '-','-','-','-','-','-','-','-','int16',
      '-','-','-','-','-','-','-','-','rgb-color',
      '-','-','-','-','-','-','-','-','float',
      '-','-','-','-','-','-','-','-','number'
    ];
    return this._dtypes.reduce( (t,idx) => ({heading: this._columns[idx],type: dataTypes[idx]}));
  }

  get height() {
    return this._height;
  }

  get width() {
    return this._width;
  }

  get shape() {
    return [this._height,this._width];
  }

  get index() {
    return this._rows;
  }

  get headings() {
    return this._columns;
  }

  get columns() {
    return this.array();
  }

  get rows() {
    return this.array();
  }

  set headings(cols) {
    // Copy
    this._columns = cols.map( (v) => v);
  }

  set index(rows) {
    // Copy
    this._rows = rows.map( (v) => v);
  }

  from(data) {
    // Step #1: check ResultsTable, ImagePlus, ImageProcessor, and ImageStack.
    if (data.class) {
      this.fromIJ(data);
    }
    //  Step #2: check 
    else if (data.columns) {
      this.fromObject(data);
    }
    //  Step #3: check matrix
    else if (data[0] && data[0][0]) {
      this.fromMatrix(data);
    }
  }

  fromIJ(data) {
    let className = data.class.toString();

    if (className.indexOf('ImagePlus') !== -1 && data.getNSlices() > 1) {
      this.fromStack(data.getImageStack());
    }
    else if (className.indexOf('ImagePlus') !== -1&& data.getNSlices() === 1) {
      this.fromProcessor(data.getProcessor());
    }
    else if (className.indexOf('ImagePlus') !== -1 && data.getNSlices() > 1) {
      this.fromStack(data.getStack());
    }
    else if (className.indexOf('Processor') !== -1) {
      this.fromProcessor(data);
    }
    else if (className.indexOf('ImageStack') !== -1) {
      this.fromStack(data);
    }
    else if (className.indexOf('ResultsTable') !== -1) {
      this.fromResults(data);
    }
    else if (className.indexOf('String') !== -1) {
      this.fromTable(data);
    }
    else {
      IJ.showMessage('ERR: Cannot Load Data');
      throw('EXIT: End of Script');
    }
  }

  fromJSON(json,order='row') {
    // TODO
    this._rows = [];
    this._columns = [];
    this._dtypes = [];
    let count = 0;
    if (order == 'row') {
      for (let key in Object.keys(json) ) {
        this._rows.push(key);
        this._columns.push(count++);
    }
    }
    else if (order == 'column') {
    }
    else {
      alert('Unknown order - Must be `row` or `column`');
    }
    this._data = new FloatProcessor(other);
  }

  /**
   * Load 2D data (aka matrix) in DataFrame
   */
  fromMatrix(data) {
    // TODO
  }

  fromCSV(table,sep=',',order='row') {
    // TODO
    if (order == 'row') {
    }
    else if (order == 'column') {
    }
    else {
      alert('Unknown order - Must be `row` or `column`');
    }
    this._data = new FloatProcessor(other);
  }


  fromStack(stack) {
    let w = stack.getWidth();
    let h = stack.getHeight();
    let num = stack.getSize();

    this._data = new FloatProcessor(w * h, num);
    this._width = w * h;
    this._height = num;
    this._dtypes = stack.getBitDepth();
    this._rows   = Array.from({length: this._height}, (i,v) => i);
    this._columns = Array.from({length: this._width}, (i,v) => i);
    for (let z=1; z <= num; z++) {
      let ip = stack.getProcessor(z);
      for (let i = 0; i < w * h ; i++) {
        this._data.setf(i,z-1, ip.getf(i) );
      }
    }
  }

  fromProcessor(ip) {
    let w = ip.getWidth();
    let h = ip.getHeight();

    this._data = new FloatProcessor(w, h);
    this._width = w;
    this._height = h;
    this._dtypes = ip.getBitDepth();
    this._rows   = Array.from({length: this._height}, (i,v) => i);
    this._columns = Array.from({length: this._width}, (i,v) => i);
    // Copy Processor
    for (let i = 0; i < w * h ; i++) {
      this._data.setf(i, ip.getf(i) );
    }
  }

  fromResults(table) {
    console.log('Results');
    // Step #1: Read the ImageJ column headings
    // In a ResultsTAble, the first column is the row index and must be removed
    this._columns = table.getColumnHeadings().split(/[\t,]+/).slice(1);

    console.info(JSON.stringify(this._columns) );
    // Step #2: Guess types of columns
    this._dtypes = Array.from({length: this._columns.length},_ => DataFrame.NUMBER);

    // Step #3: Fill the FloatProcessor
    let w = this._columns.length;
    let h = table.getColumn(0).length;
    this._data = new FloatProcessor(w, h);
    this._width = w;
    this._height = h;

    this._columns.forEach( (heading,x) => {
      let idx = table.getColumnIndex(heading);
      Java.from(table.getColumn(idx)).forEach( (v,y) => {
        this._data.setf(x, y, v );
      });
    });
  }

 fromTable(table_name) {
    // Step #1: Read the ImageJ TextWindow and Extract values...
    let win = WindowManager.getWindow(table_name);
    let rows = win.getTextPanel().getText().split('\n');
    this._columns = rows[0].split('\t');

    // Step #2: Guess types of columns
    this._dtypes = [];
    let cells = rows[1].split('\t');
    for (let cell of cells) {
      this._dtypes.push(this._datatype(cell));
    }

    // Step #3: Fill the FloatProcessor

  }

  array() {
    // TODO: replace the Categoricals and the booleans.
    let tmp = toArrayJS(this._data.getFloatArray());
    tmp =  tmp.map( (vec) => toArrayJS(vec));
    // Need to transpose...
    let out = [];
    for (let i=0; i < tmp[0].length; i++) {
      out[i] = [];
      for (let j=0; j < tmp.length; j++) {
        out[i][j] = tmp[j][i];
      }
    }

    return (out.length === 1) ? out[0] : out;
  }

  flatArray() {
    // TODO: replace the Categoricals and the booleans.
    return this._data.getFloatArray().flat();
  }


  /**
   * Get cell content from row and column.
   * @param {string|number} row - row index (number) or row header (string)
   * @param {string|number} row - row index (number) or row header (string)
   * @returns {string|number} value (number,date, categorical,etc)
   *
   * @author Jean-Christophe Taveau
   */
  at(row, col) {
    let v,type;

    let x = (!isNaN(col)) ? col : this._columns.indexOf(col);
    let y = (!isNaN(row)) ? row : this._rows.indexOf(row);

    type = this._dtypes[col];
    v = this._data.getf(x,y);
    // TODO
    return toType(v,type);
  }

  categorical(categories) {
    if (this._categorical.includes(categories)) {
    }
  }

  column(col) {
    // TODO
    let index;
    if (isNaN(col) ) {
      index = this._columns.indexOf(col);
    }
    else {
      index = col;
    }

    let df = new DataFrame();
    df._width = this._height;
    df._height = 1;
    df._data = new FloatProcessor(this._height,1);
    df._columns = [this._columns[index]]; 
    df._rows = [0];
    df._dtypes = [this._dtypes[index]];
    for (let y = 0; y < this._height; y++) {
      df._data.setf(y,0,this._data.getf(index,y));
    }
    // TODO df._dtypes = this.dtypes.map( t => t);
    return df;
  }

  row(index) {
    // TODO
    let df = new DataFrame();
    let _row = [];
    for (let x = 0; x < this._width; x++) {
      _row.push(this._data.getf(x,index));
    }
    console.log(_row.length);
    // NASHORN Trick
    df._data = new FloatProcessor(this._width, 1, Java.to(_row, "float[]") );
    df._columns = this._columns.map( c => c);
    df._rows = (this._rows === undefined) ? index : [this._rows[index]];
    df._dtypes = this._dtypes.map( t => t);
    return df;
  }

  reshape(nrows,ncols) {
    // TODO
    // Return a new rescaled DataFrame/FloatProcessor 
    let df = new DataFrame();

    // NASHORN Trick
    df._data = new FloatProcessor(ncols, nrows, this._data.getPixelsCopy() );
    df._columns = Array.from({length:ncols},(v,i) => i);
    df._rows    = Array.from({length:nrows},(v,i) => i);
    // TODO df._dtypes = this.dtypes.map( t => t);
    return df;
  }

  select(...column_names) {
    let ncols = column_names.length;
    let nrows = this._height;
    console.log(ncols);
    let df = new DataFrame();
    df._width = ncols;
    df._height = nrows;
    df._columns = column_names;
    df._dtypes = new Array(ncols);
    df._data = new FloatProcessor(ncols, nrows);

    column_names.forEach( (heading,x) => {
      let oldx = this._columns.indexOf(heading);
      df._dtypes[x] = this._dtypes[oldx];
      for (let y = 0; y < nrows; y++) {
        let v = this._data.getf(oldx,y);
        df._data.setf(x,y,v);
      }
    });

    return df;
  }

  where(predicate) {
    let df = new DataFrame();
    let ncols = column_names.length;
    let nrows = this._rows;
    df._data = new FloatProcessor(ncols, nrows, this._data.getPixelsCopy() );
    for (let n of column_names) {
      
    }
    return df;
  }

  transpose(index) {
    // TODO
    // Return a new DataFrame/FloatProcessor rotated by 90°
    // Update _rows and _columns.
  }

  describe() {
    // count,mean,std,min,25%,50%,75%,max
  }

  mean(col=-1) {
    if (col === -1) {
    // Compute mean for all the columns
    }
    else {
      return this.column(col).array().reduce( (mean,v) => mean + v,0.0) / this._height;
    }
  }

  std() {
  }

  /**
   * Use for display in console
   */
  toString() {
    let str = 'Not yet implemented';
    
    return str;
  }

  /**
   * Only for debug
   */
  show() {
    let imp = new ImagePlus('DataFrame',this._data);
    imp.show();
  }

  /*
   * @private
   */
  _datatype(v) {
    if (isNaN(v) ) {
      // Boolean?
      if (['true','false'].indexOf(v.toLowerCase()) !== -1) {
        return 1;
      }
      // TODO Date?
      // TODO RGB Color?
      else if (v[0] === '#') {
        return 24;
      }
      // Categorical / String
      else {
        return 8;
      }
    }
    else {
      return 32;
    }
  }

} // End of class DataFrame
