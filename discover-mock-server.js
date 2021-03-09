const ip = require("ip")
// ssdp
const Server = require("node-ssdp").Server
const SERVICE_TYPE = "urn:schemas-sbtvd-org:service:GingaCCWebServices:1"
// ws routes
const express = require("express");
const app = express();
const port = 44642;

// start ws routes
app.get("/location", (req, res) => {
  res.header("Ext", "");
  res.header("GingaCC-Server-BaseURL", "http://" + ip.address() + ":44642");
  res.header("GingaCC-Server-SecureBaseURL", "https://" + ip.address() + ":44642");
  res.header("GingaCC-Server-PairingMethods", "qcode,kex");
  res.header("GingaCC-Server-Manufacturer", "TeleMidia");
  res.header("GingaCC-Server-ModelName", "TeleMidia GingaCC-Server Mock");
  res.header("GingaCC-Server-FriendlyName", "TeleMidia Ginga Mock ");
  res.header("SERVER", "TeleMidia Ginga Mock");
  res.send();
});
app.listen(port, () => {
  console.log(`-- GingaCC-Server listening on port ${port}.`)
});

// start ssdp
const server = new Server({
  location: "http://" + ip.address() + ":44642" + "/location",
  suppressRootDeviceAdvertisements: true
});
server.addUSN(SERVICE_TYPE)
server.start()
  .catch(e => {
    console.log("-- Failed to start GingaCC-Server SSDP:", e)
  })
  .then(() => {
    console.log("-- GingaCC-Server SSDP started.")
  })