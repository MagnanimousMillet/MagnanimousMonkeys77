import React from 'react';
import ReactDOM from 'react-dom';
import { Button, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';


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
    axios({
      method: 'get',
      url: '/data',
    }).then(data => {
      obj = data.data;
      this.setState({
        keywords: obj['keywords'],
        questions: obj['questions']
      })
    });
  }

  handleChange(event) {
    this.setState({topic: event.target.value});
  }

  filterData(){
    var topicId = document.getElementById('topicVal').value
    var filterArray = this.state.questions.filter((currentObj) => {
      return currentObj['keyword_id'] === parseInt(topicId);
    });
    this.setState({questions: filterArray});
    this.props.changeDataVisualizationView('chart', filterArray);
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

  render () {
    if(this.state.keywords.length > 0){
      return (
        <div className="col-xs-12 text-center">
          <label>
            Please Select Topic &nbsp;
            <select id="topicVal" onChange={this.handleChange.bind(this)}>
              <option value="select">Select</option>
              {this.state.keywords.map((currentObj, index) =>
              <option key={index} value={currentObj['id']}>{currentObj['name'] + ' '}({this.findAvg(currentObj['id'])})</option>
              )}
            </select>
          </label>
          &nbsp;
          <input type="submit" value="Submit" onClick={this.filterData.bind(this)}/>
          <ButtonGroup vertical block bsClass="row">
            <Button
              bsStyle="danger"
              onClick={this.props.backButton}>Back</Button>
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