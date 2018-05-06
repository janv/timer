import * as React from 'react'
import {Input, Flex, Container} from 'rebass-emotion'
import {Consumer as DataConsumer} from './DataProvider'

export default class Main extends React.Component {
  render() {
    return (
    <DataConsumer>
      {({day}) => (
        <Container m={3}>
          {day.slices.map((slice, i) => (
            <Flex align="center" key={i}>
                <Input
                  defaultValue={slice.title}
                  placeholder="Input"
                />
                <Input value={slice.end} readOnly/>
                Start
            </Flex>
          ))}
        </Container>
      )}
    </DataConsumer>

    )
  }
}