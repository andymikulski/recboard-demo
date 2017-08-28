import React, { Component } from 'react';
import { Link } from 'react-router'

import './styles.css';

export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <h1>Welcome!</h1>
        <p><b>This is a demo website developed for Against Gravity, prepared by Andy Mikulski.</b></p>
        <p>This page will contain information on the project and will be updated as I write it.</p>
      </div>
    );
  }
}
