import React from 'react';
import axios from 'axios';

class LectureButtons extends React.Component {
	constructor (props) {
		super(props);
    this.state = {
      question: '',
      hasMicrophone: false,
      recording: false
    }
    this.recognition = '';
	}

  componentDidMount() {
    this.setState({
      hasMicrophone: this.hasGetUserMedia()
    })
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

  stopRecording() {
    this.recognition.onend = () => console.log('ended');
    this.recognition.stop();
  }

  startRecording() {
    this.setState({
      question: ''
    })
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.start();
    this.recognition.onresult = (event) => {
      var final = '';
      var interim = '';
      for (var index = 0; index < event.results.length; index++) {
        if (event.results[index].isFinal) {
          final += event.results[index][0].transcript;
        } else {
          interim += event.results[index][0].transcript
        }
      }
      this.setState({
        question: final + interim
      })
    }
  }

  onChange(event) {
  	this.setState({
  		question: event.target.value
  	})
  }

  onThumbsCheck () {
  	console.log('onThumbsCheck is being called');
  	console.log('this.props.lectureId', this.props.lectureId);
    axios({
	    method: 'post',
	    url: '/checkthumbs',
	    data: {question: this.state.question},
	    params: {
	      lecture_id: this.props.lectureId
	    }
	  }).then((response) => {
  		this.props.startThumbsCheck(response.data.questionId);
	  }).catch((error) => {
	  	console.log(error);
	  })
  }

	render () {
		return (
			<div className="row">
				<div className="col-xs-12 text-center">
					<input
            type="text"
            className="form-control"
            value={this.state.question}
            placeholder="Enter question..."
            onChange={this.onChange.bind(this)}
          />
          {this.state.hasMicrophone
          	? <img onClick={this.onRecord.bind(this)} className="btn-mic" src="ios-9-siri-icon-768x766.png"></img>
          	: ''
          }
          {this.state.recording
          	? <div className="recording-screen">RECORDING</div>
          	: <div className="col-xs-12 text-center">
          			<div
									className="btn btn-lg btn-success"
									onClick={this.onThumbsCheck.bind(this)}>
									Check Thumbs
								</div>
								<div
									className="btn btn-lg btn-danger"
									onClick={this.props.endLecture}>
									End Lecture
								</div>
							</div>
          }
				</div>
		  </div>
		)
	}

}

export default LectureButtons;
