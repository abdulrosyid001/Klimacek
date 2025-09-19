import { NextApiRequest, NextApiResponse } from 'next';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LeNbc4rAAAAAOTw8Z6NOnYnmcXkEEKMYPZZ57MR';
const RECAPTCHA_PROJECT_ID = 'atamagri-cc5c1';
const RECAPTCHA_SITE_KEY = '6LeNbc4rAAAAAF6TytlsbsacAAcw_B69AoSi3QNU';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, action } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Create assessment request for reCAPTCHA Enterprise
    const assessmentUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${RECAPTCHA_SECRET_KEY}`;

    const assessmentBody = {
      event: {
        token: token,
        expectedAction: action || 'login',
        siteKey: RECAPTCHA_SITE_KEY
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