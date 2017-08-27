import React, { Component } from 'react';
import { Modal, Button, Layout, Form, Select, InputNumber, Switch, Radio,
  Slider, Upload, Icon } from 'antd';
import { Link } from 'react-router'
import PosterCreator from '../PosterCreator';
import './styles.css';

const { Sider, Header, Content, Footer } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export class CreateEvent extends Component {
  state = {
    creatorVisible: false,
  };

  constructor(props){
    super(props);
    this.togglePosterCreator = this.togglePosterCreator.bind(this);
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const normFile = (e) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    };

    return (
      <Layout>
        <Content>
          <h1>Create New Event</h1>

          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="Select"
              hasFeedback
            >
              {getFieldDecorator('select', {
                rules: [
                  { required: true, message: 'Please select your country!' },
                ],
              })(
                <Select placeholder="Please select a country">
                  <Option value="china">China</Option>
                  <Option value="use">U.S.A</Option>
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Event Poster"
            >
              {getFieldDecorator('event-poster')(
                <PosterCreator disableInteractions key={this.state.creatorVisible} />
              )}
              <Button onClick={this.togglePosterCreator} type="primary" size="small">Edit Poster</Button>
              <Modal
                onOk={this.togglePosterCreator}
                onClose={this.togglePosterCreator}
                title="Event Poster Editor"
                visible={this.state.creatorVisible}
                okText="Save"
                cancelText="Cancel"
                width="70vw"
              ><PosterCreator /></Modal>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Select[multiple]"
            >
              {getFieldDecorator('select-multiple', {
                rules: [
                  { required: true, message: 'Please select your favourite colors!', type: 'array' },
                ],
              })(
                <Select mode="multiple" placeholder="Please select favourite colors">
                  <Option value="red">Red</Option>
                  <Option value="green">Green</Option>
                  <Option value="blue">Blue</Option>
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="InputNumber"
            >
              {getFieldDecorator('input-number', { initialValue: 3 })(
                <InputNumber min={1} max={10} />
              )}
              <span className="ant-form-text"> machines</span>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Switch"
            >
              {getFieldDecorator('switch', { valuePropName: 'checked' })(
                <Switch />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Slider"
            >
              {getFieldDecorator('slider')(
                <Slider marks={{ 0: 'A', 20: 'B', 40: 'C', 60: 'D', 80: 'E', 100: 'F' }} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Radio.Group"
            >
              {getFieldDecorator('radio-group')(
                <RadioGroup>
                  <Radio value="a">item 1</Radio>
                  <Radio value="b">item 2</Radio>
                  <Radio value="c">item 3</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Radio.Button"
            >
              {getFieldDecorator('radio-button')(
                <RadioGroup>
                  <RadioButton value="a">item 1</RadioButton>
                  <RadioButton value="b">item 2</RadioButton>
                  <RadioButton value="c">item 3</RadioButton>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem
              wrapperCol={{ span: 12, offset: 6 }}
            >
              <Button type="primary" htmlType="submit">Submit</Button>
            </FormItem>
          </Form>
        </Content>
      </Layout>
    );
  }
}

const FormedCreate = Form.create()(CreateEvent);
export default FormedCreate;
