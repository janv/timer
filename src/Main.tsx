import * as React from 'react'
import {Input, Flex, Container} from 'rebass-emotion'
import { createDay, Day, updateSlice, now } from './Data';

interface State {
  day: Day
  timerRunning: boolean
  interval?: number
}

export default class Main extends React.Component<{}, State> {
  state:State = {
    day: createDay(),
    timerRunning: false
  }

  componentDidMount(){
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    return (
      <Container m={3}>
        {this.state.day.slices.map((slice, i) => (
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
    )
  }

  startTimer() {
    this.setState({
      timerRunning: true,
      //todo only when day has slice
      interval: window.setInterval(this.timerUpdate, 1000)
    })
  }

  stopTimer() {
    this.setState(state => {
      clearInterval(state.interval)
      return {timerRunning: false}
    })
  }

  private timerUpdate = () => {
    // console.log('ding', this.day.slices[0])
    this.setState({
      day: updateSlice(this.state.day, -1, {end: now()})
    })
  }

}