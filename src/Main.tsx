import * as React from 'react'
import {Divider, Container} from 'rebass-emotion'
import { createDay, Day, Slice as ISlice, TodoItem as ITodoItem, appendSlice } from './Data';
import Slice from './Slice'
import TodoItem from './TodoItem'
import { setIn, splice } from './util/icepick';

export type FocusInfo = {type: 'slice', index:number, field:'title'|'time'} | {type: 'todoitem', index:number}

interface State {
  day: Day
  todos: ITodoItem[]
  focus: FocusInfo
}

export default class Main extends React.Component<{}, State> {
  state:State = {
    day: createDay(),
    todos: [{title: 'Standup'}, {title: 'Lunch'}],
    focus: {type: 'todoitem', index: 0}
  }

  handleFocusUp = () => {
    const f = this.state.focus
    if (f.type === 'slice' && f.index === 0) return;
    if (f.type === 'todoitem' && f.index === 0) {
      if (this.state.day.slices.length > 0) {
        this.setState({focus: {type: 'slice', field:'title', index:this.state.day.slices.length-1}})
        return
      } else {
        return
      }
    }
    this.setState({
      focus: {...f, index: f.index-1}
    })
  }

  handleFocusDown = () => {
    const f = this.state.focus
    if (f.type === 'todoitem' && f.index === this.state.todos.length-1) {
      if (this.getCurrentFocusItem().title == '') {
        return
      }
      this.createNewTodo()
    };
    if (f.type === 'slice' && f.index === this.state.day.slices.length-1) {
      // coming from the slices, want to go down into the todos
      if (this.state.todos.length === 0) {
        this.createNewTodo()
      }
      this.setState({focus: {type: 'todoitem', index:0}})
      return
    }
    this.setState({
      focus: {...f, index: f.index+1}
    })
  }

  getCurrentFocusItem():ITodoItem|ISlice {
    const f = this.state.focus
    if (f.type === 'slice') {
      return this.state.day.slices[f.index]
    } else {
      return this.state.todos[f.index]
    }
  }

  handleFocusSlice = (slice: ISlice, field: 'time'|'title') => {
    const f = this.state.focus
    if (f.type === 'slice' && this.state.day.slices[f.index] === slice && f.field === field) {
      return
    }
    this.setState({
        focus: {
          type: 'slice',
          index: this.state.day.slices.indexOf(slice),
          field
        }
    })
  }

  handleFocusTodo = (todo: ITodoItem) => {
    const f = this.state.focus
    if (f.type === 'todoitem' && this.state.todos[f.index] === todo) {
      return
    }
    this.setState({
      focus: {type: 'todoitem', index: this.state.todos.indexOf(todo)}
    })
  }

  createNewTodo() {
    this.setState({
      todos: [...this.state.todos, {title: ''}]
    })
  }

  render() {
    const focus = this.state.focus
    return (
      <Container m={3}>
        {this.state.day.slices.map((slice, i) => (
          <Slice
            slice={slice}
            key={i}
            focus={focus.type === 'slice' && focus.index === i ? focus.field : undefined }
            onFocusDown={this.handleFocusDown}
            onFocusUp={this.handleFocusUp}
            onFocusFieldChange={this.handleFocusSlice}
            onChange={this.handleChangeSlice}
            onDelete={this.handleDeleteSlice}
            />
        ))}
        <Divider/>
        {this.state.todos.map((todo, i) => (
          <TodoItem
            todoItem={todo}
            focus={focus.type === 'todoitem' && focus.index === i}
            key={i}
            onFocusDown={this.handleFocusDown}
            onFocusUp={this.handleFocusUp}
            onEnter={this.handleCreateSliceFromTodo}
            onFocus={this.handleFocusTodo}
            onChange={this.handleChangeTodoItem}
            />
        ))}
      </Container>
    )
  }

  handleCreateSliceFromTodo = (todo:ITodoItem) => {
    let todos = this.state.todos.filter(t => t !== todo)
    todos = todos.length > 0 ? todos : [{title: ''}]

    let focus:FocusInfo = todos[this.state.focus.index]
      ? this.state.focus
      : {type: 'todoitem', index: todos.length-1}

    this.setState({
      day: appendSlice(this.state.day, todo.title),
      todos,
      focus
    })
  }

  handleChangeTodoItem = (todo: ITodoItem) => {
    this.setState({
      todos: setIn(this.state.todos, [this.state.focus.index], todo)
    })
  }

  handleChangeSlice = (slice:ISlice) => {
    this.setState({
      day: setIn(this.state.day, ['slices', this.state.focus.index], slice)
    })
  }

  handleDeleteSlice = (slice:ISlice) => {
    const i = this.state.day.slices.indexOf(slice)
    this.setState({
      day: setIn(this.state.day, ['slices'], splice(this.state.day.slices, i, 1))
    })
  }

}