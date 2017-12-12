import * as React from 'react';
import './App.css';

import SimpleGrid from './components/SimpleGrid';

const  data = require('./stocks.json');

class App extends React.Component<{}, {count: number}>{
  state = {
    count: 0
  }
  reportScrollEvent = (e: any) => {
    console.log(e)
  }
  render() {
    return (
      <div className="App" onScroll={this.reportScrollEvent}>
      <button onClick={() => this.setState({count : this.state.count + 1})}>Click me</button>
        <SimpleGrid data={data} />
      </div>
    );
  }
}

export default App;
