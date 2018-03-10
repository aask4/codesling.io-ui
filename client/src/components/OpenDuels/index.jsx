import React, { Component } from "react";
import axios from "axios";

import './OpenDuels.css';

class OpenDuels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {}
    }
  }

  componentDidMount() {
    this.props.fetchOpenDuels();
  }

  onChange = (e) => {
    e.preventDefault();
    this.props.handleDuelSelect(e.target);
  }

  render() {
    return <div className="open-duels">
        <select onChange={this.onChange}>
          <option>Choose a Duel</option>
          {this.props.openDuels.map(duel => {
            return <option key={duel.duel_id} value={JSON.stringify(duel)}>
                {duel.title}-{duel.difficulty}
              </option>;
          })}
        </select>
      </div>;
  }
}

export default OpenDuels;
