import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar/navbar";
import HomeComponent from "./components/home-page";
import TestComponent from "./components/test";
import Tree from "./components/tree";
class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <HomeComponent />
      </div>
    );
  }
}

export default App;
