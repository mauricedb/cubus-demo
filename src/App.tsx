import * as React from "react";
import "./App.css";

// import SimpleGrid from './components/SimpleGrid';
// import FastGrid from './components/FastGrid';
import NumberGrid from "./components/NumberGrid";
// import Tree from './components/Tree';

// const  data = require('./stocks.json');
// const treeData = require('./tree.json');

class App extends React.Component<{}, {  }> {
  // state = {
  //   count: 0,
  //   treeData: []
  // };
  reportScrollEvent = (e: any) => {
    // console.log(e)
  }
  
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
        <NumberGrid />
        {/* <Tree data={this.state.treeData} /> */}
      </div>
    );
  }
}

export default App;
