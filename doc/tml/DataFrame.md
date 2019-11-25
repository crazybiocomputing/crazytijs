# class DataFrame
## constructor 
### `constructor()`
```javascript
let df = new DataFrame();
```

##  `fromIJ(data_IJ)`
This method loads data from ResultsTable, ImagePlus, ImageStack, ImageProcessor, TableWindow

```javascript
let table = ResultsTable.getResultsTable();
let df = new DataFrame();
df.fromIJ(table);
console.log(table.shape);
```
##  `shape`
Returns the size of the DataFrame as a _Array_ containing the number of rows and of columns, respectively.

##  `irow(i)`
Returns the i<sup>th</sup> row as a DataFrame. The first row has an index of 0.

##  `row(row_name)`
Returns the row labeled as `row_name`as a DataFrame. In ImageJ Table, the rows are labeled by an increased number starting from `1` .
##  `icolumn(i)`
Returns the i<sup>th</sup> column as a DataFrame. The first column has an index of 0.

##  `column(col_name)`
Returns the column labeled as `rocol_name`as a DataFrame.

## `iloc(start_row, start_col, end_row,end_col)`
Returns a sub-area as a DataFrame. The arguments are numeric indexes.

## `loc(start_row, start_col, end_row,end_col)`
Returns a sub-area as a DataFrame. The arguments correspond to the different labels used to define the rows and columns.



