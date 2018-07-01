import * as React from 'react'
import { Slice as ISlice, TodoItem as ITodoItem, Day, Slice, Time } from './Data';
import { focusUp, focusDown, focusSlice, focusTodo, createSliceFromTodo, deleteSlice, updateSlice, changeTodoItem, createDefaultState, changeDate } from './State';
import { debounce } from 'lodash';
import {omit} from 'lodash'

export type Handlers = StateContainer['handlers']

export type FocusInfo = {type: 'slice', id:string, field:'title'|'time'}
                      | {type: 'todoitem', id:string}

export interface PersistedState {
  slices: Slice[]
  todos: ITodoItem[]
  focus: FocusInfo
}

export interface State extends PersistedState {
  lastSaved?: Date
  date: Day
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
    window.addEventListener('storage', this.handleStorageEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.handleStorageEvent);
  }

  componentDidUpdate(prevProps:{}, prevState:State) {
    if (prevState.slices !== this.state.slices || prevState.todos !== this.state.todos) {
      this.saveState()
    }
  }

  loadState() {
    const jsonSate = window.localStorage.getItem('timerState');

    try {
      const state:PersistedState = JSON.parse(jsonSate!, (k, v) => {
        console.log('revive', k, v)
        if (v._isTime) {
          console.log('returning Time')
          return Time.fromJSON(v)
        }
        if (v._isDay) {
          console.log('returning Day')
          return Day.fromJSON(v)
        }
        return v
      })
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

  handleStorageEvent = (e:StorageEvent) => {
    if (e.key === 'timerState') {
      this.loadState()
    }
  }

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
      console.log('Focus slice %o, %o', slice, field)
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
      this.setState(updateSlice(slice))
    },

    deleteSlice: (slice:ISlice) => {
      this.setState(deleteSlice(slice))
    },

    changeDate: (date:Day) => {
      this.setState(changeDate(date))
    }
  }

}