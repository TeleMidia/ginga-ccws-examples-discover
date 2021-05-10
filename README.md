# ginga-examples-ws-discover

![ginga](https://upload.wikimedia.org/wikipedia/commons/c/ce/Ginga_Middleware_Logo.png)

GingaCC WebServices is a service running at Ginga TV middleware with API to support second screen and SmartTV applications.
This project has a mock server and clients examples to discover this service.

## mock server

``` bash
npm install
node discover-mock-server.js
```

## cmd clients

#### Node client

``` bash
npm install
node discover-client.js
```

#### Dart client

``` bash
dart discover-client.dart
```

#### Dotnet client

``` bash
cd discover_client_dotnet
dotnet run
```

#### flutter client

``` bash
cd discover_client_flutter
flutter run
```

The next screenshot shown the flutter client after find the mock-server address.

<img src="discover_client_flutter/screenshot.png" width="200" height="400">
