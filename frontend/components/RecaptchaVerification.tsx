import React, { useEffect, useState, useCallback } from 'react';
import { RecaptchaService } from '../lib/recaptcha';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';

interface RecaptchaVerificationProps {
  onVerified: () => void;
  onSkip?: () => void;
  action?: string;
  skipEnabled?: boolean;
}

export default function RecaptchaVerification({
  onVerified,
  onSkip,
  action = 'login',
  skipEnabled = true
}: RecaptchaVerificationProps) {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [recaptchaService] = useState(() => RecaptchaService.getInstance());

  useEffect(() => {
    // Load reCAPTCHA script when component mounts
    recaptchaService.loadScript().catch((err) => {
      console.error('Failed to load reCAPTCHA:', err);
      setError('Failed to load security verification');
    });
  }, [recaptchaService]);

  const handleVerify = useCallback(async () => {
    if (verifying || verified) return;

    setVerifying(true);
    setError(null);

    try {
      // Execute reCAPTCHA
      const token = await recaptchaService.execute(action);

      // Send token to backend for verification
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          action,
          siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Verification failed');
      }

      if (result.success && result.score >= 0.5) {
        setVerified(true);
        setTimeout(() => {
          onVerified();
        }, 1000);
      } else if (result.score < 0.5) {
        throw new Error('Verification failed. Please try again.');
      } else {
        throw new Error('Invalid verification response');
      }
    } catch (err) {
      console.error('reCAPTCHA verification error:', err);
      setError(err instanceof Error ? err.message : 'Verification failed');
      setVerifying(false);
    }
  }, [verifying, verified, recaptchaService, action, onVerified]);

  const handleSkip = useCallback(() => {
    if (onSkip) {
      onSkip();
    }
  }, [onSkip]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2ecc71]/10 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-[#2ecc71]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Verification</h2>
          <p className="text-gray-600">
            Please verify you're not a bot
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {verified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-800">Verification successful!</p>
              </div>
            </div>
          )}

          {!verified && (
            <>
              <Button
                onClick={handleVerify}
                disabled={verifying}
                className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white"
                size="lg"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>

              {skipEnabled && !verifying && (
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-gray-700"
                >
                  Skip for now
                </Button>
              )}
            </>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              This verification helps protect your account from automated attacks
            </p>
            <p className="text-xs text-center text-gray-400 mt-1">
              Protected by reCAPTCHA Enterprise
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}