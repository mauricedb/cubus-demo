import * as React from "react";
import {
  MultiGrid,
  GridCellProps,
  defaultCellRangeRenderer
} from "react-virtualized";
import ColumnHeader from "./ColumnHeader";
import RowHeader from "./RowHeader";

import AppState from "../AppState";

interface FastGridProps {
  rows: any[];
  columns: any[];
  swapItems: Function;
  appState: AppState;
}

interface FastGridState {
  columnWidths: number[];
}

class NumberGrid extends React.PureComponent<FastGridProps, FastGridState> {
  rowStartIndex = 0;
  grid: any = null;

  state = {
    columnWidths: [
      200,
      200,
      200,
      200,
      200,
      200,
      200,
      200,
      200,
      200,
      200,
      200,
      200,
      200,
      200,
      200,
      200
    ]
  };

  updateColumnWidth = e => {
    const { columnWidths } = this.state;

    const { differenceFromInitialOffset, columnIndex } = e.obj;
    console.log("updateColumnWidth", differenceFromInitialOffset.x);

    let width = columnWidths[columnIndex];
    width += differenceFromInitialOffset.x;
    columnWidths[columnIndex] = width;

    // console.table(columnWidths);

    if (this.grid) {
      this.grid.invalidateCellSizeAfterRender();
    }

    this.setState({ columnWidths: [...columnWidths] });
  };

  cellRangeRenderer = e => {
    this.rowStartIndex = e.visibleRowIndices.start;

    const children = defaultCellRangeRenderer(e);

    return children;
  };

  cellRenderer = (e: GridCellProps) => {
    const { columns, rows, swapItems, appState } = this.props;

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
          appState={appState}
          style={e.style}
          swapMember={swapItems}
          dimension={dimension}
          column={column}
          columnIndex={e.columnIndex}
          updateColumnWidth={this.updateColumnWidth}
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
          appState={appState}
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

  componentDidMount() {
    const { columnWidths } = this.state;

    const { columns, rows } = this.props;
    const columnCount = this.getRowCount(columns) + rows.length;

    columnWidths.length = columnCount;

    this.setState({ columnWidths: [...columnWidths] });
  }

  render() {
    const { columnWidths } = this.state;
    const { columns, rows } = this.props;
    const rowCount = this.getRowCount(rows) + columns.length;
    const columnCount = this.getRowCount(columns) + rows.length;
    console.table(columnWidths);

    return (
      <div>
        <MultiGrid
          ref={el => (this.grid = el)}
          cellRangeRenderer={this.cellRangeRenderer}
          cellRenderer={this.cellRenderer}
          height={window.innerHeight - 40}
          width={window.innerWidth}
          rowHeight={20}
          columnWidth={({ index }) => {
            console.log("columnWidth", index, columnWidths[index]);
            return columnWidths[index];
          }}
          rowCount={rowCount}
          columnCount={columnCount}
          fixedRowCount={columns.length}
          fixedColumnCount={rows.length}
          styleTopLeftGrid={{ width: columnWidths[0] + columnWidths[1] }}
          styleBottomLeftGrid={{ width: columnWidths[0] + columnWidths[1] }}
        />
      </div>
    );
  }
}

export default NumberGrid;
