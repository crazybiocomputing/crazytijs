# class DataFrame
## constructor 
### `constructor()`
```javascript
let df = new DataFrame();
```
## Properties

###  `headings`
Returns the column headings as a  _Array_.

###  `shape`
Returns the size of the DataFrame as a _Array_ containing the number of rows and of columns, respectively.

## Methods
###  `array()`
Convert **this** DataFrame as a JavaScript _Array_ of _Array_. If the DataFrame is composed of one single column, the resulting _Array_ is transposed and returned as a 1D _Array_. 

###  `column(col_heading)`
Returns the column labeled as `col_heading` in **this** DataFrame.

```javascript
let table = ResultsTable.getResultsTable();
let df = new DataFrame();
df.fromIJ(table);
let areas = df.column('Area');
```

###  `fromCSV(data,sep=',')`
This method loads data from a _String_ containing data in CSV format. The second argument is the separator &mdash; by default, the comma &mdash;.
> **Note**: The first line must contained the column headings. According to ImageJ convention, if the first heading is a space character, it is considered as the row index.

```javascript
const csv = `A,B,C
0,4,8
1,5,9
2,6,10
3,7,11
`;
let df = new DataFrame();
df.fromCSV(csv);
df.index = ['0001','0002','0003','0004'];
console.log(df.shape);
console.log(df.head(3) );
```
Expected result

```
      A    B    C  
0001| 0.00 4.00 8.00 
0002| 1.00 5.00 9.00 
0003| 2.00 6.00 10.00 
```

###  `fromIJ(data_IJ)`
This method loads data from ResultsTable, ImagePlus, ImageStack, ImageProcessor

```javascript
let table = ResultsTable.getResultsTable();
let df = new DataFrame();
df.fromIJ(table);
console.log(table.shape);
```
###  `head(n=5)`
Print in the console the first `n` rows. By default, the first **five** rows are printed.

###  `irow(i)`
Returns the i<sup>th</sup> row as a DataFrame. The first row has an index of 0.

###  `row(row_heading)`
Returns the row labeled as `row_heading`as a DataFrame. In ImageJ Table, the rows are labeled by an increased number starting from `1` .

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

###  `icolumn(i)`
Returns the i<sup>th</sup> column as a DataFrame. The first column has an index of 0.

### `iloc(start_row, start_col, end_row,end_col)`
Returns a sub-area as a DataFrame. The arguments are numeric indexes.

### `loc(start_row, start_col, end_row,end_col)`
Returns a sub-area as a DataFrame. The arguments correspond to the different labels used to define the rows and columns.

###  `select(...col_headings)`
Returns a new DataFrame composed of the selected columns. The columns headings are used.

```javascript
let table = ResultsTable.getResultsTable();
let df = new DataFrame();
df.fromIJ(table);
let centroids = df.select('X','Y');
```

###  `tail(n=5)`
Print in the console the last `n` rows. By default, the last 5 rows are printed.

###  `toString()`
Print in the console all the rows.



