import * as React from "react";
import * as AutosuggestG from 'react-autosuggest'
import {css} from 'emotion'
import { OnSuggestionSelected, SuggestionsFetchRequested } from "react-autosuggest";

const Autosuggest:new()=>AutosuggestG<string> = AutosuggestG as any

const suggestStyle = {
  suggestionHighlighted: css({ backgroundColor: 'silver' })
}

interface WithInput extends AutosuggestG {
  input: HTMLInputElement
}

interface Props {
  tags: string[]
  value: string
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void
  addTag: (s:string) => void
}

interface State {
  suggestions: string[]
}

export default class TagSuggest extends React.Component<Props, State> {
  state:State = {
    suggestions: [],
  }

  asRef = React.createRef<AutosuggestG>()

  focus() {
    const as = this.asRef.current as WithInput
    as.input.focus()
  }

  blur() {
    const as = this.asRef.current as WithInput
    as.input.blur()
  }

  render() {
    return (
      <Autosuggest
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.fetchSuggestions}
        onSuggestionsClearRequested={this.clearSuggestions}
        getSuggestionValue={this.getSuggestionValue}
        onSuggestionSelected={this.handleSuggestionSelected}
        ref={this.asRef}
        inputProps={{
          value: this.props.value,
          onChange: this.props.onChange,
        }}
        renderSuggestion={this.renderSuggestion}
        theme={suggestStyle}
      />
    )
  }

  getSuggestionValue(s:string) {
    return s
  }

  renderSuggestion(s:string) {
    return <span>{s}</span>
  }

  shouldRenderSuggestions() {
    return true
  }

  handleSuggestionSelected:OnSuggestionSelected<string> = (e, {suggestion}) => {
    this.props.addTag(suggestion)
  }

  clearSuggestions = () => {
    this.setState({suggestions: []})
  }

  fetchSuggestions:SuggestionsFetchRequested = ({value, reason}) => {
    const inputValue = (value && value.trim().toLowerCase()) || ''
    const inputLength = inputValue.length
    let suggestions = inputLength > 0
      ? this.props.tags.filter((tag) => ( tag.toLowerCase().slice(0, inputLength) === inputValue))
      : this.props.tags

    this.setState({suggestions})

    switch (reason) {
      case 'input-focused':
        this.setState({suggestions: []})
        return
      case 'suggestions-revealed':
      case 'input-changed':
      case 'escape-pressed':
        this.setState({suggestions})
        // return
      // case 'suggestion-selected':

      //   break;

      // default:
      //   break;
    }
  }
}