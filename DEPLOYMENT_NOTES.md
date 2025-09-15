# Production Deployment Notes

## 🌐 Domain Configuration
**Production URL:** https://www.atamagri.app/

## 📡 IoT Endpoint
**ESP32 Target:** `https://www.atamagri.app/api/iot/sensor-data`

## 🔧 Environment Setup
Copy environment variables dari `.env.local.example` ke `.env.local`

## 🚀 Deployment Checklist

### Firebase Setup
- ✅ Project: `atamagri-iot`
- ✅ Realtime Database: `https://atamagri-iot-default-rtdb.asia-southeast1.firebasedatabase.app`
- ✅ Test Mode: Active until 2025-10-15

### Production Variables
```env
FIREBASE_API_KEY=AIzaSyDYJpxwibPgJiH418xvjrLJXv_W6opaNbo
FIREBASE_AUTH_DOMAIN=atamagri-iot.firebaseapp.com
FIREBASE_DATABASE_URL=https://atamagri-iot-default-rtdb.asia-southeast1.firebasedatabase.app
FIREBASE_PROJECT_ID=atamagri-iot
FIREBASE_STORAGE_BUCKET=atamagri-iot.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=745512120451
FIREBASE_APP_ID=1:745512120451:web:6cfdd1aab20747f675ebb6
IOT_SECRET=your-production-secret
```

### ESP32 Production Config
```cpp
const char* serverURL = "https://www.atamagri.app/api/iot/sensor-data";
```

## 📊 Monitoring
- **Dashboard:** `https://www.atamagri.app/iot-dashboard`
- **Navigation:** Added "IoT Monitor" to main menu

## 🔒 Security Notes
- Firebase Test Mode expires: **2025-10-15**
- Basic signature validation implemented
- HTTPS enforced for production
- No authentication required for ESP32 (as requested)

---
**Ready for production deployment! 🚀**