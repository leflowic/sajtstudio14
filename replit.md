# Studio LeFlow - Music Production Studio Website

## Overview
Studio LeFlow is a professional music production studio in Belgrade, Serbia, offering comprehensive music production services including recording, mixing/mastering, instrumental production, and complete song creation. The project aims to establish a dynamic online presence to showcase services, engage users through project giveaways, and provide robust content management for administrators. The ambition is to expand market reach and user base through an interactive and modern website.

## User Preferences
I want iterative development. Ask before making major changes. I prefer detailed explanations.

## System Architecture

### UI/UX Decisions
The website features a modern, responsive design using Tailwind CSS and shadcn/ui components, enhanced by Framer Motion for animations. It incorporates the Studio LeFlow transparent emblem logo with automatic color inversion for dark/light themes. SEO optimization is a key focus, including dynamic meta tags, Open Graph tags, structured data, sitemap, robots.txt, and geo-tags. The UI is primarily in Serbian.

### Technical Implementations
**Frontend:** React 18 with TypeScript, Vite, Tailwind CSS + shadcn/ui, Framer Motion, Wouter for routing, TanStack Query for server state management, React Hook Form + Zod for form validation.
**Backend:** Express.js with TypeScript, Drizzle ORM (PostgreSQL), Passport.js for authentication, Express Session.

### Feature Specifications
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

---

## 🚀 MIGRACIJA NA NOVI REPLIT PROJEKAT

