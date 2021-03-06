import React, { Component } from 'react';
import axios from 'axios';

import Input from '../globals/forms/Input';
import Button from '../globals/Button/';

import './Auth.css';

export default class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      username: ''
    }
  }

  submitAuthData = async (e) => {
    e.preventDefault();
    const { email, password, username } = this.state;
    const body = {
      email,
      password,
      username
    }
    try {
      const data = await axios.post(`http://localhost:3396/api/auth/login`, body);
      localStorage.setItem('email', data.data.email)
      localStorage.setItem('id', data.data.id)
      localStorage.setItem('token', data.data.token.accessToken)
      data ? this.props.history.push('/home') : this.props.history.push('/login');
    } catch (err) {
      console.log('Login error: ', err)
    }
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div className="login-form-container">
        <form className="auth-form">
          <Input
            name='email'
            type='email'
            placeholder={'enter email'}
            onChange={this.handleInputChange}
            />
          <Input
            name='username'
            type='username'
            placeholder={'enter username'}
            onChange={this.handleInputChange}
            />
          <Input 
            name='password'
            type='password'
            placeholder={'enter your password'}
            onChange={this.handleInputChange}
            />
          <Button
            backgroundColor="red"
            color="white"
            text="Log In"
            onClick={(e) => this.submitAuthData(e)}
            />
        </form>
      </div>
    )
  }
}
