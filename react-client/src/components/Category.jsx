import React from 'react';
import axios from 'axios';
//import Chart from './components/Chart.jsx';

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
    var obj;
    // var obj = {
    //   keywords: [{keyword: 'politics'},{keyword: 'history'},{keyword: 'economics'},{keyword: 'maths'}],
    //   questions: [{question: 'how is politics lecture?',keyword: 'politics',average_thumb_question:3.0}, {question: 'how is your experience?',keyword: 'politics',average_thumb_question:4.0}, {question: 'how it went??',keyword: 'politics',average_thumb_question:5.0}]
    // }

    axios({
      method: 'get',
      url: '/data',
    }).then(data => {
      obj = data.data;
      console.log(obj.keywords);
      this.setState({
        keywords: obj['keywords'],
        questions: obj['questions']
      })
    });
  }

  handleChange(event) {
    this.setState({topic: event.target.value});
    console.log('eventval ', this.state.topic);
    var filterArray = this.state.questions.filter((currentObj) => {
      return currentObj['keyword_id'] === event.target.value
    });
    this.setState({questions: filterArray});
  }

  findAvg(keyword){
    var average = 0;
    var count = 0;
    var total = this.state.questions.reduce((sum,val) => {
      if(val['keyword_id'] === keyword){
        count++;
        sum = sum  + val['average_thumb_question'];
      }
      return sum;
    },0);
    average = total/count ? total/count : 0;
    return average;
  }

  // <select value={this.state.topic} onChange={this.handleChange.bind(this)}>
  render () {
    if(this.state.keywords.length > 0){
      return (
      	<div id="list">
          <label>
            Please Select Topic &nbsp;
            <select onChange={this.handleChange.bind(this)}>
              <option value="select">Select</option>
              {this.state.keywords.map((currentObj, index) =>
              <option key={index} value={currentObj['id']}>{currentObj['name'] + ' '}({this.findAvg(currentObj['id'])})</option>
              )}
            </select>
          </label>
          &nbsp;
          <input type="submit" value="Submit" onClick={(e) => this.props.changeDataVisualizationView('chart', this.state['questions'])}/>
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
