import {findDOMNode} from 'react-dom';
import * as React from "react";
import {Input, Flex} from 'rebass-emotion'
import {Slice as ISlice} from './Data'

type Props = {
  slice: ISlice
  focus?: 'title'|'time'
  onFocusUp: () => void
  onFocusDown: () => void
  onFocusFieldChange: (slice:ISlice, field:'title'|'time') => void
  onChange: (slice: ISlice) => void
}

export default class Slice extends React.Component<Props> {
  componentDidUpdate(prevProps:Props) {
    if (this.props.focus !== prevProps.focus) {
      if (this.props.focus === 'title') {
        this.focusTitle()
      } else if (this.props.focus === 'time') {
        this.focusTime()
      } else {
        // no focus
      }
    }
  }

  componentDidMount() {
    if (this.props.focus === 'title') {
      this.focusTitle()
    } else if (this.props.focus === 'time') {
      this.focusTime()
    }
  }

  focusTitle() {
    const element = findDOMNode(this.titleRef.current!) as HTMLInputElement
    element.focus()
  }

  focusTime() {
    const element = findDOMNode(this.timeRef.current!) as HTMLInputElement
    element.focus()
  }

  titleRef = React.createRef<React.ReactInstance>()
  timeRef  = React.createRef<React.ReactInstance>()

  render() {
    return (
        <Flex align="center">
            <Input
              ref={this.titleRef}
              value={this.props.slice.title}
              placeholder="Input"
              onKeyDown={this.handleKeyDown}
              onFocus={this.handleFocusTitle}
              onChange={this.handleChangeTitle}
            />
            <Input
              ref={this.timeRef}
              value={this.props.slice.end}
              onKeyDown={this.handleKeyDown}
              onFocus={this.handleFocusTime}
              onChange={this.handleChangeTime}
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

  handleFocusTitle = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocusFieldChange(this.props.slice, 'title')
  }

  handleFocusTime = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocusFieldChange(this.props.slice, 'time')
  }

  handleChangeTitle = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange({...this.props.slice, title: e.currentTarget.value})
  }

  handleChangeTime = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange({...this.props.slice, end: e.currentTarget.value})
  }

}