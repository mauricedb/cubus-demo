import * as React from "react";
import "./App.css";
import { DragDropContextProvider } from "react-dnd";
// import HTML5Backend from "react-dnd-html5-backend";
// import TouchBackend from "react-dnd-touch-backend";
import MultiBackend from 'react-dnd-multi-backend';
  import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'; // or any other pipeline

// import SimpleGrid from './components/SimpleGrid';
// import FastGrid from './components/FastGrid';
import NumberGrid from "./components/NumberGrid";
// import Tree from './components/Tree';

// const  data = require('./stocks.json');
// const treeData = require('./tree.json');

// const touchBackend = TouchBackend({
//   enableMouseEvents: true,
//   enableTouchEvents: true
// });

const touchBackend = MultiBackend(HTML5toTouch)

class App extends React.Component<{}, {}> {
  // state = {
  //   count: 0,
  //   treeData: []
  // };
  reportScrollEvent = (e: any) => {
    // console.log(e)
  };

  componentDidMount() {
    fetch("/tree.json")
      .then(rsp => rsp.json())
      .then(data => this.setState({ treeData: data }));
  }
  render() {
    return (
      <div className="App" onScroll={this.reportScrollEvent}>
        {/* <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button> */}
        {/* <SimpleGrid data={data} /> */}
        {/* <FastGrid data={data} /> */}
        <DragDropContextProvider backend={touchBackend}>
          <NumberGrid />
        </DragDropContextProvider>
        {/* <Tree data={this.state.treeData} /> */}
      </div>
    );
  }
}

export default App;
