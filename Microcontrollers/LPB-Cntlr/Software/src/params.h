// WiFi credentials
const char* ssid = "";
const char* password = "";

// MQTT & NTP Server details
const char* mqtt_server = "";
const int mqtt_port = 1883;

// Topic to publish to
const char* publish_topic = "micros";

// Device name
const char* mcntrlr = "LpbCntlr00";

// Number of push buttons
const int NUMBER_OF_BUTTONS = 5; // Set to 4, 5, or 6 as needed

// State for each button: 0=unlocked, 1=locked
extern bool buttonLocked[NUMBER_OF_BUTTONS];

// Neopixel details
#define NEOPIXEL_PIN D8 // Pin where the NeoPixels are connected
#define PIXELS_PER_BUTTON 2
#define TOTAL_PIXELS (NUMBER_OF_BUTTONS * PIXELS_PER_BUTTON)

// MQTT topic prefix for commands
const char* act_topic_prefix = "acts/tpl/";
