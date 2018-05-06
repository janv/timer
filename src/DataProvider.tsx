import * as React from 'react'
import { createDay, Day } from './Data';

interface Backend {
  day: Day
  timerRunning: boolean
}


export const {Provider, Consumer} = React.createContext<Backend>({
  day: createDay(),
  timerRunning: false
})