### 📋 Preduslov: Kreiranje Naloga
Potrebni su nalozi na sledećim servisima (koriste se kroz Replit integrations):
1. **Resend** - Email servis (https://resend.com)
   - Besplatni plan: 100 email-ova/dan, 3,000/mesec
   - Potrebno: API Key i verifikovana email adresa
2. **UploadThing** - File upload servis (https://uploadthing.com)
   - Besplatni plan: 2GB storage, 500MB upload/mesec
   - Potrebno: API Token

### 🔧 KORAK 1: Podešavanje Environment Secrets

Nakon kreiranja novog Replit projekta, otvori **Tools → Secrets** i dodaj sledeće:

| Secret Ime | Vrednost | Gde naći |
|------------|----------|----------|
| `RESEND_API_KEY` | `re_xxxxx...` | Resend Dashboard → API Keys → Create API Key |
| `RESEND_FROM_EMAIL` | `noreply@vasadomena.com` | Resend → Domains → Add Domain → Verify DNS |
| `UPLOADTHING_TOKEN` | `sk_live_xxxxx...` | UploadThing Dashboard → API Keys |

**Napomena:** 
- Za development, `RESEND_FROM_EMAIL` može biti `onboarding@resend.dev` (Resend test domen)
- Za production, **obavezno** verifikuj svoju domenu na Resend

### 🗄️ KORAK 2: Kreiranje PostgreSQL Baze

1. U Replit projektu, otvori **Tools → Database**
2. Klikni **Create PostgreSQL Database**
3. `DATABASE_URL` će automatski biti podešen kao secret
4. Pokreni komandu za kreiranje šeme:
   ```bash
   npm run db:push
   ```
5. Baza će biti automatski populisana sa inicijalnim CMS podacima

**Važno:** Nemoj ručno menjati ID tipove u šemi - uvek koristi `npm run db:push --force` ako `db:push` ne radi.

### 📦 KORAK 3: Instalacija Node.js Modula

Projekat koristi Node.js 20. Sve dependencies su definisane u `package.json` i automatski će se instalirati sa:

```bash
npm install
```

**Kritični paketi:**
- **Backend:** express, drizzle-orm, pg, passport, ws, pdfkit, nodemailer
- **Frontend:** react, vite, tailwindcss, @tanstack/react-query, wouter
- **UI Components:** @radix-ui/*, lucide-react, framer-motion
- **Resend/UploadThing:** resend, uploadthing, @uploadthing/react

### 🖼️ KORAK 4: Sistemski Fajlovi

#### A. **DejaVu Sans Font** (za srpske karaktere u PDF-ovima)
Font je već instaliran na Replit serverima na:
```
/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
```
Projekat koristi ovaj font u `server/pdf-generators.ts` za sve PDF ugovore.

**Provera postojanja fonta:**
```bash
ls -la /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
```

#### B. **Studio LeFlow Logo**
Logo se nalazi u:
```
attached_assets/logo/studioleflow-transparent.png
```
Koristi se u:
- PDF ugovorima (gore desno, 120pt širine)
- Frontend komponente (header, footer, CMS)

**Napomena:** Logo mora biti **PNG sa transparentnim background-om** za pravilno renderovanje u PDF-ovima.

### ⚙️ KORAK 5: Workflow Konfiguracija

Projekat ima jedan workflow pod nazivom **"dev"** koji pokreće:
```bash
npm run dev
```

**Šta radi:**
- Startuje Express server na portu 5000
- Pokreće Vite dev server za frontend
- Inicijalizuje WebSocket server za real-time messaging
- Auto-restart pri promeni koda

**Port:** Frontend mora biti vezan na **0.0.0.0:5000** (Vite konfiguracija u `vite.config.ts`).

### 🌐 KORAK 6: Deploy (Publikovanje)

Za deployment na produkciju:

1. **Build Process:**
   ```bash
   npm run build
   ```
   - TypeScript kompajlira u `dist/`
   - Frontend build u `dist/public/`

2. **Deployment Config:**
   - **Type:** `vm` (stateful app zbog WebSocket-a i in-memory cache-a)
   - **Run Command:** `npm start`
   - **Port:** 5000

3. **Production Secrets:**
   Sync-uj Production secrets sa Development secrets:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (mora biti verifikovana domena)
   - `UPLOADTHING_TOKEN`
   - `DATABASE_URL` (automatski od Replit-a)

4. **Domain Setup:**
   - Dodaj custom domain u Replit Deployments
   - Verifikuj DNS zapise na Resend za email slanje

### 📁 KORAK 7: Struktura Direktorijuma

```
Studio-LeFlow/
├── server/               # Backend Express aplikacija
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # Database interface (Drizzle)
│   ├── pdf-generators.ts # Contract PDF generators (3 tipa)
│   ├── resend-client.ts # Email sending wrapper
│   └── vite.ts          # Vite dev server integration
├── client/src/          # Frontend React aplikacija
│   ├── App.tsx          # Router i layout
│   ├── pages/           # Stranice (home, admin, poruke, itd.)
│   ├── components/      # Reusable komponente
│   └── lib/             # Utilities (queryClient, utils)
├── shared/              # Shared TypeScript tipovi
│   └── schema.ts        # Drizzle schema + Zod validation
├── attached_assets/     # Uploadovani fajlovi
│   ├── logo/            # Studio LeFlow logo (transparent PNG)
│   ├── contracts/       # Generisani PDF ugovori
│   ├── cms/             # CMS slike (hero, tim, itd.)
│   └── stock_images/    # Stock images (ako korišćene)
├── public/              # Statički fajlovi (favicon, robots.txt)
├── package.json         # Dependencies
├── vite.config.ts       # Vite config (aliases, server)
├── tailwind.config.ts   # Tailwind CSS config
└── drizzle.config.ts    # Drizzle ORM config
```

### 🔐 KORAK 8: Prvi Admin Nalog

**Automatski Admin Seed:**
Prilikom pokretanja, ako nema admin naloga, kreiraj ga ručno kroz database:

```sql
INSERT INTO "User" (username, email, password, role, "isVerified", "createdAt")
VALUES (
  'admin',
  'admin@studioleflow.com',
  -- Generiši hash sa: node -e "crypto.scrypt('tvoja_lozinka', 'salt', 64, (e,b) => console.log(b.toString('base64')))"
  'hashed_password_ovde',
  'admin',
  true,
  NOW()
);
```

**Ili koristi Replit Database UI:**
1. Tools → Database → Execute Query
2. Koristi gornji SQL sa pravim hash-om lozinke

### ✅ KORAK 9: Verifikacija

Nakon migracije, proveri sledeće:

- [ ] Workflow "dev" se pokreće bez grešaka
- [ ] Frontend se učitava na `https://your-project.replit.app`
- [ ] Admin panel pristupačan na `/admin` (login sa test nalogom)
- [ ] Contract Builder generiše PDF sa logom i srpskim karakterima
- [ ] Email slanje radi (test sa "Pošalji Email" dugmetom u Contracts tab-u)
- [ ] File upload radi (UploadThing za avatare/MP3)
- [ ] WebSocket messaging radi (real-time poruke)
- [ ] Database connection aktivan (proveri u admin panelu korisnici/ugovori)

### 🆘 Troubleshooting

**Problem:** Email se ne šalje
- **Rešenje:** Proveri `RESEND_FROM_EMAIL` - mora biti verifikovana domena ili `onboarding@resend.dev`

**Problem:** PDF nema srpske karaktere
- **Rešenje:** Proveri da postoji `/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf`

**Problem:** Logo ne prikazuje u PDF-u
- **Rešenje:** Proveri da `attached_assets/logo/studioleflow-transparent.png` postoji

**Problem:** File upload ne radi
- **Rešenje:** Proveri `UPLOADTHING_TOKEN` u secrets

**Problem:** Database greška pri push
- **Rešenje:** Koristi `npm run db:push --force` umesto samo `db:push`

---

## 📊 Contract Builder System (Najnoviji Feature)

### Tipovi Ugovora
1. **Mix & Master Ugovor** - Za usluge miksa i masteringa
2. **Prenos Autorskih Prava** - Copyright transfer agreement
3. **Prodaja Instrumentala** - Beat sale agreement

### PDF Features
- **Font:** DejaVu Sans za potpunu podršku srpskih karaktera (š, č, ć, ž, đ)
- **Logo:** Studio LeFlow transparent emblem (gore desno, 120pt širine)
- **Filename Format:** `ugovor_001_2025_AleksaComor.pdf` (uključuje ime klijenta)
- **Automatic Numbering:** Format `XXX/YYYY` (001/2025, 002/2025, itd.)
- **Storage:** Svi PDF-ovi u `attached_assets/contracts/`

### Admin Panel Features
- Generisanje ugovora kroz formu (sva polja validirana sa Zod)
- Preview generisanih ugovora (inline PDF viewer)
- Download PDF fajlova
- Slanje PDF-ova na email sa profesionalnim template-om
- Brisanje ugovora (briše i PDF fajl)
- Istorija svih generisanih ugovora sa filterima

### Email Template
Profesionalan HTML email template sa:
- Studio LeFlow branding (logo placeholder - može se dodati kasnije)
- Responsive dizajn
- Attachment: Generisani PDF ugovor sa imenom klijenta
- Footer sa info i disclaimer

### Technical Implementation
- **Backend:** `server/pdf-generators.ts` - 3 odvojena PDF generatora
- **API Endpoints:** 5 endpointa u `server/routes.ts` (generate, list, download, email, delete)
- **Database:** `Contract` tabela u `shared/schema.ts`
- **Frontend:** `client/src/components/admin/ContractsTab.tsx` - kompletna admin UI
- **Email:** `server/resend-client.ts` - Resend integration sa attachment podrškom

---

## 🎯 Post-Migration Checklist

Nakon uspešne migracije:

1. **SEO Optimizacija:**
   - [ ] Ažuriraj `public/sitemap.xml` sa novim domenom
   - [ ] Proveri `public/robots.txt`
   - [ ] Ažuriraj Open Graph tags u CMS-u

2. **Email Setup:**
   - [ ] Verifikuj custom domain na Resend (za production)
   - [ ] Testiraj sve email flowove (verifikacija, reset, kontakt, ugovori)

3. **Content Migration:**
   - [ ] Uploaduj CMS slike (hero, tim, portfolio)
   - [ ] Popuni Portfolio projekata (YouTube embed-ovi)
   - [ ] Ažuriraj About/Usluge text content

4. **Security:**
   - [ ] Promeni default admin lozinku
   - [ ] Omogući 2FA za admin nalog
   - [ ] Proveri CORS settings (ako koristiš custom domain)

5. **Performance:**
   - [ ] Proveri Core Web Vitals (Lighthouse)
   - [ ] Optimizuj slike (compression)
   - [ ] Test load time na produkciji

6. **Backup:**
   - [ ] Export database backup (Replit Database UI)
   - [ ] Backup CMS slika i PDF-ova iz `attached_assets/`

---

**Napomena:** Ovaj dokument će biti ažuriran sa svakom novom feature implementacijom.