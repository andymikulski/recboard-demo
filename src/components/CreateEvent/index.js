import fetch from 'isomorphic-fetch';
import React, { Component } from 'react';
import { DatePicker, Select, Tooltip, Input, TimePicker, Button, Form, Switch } from 'antd';
import { browserHistory } from 'react-router';
import PosterCreator from '../PosterCreator';
import UserPicker from './UserPicker';
import autobind from 'autobind-decorator';
import './styles.css';
const InputGroup = Input.Group;
const { TextArea } = Input;
const FormItem = Form.Item;

@autobind
class CreateEvent extends Component {
  state = {
    creatorVisible: false,
  };

  togglePosterCreator(evt) {
    // If it's a keyboard event, they're probably hitting escape, so we can
    // prevent accidental modal closes while trying to deselect.
    if(evt.type.indexOf('key') > -1){
      return;
    }
    this.setState({
      creatorVisible: !this.state.creatorVisible,
    });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {

        ['eventStartDate', 'eventStartTime', 'eventEndDate', 'eventEndTime']
          .forEach((prop)=>{
            if (values[prop] && values[prop].valueOf){
              values[prop] = values[prop].valueOf();
            }
          });

        fetch('https://recboard-api.herokuapp.com/events/new', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: "POST",
          body: JSON.stringify(values),
        })
        .then(res => res.json())
        .then((results) => {
          if (results) {
            browserHistory.push(`/events/${results.id}`);
          }
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    // The FormItems all inherit the same set of props for their layout settings.
    const formItemLayout = {
      colon: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="&nbsp;"
        >
          <h1 className="ant-form-text">Create a New Event</h1>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Event Name"
        >
          {getFieldDecorator('eventName', {
            rules: [
              { required: true, message: 'Please enter an event name.' },
            ],
          })(<Input size="large" />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Event Description"
        >
        {getFieldDecorator('eventDescription', {
          rules: [
            { required: true, message: 'Please enter a description for the event.' },
          ],
        })(<TextArea
            placeholder="Tell us what your event is about, what you will be doing, etc."
            autosize={{ minRows: 2, maxRows: 6 }}
          />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Event Time"
        >
          <span className="event-time">
            <InputGroup compact>
              {getFieldDecorator('eventStartDate', {
                rules: [
                  { required: true, message: 'Please select a start date for the event.', type: 'object' },
                ],
              })(<DatePicker placeholder="Start Date" size="large" style={{ width: '40%' }}/>)}

              {getFieldDecorator('eventStartTime', {
                rules: [
                  { required: true, message: 'Please select a start time for the event.', type: 'object' },
                ],
              })(<TimePicker placeholder="Start Time" size="large" use12Hours format="h:mm a" />)}
            </InputGroup>
            <InputGroup compact>
              {getFieldDecorator('eventEndDate', {
                rules: [
                  { required: true, message: 'Please select an end date for the event.', type: 'object' },
                ],
              })(<DatePicker placeholder="End Date" size="large" style={{ width: '40%' }}/>)}

              {getFieldDecorator('eventEndTime', {
                rules: [
                  { required: true, message: 'Please select an end time for the event.', type: 'object' },
                ],
              })(<TimePicker placeholder="End Time" size="large" use12Hours format="h:mm a" />)}
            </InputGroup>
          </span>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Event Location"
        >
          {getFieldDecorator('eventLocation', {
            rules: [
              { required: true, message: 'Please enter an event name.' },
            ],
          })(
            <Select
              mode="combobox"
              size="large"
              placeholder="ex: Lobby #recroom"
            >
              <Select.Option key="Rec Center">Rec Center</Select.Option>
              <Select.Option key="Quest Entrances">Quest Entrances</Select.Option>
              <Select.Option key="Basketball Court">Basketball Court</Select.Option>
              <Select.Option key="The Lounge">The Lounge</Select.Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Event Hosts"
        >
          {getFieldDecorator('eventHosts', {
            rules: [
              { required: true, message: 'Please select at least one event host.' },
            ],
          })(
            <UserPicker
              list={[{ id: 123, username: 'DashDingo' }, { id: 456, username: 'DragonflyXO' }, { id: 678, username: 'OtherFriend' }]}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={
            <Tooltip title="If enabled, your event will not appear on the public event boards.">
              Private Event
            </Tooltip>
          }
        >
          {getFieldDecorator('eventPrivate', { valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Event Poster"
        />
        {getFieldDecorator('eventPoster')(<PosterCreator key={this.state.creatorVisible} />)}

        <hr />

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit" style={{ margin: '3em auto 1em', display: 'block' }}>Submit</Button>
        </FormItem>
      </Form>
    );
  }
}

const FormedCreate = Form.create()(CreateEvent);
export default FormedCreate;
