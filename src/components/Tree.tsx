import * as React from "react";

import {
  Table,
  Column,
  Index,
  RowMouseEventHandlerParams,
  //   TableCellDataGetterParams,
  TableCellProps
} from "react-virtualized";

interface TreeData {
  id: string;
  expanded: boolean;
  indentation: number;
  name: string;
  company: string;
  friends: TreeData[];
}

interface TreeProps {
  data: TreeData[];
}

interface TreeState {
  flatTree: TreeData[];
  selected: any;
}

class Tree extends React.Component<TreeProps, TreeState> {
  state = {
    flatTree: [],
    selected: {}
  };

  getFlatTree(tree: TreeData[], indentation = 0) {
    const data: TreeData[] = [];
    tree.forEach(item => {
      item.indentation = indentation;
      data.push(item);
      if (item.expanded) {
        const children = this.getFlatTree(item.friends, indentation + 1);
        data.push(...children);
      }
    });

    return data;
  }

  cellRenderer = (e: TableCellProps) => {
    const row: any = e.rowData;
    let expander = null;
    let indentation = row.indentation * 25;

    if (row.friends.length) {
      expander = (
        <span onClick={e => this.onExpanderClick(e, row)}>
          {row.expanded ? " - " : " + "}
        </span>
      );
    } else {
      indentation += 16;
    }

    let isSelected = !!this.state.selected[row.id];

    return (
      <div style={{ marginLeft: indentation }}>
        {expander}
        <span className={isSelected ? "selected" : ""}>{row[e.dataKey]}</span>
      </div>
    );
  };

  onExpanderClick = (e: React.MouseEvent<{}>, data: TreeData) => {
    e.stopPropagation();
    data.expanded = !data.expanded;
    this.setState({ flatTree: this.getFlatTree(this.props.data) });
  };

  onRowClick = (e: RowMouseEventHandlerParams) => {
    const data: any = e.rowData;
    let selected = null;
    if (!this.state.selected[data.id]) {
      selected = { ...this.state.selected, [data.id]: data };
    } else {
      selected = { ...this.state.selected, [data.id]: null };
    }
    this.setState({ selected });
  };

  rowGetter = (e: Index) => {
    const flatTree = this.getFlatTree(this.props.data);
    return flatTree[e.index];
  };
  componentWillMount() {
    this.setState({ flatTree: this.getFlatTree(this.props.data) });
  }
  componentWillReceiveProps(newProps: TreeProps) {
    this.setState({ flatTree: this.getFlatTree(newProps.data) });
  }
  render() {
    return (
      <div>
        <Table
          height={500}
          width={800}
          rowHeight={20}
          rowCount={this.state.flatTree.length}
          headerHeight={20}
          rowGetter={this.rowGetter}
          onRowClick={this.onRowClick}
        >
          <Column dataKey="name" cellRenderer={this.cellRenderer} width={90} />
        </Table>
      </div>
    );
  }
}

// cellDataGetter={this.cellDataGetter}

export default Tree;
