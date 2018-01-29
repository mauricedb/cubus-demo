import * as React from "react";

import { MultiGrid, GridCellProps } from "react-virtualized";
// import { 
//   ConnectDragSource,
//   // DragDropContext, 
//   DragSource, 
//   DragSourceSpec, 
//   // DragSourceCollector, 
//   DragSourceConnector, 
//   DragSourceMonitor, 
//   // DragElementWrapper,
//   // ConnectDropTarget,
//   // DropTarget,
//   // DropTargetConnector,
//   // DropTargetMonitor,
//   // ClientOffset,
//   // DropTargetSpec 
// } from 'react-dnd';

import GridHeader from './GridHeader';

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

  /* New node from the node well */
// export interface NodeSourceProps {
//   isDragging : boolean;
//   connectDragSource: ConnectDragSource;
// }
// export interface NodeSourceState {
// }
interface FastGridProps {
  // connectDragSource: ConnectDragSource
}

interface FastGridState {
  columnWidths: number[];
}

class FastGrid extends React.PureComponent<FastGridProps, FastGridState> {
  // screenX = 0;
  // grid: MultiGrid | null;

  state = {
    columnWidths: [250, ...columns.map(c => 100)]
  };

  cellRenderer = (e: GridCellProps) => {
    if (e.rowIndex === 0) {
      return (
        <GridHeader key={e.key} caption={columns[e.columnIndex - 1]} style={e.style} />
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
  };

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
