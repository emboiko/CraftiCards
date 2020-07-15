import React, { Component } from 'react';
import axios from 'axios';
import Loading from "./utils/Loading";
import ReplyRSVP from "./utils/ReplyRSVP";
import PublicGuestList from "./utils/PublicGuestList";
import favicon from "../img/favicon.png";

export default class ReadRSVP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      location: "",
      date: "",
      rsvpBy: "",
      time: "",
      endTime: "",
      author: "",
      authorEmail: "",
      authorPhone: "",
      pin: "",
      img: "",
      id: "",
      joined: ""
    }
  }

  componentDidMount = async () => {
    let res;
    try {
      res = await axios.get(`/rsvp/${this.props.match.params.id}`);
    } catch (err) {
      this.props.history.push("/not_found");
    }
    this.setState({
      title: res.data.title,
      description: res.data.description,
      location: res.data.location,
      date: res.data.date,
      rsvpBy: res.data.rsvpBy,
      time: res.data.time,
      endTime: res.data.endTime,
      author: res.data.author,
      authorEmail: res.data.authorEmail,
      authorPhone: res.data.authorPhone,
      pin: res.data.pin,
      id: res.data.id,
      qr: res.data.qr,
      numGuests: res.data.numGuests,
      joined: res.data.joined,
    });
    this.setState({
      img: `/rsvp/${this.state.id}/img?` + new Date().getTime()
    });
    document.title = `CraftiCards | ${this.state.title}`;
  }

  handleBrokenImage = (e) => {
    e.target.src = favicon;
  }

  render() {
    if (!this.state.id) {
      return (
        <div className="container">
          <Loading />
        </div>
      );
    } else {
      const options = {
        timeZone: 'UTC',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric'
      }

      const date = new Date(this.state.date);
      const dateDisplay = <p>
        {date.getUTCMonth() + 1}
        /
        {date.getUTCDate()}
        /
        {date.getUTCFullYear()}
      </p>

      const timeDisplay = <p >
        {
          new Date('1970-01-01T' + this.state.time + 'Z')
            .toLocaleTimeString({}, options)
        }

        {
          this.state.endTime ?
            " - " + new Date('1970-01-01T' + this.state.endTime + 'Z')
              .toLocaleTimeString({}, options)
            :
            ""
        }
      </p>

      const rsvpBy = new Date(this.state.rsvpBy);
      const rsvpByDisplay = <small>RSVP by:<br />
        {rsvpBy.getUTCMonth() + 1}
        /
        {rsvpBy.getUTCDate()}
        /
        {rsvpBy.getUTCFullYear()}
      </small>


      return (
        <div className="container center">

          <h2>
            {this.state.title}
          </h2>

          <img onError={this.handleBrokenImage} src={this.state.img} alt="rsvp" />

          <hr />

          <p>
            {this.state.description}
          </p>
          <p >
            {this.state.location}
          </p>

          {dateDisplay}

          {timeDisplay}

          {rsvpByDisplay}

          <p>
            {this.state.author}
          </p>
          <p>
            {this.state.authorEmail}
          </p>
          <p>
            {this.state.authorPhone}
          </p>
          <p>
            {this.state.joined.length} parties registered
            |&nbsp;
          {this.state.numGuests} total guests.
          </p>

          <PublicGuestList joined={this.state.joined} />

          <ReplyRSVP
            id={this.state.id}
            pin={this.state.pin}
            history={this.props.history}
          />
        </div>
      );
    }
  }
}
