// Import Modules
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
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

init();

async function init() {
  const apiCalls = [
    { url: "http://www.form49a.in:5000/" },
  ];

  for (let instances = 1; instances < 100; instances++) {
    callApi(apiCalls);
  }
}

// Call API
async function callApi(apiCalls) {
  let result;
  for (let [apiIndex, api] of apiCalls.entries()) {
    // Try Block
    try {
      // If Key Values Present
      if (result) {
        api.url = renderURL(api.url, {
          id: result.data.userId,
          postId: result.data.userId
        });
      }
      // Result of API Call
      result = await getAxios(api.url);
      // console.log(result);
      console.log(
        "API - Response Code - Time | ",
        apiIndex,
        result.status,
        result.duration
      );
    } catch (err) {
      console.error("Error");
    }
  }
}

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

