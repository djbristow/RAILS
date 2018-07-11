/*
 MQTT IOT RFID Reader
 - reads values from a single RFID ID-12LA reader
 - formats the results as a JSON string
 - connects to an MQTT broker
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
 */

#include <SPI.h>
#include <PubSubClient.h>
#include <Ethernet.h>

#include <stdint.h>
#include "inc/hw_memmap.h"
#include "driverlib/gpio.h"
#include "driverlib/sysctl.h"
#include "inc/hw_types.h"
#include "inc/hw_gpio.h"

//uart
#include "inc/hw_types.h"
#include "driverlib/pin_map.h"
#include "driverlib/uart.h"
#include "driverlib/gpio.h"

// This is the MAC address found on the ethernet sticker on the board
byte mac[]    = {0x00, 0x1A, 0xB6, 0x02, 0xDC, 0x3E };
char clientId[] = "001ab602dc3e";
// This is the network IP for this controller
byte ip[] = {192, 168, 0, 201};

char server[] = "192.168.0.200";
int mqttPort = 1883;
char pubtopic[] = "sensors/rfid";

//========================================================
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Received message for topic ");
  Serial.print(topic);
  Serial.print("with length ");
  Serial.println(length);
  Serial.println("Message:");
  Serial.write(payload, length);
  Serial.println();
}

EthernetClient ethClient;
PubSubClient client(server, mqttPort, callback, ethClient);

String rfTagId = "";
String rfidJsonPayload = "";
String sensorId = "01";

/* =========================================================
 The RFID reader is connected to UART 4 on the Tiva board
 This routine after testing the UART's readiness reads
 it to get the RFID tag value
*/
String getTagId() {
  String tagId = "";
  char tagChr;
  int i = 0;
  UARTEnable(UART4_BASE);
  while (!UARTCharsAvail(UART4_BASE)) {
    //Serial.println("UART4 not Ready");
    delay(1000);
  }
  while(UARTCharsAvail(UART4_BASE)){
    tagChr = UARTCharGet(UART4_BASE);
    if ((tagChr > 0x0f) && (i < 11)) {
      tagId.concat(tagChr);
    }
   i++;
  }
  UARTDisable(UART4_BASE);
  return tagId;
}

/* ========================================================
 build the json payload for mqtt msg like:
 {"mac":"4ceb42bd6952","sensor":"01","rfid":"a222256789"}
*/
String buildJson(String id, String sensor) {
  String mqttMsg = "{\"mac\":\"";
  mqttMsg = mqttMsg +  clientId;
  mqttMsg = mqttMsg +  "\",\"sensor\":\"";
  mqttMsg = mqttMsg +  sensor;
  mqttMsg = mqttMsg +  "\",\"rfid\":\"";
  mqttMsg = mqttMsg +  id;
  mqttMsg = mqttMsg +  "\"}";
  return mqttMsg;
}
 //========================================================
void setup()
{
  Serial.begin(9600);
  // Start the ethernet client
  Serial.println("Starting Ethernet");
  Ethernet.enableLinkLed();
  Ethernet.enableActivityLed();
  Ethernet.begin(mac, ip);

  // Start the UART connected to the RFID ID-12LA sensor
  // System clock rate in Hz.
  uint32_t g_ui32SysClock;
   // Set the clocking to run directly from the crystal at 120MHz.
  g_ui32SysClock = SysCtlClockFreqSet((SYSCTL_XTAL_25MHZ |
                                       SYSCTL_OSC_MAIN |
                                       SYSCTL_USE_PLL |
                                       SYSCTL_CFG_VCO_480), 120000000);
  // Enable Peripheral Clocks 
  SysCtlPeripheralEnable(SYSCTL_PERIPH_UART4);
  SysCtlPeripheralEnable(SYSCTL_PERIPH_GPIOA);
  // Enable pin PA2 for UART4 U4RX
  HWREG(GPIO_PORTA_BASE + GPIO_O_LOCK) = GPIO_LOCK_KEY;
  HWREG(GPIO_PORTA_BASE + GPIO_O_CR) = GPIO_PIN_2;
  GPIOPinConfigure(GPIO_PA2_U4RX);
  GPIOPinTypeUART(GPIO_PORTA_BASE, GPIO_PIN_2);
  UARTConfigSetExpClk(UART4_BASE, g_ui32SysClock, 9600,
  (UART_CONFIG_WLEN_8 | UART_CONFIG_STOP_ONE | UART_CONFIG_PAR_NONE));
}

void loop() //========================================================
{
 // Serial.println("Started, ready to read RFID *******");
  rfTagId = getTagId();
  rfidJsonPayload = buildJson(rfTagId,sensorId);
  Serial.println(rfidJsonPayload );
  char buf[59];
  rfidJsonPayload.toCharArray(buf,59);
  // connect to mqtt broker
  if (!client.connected()) {
  //Serial.println("try connecting");
  if(!client.connect(clientId)) {
      Serial.println("Connection failed");
    } else {
      Serial.println("Connection success");
    }
  }
  client.publish(pubtopic,buf);
}
