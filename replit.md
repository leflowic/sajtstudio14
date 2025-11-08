# Studio LeFlow - Music Production Studio Website

## Overview
Studio LeFlow is a professional music production studio in Belgrade, Serbia, offering comprehensive music production services. The project aims to establish a dynamic online presence to showcase services, engage users through project giveaways, and provide robust content management for administrators. The platform supports recording, mixing/mastering, instrumental production, and complete song creation, with the ambition to expand its market reach and user base through an interactive and modern website.

## User Preferences
I want iterative development. Ask before making major changes. I prefer detailed explanations.

## System Architecture

### UI/UX Decisions
The website features a modern, responsive design using Tailwind CSS and shadcn/ui components, enhanced by Framer Motion for animations. It incorporates the Studio LeFlow transparent emblem logo with automatic color inversion for dark/light themes. SEO optimization is a key focus, including dynamic meta tags, Open Graph tags, structured data, sitemap, robots.txt, and geo-tags. The UI is primarily in Serbian.

### Technical Implementations
**Frontend:** React 18 with TypeScript, Vite, Tailwind CSS + shadcn/ui, Framer Motion, Wouter for routing, TanStack Query for server state management, React Hook Form + Zod for form validation.
**Backend:** Express.js with TypeScript, Drizzle ORM (PostgreSQL), Passport.js for authentication, Express Session.

### Feature Specifications
- **CMS Content Management**: Inline editing for text, image uploads, and team member management, activated via an "Izmeni Sajt" toggle.
- **User Authentication**: Email/password authentication with verification, including 2FA for admin login during maintenance.
- **Real-Time Messaging System**: Full-featured messaging with real-time updates, admin oversight, and legal compliance (Terms of Service and Privacy notices on auth pages).
- **Project Giveaways**: Monthly project uploads, a voting system, and admin approval with audio preview.
- **Portfolio (Projekti Page)**: Showcase studio work with YouTube embeds, managed by admins.
- **Contact Form**: Direct email notifications.
- **File Uploads**: MP3 files for projects, images for CMS.
- **Admin Panel**: Comprehensive management for users, project approvals, portfolio, CMS editing, newsletter subscribers, and maintenance mode. Includes a "Poruke" tab for conversation oversight and audit logs.
- **Newsletter System**: Double opt-in email confirmation with admin management, statistics, and campaign sending capabilities using a rich text editor.
- **Password Management**: Secure forgot/reset password flows with email verification codes.
- **Maintenance Mode**: Site-wide control for administrators, allowing admin access while the public sees a maintenance page.
- **Content Protection**: Three-layer protection on all images and logos to prevent drag/drop, text selection, and right-click context menu.
- **Google Search SEO & Favicon Optimization**: Comprehensive SEO improvements including multi-size favicons, optimized meta descriptions, titles, and structured data with bidirectional keywords.

### System Design Choices
- **Database**: PostgreSQL managed by Replit, utilizing Drizzle ORM for schema management across various entities (users, projects, votes, comments, CMS content, settings, newsletter subscribers, messaging data).
- **Performance**: Optimized for Core Web Vitals (LCP) through lazy loading, prioritized image fetching, async font loading, server compression, and Vite build optimizations.
- **Language**: All UI and content are primarily in Serbian.
- **Security**: Implements case-insensitive email/username lookups, banned user authorization, robust password hashing (Node.js scrypt), and security measures for the messaging system (verified email required, admin audit logging).

## External Dependencies
- **PostgreSQL**: Replit managed database for all persistent data.
- **Resend**: Email service for user verification, password resets, contact form notifications, and newsletter confirmations.
- **UploadThing**: File upload service for MP3 files (max 16MB per file).

## Recent Updates (2025-11-08)

### Real-Time Messaging System - IMPLEMENTATION COMPLETE
Complete messaging infrastructure with real-time updates, admin oversight, and legal compliance.

**Database Layer (Verified ✅):**
- 4 tables: `conversations`, `messages`, `message_reads`, `admin_message_audit`
- PostgreSQL trigger `enforce_canonical_conversation_users()` - automatically swaps user IDs to maintain canonical order (user1_id < user2_id), preventing duplicate conversations
- 5 performance indexes for real-time queries
- Trigger verified via SQL test: INSERT (25,24) → auto-corrected to (24,25)

