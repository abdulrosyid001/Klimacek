import React, { useEffect, useState, useCallback, useRef } from 'react';
import { TurnstileService } from '../lib/turnstile';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';

interface TurnstileVerificationProps {
  onVerified: () => void;
  onSkip?: () => void;
  action?: string;
  skipEnabled?: boolean;
}

export default function TurnstileVerification({
  onVerified,
  onSkip,
  action = 'login',
  skipEnabled = true
}: TurnstileVerificationProps) {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [turnstileService] = useState(() => TurnstileService.getInstance());
  const [token, setToken] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      turnstileService.render('turnstile-widget', {
        callback: async (turnstileToken: string) => {
          setToken(turnstileToken);
          await handleVerifyToken(turnstileToken);
        },
        'error-callback': (error: any) => {
          console.error('Turnstile error:', error);
          setError('Verification widget error. Please try again.');
          setVerifying(false);
        },
        'expired-callback': () => {
          setToken(null);
          setError('Verification expired. Please try again.');
          setVerifying(false);
        },
        theme: 'auto',
        size: 'normal',
        action: action
      }).catch((err) => {
        console.error('Failed to render Turnstile:', err);
        setError('Failed to load security verification');
      });
    }

    return () => {
      turnstileService.remove();
    };
  }, [turnstileService, action]);

  const handleVerifyToken = useCallback(async (turnstileToken: string) => {
    if (verified) return;

    setVerifying(true);
    setError(null);

    try {
      const response = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: turnstileToken
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Verification failed');
      }

      if (result.success) {
        setVerified(true);
        console.log('Turnstile verification successful');
        setTimeout(() => {
          onVerified();
        }, 1000);
      } else {
        throw new Error('Verification failed');
      }
    } catch (err) {
      console.error('Turnstile verification error:', err);
      setError(err instanceof Error ? err.message : 'Verification failed');
      setVerifying(false);
      turnstileService.reset();
    }
  }, [verified, onVerified, turnstileService]);

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
              {verifying && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-[#2ecc71]" />
                  <span className="ml-2 text-gray-600">Verifying...</span>
                </div>
              )}

              {!verifying && (
                <div id="turnstile-widget" ref={containerRef} className="flex justify-center"></div>
              )}

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
              Protected by Cloudflare Turnstile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}