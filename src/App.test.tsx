import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import App from './App';
import SimpleGrid from './components/SimpleGrid'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SimpleGrid data={[]} />, div);
});



it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SimpleGrid data={[{_id: {$oid: 1}}]} />, div);
});
