import React, { Component } from 'react';
import { Popover, Button } from 'antd';
import autobind from 'autobind-decorator';

@autobind
export default class KeyboardHelper extends Component {
  state = {
    visible: false,
  };
  hide() {
    this.setState({
      visible: false,
    });
  }

  handleVisibleChange (visible) {
    this.setState({ visible });
  }

  render() {
    const popoverContent = (
      <div>
        <ul className="helper-list">
          <li><label>Left Click</label> Select an item, then move, rotate, scale, etc.</li>
          <li><label>Right Click</label> Open context menu to do most things.</li>
          <li><label>Backspace</label> Delete an item.</li>
          <li><label>Escape</label> Clear active selection.</li>
        </ul>
        <a onClick={this.hide}>Close</a>
      </div>
    );

    return (
      <Popover
        placement="topRight"
        content={popoverContent}
        title="Controls"
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button className="help-button" icon="question-circle-o" />
      </Popover>
    );
  }
}
