import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();



const style = document.createElement('style')
style.innerHTML = `.row { height: ${new Date().getSeconds()}px; }`
document.head.appendChild(style);
