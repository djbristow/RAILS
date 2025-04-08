/*****
  MQTT IOT Turnout Controller
  Copyright 2020-2024 David J Bristow
  Version 2.0.0 - 7/18/2020

  - connects to an MQTT broker via wifi
  - subscribes to the topic acts/to/trnCtlrxx where xx is the this controller
  - {"cntrlr":"trnCtlr01","to":"1|2|3|4","cmd":"throw|close|status"}
  - checks current state of turnout and either switches the turnout using an L293 and changes state or ignores
  - responds to status command for a turnout
  - determines the state of the turnout under command
  - gets Epoch time from an NTP server
  - formats the results as a JSON string
  - {"et":"1588827073","cntrlr":"trnCtlr01","to":"1","state":"THROWN|CLOSED|ERR|INVLD"}
  - and publishes the JSON String to the topic "sensors/toc"

  Note: items marked as "configurable" need to be set for the specifics of
  the model railroad under control

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

/******************  LIBRARY SECTION *************************************/
#include <Wire.h>
#include <Adafruit_MCP23X17.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <PubSubClient.h>
#include <NTPClient.h>
#include <ArduinoJson.h>
#include <params.h>
/***********************  WIFI AND MQTT SETUP *****************************/
const char *ssid = SSID;
const char *password = PASSWORD;
String mqttServer = MQTTSERVER;
int mqttPort = MQTTPORT;
String mqttId = MQTTID;
WiFiClient espWiFi;
IPAddress mqtt_server(1, 1, 1, 1);
String clientId = MQTTID;
PubSubClient client(mqtt_server, 1883, espWiFi);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);
char pubTopic[] = PUBTOPIC;
char subTopic[] = SUBTOPIC;

/***********************  MCP23017 DECLARATION *****************************/
Adafruit_MCP23X17 MCP;
void ICACHE_RAM_ATTR handleInterrupt();

/*****************  GLOBAL VARIABLES  ************************************/
// uint8_t gpioB = 0xFF;
// int turnout = 0;
String turnoutState;
String currentTurnoutState;
unsigned long epochTime = 0;
int loopCount = 0;

/*****************  SYSTEM FUNCTIONS  *************************************/
void setup_wifi()
{
  delay(10);

  WiFi.begin(ssid, password);
  int ind1 = mqttServer.indexOf('.');
  String octet1 = mqttServer.substring(0, ind1);
  int ind2 = mqttServer.indexOf('.', ind1 + 1);
  String octet2 = mqttServer.substring(ind1 + 1, ind2 + 1);
  int ind3 = mqttServer.indexOf('.', ind2 + 1);
  String octet3 = mqttServer.substring(ind2 + 1, ind3 + 1);
  String octet4 = mqttServer.substring(ind3 + 1);
  IPAddress mqtt_ip(octet1.toInt(), octet2.toInt(), octet3.toInt(), octet4.toInt());
  client.setServer(mqtt_ip, mqttPort);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.print("WiFi connected - ESP IP address: ");
  Serial.println(WiFi.localIP());
}
/***************** TURNOUT FUNCTIONS **********************************
  This function determines the state of the Tortoise motor as either
  thrown or closed from the value of the B port and the TO commanded
***********************************************************************/
String determineState(int turnout)
{
  uint8_t gpioB = (uint8_t)((MCP.readGPIOAB() & 0xFF00) >> 8);
  String turnoutState = "CLOSED"; // default to closed
  uint8_t mask = 0x03 << (turnout - 1) * 2;
  uint8_t state = (gpioB & mask) >> (turnout - 1) * 2;
  if (state == 1)
  {
    turnoutState = "THROWN";
  }
  return turnoutState;
}

void setState(int turnout, String cmd)
{
  if (cmd == "CLOSE")
  {
    MCP.digitalWrite((turnout - 1) * 2, LOW);
    MCP.digitalWrite(((turnout - 1) * 2) + 1, HIGH);
  }
  if (cmd == "THROW")
  {
    MCP.digitalWrite((turnout - 1) * 2, HIGH);
    MCP.digitalWrite(((turnout - 1) * 2) + 1, LOW);
  }
}

