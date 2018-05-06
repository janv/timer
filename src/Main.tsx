import * as React from 'react'
import {Input, Flex, Container} from 'rebass-emotion'
import {Consumer as DataConsumer} from './DataProvider'

export default class Main extends React.Component {
  render() {
    return (
    <DataConsumer>
      {({day}) => (
        <Container m={3}>
          <Flex align="center">
            {day.slices.map((slice, i) => (
              <Input
                key={i}
                defaultValue={slice.title}
                placeholder="Input"
              />
            ))}
            Start
          </Flex>
        </Container>
      )}
    </DataConsumer>

    )
  }
}