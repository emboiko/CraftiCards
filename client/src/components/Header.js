import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

export default class Header extends Component {
  logout = async () => {
    await axios.post("/users/logout");
    window.location.href = "/";
  }

  render = () => {
    let userLinks;

    if (this.props.user) {
      userLinks = <>
        <li className="mright">
          <Link to="/account">
            {this.props.user.first_name}
          </Link>
        </li>
        <li>
          <button className="light-blue darken-4 waves-effect waves-light btn-small" onClick={this.logout} >Logout</button>
        </li>
      </>
    } else {
      userLinks = <>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </>
    }

    return (
      <header className="page-header">
        <nav className="light-blue accent-4" role="navigation">
          <div className="nav-wrapper container">
            <Link id="logo-container" to="/" className="brand-logo">
              Logo
            </Link>
            <ul className="right">
              {userLinks}
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
