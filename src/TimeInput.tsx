import * as React from 'react';
import {Input} from 'rebass'
import {increment} from './Data'

interface Props {
  value: string
  onFocus: () => void
  onChange: (value: string) => void
  onKeyDown: (e:React.KeyboardEvent<HTMLElement>) => void
}

export default class TimeInput extends React.Component<Props, {value:string}> {
  state = {value: this.props.value};

  render() {
      return <Input
          width="5em"
          flex="0"
          mx="4"
          ref={this.inputRef}
          value={this.state.value}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
  }

  inputRef = React.createRef<HTMLInputElement>()

  componentDidUpdate(prevProps:Props) {
    const valueDidUpdate = prevProps.value !== this.props.value
    const valueIsDifferent = this.props.value !== this.state.value
    if (valueDidUpdate && valueIsDifferent) {
      this.setState({value: this.props.value})
    }
  }

  focus() {
    this.inputRef.current!.focus()
  }

  handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      this.props.onChange(increment(this.state.value, -5))
    } else if (e.key === 'ArrowDown') {
      this.props.onChange(increment(this.state.value, 5))
    } else if (e.key === 'Enter'){
      this.props.onChange(increment(this.state.value, 0))
    } else if (e.key === 'Tab') {
      this.props.onKeyDown(e);
    }
  }

  handleFocus = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocus()
  }

  handleBlur = (e:React.FocusEvent<HTMLInputElement>) => {
    if (this.props.value !== this.state.value) {
      this.setState({value: this.props.value});
    }
  }

  handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.setState({value: e.currentTarget.value})
  }

}