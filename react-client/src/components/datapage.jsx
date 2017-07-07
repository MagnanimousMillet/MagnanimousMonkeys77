import React from 'react';

class DataPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="row text-center">
        <div className="col-xs-12 text-center">
          <div className="kw-avg-score"></div>
        </div>
        <div classNAme="col-xs-12 text-center">
          <div className="kw-student-avg-score"></div>
        </div>
        <div className="student-kw-avg-score">
          <div classNAme="col-xs-12 text-center"></div>
        </div>
      </div>
    )
  }
}


export default DataPage;