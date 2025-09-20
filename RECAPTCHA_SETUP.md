# reCAPTCHA Enterprise Setup Documentation

## Overview
This document describes the reCAPTCHA Enterprise implementation in the ATAMAGRI V2 application. The system uses Google reCAPTCHA Enterprise to protect against bots and automated attacks.

## Current Configuration

### Environment Variables
The following environment variables need to be configured in `frontend/.env.local`:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_API_KEY=your_recaptcha_api_key_here
```

⚠️ **SECURITY WARNING**: Never commit actual API keys to version control. Always use environment variables and keep your `.env.local` file in `.gitignore`.

### Implementation Details

#### Frontend Components

1. **RecaptchaService** (`frontend/lib/recaptcha.ts`)
   - Singleton service for managing reCAPTCHA operations
   - Handles script loading and token generation
   - Uses the reCAPTCHA Enterprise JavaScript API

2. **RecaptchaVerification Component** (`frontend/components/RecaptchaVerification.tsx`)
   - Reusable React component for reCAPTCHA verification
   - Displays a modal with verification button
   - Handles token generation and backend verification

3. **Login Page Integration** (`frontend/pages/login.tsx`)
   - Executes reCAPTCHA on form submission
   - Verifies token with backend before allowing sign-in
   - Prevents login if verification fails

4. **Global Script Loading** (`frontend/pages/_document.tsx`)
   - Loads reCAPTCHA Enterprise script globally
   - Uses environment variable for site key

#### Backend Verification

**API Endpoint** (`frontend/pages/api/verify-recaptcha.ts`)
- Verifies reCAPTCHA tokens using Google reCAPTCHA Enterprise API
- Extracts user IP and user agent for enhanced security
- Implements action-based thresholds:
  - Login: 0.5 (default)
  - Register: 0.7 (stricter)
  - Purchase: 0.8 (very strict)
- Returns score, action, and pass/fail status

## ⚠️ URGENT: Key Rotation Required

Since API keys were previously exposed in this repository, they must be rotated immediately:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/security/recaptcha
2. **Delete the compromised keys**:
   - Site Key ending in: ...ROj1
   - API Key starting with: AIzaSy...
3. **Create new keys**:
   - Click "Create Key" or "+" button
   - Select "Website" for platform
   - Add your domains
   - Copy the new Site Key
4. **Create new API credentials**:
   - Go to APIs & Services > Credentials
   - Create new API key
   - Restrict it to reCAPTCHA Enterprise API only
5. **Update your `.env.local` file** with the new keys
6. **Never commit `.env.local` to Git**

## How It Works

### Token Generation Flow
1. User performs an action (e.g., login)
2. Frontend executes `grecaptcha.enterprise.execute()` with action name
3. reCAPTCHA returns an encrypted token
4. Token is sent to backend for verification

### Verification Flow
1. Backend receives token and action
2. Creates assessment via reCAPTCHA Enterprise API
3. Includes user IP and user agent for better risk analysis
4. Validates token and checks action match
5. Returns score and pass/fail based on threshold

## Security Features

1. **Action Verification**: Ensures the action in the assessment matches the expected action
2. **IP Address Tracking**: Includes user IP for better risk assessment
3. **User Agent Analysis**: Sends browser information for pattern detection
4. **Flexible Thresholds**: Different score requirements for different actions
5. **Token Expiry**: Tokens expire after 2 minutes for security

## Testing the Implementation

### Local Testing
1. Ensure environment variables are set in `.env.local`
2. Run the development server: `npm run dev`
3. Navigate to the login page
4. Submit the login form
5. Check browser console for reCAPTCHA logs
6. Check server logs for verification details

### Production Verification
- Monitor the reCAPTCHA Enterprise console for traffic
- Review risk analysis scores and reasons
- Adjust thresholds based on actual traffic patterns

## Troubleshooting

### Common Issues

1. **"reCAPTCHA not loaded" error**
   - Check if the site key is correct
   - Verify the script is loading in _document.tsx
   - Check browser console for script loading errors

2. **"Invalid token" error**
   - Token may have expired (2-minute limit)
   - Site key mismatch between frontend and backend
   - API key not configured correctly

3. **Low scores for legitimate users**
   - New implementation needs time to learn (48 hours)
   - Consider lowering thresholds temporarily
   - Review reason codes in the assessment

4. **API authentication errors**
   - Verify RECAPTCHA_API_KEY is correct
   - Check if API key has proper permissions
   - Ensure project ID matches your Google Cloud project

## Best Practices

1. **Include reCAPTCHA on all sensitive actions**
   - Login/Registration
   - Password reset
   - Contact forms
   - Payment processing

2. **Monitor and adjust thresholds**
   - Start with moderate thresholds
   - Analyze scores over time
   - Adjust based on false positive/negative rates

3. **Use meaningful action names**
   - Be specific: 'login', 'register', 'checkout'
   - Consistent naming across frontend and backend
   - Helps with analytics and threshold tuning

4. **Handle failures gracefully**
   - Provide clear error messages
   - Allow retry attempts
   - Consider fallback verification methods

## Google Cloud Console

To manage your reCAPTCHA Enterprise keys:
1. Visit: https://console.cloud.google.com/security/recaptcha
2. Select your project: atamagri-iot
3. View keys, analytics, and risk assessments
4. Adjust key settings as needed

## Additional Resources

- [reCAPTCHA Enterprise Documentation](https://cloud.google.com/recaptcha-enterprise/docs)
- [Best Practices Guide](https://cloud.google.com/recaptcha-enterprise/docs/best-practices)
- [Interpreting Assessments](https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment)