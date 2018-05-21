import * as React from "react";
import * as TagsInput from 'react-tagsinput'
import { RenderInputProps } from "react-tagsinput";
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
import TagSuggest from "./TagSuggest";

const SUGGESTIONS = [
  'type:',
  'type:dev',
  'type:team-lead',
  'type:admin',
  'source:project',
  'source:slack-time',
  'source:bug',
  'source:peer',
  'source:mgmt',
]

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
          renderInput={this.renderInput}
          ref={this.inputRef}
          inputProps={{
            onFocus: this.handleFocus,
          }}
          />
      </div>
    )
  }

  inputRef = React.createRef<TagsInput>()

  focus() {
    this.inputRef.current!.focus()
  }

  handleKeyDownTags = (e:React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.isDefaultPrevented()) {
      this.props.onKeyDown(e)
    }
  }

  handleFocus = (e:React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocus()
  }

  handleChange = (tags: string[], changed: string[], indexes: number[]) => {
    this.props.onChange(tags)
  }

  renderInput = (props:RenderInputProps) => {
    return <TagSuggest
      tags={SUGGESTIONS}
      value={props.value}
      onChange={props.onChange}
      addTag={props.addTag}
      ref={props.ref}
      onKeyDown={props.onKeyDown}
    />
  }

}
