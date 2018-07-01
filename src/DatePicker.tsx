import * as React from "react";
import {Input} from 'rebass-emotion'
import { Day } from "./Data";

interface Props {
  onChange: (date:Day) => void
  value: Day
}

export default class DatePicker extends React.Component<Props> {
  render() {
    return <Input
      type='date'
      onChange={this.handleChange}
      value={this.props.value.isoDateString}
      />
  }

  handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(new Day(e.currentTarget.value))
  }
}