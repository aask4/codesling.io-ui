import React, { Component } from "react";
import CodeMirror from "react-codemirror2";
import io from "socket.io-client/dist/socket.io.js";
import axios from "axios";
import { throttle } from "lodash";

import Stdout from './StdOut/index.jsx';
import EditorHeader from './EditorHeader';
import Button from '../globals/Button';

import WaitingPage from '../WaitingPage/index.jsx';
import DuelChat from '../DuelChat/index.jsx';

import "codemirror/mode/javascript/javascript.js";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-dark.css";
import "./Sling.css";

class Sling extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      ownerText: null,
      challengerText: null,
      text: '',
      challenge: '',
      stdout: '',
      result: '',
      startTime: Date.now(),
      allowRunButton: true 
    }
  }

  async componentDidMount() {
    const { socket, challenge } = this.props;
    const startChall =
      typeof challenge === "string" ? JSON.parse(challenge) : {};

    //because of waiting page, 'connect' already fired so this no longer works
    // socket.on("connect", () => {
    //   socket.emit("client.ready", startChall);
    // });

    socket.emit("client.ready", startChall);

    socket.on("server.initialState", ({ id, text, challenge }) => {
      this.setState({
        id,
        ownerText: text,
        challengerText: text,
        challenge,
      });
    });

    socket.on("server.changed", ({ text, email }) => {
      if (localStorage.getItem("email") === email) {
        this.setState({ ownerText: text });
      } else {
        this.setState({ challengerText: text });
      }
    });

    socket.on("server.run", ({ stdout, email }) => {
      const ownerEmail = localStorage.getItem("email");
      let stdoutCopy = stdout.slice(0, stdout.length - 1);
      console.log(stdoutCopy);
      email === ownerEmail ? 
        this.setState({ stdout: stdoutCopy }) 
        : 
        stdoutCopy === 'solved' ? this.setState({stdout: 'You Lose'}) : null;

      this.state.stdout === 'solved' && this.resolveChallenge(this.state.stdout);
      this.state.stdout === 'You Lose' && this.resolveChallenge(this.state.stdout);

    });

    window.addEventListener("resize", this.setEditorSize);
  }

  submitCode = () => {
    this.showState();
    const { socket } = this.props;
    const { ownerText, challenge } = this.state;
    const email = localStorage.getItem("email");
    socket.emit("client.run", {
      text: ownerText,
      email,
      challenge_id: challenge.id,
      challenge_title: challenge.title,
    });
  };

  showState() {
    console.log(this.state);
    console.log(this.props);
  }

  handleChange = throttle((editor, metadata, value) => {
    const email = localStorage.getItem("email");
    this.props.socket.emit("client.update", { text: value, email });
  }, 250);

  setEditorSize = throttle(() => {
    this.editor.setSize(null, `${window.innerHeight - 80}px`);
  }, 100);

  initializeEditor = editor => {
    this.editor = editor;
    this.setEditorSize();
  };

  resolveChallenge = async (stdoutCopy) => {
  let endTime = Date.now();
  let seconds = Math.floor((endTime - this.state.startTime)/1000);
  let minutes = 0;
  let remainingSeconds = seconds;
  let timeString;

  while (remainingSeconds >= 60) {
    minutes += 1;
    remainingSeconds -= 60;
  }
  let minuteString = minutes > 1 ? `${minutes} minutes` : `${minutes} minute`

  timeString = minutes > 0 ? `${minuteString} and ${remainingSeconds} seconds` : `${seconds} seconds`;

  let clout = Math.floor(this.state.challenge.difficulty * 1.1 + 20);
  let outcome;
  stdoutCopy === 'solved' ? outcome = 1 : outcome = 0; //Win-Lose

  let challenger_id;
  localStorage.id === '1' ? challenger_id = 2 : challenger_id = 1;

  let result = {
    outcome: outcome,
    time: timeString,
    clout: clout,
    user_id: Number(localStorage.id),   //this will always be current user id
    challenger_id: challenger_id,         //will need Alex's help in obtaining challenger (other person's id)
    challenge_id: this.state.challenge.id
  }

  //post to History
  //will always post twice (one from user and one from challenger)
  //that way we can easily grab history data without too much logic
  await axios.post(`http://localhost:3396/api/history/addHistory`, result)

  //update userstable clout and kdr
  let update = {
    user_id: Number(localStorage.id),
    clout: clout,
    kdr_change: outcome
  }
  await axios.post(`http://localhost:3396/api/users/updateUserScore`, update)

  this.setState({allowRunButton: false});
  setTimeout( () => this.props.history.push("/home"), 5000)
  }

  render() {
    const { socket } = this.props;
    return (
      <div className="sling-container">
        <EditorHeader />
        <div className="code1-editor-container">
          <CodeMirror
            editorDidMount={this.initializeEditor}
            value={this.state.ownerText}
            options={{
              mode: "javascript",
              lineNumbers: true,
              theme: "base16-dark"
            }}
            onChange={this.handleChange}
          />
        </div>
        <div className="stdout-container">
          <strong>{this.state.challenge.title}</strong>
          <br />
          <br />
          {this.state.challenge.content}
          <br />
          <br />
          <div className="btn-container">
            {this.state.allowRunButton && <Button
              className="run-btn"
              text="Run Code"
              backgroundColor="red"
              color="white"
              onClick={() => this.submitCode()}
            />}
            {!this.state.allowRunButton && <div>Game OVER: redirecting in 5 seconds</div>}
          </div>
          <br />
          <br />
          {this.state.stdout ===
          "solved" ? (
            <div id="solved">
              <Stdout text={this.state.stdout} />
            </div>
          ) : (
            <div id="error">
              <Stdout text={this.state.stdout} />
            </div>
          )}
          <DuelChat socket={this.props.socket}/>
        </div>
        <div className="code2-editor-container">
          <CodeMirror
            editorDidMount={this.initializeEditor}
            value={this.state.challengerText}
            options={{
              mode: "javascript",
              lineNumbers: true,
              theme: "base16-dark",
              readOnly: true
            }}
          />
        </div>
      </div>
    );
  }
}

export default Sling;
