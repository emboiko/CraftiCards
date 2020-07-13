import React, { Component } from 'react';
import axios from 'axios';
import Loading from "./utils/Loading";
import ReplyRSVP from "./utils/ReplyRSVP";
import favicon from "../img/favicon.png";

export default class ReadRSVP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      location: "",
      date: "",
      rsvp_by: "",
      time: "",
      end_time: "",
      author: "",
      author_email: "",
      author_phone: "",
      img: "",
      id: "",
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
      rsvpBy: res.data.rsvp_by,
      time: res.data.time,
      endTime: res.data.end_time,
      author: res.data.author,
      authorEmail: res.data.author_email,
      authorPhone: res.data.author_phone,
      id: res.data.id,
      qr: res.data.qr,
      numGuests: res.data.num_guests,
      joined: res.data.joined,
    });
    this.setState({
      img: `/rsvp/${this.state.id}/img?` + new Date().getTime()
    });
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
          this.state.end_time ?
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

          {/* <button >Show the guest-list</button>

          <div class="guestlist">
            <ul class="partylist center-text">
              {this.state.joined.forEach((party) => {
                return <li>{party.party}</li>
              })}
            </ul>
          </div> */}

          <ReplyRSVP />
        </div>
      );
    }
  }
}
