# IoT Sensor Data Collection Setup Guide

## Overview
Sistem ini memungkinkan ESP32 mengirim data sensor langsung ke endpoint web yang kemudian menyimpan data ke Firebase Firestore.

**Flow:** ESP32 → Web Endpoint → Firebase Firestore → Dashboard

## 🔧 Setup Firebase

### 1. Buat Project Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"**
3. Masukkan nama project (contoh: `atamagri-iot`)
4. Disable Google Analytics (opsional)
5. Klik **"Create project"**

### 2. Setup Firestore Database
1. Di Firebase Console, pilih **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in production mode"**
4. Pilih location (pilih yang terdekat: `asia-southeast1`)
5. Klik **"Done"**

### 3. Setup Security Rules
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sensor_data/{document} {
      allow read, write: if true; // Untuk development
      // Untuk production, tambahkan authentication
    }
  }
}
```

### 4. Get Firebase Config
1. Di Firebase Console, klik **Settings** (gear icon) → **Project settings**
2. Scroll ke **"Your apps"** → Klik **Web** icon `</>`
3. Masukkan app name: `atamagri-web`
4. Copy configuration object

## 🌐 Setup Web Application

### 1. Environment Variables
```bash
cd frontend
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Firebase Configuration (dari step 4 di atas)
FIREBASE_API_KEY=AIzaSyC...
FIREBASE_AUTH_DOMAIN=atamagri-iot.firebaseapp.com
FIREBASE_PROJECT_ID=atamagri-iot
FIREBASE_STORAGE_BUCKET=atamagri-iot.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456

# IoT Security
IOT_SECRET=your-random-secret-key-here
```

### 2. Install Dependencies & Run
```bash
npm install
npm run dev
```

### 3. Test Endpoint
```bash
node test-iot-endpoint.js
```

Expected response:
```json
{
  "success": true,
  "id": "firestore-document-id",
  "message": "Data saved successfully"
}
```

## 📱 Setup ESP32

### 1. Required Libraries
Install di Arduino IDE:
- **WiFi** (built-in)
- **HTTPClient** (built-in)
- **ArduinoJson** by Benoit Blanchon

### 2. Upload Code
1. Buka `esp32-sensor-example.ino`
2. Edit konfigurasi:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   const char* serverURL = "https://www.atamagri.app/api/iot/sensor-data";
   const String deviceID = "ESP32-001"; // Unique ID
   ```
3. Upload ke ESP32

### 3. Monitor Serial Output
```
Connecting to WiFi....
WiFi connected!
IP address: 192.168.1.100
HTTP Response code: 200
Response: {"success":true,"id":"abc123","message":"Data saved successfully"}
```

## 📊 Data Structure

### JSON yang Dikirim ESP32:
```json
{
  "device_id": "ESP32-001",
  "temperature": 28.5,
  "humidity": 65.2,
  "soil_moisture": 45.8,
  "ph": 6.8,
  "nitrogen": 25,
  "phosphorus": 15,
  "potassium": 30,
  "signature": "abc123def456"
}
```

### Data yang Disimpan di Firestore:
```json
{
  "device_id": "ESP32-001",
  "temperature": 28.5,
  "humidity": 65.2,
  "soil_moisture": 45.8,
  "ph": 6.8,
  "nitrogen": 25,
  "phosphorus": 15,
  "potassium": 30,
  "signature": "abc123def456",
  "timestamp": "Firestore ServerTimestamp",
  "received_at": "2024-01-15T10:30:00.000Z"
}
```

## 🔒 Security Features

1. **Device ID Validation**: Setiap request harus include `device_id`
2. **Simple Signature**: Basic validation menggunakan device_id + secret
3. **Rate Limiting**: Bisa ditambahkan di endpoint
4. **HTTPS Only**: Untuk production gunakan HTTPS

## 🚀 Production Deployment

### 1. Deploy ke Vercel/Netlify
```bash
npm run build
# Deploy sesuai platform pilihan
```

### 2. Update ESP32 URL
```cpp
const char* serverURL = "https://www.atamagri.app/api/iot/sensor-data";
```

### 3. Firestore Security Rules (Production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sensor_data/{document} {
      allow write: if request.auth != null
        || isValidIoTRequest(request);
      allow read: if request.auth != null;
    }
  }
}

function isValidIoTRequest(request) {
  return request.resource.data.keys().hasAll(['device_id', 'signature'])
    && request.resource.data.device_id is string
    && request.resource.data.signature is string;
}
```

## 🔧 Troubleshooting

### ESP32 Issues:
- **WiFi tidak connect**: Cek SSID/password
- **HTTP 405 Error**: Endpoint hanya accept POST
- **HTTP 500 Error**: Cek Firebase configuration

### Web Issues:
- **Firebase error**: Cek environment variables
- **CORS error**: Add CORS headers jika diperlukan

### Firebase Issues:
- **Permission denied**: Cek Firestore rules
- **Quota exceeded**: Monitor usage di Firebase Console

## 📈 Next Steps

1. **Dashboard**: Buat halaman untuk visualisasi data
2. **Real-time**: Implement WebSocket untuk live updates
3. **Alerts**: Trigger notifikasi berdasarkan threshold
4. **Analytics**: Grafik trend dan analytics
5. **Device Management**: CRUD untuk manage multiple devices

## 📞 Support

Jika ada kendala, cek:
1. Console logs di browser (F12)
2. Serial monitor ESP32
3. Firebase Console → Usage tab
4. Network tab untuk debug HTTP requests

---
**✅ Setup Complete!** ESP32 sekarang bisa kirim data langsung ke Firebase melalui web endpoint.