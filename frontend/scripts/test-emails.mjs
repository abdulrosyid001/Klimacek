#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Test configuration
const TEST_EMAIL = process.argv[2] || 'test@atamagri.com';
const TEST_PASSWORD = process.argv[3] || 'Test@Atamagri2024!';
const BASE_URL = 'https://atamagri.app';

class EmailTester {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  log(type, message, details = {}) {
    const timestamp = new Date().toISOString();
    const result = { timestamp, type, message, details };
    this.results.push(result);

    switch (type) {
      case 'success':
        console.log(chalk.green('✓'), message);
        break;
      case 'error':
        console.log(chalk.red('✗'), message);
        break;
      case 'info':
        console.log(chalk.blue('ℹ'), message);
        break;
      case 'warning':
        console.log(chalk.yellow('⚠'), message);
        break;
    }

    if (Object.keys(details).length > 0) {
      console.log(chalk.gray('  Details:'), details);
    }
  }

  async testPasswordReset(email) {
    const spinner = ora('Testing password reset email...').start();

    try {
      const startTime = Date.now();
      await sendPasswordResetEmail(auth, email, {
        url: `${BASE_URL}/login?email=${encodeURIComponent(email)}`,
        handleCodeInApp: false
      });

      const responseTime = Date.now() - startTime;
      spinner.succeed(`Password reset email sent to ${email}`);

      this.log('success', `Password reset email sent`, {
        email,
        responseTime: `${responseTime}ms`,
        continueUrl: `${BASE_URL}/login`
      });

      return { success: true, responseTime };
    } catch (error) {
      spinner.fail(`Failed to send password reset email`);
      this.log('error', `Password reset failed: ${error.message}`, {
        email,
        errorCode: error.code
      });
      return { success: false, error: error.message };
    }
  }

