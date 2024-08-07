/*****
 * MQTT IOT RFID Reader
 * Copyright 2020-2024 David J Bristow
 * Version 2.0.0 - 1/23/22
 * - initial wifi and mqtt paramters are set at runtime if no SSID found
 * - connects to an MQTT broker via wifi
 * - publishes info about this reader to the topic "micros"
 *   {"et":"1590462747","sensor":"rfidRdr01","msgType":"initial",ip":"192.168.0.19"}
 * - publishes a heartbeat to the topic "micros"
 *   {"et":"1590462747","sensor":"rfidRdr01","msgType":"heartbeat"}
 * - reads values from a single ID-12LA or 7491E RFID reader, formats
 *   the results as a JSON string, gets Epoch time from an NTP server
 *   and then publishes the JSON String to the topic "sensors/rfid"
 *   {"et":"1590463450","sensor":"rfidRdr01","reader":"1","rfid":"1C0044CF23"}
 * - subscribes to "micros/cmd/mqtt_id" where mqtt_id is the paramter
 *   defined at runtime as the sensor. When a RESET command is received the wifi and
 *   mqtt paramters are removed causing next reboot to require inputs of mqtt paramaters
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
#include <ESP8266WebServer.h>
#include <DNSServer.h>
#include <WiFiManager.h>
#include <EEPROM.h>
#include <PubSubClient.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <SoftwareSerial.h>

#define RFID_MSG_START 2
#define RFID_MSG_END 3
#define RFID_LENGTH 16
#define GOOD_MQTT_PARAMS 71
#define BAD_MQTT_PARAMS 70
#define MQTT_PARAMS_FLAG_ADDR 242
#define NO_TX_PIN -1
#define DATA_PIN1 D7
#define DATA_PIN2 D3
#define BAUD_RATE 9600

/***********************  GLOBAL SETUP *******************************/
WiFiClient espWiFi;
IPAddress mqtt_ser(1, 1, 1, 1);
WiFiManager wm;
PubSubClient client(mqtt_ser, 1883, espWiFi);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);
// SoftwareSerial rfidRdr(D7, NO_TX_PIN); // RX with no TX
SoftwareSerial rfidRdr[2];
char pubTopic[] = "sensors/rfid";
String subTopic = "micros/cmd/";
char pubMicro[] = "micros";
int mqttRetryAttempts = 0;
int reader = 0;
int rfidLength = 10;
int loopCount = 0;
String readerNum = "";
uint8_t mqttParamsFlag = 0;
struct MqttObject // Object used to store mqtt parameters in EEPROM
{
    char mqttServer[17];
    char mqttPort[7];
    char mqttId[17];
    char numberReaders[2];
    char readerType[2];
};
MqttObject mqtt;
/*********************  SET WIFI CREDS  ******************************/
void setWiFiCreds()
{
    char mqtt_server[16] = "";
    char mqtt_port[6] = "";
    char mqtt_id[16] = "";
    char number_readers[2] = "1";
    char reader_type[2] = "A";
    WiFi.mode(WIFI_AP);
    wm.setConfigPortalTimeout(180);
    WiFiManagerParameter custom_text("<p>RFID Client Setup</p>");
    WiFiManagerParameter custom_mqtt_server("server", "MQTT Server IP", mqtt_server, 16);
    WiFiManagerParameter custom_mqtt_port("port", "MQTT Server Port", mqtt_port, 6);
    WiFiManagerParameter custom_mqtt_id("name", "MQTT Client Name", mqtt_id, 16);
    WiFiManagerParameter custom_number_readers("number", "RFID Reader Number", number_readers, 2);
    WiFiManagerParameter custom_reader_type("reader", "RFID Reader Type", reader_type, 2);
    wm.addParameter(&custom_text);
    wm.addParameter(&custom_mqtt_server);
    wm.addParameter(&custom_mqtt_port);
    wm.addParameter(&custom_mqtt_id);
    wm.addParameter(&custom_number_readers);
    wm.addParameter(&custom_reader_type);
    wm.startConfigPortal("ESP-RFID", "password");
    strcpy(mqtt.mqttServer, custom_mqtt_server.getValue());
    strcpy(mqtt.mqttPort, custom_mqtt_port.getValue());
    strcpy(mqtt.mqttId, custom_mqtt_id.getValue());
    strcpy(mqtt.numberReaders, custom_number_readers.getValue());
    strcpy(mqtt.readerType, custom_reader_type.getValue());
    EEPROM.put(123, mqtt);
}
/*********************  MQTT FUNCTIONS  ******************************/
String buildJson(String id, String sensor, String et, String reader)
{
    String mqttMsg = "{\"et\":\"";
    mqttMsg = mqttMsg + et;
    mqttMsg = mqttMsg + "\",\"sensor\":\"";
    mqttMsg = mqttMsg + sensor;
    mqttMsg = mqttMsg + "\",\"reader\":\"";
    mqttMsg = mqttMsg + reader;
    mqttMsg = mqttMsg + "\",\"rfid\":\"";
    mqttMsg = mqttMsg + id;
    mqttMsg = mqttMsg + "\"}";
    return mqttMsg;
}
void callback(char *topic, byte *payload, unsigned int length)
{
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payload);
    if (error)
    {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.c_str());
        return;
    }
    String command = doc["cmd"];
    String micro = doc["micro"];
    if (command == "RESET" && micro == mqtt.mqttId)
    {
        char empty[45] = "";
        for (int i = 1; i < 45; i++)
        {
            empty[i] = 0xff;
        }
        EEPROM.put(123, empty);
        EEPROM.commit();
        wm.resetSettings();
        ESP.reset();
    }
    else
    {
        Serial.println("\nFailed to reset Wifi; micro did not match");
    }
}
void reconnectMqtt()
{
    String clientId = mqtt.mqttId;
    while (!client.connected())
    {
        if (client.connect(clientId.c_str()))
        {
            mqttRetryAttempts = 0;
            client.subscribe(subTopic.c_str());
            if (mqttParamsFlag != GOOD_MQTT_PARAMS)
            {
                mqttParamsFlag = GOOD_MQTT_PARAMS;
                EEPROM.write(MQTT_PARAMS_FLAG_ADDR, GOOD_MQTT_PARAMS);
                EEPROM.commit();
            }
        }
        else
        {
            Serial.print("************** ");
            Serial.print(mqtt.mqttServer);
            Serial.print(" failed, rc=");
            Serial.println(client.state());
            mqttRetryAttempts++;
            if (mqttRetryAttempts > 20)
            {
                EEPROM.write(MQTT_PARAMS_FLAG_ADDR, BAD_MQTT_PARAMS);
                EEPROM.commit();
            }
            delay(5000);
        }
    }
}
void connectMqtt()
{
    client.setCallback(callback);
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
    mqttMsg += "\",\"sensor\":\"";
    mqttMsg += mqtt.mqttId;
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
boolean is_valid_checksum(uint8_t tag[], String readerType)
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
    if (readerType != "A")
    {
        checksum ^= 8;
    }
    return code[5] == checksum ? true : false;
}
String getRfidTags(String readerType, int i)
{
    int tagIndx = 0;
    uint8_t tagDigit;
    String tagId = "";
    String tagString = "";
    int stxCount = 0;
    if (readerType == "A")
    {
        rfidLength = 16;
    }
    if (rfidRdr[i].available() > 0)
    {
        // while (rfidRdr[i].available() > 0)
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
                    if (readerType != "A")
                    {
                        tagString = byteToHexString(tagDigit);
                        tagId.concat(tagString);
                    }
                    else
                    {
                        tagId.concat((char)tagDigit);
                    }
                    tagIndx++;
                }
            } while ((tagIndx < rfidLength) && (tagDigit != 0x03));
        }
        uint8_t buf[15];
        tagId.getBytes(buf, 14);
        if (is_valid_checksum(buf, readerType))
        {
            tagId = tagId.substring(0, 10);
        }
        else
        {
            tagId = "";
        }
    } else {
        tagId = "";
    }
    return tagId;
}
/*****************  SETUP FUNCTION  ***********************************/
void setup()
{
    Serial.begin(115200);
    delay(5000);
    EEPROM.begin(512);
    mqttParamsFlag = EEPROM.read(MQTT_PARAMS_FLAG_ADDR);
    Serial.println("\n Starting");
    Serial.print("Checking to see if the flag is set ");
    Serial.println(mqttParamsFlag, HEX);
    WiFi.mode(WIFI_STA);
    delay(5000);
    if (WiFi.SSID() == "" || mqttParamsFlag != 71)
    {
        Serial.println("going to set wifi creds");
        setWiFiCreds();
    }
    else
    {
        wm.autoConnect("AutoConnectAP");
        WiFi.printDiag(Serial);
        EEPROM.get(123, mqtt);
    }
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("Failed to connect, finishing setup anyway");
    }
    else
    {
        Serial.print("Local ip: ");
        Serial.println(WiFi.localIP());
    }
    subTopic = subTopic + mqtt.mqttId;
    String mqtt_ser = mqtt.mqttServer;
    int ind1 = mqtt_ser.indexOf('.');
    String octet1 = mqtt_ser.substring(0, ind1);
    int ind2 = mqtt_ser.indexOf('.', ind1 + 1);
    String octet2 = mqtt_ser.substring(ind1 + 1, ind2 + 1);
    int ind3 = mqtt_ser.indexOf('.', ind2 + 1);
    String octet3 = mqtt_ser.substring(ind2 + 1, ind3 + 1);
    String octet4 = mqtt_ser.substring(ind3 + 1);
    IPAddress mqtt_ip(octet1.toInt(), octet2.toInt(), octet3.toInt(), octet4.toInt());
    String prt = mqtt.mqttPort;
    client.setServer(mqtt_ip, prt.toInt());
    connectMqtt();
    EEPROM.end();
    Serial.println(mqtt.readerType);
    Serial.println(mqtt.mqttServer);
    rfidRdr[0].begin(BAUD_RATE, SWSERIAL_8N1, DATA_PIN1, NO_TX_PIN);
    if (atoi(mqtt.numberReaders) > 1)
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
    mqttMsg += "\",\"sensor\":\"";
    mqttMsg += mqtt.mqttId;
    mqttMsg += "\",\"msgType\":\"initial\"";
    mqttMsg += "\",\"ip\":\"";
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
    String rfTagId;
    for (int i = 0; i < atoi(mqtt.numberReaders); i++)
    {
        String rfTagId = getRfidTags(mqtt.readerType, i);
        if (rfTagId != "")
        {
            Serial.println(rfTagId);
            timeClient.update();
            rfidJsonPayload = buildJson(rfTagId, mqtt.mqttId, String(timeClient.getEpochTime()), String(i + 1));
            publishMqtt(rfidJsonPayload, pubTopic);
        }
    }
    if (client.connected())
        client.loop();
    else
        connectMqtt();
    delay(200);
    if (loopCount > 500)
    {
        publishHeartbeat();
        loopCount = 0;
    }
}
