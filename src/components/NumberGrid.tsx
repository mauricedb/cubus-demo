import * as React from "react";

import { MultiGrid, GridCellProps } from "react-virtualized";

const viewSampleDefinition = require("./../ViewSampleDefinition.json");

const columns: string[] = [];
const rows: string[] = [];

viewSampleDefinition.dimensions.dimension[0].referencedMembers.member[0].member
  .map((m: any) => m.member)
  .forEach((element: any) => {
    element.forEach((el: any) => {
      rows.push(el.name);
    });
  });

viewSampleDefinition.dimensions.dimension[1].referencedMembers.member[0].member
  .map((m: any) => m.member)
  .forEach((element: any) => {
    element.forEach((el: any) => {
      columns.push(el.name);
    });
  });

interface FastGridProps {}

interface FastGridState {
  columnWidths: number[];
}

class FastGrid extends React.PureComponent<FastGridProps, FastGridState> {
  screenX = 0;
  grid: MultiGrid | null;

  state = {
    columnWidths: [...columns.map(c => 250), 250]
  };

  cellRenderer = (e: GridCellProps) => {
    if (e.rowIndex === 0) {
      return (
        <div className="header" key={e.key} style={e.style}>
          {columns[e.columnIndex - 1]}
        </div>
      );
    }

    if (e.columnIndex === 0) {
      return (
        <div className="header" key={e.key} style={e.style}>
          {rows[e.rowIndex - 1]}
        </div>
      );
    }

    return (
      <div className="cell" key={e.key} style={e.style}>
        {`The cell ${e.columnIndex} ${e.rowIndex}`}
      </div>
    );
  }

  render() {
    return (
      <div>
        <MultiGrid
          cellRenderer={this.cellRenderer}
          height={300}
          width={1200}
          rowHeight={20}
          columnWidth={({ index }) => this.state.columnWidths[index]}
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

export default FastGrid;
