import React from 'react'
import axios from 'axios'
class Friend extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      friendList: ''
    }
    this.fetchAllFriends.bind(this)
  }
  async componentDidMount (){
    this.fetchAllFriends()
  }
  async fetchAllFriends() {
    let user_id = window.localStorage.getItem('id')
    try {
      let { data } = axios.get(`http://localhost:3396/api/friends/fetchAllFriends/${user_id}`)
      console.log('this is the friendlIST',data)
      // this.setState({friendList})
    }catch(e){
      throw e
    }
  }
  search(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  async submit() {
    try{
      let { data } = await axios.get(`http://localhost:3396/api/`)

    }
    catch(e){
      console.log('having err doing search request', e)
    }
  }
  render() {
    return (
      <div>
        <div>
          <input style={{width:'100px'}} type='text' name='search' onChange={(e)=> this.search(e)}/>
          <button onClick={()=>this.submit()}>search</button>
          {this.state.friendList && <div>{JSON.stringify(this.state.friendList)}</div>}
        </div>
        <div>
        </div>
      </div>
    )
  }
}

export default Friend