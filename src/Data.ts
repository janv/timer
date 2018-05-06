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
    start: '',
    slices:[
      {title: '', end: ''}
    ]
  }
}

export function appendSlice(day: Day):Day {
  return {
    ...day,
    slices: [...day.slices, {title: '', end:'now'}]
  }
}

// todo running slice ist die letzte, wenn der timer weiterläuft