import React, {Component} from 'react';
import axios from 'axios';
import FriendListEntry from './Friend/index.jsx'
import './AllUsers.css';

class AllUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      friends:[],
      all_users: []
    }
    this.fetchAllUsers.bind(this)
    this.fetchAllFriends.bind(this)
  }

  async componentDidMount(){
    let result = await this.fetchAllUsers();
    let reuslt2 = await this.fetchAllFriends();
  }
  async fetchAllFriends() {
    console.log('inside of fetchAllfriends')
    let user_id = Number(window.localStorage.getItem('id'))
    try {
      let { data } = await axios.get(`http://localhost:3396/api/friends/fetchAllFriends/${user_id}`)
      console.log('this should be all friends', data)
      await this.setState({friends: data})
    }catch(e){
      console.log('this is the err fetching all friends', e)
    }
  }
  async fetchAllUsers(){
    const { data } = await axios.get(`http://localhost:3396/api/users/fetchAllUsers`)
    console.log('this is the data', data)
    for(let i = 0; i < data.rows.length; i ++) {

    }
    this.setState({ all_users: data.rows });
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
      await this.fetchAllFriends();
    }catch(e) {
      throw e
    }
  }
  async handleDoubleClick() {
    console.log('u just double clicked')
  }
  render() {
    let {all_users} = this.state;
    return (
      <div>
        <ul className="userList">
          {all_users.length > 0 && all_users.map( user => {
            if (window.localStorage.getItem('id') !== user.id.toString() ) {
              return <li key={user.id}>{user.username}<button value={user.id} onClick={(e)=>this.addFriend(e)}>add</button></li> 
            }
          })}
        </ul>
        <ul className='friendList'>
          {this.state.friends && this.state.friends.map(friend => {
            return <FriendListEntry key={friend.id} friend={friend}/>
          })}
        </ul>
      </div>

    )
  }
}

export default AllUsers;