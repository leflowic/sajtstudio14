/**
 * Create and verify a static test user for messaging E2E tests
 */

import { hashPassword } from './server/auth';

async function createTestUser() {
  const username = 'msgtest';
  const email = 'msgtest@example.com';
  const password = 'Test1234!';
  
  const hashedPassword = await hashPassword(password);
  
  console.log(`
Test User Credentials:
Username: ${username}
Email: ${email}
Password: ${password}
Hashed Password: ${hashedPassword}

SQL to insert:
INSERT INTO users (username, email, password, role, banned, terms_accepted, email_verified, created_at)
VALUES ('${username}', '${email}', '${hashedPassword}', 'user', false, true, true, NOW())
ON CONFLICT (username) DO UPDATE 
SET password = EXCLUDED.password, email_verified = true
RETURNING id, username, email, email_verified;
`);
}

createTestUser();
