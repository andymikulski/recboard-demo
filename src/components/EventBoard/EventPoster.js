import React, { PureComponent } from 'react';

export default class EventPoster extends PureComponent {
  removeDimensions(container) {
    if (!container) {
      return;
    }
    const el = container.querySelector('svg');

    el.removeAttribute('height');
    el.removeAttribute('width');
  }

  render() {
    return (
      <div
        className="event-poster"
        ref={this.removeDimensions}
        dangerouslySetInnerHTML={{ __html: this.props.poster[1] }}
      />
    );
  }
}
