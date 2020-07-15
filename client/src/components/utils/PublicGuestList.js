import React, { Component } from 'react';

export default class PublicGuestList extends Component {
  constructor(props) {
    super(props);
    this.state = { showing: false };
  }

  handleClick = () => this.setState({ showing: !this.state.showing });

  render() {
    const joined = this.props.joined.map((party, i) => {
      return <li key={i}>{party.party}</li>
    });

    if (this.props.joined.length) {
      return (
        <div>
          <button className="btn blue-grey darken-3" onClick={this.handleClick}>Guest-List</button>
          <div className={this.state.showing ? "" : "hide"}>
            <ul>
              {joined}
            </ul>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }
}
