import React from 'react';
import LectureStarter from './LectureStarter.jsx';
import { Button, ButtonGroup } from 'react-bootstrap';
class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render () {
    return (
      <div>
        <div className="col-xs-12 text-center">
          <div>
            <p className="navbar">Hi {this.props.givenName}!</p>
            <p>This is the admin page.<br></br>From here you can view stored student data or start a new lecture.</p>
          </div>
          <ButtonGroup vertical block bsClass="row">
            <Button 
              bsStyle="success"
              onClick={this.props.renderInstructor}>Begin a New Lecture
            </Button>
            <Button
              bsStyle="success"
              onClick={(e) => this.props.changeDataVisualizationView('data')}>
             Data Visualization Page
            </Button>
          </ButtonGroup>        
        </div>
      </div>
    )
  }
}
export default Admin;
