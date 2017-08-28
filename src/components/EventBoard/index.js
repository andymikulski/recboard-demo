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

  combineDateTime(date, time){
    if (!(date instanceof moment)){
      date = moment(date);
    }
    if (!(time instanceof moment)){
      time = moment(time);
    }
    const combined = moment();

    combined.year(date.year());
    combined.month(date.month());
    combined.date(date.date()); // Date!...Date..!...Date....!
    combined.hour(time.hour());
    combined.minute(time.minute());

    return combined;
  }

  // Processes the listing given back from the api and determines what should
  // be shown where.
  updateListing(listing) {
    const now = moment();

    let current = [];
    let upcoming = [];
    let past = [];

    listing.forEach(item=>{
      // figure out a single date from the event's date and times
      // this should be done somewhere else
      const startDateTime = this.combineDateTime(item.eventStartDate, item.eventStartTime);
      const endDateTime = this.combineDateTime(item.eventEndDate, item.eventEndTime);

      const hasntHappenedYet = now.isBefore(startDateTime);
      const isHappeningNow = now.isAfter(startDateTime) && now.isBefore(endDateTime);
      const alreadyHappened = now.isAfter(endDateTime);
      
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
    return (
      <div className="event-board">
        <QueryEventListing onLoad={this.updateListing} />
        <Link to={`events/new`}><Button type="primary">Create An Event</Button></Link>;
        <EventSearch />
        <CurrentEvents list={this.state.current} />
        <UpcomingEvents list={this.state.upcoming} />
        <PastEvents list={this.state.past} />
      </div>
    );
  }
}
