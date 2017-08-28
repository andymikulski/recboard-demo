import React, { Component } from 'react';
import moment from 'moment';
import { Card, Button } from 'antd';
import { Link } from 'react-router'
import EventPoster from './EventPoster';
import './styles.css';

const data = [{
  id: 123,
  name: 'Dev Sandbox Mode Q+A',
  endsAt: Date.now() + 10000,
}, {
  id: 324,
  name: 'Cosplay Contest',
  endsAt: Date.now() + 25000,
}, {
  id: 555,
  name: 'Ready Player One Discussion',
  endsAt: Date.now() + 50000,
}];

const ViewMore = ({ url })=><Link to={`events/${url}`}><Button type="primary" size="small">Details</Button></Link>;

export default class CurrentEvents extends Component {
  static defaultProps = {
    list: [],
  };

  render() {
    const { list } = this.props;
    if(!list || !list.length) {
      return null;
    }
    
    return (
      <div className="current-event-board">
        <h1>Events Happening Now</h1>
        <div className="current-list">
          {
            list.map((event)=>{
              return (
                <Card key={event.id} title={event.eventName} extra={<ViewMore url={event.id} />} className="event-card">
                  <EventPoster poster={event.eventPoster} />
                  <p>{ event.eventDescription }</p>
                  <p>
                    <span title={moment(event.startDateTime).format('M/D/Y, h:mm a')}>Started { moment(event.startDateTime).fromNow(true) } ago &bull;&nbsp;</span>
                    <span title={moment(event.endDateTime).format('M/D/Y, h:mm a')}>Ends { moment(event.endDateTime).fromNow() }</span>
                  </p>
                </Card>
              );
            })
          }
        </div>
      </div>
    );
  }
}
