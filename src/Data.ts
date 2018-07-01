import * as moment from 'moment'
import {updateIn} from './util/icepick'
import * as uuid from 'uuid/v4'

export interface Slice {
  readonly id: string
  title: string
  end : Time
  tags: string[]
}

export interface TodoItem {
  readonly id:string
  title: string
}

export class Day {
  static FORMAT = 'YYYY-MM-DD'
  static today() {
    return new Day(moment().format(Day.FORMAT))
  }
  constructor(isoDateString:string) {
    this.isoDateString = isoDateString
  }
  readonly isoDateString: string

  now():Time {
    let x = Time.now().isoDateTimeString.split('T')
    x[0] = this.isoDateString
    return new Time(x.join('T'))
  }

  toJSON() {
    return {_isDay: true, isoDateString:this.isoDateString}
  }

  static fromJSON(json:any) {
    return new Day(json.isoDateString)
  }
}

export class Time {
  static FORMAT = 'YYYY-MM-DDTHH:mm'

  static now() {
    const m = moment()
    const mod = m.minutes() % 5
    if (mod == 0) {
      // do nothing
    } else if (mod < 3 ) {
      m.subtract(mod, 'minutes')
    } else {
      m.add(5-mod, 'minutes')
    }
    return  new Time(m.format(Time.FORMAT))
  }

  constructor(isoString:string) {
    this.isoDateTimeString = isoString
  }
  readonly isoDateTimeString: string

  increment(inc:-5|5|0) {
    const m = moment(this.isoDateTimeString)
    const minutes = m.get('minutes')
    m.add(inc - minutes % 5, 'minutes')
    return  new Time(m.format(Time.FORMAT))
  }

  isOn(day:Day) {
    return this.isoDateTimeString.indexOf(day.isoDateString) === 0
  }

  set(time:string) {
    const m = moment(this.isoDateTimeString)
    const dayString = m.format(Day.FORMAT)
    return  new Time(dayString + 'T' + time)
  }

  get():string {
    return moment(this.isoDateTimeString).format('HH:mm')
  }

  toJSON() {
    return {_isTime:true, isoDateTimeString: this.isoDateTimeString}
  }

  static fromJSON(json:any) {
    return new Time(json.isoDateTimeString)
  }

  toString(){
    return 'Time('+this.isoDateTimeString+')'
  }
}

export function makeSlice(title:string, end:Time = Time.now()):Slice {
  return {id: uuid(), title, end, tags:[]}
}

export function makeTodoItem(title:string):TodoItem {
  return {id: uuid(), title}
}

export function appendSlice<T extends{slices: Slice[], date:Day}>(state:T, title = ''):T {
  return {...state as any, slices: [...state.slices, makeSlice(title, state.date.now())]}
}

export function updateSlice(slices: Slice[], sliceNumber:number, update:Partial<Slice>):Slice[] {
  const i = sliceNumber >= 0 ? sliceNumber : slices.length+sliceNumber
  return updateIn(slices, [i], slice => ({...slice, ...update}))
  }