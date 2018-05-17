import * as React from 'react'
import { Slice as ISlice, TodoItem as ITodoItem, Day } from './Data';
import { focusUp, focusDown, focusSlice, focusTodo, createSliceFromTodo, deleteSlice, replaceFocussedSlice, changeTodoItem, createDefaultState, changeDate } from './State';
import { debounce } from 'lodash';
import {omit} from 'lodash'

export type Handlers = StateContainer['handlers']

export type FocusInfo = {type: 'slice', index:number, field:'title'|'time'} | {type: 'todoitem', index:number}

export interface PersistedState {
  days: { [date: string]: Day }
  todos: ITodoItem[]
  focus: FocusInfo
}

export interface State extends PersistedState {
  lastSaved?: Date
  date: string
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
      this.setState(focusUp)
    },

    focusDown: () => {
      this.setState(focusDown)
    },

    focusSlice: (slice: ISlice, field: 'time'|'title') => {
      this.setState(focusSlice(slice, field))
    },

    focusTodo: (todo: ITodoItem) => {
      this.setState(focusTodo(todo))
    },

    createSliceFromTodo: (todo:ITodoItem) => {
      this.setState(createSliceFromTodo(todo))
    },

    changeTodoItem: (todo: ITodoItem) => {
      this.setState(changeTodoItem(todo))
    },

    changeSlice: (slice:ISlice) => {
      this.setState(replaceFocussedSlice(slice))
    },

    deleteSlice: (slice:ISlice) => {
      this.setState(deleteSlice(slice))
    },

    changeDate: (date:string) => {
      this.setState(changeDate(date))
    }
  }

}