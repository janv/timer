import { TodoItem as ITodoItem, TodoItem, Slice, appendSlice, createDays } from './Data';
import { setIn, splice } from './util/icepick';
import { State, FocusInfo } from './StateContainer';
import { findKey } from 'lodash';


export function createDefaultState():State {
  const days = createDays()
  return {
    days,
    currentDay: Object.values(days)[0],
    todos: [{title: 'Standup'}, {title: 'Lunch'}],
    focus: {type: 'todoitem', index: 0}
  }
}

export function handleFocusUp(state:State) {
  const f = state.focus
  if (f.type === 'slice' && f.index === 0) return null;
  if (f.type === 'todoitem' && f.index === 0) {
    if (state.currentDay.slices.length > 0) {
      return ({
        focus: {type: 'slice', field:'title', index:state.currentDay.slices.length-1}
      } as Pick<State, 'focus'>)
    } else {
      return null
    }
  }
  return ({
    focus: {...f, index: f.index-1}
  } as Pick<State, 'focus'>)
}

export function handleFocusDown(state:State):Pick<State, never>|null {
    const f = state.focus
    if (f.type === 'todoitem' && f.index === state.todos.length-1) {
      if (getCurrentFocusItem(state).title == '') {
        return null
      }
      return createNewTodo(state)
    };
    if (f.type === 'slice' && f.index === state.currentDay.slices.length-1) {
      // coming from the slices, want to go down into the todos
      let newState = {};
      if (state.todos.length === 0) {
        newState = createNewTodo(state)
      }
      return ({
        ...newState,
        focus: {type: 'todoitem', index:0}
      })
    }
    return ({
      focus: {...f, index: f.index+1},
    })
}

function createNewTodo(state:State) {
    return ({
      todos: [...state.todos, {title: ''}]
    })
  }

function getCurrentFocusItem(state:State):TodoItem|Slice {
  const f = state.focus
  if (f.type === 'slice') {
    return state.currentDay.slices[f.index]
  } else {
    return state.todos[f.index]
  }
}

export function handleFocusSlice(slice: Slice, field: 'time'|'title') {
  return (state:State) => {
    const f = state.focus
    if (f.type === 'slice' && state.currentDay.slices[f.index] === slice && f.field === field) {
      return null
    }
    return({
        focus: {
          type: 'slice',
          index: state.currentDay.slices.indexOf(slice),
          field
        }
    } as Pick<State, 'focus'>)
  }
}

export function handleFocusTodo(todo: ITodoItem) {
  return (state:State) => {
    const f = state.focus
    if (f.type === 'todoitem' && state.todos[f.index] === todo) {
      return null
    }
    return ({
      focus: {type: 'todoitem', index: state.todos.indexOf(todo)}
    } as Pick<State, 'focus'>)
  }
}

export function handleCreateSliceFromTodo(todo:TodoItem) {
  return (state:State):State => {
    const currentDate:string|undefined = findKey(state.days, state.currentDay)
    if (currentDate === undefined) {
      throw new Error('Current day not found in days')
    }

    let todos = state.todos.filter(t => t !== todo)
    todos = todos.length > 0 ? todos : [{title: ''}]

    let focus:FocusInfo = todos[state.focus.index]
      ? state.focus
      : {type: 'todoitem', index: todos.length-1}

    const day = appendSlice(state.currentDay, todo.title)

    return ({
      days: {
        ...state.days,
        [currentDate]: day
      },
      currentDay: day,
      todos,
      focus
    })
  }
}

export function handleChangeTodoItem(todo: ITodoItem) {
  return (state:State) => {
    return ({
      todos: setIn(state.todos, [state.focus.index], todo)
    })
  }
}

export function handleChangeSlice(slice:Slice) {
  return (state:State):Pick<State, never> => {
    return ({
      day: setIn(state.currentDay, ['slices', state.focus.index], slice)
    })
  }
}

export function handleDeleteSlice(slice:Slice) {
  return (state:State):Pick<State, never> => {
    const i = state.currentDay.slices.indexOf(slice)
    return ({
      day: setIn(state.currentDay, ['slices'], splice(state.currentDay.slices, i, 1))
    })
  }
}