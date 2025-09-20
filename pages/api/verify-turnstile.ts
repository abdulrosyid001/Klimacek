import { NextApiRequest, NextApiResponse } from 'next';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAAB2RiKn6QEiGEQYJmj6wJ1axl0c';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  if (!TURNSTILE_SECRET_KEY) {
    console.error('Turnstile secret key not configured');
    return res.status(500).json({
      success: false,
      error: 'Turnstile not configured properly'
    });
  }

  try {
    const remoteip = req.headers['x-forwarded-for'] as string ||
                    req.headers['x-real-ip'] as string ||
                    req.socket?.remoteAddress ||
                    '';

    const formData = new FormData();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    if (remoteip) {
      formData.append('remoteip', remoteip.split(',')[0].trim());
    }

    console.log('Verifying Turnstile token...');

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Turnstile API error:', result);
      return res.status(400).json({
        success: false,
        error: 'Verification failed',
        details: process.env.NODE_ENV === 'development' ? result : undefined
      });
    }

    console.log('Turnstile verification result:', {
      success: result.success,
      hostname: result.hostname,
      action: result.action,
      challengeTimestamp: result.challenge_ts
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        hostname: result.hostname,
        action: result.action,
        challengeTimestamp: result.challenge_ts
      });
    } else {
      console.error('Turnstile verification failed:', result['error-codes']);
      return res.status(400).json({
        success: false,
        error: 'Verification failed',
        errorCodes: result['error-codes']
      });
    }

  } catch (error) {
    console.error('Turnstile verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}