import React from 'react';
import ThumbVisualization from './ThumbVisualization.jsx';
import Countdown from './Countdown.jsx';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class ThumbInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render () {
    return (
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-12 text-center heading">
  					Input your thumb
          </div>
				</div>
        <div className="row student">
          <div className="col-xs-2" style={{height: "200px", marginLeft: "6px"}}>
            <Slider
              vertical
              min={0}
              max={4}
              marks={{0:'Down', 1:'–', 2:'Mid', 3:'–', 4:'Up'}}
              step={null}
              onChange={this.props.changeThumbValue}
              defaultValue={2}
            />
          </div>
          <div className="col-xs-4">
            <ThumbVisualization
              thumbValue={this.props.thumbValue}
            />
          </div>
        </div>
        <Countdown countdown={this.props.countdown} />
      </div>
    )
  }
}

export default ThumbInput;
