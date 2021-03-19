// search a WiFi interface to serve
var os = require('os');
var interfaces = os.networkInterfaces();
var bindInteface = null;
var bindAddress = null;
var wifiAddressPrefix = '192.168.0'
Object.keys(interfaces).forEach(function (iName) {
  interfaces[iName].forEach(function (ipInfo) {
    if (ipInfo.address.startsWith(wifiAddressPrefix)) {
      console.log(`-- Found WiFi interface named ${iName} with adress ${ipInfo.address}`);
      bindInteface = iName;
      bindAddress = ipInfo.address;
    }
  });
});
if (bindInteface == null || bindAddress == null) {
  console.log('-- WARNING: It was not able to find a WiFi interface');
}

// log funcs
function logStatusObject(name, obj) {
  console.log("-- " + name + " = " + JSON.stringify(obj, null, 2));
}
function logStatus(msg) {
  console.log("-- " + msg);
}

// ssdp m-search
const assert = require('assert').strict;
const url = require('url');
const http = require('http');
var SSDPClient = require('node-ssdp').Client
const GINGA_SSDP_ST = "urn:schemas-sbtvd-org:service:GingaCCWebServices:1"
const BaseURL = "GingaCC-Server-BaseURL"
const SecureBaseURL = "GingaCC-Server-SecureBaseURL"

client = new SSDPClient({
  // uncoment to only use wifi interface
  // interfaces: [
  //   bindInteface
  // ],
  reuseAddr: false
});

client.on('response', function (headers, statusCode, rinfo) {
  assert(statusCode == 200);
  logStatus('m-search response from ' + rinfo.address);
  logStatusObject("response headers ", headers);

  // get LOCATION header
  var location = 'undefined'
  if (headers["LOCATION"])
    location = headers["LOCATION"];

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
    logStatusObject("headers ", headers);
    logStatus("GingaCC-Server BaseURL=" + headers[BaseURL.toLowerCase()])
    logStatus("GingaCC-Server BaseURL=" + headers[SecureBaseURL.toLowerCase()])
    console.log()
  });
  req.end()
});

logStatus(`m-search for ${GINGA_SSDP_ST}`);
client.search(GINGA_SSDP_ST);

setInterval(function () {
  logStatus(`m-search for ${GINGA_SSDP_ST}`);
  client.stop()
  client.search(GINGA_SSDP_ST);
  // client.search('ssdp:all')
}, 4000)
