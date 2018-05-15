import * as moment from 'moment'
import {updateIn} from './util/icepick'

export function now() {
  return  moment().format('HH:mm:ss')
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
  start: string
  slices: Slice[]
}

export function createDays():{[day:string]: Day} {
  const today = moment().format('YYYY-MM-DD')
  return {
    [today]: {
      start: now(),
      slices:[
        {title: 'First Slice', end: now()}
      ]
    }
  }
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