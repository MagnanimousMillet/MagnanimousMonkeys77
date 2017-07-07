import React from 'react';
import axios from 'axios';

class LectureStarter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  handleChange (event) {
    this.setState({
      name: event.target.value
    });
  }

  onLectureStart () {
    axios({
      method: 'post',
      url: '/lecture',
      params: {
        name: this.state.name,
        username: this.props.username
      }
    }).then((response) => {
      this.props.startLecture(response.data.lectureId);
    }).catch((error) => {
      console.log(error);
    })
  }

  render () {
    return (
      <div className="row text-center">
        <div className="col-xs-12 text-center">
          <input
            type="text"
            className="form-control"
            value={this.state.name}
            placeholder="Enter lecture name"
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <div className="col-xs-12 text-center">
          <div
            className="btn btn-lg btn-success"
            onClick={this.onLectureStart.bind(this)}>
            Start Lecture
          </div>
        </div>
      </div>
    )
  }
}

export default LectureStarter;