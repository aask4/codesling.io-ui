import React, {Component} from 'react';
import axios from 'axios';

import './AllUsers.css';

class AllUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      all_users: []
    }
  }

  async componentDidMount(){
    const { data } = await axios.get(`http://localhost:3396/api/users/fetchAllUsers`)
    this.setState({ all_users: data.rows });
  }

  handleFriend(){

  }

  showState() {
    console.log(this.state);
    console.log(localStorage.id)
  }

  render() {
    let {all_users} = this.state;

    return (
      <div>
      <button type="button" onClick={() => this.showState()}></button>
        <ul className="userList">
          {all_users.length > 0 && all_users.map( user => {
            console.log(typeof localStorage.id, typeof user.id)
            if (localStorage.id !== user.id) {
              return <li>{user.username}</li> 
            }
          })}
        </ul>
      </div>

    )
  }
}

export default AllUsers;