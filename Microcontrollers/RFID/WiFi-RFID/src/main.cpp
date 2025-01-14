/*****
 * MQTT IOT RFID Reader
 * Copyright 2020-2025 David J Bristow
 * Version 3.0.0 - 20225-15-04
 * - paramters to connect to the MQTT broker are kept in a params.h file
 *   ID-12LA or equivalent RFID readers are supported
 * - connects to an MQTT broker via wifi
 * - publishes info about this reader to the topic "micros"
 *   {"et":"1590462747","mcntrlr":"rfidRdr01","msgType":"initial",ip":"192.168.0.19"}
 * - publishes a heartbeat to the topic "micros"
 *   {"et":"1590462747","mcntrlr":"rfidRdr01","msgType":"heartbeat"}
 * - reads values from a single RFID reader, tests to ensure it is not a duplicate,
 *   formats the results as a JSON string, gets Epoch time from an NTP server
 *   and then publishes the JSON String to the topic "sensors/rfid"
 *   {"et":"1590463450","mcntrlr":"rfidRdr01","reader":"1","rfid":"1C0044CF23"}

 *****************************************************************************************
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *    http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *****/
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <SoftwareSerial.h>
#include <params.h>

#define RFID_MSG_START 2
#define RFID_MSG_END 3
#define RFID_LENGTH 16
#define NO_TX_PIN -1
#define DATA_PIN1 D7
#define DATA_PIN2 D3
#define BAUD_RATE 9600

/***********************  GLOBAL SETUP *******************************/
WiFiClient espWiFi;
IPAddress mqtt_ser(1, 1, 1, 1);
PubSubClient client(mqtt_ser, 1883, espWiFi);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);
SoftwareSerial rfidRdr[2];
char pubTopic[] = "sensors/rfid";
String subTopic = "micros/cmd/";
char pubMicro[] = "micros";
int mqttRetryAttempts = 0;
int reader = 0;
int rfidLength = 16;
int loopCount = 0;
String readerNum = "";
String mqttServer = MQTTSERVER;
int mqttPort = MQTTPORT;
String mqttId = MQTTID;
int numberReaders = NUMBERREADERS;
String ssid = SSID;
String password = PASSWORD;
String rfTagId;
String lastRfidTagId;

