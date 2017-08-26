import React, { Component } from 'react';
import { Input, Icon } from 'antd';

import './styles.css';

const InputGroup = Input.Group;

export default class EventSearch extends Component {
  render() {
    return (
      <InputGroup compact className="event-search">
        <Input addonAfter={<Icon type="search" />} placeholder="Search events..." />
      </InputGroup>
    );
  }
}
