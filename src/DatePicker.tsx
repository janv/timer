import * as React from "react";
import {Input} from 'rebass-emotion'

interface Props {
  onChange: (date:string) => void
  value: string
}

export default class DatePicker extends React.Component<Props> {
  render() {
    return <Input
      type='date'
      onChange={this.handleChange}
      value={this.props.value}
      />
  }

  handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.currentTarget.value)
  }
}