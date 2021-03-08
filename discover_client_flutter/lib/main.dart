/// Flutter code sample for Scaffold

// This example shows a [Scaffold] with a blueGrey [backgroundColor], [body]
// and [FloatingActionButton]. The [body] is a [Text] placed in a [Center] in
// order to center the text within the [Scaffold]. The [FloatingActionButton]
// is connected to a callback that increments a counter.
//
// ![](https://flutter.github.io/assets-for-api-docs/assets/material/scaffold_background_color.png)

import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'client.dart';
import 'dart:io';

void main() => runApp(MyApp());

/// This is the main application widget.
class MyApp extends StatelessWidget {
  static const String _title = 'Flutter Code Sample';

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: _title,
      home: MyStatefulWidget(),
    );
  }
}

/// This is the stateful widget that the main application instantiates.
class MyStatefulWidget extends StatefulWidget {
  MyStatefulWidget({Key key}) : super(key: key);

  @override
  _MyStatefulWidgetState createState() => _MyStatefulWidgetState();
}

/// This is the private State class that goes with MyStatefulWidget.
class _MyStatefulWidgetState extends State<MyStatefulWidget> {
  bool _scanning = false;
  String url = "";
  Client client = new Client(true);

  void _stopScan() {
    setState(() {
      _scanning = false;
    });
    client.stop();
  }

  void _scan() {
    setState(() {
      _scanning = true;
    });
    var query = "urn:schemas-sbtvd-org:service:GingaCCWebServices:1";
    client.search(query, (data) async {
      print("-- m-search response headers ... " + data);
      String locationUrl =
          new RegExp(r"LOCATION: *(.*)\s", caseSensitive: false)
              .firstMatch(data)[1];
      HttpClient client = new HttpClient();
      client.getUrl(Uri.parse(locationUrl)).then((HttpClientRequest request) {
        return request.close();
      }).then((HttpClientResponse response) {
        print("-- response from " + locationUrl);
        print("-- GingaCC-Server-BaseURL = " +
            response.headers["GingaCC-Server-BaseURL"][0]);
        print("-- GingaCC-Server-SecureBaseURL = " +
            response.headers["GingaCC-Server-SecureBaseURL"][0]);
        url = response.headers["GingaCC-Server-BaseURL"][0];
        _stopScan();
      });
    });
  }

  Widget build(BuildContext context) {
    if (_scanning) {
      return Scaffold(
        appBar: AppBar(
          title: Text('GingaCC-WS Discover'),
        ),
        body: SpinKitRing(
          color: Colors.blue,
          size: 50.0,
        ),
        floatingActionButton: FloatingActionButton.extended(
          icon: Icon(Icons.stop),
          label: Text("Stop search"),
          onPressed: _stopScan,
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      );
    } else {
      return Scaffold(
        appBar: AppBar(
          title: Text('GingaCC-WS Discover'),
        ),
        body: Center(
          child: Text(
              (url == ""
                  ? "GingaCC-WS not found"
                  : "GingaCC-WS found at " + url),
              style:
                  new TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold)),
        ),
        floatingActionButton: FloatingActionButton.extended(
          icon: Icon(Icons.search),
          label: Text("Start search"),
          onPressed: _scan,
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      );
    }
  }
}
