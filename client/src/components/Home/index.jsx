import React, { Component } from "react";
import randomstring from "randomstring";
import axios from "axios";
import { Route } from 'react-router-dom'
import io from "socket.io-client/dist/socket.io.js";

import Button from "../globals/Button";
import Logo from "../globals/Logo";
import AllUsers from "../AllUsers/index.jsx";
import OpenDuels from "../OpenDuels/index.jsx";
import History from '../History/index.jsx';
import Logout from '../Auth/Logout.jsx'

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
    let self = this;
    this.setState({ allChallenges: data.rows });
    
    this.socket = io("http://localhost:4155",{
      query: {
        roomId: 'homecomponentupdateopendules',
        title: 'opendules'
      }
    })
    this.socket.on('updateOpenDuels', function(message) {
      self.fetchOpenDuels();
    })

  }

  randomSlingId = () => {
    slingId = `${randomstring.generate()}`;
  }

  handleJoinDuelClick = async () => {
    const curr_user = await localStorage.getItem('id');
    if ( curr_user != this.state.selectedDuel.challenger_id) {
      this.props.history.push({
        pathname: `/${this.state.selectedDuel.sling_id}`,
        state: {
          challenge: JSON.stringify(this.state.selectedDuel),
          user_id: localStorage.getItem('id'),
          opponent: true
        },
        history: this.props.history
      });
      await axios.delete('http://localhost:3396/api/openDuels',
        {data: {duel_id: this.state.selectedDuel.duel_id}
        });
    }
  };

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
      sling_id: slingId
    });
    this.props.history.push({
      pathname: `/${data.sling_id}`,
      state: {
        challenge: this.state.selectedChallenge,
        user_id: localStorage.getItem('id'),
      },
      history: this.props.history
    });
    this.socket.emit('addOpenDuels')
  }

  handleDuelSelect = ({value}) => {
    this.setState({selectedDuel: JSON.parse(value)});
  }

  handleSeeAllClick = () => {
    this.props.history.push("/challenge");
  };


  addDuels = (openDuels) => {
    openDuels && this.setState({openDuels});
  }

  fetchOpenDuels = async () => {
    const {data} = await axios.get('http://localhost:3396/api/openDuels');
    data && this.addDuels(data);
    return data;
  }


  goToHistory(){
    this.props.history.push('/history')
  }

  render() {
    return <div className="landing-page-container">
        <Logo className="landing-page-logo" />
        <br />
        <Route path='/home' component={Logout} />
        <div>
          <button type="button" onClick={() => this.goToHistory()}>Check Out Challenge History</button>
        </div>

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
        <select id="challenge-select" onChange={e => this.handleChallengeSelect(e)}>
          <option value="select">select a challenge</option>

          {this.state.allChallenges.map(challenge => {
            return <option key={challenge.id} value={JSON.stringify(challenge)}>
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
        <OpenDuels handleDuelSelect={this.handleDuelSelect.bind(this)} addDuels={this.addDuels.bind(this)} openDuels={this.state.openDuels} fetchOpenDuels={this.fetchOpenDuels.bind(this)} />
        <br />
        <Button backgroundColor="red" color="white" text="Join Duel" onClick={() => this.handleJoinDuelClick()} />
        <br />
        <Button backgroundColor="red" color="white" text="See All Challenges" onClick={() => this.handleSeeAllClick()} />
      </div>;
  }
}

export default Home;
