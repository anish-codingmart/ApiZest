// Import Modules
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const CircularJSON = require("circular-json");
var logger = require("tracer").colorConsole();

// require("log-timestamp");

// Init Express
var app = express();
// CORS
app.use(cors());
// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Use Axios Config
useAxiosConfig();
let resultAll = [];

app.post("/testapi", async (req, res) => {
  const apiCalls = req.body;
  console.log(apiCalls);
  const result = await init(apiCalls);
  const json = JSON.parse(CircularJSON.stringify(result));
  res.json(json);
  resultAll = [];
});

async function init(apiCalls) {
  // apiCalls = {
  //   url: "https://jsonplaceholder.typicode.com/posts/1",
  //   childrenURLs: [
  //     {
  //       url:
  //         "https://jsonplaceholder.typicode.com/comments?postId=${id}&id=${id}"
  //     },
  //     {
  //       url:
  //         "https://jsonplaceholder.typicode.com/comments?postId=${id}&id=${id}"
  //     }
  //   ]
  // };
  let promiseAll = [];

  for (let instances = 1; instances <= 1; instances++) {
    let promise = callApi(apiCalls);
    promiseAll.push(promise);
  }

  return Promise.all(promiseAll).then(response => {
    console.log("Done");
    return resultAll;
  });
}

// Call API
async function callApi(apiCalls) {
  let resultData;
  // Try Block
  try {
    // Result of API Call
    const result = await getAxios(apiCalls.url);
    resultData = {
      data: result.data,
      responseTime: result.duration,
      responseCode: result.status
    };
    resultData.children = [];
    if (result) {
      for (let [childApiIndex, childApi] of apiCalls.childrenURLs.entries()) {
        let childApiURL = renderURL(childApi.url, result.data);
        let childResult = await getAxios(childApiURL);
        let childResultData = {
          data: childResult.data[0],
          responseTime: childResult.duration,
          responseCode: childResult.status
        };
        resultData.children.push(childResultData);
      }
    }
    resultAll.push(resultData);
  } catch (err) {
    console.error("Error", err);
  }
}

// Get Axios
function getAxios(apiURL) {
  return axios.get(apiURL).then(response => {
    return response;
  });
}

// Parse URL

function PropURL(obj, is, value) {
  if (typeof is == "string") is = is.split(".");
  if (is.length == 1 && value !== undefined) return (obj[is[0]] = value);
  else if (is.length == 0) return obj;
  else {
    var prop = is.shift();
    //Forge a path of nested objects if there is a value to set
    if (value !== undefined && obj[prop] == undefined) obj[prop] = {};
    return PropURL(obj[prop], is, value);
  }
}

function renderURL(str, obj) {
  return str.replace(/\$\{(.+?)\}/g, (match, p1) => {
    return PropURL(obj, p1);
  });
}

// Axios Configuration

function useAxiosConfig() {
  axios.interceptors.request.use(
    function(config) {
      config.metadata = { startTime: new Date() };
      return config;
    },
    function(error) {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function(response) {
      response.config.metadata.endTime = new Date();
      response.duration =
        response.config.metadata.endTime - response.config.metadata.startTime;
      return response;
    },
    function(error) {
      error.config.metadata.endTime = new Date();
      error.duration =
        error.config.metadata.endTime - error.config.metadata.startTime;
      return Promise.reject(error);
    }
  );
}

// App Listen
app.listen(3300, () => {});

function test() {
  apiCalls = {
    url: "https://jsonplaceholder.typicode.com/posts/1",

    childrenURLs: [
      {
        url: "a1",

        childrenURLs: [
          {
            url: "a2",

            childrenURLs: [
              {
                url: "a31"
              },
              {
                url: "a32"
              }
            ]
          },
          {
            url: "a22"
          }
        ]
      },
      {
        url: "b1",

        childrenURLs: [
          {
            url: "b2",

            childrenURLs: [
              {
                url: "b3",
                childrenURLs: [
                  {
                    url: "b4",
                    childrenURLs: [
                      {
                        url: "b5"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        url: "c1",

        childrenURLs: [
          {
            url: "c2",

            childrenURLs: [
              {
                url: "c31"
              },
              {
                url: "c32"
              }
            ]
          }
        ]
      }
    ]
  };
  let childrenURLs;
  logger.debug("1. Get Master API Call Result");

  if (apiCalls.childrenURLs) {
    childrenURLs = apiCalls.childrenURLs;
    const startState = 0;
    getChild(childrenURLs, startState);
  }
}

function getCount(childrenURLs) {
  return childrenURLs.length;
}

function getChild(childrenURLs) {
  for (let [childIndex, child] of childrenURLs.entries()) {
    console.log(childIndex, child.url, getCount(childrenURLs));
    if (child.childrenURLs) {
      getChild(child.childrenURLs);
    } else {
      console.log("Done");
    }
  }
}
