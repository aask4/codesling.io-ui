import React from 'react'
import axios from 'axios'

class FriendListEntry extends React.Component {
  constructor(props) {
    super(props)
    console.log('this should be each friend', props.friend)
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