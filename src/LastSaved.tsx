import * as React from 'react'
import * as moment from 'moment'

export default class LastSaved extends React.Component<{lastSaved?: Date}, {renderedDate:string}> {
  state = {
    renderedDate: 'never'
  }

  static getDerivedStateFromProps(nextProps:LastSaved['props']) {
    return ({
      renderedDate: nextProps.lastSaved
        ? moment(nextProps.lastSaved).fromNow()
        : 'never'
    })
  }

  render() {
    return `Last Saved: ${this.state.renderedDate}`
  }

  private timer:number

  componentDidMount() {
    this.timer = window.setInterval(this.updateRenderedText, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  updateRenderedText = () => {
    this.setState(LastSaved.getDerivedStateFromProps(this.props))
  }
}