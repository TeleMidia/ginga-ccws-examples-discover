var ip = require('ip')
var Server = require('node-ssdp').Server
server = new Server();

server._extraHeaders = {
  "Ext": "",
  "GingaCC-Server-BaseURL": ip.address() + ":44642",
  "GingaCC-Server-SecureBaseURL": ip.address() + ":44642",
  "GingaCC-Server-PairingMethods": "qcode,kex"
}

console.log(server._extraHeaders);
SERVICE_TYPE = "urn:schemas-sbtvd-org:service:GingaCCWebServices:1"

server.addUSN(SERVICE_TYPE)
server.heads

// server.on('advertise-alive', function (heads) {
//   console.log('advertise-alive', heads)
//   // Expire old devices from your cache.
//   // Register advertising device somewhere (as designated in http headers heads)
// })

// server.on('advertise-bye', function (heads) {
//   console.log('advertise-bye', heads)
//   // Remove specified device from cache.
// })

server.start()
  .catch(e => {
    console.log('Failed to start server:', e)
  })
  .then(() => {
    console.log('Server started.')
  })