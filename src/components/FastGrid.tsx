import * as React from "react";

import { MultiGrid, GridCellProps } from "react-virtualized";

interface SimpleGridProps {
  data: any[];
}

class FastGrid extends React.PureComponent<SimpleGridProps, {}> {
  cellRenderer = (e: GridCellProps) => {
    if (e.rowIndex === 0) {
      return (
        <div className="header" key={e.key} style={e.style}>
          {e.columnIndex === 0
            ? "Row"
            : e.columnIndex === 1 ? "Company" : "Industry"}
        </div>
      );
    }

    const stock = this.props.data[e.rowIndex + 1];
    if (e.columnIndex === 0) {
      return (
        <div key={e.key} style={e.style}>
          {e.rowIndex}
        </div>
      );
    }

    return (
      <div className="cell" key={e.key} style={e.style}>
        {e.columnIndex === 1 ? stock.Company : stock.Industry}
      </div>
    );
  };
  render() {
    return (
      <div>
        <MultiGrid
          cellRenderer={this.cellRenderer}
          height={500}
          width={900}
          rowHeight={20}
          columnWidth={({index}) => index === 0 ? 50: 300}
          rowCount={this.props.data.length + 1}
          columnCount={5}
          fixedRowCount={1}
          fixedColumnCount={1}
          styleTopLeftGrid={{ width: 50 }}
          styleBottomLeftGrid={{ width: 50 }}
        />
      </div>
    );
  }
}

export default FastGrid;
