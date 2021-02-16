import './discover_client_flutter/lib/client.dart';

void main() {
  Client client = new Client();
  var query = "urn:schemas-sbtvd-org:service:GingaCCWebServices:1";
  client.search(query, (data) async {
    print("-- main(): received headers ... ");
    print(data);
    RegExp regExp = new RegExp(r"GingaCC-Server-BaseURL: *(.*)\s", caseSensitive: false);
    String url;
    var match = regExp.firstMatch(data);
    if (match != null) {
      url = match[1];
    }
    print("-- main(): GingaCC-Server-BaseURL ="  + url);
  });
}
