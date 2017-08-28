import React, { Component } from 'react';
import { message, Button } from 'antd';
import { Link } from 'react-router'
import QueryEventDetails from './QueryEventDetails';
import autobind from 'autobind-decorator';
import EventPoster from '../EventBoard/EventPoster';
import { browserHistory } from 'react-router';
import './styles.css';

@autobind
export default class EventDetails extends Component {
  state = {
    details: null,
  };

  handleEventLoad(details) {
    if (!details) {
      message.error('No event found with that ID!');
      browserHistory.push(`/events`);
    }
    this.setState({
      details,
    });
  }

  render() {
    console.log('ok', this.state.details);
    return (
      <div className="event-details">
        <QueryEventDetails id={this.props.routeParams.id} onLoad={this.handleEventLoad} />
        { this.state.details &&
          <div>
            <EventPoster poster={this.state.details.eventPoster} />
          </div>
        }
      </div>
    );
  }
}
