const instanceLocator = "v1:us1:aaa475a4-262e-4c07-a366-bc4e617d0afb";
const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/aaa475a4-262e-4c07-a366-bc4e617d0afb/token";
const roomId = 12972338;
const username = "admin";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: []
    }
    this.sendMessage = this.sendMessage.bind(this)
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: instanceLocator,
      userId: username,
      tokenProvider: new Chatkit.TokenProvider({
        url: testToken
      })
    });

    chatManager.connect().then(currentUser => {
      this.currentUser = currentUser;
      currentUser.subscribeToRoom({
        roomId: roomId,
        hooks: {
          onNewMessage: message => {
            this.setState({
              messages: [...this.state.messages, message]
            })
          }
        }
      })
    });
  }

  sendMessage(text) {
    console.log("text: " + text)
    this.currentUser.sendMessage({
      text,
      roomId: roomId
    })
  }

  render() {
    return (
      <div className="app">
        <Title />
        <MessageList messages={this.state.messages} />
        <SendMessageFrom sendMessage={this.sendMessage} />
      </div>
    )
  }
}

function Title() {
  return <p className="title">Chat Application</p>
}

class MessageList extends React.Component {
  render() {
    return (
      <ul className="message-list">
        {this.props.messages.map(message => {
              return (
                <li key={message.id}>
                  <div>
                    {message.senderId}
                  </div>
                  <div>
                    {message.text}
                  </div>
                </li>
              )
            }
          )}
      </ul>
    )
  }
}


class SendMessageFrom extends React.Component {
  /* Is a controlled component: it controls what's being rendered in the input field via the state. */
  constructor() {
    super()
    this.state = {
      message: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    console.log("handleChange: " + e.target.value)
    this.setState({
      message: e.target.value
    })
    
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.sendMessage(this.state.message) // sendMessage lives inside the App component
    this.setState({
      message: ''
    })
  }
  
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="send-message-form">
        <input onChange={this.handleChange} value={this.state.message} placeholder="Type your message and hit ENTER" type="text" />
      </form>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
