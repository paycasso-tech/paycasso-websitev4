
import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server for both Express and WebSocket
const server = createServer(app);

// WebSocket server for signaling
const wss = new WebSocketServer({ server, path: '/ws' });

// Store connected users: Map<userId, WebSocket>
const connectedUsers = new Map();

// Store active calls: Map<callId, { callerId, calleeId, status }>
const activeCalls = new Map();

wss.on('connection', (ws) => {
  let userId = null;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'register':
          // User registers their connection
          userId = message.userId;
          connectedUsers.set(userId, ws);
          console.log(`User ${userId} connected`);
          
          // Notify user of their online status
          ws.send(JSON.stringify({ type: 'registered', userId }));
          break;

        case 'call-initiate':
          // User wants to call someone
          const { targetUserId, callerId, callerName, callerAvatar, isVideo } = message;
          const targetWs = connectedUsers.get(targetUserId);
          
          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            const callId = `call-${Date.now()}`;
            activeCalls.set(callId, { 
              callerId, 
              calleeId: targetUserId, 
              status: 'ringing',
              isVideo 
            });
            
            // Notify caller that call is ringing
            ws.send(JSON.stringify({ 
              type: 'call-ringing', 
              callId 
            }));
            
            // Send incoming call to target
            targetWs.send(JSON.stringify({
              type: 'incoming-call',
              callId,
              callerId,
              callerName,
              callerAvatar,
              isVideo
            }));
          } else {
            // Target user is offline
            ws.send(JSON.stringify({ 
              type: 'call-failed', 
              reason: 'User is offline' 
            }));
          }
          break;

        case 'call-accept':
          // Callee accepts the call
          const acceptCallId = message.callId;
          const acceptCall = activeCalls.get(acceptCallId);
          
          if (acceptCall) {
            acceptCall.status = 'connecting';
            const callerWs = connectedUsers.get(acceptCall.callerId);
            
            if (callerWs && callerWs.readyState === WebSocket.OPEN) {
              callerWs.send(JSON.stringify({
                type: 'call-accepted',
                callId: acceptCallId
              }));
            }
          }
          break;

        case 'call-reject':
          // Callee rejects the call
          const rejectCallId = message.callId;
          const rejectCall = activeCalls.get(rejectCallId);
          
          if (rejectCall) {
            const callerWs = connectedUsers.get(rejectCall.callerId);
            if (callerWs && callerWs.readyState === WebSocket.OPEN) {
              callerWs.send(JSON.stringify({
                type: 'call-rejected',
                callId: rejectCallId
              }));
            }
            activeCalls.delete(rejectCallId);
          }
          break;

        case 'call-end':
          // Either party ends the call
          const endCallId = message.callId;
          const endCall = activeCalls.get(endCallId);
          
          if (endCall) {
            // Notify both parties
            const otherUserId = userId === endCall.callerId ? endCall.calleeId : endCall.callerId;
            const otherWs = connectedUsers.get(otherUserId);
            
            if (otherWs && otherWs.readyState === WebSocket.OPEN) {
              otherWs.send(JSON.stringify({
                type: 'call-ended',
                callId: endCallId
              }));
            }
            activeCalls.delete(endCallId);
          }
          break;

        case 'webrtc-offer':
          // Forward WebRTC offer to target
          forwardToUser(message.targetUserId, {
            type: 'webrtc-offer',
            callId: message.callId,
            offer: message.offer,
            fromUserId: userId
          });
          break;

        case 'webrtc-answer':
          // Forward WebRTC answer to caller
          forwardToUser(message.targetUserId, {
            type: 'webrtc-answer',
            callId: message.callId,
            answer: message.answer,
            fromUserId: userId
          });
          break;

        case 'webrtc-ice-candidate':
          // Forward ICE candidate
          forwardToUser(message.targetUserId, {
            type: 'webrtc-ice-candidate',
            callId: message.callId,
            candidate: message.candidate,
            fromUserId: userId
          });
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
    }
  });

  ws.on('close', () => {
    if (userId) {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
      
      // End any active calls involving this user
      for (const [callId, call] of activeCalls.entries()) {
        if (call.callerId === userId || call.calleeId === userId) {
          const otherUserId = call.callerId === userId ? call.calleeId : call.callerId;
          const otherWs = connectedUsers.get(otherUserId);
          
          if (otherWs && otherWs.readyState === WebSocket.OPEN) {
            otherWs.send(JSON.stringify({
              type: 'call-ended',
              callId,
              reason: 'User disconnected'
            }));
          }
          activeCalls.delete(callId);
        }
      }
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

function forwardToUser(targetUserId, message) {
  const targetWs = connectedUsers.get(targetUserId);
  if (targetWs && targetWs.readyState === WebSocket.OPEN) {
    targetWs.send(JSON.stringify(message));
  }
}

// Database Configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_rOI5LYAjEu6g@ep-autumn-frost-a1e4z9ym-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

/**
 * Initialize Database Schema and Seed Data
 */
async function initDb() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      avatar TEXT,
      is_online BOOLEAN DEFAULT false,
      last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Check if last_active_at exists, add if not (for existing databases)
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_active_at') THEN
        ALTER TABLE users ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS conversation_participants (
      conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (conversation_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      is_read BOOLEAN DEFAULT false
    );
  `;

  try {
    console.log('Initializing database schema...');
    await pool.query(schema);

    // Seed initial users if table is empty
    const userCheck = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count) === 0) {
      console.log('Seeding initial users...');
      const seedUsers = [
        ['me', 'alex_v', 'Alex Vardas', 'https://picsum.photos/seed/ops/200', true],
        ['user1', 'michael_v', 'Michael Vance', 'https://picsum.photos/seed/vance/200', true],
        ['user2', 'sthompson', 'Sarah Thompson', 'https://picsum.photos/seed/thompson/200', false],
        ['user3', 'rchen_finance', 'Robert Chen', 'https://picsum.photos/seed/chen/200', true],
        ['user4', 'erossi', 'Elena Rossi', 'https://picsum.photos/seed/rossi/200', false]
      ];

      for (const user of seedUsers) {
        await pool.query(
          'INSERT INTO users (id, username, full_name, avatar, is_online, last_active_at) VALUES ($1, $2, $3, $4, $5, NOW() - interval \'1 hour\')',
          user
        );
      }
      console.log('Seeding complete.');
    }
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
}

// --- API Endpoints ---

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, full_name AS "fullName", avatar, is_online AS "isOnline", EXTRACT(EPOCH FROM last_active_at) * 1000 AS "lastActiveAt" FROM users ORDER BY full_name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Database error fetching users' });
  }
});

// Get online status for signaling
app.get('/api/users/:userId/online', async (req, res) => {
  const { userId } = req.params;
  const isOnline = connectedUsers.has(userId);
  res.json({ userId, isOnline });
});

// Get conversations for a user
app.get('/api/conversations/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `
      SELECT c.id::text, 
             json_agg(DISTINCT jsonb_build_object(
               'id', u.id, 
               'username', u.username, 
               'fullName', u.full_name, 
               'avatar', u.avatar,
               'isOnline', u.is_online,
               'lastActiveAt', EXTRACT(EPOCH FROM u.last_active_at) * 1000
             )) as participants,
             (
               SELECT json_agg(m_data) FROM (
                 SELECT id::text, sender_id AS "senderId", text, 
                 EXTRACT(EPOCH FROM timestamp) * 1000 AS timestamp, 
                 is_read AS "isRead" 
                 FROM messages 
                 WHERE conversation_id = c.id 
                 ORDER BY timestamp ASC
               ) m_data
             ) as messages
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
      JOIN users u ON cp2.user_id = u.id
      WHERE cp.user_id = $1 AND u.id != $1
      GROUP BY c.id
    `;
    const result = await pool.query(query, [userId]);
    const rows = result.rows.map(row => ({
      ...row,
      messages: row.messages || [],
      unreadCount: 0 
    }));
    res.json(rows);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Database error fetching conversations' });
  }
});

// Post a new message
app.post('/api/messages', async (req, res) => {
  const { conversationId, senderId, text } = req.body;
  try {
    const query = 'INSERT INTO messages (conversation_id, sender_id, text) VALUES ($1, $2, $3) RETURNING id::text, sender_id AS "senderId", text, EXTRACT(EPOCH FROM timestamp) * 1000 AS timestamp, is_read AS "isRead"';
    const result = await pool.query(query, [conversationId, senderId, text]);
    
    // Update sender last active
    await pool.query('UPDATE users SET last_active_at = NOW(), is_online = true WHERE id = $1', [senderId]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Create a new conversation
app.post('/api/conversations', async (req, res) => {
  const { participantIds } = req.body;
  try {
    const convResult = await pool.query('INSERT INTO conversations DEFAULT VALUES RETURNING id');
    const conversationId = convResult.rows[0].id;

    for (const oduserId of participantIds) {
      await pool.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)', [conversationId, oduserId]);
    }

    res.status(201).json({ id: conversationId });
  } catch (err) {
    console.error('Error creating conversation:', err);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connectedUsers: connectedUsers.size,
    activeCalls: activeCalls.size
  });
});

// Start initialization then start server
initDb().then(() => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`WebSocket signaling available at ws://localhost:${port}/ws`);
  });
});
