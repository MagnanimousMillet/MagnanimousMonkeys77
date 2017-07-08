import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
var BarChart = require('react-d3-components/lib').BarChart;

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: ''
    }
  }

  componentWillMount() {
    // axios({
    //   method: 'get',
    //   url: '/getDataForVisualization',
    //   params: {
    //     username: this.props.username
    //   }
    // })
    // .then(result => {
    //   this.setState({
    //     results: result.data['results']
    //   });
    // });
    this.setState({
      results:this.props['data']
    })
  }

  render () {
    if(this.state.results !== ''){
      var records = this.state.results;
      let data = [{
        label: 'nnxbvjsdb',
        values: [{x:'', y:0}]
      }]; 
      records.forEach((item, index) => {
        data[0].label = item.question;
        let t = {x: item.question, y: item.average_thumb_question};
        if(index == 0) {
          data[0].values[0] = t;  
        }
        data[0].values.push(t);
      })
      let tooltipBar = function(x, y0, y) {
        return x+": "+y;
      }
      return (
        <div id="chartGraph">
          <BarChart
          data={data}
          colorByLabel={false}
          title=""
          width={800}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltipBar}
          tooltipMode={'element'}
          xAxis={{innerTickSize: 10, label: "Questions"}}
          yAxis={{label: "Average ThumbValue"}}
        />
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