String checkTurnoutState(int turnout, String currentTurnoutState, String cmd)
{
  String desiredTurnoutState;
  String tempState;
  if (currentTurnoutState == "CLOSED")
  {
    desiredTurnoutState = "THROWN";
  }
  else
  {
    desiredTurnoutState = "CLOSED";
  }
  for (int i = 0; i <= 9; i++)
  {
    tempState = determineState(turnout);
    if (tempState != desiredTurnoutState)
    {
      delay(1000);
    }
    else
    {
      break;
    }
  }
  return tempState;
}
/***************** JSON MESSAGE BUILDER FUNCTION *********************/
String buildJson(String id, int turnout, unsigned long et, String state)
{

  String mqttMsg = "{\"et\":\"";
  mqttMsg += String(et);
  mqttMsg += "\",\"cntrlr\":\"";
  mqttMsg += id;
  mqttMsg += "\",\"to\":\"";
  mqttMsg += turnout;
  mqttMsg += "\",\"state\":\"";
  mqttMsg += state;
  mqttMsg += "\"}";
  return mqttMsg;
}

/************************** MQTT FUNCTIONS ****************************/
void reconnectMqtt()
{
  Serial.print("Attempting MQTT re-connection...");
  while (!client.connected())
  {
    if (client.connect(clientId.c_str()))
    {
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.println(client.state());
      delay(5000); // Wait 5 seconds before retrying
    }
  }
}
void publishMqtt(String payload, String topic)
{
  char buf_payload[100];
  // char buf_topic[20];
  int strLengthPayload = payload.length() + 1;
  payload.toCharArray(buf_payload, strLengthPayload);
  int strLengthTopic = topic.length() + 1;
  topic.toCharArray(pubTopic, strLengthTopic);
  if (!client.connected())
  {
    reconnectMqtt();
  }
  if (client.connected())
  {
    client.publish(pubTopic, buf_payload);
  }
}
void publishMqttToc(int turnout, String turnoutState)
{
  epochTime = timeClient.getEpochTime();
  String msg = buildJson(clientId, turnout, epochTime, turnoutState);
  publishMqtt(msg, PUBTOPIC);
}
void publishHeartbeat()
{
    String et = String(timeClient.getEpochTime());
    Serial.println(et);
    String mqttMsg = "{\"et\":\"";
    mqttMsg += et;
    mqttMsg += "\",\"mcntrlr\":\"";
    mqttMsg += mqttId;
    mqttMsg += "\",\"msgType\":\"heartbeat\"}";
    publishMqtt(mqttMsg, PUBMICRO);
}
void callback(char *topic, byte *payload, unsigned int length)
{
  // Serial.println("got callback");
  String toState;
  int turnout;
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, payload);
  if (error)
  {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }
  String to = doc["to"];
  turnout = to.toInt();
  String cmd = doc["cmd"];
  currentTurnoutState = determineState(turnout);
  if (cmd == "CLOSE")
  {
    if (currentTurnoutState == "THROWN")
    {
      setState(turnout, cmd);
      toState = checkTurnoutState(turnout, currentTurnoutState, cmd);
      publishMqttToc(turnout, toState);
    }
  }
  else if (cmd == "THROW")
  {
    if (currentTurnoutState == "CLOSED")
    {
      setState(turnout, cmd);
      toState = checkTurnoutState(turnout, currentTurnoutState, cmd);
      publishMqttToc(turnout, toState);
    }
  }
  else if (cmd == "STATUS")
  {
    publishMqttToc(turnout, currentTurnoutState);
  }
  else
  {
    publishMqttToc(turnout, "INVLD");
  }
}

void connectMqtt()
{
  Serial.print("Attempting MQTT connection...");
  client.setCallback(callback);
  if (!client.connected())
  {
    reconnectMqtt();
  }
  if (client.connected())
  {
    client.subscribe(subTopic);
  }
}

