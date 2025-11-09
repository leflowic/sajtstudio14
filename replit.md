# Studio LeFlow - Music Production Studio Website

## Overview
Studio LeFlow is a professional music production studio in Belgrade, Serbia, offering comprehensive music production services including recording, mixing/mastering, instrumental production, and complete song creation. The project aims to establish a dynamic online presence to showcase services, engage users through project giveaways, and provide robust content management for administrators. The ambition is to expand market reach and user base through an interactive and modern website, reaching a broader audience and increasing user engagement.

## User Preferences
I want iterative development. Ask before making major changes. I prefer detailed explanations.

## System Architecture

### UI/UX Decisions
The website features a modern, responsive design using Tailwind CSS and shadcn/ui components, enhanced by Framer Motion for animations. It incorporates the Studio LeFlow transparent emblem logo with automatic color inversion for dark/light themes. SEO optimization is a key focus, including dynamic meta tags, Open Graph tags, structured data, sitemap, robots.txt, and geo-tags. The UI is primarily in Serbian.

### Technical Implementations
**Frontend:** React 18 with TypeScript, Vite, Tailwind CSS + shadcn/ui, Framer Motion, Wouter for routing, TanStack Query for server state management, React Hook Form + Zod for form validation.
**Backend:** Express.js with TypeScript, Drizzle ORM (PostgreSQL), Passport.js for authentication, Express Session.
**Features:**
- **CMS Content Management**: Inline editing for text, image uploads, and team member management.
- **User Authentication**: Email/password authentication with verification, including 2FA for admin login.
- **Real-Time Messaging System**: Full-featured messaging with real-time updates, admin oversight, and legal compliance.
- **Project Giveaways**: Monthly project uploads, voting system, and admin approval with audio preview.
- **Portfolio (Projekti Page)**: Showcase studio work with YouTube embeds.
- **Contact Form**: Direct email notifications.
- **File Uploads**: MP3 files for projects, images for CMS and user avatars.
- **Admin Panel**: Comprehensive management for users, project approvals, portfolio, CMS editing, newsletter subscribers, and maintenance mode. Includes messaging oversight and audit logs.
- **Newsletter System**: Double opt-in email confirmation with admin management and campaign sending.
- **Password Management**: Secure forgot/reset password flows.
- **Maintenance Mode**: Site-wide control for administrators.
- **Content Protection**: Three-layer protection on all images and logos.
- **Google Search SEO & Favicon Optimization**: Comprehensive SEO improvements.
- **User Profile Pictures**: Avatar management with upload, deletion, and dynamic initials display.
- **Contract Builder System**: Generates three types of contracts (Mix & Master, Copyright Transfer, Instrumental Sale) with PDF features like DejaVu Sans font support for Serbian characters, Studio LeFlow logo, automatic numbering, and storage. Admin panel features include contract generation via form, preview, download, email sending, deletion, history tracking, and **user assignment with async search** (admins can assign/unassign contracts to users using a searchable Command/Combobox interface with debouncing, loading states, and keyboard navigation; users then see assigned contracts in their dashboard).
- **User Song Sharing & Voting (Zajednica)**: Public community page (/zajednica) where users can share their favorite songs via YouTube links. Features include admin approval workflow, community voting system with atomic vote tracking, unique vote constraints (one vote per user per song), vote count display, and songs sorted by popularity. Only verified users can vote.
- **4-Tier Rank System & Community Chat**: Cosmetic rank system (User, VIP, Legend, Admin) with colored usernames and badge icons. Global community chat with real-time WebSocket updates, 10-second rate limiting, auto-scroll, delete authorization (owner + admin), and admin rank control. Chat features countdown timer, form auto-reset after sending, and unconditional query synchronization. Integrated in /zajednica page for real-time community engagement.
- **Progressive Web App (PWA)**: Full PWA support for iOS and Android devices. Features include installable app experience via "Add to Home Screen", offline support with service worker caching, standalone display mode (full-screen without browser UI), auto-updating content, iOS-specific install prompt with clear instructions, and manifest with app icons and branding. Users can access Studio LeFlow as a native-like app without downloading from App Store.

### System Design Choices
- **Database**: PostgreSQL managed by Replit, utilizing Drizzle ORM for schema management.
- **Performance**: Optimized for Core Web Vitals (LCP) through lazy loading, prioritized image fetching, async font loading, server compression, and Vite build optimizations.
  - **Vite Build Configuration**: Uses `splitVendorChunkPlugin()` with `modulePreload: { polyfill: true }` to ensure proper chunk loading order and prevent React initialization errors. Vendor bundle optimized to ~446KB (down from 1.1MB).
  - **Bundle Analysis**: Integrated `rollup-plugin-visualizer` for ongoing performance monitoring.
  - **CSS Page Transitions**: Replaced Framer Motion AnimatePresence in App.tsx with lightweight `.page-transition` CSS class (fade-in animation) for improved performance and accessibility (prefers-reduced-motion support).
  - **TipTap Lazy Loading**: RichTextEditor component (TipTap) lazy loaded with React.lazy() and Suspense in admin panel. Reduced admin bundle from 455KB → 99KB (78% reduction). TipTap now loads in separate 356KB chunk only when admin opens Newsletter tab.
  - **Asset Optimization**: Removed 90MB of unused images from attached_assets folder (Apollo Twin 18MB, AutoTune 11MB, etc). Folder reduced from 107MB → 17MB (84% reduction).
- **Language**: All UI and content are primarily in Serbian.
- **Security**: Implements case-insensitive email/username lookups, banned user authorization, robust password hashing (Node.js scrypt), and security measures for messaging.
- **Messaging UI**: User's own messages appear on the left (gray/muted), other user's messages appear on the right (blue/primary).
- **Deployment**: Production builds use Vite's default modulePreload system to guarantee correct chunk execution order. All routes use lazy loading for code splitting.

## External Dependencies
- **PostgreSQL**: Replit managed database for all persistent data.
- **Resend**: Email service for user verification, password resets, contact form notifications, newsletter confirmations, and contract delivery.
- **UploadThing**: File upload service for MP3 files and user avatars.