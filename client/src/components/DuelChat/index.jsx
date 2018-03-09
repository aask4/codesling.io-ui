import React, {Component} from 'react';

import './DuelChat.css';

class DuelChat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chatList: [],
      msg: ''
    }
  }

  async componentDidMount(){
    const { socket } = this.props;

    socket.on('server.duelChat', (message) => {    
      this.setState({chatList: [...this.state.chatList, message]})
    })
  }

  updateMsg(e) {
    this.setState({msg: e.target.value})
  }

  resetInput(e){
    e.preventDefault();
    e.target.reset();
  }

  talkShit() {
    const { socket } = this.props;
    socket.emit('client.duelChat', { id: localStorage.id, msg: this.state.msg})
  }

  render() {
    return (
      <div>
        <div className="chatbox">
          {this.state.chatList.length > 0 && this.state.chatList.map( (chat, i) => {
            return <div key={i}>{chat}</div>
          })}
        </div>
        <form onSubmit={e => this.resetInput(e)}>
          <input type="text" onChange={e => this.updateMsg(e)}/>
          <button type="submit" onClick={() => this.talkShit()}>Talk Shit</button>
        </form>
      </div>
    )
  }
}

export default DuelChat;