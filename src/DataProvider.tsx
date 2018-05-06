import * as React from 'react'
import { createDay, Day } from './Data';

export class Backend {
  day: Day = createDay()
  timerRunning = false
}

export const {Provider, Consumer} = React.createContext<Backend>(new Backend())