import {findDOMNode} from 'react-dom';
import * as React from "react";
import {Input, Flex, Button} from 'rebass-emotion'
import {Slice as ISlice, increment} from './Data'
import TagInput from './TagInput';

type Props = {
  slice: ISlice
  focus?: 'title'|'time'|'tags'
  onFocusUp: () => void
  onFocusDown: () => void
  onFocusFieldChange: (slice:ISlice, field:'title'|'time'|'tags') => void
  onChange: (slice: ISlice) => void
  onDelete: (slice: ISlice) => void
}

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

  titleRef = React.createRef<React.ReactInstance>()
  timeRef  = React.createRef<React.ReactInstance>()
  tagsRef  = React.createRef<TagInput>()

  render() {
    return (
        <Flex align="center">
            <Input
              ref={this.titleRef}
              value={this.props.slice.title}
              placeholder="Input"
              onKeyDown={this.handleKeyDownTitle}
              onFocus={this.handleFocusTitle}
              onChange={this.handleChangeTitle}
            />
            <Input
              ref={this.timeRef}
              value={this.props.slice.end}
              onKeyDown={this.handleKeyDownTime}
              onFocus={this.handleFocusTime}
              onChange={this.handleChangeTime}
            />
            <TagInput
              tags={this.props.slice.tags}
              onChange={this.handleChangeTags}
              onFocus={this.handleFocusTags}
              onKeyDown={this.handleKeyDownTags}
              ref={this.tagsRef}
            />
            <Button onClick={this.handleDelete}>X</Button>
        </Flex>
    )
  }

  handleKeyDownTitle = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      this.props.onFocusUp()
    } else if (e.key === 'ArrowDown') {
      this.props.onFocusDown()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      this.props.onFocusFieldChange(this.props.slice, 'time')
    }
  }

  handleKeyDownTags = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      this.props.onFocusUp()
    } else if (e.key === 'ArrowDown') {
      this.props.onFocusDown()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      this.props.onFocusFieldChange(this.props.slice, 'title')
    }
  }

  handleKeyDownTime = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      this.props.onChange({
        ...this.props.slice,
        end: increment(this.props.slice.end, -5)
      })
    } else if (e.key === 'ArrowDown') {
      this.props.onChange({
        ...this.props.slice,
        end: increment(this.props.slice.end, 5)
      })
    } else if (e.key === 'Tab') {
      e.preventDefault()
      this.props.onFocusFieldChange(this.props.slice, 'tags')
    }
  }

  handleFocusTitle = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocusFieldChange(this.props.slice, 'title')
  }

  handleFocusTime = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocusFieldChange(this.props.slice, 'time')
  }

  handleFocusTags = () => {
    this.props.onFocusFieldChange(this.props.slice, 'tags')
  }

  handleChangeTitle = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange({...this.props.slice, title: e.currentTarget.value})
  }

  handleChangeTime = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange({...this.props.slice, end: e.currentTarget.value})
  }

  handleChangeTags = (tags: string[]) => {
    this.props.onChange({...this.props.slice, tags})
  }

  handleDelete = () => {
    this.props.onDelete(this.props.slice)
  }

}