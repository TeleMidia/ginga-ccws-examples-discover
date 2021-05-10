using System;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using Rssdp;


namespace discover_client_dotnet
{
  class Client
  {
    static void Main(string[] args)
    {
      Console.WriteLine("Searching...");
      Client client = new Client();
      client.SearchForDevices().Wait();
    }
    public static string SSDP_ST = "urn:schemas-sbtvd-org:service:GingaCCWebServices:1";
    public async Task SearchForDevices()
    {
      foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
      {
        if ((ni.NetworkInterfaceType != NetworkInterfaceType.Wireless80211 && ni.NetworkInterfaceType != NetworkInterfaceType.Ethernet) || ni.Name.StartsWith("Local") || ni.Name.StartsWith("vEthernet") || ni.Name.StartsWith("Bluetooth"))
          continue;
        Console.WriteLine("Using in interface " + ni.Name);
        foreach (UnicastIPAddressInformation ip in ni.GetIPProperties().UnicastAddresses)
        {
          if (ip.Address.AddressFamily != System.Net.Sockets.AddressFamily.InterNetwork)
            continue;
          Console.WriteLine("Using ip " + ip.Address.ToString());
          System.Collections.Generic.IEnumerable<DiscoveredSsdpDevice> foundDevices = null;
          try
          {
            SsdpDeviceLocator _deviceLocator = new SsdpDeviceLocator(ip.Address.ToString());
            foundDevices = await _deviceLocator.SearchAsync(SSDP_ST);
          }
          catch
          {
            // do nothing
          }
          foreach (var foundDevice in foundDevices)
          {
            try
            {
              HttpClient client = new HttpClient();
              HttpResponseMessage response = await client.GetAsync(foundDevice.DescriptionLocation.ToString());
              response.EnsureSuccessStatusCode();
              String baseURL = ((String[])response.Headers.GetValues("GingaCC-Server-BaseURL"))[0];

              Console.WriteLine("Found GingaCC-WS" + SSDP_ST + " at " + foundDevice.DescriptionLocation.ToString());
              Console.WriteLine("GingaCC-WS BaseURL is " + baseURL);
            }
            catch
            {

            }
          }
        }
      }
    }
  }
}
