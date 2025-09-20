import {
  getAuth,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  checkActionCode,
  User,
  ActionCodeInfo,
  ActionCodeOperation,
  fetchSignInMethodsForEmail,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink
} from 'firebase/auth';

export interface EmailTestResult {
  success: boolean;
  timestamp: Date;
  type: string;
  email: string;
  message: string;
  error?: any;
  details?: any;
}

export class EmailTestingService {
  private auth = getAuth();
  private testResults: EmailTestResult[] = [];

  // Get action code settings for email link sign in
  private getActionCodeSettings(continueUrl?: string) {
    return {
      url: continueUrl || `${window.location.origin}/auth/action`,
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.atamagri.app'
      },
      android: {
        packageName: 'com.atamagri.app',
        installApp: true,
        minimumVersion: '12'
      },
      dynamicLinkDomain: 'atamagri.page.link'
    };
  }

  // Test 1: Password Reset Email
  async testPasswordResetEmail(email: string): Promise<EmailTestResult> {
    const startTime = Date.now();
    try {
      await sendPasswordResetEmail(this.auth, email, {
        url: `${window.location.origin}/login?email=${encodeURIComponent(email)}`,
        handleCodeInApp: false
      });

      const result: EmailTestResult = {
        success: true,
        timestamp: new Date(),
        type: 'Password Reset',
        email,
        message: `Password reset email sent successfully to ${email}`,
        details: {
          responseTime: Date.now() - startTime,
          actionUrl: `${window.location.origin}/login`,
          emailProvider: email.split('@')[1]
        }
      };

      this.testResults.push(result);
      return result;
    } catch (error: any) {
      const result: EmailTestResult = {
        success: false,
        timestamp: new Date(),
        type: 'Password Reset',
        email,
        message: `Failed to send password reset email: ${error.message}`,
        error: {
          code: error.code,
          message: error.message,
          details: error
        }
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Test 2: Email Verification
  async testEmailVerification(user: User | null): Promise<EmailTestResult> {
    if (!user) {
      return {
        success: false,
        timestamp: new Date(),
        type: 'Email Verification',
        email: 'N/A',
        message: 'No authenticated user found. Please sign in first.',
        error: { code: 'auth/no-user' }
      };
    }

    const startTime = Date.now();
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/dashboard?verified=true`,
        handleCodeInApp: false
      });

      const result: EmailTestResult = {
        success: true,
        timestamp: new Date(),
        type: 'Email Verification',
        email: user.email || '',
        message: `Verification email sent to ${user.email}`,
        details: {
          responseTime: Date.now() - startTime,
          userId: user.uid,
          currentVerificationStatus: user.emailVerified,
          continueUrl: `${window.location.origin}/dashboard`
        }
      };

      this.testResults.push(result);
      return result;
    } catch (error: any) {
      const result: EmailTestResult = {
        success: false,
        timestamp: new Date(),
        type: 'Email Verification',
        email: user.email || '',
        message: `Failed to send verification email: ${error.message}`,
        error: {
          code: error.code,
          message: error.message,
          details: error
        }
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Test 3: Email Link Sign In (Passwordless)
  async testEmailLinkSignIn(email: string): Promise<EmailTestResult> {
    const startTime = Date.now();
    try {
      const actionCodeSettings = this.getActionCodeSettings();
      await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);

      // Store email for later verification
      window.localStorage.setItem('emailForSignIn', email);

      const result: EmailTestResult = {
        success: true,
        timestamp: new Date(),
        type: 'Email Link Sign In',
        email,
        message: `Sign-in link sent to ${email}. Check email to complete sign in.`,
        details: {
          responseTime: Date.now() - startTime,
          actionCodeSettings,
          storageKey: 'emailForSignIn'
        }
      };

      this.testResults.push(result);
      return result;
    } catch (error: any) {
      const result: EmailTestResult = {
        success: false,
        timestamp: new Date(),
        type: 'Email Link Sign In',
        email,
        message: `Failed to send sign-in link: ${error.message}`,
        error: {
          code: error.code,
          message: error.message,
          details: error
        }
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Test 4: Verify Email Link and Complete Sign In
  async verifyEmailLink(emailLink: string): Promise<EmailTestResult> {
    const email = window.localStorage.getItem('emailForSignIn');

    if (!email) {
      return {
        success: false,
        timestamp: new Date(),
        type: 'Email Link Verification',
        email: 'N/A',
        message: 'No email found in storage. Please request a new sign-in link.',
        error: { code: 'auth/no-email-stored' }
      };
    }

    try {
      if (isSignInWithEmailLink(this.auth, emailLink)) {
        const result = await signInWithEmailLink(this.auth, email, emailLink);

        window.localStorage.removeItem('emailForSignIn');

        return {
          success: true,
          timestamp: new Date(),
          type: 'Email Link Verification',
          email,
          message: 'Successfully signed in with email link',
          details: {
            userId: result.user.uid,
            emailVerified: result.user.emailVerified,
            isNewUser: result.user.metadata.creationTime === result.user.metadata.lastSignInTime
          }
        };
      } else {
        return {
          success: false,
          timestamp: new Date(),
          type: 'Email Link Verification',
          email,
          message: 'Invalid email link provided',
          error: { code: 'auth/invalid-action-code' }
        };
      }
    } catch (error: any) {
      return {
        success: false,
        timestamp: new Date(),
        type: 'Email Link Verification',
        email,
        message: `Failed to verify email link: ${error.message}`,
        error: {
          code: error.code,
          message: error.message
        }
      };
    }
  }

  // Test 5: Update Email Address
  async testUpdateEmail(user: User | null, newEmail: string): Promise<EmailTestResult> {
    if (!user) {
      return {
        success: false,
        timestamp: new Date(),
        type: 'Update Email',
        email: 'N/A',
        message: 'No authenticated user found',
        error: { code: 'auth/no-user' }
      };
    }

    const startTime = Date.now();
    const oldEmail = user.email || '';

    try {
      await updateEmail(user, newEmail);

      const result: EmailTestResult = {
        success: true,
        timestamp: new Date(),
        type: 'Update Email',
        email: newEmail,
        message: `Email updated from ${oldEmail} to ${newEmail}`,
        details: {
          responseTime: Date.now() - startTime,
          oldEmail,
          newEmail,
          userId: user.uid
        }
      };

      this.testResults.push(result);
      return result;
    } catch (error: any) {
      const result: EmailTestResult = {
        success: false,
        timestamp: new Date(),
        type: 'Update Email',
        email: oldEmail,
        message: `Failed to update email: ${error.message}`,
        error: {
          code: error.code,
          message: error.message,
          requiresRecentLogin: error.code === 'auth/requires-recent-login'
        }
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Test 6: Check Sign-in Methods for Email
  async testCheckSignInMethods(email: string): Promise<EmailTestResult> {
    const startTime = Date.now();
    try {
      const methods = await fetchSignInMethodsForEmail(this.auth, email);

      const result: EmailTestResult = {
        success: true,
        timestamp: new Date(),
        type: 'Check Sign-in Methods',
        email,
        message: `Found ${methods.length} sign-in method(s) for ${email}`,
        details: {
          responseTime: Date.now() - startTime,
          methods,
          hasPasswordAuth: methods.includes('password'),
          hasEmailLink: methods.includes('emailLink'),
          hasGoogleAuth: methods.includes('google.com')
        }
      };

      this.testResults.push(result);
      return result;
    } catch (error: any) {
      const result: EmailTestResult = {
        success: false,
        timestamp: new Date(),
        type: 'Check Sign-in Methods',
        email,
        message: `Failed to check sign-in methods: ${error.message}`,
        error: {
          code: error.code,
          message: error.message
        }
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Test 7: Verify Action Code
  async testVerifyActionCode(actionCode: string): Promise<EmailTestResult> {
    try {
      const info = await checkActionCode(this.auth, actionCode);

      let operation = 'Unknown';
      switch (info.operation) {
        case 'PASSWORD_RESET':
          operation = 'Password Reset';
          break;
        case 'VERIFY_EMAIL':
          operation = 'Email Verification';
          break;
        case 'RECOVER_EMAIL':
          operation = 'Email Recovery';
          break;
        case 'VERIFY_AND_CHANGE_EMAIL':
          operation = 'Email Change Verification';
          break;
        case 'REVERT_SECOND_FACTOR_ADDITION':
          operation = 'Revert 2FA Addition';
          break;
      }

      const result: EmailTestResult = {
        success: true,
        timestamp: new Date(),
        type: 'Action Code Verification',
        email: info.data.email || '',
        message: `Valid action code for: ${operation}`,
        details: {
          operation,
          email: info.data.email,
          previousEmail: info.data.previousEmail,
          multiFactorInfo: info.data.multiFactorInfo
        }
      };

      this.testResults.push(result);
      return result;
    } catch (error: any) {
      const result: EmailTestResult = {
        success: false,
        timestamp: new Date(),
        type: 'Action Code Verification',
        email: 'N/A',
        message: `Invalid or expired action code: ${error.message}`,
        error: {
          code: error.code,
          message: error.message,
          isExpired: error.code === 'auth/expired-action-code',
          isInvalid: error.code === 'auth/invalid-action-code'
        }
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Test 8: Apply Action Code (complete email verification)
  async testApplyActionCode(actionCode: string): Promise<EmailTestResult> {
    try {
      await applyActionCode(this.auth, actionCode);

      const result: EmailTestResult = {
        success: true,
        timestamp: new Date(),
        type: 'Apply Action Code',
        email: this.auth.currentUser?.email || '',
        message: 'Action code applied successfully',
        details: {
          userEmailVerified: this.auth.currentUser?.emailVerified,
          userId: this.auth.currentUser?.uid
        }
      };

      this.testResults.push(result);
      return result;
    } catch (error: any) {
      const result: EmailTestResult = {
        success: false,
        timestamp: new Date(),
        type: 'Apply Action Code',
        email: 'N/A',
        message: `Failed to apply action code: ${error.message}`,
        error: {
          code: error.code,
          message: error.message
        }
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Test 9: Complete Password Reset
  async testCompletePasswordReset(actionCode: string, newPassword: string): Promise<EmailTestResult> {
    try {
      // First verify the code
      const email = await verifyPasswordResetCode(this.auth, actionCode);

      // Then reset the password
      await confirmPasswordReset(this.auth, actionCode, newPassword);

      const result: EmailTestResult = {
        success: true,
        timestamp: new Date(),
        type: 'Complete Password Reset',
        email,
        message: `Password successfully reset for ${email}`,
        details: {
          email,
          passwordStrength: this.checkPasswordStrength(newPassword)
        }
      };

      this.testResults.push(result);
      return result;
    } catch (error: any) {
      const result: EmailTestResult = {
        success: false,
        timestamp: new Date(),
        type: 'Complete Password Reset',
        email: 'N/A',
        message: `Failed to reset password: ${error.message}`,
        error: {
          code: error.code,
          message: error.message,
          isWeakPassword: error.code === 'auth/weak-password'
        }
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Helper: Check password strength
  private checkPasswordStrength(password: string): {
    score: number;
    strength: string;
    suggestions: string[];
  } {
    let score = 0;
    const suggestions: string[] = [];

    if (password.length >= 8) score++;
    else suggestions.push('Use at least 8 characters');

    if (password.length >= 12) score++;
    else if (password.length >= 8) suggestions.push('Consider using 12+ characters');

    if (/[a-z]/.test(password)) score++;
    else suggestions.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score++;
    else suggestions.push('Include uppercase letters');

    if (/[0-9]/.test(password)) score++;
    else suggestions.push('Include numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else suggestions.push('Include special characters');

    const strengthMap: { [key: number]: string } = {
      0: 'Very Weak',
      1: 'Very Weak',
      2: 'Weak',
      3: 'Fair',
      4: 'Good',
      5: 'Strong',
      6: 'Very Strong'
    };

    return {
      score,
      strength: strengthMap[score] || 'Unknown',
      suggestions
    };
  }

  // Get all test results
  getTestResults(): EmailTestResult[] {
    return this.testResults;
  }

  // Clear test results
  clearTestResults(): void {
    this.testResults = [];
  }

  // Export test results as JSON
  exportTestResults(): string {
    return JSON.stringify(this.testResults, null, 2);
  }

  // Generate test report
  generateTestReport(): {
    totalTests: number;
    passed: number;
    failed: number;
    successRate: string;
    byType: { [key: string]: { passed: number; failed: number } };
    averageResponseTime: number;
    errors: any[];
  } {
    const passed = this.testResults.filter(r => r.success).length;
    const failed = this.testResults.filter(r => !r.success).length;

    const byType: { [key: string]: { passed: number; failed: number } } = {};
    const responseTimes: number[] = [];
    const errors: any[] = [];

    this.testResults.forEach(result => {
      if (!byType[result.type]) {
        byType[result.type] = { passed: 0, failed: 0 };
      }

      if (result.success) {
        byType[result.type].passed++;
        if (result.details?.responseTime) {
          responseTimes.push(result.details.responseTime);
        }
      } else {
        byType[result.type].failed++;
        if (result.error) {
          errors.push({
            type: result.type,
            email: result.email,
            error: result.error,
            timestamp: result.timestamp
          });
        }
      }
    });

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    return {
      totalTests: this.testResults.length,
      passed,
      failed,
      successRate: `${((passed / (passed + failed)) * 100).toFixed(2)}%`,
      byType,
      averageResponseTime: Math.round(avgResponseTime),
      errors
    };
  }
}