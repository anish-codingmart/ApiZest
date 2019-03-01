import React, { Component } from "react";
class GetConfigJSON extends Component {
  state = {};
  render() {
    return (
      <div>
        Getting Config JSON
        <div className="nav-stepper d-flex justify-content-between">
          <p>
            <button className="btn btn-info" onClick={this.props.previousStep}>
              Previous Step
            </button>
          </p>
          <p>
            <button className="btn btn-info" onClick={this.props.nextStep}>
              Next Step
            </button>
          </p>
        </div>
      </div>
    );
  }
}

export default GetConfigJSON;
