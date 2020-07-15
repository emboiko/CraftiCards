import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Loading from "./utils/Loading";
import axios from "axios";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { rsvps: [], loading: true };
  }

  componentDidMount = async () => {
    document.title = "CraftiCards | Dashboard";
    const req = await axios.get("/rsvps");
    if (req.status === 200) this.setState({ rsvps: req.data.rsvps, loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="container">
          <Loading />
        </div>
      );
    } else {
      const rsvps = this.state.rsvps.map((rsvp, i) => {
        return (
          <Link to={`/cc/${rsvp.id}`} key={i}>{rsvp.title}</Link>
        );
      })

      return (
        <div className="container">
          <h1 className="center">Dashboard</h1>
          {rsvps}
        </div>
      );
    }
  }
}
