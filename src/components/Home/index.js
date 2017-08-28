import React, { Component } from 'react';
import { Link } from 'react-router'

import './styles.css';

export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <h1>Welcome!</h1>
        <p><b>This is a demo website developed for Against Gravity, prepared by Andy Mikulski.</b></p>
        <div className="content">
	        <h3>What is this?</h3>
	        <p>This is a mock social media site for Rec Room users, the idea being players could come here to connect with others outside of the game. The sections seen on the side nav bar are currently just stubs, with the exception of <Link to={'/events'}>Community Events.</Link></p>
	    </div>
	    <div className="content">
	        <h3>About Community Events</h3>
	        <p>The <Link to={'/events'}>Community Events</Link> proof of concept page is live! Here, users can view upcoming events, see what's happening right now, or what events they missed in the past. Some fun features:</p>
	        <ul className="feature-list">
	        	<li>Event Listings for Current, Upcoming, Past events <img src="http://i.imgur.com/IhWiB8U.png" style={{maxHeight:400}}  /></li>
	        	<li>"Now Live" indicator in navigation <img src="http://i.imgur.com/HmpKw4g.png" style={{maxHeight:100}} /></li>
	        	<li><Link to={'/events/new'}>Create Event Page</Link>, featuring the <b>Event Poster Creator</b>: <img src="http://i.imgur.com/ooiAjbF.jpg" style={{maxHeight:400}} />
	        	</li>
	        	<li><Link to={'/events/1'}>Event Details</Link>, a shareable event page. <img src="http://i.imgur.com/F2OvaMH.png" style={{maxHeight:400}}  /></li>
	        	<li>Events can be 'private' - unlisted, but shareable via URL: <img src="http://i.imgur.com/l9jtxVH.png" style={{maxHeight:100}} /></li>
	        </ul>
	    </div>

	    <div className="content">
	    	<hr style={{marginBottom: '1em'}} />
	        <h3>Technical Overview</h3>

	        <b>Front End</b>
	        <ul className="feature-list">
	        	<li>React (via <a href="https://github.com/facebookincubator/create-react-app" target="_blank">create-react-app</a>)</li>
	        	<li>Webpack</li>
	        	<li>Babel</li>
	        	<li><a href="http://fabricjs.com/" target="_blank">Fabric.js</a>
	        		<ul className="feature-list">
		        		<li>This library powers the Poster Creator and provides a lot of power to the user.</li>
		        		<li>Canvas-based, but can export SVG or a JSON configuration.</li>
		        		<li>Backend saves both SVG + JSON, which means we can edit existing posters etc.</li>
	        		</ul>
	        	</li>
	        </ul>

	        <b>Back End</b>
	        <ul className="feature-list">
	        	<li>Node</li>
	        	<li>Express</li>
	        	<li>Custom JSON/Memory-based DB
	        		<ul className="feature-list">
		        		<li>For the proof of concept, we don't need anything really 'web scale'. Instead of dealing with getting a DB instance running somewhere, I decided to just build a DB into the node app's memory. The DB info is persisted to a JSON file which is loaded on startup.</li>
		        		<li>This is definitely not scalable beyond a simple POC, but switching to another database system would be easy.</li>
	        		</ul>
        		</li>
	        	<li><a href="http://fabricjs.com/" target="_blank">Fabric.js</a></li>
	        </ul>
	    </div>
      </div>
    );
  }
}
