import React, { Component } from 'react';
import { Card, Button } from 'antd';
import { Link } from 'react-router'

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

const ViewMore = ({ url })=><Link to={`event/${url}`}><Button type="primary" size="small">Details</Button></Link>;

export default class CurrentEvents extends Component {
  render() {
    return (
      <div className="current-event-board">
        <h1>Events Happening Now</h1>
        <div className="current-list">
          {
            data.map((event)=>{
              return (
                <Card key={event.id} title={event.name} extra={<ViewMore url={event.id} />} className="event-card">
                  <img src="http://i.imgur.com/Wy2qRbp.jpg" />
                  <p>Card content</p>
                  <p>Ends at { (new Date(event.endsAt)).toLocaleString() }</p>
                </Card>
              );
            })
          }
        </div>
      </div>
    );
  }
}
