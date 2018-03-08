import React, { Component } from "react";
import randomstring from "randomstring";
import axios from "axios";

import Button from "../globals/Button";
import Logo from "../globals/Logo";
import AllUsers from "../AllUsers/index.jsx";
import OpenDuels from "../OpenDuels/index.jsx";

import "./LandingPage.css";

let slingId;

let slingId;

class Home extends Component {
  state = {
    allChallenges: [],
    selectedChallenge: {},
    selectedDuel: {}
  };

  async componentDidMount() {
    const id = localStorage.getItem("id");
    const { data } = await axios.get(
      `http://localhost:3396/api/usersChallenges/${id}`
    );
    console.log("*******: ", data);
    this.setState({ allChallenges: data.rows });
  }

  randomSlingId = () => {
    slingId = `${randomstring.generate()}`;
  }

  handleDuelClick = () => {
    this.randomSlingId();
    this.props.history.push({
      pathname: `/${slingId}`,
      state: {
        challenge: this.state.selectedChallenge
      }
    });
  }

  handleAddChallengeClick = () => {
    this.props.history.push("/addChallenge");
  };

  handleChallengeSelect = e => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ selectedChallenge: value });
  };

  async handleIinitateDuelClick() {
    const {data} = await axios.post('http://localhost:3396/api/openDuels',
      {
        challenge_id: this.state.selectedChallenge.id,
        challenger_id: localStorage.getItem('id')
      });
    this.setState({OpenDuels: this.state.OpenDuels.push(data)});
  }

  handleDuelSelect = ({value}) => {
    this.setState({selectedDuel: value});
  }

  handleSeeAllClick = () => {
    this.props.history.push("/challenge");
  };

  render() {
    return <div className="landing-page-container">
        <Logo className="landing-page-logo" />
        <br />

        <div>
          <AllUsers />
        </div>
        <br />
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
        <br />
        <select onChange={e => this.handleChallengeSelect(e)}>
          <option value="select">select a challenge</option>

          {this.state.allChallenges.map(challenge => {
            return <option value={JSON.stringify(challenge)}>
                {challenge.title}
              </option>;
          })}
        </select>
        <br />
        <br />
        <Button backgroundColor="red" color="white" text="Create Challenge" onClick={() => this.handleAddChallengeClick()} />
        <br />
        <Button backgroundColor="red" color="white" text="Initiate Duel" onClick={() => this.handleIinitateDuelClick()} />
        <br />
        <OpenDuels handleDuelSelect={this.handleDuelSelect.bind(this)} />
        <br />
        <Button backgroundColor="red" color="white" text="Join Duel" onClick={() => this.handleJoinDuelClick()} />
        <br />
        <Button backgroundColor="red" color="white" text="See All Challenges" onClick={() => this.handleSeeAllClick()} />
      </div>;
  }
}

export default Home;
