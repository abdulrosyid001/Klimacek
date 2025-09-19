const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');

admin.initializeApp();

const recaptchaClient = new RecaptchaEnterpriseServiceClient();
const projectID = 'atamagri-cc5c1';
const recaptchaKey = '6LeNbc4rAAAAAF6TytlsbsacAAcw_B69AoSi3QNU';

exports.verifyRecaptcha = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const { token, action } = request.body;

      if (!token) {
        return response.status(400).json({
          success: false,
          message: 'reCAPTCHA token is required'
        });
      }

      const projectPath = recaptchaClient.projectPath(projectID);

      // Build the assessment request
      const assessmentRequest = {
        assessment: {
          event: {
            token: token,
            siteKey: recaptchaKey,
          },
        },
        parent: projectPath,
      };

      const [assessmentResponse] = await recaptchaClient.createAssessment(assessmentRequest);

      // Check if the token is valid
      if (!assessmentResponse.tokenProperties.valid) {
        console.log(`Invalid token: ${assessmentResponse.tokenProperties.invalidReason}`);
        return response.status(400).json({
          success: false,
          message: 'Invalid reCAPTCHA token',
          reason: assessmentResponse.tokenProperties.invalidReason
        });
      }

      // Check if the expected action matches
      if (action && assessmentResponse.tokenProperties.action !== action) {
        console.log('Action mismatch:', assessmentResponse.tokenProperties.action, 'expected:', action);
        return response.status(400).json({
          success: false,
          message: 'Action mismatch'
        });
      }

      // Get the risk score
      const score = assessmentResponse.riskAnalysis.score;
      console.log(`reCAPTCHA score: ${score}`);
      console.log('Reasons:', assessmentResponse.riskAnalysis.reasons);

      // Determine if the user is likely legitimate (score threshold can be adjusted)
      const isLegitimate = score >= 0.5;

      return response.status(200).json({
        success: true,
        score: score,
        legitimate: isLegitimate,
        reasons: assessmentResponse.riskAnalysis.reasons
      });

    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return response.status(500).json({
        success: false,
        message: 'Error verifying reCAPTCHA',
        error: error.message
      });
    }
  });
});

exports.createUser = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      // Verify the request is from an authenticated admin
      const idToken = request.headers.authorization?.split('Bearer ')[1];

      if (!idToken) {
        return response.status(401).json({
          success: false,
          message: 'No authorization token provided'
        });
      }

      // Verify the token
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      // Check if user is admin (you should use custom claims in production)
      const adminEmails = ['admin@atamagri.com'];
      if (!adminEmails.includes(decodedToken.email)) {
        return response.status(403).json({
          success: false,
          message: 'Unauthorized: Admin access required'
        });
      }

      const { email, password, displayName } = request.body;

      // Create the user
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
        emailVerified: false
      });

      // Store user metadata in Realtime Database
      await admin.database().ref(`users/${userRecord.uid}`).set({
        email: userRecord.email,
        displayName: displayName || '',
        createdAt: admin.database.ServerValue.TIMESTAMP,
        createdBy: decodedToken.email,
        role: 'user'
      });

      return response.status(200).json({
        success: true,
        message: 'User created successfully',
        uid: userRecord.uid,
        email: userRecord.email
      });

    } catch (error) {
      console.error('Error creating user:', error);
      return response.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
});