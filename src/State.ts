import { TodoItem as ITodoItem, TodoItem, Slice, appendSlice, Day, makeTodoItem, Time } from './Data';
import { setIn, splice} from './util/icepick';
import { State, FocusInfo, PersistedState } from './StateContainer';
import { sortBy, isEqual, findIndex, last } from 'lodash';
import * as uuid from 'uuid/v4'


export function createDefaultState():State {
  const today = Day.today();
  const todos = [makeTodoItem('Standup'), makeTodoItem('Lunch')]
  return {
    slices: [],
    date: today,
    todos,
    focus: {type: 'todoitem', id: todos[0].id}
  }
}

export function currentSlices(state:State):Slice[] {
  return state.slices.filter(slice => slice.end.isOn(state.date))
}

export function focusUp(state:State):State|null {
  const f = state.focus
  const slices = currentSlices(state);
  if (f.type === 'slice') {
    const index = id2Index(slices, f)
    if (index < 0) throw new Error('Focussed slice not on current day')
    if (index === 0) return null
    return ({
      ...state,
      focus: prevFocus(slices, state.focus)
    })
  }
  if (f.type === 'todoitem') {
    const index = id2Index(state.todos, f)
    if (index < 0) throw new Error('Focussed todoitem does not exist')
    if (index === 0) {
      return focusLastSlice(state, slices);
    }
    return ({
      ...state,
      focus: prevFocus(state.todos, state.focus)
    })
  }
  throw new Error('focus type unknown')
}

export function focusDown(state:State):State|null {
    const f = state.focus
    const slices = currentSlices(state);
    if (f.type === 'todoitem') {
      if (getCurrentFocusItem(state) === last(state.todos)) {
        if (getCurrentFocusItem(state).title === '') {
          return null
        }
        return focusLastTodo(createNewTodo(state))
      } else {
        return ({
          ...state,
          focus: nextFocus(state.todos, state.focus)
        })
      }
    } else {
      const index = id2Index(slices, state.focus)
      if (index === slices.length-1) {
        return focusFirstTodo(state)
      } else {
        return ({
          ...state,
          focus:nextFocus(slices, state.focus)
        })
      }
    }
}

function createNewTodo(state:State):State {
    return ({
      ...state,
      todos: [...state.todos, makeTodoItem('')]
    })
  }

function getCurrentFocusItem(state:State):TodoItem|Slice {
  const f = state.focus
  if (f.type === 'slice') {
    const slice = state.slices.find(s => s.id === f.id)
    if (!slice) throw new Error('focussed slice not found')
    return slice
  } else {
    const todo = state.todos.find(t => t.id === f.id)
    if (!todo) throw new Error('focussed todo not found')
    return todo
  }
}

export function focusSlice(slice: Slice, field: 'time'|'title') {
  return (state:State):State|null => {
    const f = state.focus
    if (f.type === 'slice' && f.id === slice.id && f.field === field) {
      return null
    }
    return({
      ...state,
      focus: {
        type: 'slice',
        id: slice.id,
        field
      }
    })
  }
}

export function focusTodo(todo: ITodoItem) {
  return (state:State):State|null => {
    const f = state.focus
    if (f.type === 'todoitem' && f.id === todo.id) {
      return null
    }
    return ({
      ...state,
      focus: {type: 'todoitem', id: todo.id}
    })
  }
}

export function createSliceFromTodo(todo:TodoItem) {
  return (state:State):State => {
    let todos:TodoItem[] = state.todos.filter(t => t !== todo)
    todos = todos.length > 0 ? todos : [makeTodoItem('')] // prevent todos from going empty
    const focussedIndex = id2Index(state.todos, state.focus)

    let focus:FocusInfo = todos[focussedIndex] //if we were focussed on a todo, stay at that position, otherwise go to last
      ? {type: 'todoitem', id: todos[focussedIndex].id}
      : {type: 'todoitem', id: todos[todos.length-1].id}

    return sortSlices({
      ...appendSlice(state, todo.title),
      todos,
      focus
    })
  }
}

