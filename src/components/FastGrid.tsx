import * as React from "react";

import { MultiGrid, GridCellProps } from "react-virtualized";

interface SimpleGridProps {
  data: any[];
}

class FastGrid extends React.PureComponent<SimpleGridProps, {}> {
  cellRenderer = (e: GridCellProps) => {
    // console.log(e.parent.props.scrollTop);

    if (e.rowIndex === 0) {
      return (
        <div className="header" key={e.key} style={e.style}>
          {e.columnIndex <= 1
            ? "Row"
            : e.columnIndex === 2 ? "Company" : "Industry"}
            <span className="splitter" onDragEnd={e => console.log(e)}>&nbsp;&nbsp;|&nbsp;&nbsp; </span>
        </div>
      );
    }

    const stock = this.props.data[e.rowIndex + 1];
    if (e.columnIndex === 0) {
      if (e.rowIndex % 10 !== 0) {
        return <div key={e.key} style={e.style} />;
      }

      return (
        <div key={e.key} style={e.style}>
          {e.rowIndex}
        </div>
      );
    }

    if (e.columnIndex === 1) {
      return (
        <div key={e.key} style={e.style}>
          {e.rowIndex}
        </div>
      );
    }

    return (
      <div className="cell" key={e.key} style={e.style}>
        {e.columnIndex === 2 ? stock.Company : stock.Industry}
      </div>
    );
  };

  onScroll = (e: any) => {
    console.log(e);
  };
  render() {
    return (
      <div>
        <MultiGrid
          cellRenderer={this.cellRenderer}
          height={500}
          width={900}
          rowHeight={20}
          columnWidth={({ index }) => (index === 0 ? 50 : 300)}
          rowCount={this.props.data.length + 1}
          columnCount={5}
          fixedRowCount={1}
          fixedColumnCount={1}
          styleTopLeftGrid={{ width: 50 }}
          styleBottomLeftGrid={{ width: 50 }}
          onScroll={this.onScroll}
        />
      </div>
    );
  }
}

export default FastGrid;
