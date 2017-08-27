import React, { PureComponent } from 'react';

export default class QueryEventListing extends PureComponent {
  componentDidMount() {
    fetch('http://localhost:3333/event/list', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(values),
    })
    .then(res => res.json())
    .then(listing => {
      this.props.onLoad(listing);
    });
  }

  render() {
    return null;
  }
}
