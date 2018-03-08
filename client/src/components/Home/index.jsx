import React, { Component } from "react";
import randomstring from "randomstring";
import axios from "axios";

import Button from "../globals/Button";
import Logo from "../globals/Logo";
import AllUsers from "../AllUsers/index.jsx";
import OpenDuels from "../OpenDuels/index.jsx";

import "./LandingPage.css";

let slingId;

class Home extends Component {
  state = {
    allChallenges: [],
    selectedChallenge: {},
    selectedDuel: {},
    openDuels: []
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

  handleJoinDuelClick = () => {
    console.log('##########', this.state.selectedDuel[0])
    this.props.history.push({
      pathname: `/${this.state.selectedDuel[0].sling_id}`,
      state: {
        challenge: this.state.selectedDuel[0]
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

  handleIinitateDuelClick = async () => {
    this.randomSlingId();
    const {data} = await axios.post('http://localhost:3396/api/openDuels',
      {
        challenge_id: JSON.parse(this.state.selectedChallenge).id,
        challenger_id: localStorage.getItem('id'),
        sling_id: slingId
      });
    this.fetchOpenDuels();
  }

  handleDuelSelect = ({value}) => {
    console.log('VALUE IS VALUE ', value);
    this.setState({selectedDuel: value});
  }

  handleSeeAllClick = () => {
    this.props.history.push("/challenge");
  };

  addDuels = (openDuels) => {
    openDuels && this.setState({openDuels});
  }

  fetchOpenDuels = async () => {
    const {data} = await axios.get('http://localhost:3396/api/openDuels');
    console.log('OpenDuels - open duels returned from server ', data);
    data && this.addDuels(data);
  }

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
        <OpenDuels
          handleDuelSelect={this.handleDuelSelect.bind(this)}
          addDuels={this.addDuels.bind(this)}
          openDuels={this.state.openDuels}
          fetchOpenDuels={this.fetchOpenDuels.bind(this)}
        />
        <br />
        <Button backgroundColor="red" color="white" text="Join Duel" onClick={() => this.handleJoinDuelClick()} />
        <br />
        <Button backgroundColor="red" color="white" text="See All Challenges" onClick={() => this.handleSeeAllClick()} />
      </div>;
  }
}

export default Home;
