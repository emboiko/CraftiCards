import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "./utils/Loading";
import defaultCardImg from "../img/favicon.png";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { rsvps: [], loading: true };
  }

  componentWillUnmount = () => {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  componentDidMount = async () => {
    const req = await axios.get("/rsvps");
    if (req.status === 200) this.setState({ rsvps: req.data.rsvps, loading: false });
    document.title = "CraftiCards | Dashboard";
    window.scrollTo(0, 0);
  }

  handleBrokenImage = (e) => e.target.src = defaultCardImg;

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
          <div key={i} className="card sticky-action">
            <div className="card-image padded waves-effect waves-block waves-light">
              <img
                className="activator card-img"
                onError={this.handleBrokenImage}
                src={`/rsvp/${rsvp.id}/img`}
                alt="Crafticard"
              />
            </div>
            <div className="card-content">
              <h5 className="center">{rsvp.title}</h5>
              <i className="material-icons activator right">more_vert</i>
              <br />
            </div>
            <div className="card-action">
              <div className="center">
                <Link
                  className="waves-effect waves-light blue-grey darken-3 btn card-btn mbottom"
                  to={`/cc/${rsvp.id}`}
                >
                  View
                  <i className="material-icons right">visibility</i>
                </Link>
                <Link
                  className="waves-effect waves-light blue-grey darken-3 btn card-btn mright mleft mbottom"
                  to={`/cc/${rsvp.id}/edit`}
                >
                  Edit
                  <i className="material-icons right">edit</i>
                </Link>
                <Link
                  className="waves-effect waves-light red btn card-btn mbottom"
                  to={`/cc/${rsvp.id}/delete`}
                >
                  <i className="material-icons right">delete</i>
                  Delete
                </Link>
              </div>
            </div>
            <div className="card-reveal">
              <span className="card-title grey-text text-darken-4"><i className="material-icons right">close</i></span>
              <br />
              <h5 className="center">{rsvp.title}</h5>
              <div className="dboard-qr">
                <img className="qr" src={rsvp.qr} alt="Crafticards QR-code" />
                <p className="center">
                  {rsvp.pin}
                </p>
              </div>
            </div>
          </div>
        );
      });

      return (
        <div className="container">
          <div className="center">
            <h2>Dashboard</h2>
            <Link to="/cc" className="waves-effect waves-light blue-grey darken-3 btn mbottom"><i className="material-icons right">add_box</i>New RSVP</Link>
          </div>
          <div className="row">
            <div className="col s8 offset-s2">
              {rsvps}
            </div>
          </div>
        </div>
      );
    }
  }
}
