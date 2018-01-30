import * as React from "react";
import "./App.css";
import { DragDropContextProvider } from "react-dnd";
// import HTML5Backend from "react-dnd-html5-backend";
// import TouchBackend from "react-dnd-touch-backend";
import MultiBackend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/lib/HTML5toTouch"; // or any other pipeline

// import SimpleGrid from './components/SimpleGrid';
// import FastGrid from './components/FastGrid';
import NumberGrid from "./components/NumberGrid";
// import Tree from './components/Tree';
import Offspread from "./components/Offspread";

// const  data = require('./stocks.json');
// const treeData = require('./tree.json');

// const touchBackend = TouchBackend({
//   enableMouseEvents: true,
//   enableTouchEvents: true
// });

const touchBackend = MultiBackend(HTML5toTouch);

const viewSampleDefinition = require("./ViewSampleDefinition.json");
const originalDimensions = viewSampleDefinition.dimensions.dimension;

function getReferencedMembers(
  member: any,
  memberNames: Array<string> = []
): Array<string> {
  if (typeof member === "undefined") {
    return memberNames;
  }

  if (member.constructor === Array) {
    for (let i = 0; i < member.length; i++) {
      getReferencedMembers(member[i], memberNames);
    }
  } else {
    memberNames.push(member);
    getReferencedMembers(member.member, memberNames);
  }

  return memberNames;
}

function moveElements(data, old_index, new_index) {
  if (new_index >= data.length) {
    var k = new_index - data.length;
    while (k-- + 1) {
      data.push(undefined);
    }
  }
  data.splice(new_index, 0, data.splice(old_index, 1)[0]);
  return data;
}

class App extends React.Component<{}, {}> {
  state = {
    dimensions: originalDimensions,
    rows: [originalDimensions[0], originalDimensions[1]],
    columns: [originalDimensions[2]]
  };

  swapColumns = (dragging, dropped, before) => {
    let columns = [...this.state.columns];
    const indexX = columns.indexOf(dragging.caption);
    let indexY = columns.indexOf(dropped.caption);

    if (!before) {
      indexY++;
    }

    columns = moveElements(columns, indexX, indexY);

    this.setState({ columns });
  };

  swapRows = (dragging, dropped, before) => {
    let rows = [...this.state.rows];
    const indexX = rows.indexOf(dragging.caption);
    let indexY = rows.indexOf(dropped.caption);

    if (!before) {
      indexY++;
    }

    rows = moveElements(rows, indexX, indexY);

    this.setState({ rows });
  };

  swapRowsWithColumns = () => {
    const { rows, columns } = this.state;
    this.setState({ rows: columns, columns: rows });
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

  swapOffspread = (dragging, dropped, before) => {
    console.log(dragging, dropped, before);

    if (dropped.type === "row") {
      this.setState({ rows: [dragging.dimension] });
    } else {
      this.setState({ columns: [dragging.dimension] });
    }
  };

  componentDidMount() {
    fetch("/tree.json")
      .then(rsp => rsp.json())
      .then(data => this.setState({ treeData: data }));
  }
  render() {
    const { dimensions, rows, columns } = this.state;
    const offspread = dimensions.filter(
      d => rows.indexOf(d) === -1 && columns.indexOf(d) === -1
    );

    const rowMembers = rows.map(row =>
      getReferencedMembers(row.referencedMembers.member)
    );
    let columnsMembers = columns.map(column =>
      getReferencedMembers(column.referencedMembers.member)
    );

    return (
      <div className="App">
        {/* <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button> */}
        {/* <SimpleGrid data={data} /> */}
        {/* <FastGrid data={data} /> */}
        <DragDropContextProvider backend={touchBackend}>
          <div>
            <Offspread
              dimensions={offspread}
              swapOffspread={this.swapOffspread}
            />
            <NumberGrid
              rows={rowMembers}
              columns={columnsMembers}
              swapItems={this.swapItems}
            />
          </div>
        </DragDropContextProvider>
        {/* <Tree data={this.state.treeData} /> */}
      </div>
    );
  }
}

export default App;
