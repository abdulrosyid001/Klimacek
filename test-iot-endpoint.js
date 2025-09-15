// Test script untuk IoT endpoint
// Run dengan: node test-iot-endpoint.js

const http = require('http');

// Configuration
const hostname = 'localhost'; // Development - Ganti dengan 'www.atamagri.app' untuk production
const port = 3002; // Next.js dev server port (443 untuk production HTTPS)
const path = '/api/iot/sensor-data';

// Production configuration (uncomment untuk test production)
// const hostname = 'www.atamagri.app';
// const port = 443;
// const path = '/api/iot/sensor-data';

// Test data
const testData = {
  device_id: 'ESP32-001',
  temperature: 28.5,
  humidity: 65.2,
  soil_moisture: 45.8,
  ph: 6.8,
  nitrogen: 25,
  phosphorus: 15,
  potassium: 30
};

const postData = JSON.stringify(testData);

const options = {
  hostname: hostname,
  port: port,
  path: path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);

  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`Response: ${chunk}`);
  });

  res.on('end', () => {
    console.log('Test completed');
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Send the test data
req.write(postData);
req.end();

console.log('Sending test data to IoT endpoint...');
console.log('Test data:', testData);