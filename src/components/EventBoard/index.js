import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router'
import CurrentEvents from './CurrentEvents';
import UpcomingEvents from './UpcomingEvents';
import PastEvents from './PastEvents';
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
    past: [],
  };

  // Processes the listing given back from the api and determines what should
  // be shown where.
  updateListing(listing) {
    const now = moment();

    let current = [];
    let upcoming = [];
    let past = [];

    listing.forEach(item=>{
      console.log('hi', item.startDateTime, item.endDateTime);
      const eventStart = moment(item.startDateTime);

      const hasntHappenedYet = now.isBefore(eventStart);
      const isHappeningNow = now.isAfter(moment(item.startDateTime)) && now.isBefore(moment(item.endDateTime));
      const alreadyHappened = now.isAfter(moment(item.endDateTime));

      if (hasntHappenedYet) {
        upcoming.push(item);
      } else if (isHappeningNow) {
        current.push(item);
      } else if (alreadyHappened) {
        past.push(item);
      }
    });

    this.setState({
      upcoming,
      current,
      past,
    });
  }

  render() {
    // <EventSearch />
    return (
      <div className="event-board">
        <QueryEventListing onLoad={this.updateListing} />
        <Link to={`events/new`}><Button type="primary">Create An Event</Button></Link>;
        <CurrentEvents list={this.state.current} />
        <UpcomingEvents list={this.state.upcoming} />
        <PastEvents list={this.state.past} />
      </div>
    );
  }
}
