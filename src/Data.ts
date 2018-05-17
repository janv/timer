import * as moment from 'moment'
import {updateIn} from './util/icepick'

export function now() {
  return  moment().format('HH:mm')
}

export function increment(time:string, inc:-5|5) {
  const currentDate = moment().format('YYYY-MM-DD')
  const m = moment(currentDate + ' ' + time)
  const minutes = m.get('minutes')
  m.add(inc - minutes % 5, 'minutes')
  return m.format('HH:mm')
}

export interface Slice {
  title: string
  category?: string
  end: string
}

export interface TodoItem {
  title: string
}

export interface Day {
  slices: Slice[]
}

export function appendSlice(day: Day, title = ''):Day {
  return {
    ...day,
    slices: [...day.slices, {title, end:now()}]
  }
}

export function updateSlice(day: Day, sliceNumber:number, update:Partial<Slice>):Day {
  const i = sliceNumber >= 0 ? sliceNumber : day.slices.length+sliceNumber
  return updateIn(day, ['slices', i], slice => ({...slice, ...update}))
  }

// todo running slice ist die letzte, wenn der timer weiterläuft