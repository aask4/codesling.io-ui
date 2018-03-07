import React, { Component } from 'react';
import randomstring from 'randomstring';
import axios from 'axios';

import Button from '../globals/Button';
import Logo from '../globals/Logo';
import AllUsers from '../AllUsers/index.jsx';

import './LandingPage.css';

class Home extends Component {
  state = {
    allChallenges: [],
    selectedChallenge: {}
   }

   async componentDidMount() {
    const id = localStorage.getItem('id');
    const { data } = await axios.get(`http://localhost:3396/api/usersChallenges/${id}`)
    console.log('*******: ', data)
    this.setState({ allChallenges: data.rows });
   }

  handleDuelClick = () => {
    this.props.history.push({
      pathname: `/${this.state.selectedChallenge.url}`,
      state: {
        challenge: this.state.selectedChallenge
      }
    });
  }
  
  handleAddChallengeClick = () => {
    this.props.history.push('/addChallenge');
  }

  handleChallengeSelect = (e) => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ selectedChallenge: value });
  }

  handleSeeAllClick = () => {
    this.props.history.push('/challenge');
  }

  showState() {
    console.log(this.state);
  }

  render() {
    return (
      <div className="landing-page-container">
        <Logo
          className="landing-page-logo"
        />
        <br />
        <div>
          <button type="button" onClick={() => this.showState()}></button>
          <AllUsers />
        </div>
        <br/>
        {/* <select onChange={(e) => this.handleChallengeSelect(e)}> */}
          {/* <option value="select">Open Challenges</option>
          {this.state.allChallenges.map(challenge => {
            return (
            <option
              value={JSON.stringify(challenge)}
            >
              {challenge.title}
            </option>)
          }
          )}
        </select> */}
        <br/>
        <select onChange={(e) => this.handleChallengeSelect(e)}>
          <option value="select">select a challenge</option>
          {this.state.allChallenges.map(challenge => {
            return (
            <option
              value={JSON.stringify(challenge)}
            >
              {challenge.title}
            </option>)
          }
          )}
        </select>
        <br />
        <br />
        <Button
          backgroundColor="red"
          color="white"
          text="Create Challenge"
          onClick={() => this.handleAddChallengeClick()}
        />
        <br />
        <Button
          backgroundColor="red"
          color="white"
          text="Duel"
          onClick={() => this.handleDuelClick()}
        />
        <br />
        <Button
          backgroundColor="red"
          color="white"
          text="See All Challenges"
          onClick={() => this.handleSeeAllClick()}
        />
      </div>
    );
  }
}

export default Home;
