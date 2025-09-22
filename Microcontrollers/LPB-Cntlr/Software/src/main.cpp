#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <time.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include "params.h"

// Define the pins for the buttons (D1 to D6)
const int buttonPins[6] = {D1, D2, D3, D4, D5, D6};
const int debounceDelay = 50; // Milliseconds for debouncing

// Variables for the non-blocking timer and message count
long lastMsg = 0;
//
const int messageInterval = 10000; // 10 seconds in milliseconds

// State variables for each button
unsigned long lastDebounceTime[NUMBER_OF_BUTTONS] = {0};
int lastButtonState[NUMBER_OF_BUTTONS] = {HIGH};
int buttonState[NUMBER_OF_BUTTONS] = {HIGH};

// State array to lock/unlock buttons
bool buttonLocked[NUMBER_OF_BUTTONS];

// Create WiFi and MQTT client objects
WiFiClient espClient;
PubSubClient client(espClient);

// Create Neopixel object
#define NEOPIXEL_PIN D7 
Adafruit_NeoPixel pixels(TOTAL_PIXELS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

// Function to create a JSON message
String createJsonMessage(const char* msgType, int buttonNumber = 0) {
  JsonDocument doc;
  doc["et"] = time(nullptr);
  doc["mcntrlr"] = mcntrlr;
  
  if (strcmp(msgType, "initial") == 0) {
    doc["msgType"] = msgType;
    doc["ip"] = WiFi.localIP().toString();
  } else if (strcmp(msgType, "button") == 0) {
    doc["pb"] = buttonNumber;
  } else if (strcmp(msgType, "heartbeat") == 0) {
    doc["msgType"] = msgType;
  }
  String jsonString;
  serializeJson(doc, jsonString);
  return jsonString;
}

void setup_wifi() {
  delay(10);
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

void get_time() {
  configTime(0, 0, mqtt_server);
  Serial.println("Waiting for NTP time sync...");
  time_t now = time(nullptr);
  while (now < 1000000000) { 
    delay(500);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println("Time synced!");
}

// Function to handle incoming MQTT messages
void callback(char* topic, byte* payload, unsigned int length) {
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.f_str());
    return;
  }
  const char* remote_cntrlr = doc["cntrlr"];
  const char* remote_color = doc["color"];
  int lamp_num = doc["lamp"];
  if (strcmp(remote_cntrlr, mcntrlr) == 0) {
    uint32_t color = pixels.Color(0, 0, 0);
    if (strcmp(remote_color, "RED") == 0) {
      color = pixels.Color(255, 0, 0);
    } else if (strcmp(remote_color, "GREEN") == 0) {
      color = pixels.Color(0, 255, 0);
    } else if (strcmp(remote_color, "BLUE") == 0) {
      color = pixels.Color(0, 0, 255);
    } else if (strcmp(remote_color, "YELLOW") == 0) {
      color = pixels.Color(255, 255, 0);
    }
    if (lamp_num >= 1 && lamp_num <= NUMBER_OF_BUTTONS) {
      int pixel_index_1 = (lamp_num - 1) * PIXELS_PER_BUTTON;
      int pixel_index_2 = pixel_index_1 + 1;
      pixels.setPixelColor(pixel_index_1, color);
      pixels.setPixelColor(pixel_index_2, color);
      pixels.show();
      // Unlock the button associated with the lamp
      buttonLocked[lamp_num - 1] = false;
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = mcntrlr;
    clientId += "-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      String initialMsg = createJsonMessage("initial");
      client.publish(publish_topic, initialMsg.c_str());
      // Subscribe to the specific control topic for this device
      String subscribe_topic = String(act_topic_prefix) + mcntrlr;
      client.subscribe(subscribe_topic.c_str());
      lastMsg = millis();
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

// Function to handle button presses with non-blocking debouncing and locked state check
void handleButtons() {
  for (int i = 0; i < NUMBER_OF_BUTTONS; i++) {
    int reading = digitalRead(buttonPins[i]);
    if (reading != lastButtonState[i]) {
      lastDebounceTime[i] = millis();
    }
    if ((millis() - lastDebounceTime[i]) > debounceDelay) {
      if (reading != buttonState[i]) {
        buttonState[i] = reading;
        if (buttonState[i] == LOW) {
          if (!buttonLocked[i]) {
            String buttonMsg = createJsonMessage("button", i + 1);
            client.publish(publish_topic, buttonMsg.c_str());
            buttonLocked[i] = true;
          }
        }
      }
    }
    lastButtonState[i] = reading;
  }
}

// Function to send a heartbeat message
void sendHeartbeat() {
  long now = millis();
  if (now - lastMsg > messageInterval) {
    lastMsg = now;
    String heartbeatMsg = createJsonMessage("heartbeat", 0);
    client.publish(publish_topic, heartbeatMsg.c_str());
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  handleButtons();
  sendHeartbeat();
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  get_time();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback); // Set the MQTT callback function

  // Set up button pins as input with pull-up resistors
  for (int i = 0; i < NUMBER_OF_BUTTONS; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP);
  }
  
  // Initialize Neopixels and set them to yellow
  pixels.begin();
  for (int i = 0; i < TOTAL_PIXELS; i++) {
    pixels.setPixelColor(i, pixels.Color(255, 255, 0)); // Set all pixels to yellow (R,G,B)
  }
  pixels.show(); // Push the colors to the Neopixels
}