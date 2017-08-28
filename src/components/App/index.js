import React, { Component } from 'react';
import { Layout, LocaleProvider, Icon, Menu, Badge, Tooltip, } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import autobind from 'autobind-decorator';

import NavMenu from './NavMenu';
import './styles.css';
import { Link } from 'react-router'

const { Header, Sider, Content } = Layout;

@autobind
export default class App extends Component {
  state = {
    collapsed: false,
  };

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
            <NavMenu collapsed={this.state.collapsed} />
          </Sider>
          <Layout>
            <Header style={{ color: '#fff', padding: 0 }}>
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
