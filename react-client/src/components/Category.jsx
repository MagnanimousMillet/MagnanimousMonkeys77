import React from 'react';
import ReactDOM from 'react-dom';
//import axios from 'axios';
import { Button, ButtonGroup } from 'react-bootstrap';

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: [],
      questions: [],
      topic: 'select'
    };
  }

  componentWillMount() {
    var obj = {
      keywords: [{keyword: 'politics'},{keyword: 'history'},{keyword: 'economics'},{keyword: 'maths'}],
      questions: [{question: 'how is politics lecture?',keyword: 'politics',average_thumb_question:3.0}, {question: 'how is your experience?',keyword: 'politics',average_thumb_question:4.0}, {question: 'how it went??',keyword: 'politics',average_thumb_question:5.0}]
    }
    this.setState({
      keywords: obj['keywords'],
      questions: obj['questions']
    })
  }

  handleChange(event) {
    this.setState({topic: event.target.value});
    var filterArray = this.state.questions.filter((currentObj) => { 
      return currentObj['keyword'] === event.target.value 
    });
    this.setState({questions: filterArray});
  }

  findAvg(keyword){
    var average = 0;
    var count = 0;
    var total = this.state.questions.reduce((sum,val) => { 
      if(val['keyword'] === keyword){
        count++;
        sum = sum  + val['average_thumb_question'];
      }
      return sum;
    },0);
    average = total/count ? total/count : 0;
    return average;
  }

  render () {
    if(this.state.keywords.length > 0){
      return (
      	<div className="col-xs-12 text-center">
          <label>
            Please Select Topic &nbsp;
            <select value={this.state.topic} onChange={this.handleChange.bind(this)}>
              <option value="select">Select</option>
              {this.state.keywords.map((currentObj) => 
              <option value={currentObj['keyword']}>{currentObj['keyword']}({this.findAvg(currentObj['keyword'])})</option>
              )}
            </select>
          </label>
          &nbsp;
          <input type="submit" value="Submit" onClick={(e) => this.props.changeDataVisualizationView('chart', this.state['questions'])}/>
          <ButtonGroup vertical block bsClass="row">
            <Button
              bsStyle="success"
              onClick={this.props.backButton}>BACK</Button>
          </ButtonGroup>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

export default Category;

