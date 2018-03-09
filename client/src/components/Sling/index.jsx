import React, { Component } from "react";
import io from "socket.io-client/dist/socket.io.js";

import Sling from "./Sling.jsx";

class SlingIndex extends Component {
  state = {
    socket: null
  };

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

  render() {
    if (this.props.location.state) {
      return (
        <Sling
          socket={this.state.socket}
          challenge={this.props.location.state.challenge}
        />
      );
    } else {
      return <Sling socket={this.state.socket} challenge={{}} />;
    }
  }
}

export default SlingIndex;