/*****************  MCP23017 INITIALIZATION FUNCTION  *****************
  This function sets the A port pins as outputs controlling 4 Tortoise
  stall motors and sets up the B port pins as inputs with pull up internal
  resistors. After the pins are setup the state of each turnout is
  determined and published.
***********************************************************************/
void setup_MCP23017()
{
  timeClient.update();
  epochTime = timeClient.getEpochTime();
  MCP.begin_I2C();
  String initialState;
  // GPA0 and GPA1 (pins 21 & 22) output TO1
  MCP.pinMode(0, OUTPUT);
  MCP.pinMode(1, OUTPUT);
  // GPA2 and GPA3 (pins 23 & 24) output TO2
  MCP.pinMode(2, OUTPUT);
  MCP.pinMode(3, OUTPUT);
  // GPA4 and GPA5 (pins 25 & 26) output TO3
  MCP.pinMode(4, OUTPUT);
  MCP.pinMode(5, OUTPUT);
  // GPA6 and GPA7 (pins 27 & 28) output TO4
  MCP.pinMode(6, OUTPUT);
  MCP.pinMode(7, OUTPUT);
  // GPB0 and GPB1 (pins 1 & 2) input TO1 position
  MCP.pinMode(8, INPUT_PULLUP);
  MCP.pinMode(9, INPUT_PULLUP);
  // GPB2 and GPB3 (pins 3 & 4) input TO2 position
  MCP.pinMode(10, INPUT_PULLUP);
  MCP.pinMode(11, INPUT_PULLUP);
  // GPB2 and GPB3 (pins 5 & 6) input TO3 position
  MCP.pinMode(12, INPUT_PULLUP);
  MCP.pinMode(13, INPUT_PULLUP);
  // GPB2 and GPB3 (pins 7 & 8) input TO4 position
  MCP.pinMode(14, INPUT_PULLUP);
  MCP.pinMode(15, INPUT_PULLUP);
  epochTime = timeClient.getEpochTime();
  // check setting of turnout contacts then initialize the L293s
  for (int i = 1; i <= 4; i++)
  {
    initialState = determineState(i);
    if (initialState == "CLOSED")
    {
      setState(i, "CLOSE");
    }
    else if (initialState == "THROWN")
    {
      setState(i, "THROW");
    }
    String payload = buildJson(clientId, i, epochTime, (determineState(i)));
    publishMqtt(payload, PUBTOPIC);
  }
}

/*****************  SETUP FUNCTION  ***********************************/
void setup()
{
  Serial.begin(115200);
  delay(5000);
  Serial.println("\n Starting WiFi Turnout Cntlr");
  WiFi.begin(ssid, password);
  int ind1 = mqttServer.indexOf('.');
  String octet1 = mqttServer.substring(0, ind1);
  int ind2 = mqttServer.indexOf('.', ind1 + 1);
  String octet2 = mqttServer.substring(ind1 + 1, ind2 + 1);
  int ind3 = mqttServer.indexOf('.', ind2 + 1);
  String octet3 = mqttServer.substring(ind2 + 1, ind3 + 1);
  String octet4 = mqttServer.substring(ind3 + 1);
  IPAddress mqtt_ip(octet1.toInt(), octet2.toInt(), octet3.toInt(), octet4.toInt());
  client.setServer(mqtt_ip, mqttPort);
  client.setCallback(callback);
  connectMqtt();
  timeClient.begin(mqtt_ip);
    while (!timeClient.update())
    {
        timeClient.forceUpdate();
    }
  setup_MCP23017();
  String mqttMsg = "{\"et\":\"";
  mqttMsg += + timeClient.getEpochTime();
  mqttMsg += "\",\"micro\":\"";
  mqttMsg += clientId;
  mqttMsg += "\",\"msgType\":\"initial\"";
  mqttMsg += "\",\"ip\":\"";
  mqttMsg += WiFi.localIP().toString();
  mqttMsg += "\"}";
  publishMqtt(mqttMsg, "micros");
  Serial.println("Finished Setup");
}
/*****************  MAIN LOOP  ****************************************
  The main loop function runs over and over again forever first
  subscribing to a message if a message was rxd and it wasn't a status
  cmd a loop is checks to see that the closed or thrown position has been
  achieved. Then a message is published with the status of the turnout
  under command.
***********************************************************************/
void loop()
{
  loopCount++;
  if (client.connected())
    client.loop();
  else
    connectMqtt();
  delay(200);
  if (loopCount > 300)
    {
        publishHeartbeat();
        loopCount = 0;
    }
}
