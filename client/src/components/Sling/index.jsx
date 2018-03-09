import React, { Component } from 'react';
import io from 'socket.io-client/dist/socket.io.js';

import Sling from './Sling.jsx';
import WaitingPage from '../WaitingPage/index.jsx';

class SlingIndex extends Component {
  state = {
    socket: null,
    waiting: true
   }

  componentWillMount() {
    this.socket = io('http://localhost:4155', {
      query: {
        roomId: this.props.location.pathname.slice(1)
      }
    });

    this.setState({ socket: this.socket });
  }

  async componentDidMount() {
    this.socket.on("server.joined", () => {
      console.log("I HEAR YOU I HEAR YOU");
      this.setState({ waiting: false });
    });

    if (this.props.location.state) {
      if (this.props.location.state.opponent) {
        this.state.socket.emit('client.opponent');
      }
    }
  }

  render() {
    console.log(this.state.waiting, this.props.location.state)
      console.log('WE SHOULD BE RERENDERING')
      return (this.state.waiting) ? (<WaitingPage />) : (
        <Sling socket={this.state.socket} challenge={this.props.location.state.challenge}/>
      );
  }
}

export default SlingIndex;
