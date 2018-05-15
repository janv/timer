import * as React from 'react'
import {Divider, Container, Flex, Button} from 'rebass-emotion'
import Slice from './Slice'
import TodoItem from './TodoItem'
import { Handlers, State } from './StateContainer';

interface Props {
  handlers: Handlers
  state: State
}

export default class Main extends React.Component<Props> {
  render() {
    const {handlers, state} = this.props
    const focus = state.focus
    return (
      <Container m={3}>
        <Flex>
          <Button onClick={handlers.load}>Load</Button>
          <Button onClick={handlers.save}>Save</Button>
          <Button onClick={handlers.reset}>Reset</Button>
        </Flex>
        {state.day.slices.map((slice, i) => (
          <Slice
            slice={slice}
            key={i}
            focus={focus.type === 'slice' && focus.index === i ? focus.field : undefined }
            onFocusDown={handlers.focusDown}
            onFocusUp={handlers.focusUp}
            onFocusFieldChange={handlers.focusSlice}
            onChange={handlers.changeSlice}
            onDelete={handlers.deleteSlice}
            />
        ))}
        <Divider/>
        {state.todos.map((todo, i) => (
          <TodoItem
            todoItem={todo}
            focus={focus.type === 'todoitem' && focus.index === i}
            key={i}
            onFocusDown={handlers.focusDown}
            onFocusUp={handlers.focusUp}
            onEnter={handlers.createSliceFromTodo}
            onFocus={handlers.focusTodo}
            onChange={handlers.changeTodoItem}
            />
        ))}
      </Container>
    )
  }
}