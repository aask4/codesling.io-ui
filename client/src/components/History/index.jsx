import React, { Component } from 'react';
import axios from 'axios';

import { HistoryList } from './HistoryList.jsx';

class History extends Component {
  state = { 
    history: [],
    userInfo: null
  }

  async componentDidMount() {
    const id = localStorage.getItem('id');
    const history = await axios.get(`http://localhost:3396/api/history/fetchAllHistory/${id}`);
    const userInfo = await axios.get(`http://localhost:3396/api/users/fetchUserInfo/${id}`)
    this.setState({ history: history.data, userInfo: userInfo.data.rows[0] });
  }

  showstate() {
    console.log(this.state)
  }
  
  render() {
    let { userInfo } = this.state;
    return (
      <div>
        <h2><strong>Challenge History</strong></h2>
        {userInfo && (
          <div>
            clout: {userInfo.clout}
            <br/>
            kdr: {userInfo.deaths === 0 ? userInfo.kills + '.0' : userInfo.kills/userInfo.deaths}
          </div>
        )}
        <hr/>
        <br/>
        {this.state.history.length > 0 ? 
          <HistoryList history={this.state.history} userInfo={userInfo}/>
          :
          <h4>You have not participated in any challenges</h4>
          }
      </div>
    );
  }
}

export default History;
