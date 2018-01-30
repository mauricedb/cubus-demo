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

function getReferencedMembers(member: any, memberNames: Array<string> = []): Array<string> {
  if (typeof (member) === 'undefined'){
      return memberNames;
  }

  if (member.constructor === Array) {
      for (let i = 0; i < member.length; i++) {
          getReferencedMembers(member[i], memberNames);
      }
  } else {
      memberNames.push(member)
      getReferencedMembers(member.member, memberNames);
  }

  return memberNames;

}
class App extends React.Component<{}, {}> {
  state = {
    dimensions: originalDimensions,
    rows: [originalDimensions[0]],
    columns: [originalDimensions[1]]
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
    let rowMembers = getReferencedMembers(rows[0].referencedMembers.member);
    let columnsMembers = getReferencedMembers(columns[0].referencedMembers.member);

    return (
      <div className="App">
        {/* <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button> */}
        {/* <SimpleGrid data={data} /> */}
        {/* <FastGrid data={data} /> */}
        <DragDropContextProvider backend={touchBackend}>
          <div>
            <Offspread dimensions={offspread} />
            <NumberGrid
              rows={rowMembers}
              columns={columnsMembers}
            />
          </div>
        </DragDropContextProvider>
        {/* <Tree data={this.state.treeData} /> */}
      </div>
    );
  }
}

export default App;
