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
 
// Data Reader
export const csv = (filename,delimiter = ',') => {
  const path = java.nio.file.Paths.get(filename);
  const rows = Java.from(java.nio.file.Files.readAllLines(path));
  
  // Extract the headers
  let keys = rows[0].split(delimiter);
  if (keys[0] === ' ') {
    keys[0] = 'ID';
  }

  // Split rows
  let table = rows.slice(1).map( (row,index) => {
    let cells = row.split(delimiter);
    let v = {};
    keys.forEach( (key,j) => v[key] = isNaN(cells[j]) ? cells[j] : parseFloat(cells[j]) );
    return v;
  });
  return table;
}


