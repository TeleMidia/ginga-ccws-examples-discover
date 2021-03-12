import 'dart:io';
import 'dart:async';
import 'dart:convert';

class Client {
  bool _log;

  Client([bool enableLog = false]) {
    _log = enableLog;
  }

  final InternetAddress _ipv4Multicast = new InternetAddress("239.255.255.250");
  final InternetAddress _ipv6Multicast = new InternetAddress("FF05::C");
  List<RawDatagramSocket> _sockets = <RawDatagramSocket>[];
  Timer _discoverySearchTimer;

  Future createSocket(void Function(String) fn) async {
    List<NetworkInterface> _interfaces;
    _interfaces = await NetworkInterface.list();
    RawDatagramSocket _socket =
        await RawDatagramSocket.bind(InternetAddress.anyIPv4.address, 0);
    _socket.broadcastEnabled = true;
    _socket.multicastHops = 50;
    _socket.readEventsEnabled = true;

    _socket.listen((event) {
      if (_log) print("-- createSocket(): received event " + event.toString());
      switch (event) {
        case RawSocketEvent.read:
          var packet = _socket.receive();
          _socket.writeEventsEnabled = true;
          _socket.writeEventsEnabled = true;

          if (packet == null) {
            return;
          }

          var data = utf8.decode(packet.data);
          if (_log) print("-- createSocket(): data received");
          fn(data);
          break;
      }
    });

    for (var interface in _interfaces) {
      try {
        _socket.joinMulticast(_ipv4Multicast, interface);
      } on OSError {}

      try {
        _socket.joinMulticast(_ipv6Multicast, interface);
      } on OSError {}
    }
    _sockets.add(_socket);
  }

  void stop() {
    if (_discoverySearchTimer != null) {
      _discoverySearchTimer.cancel();
      _discoverySearchTimer = null;
    }
    for (var socket in _sockets) {
      socket.close();
    }
  }

  void request([String searchTarget]) {
    if (searchTarget == null) {
      searchTarget = "ssdp:all";
    }
    var buff = new StringBuffer();
    buff.write("M-SEARCH * HTTP/1.1\r\n");
    buff.write("HOST:239.255.255.250:1900\r\n");
    buff.write('MAN:"ssdp:discover"\r\n');
    buff.write("MX:1\r\n");
    buff.write("ST:$searchTarget\r\n\r\n"); 
    var data = utf8.encode(buff.toString());

    for (var socket in _sockets) {
      try {
        var res = socket.send(data, _ipv4Multicast, 1900);
        if (_log) print("-- request(): sended bytes $res");
      } on SocketException {}
    }
  }

  Future<Null> search(query, void Function(String) fn) async {
    Duration searchInterval = const Duration(seconds: 5);
    if (_sockets.isEmpty) {
      await createSocket(fn);
      await new Future.delayed(const Duration(seconds: 1));
    }
    request(query);
    _discoverySearchTimer = new Timer.periodic(searchInterval, (_) {
      request(query);
    });
  }
}
