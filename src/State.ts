import { TodoItem as ITodoItem, TodoItem, Slice, appendSlice, Day } from './Data';
import { setIn, splice, updateIn, sort } from './util/icepick';
import { State, FocusInfo } from './StateContainer';
import * as moment from 'moment';


export function createDefaultState():State {
  const today = moment().format('YYYY-MM-DD')
  const day:Day = {
    slices: [{title: 'First Slice', end: moment().format('HH:mm')}]
  }
  return {
    days: {[today]: day},
    date: today,
    todos: [{title: 'Standup'}, {title: 'Lunch'}],
    focus: {type: 'todoitem', index: 0}
  }
}

export function focusUp(state:State):State|null {
  const f = state.focus
  const currentDay = state.days[state.date]
  if (f.type === 'slice' && f.index === 0) return null;
  if (f.type === 'todoitem' && f.index === 0) {
    if (currentDay.slices.length > 0) {
      return ({
        ...state,
        focus: {type: 'slice', field:'title', index:currentDay.slices.length-1}
      })
    } else {
      return null
    }
  }
  return ({
    ...state,
    focus: {...f, index: f.index-1}
  })
}

export function focusDown(state:State):State|null {
    const f = state.focus
    const currentDay = state.days[state.date]
    if (f.type === 'todoitem' && f.index === state.todos.length-1) {
      if (getCurrentFocusItem(state).title == '') {
        return null
      }
      state = createNewTodo(state)
    };
    if (f.type === 'slice' && f.index === currentDay.slices.length-1) {
      if (state.todos.length === 0) {
        state = createNewTodo(state)
      }
      return ({
        ...state,
        focus: {type: 'todoitem', index:0}
      })
    }
    return ({
      ...state,
      focus: {...f, index: f.index+1},
    })
}

function createNewTodo(state:State):State {
    return ({
      ...state,
      todos: [...state.todos, {title: ''}]
    })
  }

function getCurrentFocusItem(state:State):TodoItem|Slice {
  const f = state.focus
  const currentDay = state.days[state.date]
  if (f.type === 'slice') {
    return currentDay.slices[f.index]
  } else {
    return state.todos[f.index]
  }
}

export function focusSlice(slice: Slice, field: 'time'|'title') {
  return (state:State):State|null => {
    const currentDay = state.days[state.date]
    const f = state.focus
    if (f.type === 'slice' && currentDay.slices[f.index] === slice && f.field === field) {
      return null
    }
    return({
      ...state,
      focus: {
        type: 'slice',
        index: currentDay.slices.indexOf(slice),
        field
      }
    })
  }
}

export function focusTodo(todo: ITodoItem) {
  return (state:State):State|null => {
    const f = state.focus
    if (f.type === 'todoitem' && state.todos[f.index] === todo) {
      return null
    }
    return ({
      ...state,
      focus: {type: 'todoitem', index: state.todos.indexOf(todo)}
    })
  }
}

export function createSliceFromTodo(todo:TodoItem) {
  return (state:State):State => {
    const currentDay = state.days[state.date]
    let todos = state.todos.filter(t => t !== todo)
    todos = todos.length > 0 ? todos : [{title: ''}]

    let focus:FocusInfo = todos[state.focus.index]
      ? state.focus
      : {type: 'todoitem', index: todos.length-1}

    return ({
      days: {
        ...state.days,
        [state.date]: appendSlice(currentDay, todo.title)
      },
      date:state.date,
      todos,
      focus
    })
  }
}

export function changeTodoItem(todo: ITodoItem) {
  return (state:State):State => {
    return ({
      ...state,
      todos: setIn(state.todos, [state.focus.index], todo)
    })
  }
}

export function changeSlice(slice:Slice) {
  return (state:State):State => {
    return ({
      ...state,
      days: setIn(state.days, [state.date, 'slices', state.focus.index], slice)
    })
  }
}

export function deleteSlice(slice:Slice) {
  return (state:State):State => {
    const currentDay = state.days[state.date]
    const i = currentDay.slices.indexOf(slice)
    return ({
      ...state,
      days: setIn(state.days, [state.date ,'slices'], splice(currentDay.slices, i, 1))
    })
  }
}

export function changeDate(date:string) {
  return (state:State):State => {
    const currentDay = state.days[date]
    if (currentDay == null) {
      const newCurrentDay = {slices: []}
      return {
        ...state,
        date,
        days: {
          ...state.days,
          [date]: newCurrentDay
        },
      }
    } else {
      return {
        ...state,
        date,
        days: state.days,
      }
    }

  }
}