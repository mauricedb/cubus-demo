import * as React from "react";
import { MultiGrid, GridCellProps } from "react-virtualized";
import ColumnHeader from "./ColumnHeader";
import RowHeader from "./RowHeader";

interface FastGridProps {
  rows: any[];
  columns: any[];
  swapItems: Function;
}

interface FastGridState {}

class NumberGrid extends React.PureComponent<FastGridProps, FastGridState> {
  state = {
    // columnWidths: [250, ...initialColumns.map(c => 100)],
  };

  cellRenderer = (e: GridCellProps) => {
    const { columns, rows, swapItems } = this.props;

    if (e.rowIndex === 0) {
      const caption =
        e.columnIndex < rows.length
          ? ""
          : columns[e.columnIndex - rows.length].name;
      return (
        <ColumnHeader
          key={e.key}
          caption={caption}
          style={e.style}
          swapMember={swapItems}
        />
      );
    }

    if (e.columnIndex < rows.length) {
      let row;
      if (e.columnIndex === 0) {
        const index = Math.floor((e.rowIndex - 1) / rows[1].length)
        row = rows[0][index];
      } else if (e.columnIndex === 1){
        const index = Math.floor((e.rowIndex - 1) % rows[1].length)
        row = rows[1][index];
      }

      return (
        <RowHeader
          key={e.key}
          style={e.style}
          caption={row.name}
          swapMember={swapItems}
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
    return rows[0].length * rows[1].length;
  }
  render() {
    const { columns, rows } = this.props;
    const rowCount = this.getRowCount(rows);
    console.log(rowCount);
    return (
      <div>
        <MultiGrid
          cellRenderer={this.cellRenderer}
          height={window.innerHeight - 25}
          width={window.innerWidth}
          rowHeight={20}
          columnWidth={({ index }) => 200}
          rowCount={rowCount}
          columnCount={columns.length + rows.length}
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
