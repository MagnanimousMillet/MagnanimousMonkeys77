import React from 'react';
import LectureStarter from './LectureStarter.jsx';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onDataVisualiziationClick () {
    this.props.changeDataVisualizationView();
  }

  render () {
    return (
    	<div>
        <div className="col-xs-12 text-center">
          <div>
            <p className="navbar">Hi {this.props.givenName}!</p>
            <p>This is the admin page.<br></br>From here you can view stored student data or start a new lecture.</p>
          </div>
    			<div
            onClick={this.onDataVisualiziationClick.bind(this)}
  					className="btn btn-lg btn-success">
  					Data Visualization Page
  				</div>
        </div>
        <LectureStarter
          startLecture={this.props.startLecture}
        />
      </div>
    )
  }
}

export default Admin;


//  					onClick={this.onThumbsCheck.bind(this)}>
