import * as React from 'react';
import {Input} from 'rebass'
import { Time } from './Data';

interface Props {
  time: Time
  onFocus: () => void
  onChange: (value: Time) => void
  onKeyDown: (e:React.KeyboardEvent<HTMLElement>) => void
}

export default class TimeInput extends React.Component<Props, {isoTime:string}> {
  state = {isoTime: this.props.time.get()};

  render() {
      return <Input
          width="5em"
          flex="0"
          mx="4"
          ref={this.inputRef}
          value={this.state.isoTime}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
  }

  inputRef = React.createRef<HTMLInputElement>()

  componentDidUpdate(prevProps:Props) {
    const valueDidUpdate = prevProps.time !== this.props.time
    const valueIsDifferent = this.props.time.get() !== this.state.isoTime
    if (valueDidUpdate && valueIsDifferent) {
      this.setState({isoTime: this.props.time.get()})
    }
  }

  focus() {
    this.inputRef.current!.focus()
  }

  handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      this.props.onChange(this.props.time.increment(-5))
    } else if (e.key === 'ArrowDown') {
      this.props.onChange(this.props.time.increment(5))
    } else if (e.key === 'Enter'){
      //todo if isotime invalid, reset isotime
      this.props.onChange(this.props.time.set(this.state.isoTime))
    } else {
      this.props.onKeyDown(e);
    }
  }

  handleFocus = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocus()
  }

  handleBlur = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onChange(this.props.time.set(this.state.isoTime))
  }

  handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.setState({isoTime: e.currentTarget.value})
  }

}