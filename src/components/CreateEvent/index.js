import fetch from 'isomorphic-fetch';
import React, { Component } from 'react';
import { DatePicker, Input,  TimePicker, Modal, Button, Form, Switch } from 'antd';
import { browserHistory } from 'react-router';
import PosterCreator from '../PosterCreator';
import UserPicker from './UserPicker';
import './styles.css';

const InputGroup = Input.Group;
const { TextArea } = Input;
const FormItem = Form.Item;


class CreateEvent extends Component {
  state = {
    creatorVisible: false,
  };

  constructor(props){
    super(props);
    this.togglePosterCreator = this.togglePosterCreator.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

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
        console.log('Received values of form: ', values);

        fetch('http://localhost:3333/event/new', {
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
            browserHistory.push(`/event/${results.id}`);
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
          <InputGroup compact>
            {getFieldDecorator('eventDate', {
              rules: [
                { required: true, message: 'Please select a date for the event.', type: 'object' },
              ],
            })(<DatePicker size="small" style={{ width: "40%" }}/>)}

            {getFieldDecorator('eventTime', {
              rules: [
                { required: true, message: 'Please select a time for the event.', type: 'object' },
              ],
            })(<TimePicker size="large" use12Hours format="h:mm a" />)}
          </InputGroup>
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
          label="Private Event"
        >
          {getFieldDecorator('eventPrivate', { valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Event Poster"
        >
          {getFieldDecorator('eventPoster')(<PosterCreator disableInteractions key={this.state.creatorVisible} />)}
          <Button onClick={this.togglePosterCreator} type="primary" size="small" style={{ display: 'block', marginLeft: 'auto' }}>Edit Poster</Button>
          <Modal
            onOk={this.togglePosterCreator}
            onClose={this.togglePosterCreator}
            title="Event Poster Editor"
            visible={this.state.creatorVisible}
            okText="Save"
            cancelText="Cancel"
            width="70vw"
          >{getFieldDecorator('eventPoster')(<PosterCreator />)}</Modal>
        </FormItem>

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
