import React, { Component } from 'react';
import { Table, Icon } from 'antd';

import './styles.css';

export default class EventListing extends Component {
  static defaultProps = {
    list: [],
    title: null,
  };

  static localeConfig = {
    emptyText: 'No events!',
  };

  render() {
    const {
      title, columns, list,
    } = this.props;

    return (
      <div className="event-board">
        <h1>{ title }</h1>
        <Table
          locale={EventListing.localeConfig}
          columns={columns}
          dataSource={list}
        />
      </div>
    );
  }
}
