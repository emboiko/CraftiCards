import React, { Component } from 'react'
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";

export default class Footer extends Component {
  render() {
    return (
      <footer className="page-footer blue-grey darken-3">
        <div className="container">
          <div className="row">
            <div className="col l6">
              <Link to="/" id="logo-container" className="brand-logo hide-on-med-and-down">
                <img className="smaller" src={logo} alt="CraftiCards" />
              </Link>
            </div>
            <div className="col l6">
              <h5 className="white-text">Links</h5>
              <ul>
                <li><Link className="white-text show-on-small" to="/">Home</Link></li>
                <li><Link className="white-text" to="/about">About</Link></li>
                <li><Link className="white-text" to="/contact">Contact</Link></li>
                <li><Link className="white-text" to="/contribute">Contribute</Link></li>
                <li><Link className="white-text" to="/tos">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            © 2020 CraftiCards
          </div>
        </div>
      </footer>
    )
  }
}
