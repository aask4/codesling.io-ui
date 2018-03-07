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

  render() {
    let {all_users} = this.state;

    return (
      <div>
        <ul className="userList">
          {all_users.length > 0 && all_users.map( user => {
            console.log(typeof localStorage.id, typeof user.id) //this is a string vs a number
            if (localStorage.id !== user.id) {
              return <li key={user.id}>{user.username}</li> 
            }
          })}
        </ul>
      </div>

    )
  }
}

export default AllUsers;