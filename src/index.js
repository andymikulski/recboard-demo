import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Home from './components/Home';
import EventBoard from './components/EventBoard';
import CreateEvent from './components/CreateEvent';
import EventDetails from './components/EventDetails';

import { Router, Route, IndexRoute, browserHistory } from 'react-router'

const Missing = ()=><div>Missing</div>;

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="home" component={Home} />
      <Route path="events">
        <IndexRoute component={EventBoard} />
        <Route path="new" component={CreateEvent} />
        <Route path=":id" component={EventDetails} />
      </Route>
      <Route path="*" exact component={Missing} />
    </Route>
  </Router>
, document.getElementById('root'));
