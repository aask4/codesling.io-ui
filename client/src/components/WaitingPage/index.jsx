import React, { Component } from "react";
import CodeMirror from "react-codemirror2";
import io from "socket.io-client/dist/socket.io.js";

import "./WaitingPage.css";

class WaitingPage extends Component {
  render() {
    return (
      <div className="outer">
        <div className="waiting">
          <img src="http://doryzidon.com/wp-content/uploads/2017/04/waiting.jpg" alt="waiting" />
          <p>
            You Are Waiting. When an opponent joins you will be brought to
            your duel.
          </p>
        </div>
      </div>
    );
  }
}

export default WaitingPage;
