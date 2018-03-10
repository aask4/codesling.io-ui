import React from 'react'
import axios from 'axios'

class FriendListEntry extends React.Component {
  constructor(props) {
    super(props)
  }
  async componentDidMount () {

  }
  render() {
    return (
      <li>
        {this.props.friend.username}
      </li>
    )
  }
}

export default FriendListEntry 