import * as React from 'react'
import {Input, Flex, Container} from 'rebass-emotion'

export default class Main extends React.Component {
  render() {
    return <Container m={3}>
      <Flex alignItems="center">
        <Input
          defaultValue="Hello"
          placeHolder="Input"
        />
        Start
      </Flex>
    </Container>
  }
}