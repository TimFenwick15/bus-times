#include <Adafruit_NeoPixel.h>
#define PIN    12
#define N_LEDS 30

Adafruit_NeoPixel strip = Adafruit_NeoPixel(N_LEDS, PIN, NEO_GRB + NEO_KHZ800);

#include <ESP8266WiFi.h>
const char* ssid     = "<wifi name>";
const char* password = "<wifi password>";
const char* host     = "<requestbus server>";
const int httpPort   = 8000;

void light(String data);
void off();
void error();
 
void setup() {
  strip.begin();
  
  Serial.begin(115200);
  delay(100);
 
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
 
  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
 
int value = 0;
 
void loop() {
  ++value;
  if (value > 60) {
    off();
    while(true) {
      delay(60000 * 60);
    }
  }
 
  Serial.print(String(value) + ": connecting to ");
  Serial.println(host);
  
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    error();
    delay(20000);
    return;
  }
  
  // We now create a URI for the request
  String url = "/";
  Serial.print("Requesting URL: ");
  Serial.println(url);
  
  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
  delay(500);
  
  // Read all the lines of the reply from server and print them to Serial
  while(client.available()){
    String line = client.readStringUntil('\r');
    if (line.indexOf("Data:") != int(- 1))
      light(line);
  }
  
  Serial.println();
  Serial.println("closing connection");
  delay(20000);
}

void light(String data) {
  Serial.println("Insert awesome lighting here: " + data);
  if (data.length() < 6)
    error();
  else {
    String time1_str = data.substring(data.indexOf(":") + 1, data.indexOf(","));
    const uint16_t time1 = atoi (time1_str.c_str());
    const uint16_t time2 = atoi (data.substring(
      data.indexOf(",") + 1, data.indexOf(",", data.indexOf(",") + 1)).c_str());
    uint32_t green = 0x00FF00;
    uint32_t blue = 0x0000FF;
    for (uint16_t i = 0; i < strip.numPixels(); i++) {
      if (i < time1)
        strip.setPixelColor(i, green);
      else if (i < time2)
        strip.setPixelColor(i, blue);
      else
        strip.setPixelColor(i, 0);
      strip.show();
    }
  }
}

void off() {
  for (uint16_t i = 0; i < strip.numPixels(); i++) {
    strip.setPixelColor(i, 0);
    strip.show();
  }
}

void error() {
  uint32_t red = 0xFF0000;
  for (uint16_t i = 0; i < strip.numPixels(); i++) {
    strip.setPixelColor(i, red);
    strip.show();
  }
}


