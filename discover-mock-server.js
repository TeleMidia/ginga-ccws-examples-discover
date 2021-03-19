// search a WiFi interface to serve
const ip = require("ip")
var os = require('os');
var interfaces = os.networkInterfaces();
var serveInteface = null;
var serveAddress = null;
const wifiAddressPrefix = '192.168.0'
Object.keys(interfaces).forEach(function (iName) {
  interfaces[iName].forEach(function (ipInfo) {
    if (ipInfo.address.startsWith(wifiAddressPrefix)) {
      console.log(`-- Found WiFi interface named ${iName} with adress ${ipInfo.address}`);
      serveInteface = iName;
      serveAddress = ipInfo.address;
    }
  });
});
if (serveInteface == null || serveAddress == null) {
  console.log('-- WARNING: It was not able to find a WiFi interface');
}

// create WebService /location route
const express = require("express");
const app = express();
const wsport = 44642;
app.get("/location", (req, res) => {
  res.header("Ext", "");
  res.header("GingaCC-Server-BaseURL", "http://" + serveAddress + ":" + wsport);
  res.header("GingaCC-Server-SecureBaseURL", "https://" + serveAddress + ":" + wsport);
  res.header("GingaCC-Server-PairingMethods", "qcode,kex");
  res.header("GingaCC-Server-Manufacturer", "TeleMidia");
  res.header("GingaCC-Server-ModelName", "TeleMidia GingaCC-Server Mock");
  res.header("GingaCC-Server-FriendlyName", "TeleMidia Ginga Mock ");
  res.header("SERVER", "TeleMidia Ginga Mock");
  res.send();
});
app.listen(wsport, () => {
  console.log(`-- GingaCC - Server WS listening on port ${wsport}.`);
});


// start SSDP
var SSDPServer = require('node-ssdp').Server;
const SERVICE_TYPE = "urn:schemas-sbtvd-org:service:GingaCCWebServices:1"
const server = new SSDPServer({
  location: "http://" + (serveAddress ? serveAddress: ip.address()) + ":" + wsport + "/location",
  suppressRootDeviceAdvertisements: true,
  // uncoment to only use wifi interface
  // interfaces: [
  //   serveInteface
  // ],
  reuseAddr: true,
  adInterval: 30000 // hight notify interval because m-search response is more important
});
server.addUSN(SERVICE_TYPE);
server.start()
  .catch(e => {
    console.log("-- Failed to start GingaCC-Server SSDP:", e);
  })
  .then(() => {
    console.log("-- GingaCC-Server SSDP started.");
  })
  
process.on('exit', function(){
  server.stop() // advertise shutting down and stop listening
})