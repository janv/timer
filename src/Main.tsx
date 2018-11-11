import * as React from 'react'
import {Flex} from '@rebass/grid'
import {Box, Button} from 'rebass/emotion'
import Slice from './Slice'
import TodoItem from './TodoItem'
import { Handlers, State } from './StateContainer';
import LastSaved from './LastSaved'
import DatePicker from './DatePicker'
import { currentSlices } from './State';

interface Props {
  handlers: Handlers
  state: State
}

export default class Main extends React.Component<Props> {
  render() {
    const {handlers, state} = this.props
    const focus = state.focus
    const slices = currentSlices(state)
    return (
      <Box m={3}>
        <Flex>
          <Button onClick={handlers.load}>Load</Button>
          <Button onClick={handlers.save}>Save</Button>
          <Button onClick={handlers.reset}>Reset</Button>
          <LastSaved lastSaved={state.lastSaved}/>
        </Flex>
        <hr/>
        <DatePicker value={state.date} onChange={handlers.changeDate}/>
        <hr/>
        {slices.map((slice) => (
          <Slice
            slice={slice}
            key={slice.id}
            focus={focus.type === 'slice' && focus.id === slice.id ? focus.field : undefined }
            onFocusDown={handlers.focusDown}
            onFocusUp={handlers.focusUp}
            onFocusFieldChange={handlers.focusSlice}
            onChange={handlers.changeSlice}
            onDelete={handlers.deleteSlice}
            />
        ))}
        <hr/>
        {state.todos.map((todo) => (
          <TodoItem
            todoItem={todo}
            focus={focus.type === 'todoitem' && focus.id === todo.id}
            key={todo.id}
            onFocusDown={handlers.focusDown}
            onFocusUp={handlers.focusUp}
            onEnter={handlers.createSliceFromTodo}
            onFocus={handlers.focusTodo}
            onChange={handlers.changeTodoItem}
            />
        ))}
      </Box>
    )
  }
}