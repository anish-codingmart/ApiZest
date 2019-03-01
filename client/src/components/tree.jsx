import React, { Component } from "react";
import SortableTree from "react-sortable-tree";
import { Modal, Button } from "react-bootstrap";
import {
  getNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath
} from "react-sortable-tree";
import Axios from "axios";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import "./test.css";
import Tippy from "@tippy.js/react";
import Popper from "popper.js";

const uuidv1 = require("uuid/v1");

class Tree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      childData: {
        title: "",
        url: "",
        method: "",
        id: "",
        queryData: {},
        prevNodeId: ""
      },
      treeData: [
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
                  children: [
                    {
                      title: "3",
                      id: uuidv1(),
                      queryData: {
                        type: "form",
                        data: "id={[1].id}"
                      },
                      method: "POST",
                      url: "http://localhost:3001/third"
                    }
                  ]
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
                  url: "http://google1.com",
                  children: []
                }
              ]
            }
          ]
        }
      ]
    };
  }

  generate() {
    console.log(this.state.treeData[0]);
    this.setState({ loadingState: true });
    Axios.post("http://localhost:5000/postjson", this.state.treeData[0]).then(
      response => {
        console.log(response.data);
        const treeData = [response.data];
        this.setState({
          treeData: treeData,
          submitState: true,
          loadingState: false
        });
      }
    );
  }

  tooltipInfo(node) {
    return (
      <div className="text-left">
        <p>{node.title}</p>
        <p>
          Method : {node.method}
          <br />
          URL : {node.url}
        </p>
        <div className={"result " + (this.state.submitState ? "" : "hidden")}>
          <p>
            {node.errorState
              ? "Error Code : " + node.error
              : "Response Code : " + node.responseCode}
            <br />
            Response Time : {node.responseTime}
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="tree-container">
        {this.renderModal()}
        <div className="actions-container">
          <button onClick={() => this.generate()} className="btn btn-dark">
            Generate
          </button>
        </div>
        <div className="tree-container">
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            generateNodeProps={rowInfo => ({
              title: (
                <Tippy
                  animation="fade"
                  arrow="scale"
                  content={<span>{this.tooltipInfo(rowInfo.node)}</span>}
                >
                  <div
                    className={
                      "tree-item" +
                      (rowInfo.node.errorState ? " danger-bg" : " success-bg") +
                      (this.state.submitState ? " " : " card-container-bg")
                    }
                  >
                    <div className="d-flex flex-row justify-content-between align-items-center ">
                      {rowInfo.node.title}
                      <br />
                      {this.renderButton(rowInfo)}
                    </div>
                  </div>
                </Tippy>
              )
            })}
          />
        </div>
      </div>
    );
  }

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

  renderButton(rowInfo) {
    return (
      <div className="action-buttons">
        <button
          onClick={() => this.openModalForAddChild(rowInfo)}
          className="btn btn-light"
        >
          +
        </button>
        <button
          onClick={() => this.removeNode(rowInfo)}
          className="btn btn-dark margin-left"
        >
          -
        </button>
      </div>
    );
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  openModalForAddChild = rowInfo => {
    const childData = { ...this.state.childData, rowInfo: rowInfo };
    console.log(childData);
    this.setState({ show: true, childData: childData });
  };

  addChild() {
    const childData = { ...this.state.childData, id: uuidv1() };
    console.log(childData);
    this.addNode(childData);
  }

  addNode(childData) {
    let NEW_NODE = childData;
    let { node, treeIndex, path } = childData.rowInfo;
    console.log(childData);
    let parentNode = getNodeAtPath({
      treeData: this.state.treeData,
      path: path,
      getNodeKey: ({ treeIndex }) => treeIndex,
      ignoreCollapsed: true
    });
    let getNodeKey = ({ node: object, treeIndex: number }) => {
      return number;
    };
    let parentKey = getNodeKey(parentNode);

    let newTree = addNodeUnderParent({
      treeData: this.state.treeData,
      newNode: NEW_NODE,
      expandParent: true,
      parentKey: parentKey,
      getNodeKey: ({ treeIndex }) => treeIndex
    });
    this.setState({ treeData: newTree.treeData });
    this.clearChildFields();
  }

  removeNode(rowInfo) {
    console.log(rowInfo);
    let { node, treeIndex, path } = rowInfo;
    this.setState({
      treeData: removeNodeAtPath({
        treeData: this.state.treeData,
        path: path, // You can use path from here
        getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
          console.log(number);
          return number;
        },
        ignoreCollapsed: true
      })
    });
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
                    className="custom-select"
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
                    className="custom-select"
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
}

export default Tree;
