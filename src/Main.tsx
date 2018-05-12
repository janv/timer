import * as React from 'react'
import {Divider, Container} from 'rebass-emotion'
import { createDay, Slice as ISlice, TodoItem as ITodoItem } from './Data';
import Slice from './Slice'
import TodoItem from './TodoItem'
import { handleFocusUp, handleFocusDown, handleFocusSlice, handleFocusTodo, handleCreateSliceFromTodo, handleDeleteSlice, handleChangeSlice, handleChangeTodoItem, State } from './State';

export default class Main extends React.Component<{}, State> {
  state:State = {
    day: createDay(),
    todos: [{title: 'Standup'}, {title: 'Lunch'}],
    focus: {type: 'todoitem', index: 0}
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

  handleFocusUp = () => {
    this.setState(handleFocusUp)
  }

  handleFocusDown = () => {
    this.setState(handleFocusDown)
  }

  handleFocusSlice = (slice: ISlice, field: 'time'|'title') => {
    this.setState(handleFocusSlice(slice, field))
  }

  handleFocusTodo = (todo: ITodoItem) => {
    this.setState(handleFocusTodo(todo))
  }

  handleCreateSliceFromTodo = (todo:ITodoItem) => {
    this.setState(handleCreateSliceFromTodo(todo))
  }

  handleChangeTodoItem = (todo: ITodoItem) => {
    this.setState(handleChangeTodoItem(todo))
  }

  handleChangeSlice = (slice:ISlice) => {
    this.setState(handleChangeSlice(slice))
  }

  handleDeleteSlice = (slice:ISlice) => {
    this.setState(handleDeleteSlice(slice))
  }

}