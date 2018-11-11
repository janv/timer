import * as React from 'react';
import Main from './Main'
import StateContainer from './StateContainer'
import 'modern-normalize'

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
