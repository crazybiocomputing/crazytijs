# class DataFrame
## constructor 
### `constructor()`
```javascript
let df = new DataFrame();
```
## Properties

###  `headings`
Returns the column headings as a _Array_.

###  `shape`
Returns the size of the DataFrame as a _Array_ containing the number of rows and of columns, respectively.

## Methods
###  `array()`
Convert the DataFrame as a _Array_. 

###  `fromIJ(data_IJ)`
This method loads data from ResultsTable, ImagePlus, ImageStack, ImageProcessor

```javascript
let table = ResultsTable.getResultsTable();
let df = new DataFrame();
df.fromIJ(table);
console.log(table.shape);
```


###  `head(n=5)`
Print in the console the first `n` rows.

###  `irow(i)`
Returns the i<sup>th</sup> row as a DataFrame. The first row has an index of 0.

###  `irows(i0,i1,..., in)`
Returns a DataFrame containing the rows defined by their indexes i<sub>0</sub>,i<sub>1</sub>,..., i<sub>n</sub>. The first row has an index of 0.
An alternative way is to use a _Array_ of indexes.

```javascript
let table = ResultsTable.getResultsTable();
let df = new DataFrame();
df.fromIJ(table);
// In ImageJ Results table, that corresponds to the rows labeled 1,3,5.
let newdf = irows(0,2,4);
// In ImageJ Results table, that corresponds to the rows labeled 2,4,6.
let otherdf = irows([1,3,5]);
```

###  `row(row_name)`
Returns the row labeled as `row_name`as a DataFrame. In ImageJ Table, the rows are labeled by an increased number starting from `1` .

###  `icolumn(i)`
Returns the i<sup>th</sup> column as a DataFrame. The first column has an index of 0.

###  `column(col_name)`
Returns the column labeled as `rcol_name` in **this** DataFrame.

```javascript
let table = ResultsTable.getResultsTable();
let df = new DataFrame();
df.fromIJ(table);
let areas = df.column('Area');
```

### `iloc(start_row, start_col, end_row,end_col)`
Returns a sub-area as a DataFrame. The arguments are numeric indexes.

### `loc(start_row, start_col, end_row,end_col)`
Returns a sub-area as a DataFrame. The arguments correspond to the different labels used to define the rows and columns.

###  `select(...col_names)`
Returns a new DataFrame composed of the selected columns. The columns labels are used.

```javascript
let table = ResultsTable.getResultsTable();
let df = new DataFrame();
df.fromIJ(table);
let centroids = df.select('X','Y');
```

###  `tail(n=5)`
Print in the console the last `n` rows.

###  `toString()`
Print in the console all the rows.



