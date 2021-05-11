// create WebService /location route
const ip = require("ip")
const express = require("express");
const app = express();
const wsport = 44642;
app.get("/location", (req, res) => {
  res.header("Ext", "");
  res.header("GingaCC-Server-BaseURL", "http://" + ip.address() + ":" + wsport);
  res.header("GingaCC-Server-SecureBaseURL", "https://" + ip.address() + ":" + wsport);
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
const SSDP_ST = "urn:schemas-sbtvd-org:service:GingaCCWebServices:1"
const server = new SSDPServer({
  location: "http://" + ip.address() + ":" + wsport + "/location",
  suppressRootDeviceAdvertisements: true,
  reuseAddr: true,
  adInterval: 1000000 // hight notify interval because m-search response is more important
});
server.addUSN(SSDP_ST);
server.start()
  .catch(e => {
    console.log("-- Failed to start GingaCC-Server SSDP:", e);
  })
  .then(() => {
    console.log("-- GingaCC-Server SSDP started.");
  })

process.on('exit', function () {
  server.stop() // advertise shutting down and stop listening
})