import * as React from "react";

import { MultiGrid, GridCellProps } from "react-virtualized";

interface FastGridProps {
  data: {
    Company: string;
    Industry: string;
  }[];
}

interface FastGridState {
  columnWidths: number[];
}

class FastGrid extends React.PureComponent<FastGridProps, FastGridState> {
  screenX = 0;
  grid: MultiGrid | null;

  state = {
    columnWidths: [50, 50, 300, 300, 300]
  };
  onSplitterDragStart = (e: any) => {
    this.screenX = e.screenX;
    e.dataTransfer.dropEffect = "move";
  };

  onSplitterDragEnd = (e: any) => {
    const delta = e.screenX - this.screenX;
    const columnWidths = [...this.state.columnWidths];
    const columnNr = +e.target.dataset["column"];
    columnWidths[columnNr] += delta;
    this.setState({ columnWidths });
    if (this.grid) {
      this.grid.invalidateCellSizeAfterRender();
    }
  };

  cellRenderer = (e: GridCellProps) => {
    // console.log(e.parent.props.scrollTop);

    if (e.rowIndex === 0) {
      return (
        <div
          className="header"
          key={e.key}
          style={e.style}
          onDragOver={(e: any) => e.preventDefault()}
        >
          {e.columnIndex <= 1
            ? "Row"
            : e.columnIndex === 2 ? "Company" : "Industry"}
          <span
            className="splitter"
            draggable
            onDragStart={this.onSplitterDragStart}
            onDragEnd={this.onSplitterDragEnd}
            data-column={e.columnIndex}
          >
            |
          </span>
        </div>
      );
    }

    const stock = this.props.data[e.rowIndex - 1];
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
    // console.log(e);
  };
  render() {
    return (
      <div>
        <MultiGrid
          ref={grid => (this.grid = grid)}
          cellRenderer={this.cellRenderer}
          height={500}
          width={900}
          rowHeight={20}
          columnWidth={({ index }) => this.state.columnWidths[index]}
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
