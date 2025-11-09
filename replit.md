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

### System Design Choices
- **Database**: PostgreSQL managed by Replit, utilizing Drizzle ORM for schema management.
- **Performance**: Optimized for Core Web Vitals (LCP) through lazy loading, prioritized image fetching, async font loading, server compression, and Vite build optimizations.
- **Language**: All UI and content are primarily in Serbian.
- **Security**: Implements case-insensitive email/username lookups, banned user authorization, robust password hashing (Node.js scrypt), and security measures for messaging.
- **Messaging UI**: User's own messages appear on the left (gray/muted), other user's messages appear on the right (blue/primary).

## External Dependencies
- **PostgreSQL**: Replit managed database for all persistent data.
- **Resend**: Email service for user verification, password resets, contact form notifications, newsletter confirmations, and contract delivery.
- **UploadThing**: File upload service for MP3 files and user avatars.