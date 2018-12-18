/*****
  MQTT IOT RFID Reader
  - reads values from a single ID-12LA or 7491E RFID reader
  - formats the results as a JSON string
  - connects to an MQTT broker via wifi
  - gets Epoch time from an NTP server
  - and publishes the JSON String to the topic "sensors/rfid"

   Copyright 2018 David J Bristow

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*****/
#define useID12LA_Reader
//#define use7491E_Reader
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <SoftwareSerial.h>

// Variables
WiFiClient espWiFiClient; // change name when multiple readers are in the network
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "192.168.0.7", 3600, 60000);
SoftwareSerial RFID(13, -1); // RX and TX
const char* ssid = "CenturyLink"; // Credentials to connects to WiFi router
const char* password = "xxxxxxxxxxxx";
IPAddress mqtt_server(192, 168, 0, 200); // MQTT broker IP address
int mqttPort = 1883;
char mqttMsg[800]; //buffer used to publish messages via mqtt
unsigned long epochTime = 0;
char pubtopic[] = "sensors/rfid";
String clientId = "rfidRdr01";
char buf[100];
int strLength = 0;
String rfTagId = "";
String rfidJsonPayload = "";
PubSubClient client(mqtt_server, mqttPort, espWiFiClient);

// This function connects the ESP8266 to the LAN
void setup_wifi() {
  delay(10);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("WiFi connected - ESP IP address: ");
  Serial.println(WiFi.localIP());
}

// This function reconnects the ESP8266 to the MQTT broker
void reconnect() {
  while (!client.connected()) {
    //Serial.print("Attempting MQTT connection...");
    if (client.connect(clientId.c_str())) {
      // if (client.connect(clientId)) {
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println();
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

#ifdef useID12LA_Reader // This function reads the RFID ID-12LA transmission
String getTagId() {
  String tagId = "";
  char tagChr;
  int i = 0;
  // Serial.println("Trying to read tag");
  while (!RFID.available()) {
    delay(200);
  }
  while (RFID.available()) {
    tagChr = RFID.read();
    if (tagChr > 0x0f && i < 11) {
      tagId.concat(tagChr);
    }
    i++;
  }
  return tagId;
}
#endif

#ifdef use7491E_Reader // these functions gets the RFID Tag froma 7491E
char valToHex(uint8_t val) {
  if ((val & 0x0f) < 10)
    return ('0' + val);
  else
    return ('a' + (val - 10));
}

String byteToHexString(uint8_t b) {
  String buffer = "";
  buffer += valToHex(b & 0x0f);
  b >>= 4;
  buffer = valToHex(b & 0x0f) + buffer;
  return buffer;
}

String getTagId() {
  String tagId = "";
  String rfidStrg = "";
  char tagChr;
  int i = 0;
  boolean tryingToReadTag = true;

  while (tryingToReadTag) {
    if (RFID.available()) {
      tagChr = RFID.read();
      if (tagChr == 0x02) { // check for header STX
        while (i < 9) {
          delay(2);
          tagChr = RFID.read();
          i++;
          rfidStrg = byteToHexString(tagChr);
          if (i > 2 && i < 8) {
            tagId.concat(rfidStrg);
          }
        }
      }
      tryingToReadTag = false;
    } else {
      delay(100);
    }
  }
  return tagId;
}
#endif

// This function builds the Json message
String buildJson(String id, String sensor, String et) {
  String mqttMsg = "{\"epochTime\":\"";
  mqttMsg = mqttMsg +  et;
  mqttMsg = mqttMsg +  "\",\"sensor\":\"";
  mqttMsg = mqttMsg +  sensor;
  mqttMsg = mqttMsg +  "\",\"rfid\":\"";
  mqttMsg = mqttMsg +  id;
  mqttMsg = mqttMsg +  "\"}";
  return mqttMsg;
}

void setup() {
  Serial.begin(115200);
  RFID.begin(9600);    // start serial to RFID reader
  setup_wifi();
  timeClient.begin();
}

void loop() {
  rfTagId = getTagId();
  if (rfTagId.length() == 10) {
    timeClient.update();
    epochTime = timeClient.getEpochTime();
    rfidJsonPayload = buildJson(rfTagId, "rfidRdr01", String(epochTime));
    strLength = rfidJsonPayload.length() + 1;
    //Serial.println(rfidJsonPayload);
    rfidJsonPayload.toCharArray(buf, strLength);
    if (!client.connected()) { // connect to mqtt broker
      reconnect();
    }
    if (client.connected()) {
      client.publish(pubtopic, buf);
    }
  }
  delay(25);
}
