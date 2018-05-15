import * as React from 'react'
import { Slice as ISlice, TodoItem as ITodoItem } from './Data';
import { handleFocusUp, handleFocusDown, handleFocusSlice, handleFocusTodo, handleCreateSliceFromTodo, handleDeleteSlice, handleChangeSlice, handleChangeTodoItem, State as PersistedState, createDefaultState } from './State';
import { debounce } from 'lodash';
import {omit} from 'lodash'

export type Handlers = StateContainer['handlers']

export interface State extends PersistedState {
  lastSaved?: Date
}

interface Props {
  children: (state:State, handlers:Handlers) => JSX.Element
}

export default class StateContainer extends React.Component<Props, State> {
  state:State = createDefaultState()

  render() {
    const render = this.props.children
    return render(this.state, this.handlers)
  }

  componentDidMount() {
    this.loadState()
  }

  componentDidUpdate(prevProps:{}, prevState:State) {
    if (prevState !== this.state) {
      this.saveState()
    }
  }

  loadState() {
    const jsonSate = window.localStorage.getItem('timerState');

    try {
      const state:PersistedState = JSON.parse(jsonSate!)
      this.setState(state)
    } catch (e) {
      this.setState(createDefaultState())
    }
  }

  saveState = debounce(() => {
    const pState = omit(this.state, 'lastSaved') as PersistedState
    window.localStorage.setItem('timerState', JSON.stringify(pState))
    this.setState({
      lastSaved: new Date()
    })
  }, 300)

  private handlers = {
    load: () => {
      this.loadState()
    },

    save: () => {
      this.saveState()
    },

    reset: () => {
      this.setState(createDefaultState())
    },

    focusUp: () => {
      this.setState(handleFocusUp)
    },

    focusDown: () => {
      this.setState(handleFocusDown)
    },

    focusSlice: (slice: ISlice, field: 'time'|'title') => {
      this.setState(handleFocusSlice(slice, field))
    },

    focusTodo: (todo: ITodoItem) => {
      this.setState(handleFocusTodo(todo))
    },

    createSliceFromTodo: (todo:ITodoItem) => {
      this.setState(handleCreateSliceFromTodo(todo))
    },

    changeTodoItem: (todo: ITodoItem) => {
      this.setState(handleChangeTodoItem(todo))
    },

    changeSlice: (slice:ISlice) => {
      this.setState(handleChangeSlice(slice))
    },

    deleteSlice: (slice:ISlice) => {
      this.setState(handleDeleteSlice(slice))
    }
  }

}