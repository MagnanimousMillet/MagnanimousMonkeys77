import React from 'react';
import Waiting from './Waiting.jsx';
import ThumbInput from './ThumbInput.jsx';

const io = require('socket.io-client');
const socket = io();

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    socket.on('lectureStarted', (data) => {
      props.startLecture(data.lectureId, data.lectureName);
    })

    socket.on('checkingThumbs', (data) => {
      props.startThumbsCheck(data.questionId);
    })

    socket.on('interrupt', (data) => {
      this.props.endThumbsCheck();
    })

    socket.on('lectureEnded', (data) => {
      props.endLectureStudent();
    })
  }

  render () {
    return (
      <div className="row">
        {this.props.lectureStatus === 'lectureNotStarted'
        ? <Waiting
            waitingFor={'lecture'}
            givenName={this.props.givenName}
          />
        : this.props.lectureStatus === 'lectureStarted'
        ? <Waiting
            waitingFor={'question'}
            givenName={this.props.givenName}
            lectureName={this.props.lectureName}
          />
        : <ThumbInput
            countdown={this.props.countdown}
            thumbValue={this.props.thumbValue}
            changeThumbValue={this.props.changeThumbValue}
          />}
      </div>
    )
  }
}

export default Student;
