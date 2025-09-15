#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server endpoint
const char* serverURL = "https://www.atamagri.app/api/iot/sensor-data";

// Device configuration
const String deviceID = "ESP32-001"; // Unique device identifier

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // Read sensor data (contoh data)
    float temperature = readTemperature();
    float humidity = readHumidity();
    float soilMoisture = readSoilMoisture();
    float ph = readPH();
    float nitrogen = readNitrogen();
    float phosphorus = readPhosphorus();
    float potassium = readPotassium();

    // Send data to server
    sendSensorData(temperature, humidity, soilMoisture, ph, nitrogen, phosphorus, potassium);
  }

  // Send data every 30 seconds
  delay(30000);
}

void sendSensorData(float temp, float hum, float soil, float ph, float n, float p, float k) {
  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  // Create JSON payload
  DynamicJsonDocument doc(1024);
  doc["device_id"] = deviceID;
  doc["temperature"] = temp;
  doc["humidity"] = hum;
  doc["soil_moisture"] = soil;
  doc["ph"] = ph;
  doc["nitrogen"] = n;
  doc["phosphorus"] = p;
  doc["potassium"] = k;

  // Optional: Add simple signature for basic validation
  doc["signature"] = generateSignature(deviceID);

  String jsonString;
  serializeJson(doc, jsonString);

  // Send POST request
  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println("Response: " + response);
  } else {
    Serial.println("Error on sending POST: " + String(httpResponseCode));
  }

  http.end();
}

// Contoh functions untuk baca sensor (sesuaikan dengan sensor yang digunakan)
float readTemperature() {
  // Implementasi baca sensor temperature (DHT22, DS18B20, dll)
  return random(200, 350) / 10.0; // Dummy data 20-35°C
}

float readHumidity() {
  // Implementasi baca sensor humidity
  return random(400, 800) / 10.0; // Dummy data 40-80%
}

float readSoilMoisture() {
  // Implementasi baca sensor soil moisture
  return random(300, 700) / 10.0; // Dummy data 30-70%
}

float readPH() {
  // Implementasi baca sensor pH
  return random(60, 80) / 10.0; // Dummy data 6.0-8.0
}

float readNitrogen() {
  // Implementasi baca sensor NPK
  return random(10, 50); // Dummy data 10-50 ppm
}

float readPhosphorus() {
  return random(5, 25); // Dummy data 5-25 ppm
}

float readPotassium() {
  return random(15, 60); // Dummy data 15-60 ppm
}

// Simple signature generation (sama dengan server)
String generateSignature(String device_id) {
  String secret = "default-secret"; // Harus sama dengan IOT_SECRET di server
  String combined = device_id + secret;
  // Simple base64-like encoding untuk ESP32
  String encoded = "";
  for (int i = 0; i < combined.length() && encoded.length() < 16; i++) {
    encoded += String((int)combined[i], HEX);
  }
  return encoded.substring(0, 16);
}