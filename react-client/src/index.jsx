import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Bootstrap from '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../react-client/dist/style.css';
import Login from './components/Login.jsx';
import Student from './components/Student.jsx';
import Admin from './components/Admin.jsx';
import Instructor from './components/Instructor.jsx';
import Category from './components/Category.jsx';
import Chart from './components/Chart.jsx';
import axios from 'axios';

const io = require('socket.io-client');
const socket = io();

var countdownInterval;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: '',
      tokenId: '',
      lectureStatus: 'lectureNotStarted',
      lectureId: '',
      questionId:'',
      thumbValue: 2,
      countdown: 30,
      givenName: '',
      lectureName: '',
      data: [],
      userEmail: '',
      questionAsked: '',
    }
  }

  componentDidMount() {
    this.setState({ view: 'login' });
  }

  renderInstructor() {
    this.setState({ view: 'instructor'})
  }

  backToCategory() {
    this.setState({ view: 'data'})
  }

  backButton() {
    this.setState({ view: 'admin'})
  }

  onSignIn(googleUser) {
    let tokenId = googleUser.tokenId;
    axios({
      method: 'get',
      url: '/login',
      params: {
        tokenId: tokenId
      }
    })
    .then(result => {
      if (result.data[0].user_type === 'STUDENT') {
        this.setState({ view: 'student'});
      } else if (result.data[0].user_type === 'INSTRUCTOR') {
        this.setState({ view: 'admin', userEmail: result.data[0].gmail});
      }
      this.setState({ givenName: googleUser.profileObj.givenName })
      socket.emit('username', { username: googleUser.profileObj.email })
      if(result.data[0].user_type === 'INSTRUCTOR'){
        socket.emit('instructor', { username: googleUser.profileObj.email })
      }
    });

  }

  startLecture (lectureId, lectureName) {
    this.setState({
      lectureStatus: 'lectureStarted',
      lectureId: lectureId,
      lectureName: lectureName
    })
  }

  goToData () {
    this.setState({
      view: 'data'
    })
  }

  endLecture () {
    let lectureId = this.state.lectureId;
    axios({
      method: 'post',
      url: '/endLecture',
      params: {
        lectureId: lectureId
      }
    }).then((result) => {
      this.setState({
        lectureStatus: 'lectureNotStarted',
        lectureId: ''
      })
    })
  }

  endLectureStudent () {
    this.setState({
      lectureStatus: 'lectureNotStarted'
    })
  }

  setCountdownInterval () {
    countdownInterval = setInterval (() => {
      if (this.state.countdown === 0) {
        this.clearCountdownInterval();
        if (this.state.view === 'instructor') this.interruptThumbsCheck();
      } else {
        this.setState({ countdown: this.state.countdown - 1 }, () => {
          if (this.state.view === 'student') {
            socket.emit('thumbValue', { thumbValue: this.state.thumbValue});
          }
        });
      }
    }, 1000)
  }

  clearCountdownInterval () {
    clearInterval(countdownInterval);
    if (this.state.view === 'student') {
      this.setState({
        lectureStatus: 'lectureStarted',
        questionId: '',
        countdown: 30,
        thumbValue: 2
      })
    }
  }

  startThumbsCheck (questionId, questionAsked) {
    this.setState({
      lectureStatus: 'checkingThumbs',
      questionId: questionId,
      questionAsked: questionAsked
    }, this.setCountdownInterval);
  }

  interruptThumbsCheck () {
    axios({
      method: 'post',
      url: '/interrupt',
      params: {
        question_id: this.state.questionId
      }
    });
    this.endThumbsCheck();
  }

  endThumbsCheck () {
    this.setState({countdown: 0});
    this.clearCountdownInterval();
  }

  clearThumbsCheck () {
    this.setState({
      lectureStatus: 'lectureStarted',
      questionId: '',
      countdown: 30,
      thumbValue: 2
    })
  }

  changeThumbValue (value) {
    this.setState({
      thumbValue: value
    })
  }

  changeDataVisualizationView(view, filterData){
    console.log(filterData);
    this.setState({
      view: view,
      data: filterData
    });
  }

  render () {
    return (
      <div>
        <nav className="navbar navbar-default navbar-static-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand">
                <i className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                &nbsp; ThumbsCheck
              </a>
            </div>
          </div>
        </nav>
        <div className="container-fluid main">
            {this.state.view === 'login'
              ? <Login
                  onSignIn={this.onSignIn.bind(this)}
                />
              : this.state.view === 'student'
              ? <Student
                  thumbValue={this.state.thumbValue}
                  changeThumbValue={this.changeThumbValue.bind(this)}
                  startThumbsCheck={this.startThumbsCheck.bind(this)}
                  endThumbsCheck={this.endThumbsCheck.bind(this)}
                  startLecture={this.startLecture.bind(this)}
                  lectureStatus={this.state.lectureStatus}
                  countdown={this.state.countdown}
                  view={this.state.view}
                  endLectureStudent={this.endLectureStudent.bind(this)}
                  givenName={this.state.givenName}
                  lectureName={this.state.lectureName}
                  questionAsked={this.state.questionAsked}
                />
              : this.state.view === 'admin'
              ? <Admin
                  renderInstructor={this.renderInstructor.bind(this)}
                  givenName={this.state.givenName}
                  startLecture={this.startLecture.bind(this)}
                  view={this.state.view}
                  changeDataVisualizationView={this.changeDataVisualizationView.bind(this)}
              />
    		      : this.state.view === 'data'
              ? <Category 
                  backButton={this.backButton.bind(this)} changeDataVisualizationView={this.changeDataVisualizationView.bind(this)}/>
              : this.state.view === 'chart'
              ? <Chart 
                  backButton={this.backToCategory.bind(this)} 
                  username={this.state.givenName} 
                  data={this.state.data}/>
              : <Instructor
                  interrupt={this.interruptThumbsCheck.bind(this)}
                  thumbValue={this.state.thumbValue}
                  backButton={this.backButton.bind(this)}
                  lectureId={this.state.lectureId}
                  lectureStatus={this.state.lectureStatus}
                  startLecture={this.startLecture.bind(this)}
                  endLecture={this.endLecture.bind(this)}
                  startThumbsCheck={this.startThumbsCheck.bind(this)}
                  countdown={this.state.countdown}
                  changeThumbValue={this.changeThumbValue.bind(this)}
                  clearThumbsCheck={this.clearThumbsCheck.bind(this)}
                  view={this.state.view}
                  givenName={this.state.givenName}
                  lectureName={this.state.lectureName}
                  changeDataVisualizationView={this.changeDataVisualizationView.bind(this)}
                />
              }
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
