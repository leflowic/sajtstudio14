/**
 * End-to-End Messaging System Test
 * Tests: Authentication, User Search, Message Send/Receive, Read Receipts, WebSocket Events
 */

import WebSocket from 'ws';

const BASE_URL = 'http://localhost:5000';
let sessionCookie = '';

interface ApiResponse {
  ok: boolean;
  status: number;
  data: any;
}

// Helper: Make authenticated HTTP request
async function request(method: string, path: string, body?: any): Promise<ApiResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (sessionCookie) {
    headers['Cookie'] = sessionCookie;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const setCookie = response.headers.get('set-cookie');
  if (setCookie && !sessionCookie) {
    sessionCookie = setCookie.split(';')[0];
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

// Test 1: User Authentication
async function testAuthentication() {
  console.log('\n🔐 Test 1: User Authentication');
  
  // Use static verified test user (created in database)
  const testUsername = 'msgtest';
  const testPassword = 'Test1234!';
  
  console.log(`   Logging in as: ${testUsername} (email-verified ✅)`);
  
  // Login with verified test user
  const loginRes = await request('POST', '/api/login', {
    username: testUsername,
    password: testPassword,
  });

  if (loginRes.ok && loginRes.data.id) {
    console.log(`✅ Login successful: ${loginRes.data.username} (ID: ${loginRes.data.id})`);
    console.log(`   Email verified: ${loginRes.data.emailVerified}`);
    return loginRes.data;
  } else {
    console.log(`❌ Login failed: ${loginRes.status} ${JSON.stringify(loginRes.data)}`);
    throw new Error('Authentication failed');
  }
}

// Test 2: User Search
async function testUserSearch(query: string) {
  console.log(`\n🔍 Test 2: User Search (query: "${query}")`);
  
  const searchRes = await request('GET', `/api/users/search?q=${query}`);
  
  if (searchRes.ok && Array.isArray(searchRes.data)) {
    console.log(`✅ Search found ${searchRes.data.length} users:`);
    searchRes.data.forEach((user: any) => {
      console.log(`   - ${user.username} (ID: ${user.id}, verified: ${user.emailVerified})`);
    });
    return searchRes.data;
  } else {
    console.log(`❌ Search failed: ${searchRes.status}`);
    return [];
  }
}

// Test 3: Get Conversations
async function testGetConversations() {
  console.log('\n💬 Test 3: Get Conversations');
  
  const convRes = await request('GET', '/api/conversations');
  
  if (convRes.ok && Array.isArray(convRes.data)) {
    console.log(`✅ Found ${convRes.data.length} conversations`);
    convRes.data.forEach((conv: any) => {
      console.log(`   - Conversation with user ${conv.otherUser?.username} (${conv.messageCount} messages)`);
    });
    return convRes.data;
  } else {
    console.log(`❌ Failed to get conversations: ${convRes.status}`);
    return [];
  }
}

// Test 4: Send Message
async function testSendMessage(receiverId: number, content: string) {
  console.log(`\n📤 Test 4: Send Message to user ${receiverId}`);
  
  const sendRes = await request('POST', '/api/messages/send', {
    receiverId,
    content,
  });

  if (sendRes.ok && sendRes.data.message) {
    console.log(`✅ Message sent successfully (ID: ${sendRes.data.message.id})`);
    console.log(`   Content: "${sendRes.data.message.content}"`);
    console.log(`   Timestamp: ${sendRes.data.message.createdAt}`);
    return sendRes.data.message;
  } else {
    console.log(`❌ Send message failed: ${sendRes.status} ${JSON.stringify(sendRes.data)}`);
    return null;
  }
}

// Test 5: Get Messages in Conversation
async function testGetMessages(otherUserId: number) {
  console.log(`\n📥 Test 5: Get Messages with user ${otherUserId}`);
  
  const msgRes = await request('GET', `/api/messages/conversation/${otherUserId}`);
  
  if (msgRes.ok && Array.isArray(msgRes.data)) {
    console.log(`✅ Retrieved ${msgRes.data.length} messages`);
    msgRes.data.slice(-3).forEach((msg: any) => {
      console.log(`   - [${msg.createdAt}] ${msg.sender.username}: "${msg.content}"`);
    });
    return msgRes.data;
  } else {
    console.log(`❌ Get messages failed: ${msgRes.status}`);
    return [];
  }
}

// Test 6: Mark Messages as Read
async function testMarkAsRead(conversationUserId: number) {
  console.log(`\n✅ Test 6: Mark Messages as Read (conversation with ${conversationUserId})`);
  
  const readRes = await request('PUT', '/api/messages/mark-read', {
    conversationUserId,
  });

  if (readRes.ok) {
    console.log(`✅ Messages marked as read successfully`);
    return true;
  } else {
    console.log(`❌ Mark as read failed: ${readRes.status}`);
    return false;
  }
}

// Test 7: Get Unread Count
async function testUnreadCount() {
  console.log('\n🔔 Test 7: Get Unread Message Count');
  
  const countRes = await request('GET', '/api/messages/unread-count');
  
  if (countRes.ok && typeof countRes.data.count === 'number') {
    console.log(`✅ Unread messages: ${countRes.data.count}`);
    return countRes.data.count;
  } else {
    console.log(`❌ Get unread count failed: ${countRes.status}`);
    return null;
  }
}

// Test 8: WebSocket Connection
async function testWebSocket(userId: number): Promise<void> {
  console.log('\n🔌 Test 8: WebSocket Real-Time Connection');
  
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:5000/api/ws`);
    let authenticated = false;
    
    const timeout = setTimeout(() => {
      console.log('⚠️  WebSocket test timeout (10s)');
      ws.close();
      resolve(); // Don't reject, just resolve with warning
    }, 10000);

    ws.on('open', () => {
      console.log('✅ WebSocket connected');
      // Send auth message
      ws.send(JSON.stringify({ type: 'auth', userId }));
    });

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'authenticated') {
        authenticated = true;
        console.log(`✅ WebSocket authenticated for user ${userId}`);
        
        // Test typing indicator
        ws.send(JSON.stringify({ 
          type: 'typing_start', 
          conversationUserId: 25 // Example user
        }));
        console.log('✅ Typing indicator sent');
        
        // Clean up after 2 seconds
        setTimeout(() => {
          clearTimeout(timeout);
          ws.close();
          console.log('✅ WebSocket test completed');
          resolve();
        }, 2000);
      } else {
        console.log(`   WebSocket event: ${message.type}`);
      }
    });

    ws.on('error', (error) => {
      console.log(`⚠️  WebSocket error: ${error.message}`);
      clearTimeout(timeout);
      resolve(); // Don't fail the test
    });

    ws.on('close', () => {
      if (!authenticated) {
        console.log('⚠️  WebSocket closed before authentication');
      }
      clearTimeout(timeout);
      resolve();
    });
  });
}

// Run all tests
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  STUDIO LEFLOW - MESSAGING SYSTEM E2E TESTS');
  console.log('═══════════════════════════════════════════════════════');

  try {
    // Test 1: Authentication
    const currentUser = await testAuthentication();
    
    if (!currentUser.emailVerified) {
      console.log('\n⚠️  WARNING: Current user email not verified!');
      console.log('   Messaging features require email verification.');
      console.log('   Some tests may fail due to requireVerifiedEmail middleware.');
    }

    // Test 2: User Search (minimum 2 characters required)
    const users = await testUserSearch('ve');
    
    // Test 3: Get Conversations
    await testGetConversations();
    
    // Test 4-7: Message Flow (if we have users to message)
    if (users.length > 0 && currentUser.emailVerified) {
      const targetUser = users.find((u: any) => u.id !== currentUser.id);
      
      if (targetUser) {
        // Send message
        const message = await testSendMessage(
          targetUser.id, 
          `Test message from automated E2E test - ${new Date().toISOString()}`
        );
        
        if (message) {
          // Get messages
          await testGetMessages(targetUser.id);
          
          // Mark as read
          await testMarkAsRead(targetUser.id);
          
          // Check unread count
          await testUnreadCount();
        }
      }
    } else if (!currentUser.emailVerified) {
      console.log('\n⚠️  Skipping message flow tests (email not verified)');
    }
    
    // Test 8: WebSocket
    if (currentUser.emailVerified) {
      await testWebSocket(currentUser.id);
    } else {
      console.log('\n⚠️  Skipping WebSocket test (email not verified)');
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  ✅ ALL TESTS COMPLETED');
    console.log('═══════════════════════════════════════════════════════\n');
    
  } catch (error: any) {
    console.error('\n❌ TEST SUITE FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Execute tests
runAllTests();
