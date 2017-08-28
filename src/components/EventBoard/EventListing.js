import React, { Component } from 'react';
import { Table, Icon } from 'antd';

import './styles.css';

export default class EventListing extends Component {
  static defaultProps = {
    list: [],
    title: null,
  };

  render() {
    return (
      <div className="event-board">
        <h1>{ this.props.title }</h1>
        <Table columns={this.props.columns} dataSource={this.props.list} />
      </div>
    );
  }
}
