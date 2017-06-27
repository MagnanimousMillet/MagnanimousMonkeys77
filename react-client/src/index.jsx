import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Login from './components/Login.jsx';
import Student from './components/Student.jsx';
import Instructor from './components/Instructor.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: '',
      tokenId: ''
    }
  }

  componentDidMount() {
    this.setState({ view: 'login' });
  }

  onSignIn(googleUser) {
    console.log(googleUser);
    let tokenId = googleUser.tokenId;
    axios({
      method: 'get',
      url: '/login',
      params: {
        tokenId: tokenId
      }
    });
    this.setState({ view: 'user'});
  }

  render () {
    return (
      <div>
        <nav className="navbar navbar-default">
          <span className="navbar-brand">ThumbsCheck</span>
        </nav>
        <div className="row">
          <div className="col-xs-10">
            {this.state.view === 'login'
              ? <Login onSignIn={this.onSignIn.bind(this)}/>
              : this.state.view === 'student'
              ? <Student />
              : <Instructor /> }
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));