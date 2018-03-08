import React, { Component } from 'react';
import axios from 'axios';

import { HistoryList } from './HistoryList.jsx';

class History extends Component {
  state = { 
    history: []
  }

  async componentDidMount() {
    const id = localStorage.getItem('id');
    const { data } = await axios.get(`http://localhost:3396/api/history/fetchAllHistory/${id}`);
    this.setState({ history: data });
  }
  
  render() {
    return (
      <div>
        <h2><strong>Challenge History</strong></h2>
        <hr/>
        <br/>
        {this.state.history.length > 0 && <HistoryList history={this.state.history}/>}
      </div>
    );
  }
}

export default History;
