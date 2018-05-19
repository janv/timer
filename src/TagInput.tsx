import * as React from "react";
import * as TagsInput from 'react-tagsinput'
import { findDOMNode } from "react-dom";

const EMPTY_TAGS:string[] = []

type Props = {
  tags: string[] | null | undefined
  onFocus: () => void
  onChange: (tags: string[]) => void
  onKeyDown: (e:React.KeyboardEvent<HTMLElement>) => void
}

export default class TagInput extends React.Component<Props> {
  render() {
    return (
      <div onKeyDown={this.handleKeyDownTags}>
        <TagsInput
          value={this.props.tags || EMPTY_TAGS}
          onChange={this.handleChange}
          inputProps={{
            onFocus: this.handleFocus,
            ref: this.inputRef,
          }}
          />
      </div>
    )
  }

  inputRef  = React.createRef<React.ReactInstance>()

  focus() {
    const element = findDOMNode(this.inputRef.current!) as HTMLInputElement
    element.focus()
  }

  handleKeyDownTags = (e:React.KeyboardEvent<HTMLDivElement>) => {
    this.props.onKeyDown(e)
  }

  handleFocus = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocus()
  }

  handleChange = (tags: string[], changed: string[], indexes: number[]) => {
    this.props.onChange(tags)
  }

}