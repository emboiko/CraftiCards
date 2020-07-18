import React, { Component } from 'react';
import axios from "axios";

export default class DeleteRSVP extends Component {
  componentDidMount = async () => {
    try {
      // probe the api with an empty patch request to see if we own this rsvp:
      await axios.patch(`/rsvp/${this.props.match.params.id}`);
    } catch (err) {
      return this.props.history.push("/not_found");
    }
    document.title = "CraftiCards | Delete RSVP";
    window.scrollTo(0, 0);
  }

  cancel = () => this.props.history.goBack();

  deleteRSVP = async () => {
    await axios.delete(`/rsvp/${this.props.match.params.id}`);
    this.props.history.push("/dashboard");
  }

  render() {
    return (
      <div className="container ">
        <div className="center-align">
          <h3>Are you sure?</h3>
          <p>This RSVP will be permantently deleted.</p>
          <small>This cannot be reversed</small>
          <div className="button-box">
            <br />
            <button className="btn blue-grey mright" onClick={this.cancel}>
              Cancel
          </button>
            <button className="btn red mleft" onClick={this.deleteRSVP}>
              Delete
          </button>
          </div>
        </div>
      </div>
    );
  }
}