**Backend API (11 endpoints):**
- User Messaging: GET /api/users/search, GET /api/conversations, GET /api/messages/conversation/:userId, POST /api/messages/send, PUT /api/messages/mark-read, GET /api/messages/unread-count, DELETE /api/messages/:id
- Admin Oversight: GET /api/admin/messages/conversations, GET /api/admin/messages/conversation/:user1Id/:user2Id (auto-logs audit), DELETE /api/admin/messages/:id, GET /api/admin/messages/audit-logs
- Middleware: `requireVerifiedEmail` on all messaging endpoints (only verified users can access)

**WebSocket Server (path: /api/ws):**
- Real-time message delivery (new_message events)
- Typing indicators (typing_start/typing_stop with 5s auto-timeout)
- Online/offline status tracking (Map<userId, Set<WebSocket>>)
- Message read receipts (message_read events broadcast)
- Multi-device support (Set<WebSocket> per user)
- Authentication via initial 'auth' message with userId

**Frontend Components:**
- `/inbox` page - Split responsive layout (conversation list left, chat interface right)
- `UserSearch` component - Debounced search (300ms) with autocomplete dropdown
- `ConversationList` component - Real-time updates, unread badges, last message preview (50 chars), formatted timestamps
- `ChatInterface` component - Message bubbles (own/other styling), typing indicator, read receipts (✓ unread, ✓✓ read), auto-scroll, textarea with Enter-to-send
- `useWebSocket` hook - WebSocket client with auto-reconnect (3s timeout), subscribe pattern for message listeners

**Admin Panel - "Poruke" Tab:**
- Conversation list showing all user conversations with message counts
- Message viewer displaying full conversation between any two users
- Delete message functionality with AlertDialog confirmation
- Audit log section tracking all admin conversation views (timestamp, admin username, viewed users)
- Auto-logging when admin opens conversation viewer (compliance tracking)

**Notification Badge:**
- Header MessageCircle icon with destructive badge showing unread count
- Real-time updates via WebSocket (invalidates query on new_message/message_read)
- Displays "9+" for counts > 9
- Only visible for email-verified users
- Refetches every 30 seconds + WebSocket instant updates

**Legal Compliance:**
- Mandatory Terms of Service checkbox on registration: "Prihvatam uslove korišćenja. Administrator može pristupiti privatnim porukama u svrhu bezbednosti."
- Privacy notice on login and registration: "Napomena: Privatne poruke mogu biti regulisane od strane administratora u svrhu bezbednosti i moderacije."
- Frontend validation (React Hook Form + Zod) + backend validation (insertUserSchema) requiring termsAccepted = true
- Alert component with AlertTriangle icon for visibility on auth pages

**Security Features:**
- requireVerifiedEmail middleware blocks unverified users (403 Forbidden)
- Users can only delete their own messages
- Admin audit logging for compliance (tracks all conversation views)
- Canonical conversation ordering prevents duplicate (A,B)/(B,A) conversations
- Banned user checks on message sending
- SQL injection protection via Drizzle ORM parameterized queries

**Verification Evidence:**
- Database schema confirmed via SQL query (all 4 tables exist)
- PostgreSQL trigger tested and working (canonical ordering verified)
- Authentication tested (registration + login successful)
- Authorization middleware tested (403 for unverified users, 200 for verified)
- GET /api/conversations tested (200 OK, returns empty array)
- WebSocket connection tested (successful connection to /api/ws)

**Testing Status:**
- ✅ Database layer verified (tables, trigger, indexes)
- ✅ Authentication & authorization verified
- ✅ Basic API endpoints verified (conversations, user search validation)
- ✅ WebSocket connection verified
- ⚠️ Full end-to-end messaging flow requires manual browser testing (send/receive messages, typing indicators, read receipts, file uploads)
- ⚠️ Admin panel messaging features require manual browser testing

**Files Modified:**
- Backend: `shared/schema.ts` (4 new tables, insertUserSchema update), `server/seed.ts` (trigger creation), `server/storage.ts` (14 messaging methods), `server/routes.ts` (11 API endpoints + requireVerifiedEmail middleware), `server/index.ts` (WebSocket server on /api/ws)
- Frontend: `client/src/pages/inbox.tsx`, `client/src/components/messaging/` (UserSearch.tsx, ConversationList.tsx, ChatInterface.tsx), `client/src/hooks/use-websocket.ts`, `client/src/pages/admin.tsx` (Poruke tab), `client/src/components/layout/header.tsx` (notification badge)
- Auth: `client/src/pages/auth-page.tsx` (Terms checkbox + privacy notices)