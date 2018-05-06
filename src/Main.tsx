import * as React from 'react'
import {Input, Flex, Container} from 'rebass-emotion'

export default class Main extends React.Component {
  render() {
    return <Container m={3}>
      <Flex align="center">
        <Input
          defaultValue="Hello"
          placeholder="Input"
        />
        Start
      </Flex>
    </Container>
  }
}