import { PureComponent } from 'react';

export default class QueryEventDetails extends PureComponent {
  componentDidMount() {
    fetch(`http://localhost:3333/events/${this.props.id}`)
    .then(res => res.json())
    .then(event => {
      this.props.onLoad(event);
    })
    .catch(err => {
      this.props.onFailedLoad();
    });
  }

  render() {
    return null;
  }
}
