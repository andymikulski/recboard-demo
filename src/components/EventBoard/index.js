import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router'
import CurrentEvents from './CurrentEvents';
import EventListing from './EventListing';
import QueryEventListing from './QueryEventListing';
import EventPoster from './EventPoster';

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

  static ColumnConfig = [{
    title: 'Name',
    dataIndex: 'eventName',
    key: 'name',
    render: text => <div>{text}</div>,
  }, {
    title: 'Poster',
    key: 'poster',
    render: (item) =>
      <EventPoster poster={item.eventPoster} />,
  }, {
    title: 'Hosts',
    key: 'hosts',
    render: (item) =>{
      const printedHosts = (item.eventHosts || []).map(host => <span>{host.label}</span>);
      return <div className="hosts-col">{printedHosts}</div>;
    }
  }, {
    title: 'Date',
    key: 'date',
    render: (item) => {
      const start = moment(item.startDateTime).format('l');
      const end = moment(item.endDateTime).format('l');

      // Titles are applied to times, so on hover they reveal the full date.
      const tipFormat = 'dddd, MMMM Do YYYY, h:mm a';
      const startTip = moment(item.startDateTime).format(tipFormat);
      const endTip = moment(item.endDateTime).format(tipFormat);

      return (
        <div className="date-col">
          <span title={startTip}>{start}</span> &ndash; <span title={endTip}>{end}</span>
        </div>
      )
    },
  }, {
    title: '',
    key: 'action',
    render: (item) =>
      <Link to={`/events/${item.id}`}><Button size="small">View Details</Button></Link>,
  }];

  static TimeUntilCol = {
    title: 'Starts In',
    key: 'time-until',
    render: (item) => {
      const start = moment(item.startDateTime);
      const timeUntil = start.fromNow(true);
      const titleCase = timeUntil[0].toUpperCase() + timeUntil.substring(1);
      return titleCase;
    },
  }

  updateListing(listing) {
    this.setState({ ...listing });
  }

  render() {
    // <EventSearch />
    return (
      <div className="event-board">
        <QueryEventListing onLoad={this.updateListing} />
        <Link to={`events/new`}><Button type="primary">Create An Event</Button></Link>
        <CurrentEvents list={this.state.current} />
        <EventListing
          columns={EventBoard.ColumnConfig.concat([EventBoard.TimeUntilCol])}
          title="Upcoming Events"
          list={this.state.upcoming}
        />
        <EventListing
          columns={EventBoard.ColumnConfig}
          title="Past Events"
          list={this.state.past}
        />
      </div>
    );
  }
}
