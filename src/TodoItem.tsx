import {findDOMNode} from 'react-dom';
import * as React from "react";
import {Flex} from 'grid-styled'
import {Input} from 'rebass'
import {TodoItem as ITodoItem} from './Data'

type Props = {
  todoItem: ITodoItem
  focus: boolean
  onFocusUp: () => void
  onFocusDown: () => void
  onEnter: (todo:ITodoItem) => void
  onFocus: (todo: ITodoItem) => void
  onChange: (todo: ITodoItem) => void
}

export default class TodoItem extends React.Component<Props> {

  componentDidUpdate(prevProps:Props) {
    if (this.props.focus && !prevProps.focus) {
      this.focusInput()
    }
  }

  componentDidMount() {
    if (this.props.focus) {
      this.focusInput()
    }
  }

  private focusInput() {
    const element = findDOMNode(this.inputRef.current!) as HTMLInputElement
    element.focus()
  }

  inputRef = React.createRef<React.ReactInstance>()

  render() {
    return (
      <Flex align="center">
          <Input
            ref={this.inputRef}
            value={this.props.todoItem.title}
            placeholder="Input"
            onKeyDown={this.handleKeyDown}
            onKeyPress={this.handleKeyPress}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
          />
      </Flex>
    )
  }

  handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      this.props.onFocusUp()
    } else if (e.key === 'ArrowDown') {
      this.props.onFocusDown()
    }
  }

  handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.props.onEnter(this.props.todoItem)
    }
  }

  handleFocus = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocus(this.props.todoItem)
  }

  handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange({...this.props.todoItem, title: e.currentTarget.value})
  }
}