export function changeTodoItem(todo: ITodoItem) {
  return (state:State):State => {
    const focussedIndex = id2Index(state.todos, state.focus)
    return ({
      ...state,
      todos: setIn(state.todos, [focussedIndex], todo)
    })
  }
}

export function sortSlices(state:State) {
  const sortedSlices = sortBy<Slice>(state.slices, s => s.end.isoDateTimeString)

  if (isEqual(state.slices, sortedSlices)) {
    return state
  } else {
    return {
      ...state,
      slices: sortedSlices
    }
  }

}

export function updateSlice(slice:Slice) {
  return (state:State):State => {
    const index = findIndex(state.slices, s => s.id === slice.id)
    let newState:State = ({
      ...state,
      slices: setIn(state.slices, [index], slice)
    })
    if (state.slices[index].end !== slice.end) {
      newState = sortSlices(newState)
    }
    return newState
  }
}

export function deleteSlice(slice:Slice) {
  return (state:State):State => {
    const i = state.slices.indexOf(slice)
    // todo calculate new focus
    return ({
      ...state,
      slices: splice(state.slices, i, 1)
    })
  }
}

export function changeDate(date:Day) {
  return (state:State):State => {
    return { ...state, date }
  }
}

function id2Index(things:{id:string}[], focusItem:{id:string}):number {
  return findIndex(things, s => s.id === focusItem.id);
}

// function index2Id(things:{id:string}[], index:number):string {
//   return things[index].id;
// }

function focusLastTodo(state:State):State {
  const lastTodo = last(state.todos)
  if (lastTodo === undefined) throw new Error('no todo to focus')
  return {
    ...state,
    focus: {type: 'todoitem', id: lastTodo.id}
  }
}

function focusFirstTodo(state:State):State {
  const first = state.todos[0]
  if (first === undefined) throw new Error('no todo to focus')
  return {
    ...state,
    focus: {type: 'todoitem', id: first.id}
  }
}

function focusLastSlice(state:State, slices:Slice[]):State {
  const lastSlice = last(slices)
  if (!lastSlice) throw new Error('no last slice')
  return {
    ...state,
    focus: {type: 'slice', id: lastSlice.id, field: 'field' in state.focus ? state.focus.field : 'title'}
  }
}

// function focusFirstSlice(state:State, slices:Slice[]):State {
//   const first = slices[0]
//   if (!last) throw new Error('no first slice')
//   return {
//     ...state,
//     focus: {type: 'slice', id: first.id, field: 'field' in state.focus ? state.focus.field : 'title'}
//   }
// }

function nextFocus(things:{id:string}[], focus:FocusInfo):FocusInfo {
  const index = id2Index(things, focus);
  return {...focus, id:things[index+1].id}
}

function prevFocus(things:{id:string}[], focus:FocusInfo):FocusInfo {
  const index = id2Index(things, focus);
  return {...focus, id:things[index-1].id}
}

namespace V1 {
  type Slice = {
    title: string
    end: string
    tags: string[]
  }
  type Day = {
    slices: Slice[]
  }
  export type PersistedState = {
    days: {[date:string]: Day}
  }
}

function migrate(oldData:V1.PersistedState):PersistedState {
  const state = {
    slices: Object.keys(oldData.days).reduce(
      (slices, dateIso) => [
        ...slices,
        ...oldData.days[dateIso].slices.map(
          (sliceForDay) => ({
            title: sliceForDay.title,
            id: uuid(),
            tags: sliceForDay.tags,
            end: new Time(dateIso + 'T' + sliceForDay.end)
          })
        )], [] as Slice[]),
    todos: [{title: '', id:uuid()}]
  }
  return {
    ...state,
    focus: {type: 'todoitem', id:state.todos[0].id}
  }
}