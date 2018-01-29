import * as React from "react";
import { MultiGrid, GridCellProps } from "react-virtualized";
import GridHeader from "./GridHeader";
const viewSampleDefinition = require("./../ViewSampleDefinition.json");

const initialColumns: string[] = [];
const initialRows: string[] = [];

viewSampleDefinition.dimensions.dimension[0].referencedMembers.member[0].member
  .map((m: any) => m.member)
  .forEach((element: any) => {
    element.forEach((el: any) => {
      initialRows.push(el.name);
    });
  });

viewSampleDefinition.dimensions.dimension[1].referencedMembers.member[0].member
  .map((m: any) => m.member)
  .forEach((element: any) => {
    element.forEach((el: any) => {
      initialColumns.push(el.name);
    });
  });

interface FastGridProps {}

interface FastGridState {
  columnWidths: number[];
  columns: string[];
  rows: string[];
}

class FastGrid extends React.PureComponent<FastGridProps, FastGridState> {
  state = {
    columnWidths: [250, ...initialColumns.map(c => 100)],
    columns: initialColumns,
    rows: initialRows
  };

  swapColumns = (x, y) => {
    const columns = [...this.state.columns];
    const indexX = columns.indexOf(x);
    const indexY = columns.indexOf(y);
    columns[indexX] = y;
    columns[indexY] = x;
    this.setState({ columns });
  }

  cellRenderer = (e: GridCellProps) => {
    const { columns, rows } = this.state;

    if (e.rowIndex === 0) {
      return (
        <GridHeader
          key={e.key}
          caption={columns[e.columnIndex - 1]}
          style={e.style}
          swapMember={this.swapColumns}
        />
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
        {Math.round(Math.random() * 10000) / 2}
      </div>
    );
  }

  render() {
    const { columns, rows } = this.state;

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

// let nodeSourceSpec: DragSourceSpec<FastGridProps> = {
//   beginDrag: (props: FastGridProps) => ({}),

// };

// // Collect: Put drag state into props
// let nodeSourceCollector = (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
//     return {
//       connectDragSource: connect.dragSource(),
//       isDragging: monitor.isDragging()
//   }
// };

// @DragSource("new-node", nodeSourceSpec, nodeSourceCollector)
// class FastGrid2 extends React.PureComponent<FastGridProps, {}> {
//   render() {
//     const { connectDragSource } = this.props;
//     return connectDragSource(<FastGrid connectDragSource={connectDragSource}  />);
//   }
// }

export default FastGrid;
