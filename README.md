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
# These are set in Vercel Dashboard Environment Variables
FIREBASE_API_KEY=<configured-in-vercel>
FIREBASE_AUTH_DOMAIN=<configured-in-vercel>
FIREBASE_DATABASE_URL=<configured-in-vercel>
FIREBASE_PROJECT_ID=<configured-in-vercel>
FIREBASE_STORAGE_BUCKET=<configured-in-vercel>
FIREBASE_MESSAGING_SENDER_ID=<configured-in-vercel>
FIREBASE_APP_ID=<configured-in-vercel>
IOT_SECRET=<configured-in-vercel>
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