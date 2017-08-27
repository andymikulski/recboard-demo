import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router'
import CurrentEvents from './CurrentEvents';
import UpcomingEvents from './UpcomingEvents';
import EventSearch from './EventSearch';
import QueryEventListing from './QueryEventListing';
import autobind from 'autobind-decorator';
import moment from 'moment';
import './styles.css';

@autobind
export default class EventBoard extends Component {
  state = {
    current: [],
    upcoming: [],
  };

  updateListing(listing) {
    const now = moment();

    // Force a new array to be returned to ensure a render.
    const current = [].concat(listing.filter(event=>{
      return false;
    }));

    this.setState({

    });
  }

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
