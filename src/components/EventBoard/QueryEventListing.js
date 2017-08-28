import { PureComponent } from 'react';
import autobind from 'autobind-decorator';

@autobind
export default class QueryEventListing extends PureComponent {
  componentDidMount() {
    this.getListing();

    if (this.props.repeatEvery) {
      this.queryInterval = setInterval(()=>this.getListing(), this.props.repeatEvery);
    }
  }

  componentWillUnmount(){
    if(this.queryInterval){
      clearInterval(this.queryInterval);
    }
  }

  getListing() {
    fetch('https://recboard-api.herokuapp.com/events/list')
    .then(res => res.json())
    .then(listing => {
      this.props.onLoad(listing);
    });
  }

  render() {
    return null;
  }
}
