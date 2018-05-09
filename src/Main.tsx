import * as React from 'react'
import {Input, Flex, Divider, Container} from 'rebass-emotion'
import { createDay, Day, updateSlice, now, TodoItem, appendSlice } from './Data';
import {findDOMNode} from 'react-dom'
import {last} from 'lodash'

type FocusInfo = {type: 'slice'|'todoitem', index:number}

interface State {
  day: Day
  timerRunning: boolean
  interval?: number
  todos: TodoItem[]
  focus: FocusInfo
}

export default class Main extends React.Component<{}, State> {
  state:State = {
    day: createDay(),
    timerRunning: false,
    todos: [{title: 'Standup'}, {title: 'Lunch'}],
    focus: {type: 'todoitem', index: 0}
  }

  references = {
    slices: [] as React.ReactInstance[],
    todos: [] as React.ReactInstance[]
  }

  componentDidUpdate(prevProps:any, prevState:State) {
    if (prevState.focus !== this.state.focus) {
      this.focusElement(this.state.focus)
    }
  }

  focusElement(focus:FocusInfo) {
    if (focus.type === 'slice') {
      const instance = this.references.slices[focus.index]
      const element = findDOMNode(instance) as HTMLInputElement
      element.focus()
    } else if (focus.type === 'todoitem') {
      const instance = this.references.todos[focus.index]
      const element = findDOMNode(instance) as HTMLInputElement
      element.focus()
    }
  }

  focusUp() {
    const f = this.state.focus
    if (f.type === 'slice' && f.index === 0) return;
    if (f.type === 'todoitem' && f.index === 0) {
      if (this.state.day.slices.length > 0) {
        this.setState({focus: {type: 'slice', index:this.state.day.slices.length-1}})
        return
      } else {
        return
      }
    }
    this.setState({
      focus: {type: f.type, index: f.index-1}
    })
  }

  focusDown() {
    const f = this.state.focus
    if (f.type === 'todoitem' && f.index === this.state.todos.length-1) return;
    if (f.type === 'slice' && f.index === this.state.day.slices.length-1) {
      if (this.state.todos.length > 0) {
        this.setState({focus: {type: 'todoitem', index:0}})
        return
      } else {
        // create new todo?
        return
      }
    }
    this.setState({
      focus: {type: f.type, index: f.index+1}
    })
  }

  componentDidMount(){
    const lastTodo:React.ReactInstance | undefined =  last(this.references.todos)
    if (lastTodo) {
      this.setState({
        focus: {type: 'todoitem', index:this.references.todos.length-1}
      })
    }
  }

  render() {
    return (
      <Container m={3}>
        {this.state.day.slices.map((slice, i) => (
          <Flex align="center" key={i}>
              <Input
                ref={(ref:any) => this.references.slices[i] = ref}
                defaultValue={slice.title}
                placeholder="Input"
              />
              <Input value={slice.end} readOnly/>
              Start
          </Flex>
        ))}
        <Divider/>
        {this.state.todos.map((todo, i) => (
          <Flex align="center" key={i}>
              <Input
                ref={(ref:any) => this.references.todos[i] = ref}
                defaultValue={todo.title}
                placeholder="Input"
                onKeyPress={this.handleTodoKeyPress}
                onKeyDown={this.handleTodoKeyDown}
              />
          </Flex>
        ))}
      </Container>
    )
  }

  handleTodoKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('enter')
      this.addSlice('lol')
      // Copy TodoItem as new Slice
    } else if (e.key === 'Up') {
      this.focusUp()
    }
  }

  handleTodoKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      this.focusUp()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      this.focusDown()
    }
  }

  addSlice(title:string) {
    this.setState({
      day: appendSlice(this.state.day, title)
    })
  }

  startTimer() {
    this.setState({
      timerRunning: true,
      //todo only when day has slice
      interval: window.setInterval(this.timerUpdate, 1000)
    })
  }

  stopTimer() {
    this.setState(state => {
      clearInterval(state.interval)
      return {timerRunning: false}
    })
  }

  private timerUpdate = () => {
    // console.log('ding', this.day.slices[0])
    this.setState({
      day: updateSlice(this.state.day, -1, {end: now()})
    })
  }

}