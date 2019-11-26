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

  static get NUMBER() {
    return  42;
  }

  static alphabet() {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
    this._rows = rows.map( (v) => v); // Copy
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

  fromCSV(data,sep=',') {
    // TODO 
    let flagIJ = false;
    let table = data.split('\n');
    this._columns = table[0].split(sep);
    if (this._columns[0].trim().length === 0) {
      this._columns = this._columns.slice(1);
      flagIJ = true;
    }
    this._width = this._columns.length;
    this._height = table.length;
    this._data = new FloatProcessor(this._width,this._height);
    this._dtypes = Array.from({length: table.length}, (_,i) => DataFrame.NUMBER);
    if (flagIJ) {
      this._rows   = Array.from({length: table.length}, (_,i) => i + 1);
    }
    else {
      this._rows   = Array.from({length: table.length}, (_,i) => 0);
    }

    // Fill the data
    for (let y = 1; y < table.length; y++) {
      let row = table[y].split(sep);
      for (let x = 0; x < row.length; x++) {
        // TODO categorical
        let v = (isNaN(row[x])) ? -1: parseFloat(row[x]);
        this._data.setf(x,y - 1,v);
      }
    }
  }


  fromStack(stack) {
    let w = stack.getWidth();
    let h = stack.getHeight();
    let num = stack.getSize();

    this._data = new FloatProcessor(w * h, num);
    this._width = w * h;
    this._height = num;
    this._dtypes = Array.from({length: w}, _ => stack.getBitDepth());
    this._rows   = Array.from({length: this._height}, (_,i) => i + 1);
    this._columns = Array.from({length: this._width}, (_,i) => i); // TODO A,B,....,Z, AA, ...AZ,BA, BB, ... ZZ, AAA, ... ZZZ
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
    this._dtypes = Array.from({length: w}, _ => ip.getBitDepth());
    this._rows   = Array.from({length: this._height}, (i,v) => i);
    this._columns = Array.from({length: this._width}, (i,v) => i);
    // Copy Processor
    for (let i = 0; i < w * h ; i++) {
      this._data.setf(i, ip.getf(i) );
    }
  }

  fromResults(table) {
    // HACK console.log('Results');
    // Step #1: Read the ImageJ column headings
    // In a ResultsTable, the first column is the row index and must be removed
    this._columns = table.getColumnHeadings().split(/[\t,]+/).slice(1);
    this._rows   = Array.from({length: table.getColumn(0).length}, (_,i) => i + 1);
    console.info(JSON.stringify(this._columns) );
    // Step #2: Guess types of columns
    this._dtypes = Array.from({length: this._columns.length}, _ => DataFrame.NUMBER);

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
    if (this._width === 1) {
      return tmp[0];
    }
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
    throw('Not Yet Implemented');
    if (this._categorical.includes(categories)) {
    }
  }

  icolumn(col) {
    let index = col;
    let df = new DataFrame();
    df._width = 1;
    df._height = this._height;
    df._data = new FloatProcessor(1,this._height);
    df._columns = [this._columns[index]]; 
    df._rows = this._rows.map( r => r); // Copy
    df._dtypes = [this._dtypes[index]];
    for (let y = 0; y < this._height; y++) {
      df._data.setf(0,y,this._data.getf(index,y));
    }
    // TODO df._dtypes = this.dtypes.map( t => t);
    return df;
  }


  column(col) {
    // TODO
    let index = this._columns.indexOf(col);
    if (index !== -1) {
      return this.icolumn(index);
    }
    else {
      throw( 'ERR: Unknown column heading');
    }
  }


  /**
   * Get sub-dataframe 
   */
  iloc(irows,icols) {
    // TODO
    let e = (end === -1) ? this._height - 1 : end;
    let w = (icol_end === -1) ? this._width - icol_start + 1 : icol_end - icol_start + 1;
    let h = (irow_end === -1) ? this._height - irow_start + 1 : irow_end - irow_start + 1;
    let ip = this._data;
    ip.setRoi(0,start,w,h);
    df._data = ip.crop();
    // Update
    df._columns = this._columns.filter( (_,i) => i >= icol_start && i <= icol_end);
    df._rows = this._rows.filter( (_,i) => ( i >= irow_start && i <= irow_end) );
    df._dtypes = this._dtypes.filter( (_,i) => i >= icol_start && i <= icol_end);

    return df;
  }

  /**
   * Get sub-dataframe
   */
  loc(row_start,row_end,col_start,col_end) {
    throw('Not Yet Implemented');
  }

  /**
   * Get row from row index starting from 0 to length - 1
   */
  irow(i) {
    // TODO
    let df = new DataFrame();
    // Use setRoi() and crop()
    // let ip = this._data;
    // ip.setRoi(0,i,this._width,1);
    // df._data = ip.crop();
    let _row = [];
    for (let x = 0; x < this._width; x++) {
      _row.push(this._data.getf(x,index));
    }
    // HACK  console.log(_row.length);
    // NASHORN Trick
    df._data = new FloatProcessor(this._width, 1, Java.to(_row, "float[]") );
    df._columns = this._columns.map( c => c);
    df._rows = (this._rows === undefined) ? index : [this._rows[index]];
    df._dtypes = this._dtypes.map( t => t);
    return df;
  }

  /**
   * Get row from row name
   */
  row(row_name) {
    // TODO Get row number from index
    let i = this._rows.indexOf(row_name);
    if (i !== -1) {
      return irow(i);
    }
    else {
      throw( 'ERR: Unknown row index/name');
    }
  }

  irows(...indices) {
    // TODO
    let indexes;
    if ( isNaN(indices[0]) && Array.isArray(indices[0])) {
      indexes = indices[0];
    }
    else {
      indexes = indices;
    }
    let df = new DataFrame();
    df._data = new FloatProcessor(this._width, indexes.length);
    df._width = this._width;
    df._height = indexes.length;
    df._rows = new Array(indexes.length);
    df._columns = this._columns.map( c => c);
    df._dtypes = this._dtypes.map( t => t);

    for (let i=0; i < indexes.length; i++) {
      let y = indexes[i];
      for (let x = 0; x < this._width; x++) {
        df._data.setf(x,i, this._data.getf(x,y) );
      }
      // Update
      df._rows[i] = this._rows[y];
    }
    return df;
  }

  rows(...headings) {
    let indexes;
    if ( isNaN(headings[0]) && Array.isArray(headings[0])) {
      indexes = headings[0];
    }
    else {
      indexes = headings;
    }
    let indices = indexes.map( (heading) => this._rows.indexOf(heading) );
    this.irows(...indices);
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

  select(...column_headings) {
    let ncols = column_headings.length;
    let nrows = this._height;
    // HACK console.log(ncols);
    let df = new DataFrame();
    df._width = ncols;
    df._height = nrows;
    df._columns = column_headings;
    df._dtypes = new Array(ncols);
    df._data = new FloatProcessor(ncols, nrows);

    column_headings.forEach( (heading,x) => {
      let oldx = this._columns.indexOf(heading);
      df._dtypes[x] = this._dtypes[oldx];
      for (let y = 0; y < nrows; y++) {
        let v = this._data.getf(oldx,y);
        df._data.setf(x,y,v);
      }
    });

    return df;
  }

  /**
   * Select rows depending of the `predicate` function
   */
  where(predicate) {

    // TODO
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
    // Return a new DataFrame/FloatProcessor 

    // Update _rows and _columns.
    throw('Not Yet Implemented');
  }

  describe() {
    // count,mean,std,min,25%,50%,75%,max
    throw('Not Yet Implemented');
  }

  mean(col=-1) {
    if (col === -1) {
    // Compute mean for all the columns
    throw('Not Yet Implemented');
    }
    else {
      return this.column(col).array().reduce( (mean,v) => mean + v,0.0) / this._height;
    }
  }

  std() {
    throw('Not Yet Implemented');
  }

  /**
   * Print in console the first `n` rows
   */
  head(n=5) {
    return this.toString(n);
  }

  /**
   * Print in console the last `n` rows
   */
  tail(n=5) {
    return this.toString(-n);
  }

  /**
   * Print in console
   */
  toString(n=0) {
    let start = (n < 0) ? Math.max(0,this._height + n) : 0;
    let nrows = (n <= 0) ? this._height : n;

    let max_row_length = this._rows[this._rows.length - 1].toString().length;
    let str = new Array(max_row_length + 2).fill(' ').join(''); // from({length:max_row_length + 2}, _ => ' ').join('');
    this._columns.forEach( (head) => str += head + '  ');
    str +='\n';
    for (let i=start; i < nrows; i++) {
      str += this._rows[i] + '| ';
      for (let x = 0; x < this._width; x++) {
        str += this._data.getf(x,i).toFixed(2) + ' ';
      }
      str +='\n';
    }

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
