// log
function logStatusObject(name, obj) {
  console.log("-- " + name + " = " + JSON.stringify(obj, null, 2));
}
function logStatus(msg) {
  console.log("-- " + msg);
}

// ssdp m-search
var found = false;
var Client = require('node-ssdp').Client
// location request
const url = require('url');
const http = require('http');
const SERVICE_TYPE = "urn:schemas-sbtvd-org:service:GingaCCWebServices:1"
const BaseURL = "GingaCC-Server-BaseURL"
const SecureBaseURL = "GingaCC-Server-SecureBaseURL"

// ssdp m-search
client = new Client();
client.on('response', function (headers, statusCode, rinfo) {
  if (found) return;
  found = true;
  // print headers
  logStatus('m-search response from ' + rinfo.address);
  logStatusObject("response headers ", headers);

  // get location
  var location = 'undefined'
  if (headers["LOCATION"])
    location = headers["LOCATION"];
  console.log()

  // perform request
  const uri = new url.URL(location);
  const options = {
    hostname: uri.hostname,
    port: uri.port,
    path: uri.pathname,
    // url: "http://139.82.153.96:44642/location",
    method: 'GET'
  }
  var req = http.request(options, response => {
    var headers = response.headers;
    logStatus('response from ' + location);
    logStatusObject("headers ", headers);
    logStatus("GingaCC-Server BaseURL=" + headers[BaseURL.toLowerCase()])
    logStatus("GingaCC-Server BaseURL=" + headers[SecureBaseURL.toLowerCase()])
    console.log()
  });
  req.end()
});

logStatus('Perform search for GingaCC-Server ...');
console.log()
setInterval(function () {
  client.search(SERVICE_TYPE);
  // client.search('ssdp:all')
}, 4000)
