import { NextApiRequest, NextApiResponse } from 'next';

const RECAPTCHA_API_KEY = process.env.RECAPTCHA_API_KEY || '';
const RECAPTCHA_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'atamagri-iot';
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdbhM4rAAAAAG2o7y2FhnaHwf7AbFCcDWeCROj1';
const isDevelopment = process.env.NODE_ENV === 'development';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, action, siteKey } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Only use mock verification when API key is not configured
    if (!RECAPTCHA_API_KEY || RECAPTCHA_API_KEY === 'YOUR_API_KEY_HERE') {
      console.log('Warning: reCAPTCHA API key not configured, using mock verification');

      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return a mock successful response
      return res.status(200).json({
        success: true,
        score: 0.9,
        action: action || 'login',
        reasons: [],
        tokenProperties: {
          valid: true,
          action: action || 'login',
          createTime: new Date().toISOString()
        }
      });
    }

    console.log('Using real reCAPTCHA Enterprise verification');

    // Create assessment request for reCAPTCHA Enterprise
    const assessmentUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${RECAPTCHA_API_KEY}`;

    const assessmentBody = {
      event: {
        token: token,
        expectedAction: action || 'login',
        siteKey: siteKey || RECAPTCHA_SITE_KEY
      }
    };

    const response = await fetch(assessmentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessmentBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('reCAPTCHA verification failed:', data);
      return res.status(400).json({
        success: false,
        error: 'Verification failed',
        details: data
      });
    }

    // Check if the token is valid
    if (!data.tokenProperties?.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token',
        reason: data.tokenProperties?.invalidReason
      });
    }

    // Check the risk score (0.0 is bot, 1.0 is human)
    const score = data.riskAnalysis?.score || 0;
    const threshold = 0.5; // Adjust this threshold as needed

    if (score < threshold) {
      return res.status(400).json({
        success: false,
        error: 'Risk score too low',
        score: score
      });
    }

    // Successful verification
    return res.status(200).json({
      success: true,
      score: score,
      action: data.tokenProperties?.action,
      timestamp: data.event?.token
    });

  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}