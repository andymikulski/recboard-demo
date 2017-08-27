import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router'
import CurrentEvents from './CurrentEvents';
import UpcomingEvents from './UpcomingEvents';
import EventSearch from './EventSearch';
import QueryEventListing from './QueryEventListing';

import './styles.css';

export default class EventBoard extends Component {
  state = {
    current: [],
    upcoming: [],
  };

  render() {
    return (
      <div className="event-board">
        <QueryEventListing onLoad={this.updateListing} />
        <Link to={`events/new`}><Button type="primary">Create An Event</Button></Link>;
        <EventSearch />
        <CurrentEvents />
        <UpcomingEvents />
      </div>
    );
  }
}
