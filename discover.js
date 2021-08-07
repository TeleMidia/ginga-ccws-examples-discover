// log funcs
function logStatusObject(name, obj) {
  if (obj === null) {
    console.log('-- ' + name);
    return;
  }
  console.log('-- ' + name + ' = ' + JSON.stringify(obj, null, 2));
}
function logStatus(msg) {
  console.log('-- ' + msg);
}

// ssdp m-search
const assert = require('assert').strict;
const url = require('url');
const http = require('http');
var SSDPClient = require('node-ssdp').Client
const GINGA_SSDP_TARGET = 'urn:schemas-sbtvd-org:service:GingaCCWebServices:1'
const BaseURL = 'GingaCC-Server-BaseURL'
const SecureBaseURL = 'GingaCC-Server-SecureBaseURL'

client = new SSDPClient({
  reuseAddr: false,
  explicitSocketBind: true // important: force use all interfaces
});

client.on('advertise-alive', function (headers) {
  console.log('advertise-alive');
  logStatusObject('advertise-alive headers ', headers);
});

client.on('advertise-bye', function (headers) {
  console.log('advertise-bye');
  logStatusObject('advertise-bye headers ', headers);
});

client.on('response', function (headers, statusCode, rinfo) {
  console.log('response');
  logStatus('m-search response from ' + rinfo.address);
  logStatusObject('response headers ', headers);
  assert(statusCode == 200);

  // get LOCATION header
  var location = 'undefined'
  if (headers['LOCATION'])
    location = headers['LOCATION'];

  // perform request to LOCATION
  const uri = new url.URL(location);
  const options = {
    hostname: uri.hostname,
    port: uri.port,
    path: uri.pathname,
    method: 'GET'
  }
  var req = http.request(options, response => {
    var headers = response.headers;
    logStatus('get response from ' + location);
    logStatusObject('headers ', headers);
    logStatus('GingaCC-Server BaseURL=' + headers[BaseURL.toLowerCase()])
    logStatus('GingaCC-Server BaseURL=' + headers[SecureBaseURL.toLowerCase()])
    console.log()
  });
  req.end()
});

var search = function () {
  logStatus(`m-search for ${GINGA_SSDP_TARGET}`);
  client.stop()
  client.search(GINGA_SSDP_TARGET);
  // client.search('ssdp:all')
}

logStatus(`m-search for ${GINGA_SSDP_TARGET}`);
search();
setInterval(search, 4000);
