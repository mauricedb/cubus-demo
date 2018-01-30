import * as React from "react";
import { MultiGrid, GridCellProps } from "react-virtualized";
import ColumnHeader from "./ColumnHeader";
import RowHeader from "./RowHeader";
// const viewSampleDefinition = require("./../ViewSampleDefinition.json");

// const initialColumns: string[] = [];
// const initialRows: string[] = [];

// viewSampleDefinition.dimensions.dimension[0].referencedMembers.member[0].member
//   .map((m: any) => m.member)
//   .forEach((element: any) => {
//     element.forEach((el: any) => {
//       initialRows.push(el.name);
//     });
//   });

// viewSampleDefinition.dimensions.dimension[1].referencedMembers.member[0].member
//   .map((m: any) => m.member)
//   .forEach((element: any) => {
//     element.forEach((el: any) => {
//       initialColumns.push(el.name);
//     });
//   });

// function moveElements(data, old_index, new_index) {
//   if (new_index >= data.length) {
//     var k = new_index - data.length;
//     while (k-- + 1) {
//       data.push(undefined);
//     }
//   }
//   data.splice(new_index, 0, data.splice(old_index, 1)[0]);
//   return data;
// }

interface FastGridProps {
  rows: any[];
  columns: any[];

}

interface FastGridState {
  // columnWidths: number[];
  // columns: string[];
  // rows: string[];
}

class NumberGrid extends React.PureComponent<FastGridProps, FastGridState> {
  state = {
    // columnWidths: [250, ...initialColumns.map(c => 100)],
    // columns: initialColumns,
    // rows: initialRows
  };

  swapItems = (dragging, dropped, before) => {
    if (dragging.type !== dropped.type) {
      this.swapRowsWithColumns();
    } else if (dragging.type === "column") {
      this.swapColumns(dragging, dropped, before);
    } else {
      this.swapRows(dragging, dropped, before);
    }
  };

  swapColumns = (dragging, dropped, before) => {
    // let columns = [...this.state.columns];
    // const indexX = columns.indexOf(dragging.caption);
    // let indexY = columns.indexOf(dropped.caption);

    // if (!before) {
    //   indexY++;
    // }

    // columns = moveElements(columns, indexX, indexY);

    // this.setState({ columns });
  };

  swapRows = (dragging, dropped, before) => {
    // let rows = [...this.state.rows];
    // const indexX = rows.indexOf(dragging.caption);
    // let indexY = rows.indexOf(dropped.caption);

    // if (!before) {
    //   indexY++;
    // }

    // rows = moveElements(rows, indexX, indexY);

    // this.setState({ rows });
  };

  swapRowsWithColumns = () => {
    const { rows, columns } = this.props;
    this.setState({ rows: columns, columns: rows });
  };

  cellRenderer = (e: GridCellProps) => {
    const { columns, rows } = this.props;

    if (e.rowIndex === 0) {
      const caption = e.columnIndex === 0 ? '' : columns[e.columnIndex - 1].name;
      return (
        <ColumnHeader
          key={e.key}
          caption={caption}
          style={e.style}
          swapMember={this.swapItems}
        />
      );
    }

    if (e.columnIndex === 0) {
      return (
        <RowHeader
          key={e.key}
          style={e.style}
          caption={rows[e.rowIndex - 1].name}
          swapMember={this.swapItems}
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
