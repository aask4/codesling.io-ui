import React from 'react'

class Logout extends React.Component {
  constructor(props) {
    super(props)
  }
  logout() {
    window.localStorage.clear();
    this.props.history.push('/')
  }
  render() {
    return (
      <div>
        <button onClick={()=>this.logout()}>logout</button>
      </div>
    )
  }
}
export default Logout