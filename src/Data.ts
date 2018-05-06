import * as moment from 'moment'

function now() {
  return  moment().format('HH:mm')
}


interface Slice {
  title: string
  category?: string
  end: string
}

export interface Day {
  start: string
  slices: Slice[]
}

export function createDay():Day {
  return {
    start: now(),
    slices:[
      {title: 'First Slice', end: now()}
    ]
  }
}

export function appendSlice(day: Day):Day {
  return {
    ...day,
    slices: [...day.slices, {title: 'New slice', end:now()}]
  }
}

// todo running slice ist die letzte, wenn der timer weiterläuft