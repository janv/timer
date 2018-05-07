import * as React from 'react';
import {Provider as StyleProvider} from 'rebass-emotion'
import Main from './Main'
import './App.css';

import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <StyleProvider>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <Main/>
          <p className="App-intro">
            To get started, edit <code>src/App.tsx</code> and save to reload.
          </p>
        </div>
      </StyleProvider>
    );
  }
}

export default App;
