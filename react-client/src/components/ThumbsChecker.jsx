import React from 'react'
import ThumbVisualization from './ThumbVisualization.jsx';
import Countdown from './Countdown.jsx';

class ThumbsChecker extends React.Component {
	constructor(props) {
    super(props);
    this.state = {

    }

  }

	render () {
		return (
			<div className="row">
				<div className="col-xs-12 text-center heading">
					Class average
				</div>
				<ThumbVisualization
					thumbValue={this.props.thumbValue}
				/>
				{this.props.countdown !== 0
					? <div className="col-xs-12 text-center"><Countdown
							countdown={this.props.countdown}
						/>
					<div
						className="btn btn-lg btn-danger"
						onClick={this.props.interrupt}
						>
						End Query
					</div></div>
					: <div className="col-xs-12 text-center">
						<div
								className="btn btn-lg btn-danger"
								onClick={this.props.clearThumbsCheck}
							>
								Clear Thumbs
							</div>
						</div>}
			</div>
	  )
   }
}

export default ThumbsChecker;
