import * as React from 'react';
import {Input} from 'rebass'
import { Time } from './Data';
import * as moment from 'moment';
import {findDOMNode} from 'react-dom';

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
    if (e.key === 'ArrowUp' && e.metaKey) {
      e.preventDefault()
      this.props.onChange(this.props.time.increment(-5))
    } else if (e.key === 'ArrowDown' && e.metaKey) {
      e.preventDefault()
      this.props.onChange(this.props.time.increment(5))
    } else if (e.key === 'Enter'){
      this.updateTime()
    } else {
      this.props.onKeyDown(e)
    }
  }

  handleFocus = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocus();
    // TODO Hacky, because the inputRef is actually a styledComponent wrapper,
    // but we need the actual input element
    (findDOMNode(this.inputRef.current!) as HTMLInputElement).select()
  }

  handleBlur = (e:React.FocusEvent<HTMLInputElement>) => {
    this.updateTime()
  }

  handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.setState({isoTime: e.currentTarget.value})
  }

  updateTime() {
    const time = moment(this.state.isoTime, moment.HTML5_FMT.TIME)
    if (time.isValid()) {
      this.props.onChange(this.props.time.set(time.format(moment.HTML5_FMT.TIME)))
    } else {
      this.setState({isoTime: this.props.time.get()})
    }
  }

}