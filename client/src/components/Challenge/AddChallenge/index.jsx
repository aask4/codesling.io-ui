import React, { Component } from 'react';
import axios from 'axios';

import Input from '../../globals/forms/Input';
import Button from '../../globals/Button/';
import Logo from '../../globals/Logo';

import './Auth.css';

class AddChallenge extends Component {
  state = {
    title: '',
    content: '',
    testcase: '',
    difficulty: null
   }

  submitChallenge = async (e) => {
    e.preventDefault();
    const { title, content, testcase, difficulty } = this.state;
    const id = localStorage.getItem('id');
    const body = {
      title,
      content,
      testcase,
      difficulty,
      user_id: id,
      type: 0
    }
    const result = await axios.post('http://localhost:3396/api/challenges', body);
    const rest = await axios.post('http://localhost:3396/api/testCases', {content: body.testcase, challenge_id: result.data.id})
    this.props.history.push('/home');
  }

  handleChallengeInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    return <div className="login-form-container">
        <Logo className="landing-page-logo" />
        <form className="auth-form">
          <Input name="title" type="title" placeholder={"enter title"} onChange={this.handleChallengeInput} />
          <Input name="content" type="content" placeholder={"enter content"} onChange={this.handleChallengeInput} />
          <Input name="testcase" type="testcase" placeholder={"enter expected result"} onChange={this.handleChallengeInput} />
          <Input name="difficulty" type="difficulty" placeholder={"enter your difficulty"} onChange={this.handleChallengeInput} />
          <Button backgroundColor="red" color="white" text="Add Challenge" onClick={e => this.submitChallenge(e)} />
        </form>
      </div>;
  }
}

export default AddChallenge;
