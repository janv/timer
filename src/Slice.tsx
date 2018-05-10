import React from "react";
import {Input, Flex, Divider, Container} from 'rebass-emotion'
import {Slice as ISlice} from './Data'

type Props = {
  slice: ISlice
}

export default class Slice extends React.Component<Props> {
  render() {
    return (
        <Flex align="center">
            <Input
              defaultValue={this.props.slice.title}
              placeholder="Input"
            />
            <Input value={this.props.slice.end} readOnly/>
            Start
        </Flex>
    )
  }
}