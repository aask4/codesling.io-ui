import React, { Component } from "react";
import axios from "axios";

import './OpenDuels.css';

class OpenDuels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDuels: [],
      selected: {}
    }
  }

  async componentDidMount() {
    const {openDuels} = await axios.get('http://localhost:3396/api/openDuels');
    console.log('OpenDuels - open duels returned from server ', openDuels);
    openDuels && this.setState({openDuels});
  }

  onChange = (e) => {
    e.preventDefault();
    this.props.handleDuelSelect(e.target);
  }

  render() {
    return <div className="open-duels">
        <select onChange={this.onChange}>
          <option>Choose a Duel</option>
          {this.state.openDuels.map(duel => {
            return <option value={duel.id}>
                {duel.challenge}-{duel.challenger}
              </option>;
          })}
        </select>
      </div>;
  }
}

export default OpenDuels;
