// This #include statement was automatically added by the Particle IDE.
#include <Adafruit_LIS3DH.h>

// define the pin for the button
const int buttonPin = D5;
// define the pin for the led. (D7 is the PIN that is coupled with the on-board LED)
const int ledPin =  D7;   


//---------------------------- LED-FUNKTION ----------------------
// defining and using a LED status
LEDStatus statusRed(RGB_COLOR_RED, LED_PATTERN_BLINK, LED_SPEED_NORMAL, LED_PRIORITY_IMPORTANT);
// Syntax for the "blink"-Function that is published in the cloud
int blinkRed(String command);
int connectDevicesByButton(String command);
int disconnectDevicesByButton(String command);
//---------------------------- LED-FUNKTION ENDE----------------------
//---------------------------- BESCHLEUNIGUNGSSENSOR----------------------
Adafruit_LIS3DH lis = Adafruit_LIS3DH();
double acceleration;
sensors_event_t event;
// 0: is not connected 1: is connected
int connection = 0;
//---------------------------- BESCHLEUNIGUNGSSENSOR ENDE----------------------
//---------------------------- TIMER AUFSETZEN ----------------------
unsigned long startTime;
unsigned long deltaTime;
//---------------------------- TIMER AUFSETZEN ENDE----------------------




void setup() {  
    
    //---------------SETUP BESCHLEUNIGUNGSSENSOR-------------------
    Serial.begin(9600);
    if (! lis.begin(0x18)) {   // change this to 0x19 for alternative i2c address
        Particle.publish("ev","LIS3DH configuration error");
        while (1);
    }
    lis.setRange(LIS3DH_RANGE_2_G);   // 2, 4, 8 or 16 G!
    Particle.publish("ev","LIS3DH configured successfully");
    //---------------SETUP BESCHLEUNIGUNGSSENSOR ENDE -------------------
    
    
    // set the pin mode for the button
    pinMode(buttonPin, INPUT_PULLUP);
    // set the pin mode for the LED
    pinMode(ledPin, OUTPUT);
    // register the  cloud variable "connectionState"
    Particle.variable("connectionState", connection);
    // register the cloud function
    Particle.function("blinkRed", blinkRed);
    Particle.function("connectDevicesByButton", connectDevicesByButton);
    Particle.function("disconnectDevicesByButton", disconnectDevicesByButton);
    
}




void loop() {      
    
    startTime = millis();
    lis.getEvent(&event);
    acceleration =  event.acceleration.x +  event.acceleration.y + event.acceleration.z;

    
    if (acceleration > 1.7 && connection == 0) {
        Particle.publish("ev","connect");
        Particle.publish("connectionStateBump", "connected");
        blinkRed("connect");
    } 
    else if (acceleration > 1.7 && connection == 1) {
        Particle.publish("ev","disconnect");
        Particle.publish("connectionStateBump", "disconnected");
        blinkRed("disconnect");
    }
}


int connectDevicesByButton(String command){
    
    if(connection == 1){
        Particle.publish("alreadyConnectetMessage", "The device is already connected. Please disconnect the device first so that you can connect to another device.");
    }
    else{
        blinkRed("connect");
    }
    return 0;
}

int disconnectDevicesByButton(String command){
    if(connection == 0){
        Particle.publish("alreadyDisconnectedMessage", "The device is already disconnected. You can connect to an other device.");
    }
    else{
        blinkRed("disconnect");
    }
    return 0;
}

// Cloud functions must return int and take one String
int blinkRed(String command) {
    
    if(command == "connect"){
        connection = 1;
        // publish an event when blinking starts
        Particle.publish("blinkingStateChanged", "started blinking");
        // blink red for 3000 ms
        delay(1000);
        statusRed.setActive(true);
        delay(500);
        statusRed.setActive(false);
        delay(500);
        statusRed.setActive(true);
        delay(500);
        statusRed.setActive(false);
        delay(500);
        statusRed.setActive(true);
        delay(500);
        statusRed.setActive(false);
        delay(500);
        digitalWrite(ledPin, HIGH);
    }
    else if(command == "disconnect"){
        connection = 0;
        // publish an event when blinking stops
        Particle.publish("blinkingStateChanged", "stopped blinking");
        statusRed.setActive(true);
        delay(2000);
        statusRed.setActive(false);
        delay(500);
        digitalWrite(ledPin, LOW);
    }
    else{
        Particle.publish("blinkingStateChanged", "undifined");
    }
    return 0;
}

void printEvent(double acceleration){

    if(acceleration > 1.7 && connection == 0){
        Serial.println("-------------------------------------------------------------------------------");
        Serial.println("Connected: ");
        Serial.println("Acceleration:");
        Serial.println(acceleration);
        delay(2000);
    }
    else if (acceleration > 1.7 && connection == 1){
        Serial.println("-------------------------------------------------------------------------------");
        Serial.println("Disconnected: ");
        Serial.println("Acceleration:");
        Serial.println(acceleration);
    }
    
        delay(2000);
        statusRed.setActive(true);
        delay(500);
        statusRed.setActive(false);
        delay(500);
        statusRed.setActive(true);
        delay(500);
        statusRed.setActive(false);
}




