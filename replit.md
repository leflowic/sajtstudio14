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
- **Admin Panel**: Comprehensive management for users, project approvals with audio preview, portfolio, CMS editing, newsletter subscribers, and maintenance mode.
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

## Recent Updates (2025-11-07)
- **Google Search SEO & Favicon Optimization**: Comprehensive SEO improvements for better Google Search visibility:
  - Generated multi-size favicon system (16x16, 32x32, 48x48, 192x192, 512x512, 180x180 Apple, .ico) using Sharp library
  - Created scripts/generate-favicons.ts for reproducible favicon generation from authentic LeFlow emblem logo (attached_assets/icon_1762539841884.png)
  - Updated index.html with complete favicon link tags for all devices and Google Search requirements
  - Implemented bidirectional search keywords: "studio leflow" AND "leflow studio" across all pages (home, contact, projects, team, giveaway)
  - Added alternateNames to structured data JSON-LD: ["LeFlow Studio", "LeFlow", "Studio LeFlow Beograd", "LeFlow Studio Beograd"]
  - Optimized meta description to 157 characters (Google's recommended 155-160 range): "Vrhunski muzički studio u Beogradu. Snimanje, mix/mastering, instrumentali, video spotovi. WA-47, Apollo Twin X, UAD plugins. Preko 5 godina iskustva."
  - Updated title to include both variations: "Studio LeFlow (LeFlow Studio) - Profesionalna Muzička Produkcija Beograd"
  - Changed theme-color from #7c3aed to brand color #4542f5 for consistency
  - Site now discoverable in Google Search via both "Studio LeFlow" and "LeFlow Studio" queries
- **Content Protection System**: Implemented comprehensive image and logo protection across entire site:
  - Added three-layer protection to all images and logos: `draggable={false}`, `select-none` CSS class, and `onContextMenu` prevention
  - Blocks drag/drop, text selection, and right-click context menu (prevents "Open image in new tab")
  - Applied to OptimizedImage component (services, equipment, hero backgrounds)
  - Applied to EditableImage component (CMS-managed images) - click-to-upload functionality preserved in edit mode
  - Applied to logo images in header.tsx and footer.tsx
  - Maintains all existing functionality while preventing unauthorized content copying
- **Hero Background Darkening**: Increased hero overlay opacity to reduce background visibility:
  - Changed from `from-black/30 via-black/30 to-black/30` to `from-black/65 via-black/65 to-black/65`
  - Darker overlay (65%) makes studio panorama background less visible as requested
  - Text readability maintained with higher contrast
- **Equipment Showcase with Real Images**: Redesigned "Studio Oprema" section with Card components featuring real studio equipment photography:
  - 4 equipment items in responsive 2-column grid (md:grid-cols-2, max-w-6xl)
  - Each card includes: OptimizedImage (h-48) + icon + heading + description
  - Real equipment images integrated:
    * Universal Audio Apollo Twin X Duo (/equipment/apollo-twin-duo.jpg) - Thunderbolt interface, Realtime UAD processing
    * Beyerdynamic DT 990 PRO & DT 770 PRO (/equipment/dt990-headphones.jpg) - reference headphones (open/closed)
    * UAD Plugin Suite (/equipment/uad-plugins.jpg) - all original licenses (Neve 1073, Pultec EQ, 1176, LA-2A, Avalon 737)
    * AutoTune RealTime Advanced (/equipment/autotune-uad.jpg) - zero latency live pitch correction
  - Added hover-elevate animation to cards for professional interaction
  - Maintained Headphones and CheckCircle2 icons for visual consistency
  - FadeInWhenVisible animations with staggered delays (0.1-0.4s)
- **Login Page Visual Enhancement**: Replaced AI-generated transparent hero image with real MIDI workstation studio photo on auth-page.tsx (3 instances across login/forgot-password/reset-password views), maintains grayscale + primary gradient overlay
- **"Usluge" Navigation Fix**: Fixed hash navigation bug in header.tsx by using Wouter's setLocation("/#usluge") instead of window.location.href for SPA navigation, added useEffect in home.tsx to detect #usluge hash and smoothly scroll to services section after layout paint (100ms delay)
- **Service Images Optimization**: Re-cropped WA47 microphone and Yamaha HS8 images with wider view (90% width from original, less zoom) for better context visibility - microphone capsule and shock mount more visible, speaker cone and cabinet more prominent
- **Newsletter Subscription System**: Complete newsletter system with double opt-in email confirmation, 5 backend endpoints, admin statistics/export functionality
- **2FA Admin Login During Maintenance**: Two-Factor Authentication for admin login during maintenance mode with 6-digit email codes
- **Maintenance Mode**: Site-wide maintenance control system for administrators
- **Admin Audio Preview for Giveaway Projects**: Integrated HTML5 audio player in pending project cards allowing admins to listen to user-submitted songs before approval, preventing spam/troll submissions with full playback controls (play/pause/seek/volume)