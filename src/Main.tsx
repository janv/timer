import * as React from 'react'
import Slice from './Slice'
import TodoItem from './TodoItem'
import { Handlers, State } from './StateContainer';
import LastSaved from './LastSaved'
import DatePicker from './DatePicker'
import { currentSlices } from './State';
import styled from 'react-emotion';
import Button from './components/Button';
import Divider from './components/Divider';
import { margin } from './components/base';

interface Props {
  handlers: Handlers
  state: State
}

const Box = styled('div')`margin: 10px;`
const Flex = styled('div')`display: flex; > * {margin-right: ${margin}px};`

export default class Main extends React.Component<Props> {
  render() {
    const {handlers, state} = this.props
    const focus = state.focus
    const slices = currentSlices(state)
    return (
      <Box>
        <Flex>
          <Button onClick={handlers.load}>Load</Button>
          <Button onClick={handlers.save}>Save</Button>
          <Button onClick={handlers.reset}>Reset</Button>
          <LastSaved lastSaved={state.lastSaved}/>
        </Flex>
        <Divider/>
        <DatePicker value={state.date} onChange={handlers.changeDate}/>
        <Divider/>
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
        <Divider/>
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