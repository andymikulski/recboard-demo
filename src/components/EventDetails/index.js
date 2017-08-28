import React, { Component } from 'react';
import { message, Button } from 'antd';
import { Link } from 'react-router'
import QueryEventDetails from './QueryEventDetails';
import autobind from 'autobind-decorator';
import EventPoster from '../EventBoard/EventPoster';
import DetailContents from './DetailContents';
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

  handleFailedLoad() {
    message.error('Sorry, something went wrong loading this event. Try again later.');
  }

  render() {
    const {
      details,
    } = this.state;

    return (
      <div className="event-details">
        <QueryEventDetails
          id={this.props.routeParams.id}
          onLoad={this.handleEventLoad}
          onFailedLoad={this.handleFailedLoad}
        />
        { details &&
          <DetailContents details={{ ...details }} />
        }
      </div>
    );
  }
}
