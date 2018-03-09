import React, {Component} from 'react';
import axios from 'axios';
import FriendListEntry from './friends/index.jsx'
import './AllUsers.css';

class AllUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      all_users: [],
      friends:[]
    }
  }

  async componentDidMount(){
    console.log('inside of component..')
    this.fetchAllUsers();
    this.fetchFriends();
  }
  async fetchAllUsers() {
    const { data } = await axios.get(`http://localhost:3396/api/users/fetchAllUsers`)
    this.setState({ all_users: data.rows });
  }
  async fetchFriends () {
    let user_id = Number(window.localStorage.getItem('id'))
    try {
      let { data } = await axios.get(`http://localhost:3396/api/friends/fetchAllFriends/${user_id}`)
      console.log('this is all friends', data)
      await this.setState({friends: data})
    }catch(e){
      console.log('this is the err fetching all friends', e)
    }
  }
  async addFriend(e) {
    try{
      let body1 = {
        user_id: window.localStorage.getItem('id'),
        friend_id: e.target.value
      }
      let body2 = {
        user_id: e.target.value,
        friend_id: window.localStorage.getItem('id')
      }
      for(let i = 0 ; i < this.state.friends.length; i ++) {
        // console.log('this.state.friends[i],', typeof this.state.friends[i].id, typeof e.target.value)
        if(e.target.value === this.state.friends[i].id.toString()) {
          console.log('this is already your friend');
          return 
        }
      }
      let response1 = await axios.post(`http://localhost:3396/api/friends/addFriend`, body1)
      let response2 = await axios.post('http://localhost:3396/api/friends/addFriend', body2)
      await this.fetchFriends();
    }catch(e) {
      throw e
    }
  }

  render() {
    let {all_users} = this.state;

    return (
      <div>
        <div className='userList'>
          User List:
          <ul className="userList">
            {all_users.length > 0 && all_users.map( user => {
              if (window.localStorage.getItem('id') !== user.id.toString() ) {
                return <li key={user.id}>{user.username}<button value={user.id} onClick={(e)=>this.addFriend(e)}>add</button></li> 
              }
            })}
          </ul>
        </div>
        <div className='userList'>
          Friend List:
          <ul className='friendList'>
            {this.state.friends && this.state.friends.map(friend => {
              return <FriendListEntry key={friend.id} friend={friend}/>
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default AllUsers;