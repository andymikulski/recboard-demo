import React, { Component } from 'react';
import { Form, Avatar, Alert, Row, Col, } from 'antd';
import moment from 'moment';
import autobind from 'autobind-decorator';
import EventPoster from '../EventBoard/EventPoster';

import './styles.css';

const FormItem = Form.Item;

@autobind
export default class DetailContents extends Component {

  static nl2br(str) {
    return str.split('\n').map(line => <span>{line}<br /></span>);
  }

  render() {
    const {
      details,
    } = this.props;

    if(!details){
      return null;
    }

    const formItemLayout = {
      colon: false,
    };

    return (
      <div className="detail-contents">
        <EventPoster poster={details.eventPoster} />
        <div className="alert-bar">
          {
            details.isCurrent &&
              <Alert
                message="Event is currently live!"
                description="This event is currently on-going. Hop in Rec Room to check it out!"
                type="success"
                showIcon
              />
          }
          {
            details.eventPrivate &&
              <Alert
                message="Private Event"
                description="This is not listed in public event boards. You can still share it with others by copy and pasting the page URL."
                type="info"
                showIcon
              />
          }
        </div>
        <Row gutter={8}>
          <Col sm={24} md={12}>
            <h1>{details.eventName}</h1>
            <p>{DetailContents.nl2br(details.eventDescription)}</p>
            <FormItem {...formItemLayout} label="Event Hosts">
              {details.eventHosts.map(host=>
                <div className="hosted-by">
                  <Avatar size="large" shape="square" icon="user" />
                  <label>{host.label}</label>
                </div>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Location">
              { details.eventLocation }
            </FormItem>
          </Col>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="Start Time">
              { moment(details.startDateTime).format('dddd, MMMM Do YYYY, h:mm a') }<br />
              {` (${ moment(details.startDateTime).fromNow() })`}
            </FormItem>
            <FormItem {...formItemLayout} label="End Time">
              { moment(details.endDateTime).format('dddd, MMMM Do YYYY, h:mm a') }<br />
              {` (${ moment(details.endDateTime).fromNow() })`}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  }
}
