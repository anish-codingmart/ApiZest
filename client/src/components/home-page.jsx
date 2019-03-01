import React, { Component } from "react";
import GetConfigJSON from "../components/getConfigJSON";
import Tree from "../components/tree";
import "./home-page.css";
import StepWizard from "react-step-wizard";

class HomeComponent extends Component {
  state = {
    step: 2
  };
  render() {
    return (
      <div className="main-container">
        <StepWizard>
          <GetConfigJSON />
          <Tree />
        </StepWizard>

        <div className="nav-stepper">
          <p>
            <button onClick={this.previousStep}>Previous Step</button>
          </p>
          <p>
            <button onClick={this.nextStep}>Next Step</button>
          </p>
        </div>
      </div>
    );
  }
}

export default HomeComponent;
