import { PureComponent } from 'react';

export default class QueryEventListing extends PureComponent {
  componentDidMount() {
    fetch('http://localhost:3333/event/list')
    .then(res => res.json())
    .then(listing => {
      this.props.onLoad(listing);
    });
  }

  render() {
    return null;
  }
}
