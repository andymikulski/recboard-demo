import React, { Component } from 'react';
import { Link } from 'react-router'

import './styles.css';

export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <h1> woooooo </h1>
        <Link to={'/inbox'}>Inbox</Link>
        <div style={{ height: "5000px" }}>ok</div>
      </div>
    );
  }
}
