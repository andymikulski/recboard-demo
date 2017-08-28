import React, { Component } from 'react';
import { Link } from 'react-router'
import { Badge, Layout, Menu, Icon, Tooltip } from 'antd';
import autobind from 'autobind-decorator';
import logo from './logo.svg';
import './styles.css';

import QueryEventListing from '../EventBoard/QueryEventListing';

const { Sider } = Layout;

@autobind
export default class NavMenu extends Component {
  state = {
    numLive: 0,
  };

  updateNumLive(listing){
    this.setState({
      numLive: listing.current.length,
    });
  }

  render() {
    const {
      numLive,
    } = this.state;

    return (
      <div>
        {/* This is sorta hacky. If redux/etc was available, this polling stuff
          would be unnecessary. */}
        <QueryEventListing repeatEvery={60000} onLoad={this.updateNumLive} />
        <Menu theme="dark" mode="inline" selectedKeys={['2']}>
          <Menu.Item key="1">
            <Icon type="user" />
            <span>My Profile</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="home" />
            <span>Friend Feed</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/events">
              <Icon type="calendar" />
              <span>Community Events</span>
              {
                numLive > 0 &&
                <Tooltip
                  placement="right"
                  title={`${numLive} event${numLive === 1 ? '' : 's'} happening now!`}
                >
                  <Badge dot />
                </Tooltip>
              }
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Icon type="picture" />
            <span>My Gallery</span>
          </Menu.Item>
          <Menu.Item key="5">
            <Icon type="setting" />
            <span>Settings</span>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
