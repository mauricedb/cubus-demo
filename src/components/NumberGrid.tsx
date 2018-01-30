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
        e.columnIndex === 0 ? "" : columns[e.columnIndex - 1].name;
      return (
        <ColumnHeader
          key={e.key}
          caption={caption}
          style={e.style}
          swapMember={swapItems}
        />
      );
    }

    if (e.columnIndex === 0) {
      return (
        <RowHeader
          key={e.key}
          style={e.style}
          caption={rows[e.rowIndex - 1].name}
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

  render() {
    const { columns, rows } = this.props;

    return (
      <div>
        <MultiGrid
          cellRenderer={this.cellRenderer}
          height={window.innerHeight - 25}
          width={window.innerWidth}
          rowHeight={20}
          columnWidth={({ index }) => 200}
          rowCount={rows.length + 1}
          columnCount={columns.length + 1}
          fixedRowCount={1}
          fixedColumnCount={1}
          styleTopLeftGrid={{ width: 250 }}
          styleBottomLeftGrid={{ width: 250 }}
        />
      </div>
    );
  }
}

export default NumberGrid;
