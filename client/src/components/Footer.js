import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
      <footer className="page-footer light-blue accent-4">
        <div className="container">
          <div className="row">
            <div className="col l8 ">
              <h5 className="white-text">Company Bio</h5>
              <p className="grey-text text-lighten-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem asperiores iste natus, eos dignissimos vel porro quaerat dolor qui quam?
              </p>
            </div>

            <div className="col l3 offset-l1">
              <h5 className="white-text">Links</h5>
              <ul>
                <li><a className="white-text" href="#!">About</a></li>
                <li><a className="white-text" href="#!">Contact</a></li>
                <li><a className="white-text" href="#!">Contribute</a></li>
                <li><a className="white-text" href="#!">Terms of Use</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            © CraftiCards 2020
          </div>
        </div>
      </footer>
    )
  }
}
