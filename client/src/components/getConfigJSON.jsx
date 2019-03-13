import React, { Component } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import Files from "react-files";
import Tree from "./tree";
const uuidv1 = require("uuid/v1");

class GetConfigJSON extends Component {
  state = {
    step: 1,
    jsonFile: {},
    configJSON: [
      {
        method: "GET",
        title: "1",
        id: uuidv1(),
        url: "http://localhost:3001/first",
        queryData: {
          type: "query",
          data: "id=123"
        },
        children: [
          {
            method: "GET",
            title: "2",
            id: uuidv1(),
            url: "http://localhost:3001/second",
            queryData: {
              type: "param",
              data: "id={[0].id}"
            }
          }
        ]
      }
    ]
  };
  constructor() {
    super();

    this.fileReader = new FileReader();
    this.fileReader.onload = event => {
      this.setState({ configJSON: JSON.parse(event.target.result) }, () => {
        console.log(this.state.jsonFile);
      });
    };
  }

  renderGetJSON() {
    return (
      <div className="child-container col-md-12">
        <h4>JSON Config</h4>
        <hr />
        <div className="action-container d-flex align-items-center justify-content-center">
          <Files
            className="files-dropzone"
            onChange={file => {
              this.fileReader.readAsText(file[0]);
            }}
            onError={err => console.log(err)}
            accepts={[".json"]}
            multiple
            maxFiles={3}
            maxFileSize={10000000}
            minFileSize={0}
            clickable
          >
            <button className="btn btn-dark">Upload JSON</button>
          </Files>
          <button className="btn btn-dark margin-left">
            Download Sample JSON
          </button>
          <br />
          <br /> <br />
        </div>
        <div className="json-box col-12 d-flex justify-content-center">
          <div className="json-editor">
            <JSONInput
              id="json-editor"
              placeholder={this.state.configJSON}
              locale={locale}
              height="300px"
            />
          </div>
        </div>
        <br />
      </div>
    );
  }

  handleJSON = event => {
    console.log(event);
  };

  renderTree() {
    return (
      <div className="child-container col-md-12">
        <h4>JSON Config</h4>
        <hr />
        <div className="action-container d-flex align-items-center justify-content-center">
          <Files
            className="files-dropzone"
            onChange={file => {
              this.fileReader.readAsText(file[0]);
            }}
            onError={err => console.log(err)}
            accepts={[".json"]}
            multiple
            maxFiles={3}
            maxFileSize={10000000}
            minFileSize={0}
            clickable
          >
            <button className="btn btn-dark">Upload JSON</button>
          </Files>
          <button className="btn btn-dark margin-left">
            Download Sample JSON
          </button>
          <br />
          <br /> <br />
        </div>
        <div className="json-box col-12 d-flex justify-content-center">
          <div className="json-editor">
            <JSONInput
              id="json-editor"
              placeholder={this.state.configJSON}
              locale={locale}
              height="300px"
              onChange={event => this.handleJSON(event)}
            />
          </div>
        </div>
        <br />
      </div>
    );
  }

  getRouter() {
    switch (this.state.step) {
      case 1:
        return (
          <div className="route">
            {this.renderGetJSON()}
            {this.renderStepButtons()}
          </div>
        );

      case 2:
        return (
          <div className="route">
            <Tree configJSON={this.state.configJSON} />
            {this.renderStepButtons()}
          </div>
        );
      default:
        return (
          <div className="route">
            <p>404 : No Where</p>
            {this.renderStepButtons()}
          </div>
        );
    }
  }
  render() {
    return this.getRouter();
  }

  goToNextPage() {
    const step = this.state.step + 1;
    console.log(step);
    this.setState({ step: step });
  }
  goToPrevPage() {
    if (this.state.step !== 1) {
      this.setState({ step: this.state.step - 1 });
    } else {
      console.log("End of Page");
    }
  }

  renderStepButtons() {
    return (
      <div className="step-btns">
        <br />
        <button onClick={() => this.goToPrevPage()} className="btn btn-dark">
          Prev Page
        </button>
        <button
          onClick={() => this.goToNextPage()}
          className="btn btn-dark margin-left"
        >
          Next Page
        </button>
      </div>
    );
  }
}

export default GetConfigJSON;
