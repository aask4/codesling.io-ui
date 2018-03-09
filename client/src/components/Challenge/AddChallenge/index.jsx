import React, { Component } from "react";
import axios from "axios";
import randomstring from "randomstring";
import CodeMirror from "react-codemirror2";
import { throttle } from "lodash";
import Input from "../../globals/forms/Input";
import Button from "../../globals/Button/";
import Logo from "../../globals/Logo";

import "./Auth.css";
let slingId;

class AddChallenge extends Component {
  state = {
    title: "",
    content: "",
    difficulty: null,
    test: ""
  };

  componentDidMount() {
    this.setState({
      test: this.testTemplate
    });
  }

  submitChallenge = async e => {
    e.preventDefault();

    const { title, content, test, difficulty } = this.state;

    const id = localStorage.getItem("id");
    const body = {
      title,
      content,
      difficulty,
      user_id: id,
      type: 0
    };
    const { data } = await axios.post(
      "http://localhost:3396/api/challenges",
      body
    );
    await axios.post("http://localhost:3396/api/testCases", {
      content: test,
      challenge_id: data.id
    });
    this.props.history.push("/home");
  };

  handleChallengeInput = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  setEditorSize = throttle(() => {
    this.editor.setSize(null, `${window.innerHeight - 3000}px`);
  }, 100);

  testTemplate = `const func = FILL_ME_IN;
const expected = FILL_ME_IN;
const actual = func(FILL_ME_IN);

//enter one or more tests below
if (expected === actual) {
  console.log("solved");
} else {
  console.log("expected " + expected + ", but got " + actual);
}`;

  initializeEditor = editor => {
    this.editor = editor;
    this.setEditorSize();
  };

  render() {
    return (
      <div className="login-form-container">
        <Logo className="landing-page-logo" />
        <form className="auth-form">
          <span>
            <Button
              backgroundColor="red"
              color="white"
              text="Add Challenge"
              onClick={e => this.submitChallenge(e)}
            />
            <select
              name="difficulty"
              type="difficulty"
              id="difficulty-select"
              onChange={this.handleChallengeInput}
            >
              <option hidden>Select difficulty</option>
              <option value="1">Junior</option>
              <option value="2">Senior</option>
              <option value="3">Nightmare</option>
            </select>
          </span>
          <br />
          <p>Title</p>
          <Input
            name="title"
            type="title"
            onChange={this.handleChallengeInput}
          />
          <br />
          <p>Description</p>
          <Input
            name="content"
            type="content"
            onChange={this.handleChallengeInput}
          />
          <br />
          <p>Test Cases</p>
          <div className="code1-editor-container">
            <CodeMirror
              editorDidMount={this.initializeEditor}
              value={this.state.test}
              options={{
                mode: "javascript",
                lineNumbers: true
              }}
              onChange={(editor, data, value) =>
                this.handleChallengeInput({ target: { name: "test", value } })
              }
            />
          </div>
        </form>
<<<<<<< HEAD
<<<<<<< HEAD
      </div>
    )
=======
      </div>)
>>>>>>> fixed syntax err
=======
      </div>)
>>>>>>> fixed syntax err
  }
}

export default AddChallenge;
