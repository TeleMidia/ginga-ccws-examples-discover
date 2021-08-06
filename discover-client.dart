// @dart=2.9
import './discover_client_flutter/lib/client.dart';
import 'dart:io';

void main() {
  Client client = new Client();
  var query = "urn:schemas-sbtvd-org:service:GingaCCWebServices:1";
  var found = false;
  client.search(query, (data) async {
    if (found) return;
    found = true;
    print("-- m-search response headers ... " + data);
    String locationUrl = new RegExp(r"LOCATION: *(.*)\s", caseSensitive: false)
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
    });
  });
}
