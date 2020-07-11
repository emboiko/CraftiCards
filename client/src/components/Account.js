import React, { Component } from 'react'

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }

  componentDidMount() {
    this.setState({ user: this.props.user })
  }

  render() {
    console.log(this.state.user);
    return (
      <div>
      </div>
    )
  }
}
