import React, { Component } from 'react';
import { Table, Icon } from 'antd';

import './styles.css';


const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}, {
  title: '',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="#">Action 一 {record.name}</a>
      <span className="ant-divider" />
      <a href="#">Delete</a>
      <span className="ant-divider" />
      <a href="#" className="ant-dropdown-link">
        More actions <Icon type="down" />
      </a>
    </span>
  ),
}];


export default class PastEvents extends Component {
  static defaultProps = {
    list: [],
  };

  render() {
    return (
      <div className="event-board">
        <h1>Past Events</h1>
        <Table columns={columns} dataSource={this.props.list} />
      </div>
    );
  }
}
