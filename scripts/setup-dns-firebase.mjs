#!/usr/bin/env node

/**
 * This script adds the required DNS records for Firebase Email Authentication
 * to the atamagri.app domain using Vercel CLI
 *
 * Required DNS Records:
 * 1. SPF TXT record for email authentication
 * 2. Firebase domain verification TXT record
 * 3. DKIM CNAME records for email signing
 */

import { execSync } from 'child_process';

const DOMAIN = 'atamagri.app';
const TEAM_ID = 'team_wKAZT3BDfEf2l4ye3SuEuxNW';

// Get Vercel auth token from environment
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN environment variable not set');
  console.log('Please set: export VERCEL_TOKEN="your-vercel-token"');
  process.exit(1);
}

const dnsRecords = [
  {
    type: 'TXT',
    name: '@',
    value: 'v=spf1 include:_spf.firebasemail.com ~all',
    description: 'SPF record for Firebase email'
  },
  {
    type: 'TXT',
    name: '@',
    value: 'firebase=atamagri-iot',
    description: 'Firebase domain verification'
  },
  {
    type: 'CNAME',
    name: 'firebase1._domainkey',
    value: 'mail-atamagri-app.dkim1._domainkey.firebasemail.com.',
    description: 'DKIM signature key 1'
  },
  {
    type: 'CNAME',
    name: 'firebase2._domainkey',
    value: 'mail-atamagri-app.dkim2._domainkey.firebasemail.com.',
    description: 'DKIM signature key 2'
  }
];

async function addDNSRecords() {
  console.log('🔧 Setting up Firebase Email DNS records for', DOMAIN);
  console.log('━'.repeat(50));

  // First, list existing DNS records
  console.log('\n📋 Checking existing DNS records...');
  try {
    const listCmd = `vercel dns ls ${DOMAIN} --token="${VERCEL_TOKEN}" --team="${TEAM_ID}"`;
    const output = execSync(listCmd, { encoding: 'utf8' });
    console.log(output);
  } catch (error) {
    console.log('No existing DNS records found or unable to list them.');
  }

  console.log('\n➕ Adding Firebase Email DNS records...\n');

  for (const record of dnsRecords) {
    try {
      console.log(`Adding ${record.type} record: ${record.description}`);
      console.log(`  Name: ${record.name}`);
      console.log(`  Value: ${record.value}`);

      let command;
      if (record.type === 'TXT') {
        // For TXT records, we need to properly escape the value
        command = `vercel dns add ${DOMAIN} "${record.name}" ${record.type} "${record.value}" --token="${VERCEL_TOKEN}" --team="${TEAM_ID}"`;
      } else {
        // For CNAME records
        command = `vercel dns add ${DOMAIN} ${record.name} ${record.type} ${record.value} --token="${VERCEL_TOKEN}" --team="${TEAM_ID}"`;
      }

      const result = execSync(command, { encoding: 'utf8' });
      console.log(`✅ Successfully added: ${result.trim()}`);
      console.log();
    } catch (error) {
      if (error.toString().includes('already exists')) {
        console.log(`⚠️  Record already exists, skipping...`);
      } else {
        console.error(`❌ Failed to add record: ${error.message}`);
      }
      console.log();
    }
  }

  console.log('━'.repeat(50));
  console.log('\n✅ DNS Setup Complete!');
  console.log('\n📝 Next Steps:');
  console.log('1. DNS propagation can take up to 48 hours');
  console.log('2. You can verify DNS propagation with:');
  console.log('   nslookup -type=TXT atamagri.app');
  console.log('   nslookup firebase1._domainkey.atamagri.app');
  console.log('3. Once propagated, Firebase will automatically verify the domain');
  console.log('4. Check Firebase Console > Authentication > Settings > Authorized domains');
}

// Run the setup
addDNSRecords().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});