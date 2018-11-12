import {findDOMNode} from 'react-dom';
import * as React from "react";
import { css } from "emotion";
import {Slice as ISlice, Time} from './Data'
import TagInput from './TagInput';
import TimeInput from './TimeInput';
import styled from 'react-emotion';
import Button from './components/Button';
import Input from './components/Input';
import { margin } from './components/base';

type Props = {
  slice: ISlice
  focus?: 'title'|'time'|'tags'
  onFocusUp: () => void
  onFocusDown: () => void
  onFocusFieldChange: (slice:ISlice, field:'title'|'time'|'tags') => void
  onChange: (slice: ISlice) => void
  onDelete: (slice: ISlice) => void
}

const Container = styled('div')`display: flex; align-items: center; margin-bottom: ${margin * 0.5}px`
const Spacer = styled('div')`margin-right: ${margin * 0.5}px;`

export default class Slice extends React.Component<Props> {
  componentDidUpdate(prevProps:Props) {
    if (this.props.focus !== prevProps.focus) {
      if (this.props.focus === 'title') {
        this.focusTitle()
      } else if (this.props.focus === 'time') {
        this.focusTime()
      } else if (this.props.focus === 'tags') {
        this.focusTags()
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

  focusTags() {
    this.tagsRef.current!.focus()
  }

  titleRef = React.createRef<HTMLInputElement>()
  timeRef  = React.createRef<TimeInput>()
  tagsRef  = React.createRef<TagInput>()

  render() {
    return (
        <Container>
            <Input
              width="300px"
              outline={this.props.focus != null}
              className={css`flex: 0;`}
              innerRef={this.titleRef}
              value={this.props.slice.title}
              placeholder="Input"
              onKeyDown={this.handleKeyDownTitle}
              onFocus={this.handleFocusTitle}
              onChange={this.handleChangeTitle}
            />
            <Spacer/>
            <TimeInput
              outline={this.props.focus != null}
              ref={this.timeRef}
              time={this.props.slice.end}
              onKeyDown={this.handleKeyDownTime}
              onFocus={this.handleFocusTime}
              onChange={this.handleChangeTime}
            />
            <Spacer/>
            <TagInput
              outline={this.props.focus != null}
              tags={this.props.slice.tags}
              onChange={this.handleChangeTags}
              onFocus={this.handleFocusTags}
              onKeyDown={this.handleKeyDownTags}
              ref={this.tagsRef}
            />
            <Spacer/>
            <Button onClick={this.handleDelete}>X</Button>
        </Container>
    )
  }

  handleKeyDownTitle = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      this.props.onFocusUp()
    } else if (e.key === 'ArrowDown') {
      this.props.onFocusDown()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      this.props.onFocusFieldChange(this.props.slice, e.shiftKey ? 'tags' : 'time')
    }
  }

  handleKeyDownTags = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      this.props.onFocusUp()
    } else if (e.key === 'ArrowDown') {
      this.props.onFocusDown()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      this.props.onFocusFieldChange(this.props.slice, e.shiftKey ? 'time' : 'title')
    }
  }

  handleKeyDownTime = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      this.props.onFocusUp()
    } else if (e.key === 'ArrowDown') {
      this.props.onFocusDown()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      this.props.onFocusFieldChange(this.props.slice, e.shiftKey ? 'title' : 'tags')
    }
  }

  handleFocusTitle = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocusFieldChange(this.props.slice, 'title')
  }

  handleFocusTime = () => {
    this.props.onFocusFieldChange(this.props.slice, 'time')
  }

  handleFocusTags = () => {
    this.props.onFocusFieldChange(this.props.slice, 'tags')
  }

  handleChangeTitle = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange({...this.props.slice, title: e.currentTarget.value})
  }

  handleChangeTime = (end:Time) => {
    this.props.onChange({...this.props.slice, end})
  }

  handleChangeTags = (tags: string[]) => {
    this.props.onChange({...this.props.slice, tags})
  }

  handleDelete = () => {
    this.props.onDelete(this.props.slice)
  }

}