import * as React from "react";
import * as AutoComplete from 'react-autocomplete'
import Input from "./components/Input";

interface WithApi extends AutoComplete {
  focus():void
  blur():void
}

interface Props {
  tags: string[]
  value: string
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e:React.KeyboardEvent<HTMLInputElement>) => void
  onFocus: (e:React.FocusEvent<HTMLInputElement>) => void
  addTag: (s:string) => void
}

export default class TagSuggest extends React.Component<Props> {
  autoCompleteRef = React.createRef<AutoComplete>()

  focus() {
    const as = this.autoCompleteRef.current as WithApi
    as.focus()
  }

  blur() {
    const as = this.autoCompleteRef.current as WithApi
    as.blur()
  }

  render() {
    return (
      <AutoComplete
        items={this.props.tags}
        getItemValue={this.getItemValue}
        renderItem={this.renderItem}
        ref={this.autoCompleteRef}
        value={this.props.value}
        onChange={this.props.onChange}
        onSelect={this.handleSelect}
        inputProps={this.inputProps}
        shouldItemRender={this.shouldItemRender}
        renderInput={this.renderInput}
      />
    )
  }

  renderInput(props:any) {
    const {ref, ...other} = props
    return <Input innerRef={ref} {...other}/>
  }

  inputProps = {
    onKeyDown: (e:React.KeyboardEvent<HTMLInputElement>) => {
      const isOpen = (this.autoCompleteRef.current!.state as any).isOpen
      if (!isOpen && e.key === 'Enter') {
          this.props.addTag(this.props.value)
          e.preventDefault()
      } else {
      }
      this.props.onKeyDown(e)
    },
    onFocus: (e:React.FocusEvent<HTMLInputElement>) => {
      this.props.onFocus(e)
    }
  }

  getItemValue(s:string) {
    return s
  }

  shouldItemRender = (item:string, value:string) => {
    const inputValue = (value && value.trim().toLowerCase()) || ''
    const inputLength = inputValue.length
    return inputLength > 0
      ? item.toLowerCase().slice(0, inputLength) === inputValue
      : true

  }


  renderItem(item:string, isHighLighted:boolean) {
    return isHighLighted
      ? <strong key={item}>{item}</strong>
      : <span key={item}>{item}</span>
  }

  handleSelect = (value:string, item: string) => {
    if (value.match(/:$/)) {
      this.props.onChange({target: {value}} as any)
    } else {
      this.props.addTag(value)
    }
  }
}