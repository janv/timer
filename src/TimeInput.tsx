import * as React from 'react';
import {Input} from 'rebass'
import {increment} from './Data'

interface Props {
  value: string
  onFocus: () => void
  onChange: (value: string) => void
  onKeyDown: (e:React.KeyboardEvent<HTMLElement>) => void
}

export default class TimeInput extends React.Component<Props> {
  render() {
      return <Input
          width="5em"
          flex="0"
          mx="4"
          ref={this.inputRef}
          value={this.props.value}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
        />
  }

  inputRef = React.createRef<HTMLInputElement>()

  focus() {
    this.inputRef.current!.focus()
  }

  handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      this.props.onChange(increment(this.props.value, -5))
    } else if (e.key === 'ArrowDown') {
      this.props.onChange(increment(this.props.value, 5))
    } else if (e.key === 'Tab') {
      this.props.onKeyDown(e);
    }
  }

  handleFocus = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocus()
  }

  handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    // todo here: manage state
    this.props.onChange(e.currentTarget.value)
  }

}