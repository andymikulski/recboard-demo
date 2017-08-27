import React, { Component } from 'react';
import { Link } from 'react-router'
import { Badge, Layout, LocaleProvider, Menu, Icon, Tooltip } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import logo from './logo.svg';
import './App.css';

const { Header, Sider, Content } = Layout;

export default class App extends Component {
  state = {
    collapsed: false,
  };

  constructor(props){
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <LocaleProvider locale={enUS}>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo" />
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
                  <Tooltip placement="right" title={`${3} events happening now!`}>
                    <Badge dot />
                  </Tooltip>
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
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            </Header>
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              { this.props.children }
            </Content>
          </Layout>
        </Layout>
      </LocaleProvider>
    );
  }
}