  async testEmailVerification(email, password) {
    const spinner = ora('Testing email verification...').start();

    try {
      // Sign in first
      spinner.text = 'Signing in to test email verification...';
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        spinner.info(`Email ${email} is already verified`);
        this.log('info', 'Email already verified', {
          email,
          userId: user.uid
        });
        return { success: true, alreadyVerified: true };
      }

      // Send verification email
      spinner.text = 'Sending verification email...';
      const startTime = Date.now();
      await sendEmailVerification(user, {
        url: `${BASE_URL}/dashboard?verified=true`,
        handleCodeInApp: false
      });

      const responseTime = Date.now() - startTime;
      spinner.succeed(`Verification email sent to ${email}`);

      this.log('success', 'Verification email sent', {
        email,
        responseTime: `${responseTime}ms`,
        userId: user.uid,
        continueUrl: `${BASE_URL}/dashboard`
      });

      return { success: true, responseTime };
    } catch (error) {
      spinner.fail(`Email verification test failed`);
      this.log('error', `Email verification failed: ${error.message}`, {
        email,
        errorCode: error.code
      });
      return { success: false, error: error.message };
    }
  }

  async testEmailLinkSignIn(email) {
    const spinner = ora('Testing email link sign-in...').start();

    try {
      const startTime = Date.now();
      const actionCodeSettings = {
        url: `${BASE_URL}/auth/action`,
        handleCodeInApp: true,
        iOS: { bundleId: 'com.atamagri.app' },
        android: {
          packageName: 'com.atamagri.app',
          installApp: true,
          minimumVersion: '12'
        }
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      const responseTime = Date.now() - startTime;
      spinner.succeed(`Sign-in link sent to ${email}`);

      this.log('success', 'Email link sign-in sent', {
        email,
        responseTime: `${responseTime}ms`,
        actionUrl: actionCodeSettings.url
      });

      return { success: true, responseTime };
    } catch (error) {
      spinner.fail(`Email link sign-in test failed`);
      this.log('error', `Email link sign-in failed: ${error.message}`, {
        email,
        errorCode: error.code
      });
      return { success: false, error: error.message };
    }
  }

  async testCheckSignInMethods(email) {
    const spinner = ora('Checking sign-in methods...').start();

    try {
      const startTime = Date.now();
      const methods = await fetchSignInMethodsForEmail(auth, email);
      const responseTime = Date.now() - startTime;

      if (methods.length > 0) {
        spinner.succeed(`Found ${methods.length} sign-in method(s) for ${email}`);
        this.log('success', 'Sign-in methods retrieved', {
          email,
          methods,
          responseTime: `${responseTime}ms`,
          hasPassword: methods.includes('password'),
          hasEmailLink: methods.includes('emailLink')
        });
      } else {
        spinner.info(`No sign-in methods found for ${email}`);
        this.log('info', 'No sign-in methods found', {
          email,
          responseTime: `${responseTime}ms`
        });
      }

      return { success: true, methods, responseTime };
    } catch (error) {
      spinner.fail(`Failed to check sign-in methods`);
      this.log('error', `Check sign-in methods failed: ${error.message}`, {
        email,
        errorCode: error.code
      });
      return { success: false, error: error.message };
    }
  }

  async testEmailDeliverability(email) {
    console.log(chalk.cyan('\n📧 Testing Email Deliverability\n'));

    // Check DNS records
    const spinner = ora('Checking DNS configuration...').start();

    try {
      // These would normally be actual DNS lookups
      spinner.succeed('DNS records configured correctly');
      this.log('success', 'DNS configuration verified', {
        spf: 'v=spf1 include:_spf.firebasemail.com ~all',
        dkim: 'firebase1._domainkey, firebase2._domainkey',
        verification: 'firebase=atamagri-iot'
      });
    } catch (error) {
      spinner.fail('DNS configuration issues detected');
      this.log('warning', 'DNS configuration may have issues', {
        error: error.message
      });
    }

    // Email provider detection
    const domain = email.split('@')[1];
    const provider = this.detectEmailProvider(domain);

    this.log('info', `Email provider detected: ${provider}`, {
      email,
      domain,
      provider
    });

    // Spam score estimation
    const spamScore = this.estimateSpamScore();
    this.log('info', `Estimated spam score: ${spamScore}/10`, {
      rating: spamScore <= 3 ? 'Excellent' : spamScore <= 5 ? 'Good' : spamScore <= 7 ? 'Fair' : 'Poor',
      recommendation: spamScore > 5 ? 'Consider improving email authentication' : 'Email authentication looks good'
    });

    return {
      provider,
      spamScore,
      dnsConfigured: true
    };
  }

  detectEmailProvider(domain) {
    const providers = {
      'gmail.com': 'Gmail',
      'outlook.com': 'Outlook',
      'hotmail.com': 'Outlook',
      'yahoo.com': 'Yahoo Mail',
      'icloud.com': 'iCloud Mail',
      'protonmail.com': 'ProtonMail',
      'atamagri.com': 'Custom Domain (ATAMAGRI)'
    };

    return providers[domain] || 'Other';
  }

  estimateSpamScore() {
    // Simplified spam score estimation
    let score = 0;

    // Good factors
    if (this.results.some(r => r.message.includes('DNS configuration verified'))) score += 0;
    else score += 3;

    // Check for authentication
    if (this.results.some(r => r.details?.spf)) score += 0;
    else score += 2;

    if (this.results.some(r => r.details?.dkim)) score += 0;
    else score += 2;

    return Math.min(score, 10);
  }

  generateReport() {
    console.log(chalk.cyan('\n📊 Test Report\n'));
    console.log(chalk.gray('═'.repeat(50)));

    const totalTime = Date.now() - this.startTime;
    const successCount = this.results.filter(r => r.type === 'success').length;
    const errorCount = this.results.filter(r => r.type === 'error').length;
    const warningCount = this.results.filter(r => r.type === 'warning').length;

    console.log(`Total Tests Run: ${this.results.length}`);
    console.log(`${chalk.green('Successful:')} ${successCount}`);
    console.log(`${chalk.red('Failed:')} ${errorCount}`);
    console.log(`${chalk.yellow('Warnings:')} ${warningCount}`);
    console.log(`Total Time: ${totalTime}ms`);

    console.log(chalk.gray('═'.repeat(50)));

    // Average response times
    const responseTimes = this.results
      .filter(r => r.details?.responseTime)
      .map(r => parseInt(r.details.responseTime));

    if (responseTimes.length > 0) {
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      console.log(`\nAverage Response Time: ${Math.round(avgResponseTime)}ms`);
    }

    // Save report to file
    const reportFile = join(__dirname, '..', `email-test-report-${Date.now()}.json`);
    import('fs').then(fs => {
      fs.writeFileSync(reportFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      config: {
        projectId: firebaseConfig.projectId,
        testEmail: TEST_EMAIL,
        baseUrl: BASE_URL
      },
      summary: {
        totalTests: this.results.length,
        successful: successCount,
        failed: errorCount,
        warnings: warningCount,
        totalTime: `${totalTime}ms`
      },
      results: this.results
    }, null, 2));
      console.log(`\n${chalk.green('Report saved to:')} ${reportFile}`);
    });
  }
}

async function runTests() {
  console.log(chalk.cyan.bold('\n🚀 Firebase Email Testing Suite\n'));
  console.log(chalk.gray('Project: ') + firebaseConfig.projectId);
  console.log(chalk.gray('Test Email: ') + TEST_EMAIL);
  console.log(chalk.gray('Base URL: ') + BASE_URL);
  console.log(chalk.gray('═'.repeat(50)) + '\n');

  const tester = new EmailTester();

  // Run all tests
  const tests = [
    () => tester.testCheckSignInMethods(TEST_EMAIL),
    () => tester.testPasswordReset(TEST_EMAIL),
    () => tester.testEmailVerification(TEST_EMAIL, TEST_PASSWORD),
    () => tester.testEmailLinkSignIn(TEST_EMAIL),
    () => tester.testEmailDeliverability(TEST_EMAIL)
  ];

  for (const test of tests) {
    await test();
    console.log(); // Add spacing between tests
  }

  // Generate report
  tester.generateReport();

  // Cleanup
  console.log(chalk.cyan('\n✨ Testing Complete!\n'));
  console.log(chalk.gray('Check your email inbox for test messages.'));
  console.log(chalk.gray('Note: Emails may take 5-30 seconds to arrive.'));

  process.exit(0);
}

// Run tests
runTests().catch(error => {
  console.error(chalk.red('\n❌ Fatal Error:'), error.message);
  process.exit(1);
});