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
        <GetConfigJSON />
      </div>
    );
  }
}

export default HomeComponent;
