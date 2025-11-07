# Studio LeFlow - Music Production Studio Website

## Overview
Studio LeFlow is a professional music production studio based in Belgrade, Serbia, offering comprehensive music production services. The project aims to establish a dynamic online presence with a focus on showcasing services, engaging users through project giveaways, and providing robust content management for administrators. The platform supports recording, mixing/mastering, instrumental production, and complete song creation, aspiring to expand its market reach and user base through an interactive and modern website.

## User Preferences
I want iterative development. Ask before making major changes. I prefer detailed explanations.

## System Architecture

### UI/UX Decisions
The website features a modern, responsive design using Tailwind CSS and shadcn/ui components, enhanced by Framer Motion for animations and smooth transitions. It incorporates the Studio LeFlow transparent emblem logo with automatic color inversion for dark/light themes. SEO optimization is a key focus, including dynamic meta tags, Open Graph tags, structured data, sitemap, robots.txt, and geo-tags. The UI is primarily in Serbian.

### Technical Implementations
**Frontend:** React 18 with TypeScript, Vite, Tailwind CSS + shadcn/ui, Framer Motion, Wouter for routing, TanStack Query for server state management, React Hook Form + Zod for form validation.
**Backend:** Express.js with TypeScript, Drizzle ORM (PostgreSQL), Passport.js for authentication, Express Session.

### Feature Specifications
- **CMS Content Management**: Inline editing for text, image uploads, and team member management, activated via an "Izmeni Sajt" toggle.
- **User Authentication**: Email/password authentication with verification, including 2FA for admin login during maintenance.
- **Project Giveaways**: Monthly project uploads, a voting system, and admin approval.
- **Portfolio (Projekti Page)**: Showcase studio work with YouTube embeds, managed by admins.
- **Contact Form**: Direct email notifications.
- **File Uploads**: MP3 files for projects, images for CMS.
- **Admin Panel**: Comprehensive management for users, project approvals, portfolio, CMS editing, newsletter subscribers, and maintenance mode.
- **Newsletter System**: Double opt-in email confirmation with admin management and statistics.
- **Password Management**: Secure forgot/reset password flows with email verification codes.
- **Maintenance Mode**: Site-wide control for administrators, allowing admin access while the public sees a maintenance page.

### System Design Choices
- **Database**: PostgreSQL managed by Replit, utilizing Drizzle ORM for schema management across various entities (users, projects, votes, comments, CMS content, settings, newsletter subscribers).
- **Performance**: Optimized for Core Web Vitals (especially LCP) through lazy loading, prioritized image fetching, async font loading, server compression, and Vite build optimizations.
- **Language**: All UI and content are primarily in Serbian.
- **Security**: Implements case-insensitive email/username lookups, banned user authorization, and robust password hashing using Node.js scrypt.

## External Dependencies
- **PostgreSQL**: Replit managed database for all persistent data.
- **Resend**: Email service for user verification, password resets, contact form notifications, and newsletter confirmations.
- **UploadThing**: File upload service for MP3 files (max 16MB per file).