
import React from 'react'
import { Select, Spin } from 'antd';
const Option = Select.Option;

export default class UserRemoteSelect extends React.Component {
  state = {
    data: [],
    value: [],
    fetching: false,
  }

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.handleChange = this.handleChange.bind(this);

    // Debounce the fetchUser call by 100ms to prevent hitting the api a million times.
    this._fetchUser = this._fetchUser.bind(this);
    this.fetchUser = (...args)=>{
      if (this.debounceTimer){
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(()=>this._fetchUser(...args), 100);
    };
  }

  componentWillMount(){
    this.setState({
      data: this.getGivenList(),
    });
  }

  getGivenList(){
    return (this.props.list || []).map(this.formatUserToOption);
  }

  formatUserToOption(user){
    return {
      text: user.username,
      value: user.id,
    };
  }

  _fetchUser (value) {
    console.log('fetching user', value);
    if (!value){
      this.setState({ data: this.getGivenList() });
      return;
    }

    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ fetching: true });
    fetch('https://randomuser.me/api/?results=5&inc=login,id')
      .then(response => response.json())
      .then((body) => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }
        const data = body.results.map(user => ({
          text: user.login.username,
          value: user.id.value,
        }));
        this.setState({ data });
      });
  }
  handleChange (value) {
    this.setState({
      value,
      data: this.getGivenList(),
      fetching: false,
    });
  }
  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
        mode="multiple"
        labelInValue
        value={value}
        placeholder="Select users"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => <Option key={d.value}>{d.text}</Option>)}
      </Select>
    );
  }
}