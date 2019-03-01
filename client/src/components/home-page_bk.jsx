import React, { Component } from "react";
import "./home-page.css";
import Axios from "axios";
class HomeComponent extends Component {
  state = {
    apiCalls: {
      url: "https://jsonplaceholder.typicode.com/posts/1",
      childrenURLs: [
        {
          url:
            "https://jsonplaceholder.typicode.com/comments?postId=${id}&id=${id}"
        }
      ]
    }
  };

  handleShareholderNameChange = idx => evt => {
    const childrenURLs = this.state.apiCalls.childrenURLs.map(
      (shareholder, sidx) => {
        if (idx !== sidx) return shareholder;
        return { ...shareholder, url: evt.target.value };
      }
    );
    this.setState({
      apiCalls: {
        ...this.state.apiCalls,
        childrenURLs: childrenURLs
      }
    });
  };

  handleAddShareholder() {
    const childrenURLs = this.state.apiCalls.childrenURLs.concat([{ url: "" }]);

    this.setState({
      apiCalls: {
        ...this.state.apiCalls,
        childrenURLs: childrenURLs
      }
    });
  }

  handleRemoveShareholder = idx => () => {
    const childrenURLs = this.state.apiCalls.childrenURLs.filter(
      (s, sidx) => idx !== sidx
    );
    this.setState({
      apiCalls: {
        ...this.state.apiCalls,
        childrenURLs: childrenURLs
      }
    });
  };

  handleChange = event => {
    let { apiCalls } = this.state;
    apiCalls[event.target.name] = event.target.value;
    this.setState({ apiCalls });
    console.log(this.state.apiCalls);
  };

  startAPI = () => {
    console.log(this.state.apiCalls);
    Axios.post("http://localhost:3300/testapi/", this.state.apiCalls).then(
      response => {
        console.log(response.data);
      }
    );
  };

  render() {
    return (
      <div className="main-container col-md-12">
        <h4>ApiZest</h4>
        <br />
        <div className="api-test-container">
          <div className="api-main-box text-left">
            <div class="form-group">
              <label for="exampleInputEmail1">Enter the API URL</label>
              <input
                type="url"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter the URL"
                name="url"
                value={this.state.apiCalls.url}
                onChange={event => this.handleChange(event)}
              />
            </div>
            <hr />
            <h6>Child URLs</h6>
            {this.state.apiCalls.childrenURLs.map((api, idx) => (
              <div className="d-flex flex-row align-items-center">
                <input
                  type="url"
                  placeholder={`Enter #${idx + 1} URL`}
                  value={api.url}
                  onChange={this.handleShareholderNameChange(idx)}
                  className="form-control"
                  id="childURL"
                />
                <button
                  type="button"
                  onClick={this.handleRemoveShareholder(idx)}
                  className="btn-danger btn margin-left"
                >
                  -
                </button>
                <br /> <br />
              </div>
            ))}
            <br />
            <p className="text-center">
              <button
                type="button"
                onClick={() => this.handleAddShareholder()}
                className="btn-warning btn margin-left"
              >
                + Add Child URL
              </button>
            </p>
            <hr />
            <p className="text-center">
              <button
                type="button"
                onClick={() => this.startAPI()}
                className="btn-success btn margin-left"
              >
                Start
              </button>
            </p>
          </div>
        </div>
        <div className="api-preview">
          <h4>Preview</h4>
        </div>
      </div>
    );
  }
}

export default HomeComponent;
