const https = require('https');

const sensorData = {
  device_id: "ESP32-001",
  timestamp: new Date().toISOString(),
  wind_m_s: 3.2,
  wind_kmh: 11.52,
  rainrate_mm_h: 0.4,
  temperature_C: 28.7,
  humidity_: 65.3,
  light_lux: 530.5,
  sol_voltage_V: 12.4,
  sol_current_mA: 210.7,
  sol_power_W: 2.61
};

const postData = JSON.stringify(sensorData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/iot/sensor-data',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  },
  rejectUnauthorized: false
};

const req = https.request(options, (res) => {
  let data = '';

  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\nResponse Body:');
    console.log(data);

    try {
      const json = JSON.parse(data);
      console.log('\nParsed JSON:');
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Could not parse as JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(postData);
req.end();

console.log('Sending IoT data to local server...');
console.log('Data:', JSON.stringify(sensorData, null, 2));