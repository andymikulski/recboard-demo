import React, { PureComponent } from 'react';

export default class EventPoster extends PureComponent {
  removeDimensions(container) {
    const el = container.querySelector('svg');
    if (!el) {
      return;
    }

    el.removeAttribute('height');
    el.removeAttribute('width');
  }

  render() {
    return (
      <div ref={this.removeDimensions} dangerouslySetInnerHTML={{ __html: this.props.poster[1] }} />
    );
  }
}
