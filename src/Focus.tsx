import * as React from 'react'
import { Slice , TodoItem } from './Data';

export type FocusInfo = {type: 'slice', index:number, field:'title'|'time'} | {type: 'todoitem', index:number}

interface State {
  focus: FocusInfo
}

interface RenderProps {
  focus: FocusInfo
  handleFocusDown: () => void
  handleFocusUp: () => void
  handleFocusSlice: (slice:Slice, field: 'time'|'title') => void
  handleFocusTodo: (todo:TodoItem) => void
}

interface Props {
  slices: Slice[]
  todos: TodoItem[]
  children: (renderProps:RenderProps) => JSX.Element
}

export default class Focus extends React.Component<Props, State> {
  state:State = {
    focus: {type: 'todoitem', index: 0}
  }

  handleFocusUp = () => {
    const f = this.state.focus
    if (f.type === 'slice' && f.index === 0) return;
    if (f.type === 'todoitem' && f.index === 0) {
      if (this.props.slices.length > 0) {
        this.setState({focus: {type: 'slice', field:'title', index:this.props.slices.length-1}})
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
    if (f.type === 'todoitem' && f.index === this.props.todos.length-1) {
      if (this.getCurrentFocusItem().title == '') {
        return
      }
      this.createNewTodo()
    };
    if (f.type === 'slice' && f.index === this.props.slices.length-1) {
      // coming from the slices, want to go down into the todos
      if (this.props.todos.length === 0) {
        this.createNewTodo()
      }
      this.setState({focus: {type: 'todoitem', index:0}})
      return
    }
    this.setState({
      focus: {...f, index: f.index+1}
    })
  }

  getCurrentFocusItem():TodoItem|Slice {
    const f = this.state.focus
    if (f.type === 'slice') {
      return this.props.slices[f.index]
    } else {
      return this.props.todos[f.index]
    }
  }

  handleFocusSlice = (slice: Slice, field: 'time'|'title') => {
    const f = this.state.focus
    if (f.type === 'slice' && this.props.slices[f.index] === slice && f.field === field) {
      return
    }
    this.setState({
        focus: {
          type: 'slice',
          index: this.props.slices.indexOf(slice),
          field
        }
    })
  }

  handleFocusTodo = (todo: TodoItem) => {
    const f = this.state.focus
    if (f.type === 'todoitem' && this.props.todos[f.index] === todo) {
      return
    }
    this.setState({
      focus: {type: 'todoitem', index: this.props.todos.indexOf(todo)}
    })
  }

  render() {
    const render = this.props.children
    return render({
      focus: this.state.focus,
      handleFocusDown: this.handleFocusDown,
      handleFocusUp: this.handleFocusUp,
      handleFocusSlice: this.handleFocusSlice,
      handleFocusTodo: this.handleFocusTodo
    })
  }

}