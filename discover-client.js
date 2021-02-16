var Client = require('node-ssdp').Client
client = new Client();

function logStatusObject(name, obj) {
  console.log("-- " + name + "=" + JSON.stringify(obj, null, 2));
}

function logStatus(msg) {
  console.log("-- " + msg);
}

SERVICE_TYPE = "urn:schemas-sbtvd-org:service:GingaCCWebServices:1"
var BaseURL = "GingaCC-Server-BaseURL"
var SecureBaseURL = "GingaCC-Server-SecureBaseURL"

client.on('response', function (headers, statusCode, rinfo) {
  logStatus('Got a response to GingaCC-Server m-search from ' + rinfo.address);
  logStatusObject("response info ", rinfo);
  logStatusObject("response headers ", headers);
  var host = 'undefined'
  if (headers[BaseURL.toUpperCase()])
    host = headers[BaseURL.toUpperCase()];
  logStatus("gingacc-ws host=" + host)
});

logStatus('Perform serach for GingaCC-Server ...');
setInterval(function() {
  client.search(SERVICE_TYPE);
  // client.search('ssdp:all')
}, 5000)
