import React from 'react';
import axios from 'axios'

class LectureStarter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	name: '',
      hasMicrophone: false,
      recording: false
    }
    this.recognition = ''
  }


  hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  onRecord() {
    this.setState({
      recording: !this.state.recording,
    }, () => {
      this.state.recording ? this.startRecording() : this.stopRecording()
    })
  }

  startRecording() {
    this.setState({
      name: ''
    }, () => { 
      var index = 0;
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.start();
      this.recognition.onstart = () => console.log('hello');
      this.recognition.onspeechend = () => console.log('woah');
      this.recognition.onresult = (event) => {
        if (event.results[index].isFinal) {
          this.setState({
            name: this.state.name += event.results[index]['0'].transcript
          }, () => {index++})
        }
      }
    })
  }

  stopRecording() {
    this.recognition.stop();
    this.recognition.onend = () => console.log('ended');
  }

  componentDidMount() {
    this.setState({
      hasMicrophone: this.hasGetUserMedia()
    })
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
	      name: this.state.name
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
        {this.state.hasMicrophone ?
          <img onClick={this.onRecord.bind(this)} className="btn btn-mic" src="ios-9-siri-icon-768x766.png"></img> : <div></div>}
      </div>
  	)
	}
}

export default LectureStarter
