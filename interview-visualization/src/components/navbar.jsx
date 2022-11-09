import React from "react";
import {Link} from "react-router-dom";
//import Button from "@material-ui/core/Button"
//import logo from '../cirvr-logo.png';
import '../bootstrap.min.css';

const NavigationBar=()=> {
    return (
        <div className="App">

        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
          <Link className="navbar-brand" to="/">CIRVR Studio</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor03">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">Clients</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">Pricing</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">About</Link>
              </li>
            </ul>
            
        </div>
        </nav>
        </div>
            
          
    );
};

export default NavigationBar;
