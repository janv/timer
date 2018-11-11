import * as React from 'react';
import Main from './Main'
import StateContainer from './StateContainer'
import 'modern-normalize'
import { injectGlobal } from 'emotion';

injectGlobal`
  body, html {
    height: 100%;
  }

  #root {
    height: 100%;
  }
`

class App extends React.Component {
  public render() {
    return (
      <StateContainer>
        { (state, handlers) => ( <Main state={state} handlers={handlers}/>) }
      </StateContainer>
    );
  }
}

export default App;
