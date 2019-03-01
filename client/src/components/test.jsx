import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Axios from "axios";
import "./test.css";
import Tippy from "@tippy.js/react";

const uuidv1 = require("uuid/v1");

class TestComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      parentDataState: false,
      submitState: false,
      loadingState: false,
      treeData: {
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
            },
            children: [
              {
                title: "3",
                id: uuidv1(),
                queryData: {
                  type: "form",
                  data: "id={[1].id}"
                },
                method: "POST",
                url: "http://localhost:3001/third",
                children: []
              }
            ]
          },
          {
            title: "2a",
            id: uuidv1(),
            queryData: {},
            method: "GET",
            url: "http://google.com",
            children: [
              {
                title: "3a",
                id: uuidv1(),
                queryData: {},
                method: "GET",
                url: "http://google.com",
                children: []
              }
            ]
          }
        ]
      },
      childData: {
        title: "",
        url: "",
        method: "",
        id: "",
        queryData: {},
        prevNodeId: ""
      }
    };
  }

  handleParentData = event => {
    let { treeData } = this.state;
    const targetName = event.target.name;
    if (targetName == "queryDataType") {
      treeData.queryData.type = event.target.value;
    } else if (targetName === "queryData") {
      treeData.queryData.data = event.target.value;
    } else {
      treeData[event.target.name] = event.target.value;
    }
    this.setState({ treeData });
  };

  submitParentData = () => {
    console.log("Submitted Parent Data");
    this.setState({ parentDataState: true });
  };

  handleChildData = event => {
    let { childData } = this.state;
    const targetName = event.target.name;
    if (targetName == "queryDataType") {
      childData.queryData.type = event.target.value;
    } else if (targetName === "queryData") {
      childData.queryData.data = event.target.value;
    } else {
      childData[event.target.name] = event.target.value;
    }
    this.setState({ childData });
  };

  addChild() {
    const childData = { ...this.state.childData, id: uuidv1() };
    console.log(childData);
    this.findNodeAndAdd(childData.prevNodeId, childData, this.state.treeData);
    this.clearChildFields();
  }

  clearChildFields() {
    this.setState({
      show: false,
      childData: {
        title: "",
        url: "",
        method: "",
        id: "",
        queryData: {},
        prevNodeId: ""
      }
    });
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  openModalForAddChild = id => {
    console.log(id);
    const childData = { ...this.state.childData, prevNodeId: id };
    console.log(childData);

    this.setState({ show: true, childData: childData });
  };

  removeChild(id) {
    this.findNodeAndRemove(
      id,
      { title: "", id: uuidv1() },
      this.state.treeData
    );
  }

  findNodeAndRemove(nodeId, json, node, parentNode) {
    if (node.id == nodeId) {
      const index = parentNode.findIndex(node => node.id === nodeId);
      parentNode.splice(index, 1);
      this.setState({ treeData: this.state.treeData });
    } else {
      if (node.children)
        for (var i = 0; i < node.children.length; i++) {
          this.findNodeAndRemove(nodeId, json, node.children[i], node.children);
        }
    }
  }

  findNodeAndAdd(nodeId, json, node) {
    if (node.id == nodeId) {
      if (node.children) {
        node.children.push(json);
        this.setState({ treeData: this.state.treeData });
      } else {
        node.children = [];
        node.children.push(json);
        this.setState({ treeData: this.state.treeData });
        console.log(node.children);
      }
    } else {
      if (node.children)
        for (var i = 0; i < node.children.length; i++) {
          this.findNodeAndAdd(nodeId, json, node.children[i]);
        }
    }
  }

  changeData(event, id) {
    const title = event.target.value;
    this.findNodeAndEditData(id, title, this.state.treeData);
  }

  findNodeAndEditData(nodeId, title, node) {
    if (node.id == nodeId) {
      node.title = title;
      this.setState({ treeData: this.state.treeData });
    } else {
      if (node.children)
        for (var i = 0; i < node.children.length; i++) {
          this.findNodeAndEditData(nodeId, title, node.children[i]);
        }
    }
  }

  renderRow(node) {
    let row = [];
    node.children.map((doc, index) => {
      row.push(this.renderChildComponent(doc, index));
    });
    return row;
  }

  getName(node) {
    console.log(node);
  }

  generateJSON() {
    this.setState({ loadingState: true });
    Axios.post("http://localhost:5000/postjson", this.state.treeData).then(
      response => {
        console.log(response.data);
        this.setState({
          treeData: response.data,
          submitState: true,
          loadingState: false
        });
      }
    );
  }

  state = {};
  render() {
    return (
      <div className="container-fluid col-md-12">
        {this.renderModal()}
        {/* <!-- Input Box --> */}
        <div className={"row" + (this.state.parentDataState ? " hidden" : " ")}>
          <div className="input-box col-md-12">
            <input
              className="form-control"
              name="title"
              type="text"
              placeholder="Enter the Request ID"
              value={this.state.treeData.title}
              onChange={event => this.handleParentData(event)}
            />
            <br />
            <div className="row">
              <div className="col-2">
                <select
                  class="custom-select"
                  name="method"
                  type="text"
                  value={this.state.treeData.method}
                  onChange={event => this.handleParentData(event)}
                >
                  <option selected>Method</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
              </div>
              <div className="col-10">
                <input
                  className="form-control"
                  name="url"
                  type="url"
                  placeholder="Enter the URL"
                  value={this.state.treeData.url}
                  onChange={event => this.handleParentData(event)}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-2">
                <select
                  class="custom-select"
                  name="queryDataType"
                  type="text"
                  value={this.state.treeData.queryData.type}
                  onChange={event => this.handleParentData(event)}
                >
                  <option selected>Type</option>
                  <option value="query">query</option>
                  <option value="param">param</option>
                  <option value="form">form</option>
                </select>
              </div>
              <div className="col-10">
                <input
                  className="form-control"
                  name="queryData"
                  type="url"
                  placeholder="Enter the Query Data"
                  value={this.state.treeData.queryData.data}
                  onChange={event => this.handleParentData(event)}
                />
              </div>
            </div>
            <br />
            <div className="col-12">
              <button
                className="btn btn-primary"
                onClick={() => this.submitParentData()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        {/* <!-- Input Box --> */}

        {/* Display Parent Data */}
        <div className={"row" + (this.state.parentDataState ? "" : " hidden")}>
          <div
            className={
              "loading-container " +
              (this.state.loadingState
                ? "d-flex align-items-center justify-content-center "
                : "hidden")
            }
          >
            {this.renderLoader()}
          </div>
          {this.state.loadingState
            ? ""
            : this.renderParentComponent(this.state.treeData)}
        </div>
        {/* Display Parent Data */}
      </div>
    );
  }

  renderChildComponent(node, index) {
    {
      return (
        <Tippy content={<span>Tooltip</span>}>
          <div onClick={() => this.getName(node)} className="col-md-6">
            <div
              className={
                "card-container" +
                (node.errorState ? " danger-bg" : " success-bg") +
                (this.state.submitState ? " " : " card-container-bg")
              }
            >
              <p>
                {node.title} -{" "}
                {node.errorState ? node.error : node.responseCode}
              </p>
              {/* <input
              type="url"
              value={node.title}
              onChange={event => this.changeData(event, node.id)}
            /> */}
              <hr />
              <div className="action-container d-flex justify-content-center">
                <button
                  className="btn btn-light"
                  onClick={() => this.openModalForAddChild(node.id)}
                >
                  +
                </button>
                <button
                  className="btn btn-dark margin-left"
                  onClick={() => this.removeChild(node.id)}
                >
                  -
                </button>
              </div>
              <br />
              {node.children ? (
                <div className="row">{this.renderRow(node)}</div>
              ) : (
                ""
              )}
            </div>
          </div>
        </Tippy>
      );
    }
  }

  renderParentComponent(node, index) {
    {
      return (
        <div className="col-md-12 parent-container">
          <p>
            {node.title} - {node.responseCode ? node.responseCode : "N"}
          </p>
          <p>{node.url}</p>
          <p>{node.method}</p>
          <hr />
          <button
            className="btn btn-success"
            onClick={() => this.openModalForAddChild(node.id)}
          >
            Add New Child
          </button>

          <button
            className="btn btn-info margin-left"
            onClick={() => this.generateJSON()}
          >
            Generate JSON
          </button>
          <br />
          <br />
          {node.children ? (
            <div className="row">{this.renderRow(node)}</div>
          ) : (
            ""
          )}
        </div>
      );
    }
  }

  renderModal() {
    return (
      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <input
                className="form-control"
                name="title"
                type="text"
                placeholder="Enter the Request ID"
                onChange={event => this.handleChildData(event)}
              />
              <br />
              <div className="row">
                <div className="col-4">
                  <select
                    class="custom-select"
                    name="method"
                    type="text"
                    onChange={event => this.handleChildData(event)}
                  >
                    <option selected>Method</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>
                <div className="col-8">
                  <input
                    className="form-control"
                    name="url"
                    type="url"
                    placeholder="Enter the URL"
                    onChange={event => this.handleChildData(event)}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-4">
                  <select
                    class="custom-select"
                    name="queryDataType"
                    type="text"
                    onChange={event => this.handleChildData(event)}
                  >
                    <option selected>Type</option>
                    <option value="query">query</option>
                    <option value="param">param</option>
                    <option value="form">form</option>
                  </select>
                </div>
                <div className="col-8">
                  <input
                    className="form-control"
                    name="queryData"
                    type="url"
                    placeholder="Enter the Query Data"
                    onChange={event => this.handleChildData(event)}
                  />
                </div>
              </div>
              <br />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => this.addChild()}>
            Add Child
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderLoader() {
    return (
      <div className="loader">
        <div class="lds-ring">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }
}

export default TestComponent;
