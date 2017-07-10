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
          Hi {this.props.givenName}!
          </div>
          <ButtonGroup vertical block bsClass="row">
            <Button 
              bsStyle="success"
              onClick={this.props.renderInstructor}>Begin a new Lecture
            </Button>
            <Button
              bsStyle="primary"
              onClick={(e) => this.props.changeDataVisualizationView('data')}>
             View Data
            </Button>
          </ButtonGroup>        
        </div>
      </div>
    )
  }
}
export default Admin;
