import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Button, ButtonGroup } from 'react-bootstrap';
var BarChart = require('react-d3-components/lib').BarChart;

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: ''
    }
  }

  componentWillMount() {
    axios({
      method: 'get',
      url: '/getDataForVisualization',
      params: {
        useremail: this.props.userEmail
      }
    })
    .then(result => {
      this.setState({
        results: result.data['results']
      });
    });
  }

  render () {
    if(this.state.results !== ''){
      var records = this.state.results;
      let data = [{
        label: '',
        values: [{x:'', y:0}]
      }]; 
      records.forEach((item, index) => {
        data[0].label = item.name;
        let t = {x: item.name, y: item.average_thumb_question};
        if(index == 0) {
          data[0].values[0] = t;  
        }
        data[0].values.push(t);
      })
      let tooltipBar = function(x, y0, y) {
        return x+": "+y;
      }
      return (
      <div className="col-xs-12 text-center">
        <BarChart
          data={data}
          colorByLabel={false}
          width={1000}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltipBar}
          tooltipMode={'element'}
        />
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
export default Chart;