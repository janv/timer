import * as React from 'react'
import {Flex} from 'grid-styled'
import {Divider, Container, Button} from 'rebass'
import Slice from './Slice'
import TodoItem from './TodoItem'
import { Handlers, State } from './StateContainer';
import LastSaved from './LastSaved'
import DatePicker from './DatePicker'

interface Props {
  handlers: Handlers
  state: State
}

export default class Main extends React.Component<Props> {
  render() {
    const {handlers, state} = this.props
    const focus = state.focus
    const currentDay = state.days[state.date]
    return (
      <Container m={3}>
        <Flex>
          <Button onClick={handlers.load}>Load</Button>
          <Button onClick={handlers.save}>Save</Button>
          <Button onClick={handlers.reset}>Reset</Button>
          <LastSaved lastSaved={state.lastSaved}/>
        </Flex>
        <Divider/>
        <DatePicker value={state.date} onChange={handlers.changeDate}/>
        <Divider/>
        {currentDay.slices.map((slice, i) => (
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