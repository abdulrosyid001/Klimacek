import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';
import { ref, push, serverTimestamp } from 'firebase/database';

interface SensorData {
  device_id: string;
  temperature?: number;
  humidity?: number;
  soil_moisture?: number;
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  timestamp?: any;
  signature?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const data: SensorData = req.body;

    // Validasi basic
    if (!data.device_id) {
      return res.status(400).json({
        success: false,
        error: 'device_id is required'
      });
    }

    // Validasi signature sederhana (opsional untuk keamanan basic)
    const expectedSignature = generateSignature(data.device_id);
    if (data.signature && data.signature !== expectedSignature) {
      return res.status(401).json({
        success: false,
        error: 'Invalid signature'
      });
    }

    // Tambah timestamp server
    const sensorRecord = {
      ...data,
      timestamp: serverTimestamp(),
      received_at: new Date().toISOString()
    };

    // Simpan ke Realtime Database
    const sensorDataRef = ref(db, 'sensor_data');
    const newDataRef = await push(sensorDataRef, sensorRecord);

    return res.status(200).json({
      success: true,
      id: newDataRef.key,
      message: 'Data saved successfully'
    });

  } catch (error: any) {
    console.error('Error saving sensor data:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Simple signature generation untuk validasi basic
function generateSignature(device_id: string): string {
  const secret = process.env.IOT_SECRET || 'default-secret';
  return Buffer.from(device_id + secret).toString('base64').slice(0, 16);
}