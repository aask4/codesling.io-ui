import React, { Component } from "react";
import io from "socket.io-client/dist/socket.io.js";

import Sling from './Sling.jsx';
import WaitingPage from '../WaitingPage/index.jsx';

class SlingIndex extends Component {
  state = {
    socket: null,
    waiting: true
   }


  componentWillMount() {
    const challenge =
      typeof this.props.location.state.challenge === "string"
        ? JSON.parse(this.props.location.state.challenge)
        : {title: ''};
    this.socket = io("http://localhost:4155", {
      query: {
        roomId: this.props.location.pathname.slice(1),
        title: challenge.title
      }
    });

    this.setState({ socket: this.socket });
  }

  async componentDidMount() {
    this.socket.on("server.joined", () => {
      console.log("I HEAR YOU I HEAR YOU");
      this.setState({ waiting: false });
    });
    console.log('Sling index props: ', this.props)

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
        <Sling socket={this.state.socket} 
          challenge={this.props.location.state.challenge}
          history={this.props.history}/>
      );

  }
}

export default SlingIndex;