/*********************  MQTT FUNCTIONS  ******************************/
String buildJson(String id, String mcntrlr, String et, String reader)
{
    String mqttMsg = "{\"et\":\"";
    mqttMsg = mqttMsg + et;
    mqttMsg = mqttMsg + "\",\"mcntrlr\":\"";
    mqttMsg = mqttMsg + mcntrlr;
    mqttMsg = mqttMsg + "\",\"reader\":\"";
    mqttMsg = mqttMsg + reader;
    mqttMsg = mqttMsg + "\",\"rfid\":\"";
    mqttMsg = mqttMsg + id;
    mqttMsg = mqttMsg + "\"}";
    return mqttMsg;
}
void reconnectMqtt()
{
    while (!client.connected())
    {
        if (client.connect(mqttId.c_str()))
        {
            mqttRetryAttempts = 0;
            client.subscribe(subTopic.c_str());
        }
        else
        {
            Serial.print("************** ");
            Serial.print(mqttServer);
            Serial.print(" failed, rc=");
            Serial.println(client.state());
            delay(5000);
        }
    }
}
void connectMqtt()
{
    if (!client.connected())
    {
        reconnectMqtt();
    }
    if (client.connected())
    {
        client.subscribe(subTopic.c_str());
    }
}
void publishMqtt(String payload, char topic[])
{
    char buf[100];
    int strLength = payload.length() + 1;
    payload.toCharArray(buf, strLength);
    if (!client.connected())
    {
        reconnectMqtt();
    }
    if (client.connected())
    {
        client.publish(topic, buf);
    }
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
    publishMqtt(mqttMsg, pubMicro);
}
/*********************  READER FUNCTIONS  ****************************/
char valToHex(uint8_t val)
{
    if ((val & 0x0f) < 10)
        return ('0' + val);
    else
        return ('A' + (val - 10));
}
String byteToHexString(uint8_t b)
{
    String buffer = "";
    buffer += valToHex(b & 0x0f);
    b >>= 4;
    buffer = valToHex(b & 0x0f) + buffer;
    return buffer;
}
boolean is_valid_checksum(uint8_t tag[])
{
    uint8_t code[6];
    uint8_t checksum = 0;
    uint8_t tempbyte = 0;
    for (int i = 0; i < 12; i++)
    {
        byte val = tag[i];
        if ((val >= '0') && (val <= '9'))
        {
            val = val - '0';
        }
        else if ((val >= 'A') && (val <= 'F'))
        {
            val = 10 + val - 'A';
        }
        if ((i & 1) == 1)
        {
            code[i >> 1] = (val | (tempbyte << 4));
            if (i >> 1 != 5)
            {
                checksum ^= code[i >> 1];
            }
        }
        else
        {
            tempbyte = val;
        }
    }
    return code[5] == checksum ? true : false;
}
String getRfidTags(int i)
{
    int tagIndx = 0;
    uint8_t tagDigit;
    String tagId = "";
    String tagString = "";
    int stxCount = 0;
    if (rfidRdr[i].available() > 0)
    {
        {
            do
            {
                tagDigit = rfidRdr[i].read();
                if ((tagDigit == RFID_MSG_START) && (stxCount < 2))
                {
                    tagIndx = 0;
                    tagId = "";
                    stxCount++;
                }
                else
                {
                    tagString = byteToHexString(tagDigit);
                    tagId.concat(tagString);
                    tagIndx++;
                }
            } while ((tagIndx < rfidLength) && (tagDigit != 0x03));
        }
        uint8_t buf[15];
        tagId.getBytes(buf, 14);
        if (is_valid_checksum(buf))
        {
            tagId = tagId.substring(0, 10);
        }
        else
        {
            tagId = "";
        }
    }
    else
    {
        tagId = "";
    }
    return tagId;
}
/*****************  SETUP FUNCTION  ***********************************/
void setup()
{
    Serial.begin(115200);
    delay(5000);
    Serial.println("\n Starting");
    WiFi.begin(ssid, password);
    Serial.print("Local ip: ");
    Serial.println(WiFi.localIP());
    subTopic = subTopic + mqttId;
    int ind1 = mqttServer.indexOf('.');
    String octet1 = mqttServer.substring(0, ind1);
    int ind2 = mqttServer.indexOf('.', ind1 + 1);
    String octet2 = mqttServer.substring(ind1 + 1, ind2 + 1);
    int ind3 = mqttServer.indexOf('.', ind2 + 1);
    String octet3 = mqttServer.substring(ind2 + 1, ind3 + 1);
    String octet4 = mqttServer.substring(ind3 + 1);
    IPAddress mqtt_ip(octet1.toInt(), octet2.toInt(), octet3.toInt(), octet4.toInt());
    client.setServer(mqtt_ip, mqttPort);
    connectMqtt();
    Serial.println(mqttServer);
    rfidRdr[0].begin(BAUD_RATE, SWSERIAL_8N1, DATA_PIN1, NO_TX_PIN);
    if (numberReaders > 1)
    {
        Serial.println("There are two readers");
        rfidRdr[1].begin(BAUD_RATE, SWSERIAL_8N1, DATA_PIN2, NO_TX_PIN);
    }
    timeClient.begin(mqtt_ip);
    while (!timeClient.update())
    {
        timeClient.forceUpdate();
    }
    String et = String(timeClient.getEpochTime());
    Serial.println(et);
    String mqttMsg = "{\"et\":\"";
    mqttMsg += et;
    mqttMsg += "\",\"mcntrlr\":\"";
    mqttMsg += mqttId;
    mqttMsg += "\",\"msgType\":\"initial\"";
    mqttMsg += ",\"ip\":\"";
    mqttMsg += WiFi.localIP().toString();
    mqttMsg += "\"}";
    publishMqtt(mqttMsg, pubMicro);
    Serial.println(" Finished Setup");
}
/*****************  MAIN LOOP  ****************************************/
void loop()
{
    loopCount++;
    String rfidJsonPayload = "";
    Serial.print("*");

    for (int i = 0; i < numberReaders; i++)
    {
        String rfTagId = getRfidTags(i);
        if (rfTagId != "" && rfTagId != lastRfidTagId)
        {
            Serial.println(rfTagId);
            timeClient.update();
            rfidJsonPayload = buildJson(rfTagId, mqttId, String(timeClient.getEpochTime()), String(i + 1));
            publishMqtt(rfidJsonPayload, pubTopic);
            lastRfidTagId=rfTagId;
        }
    }
    if (client.connected())
    {
        client.loop();
    }
    else
    {
        connectMqtt();
    }
    delay(200);
    if (loopCount > 300)
    {
        publishHeartbeat();
        loopCount = 0;
    }
}
