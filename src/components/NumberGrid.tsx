import * as React from "react";
import {
  MultiGrid,
  GridCellProps,
  defaultCellRangeRenderer
} from "react-virtualized";
import ColumnHeader from "./ColumnHeader";
import RowHeader from "./RowHeader";

interface FastGridProps {
  rows: any[];
  columns: any[];
  swapItems: Function;
}

interface FastGridState {}

class NumberGrid extends React.PureComponent<FastGridProps, FastGridState> {
  rowStartIndex = 0;

  state = {
    // columnWidths: [250, ...initialColumns.map(c => 100)],
  };

  cellRangeRenderer = e => {
    this.rowStartIndex = e.rowStartIndex;

    const children = defaultCellRangeRenderer(e);
    // console.log(e.rowStartIndex)

    // this.rowStartIndex = 999999999;

    return children;
  };

  cellRenderer = (e: GridCellProps) => {
    const { columns, rows, swapItems } = this.props;

    var g: any = e.parent;
    if (g.getOffsetForCell) {
      var o = g.getOffsetForCell({
        columnIndex: e.columnIndex,
        rowIndex: e.rowIndex
      });
      console.log(o);
    }

    if (e.rowIndex < columns.length) {
      let column: any;
      let columnFactor = 1;
      for (var i = e.rowIndex + 1; i < columns.length; i++) {
        columnFactor *= columns[i].length;
      }

      let index = Math.floor((e.columnIndex - rows.length) / columnFactor);
      index = index % columns[e.rowIndex].length;
      column = columns[e.rowIndex][index];

      const caption = e.columnIndex < rows.length ? "" : column.name;
      const dimension = e.columnIndex < rows.length ? {} : column.dimension;

      return (
        <ColumnHeader
          key={e.key}
          caption={caption}
          style={e.style}
          swapMember={swapItems}
          dimension={dimension}
          column={column}
        />
      );
    }

    if (e.columnIndex < rows.length) {
      let row: any;
      let rowFactor = 1;
      for (var i = e.columnIndex + 1; i < rows.length; i++) {
        rowFactor *= rows[i].length;
      }

      let index = Math.floor((e.rowIndex - columns.length) / rowFactor);
      index = index % rows[e.columnIndex].length;
      row = rows[e.columnIndex][index];
      let rowName = row.name;

      if (
        e.rowIndex > columns.length &&
        e.rowIndex > this.rowStartIndex + columns.length
      ) {
        let prevIndex = Math.floor(
          (e.rowIndex - 1 - columns.length) / rowFactor
        );
        prevIndex = prevIndex % rows[e.columnIndex].length;
        const prevRow = rows[e.columnIndex][prevIndex];

        if (prevRow.name === rowName) {
          rowName = "";
        }
      }

      return (
        <RowHeader
          key={e.key}
          style={e.style}
          caption={rowName}
          swapMember={swapItems}
          dimension={row.dimension}
          row={row}
        />
      );
    }

    return (
      <div className="cell" key={e.key} style={e.style}>
        {Math.round(Math.random() * 10000) / 2}
      </div>
    );
  };

  getRowCount(rows) {
    return rows.reduce((p, c) => c.length * p, 1);
  }
  render() {
    const { columns, rows } = this.props;
    const rowCount = this.getRowCount(rows) + columns.length;
    const columnCount = this.getRowCount(columns) + rows.length;
    // console.log(columnCount);
    return (
      <div>
        <MultiGrid
          cellRangeRenderer={this.cellRangeRenderer}
          cellRenderer={this.cellRenderer}
          height={window.innerHeight - 25}
          width={window.innerWidth}
          rowHeight={20}
          columnWidth={({ index }) => 200}
          rowCount={rowCount}
          columnCount={columnCount}
          fixedRowCount={columns.length}
          fixedColumnCount={rows.length}
          styleTopLeftGrid={{ width: rows.length * 200 }}
          styleBottomLeftGrid={{ width: rows.length * 200 }}
        />
      </div>
    );
  }
}

export default NumberGrid;
