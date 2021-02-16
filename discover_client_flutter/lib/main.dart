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
  Client client = new Client();

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
      print("-- main(): received headers => ");
      print(data);
      RegExp regExp =
          new RegExp(r"GingaCC-Server-BaseURL: *(.*)\s", caseSensitive: false);
      var match = regExp.firstMatch(data);
      if (match != null) {
        url = match[1];
      }
      print("-- main(): GingaCC-Server-BaseURL = " + url);
      _stopScan();
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
          child: Text((url == "" ? "GingaCC-WS not found": "GingaCC-WS found at " + url),
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
