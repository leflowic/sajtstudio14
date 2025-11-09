var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminMessageAudit: () => adminMessageAudit,
  cmsContent: () => cmsContent,
  cmsContentTypes: () => cmsContentTypes,
  cmsMedia: () => cmsMedia,
  cmsPages: () => cmsPages,
  cmsSections: () => cmsSections,
  comments: () => comments,
  commentsRelations: () => commentsRelations,
  contactSubmissions: () => contactSubmissions,
  contracts: () => contracts,
  conversations: () => conversations,
  conversationsRelations: () => conversationsRelations,
  copyrightTransferContractDataSchema: () => copyrightTransferContractDataSchema,
  insertCmsContentSchema: () => insertCmsContentSchema,
  insertCmsMediaSchema: () => insertCmsMediaSchema,
  insertCommentSchema: () => insertCommentSchema,
  insertContactSubmissionSchema: () => insertContactSubmissionSchema,
  insertContractSchema: () => insertContractSchema,
  insertInvoiceSchema: () => insertInvoiceSchema,
  insertMessageSchema: () => insertMessageSchema,
  insertNewsletterSubscriberSchema: () => insertNewsletterSubscriberSchema,
  insertPendingUserSchema: () => insertPendingUserSchema,
  insertProjectSchema: () => insertProjectSchema,
  insertRegistrationAttemptSchema: () => insertRegistrationAttemptSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserSongSchema: () => insertUserSongSchema,
  insertVideoSpotSchema: () => insertVideoSpotSchema,
  instrumentalSaleContractDataSchema: () => instrumentalSaleContractDataSchema,
  invoiceStatusEnum: () => invoiceStatusEnum,
  invoices: () => invoices,
  messageReads: () => messageReads,
  messageReadsRelations: () => messageReadsRelations,
  messages: () => messages,
  messagesRelations: () => messagesRelations,
  mixMasterContractDataSchema: () => mixMasterContractDataSchema,
  newsletterSubscribers: () => newsletterSubscribers,
  normalizeConversationUsers: () => normalizeConversationUsers,
  pendingUsers: () => pendingUsers,
  projectStatusEnum: () => projectStatusEnum,
  projects: () => projects,
  projectsRelations: () => projectsRelations,
  registrationAttempts: () => registrationAttempts,
  session: () => session,
  settings: () => settings,
  userSongVotes: () => userSongVotes,
  userSongs: () => userSongs,
  users: () => users,
  usersRelations: () => usersRelations,
  videoSpots: () => videoSpots,
  votes: () => votes,
  votesRelations: () => votesRelations
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial, integer, boolean, unique, json, index, pgEnum, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
function normalizeConversationUsers(userId1, userId2) {
  return userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
}
var projectStatusEnum, invoiceStatusEnum, session, contactSubmissions, insertContactSubmissionSchema, users, pendingUsers, registrationAttempts, projects, votes, comments, settings, cmsPages, cmsSections, cmsContentTypes, cmsContent, cmsMedia, videoSpots, userSongs, userSongVotes, newsletterSubscribers, conversations, messages, messageReads, adminMessageAudit, usersRelations, projectsRelations, votesRelations, commentsRelations, conversationsRelations, messagesRelations, messageReadsRelations, insertUserSchema, insertPendingUserSchema, insertRegistrationAttemptSchema, insertProjectSchema, insertCommentSchema, insertCmsContentSchema, insertCmsMediaSchema, insertVideoSpotSchema, insertUserSongSchema, insertNewsletterSubscriberSchema, insertMessageSchema, contracts, insertContractSchema, mixMasterContractDataSchema, copyrightTransferContractDataSchema, instrumentalSaleContractDataSchema, invoices, insertInvoiceSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    projectStatusEnum = pgEnum("project_status", ["waiting", "in_progress", "completed", "cancelled"]);
    invoiceStatusEnum = pgEnum("invoice_status", ["pending", "paid", "overdue", "cancelled"]);
    session = pgTable("session", {
      sid: varchar("sid").primaryKey(),
      sess: json("sess").notNull(),
      expire: timestamp("expire").notNull()
    });
    contactSubmissions = pgTable("contact_submissions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      email: text("email").notNull(),
      phone: text("phone").notNull(),
      service: text("service").notNull(),
      preferredDate: text("preferred_date"),
      message: text("message").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
      id: true,
      createdAt: true
    }).extend({
      email: z.string().email("Unesite validnu email adresu"),
      phone: z.string().min(6, "Unesite validan broj telefona"),
      name: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
      message: z.string().min(10, "Poruka mora imati najmanje 10 karaktera"),
      service: z.string().min(1, "Izaberite uslugu")
    });
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      email: text("email").notNull().unique(),
      password: text("password").notNull(),
      username: text("username").notNull().unique(),
      role: text("role").notNull().default("user"),
      // "user" or "admin"
      banned: boolean("banned").notNull().default(false),
      termsAccepted: boolean("terms_accepted").notNull().default(false),
      emailVerified: boolean("email_verified").notNull().default(false),
      verificationCode: text("verification_code"),
      passwordResetToken: text("password_reset_token"),
      passwordResetExpiry: timestamp("password_reset_expiry"),
      adminLoginToken: text("admin_login_token"),
      adminLoginExpiry: timestamp("admin_login_expiry"),
      usernameLastChanged: timestamp("username_last_changed"),
      avatarUrl: text("avatar_url"),
      lastSeen: timestamp("last_seen"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    pendingUsers = pgTable("pending_users", {
      id: serial("id").primaryKey(),
      email: text("email").notNull().unique(),
      password: text("password").notNull(),
      // Pre-hashed password
      username: text("username").notNull().unique(),
      verificationCode: text("verification_code").notNull(),
      ipAddress: text("ip_address").notNull(),
      userAgent: text("user_agent"),
      // For fraud detection heuristics
      termsAccepted: boolean("terms_accepted").notNull(),
      // No default - must be explicitly submitted
      createdAt: timestamp("created_at").defaultNow().notNull(),
      expiresAt: timestamp("expires_at").notNull()
      // Auto-delete after 24 hours
    }, (table) => ({
      // Composite index for faster cleanup queries
      emailExpiresIdx: index("pending_users_email_expires_idx").on(table.email, table.expiresAt)
    }));
    registrationAttempts = pgTable("registration_attempts", {
      id: serial("id").primaryKey(),
      ipAddress: text("ip_address").notNull(),
      attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
      email: text("email"),
      // Track which email was attempted for fraud detection
      userAgent: text("user_agent")
      // For bot detection
    }, (table) => ({
      // Composite index for sliding-window rate limit queries
      ipAttemptedIdx: index("registration_attempts_ip_attempted_idx").on(table.ipAddress, table.attemptedAt),
      // Email index for fraud detection (same IP trying multiple emails)
      emailIdx: index("registration_attempts_email_idx").on(table.email)
    }));
    projects = pgTable("projects", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      genre: text("genre").notNull(),
      mp3Url: text("mp3_url").notNull(),
      userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      uploadDate: timestamp("upload_date").defaultNow().notNull(),
      votesCount: integer("votes_count").notNull().default(0),
      currentMonth: text("current_month").notNull(),
      // e.g., "2025-01" to track monthly limit
      approved: boolean("approved").notNull().default(false),
      // Admin must approve before project is visible
      status: projectStatusEnum("status").notNull().default("waiting")
    });
    votes = pgTable("votes", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
      ipAddress: text("ip_address").notNull(),
      votedAt: timestamp("voted_at").defaultNow().notNull()
    }, (table) => ({
      // Prevent duplicate votes: user can only vote once per project
      uniqueUserProject: unique().on(table.userId, table.projectId),
      // Also prevent same IP from voting multiple times on same project
      uniqueIpProject: unique().on(table.ipAddress, table.projectId)
    }));
    comments = pgTable("comments", {
      id: serial("id").primaryKey(),
      projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
      userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      text: text("text").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    settings = pgTable("settings", {
      id: serial("id").primaryKey(),
      key: text("key").notNull().unique(),
      value: text("value").notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    cmsPages = ["home", "team"];
    cmsSections = ["hero", "services", "equipment", "cta", "members"];
    cmsContentTypes = ["text", "image", "html"];
    cmsContent = pgTable("cms_content", {
      id: serial("id").primaryKey(),
      page: text("page").notNull(),
      // "home", "team"
      section: text("section").notNull(),
      // "hero", "services", "equipment", "cta", "members"
      contentKey: text("content_key").notNull(),
      // unique identifier e.g. "hero_title", "service_1_title"
      contentValue: text("content_value").notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (table) => ({
      // Unique constraint: one value per page+section+key combination
      uniquePageSectionKey: unique().on(table.page, table.section, table.contentKey)
    }));
    cmsMedia = pgTable("cms_media", {
      id: serial("id").primaryKey(),
      page: text("page").notNull(),
      // "home", "team"
      section: text("section").notNull(),
      // "hero", "services", "equipment", "members"
      assetKey: text("asset_key").notNull(),
      // e.g., "hero_background", "team_member_1"
      filePath: text("file_path").notNull(),
      // relative path: "attached_assets/cms/home/hero_bg.png"
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    }, (table) => ({
      // Unique constraint: one image per page+section+assetKey combination
      uniquePageSectionAsset: unique().on(table.page, table.section, table.assetKey)
    }));
    videoSpots = pgTable("video_spots", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      artist: text("artist").notNull(),
      youtubeUrl: text("youtube_url").notNull(),
      order: integer("order").notNull().default(0),
      // for custom ordering
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    userSongs = pgTable("user_songs", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      songTitle: text("song_title").notNull(),
      artistName: text("artist_name").notNull(),
      youtubeUrl: text("youtube_url").notNull().unique(),
      // Duplicate protection
      submittedAt: timestamp("submitted_at").defaultNow().notNull(),
      approved: boolean("approved").notNull().default(false),
      // Admin must approve
      votesCount: integer("votes_count").notNull().default(0)
      // Cached vote count for sorting
    }, (table) => ({
      // Index for efficient rate limiting queries (find user's last submission)
      userSubmittedIdx: index("user_songs_user_submitted_idx").on(table.userId, table.submittedAt),
      // Index for fetching approved songs
      approvedIdx: index("user_songs_approved_idx").on(table.approved),
      // Index for sorting by votes
      votesCountIdx: index("user_songs_votes_count_idx").on(table.votesCount)
    }));
    userSongVotes = pgTable("user_song_votes", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      songId: integer("song_id").notNull().references(() => userSongs.id, { onDelete: "cascade" }),
      votedAt: timestamp("voted_at").defaultNow().notNull()
    }, (table) => ({
      // Prevent duplicate votes: user can only vote once per song
      uniqueUserSong: unique().on(table.userId, table.songId),
      // Performance index for counting votes per song
      songIdx: index("user_song_votes_song_idx").on(table.songId)
    }));
    newsletterSubscribers = pgTable("newsletter_subscribers", {
      id: serial("id").primaryKey(),
      email: text("email").notNull().unique(),
      status: text("status").notNull().default("pending"),
      // "pending", "confirmed", "unsubscribed"
      confirmationToken: text("confirmation_token"),
      confirmedAt: timestamp("confirmed_at"),
      subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
      unsubscribedAt: timestamp("unsubscribed_at")
    });
    conversations = pgTable("conversations", {
      id: serial("id").primaryKey(),
      user1Id: integer("user1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      user2Id: integer("user2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (table) => ({
      // Ensure unique conversation between two users (works ONLY if application normalizes IDs)
      uniqueUsers: unique().on(table.user1Id, table.user2Id),
      // Performance index for sorting conversations by last message
      lastMessageIdx: index("conversations_last_message_idx").on(table.lastMessageAt)
    }));
    messages = pgTable("messages", {
      id: serial("id").primaryKey(),
      conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
      senderId: integer("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      receiverId: integer("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      content: text("content").notNull(),
      imageUrl: text("image_url"),
      // Optional image attachment
      deleted: boolean("deleted").notNull().default(false),
      // Soft delete
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (table) => ({
      // Performance indexes for fetching messages
      conversationIdx: index("messages_conversation_idx").on(table.conversationId),
      createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
      // Composite index for conversation + timestamp (most common query)
      conversationCreatedIdx: index("messages_conversation_created_idx").on(table.conversationId, table.createdAt)
    }));
    messageReads = pgTable("message_reads", {
      id: serial("id").primaryKey(),
      messageId: integer("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
      userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      readAt: timestamp("read_at").defaultNow().notNull()
    }, (table) => ({
      // One read record per user per message
      uniqueUserMessage: unique().on(table.userId, table.messageId),
      // Performance index for checking read status
      messageIdx: index("message_reads_message_idx").on(table.messageId)
    }));
    adminMessageAudit = pgTable("admin_message_audit", {
      id: serial("id").primaryKey(),
      adminId: integer("admin_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      viewedUser1Id: integer("viewed_user1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      viewedUser2Id: integer("viewed_user2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      viewedAt: timestamp("viewed_at").defaultNow().notNull()
    });
    usersRelations = relations(users, ({ many }) => ({
      projects: many(projects),
      votes: many(votes),
      comments: many(comments),
      sentMessages: many(messages, { relationName: "sentMessages" }),
      receivedMessages: many(messages, { relationName: "receivedMessages" }),
      messageReads: many(messageReads)
    }));
    projectsRelations = relations(projects, ({ one, many }) => ({
      user: one(users, {
        fields: [projects.userId],
        references: [users.id]
      }),
      votes: many(votes),
      comments: many(comments)
    }));
    votesRelations = relations(votes, ({ one }) => ({
      user: one(users, {
        fields: [votes.userId],
        references: [users.id]
      }),
      project: one(projects, {
        fields: [votes.projectId],
        references: [projects.id]
      })
    }));
    commentsRelations = relations(comments, ({ one }) => ({
      project: one(projects, {
        fields: [comments.projectId],
        references: [projects.id]
      }),
      user: one(users, {
        fields: [comments.userId],
        references: [users.id]
      })
    }));
    conversationsRelations = relations(conversations, ({ one, many }) => ({
      user1: one(users, {
        fields: [conversations.user1Id],
        references: [users.id]
      }),
      user2: one(users, {
        fields: [conversations.user2Id],
        references: [users.id]
      }),
      messages: many(messages)
    }));
    messagesRelations = relations(messages, ({ one, many }) => ({
      conversation: one(conversations, {
        fields: [messages.conversationId],
        references: [conversations.id]
      }),
      sender: one(users, {
        fields: [messages.senderId],
        references: [users.id],
        relationName: "sentMessages"
      }),
      receiver: one(users, {
        fields: [messages.receiverId],
        references: [users.id],
        relationName: "receivedMessages"
      }),
      reads: many(messageReads)
    }));
    messageReadsRelations = relations(messageReads, ({ one }) => ({
      message: one(messages, {
        fields: [messageReads.messageId],
        references: [messages.id]
      }),
      user: one(users, {
        fields: [messageReads.userId],
        references: [users.id]
      })
    }));
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      createdAt: true,
      role: true,
      banned: true
    }).extend({
      email: z.string().email("Unesite validnu email adresu"),
      password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
      username: z.string().min(3, "Korisni\u010Dko ime mora imati najmanje 3 karaktera"),
      termsAccepted: z.boolean({
        required_error: "Morate prihvatiti uslove kori\u0161\u0107enja"
      }).refine((val) => val === true, {
        message: "Morate prihvatiti uslove kori\u0161\u0107enja"
      })
    });
    insertPendingUserSchema = createInsertSchema(pendingUsers).omit({
      id: true,
      createdAt: true,
      expiresAt: true,
      verificationCode: true
    }).extend({
      email: z.string().email("Unesite validnu email adresu"),
      password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
      username: z.string().min(3, "Korisni\u010Dko ime mora imati najmanje 3 karaktera"),
      termsAccepted: z.boolean({
        required_error: "Morate prihvatiti uslove kori\u0161\u0107enja"
      }).refine((val) => val === true, {
        message: "Morate prihvatiti uslove kori\u0161\u0107enja"
      }),
      ipAddress: z.string().min(1, "IP adresa je obavezna"),
      userAgent: z.string().optional()
    });
    insertRegistrationAttemptSchema = createInsertSchema(registrationAttempts).omit({
      id: true,
      attemptedAt: true
    }).extend({
      ipAddress: z.string().min(1, "IP adresa je obavezna"),
      email: z.string().email("Unesite validnu email adresu").optional(),
      userAgent: z.string().optional()
    });
    insertProjectSchema = createInsertSchema(projects).omit({
      id: true,
      uploadDate: true,
      votesCount: true,
      userId: true,
      currentMonth: true
    }).extend({
      title: z.string().min(3, "Naslov mora imati najmanje 3 karaktera"),
      description: z.string(),
      genre: z.string().min(1, "Izaberite \u017Eanr"),
      mp3Url: z.string().url("Neva\u017Ee\u0107i URL")
    });
    insertCommentSchema = createInsertSchema(comments).omit({
      id: true,
      createdAt: true,
      userId: true
    }).extend({
      text: z.string().min(1, "Komentar ne mo\u017Ee biti prazan")
    });
    insertCmsContentSchema = createInsertSchema(cmsContent).omit({
      id: true,
      updatedAt: true
    }).extend({
      page: z.enum(cmsPages),
      section: z.enum(cmsSections),
      contentKey: z.string().min(1, "Content key ne mo\u017Ee biti prazan"),
      contentValue: z.string()
    });
    insertCmsMediaSchema = createInsertSchema(cmsMedia).omit({
      id: true,
      updatedAt: true
    }).extend({
      page: z.enum(cmsPages),
      section: z.enum(cmsSections),
      assetKey: z.string().min(1, "Asset key ne mo\u017Ee biti prazan"),
      filePath: z.string().min(1, "File path ne mo\u017Ee biti prazan")
    });
    insertVideoSpotSchema = createInsertSchema(videoSpots).omit({
      id: true,
      createdAt: true,
      order: true
    }).extend({
      title: z.string().min(3, "Naslov mora imati najmanje 3 karaktera"),
      description: z.string().min(10, "Opis mora imati najmanje 10 karaktera"),
      artist: z.string().min(2, "Ime izvo\u0111a\u010Da mora imati najmanje 2 karaktera"),
      youtubeUrl: z.string().url("Unesite validan YouTube URL").regex(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//, "URL mora biti sa YouTube-a")
    });
    insertUserSongSchema = createInsertSchema(userSongs).omit({
      id: true,
      userId: true,
      submittedAt: true,
      approved: true,
      votesCount: true
    }).extend({
      songTitle: z.string().min(3, "Naslov pesme mora imati najmanje 3 karaktera").max(100, "Naslov pesme mo\u017Ee imati najvi\u0161e 100 karaktera"),
      artistName: z.string().min(2, "Ime izvo\u0111a\u010Da mora imati najmanje 2 karaktera").max(100, "Ime izvo\u0111a\u010Da mo\u017Ee imati najvi\u0161e 100 karaktera"),
      youtubeUrl: z.string().url("Unesite validan YouTube URL").regex(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//, "URL mora biti sa YouTube-a")
    });
    insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
      id: true,
      status: true,
      confirmationToken: true,
      confirmedAt: true,
      subscribedAt: true,
      unsubscribedAt: true
    }).extend({
      email: z.string().email("Unesite validnu email adresu")
    });
    insertMessageSchema = createInsertSchema(messages).omit({
      id: true,
      createdAt: true,
      deleted: true
    }).extend({
      content: z.string().min(1, "Poruka ne mo\u017Ee biti prazna").max(5e3, "Poruka mo\u017Ee imati najvi\u0161e 5000 karaktera"),
      imageUrl: z.string().url("Neva\u017Ee\u0107i URL").optional().or(z.literal(""))
    });
    contracts = pgTable("contracts", {
      id: serial("id").primaryKey(),
      contractNumber: varchar("contract_number", { length: 20 }).notNull().unique(),
      contractType: varchar("contract_type", { length: 50 }).notNull(),
      // "mix_master" | "copyright_transfer" | "instrumental_sale"
      contractData: json("contract_data").notNull(),
      // All contract-specific fields stored as JSON
      pdfPath: text("pdf_path"),
      // Path to generated PDF file
      clientEmail: text("client_email"),
      // Client's email for sending contract
      userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
      // Optional: Direct link to user account
      createdAt: timestamp("created_at").defaultNow().notNull(),
      createdBy: integer("created_by").notNull().references(() => users.id)
      // Admin who created the contract
    });
    insertContractSchema = createInsertSchema(contracts).omit({
      id: true,
      createdAt: true
    }).extend({
      contractNumber: z.string().min(1, "Broj ugovora je obavezan"),
      contractType: z.enum(["mix_master", "copyright_transfer", "instrumental_sale"]),
      contractData: z.object({}).passthrough(),
      // Accept any valid JSON object
      clientEmail: z.string().email("Neva\u017Ee\u0107a email adresa").optional().or(z.literal("")),
      userId: z.number().int().positive().optional().nullable()
    });
    mixMasterContractDataSchema = z.object({
      contractDate: z.string().min(1, "Datum ugovora je obavezan"),
      contractPlace: z.string().min(1, "Mesto je obavezno"),
      studioName: z.string().min(1, "Naziv studija je obavezan"),
      studioAddress: z.string().min(1, "Adresa studija je obavezna"),
      studioMaticniBroj: z.string().optional(),
      clientName: z.string().min(1, "Ime klijenta je obavezno"),
      clientAddress: z.string().min(1, "Adresa klijenta je obavezna"),
      clientMaticniBroj: z.string().optional(),
      projectName: z.string().min(1, "Naziv projekta je obavezan"),
      channelCount: z.string().min(1, "Broj kanala je obavezan"),
      deliveryFormat: z.string().min(1, "Format isporuke je obavezan"),
      deliveryDate: z.string().min(1, "Rok isporuke je obavezan"),
      totalAmount: z.string().min(1, "Ukupna naknada je obavezna"),
      advancePayment: z.string().min(1, "Avans je obavezan"),
      remainingPayment: z.string().min(1, "Preostali iznos je obavezan"),
      paymentMethod: z.string().min(1, "Na\u010Din pla\u0107anja je obavezan"),
      vocalRecording: z.enum(["yes", "no"]),
      vocalRights: z.enum(["client", "studio", "other"]).optional(),
      vocalRightsOther: z.string().optional(),
      jurisdiction: z.string().min(1, "Nadle\u017Eni sud je obavezan"),
      copies: z.string().min(1, "Broj primeraka je obavezan"),
      finalDate: z.string().min(1, "Zavr\u0161ni datum je obavezan")
    });
    copyrightTransferContractDataSchema = z.object({
      contractDate: z.string().min(1, "Datum ugovora je obavezan"),
      contractPlace: z.string().min(1, "Mesto je obavezno"),
      authorName: z.string().min(1, "Ime autora je obavezno"),
      authorAddress: z.string().min(1, "Adresa autora je obavezna"),
      authorMaticniBroj: z.string().optional(),
      buyerName: z.string().min(1, "Ime kupca je obavezno"),
      buyerAddress: z.string().min(1, "Adresa kupca je obavezna"),
      buyerMaticniBroj: z.string().optional(),
      songTitle: z.string().min(1, "Naziv pesme je obavezan"),
      components: z.object({
        text: z.boolean(),
        music: z.boolean(),
        vocals: z.boolean(),
        mixMaster: z.boolean(),
        other: z.boolean(),
        otherText: z.string().optional()
      }),
      rightsType: z.enum(["exclusive", "nonexclusive"]),
      rightsScope: z.object({
        reproduction: z.boolean(),
        distribution: z.boolean(),
        performance: z.boolean(),
        adaptation: z.boolean(),
        other: z.boolean(),
        otherText: z.string().optional()
      }),
      territory: z.string().min(1, "Teritorija je obavezna"),
      duration: z.string().min(1, "Trajanje je obavezno"),
      totalAmount: z.string().min(1, "Ukupna naknada je obavezna"),
      firstPayment: z.string().optional(),
      firstPaymentDate: z.string().optional(),
      secondPayment: z.string().optional(),
      secondPaymentDate: z.string().optional(),
      paymentMethod: z.string().min(1, "Na\u010Din pla\u0107anja je obavezan"),
      authorPercentage: z.string().optional(),
      buyerPercentage: z.string().optional(),
      jurisdiction: z.string().min(1, "Nadle\u017Eni sud je obavezan"),
      copies: z.string().min(1, "Broj primeraka je obavezan"),
      finalDate: z.string().min(1, "Zavr\u0161ni datum je obavezan")
    });
    instrumentalSaleContractDataSchema = z.object({
      contractDate: z.string().min(1, "Datum ugovora je obavezan"),
      contractPlace: z.string().min(1, "Mesto je obavezno"),
      authorName: z.string().min(1, "Ime autora je obavezno"),
      authorAddress: z.string().min(1, "Adresa autora je obavezna"),
      authorMaticniBroj: z.string().optional(),
      buyerName: z.string().min(1, "Ime kupca je obavezno"),
      buyerAddress: z.string().min(1, "Adresa kupca je obavezna"),
      buyerMaticniBroj: z.string().optional(),
      instrumentalName: z.string().min(1, "Naziv instrumentala je obavezan"),
      duration: z.string().optional(),
      rightsType: z.enum(["exclusive", "nonexclusive"]),
      rightsScope: z.object({
        reproduction: z.boolean(),
        distribution: z.boolean(),
        performance: z.boolean(),
        adaptation: z.boolean(),
        other: z.boolean(),
        otherText: z.string().optional()
      }),
      territory: z.string().min(1, "Teritorija je obavezna"),
      durationPeriod: z.string().min(1, "Trajanje je obavezno"),
      totalAmount: z.string().min(1, "Ukupna naknada je obavezna"),
      advancePayment: z.string().min(1, "Avans je obavezan"),
      remainingPayment: z.string().min(1, "Preostali iznos je obavezan"),
      paymentMethod: z.string().min(1, "Na\u010Din pla\u0107anja je obavezan"),
      authorPercentage: z.string().optional(),
      buyerPercentage: z.string().optional(),
      jurisdiction: z.string().min(1, "Nadle\u017Eni sud je obavezan"),
      copies: z.string().min(1, "Broj primeraka je obavezan"),
      finalDate: z.string().min(1, "Zavr\u0161ni datum je obavezan")
    });
    invoices = pgTable("invoices", {
      id: serial("id").primaryKey(),
      invoiceNumber: varchar("invoice_number", { length: 20 }).notNull().unique(),
      contractId: integer("contract_id").references(() => contracts.id),
      // Optional: link to contract
      userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      // Client who receives the invoice
      amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
      // Numeric for aggregations
      currency: varchar("currency", { length: 3 }).notNull().default("RSD"),
      // ISO currency code (RSD, EUR)
      status: invoiceStatusEnum("status").notNull().default("pending"),
      description: text("description").notNull(),
      // What the invoice is for
      notes: text("notes"),
      // Optional additional notes
      issuedDate: timestamp("issued_date").defaultNow().notNull(),
      dueDate: timestamp("due_date").notNull(),
      // Payment deadline
      paidDate: timestamp("paid_date"),
      // When payment was received
      createdBy: integer("created_by").notNull().references(() => users.id),
      // Admin who created the invoice
      createdAt: timestamp("created_at").defaultNow().notNull()
    }, (table) => ({
      // Index for finding invoices by user
      userIdx: index("invoices_user_idx").on(table.userId),
      // Index for finding invoices by status
      statusIdx: index("invoices_status_idx").on(table.status),
      // Index for finding overdue invoices
      dueDateIdx: index("invoices_due_date_idx").on(table.dueDate)
    }));
    insertInvoiceSchema = createInsertSchema(invoices).omit({
      id: true,
      createdAt: true,
      issuedDate: true
    }).extend({
      invoiceNumber: z.string().min(1, "Broj fakture je obavezan"),
      amount: z.coerce.number().nonnegative("Iznos mora biti pozitivan broj"),
      currency: z.enum(["RSD", "EUR"]).default("RSD"),
      status: z.enum(["pending", "paid", "overdue", "cancelled"]).default("pending"),
      description: z.string().min(1, "Opis je obavezan"),
      notes: z.string().optional().nullable(),
      dueDate: z.date().or(z.string()),
      paidDate: z.date().or(z.string()).optional().nullable()
    });
  }
});

// server/index.ts
import express2 from "express";
import compression from "compression";
import path5 from "path";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
init_schema();

// server/db.ts
init_schema();
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var connectionString = process.env.DATABASE_URL;
var pool = new Pool({
  connectionString,
  // Enable SSL for external databases, disable for Replit internal database
  ssl: connectionString.includes("helium") || connectionString.includes("db.internal") ? false : { rejectUnauthorized: false }
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { eq, and, or, desc, sql as sql2 } from "drizzle-orm";
import session2 from "express-session";
import connectPg from "connect-pg-simple";
var PostgresSessionStore = connectPg(session2);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new PostgresSessionStore({ pool, createTableIfMissing: true });
  }
  // Contact Submissions
  async createContactSubmission(insertSubmission) {
    const [submission] = await db.insert(contactSubmissions).values(insertSubmission).returning();
    return submission;
  }
  async getContactSubmission(id) {
    const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return submission || void 0;
  }
  async getAllContactSubmissions() {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(sql2`LOWER(${users.email}) = LOWER(${email})`);
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(sql2`LOWER(${users.username}) = LOWER(${username})`);
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUserRole(id, role) {
    await db.update(users).set({ role }).where(eq(users.id, id));
  }
  async banUser(id) {
    await db.update(users).set({ banned: true }).where(eq(users.id, id));
  }
  async unbanUser(id) {
    await db.update(users).set({ banned: false }).where(eq(users.id, id));
  }
  async deleteUser(id) {
    const userProjects = await db.select({ id: projects.id }).from(projects).where(eq(projects.userId, id));
    const projectIds = userProjects.map((p) => p.id);
    if (projectIds.length > 0) {
      await db.delete(votes).where(sql2`${votes.projectId} IN (${sql2.join(projectIds.map((id2) => sql2`${id2}`), sql2`, `)})`);
      await db.delete(comments).where(sql2`${comments.projectId} IN (${sql2.join(projectIds.map((id2) => sql2`${id2}`), sql2`, `)})`);
    }
    await db.delete(votes).where(eq(votes.userId, id));
    await db.delete(comments).where(eq(comments.userId, id));
    await db.delete(projects).where(eq(projects.userId, id));
    await db.delete(users).where(eq(users.id, id));
  }
  async acceptTerms(id) {
    await db.update(users).set({ termsAccepted: true }).where(eq(users.id, id));
  }
  async getAllUsers() {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }
  async adminSearchUsers(query, limit = 20) {
    const searchTerm = `%${query.toLowerCase()}%`;
    const results = await db.select({
      id: users.id,
      username: users.username,
      email: users.email
    }).from(users).where(
      or(
        sql2`LOWER(${users.username}) LIKE ${searchTerm}`,
        sql2`LOWER(${users.email}) LIKE ${searchTerm}`
      )
    ).orderBy(users.username).limit(limit);
    return results;
  }
  async getAdminUsers() {
    return await db.select().from(users).where(eq(users.role, "admin"));
  }
  async setVerificationCode(userId, code) {
    await db.update(users).set({ verificationCode: code }).where(eq(users.id, userId));
  }
  async verifyEmail(userId, code) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user || user.verificationCode !== code) {
      return false;
    }
    await db.update(users).set({ emailVerified: true, verificationCode: null }).where(eq(users.id, userId));
    return true;
  }
  async setPasswordResetToken(userId, token) {
    const expiry = new Date(Date.now() + 15 * 60 * 1e3);
    await db.update(users).set({
      passwordResetToken: token,
      passwordResetExpiry: expiry
    }).where(eq(users.id, userId));
  }
  async verifyPasswordResetToken(userId, token) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user || user.passwordResetToken !== token) {
      return false;
    }
    if (!user.passwordResetExpiry || user.passwordResetExpiry < /* @__PURE__ */ new Date()) {
      return false;
    }
    return true;
  }
  async updatePassword(userId, newPassword) {
    await db.update(users).set({ password: newPassword }).where(eq(users.id, userId));
  }
  async clearPasswordResetToken(userId) {
    await db.update(users).set({
      passwordResetToken: null,
      passwordResetExpiry: null
    }).where(eq(users.id, userId));
  }
  async setAdminLoginToken(userId, token) {
    const expiry = new Date(Date.now() + 15 * 60 * 1e3);
    await db.update(users).set({
      adminLoginToken: token,
      adminLoginExpiry: expiry
    }).where(eq(users.id, userId));
  }
  async verifyAdminLoginToken(userId, token) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user || user.adminLoginToken !== token) {
      return false;
    }
    if (!user.adminLoginExpiry || user.adminLoginExpiry < /* @__PURE__ */ new Date()) {
      return false;
    }
    return true;
  }
  async clearAdminLoginToken(userId) {
    await db.update(users).set({
      adminLoginToken: null,
      adminLoginExpiry: null
    }).where(eq(users.id, userId));
  }
  async updateUserProfile(userId, data) {
    const updateData = {};
    if (data.username) {
      updateData.username = data.username;
      updateData.usernameLastChanged = /* @__PURE__ */ new Date();
    }
    if (data.email) {
      updateData.email = data.email;
    }
    if (Object.keys(updateData).length > 0) {
      await db.update(users).set(updateData).where(eq(users.id, userId));
    }
  }
  async updateUserPassword(userId, hashedPassword) {
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
  }
  async updateUserAvatar(userId, avatarUrl) {
    await db.update(users).set({ avatarUrl }).where(eq(users.id, userId));
  }
  async updateUserLastSeen(userId) {
    await db.update(users).set({ lastSeen: sql2`now()` }).where(eq(users.id, userId));
  }
  // Pending Users - for email verification before full registration
  async createPendingUser(data) {
    const [pendingUser] = await db.insert(pendingUsers).values(data).returning();
    if (!pendingUser) throw new Error("Failed to create pending user");
    return pendingUser;
  }
  async getPendingUserByEmail(email) {
    const results = await db.select().from(pendingUsers).where(sql2`LOWER(${pendingUsers.email}) = LOWER(${email})`).limit(1);
    return results[0];
  }
  async getPendingUserByUsername(username) {
    const results = await db.select().from(pendingUsers).where(sql2`LOWER(${pendingUsers.username}) = LOWER(${username})`).limit(1);
    return results[0];
  }
  async getPendingUserByCode(code) {
    const results = await db.select().from(pendingUsers).where(eq(pendingUsers.verificationCode, code)).limit(1);
    return results[0];
  }
  async deletePendingUser(id) {
    await db.delete(pendingUsers).where(eq(pendingUsers.id, id));
  }
  async movePendingToUsers(pendingUserId) {
    return await db.transaction(async (tx) => {
      const [pendingUser] = await tx.select().from(pendingUsers).where(eq(pendingUsers.id, pendingUserId));
      if (!pendingUser) {
        throw new Error("Pending user not found");
      }
      const existingByEmail = await tx.select().from(users).where(sql2`LOWER(${users.email}) = LOWER(${pendingUser.email})`).limit(1);
      if (existingByEmail.length > 0) {
        throw new Error("Email already registered");
      }
      const existingByUsername = await tx.select().from(users).where(sql2`LOWER(${users.username}) = LOWER(${pendingUser.username})`).limit(1);
      if (existingByUsername.length > 0) {
        throw new Error("Username already taken");
      }
      const [newUser] = await tx.insert(users).values({
        email: pendingUser.email,
        password: pendingUser.password,
        // Already hashed
        username: pendingUser.username,
        termsAccepted: pendingUser.termsAccepted,
        emailVerified: true,
        // They verified via email
        role: "user",
        banned: false
      }).returning();
      if (!newUser) throw new Error("Failed to create user");
      await tx.delete(pendingUsers).where(eq(pendingUsers.id, pendingUserId));
      return newUser;
    });
  }
  async cleanupExpiredPendingUsers() {
    const result = await db.delete(pendingUsers).where(sql2`${pendingUsers.expiresAt} < now()`);
    return result.rowCount || 0;
  }
  // Registration Rate Limiting
  async createRegistrationAttempt(data) {
    const [attempt] = await db.insert(registrationAttempts).values(data).returning();
    if (!attempt) throw new Error("Failed to create registration attempt");
    return attempt;
  }
  async getRecentRegistrationAttempts(ipAddress, minutesAgo) {
    return await db.select().from(registrationAttempts).where(
      and(
        eq(registrationAttempts.ipAddress, ipAddress),
        sql2`${registrationAttempts.attemptedAt} > now() - interval '${sql2.raw(minutesAgo.toString())} minutes'`
      )
    ).orderBy(desc(registrationAttempts.attemptedAt));
  }
  async cleanupOldRegistrationAttempts(hoursAgo) {
    const result = await db.delete(registrationAttempts).where(
      sql2`${registrationAttempts.attemptedAt} < now() - interval '${sql2.raw(hoursAgo.toString())} hours'`
    );
    return result.rowCount || 0;
  }
  // Projects
  async createProject(data) {
    const [project] = await db.insert(projects).values(data).returning();
    return project;
  }
  async getProject(id) {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || void 0;
  }
  async getAllProjects() {
    const result = await db.select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      genre: projects.genre,
      mp3Url: projects.mp3Url,
      userId: projects.userId,
      uploadDate: projects.uploadDate,
      votesCount: projects.votesCount,
      currentMonth: projects.currentMonth,
      approved: projects.approved,
      username: users.username
    }).from(projects).leftJoin(users, eq(projects.userId, users.id)).where(eq(projects.approved, true)).orderBy(desc(projects.uploadDate));
    return result;
  }
  async getAllProjectsForAdmin() {
    const result = await db.select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      genre: projects.genre,
      mp3Url: projects.mp3Url,
      userId: projects.userId,
      uploadDate: projects.uploadDate,
      votesCount: projects.votesCount,
      currentMonth: projects.currentMonth,
      approved: projects.approved,
      username: users.username
    }).from(projects).leftJoin(users, eq(projects.userId, users.id)).orderBy(desc(projects.uploadDate));
    return result;
  }
  async getPendingProjects() {
    const result = await db.select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      genre: projects.genre,
      mp3Url: projects.mp3Url,
      userId: projects.userId,
      uploadDate: projects.uploadDate,
      votesCount: projects.votesCount,
      currentMonth: projects.currentMonth,
      approved: projects.approved,
      username: users.username
    }).from(projects).leftJoin(users, eq(projects.userId, users.id)).where(eq(projects.approved, false)).orderBy(desc(projects.uploadDate));
    return result;
  }
  async approveProject(id) {
    await db.update(projects).set({ approved: true }).where(eq(projects.id, id));
  }
  async getUserProjectsForMonth(userId, month) {
    return await db.select().from(projects).where(
      and(eq(projects.userId, userId), eq(projects.currentMonth, month))
    );
  }
  async deleteProject(id) {
    await db.delete(projects).where(eq(projects.id, id));
  }
  async incrementVoteCount(projectId) {
    await db.update(projects).set({
      votesCount: sql2`${projects.votesCount} + 1`
    }).where(eq(projects.id, projectId));
  }
  // Votes
  async createVote(data) {
    const [vote] = await db.insert(votes).values(data).returning();
    await this.incrementVoteCount(data.projectId);
    return vote;
  }
  async hasUserVoted(userId, projectId) {
    const existingVotes = await db.select().from(votes).where(
      and(eq(votes.userId, userId), eq(votes.projectId, projectId))
    );
    return existingVotes.length > 0;
  }
  async hasIpVoted(ipAddress, projectId) {
    const existingVotes = await db.select().from(votes).where(
      and(eq(votes.ipAddress, ipAddress), eq(votes.projectId, projectId))
    );
    return existingVotes.length > 0;
  }
  async getProjectVotes(projectId) {
    return await db.select().from(votes).where(eq(votes.projectId, projectId));
  }
  async deleteVote(userId, projectId) {
    await db.delete(votes).where(
      and(eq(votes.userId, userId), eq(votes.projectId, projectId))
    );
    await this.decrementVoteCount(projectId);
  }
  async decrementVoteCount(projectId) {
    await db.update(projects).set({
      votesCount: sql2`${projects.votesCount} - 1`
    }).where(eq(projects.id, projectId));
  }
  // Comments
  async createComment(data) {
    const [comment] = await db.insert(comments).values(data).returning();
    return comment;
  }
  async getProjectComments(projectId) {
    const result = await db.select({
      id: comments.id,
      projectId: comments.projectId,
      userId: comments.userId,
      text: comments.text,
      createdAt: comments.createdAt,
      username: users.username
    }).from(comments).leftJoin(users, eq(comments.userId, users.id)).where(eq(comments.projectId, projectId)).orderBy(desc(comments.createdAt));
    return result;
  }
  async deleteComment(id) {
    await db.delete(comments).where(eq(comments.id, id));
  }
  async getAllComments() {
    const result = await db.select({
      id: comments.id,
      projectId: comments.projectId,
      projectTitle: projects.title,
      userId: comments.userId,
      username: users.username,
      text: comments.text,
      createdAt: comments.createdAt
    }).from(comments).leftJoin(users, eq(comments.userId, users.id)).leftJoin(projects, eq(comments.projectId, projects.id)).orderBy(desc(comments.createdAt));
    return result;
  }
  // Settings
  async getSetting(key) {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || void 0;
  }
  async setSetting(key, value) {
    const existing = await this.getSetting(key);
    if (existing) {
      await db.update(settings).set({ value, updatedAt: /* @__PURE__ */ new Date() }).where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }
  }
  // CMS Content
  async getCmsContent(page, section, contentKey) {
    const [content] = await db.select().from(cmsContent).where(
      and(
        eq(cmsContent.page, page),
        eq(cmsContent.section, section),
        eq(cmsContent.contentKey, contentKey)
      )
    );
    return content || void 0;
  }
  async setCmsContent(page, section, contentType, contentKey, contentValue) {
    const existing = await this.getCmsContent(page, section, contentKey);
    if (existing) {
      await db.update(cmsContent).set({ contentValue, updatedAt: /* @__PURE__ */ new Date() }).where(
        and(
          eq(cmsContent.page, page),
          eq(cmsContent.section, section),
          eq(cmsContent.contentKey, contentKey)
        )
      );
    } else {
      await db.insert(cmsContent).values({ page, section, contentKey, contentValue });
    }
  }
  async getAllCmsContent() {
    return await db.select().from(cmsContent);
  }
  async listCmsContent(page) {
    if (page) {
      return await db.select().from(cmsContent).where(eq(cmsContent.page, page)).orderBy(cmsContent.page, cmsContent.section, cmsContent.contentKey);
    }
    return await db.select().from(cmsContent).orderBy(cmsContent.page, cmsContent.section, cmsContent.contentKey);
  }
  async upsertCmsContent(data) {
    const [result] = await db.insert(cmsContent).values(data).onConflictDoUpdate({
      target: [cmsContent.page, cmsContent.section, cmsContent.contentKey],
      set: {
        contentValue: sql2`EXCLUDED.content_value`,
        updatedAt: sql2`NOW()`
      }
    }).returning();
    return result;
  }
  async deleteCmsContentByPattern(page, section, keyPattern) {
    await db.delete(cmsContent).where(
      and(
        eq(cmsContent.page, page),
        eq(cmsContent.section, section),
        sql2`${cmsContent.contentKey} LIKE ${keyPattern + "%"}`
      )
    );
  }
  async listCmsMedia(page) {
    if (page) {
      return await db.select().from(cmsMedia).where(eq(cmsMedia.page, page)).orderBy(cmsMedia.page, cmsMedia.section, cmsMedia.assetKey);
    }
    return await db.select().from(cmsMedia).orderBy(cmsMedia.page, cmsMedia.section, cmsMedia.assetKey);
  }
  async upsertCmsMedia(data) {
    const [result] = await db.insert(cmsMedia).values(data).onConflictDoUpdate({
      target: [cmsMedia.page, cmsMedia.section, cmsMedia.assetKey],
      set: {
        filePath: sql2`EXCLUDED.file_path`,
        updatedAt: sql2`NOW()`
      }
    }).returning();
    return result;
  }
  async deleteCmsMedia(id) {
    await db.delete(cmsMedia).where(eq(cmsMedia.id, id));
  }
  async getGiveawaySettings() {
    const setting = await this.getSetting("giveaway_active");
    return { isActive: setting?.value === "true" };
  }
  async getMaintenanceMode() {
    const setting = await this.getSetting("maintenance_mode");
    return setting?.value === "true";
  }
  async setMaintenanceMode(isActive) {
    await this.setSetting("maintenance_mode", isActive.toString());
  }
  // Newsletter functions
  async createNewsletterSubscriber(email, confirmationToken) {
    const [subscriber] = await db.insert(newsletterSubscribers).values({
      email: email.toLowerCase(),
      confirmationToken,
      status: "pending"
    }).returning();
    return subscriber;
  }
  async getNewsletterSubscriberByEmail(email) {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(sql2`LOWER(${newsletterSubscribers.email}) = LOWER(${email})`).limit(1);
    return subscriber;
  }
  async getNewsletterSubscriberByToken(token) {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.confirmationToken, token)).limit(1);
    return subscriber;
  }
  async confirmNewsletterSubscription(token) {
    const subscriber = await this.getNewsletterSubscriberByToken(token);
    if (!subscriber || subscriber.status === "confirmed") {
      return false;
    }
    await db.update(newsletterSubscribers).set({
      status: "confirmed",
      confirmedAt: /* @__PURE__ */ new Date(),
      confirmationToken: null
    }).where(eq(newsletterSubscribers.id, subscriber.id));
    return true;
  }
  async unsubscribeNewsletter(email) {
    const subscriber = await this.getNewsletterSubscriberByEmail(email);
    if (!subscriber || subscriber.status === "unsubscribed") {
      return false;
    }
    await db.update(newsletterSubscribers).set({
      status: "unsubscribed",
      unsubscribedAt: /* @__PURE__ */ new Date()
    }).where(eq(newsletterSubscribers.id, subscriber.id));
    return true;
  }
  async deleteNewsletterSubscriber(id) {
    const result = await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id)).returning();
    return result.length > 0;
  }
  async getAllNewsletterSubscribers() {
    return await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
  }
  async getConfirmedNewsletterSubscribers() {
    return await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.status, "confirmed")).orderBy(desc(newsletterSubscribers.confirmedAt));
  }
  async getNewsletterStats() {
    const allSubscribers = await db.select().from(newsletterSubscribers).where(sql2`${newsletterSubscribers.status} != 'unsubscribed'`);
    const total = allSubscribers.length;
    const confirmed = allSubscribers.filter((s) => s.status === "confirmed").length;
    const pending = allSubscribers.filter((s) => s.status === "pending").length;
    return { total, confirmed, pending };
  }
  // Video Spots
  async getVideoSpots() {
    return await db.select().from(videoSpots).orderBy(videoSpots.order, desc(videoSpots.createdAt));
  }
  async createVideoSpot(data) {
    const [result] = await db.insert(videoSpots).values(data).returning();
    return result;
  }
  async updateVideoSpot(id, data) {
    const [result] = await db.update(videoSpots).set(data).where(eq(videoSpots.id, id)).returning();
    if (!result) throw new Error("Video spot not found");
    return result;
  }
  async deleteVideoSpot(id) {
    await db.delete(videoSpots).where(eq(videoSpots.id, id));
  }
  async updateVideoSpotOrder(id, order) {
    const [result] = await db.update(videoSpots).set({ order }).where(eq(videoSpots.id, id)).returning();
    if (!result) throw new Error("Video spot not found");
    return result;
  }
  // User Songs
  async createUserSong(data) {
    const [result] = await db.insert(userSongs).values({
      userId: data.userId,
      songTitle: data.songTitle,
      artistName: data.artistName,
      youtubeUrl: data.youtubeUrl
    }).returning();
    return result;
  }
  async getUserSongById(id) {
    const [result] = await db.select().from(userSongs).where(eq(userSongs.id, id));
    return result || void 0;
  }
  async getUserSongs(userId) {
    return await db.select().from(userSongs).where(eq(userSongs.userId, userId)).orderBy(desc(userSongs.submittedAt));
  }
  async getAllUserSongs() {
    const results = await db.select({
      id: userSongs.id,
      userId: userSongs.userId,
      songTitle: userSongs.songTitle,
      artistName: userSongs.artistName,
      youtubeUrl: userSongs.youtubeUrl,
      submittedAt: userSongs.submittedAt,
      approved: userSongs.approved,
      votesCount: userSongs.votesCount,
      username: users.username
    }).from(userSongs).leftJoin(users, eq(userSongs.userId, users.id)).orderBy(desc(userSongs.submittedAt));
    return results.map((r) => ({
      ...r,
      username: r.username || "Unknown"
    }));
  }
  async deleteUserSong(id) {
    await db.delete(userSongs).where(eq(userSongs.id, id));
  }
  async approveUserSong(id) {
    await db.update(userSongs).set({ approved: true }).where(eq(userSongs.id, id));
  }
  async getUserLastSongSubmissionTime(userId) {
    const [result] = await db.select({ submittedAt: userSongs.submittedAt }).from(userSongs).where(eq(userSongs.userId, userId)).orderBy(desc(userSongs.submittedAt)).limit(1);
    if (!result?.submittedAt) {
      return null;
    }
    return new Date(result.submittedAt);
  }
  async getApprovedUserSongs(userId) {
    const results = await db.select({
      id: userSongs.id,
      userId: userSongs.userId,
      songTitle: userSongs.songTitle,
      artistName: userSongs.artistName,
      youtubeUrl: userSongs.youtubeUrl,
      submittedAt: userSongs.submittedAt,
      approved: userSongs.approved,
      votesCount: userSongs.votesCount,
      username: users.username,
      voteId: userId ? userSongVotes.id : sql2`NULL`
    }).from(userSongs).leftJoin(users, eq(userSongs.userId, users.id)).leftJoin(
      userSongVotes,
      userId ? and(eq(userSongVotes.songId, userSongs.id), eq(userSongVotes.userId, userId)) : sql2`false`
    ).where(eq(userSongs.approved, true)).orderBy(desc(userSongs.votesCount), desc(userSongs.submittedAt));
    return results.map((r) => ({
      id: r.id,
      userId: r.userId,
      songTitle: r.songTitle,
      artistName: r.artistName,
      youtubeUrl: r.youtubeUrl,
      submittedAt: r.submittedAt,
      approved: r.approved,
      votesCount: r.votesCount,
      username: r.username || "Unknown",
      hasVoted: r.voteId !== null
    }));
  }
  async toggleUserSongVote(userId, songId) {
    return await db.transaction(async (tx) => {
      const [existingVote] = await tx.select().from(userSongVotes).where(and(eq(userSongVotes.userId, userId), eq(userSongVotes.songId, songId)));
      if (existingVote) {
        await tx.delete(userSongVotes).where(eq(userSongVotes.id, existingVote.id));
        await tx.update(userSongs).set({ votesCount: sql2`${userSongs.votesCount} - 1` }).where(eq(userSongs.id, songId));
        const [updated] = await tx.select({ votesCount: userSongs.votesCount }).from(userSongs).where(eq(userSongs.id, songId));
        return { voted: false, votesCount: updated?.votesCount || 0 };
      } else {
        await tx.insert(userSongVotes).values({ userId, songId });
        await tx.update(userSongs).set({ votesCount: sql2`${userSongs.votesCount} + 1` }).where(eq(userSongs.id, songId));
        const [updated] = await tx.select({ votesCount: userSongs.votesCount }).from(userSongs).where(eq(userSongs.id, songId));
        return { voted: true, votesCount: updated?.votesCount || 1 };
      }
    });
  }
  async hasUserVotedForSong(userId, songId) {
    const [result] = await db.select().from(userSongVotes).where(and(eq(userSongVotes.userId, userId), eq(userSongVotes.songId, songId)));
    return !!result;
  }
  // Admin methods
  async getAdminStats() {
    const [userCount] = await db.select({ count: sql2`count(*)` }).from(users);
    const [projectCount] = await db.select({ count: sql2`count(*)` }).from(projects);
    const [voteCount] = await db.select({ count: sql2`count(*)` }).from(votes);
    const [commentCount] = await db.select({ count: sql2`count(*)` }).from(comments);
    return {
      totalUsers: Number(userCount?.count ?? 0),
      totalProjects: Number(projectCount?.count ?? 0),
      totalVotes: Number(voteCount?.count ?? 0),
      totalComments: Number(commentCount?.count ?? 0)
    };
  }
  async toggleAdminRole(userId) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new Error("User not found");
    const newRole = user.role === "admin" ? "user" : "admin";
    await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
  }
  // Messaging methods
  async searchUsers(query, currentUserId) {
    const results = await db.select({
      id: users.id,
      username: users.username,
      email: users.email
    }).from(users).where(
      and(
        sql2`LOWER(${users.username}) LIKE LOWER(${`%${query}%`})`,
        sql2`${users.id} != ${currentUserId}`,
        eq(users.banned, false),
        eq(users.emailVerified, true)
      )
    ).limit(10);
    return results;
  }
  async getOrCreateConversation(user1Id, user2Id) {
    const existing = await this.getConversation(user1Id, user2Id);
    if (existing) return existing;
    const [canonicalUser1, canonicalUser2] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    const [conversation] = await db.insert(conversations).values({ user1Id: canonicalUser1, user2Id: canonicalUser2 }).returning();
    return conversation;
  }
  async getConversation(user1Id, user2Id) {
    const [canonicalUser1, canonicalUser2] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    const [conversation] = await db.select().from(conversations).where(
      and(
        eq(conversations.user1Id, canonicalUser1),
        eq(conversations.user2Id, canonicalUser2)
      )
    );
    return conversation || void 0;
  }
  async getUserConversations(userId) {
    const userConvos = await db.select().from(conversations).where(
      sql2`${conversations.user1Id} = ${userId} OR ${conversations.user2Id} = ${userId}`
    ).orderBy(desc(conversations.lastMessageAt));
    const results = await Promise.all(
      userConvos.map(async (convo) => {
        const otherUserId = convo.user1Id === userId ? convo.user2Id : convo.user1Id;
        const [otherUser] = await db.select({ id: users.id, username: users.username, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, otherUserId));
        const [lastMsg] = await db.select().from(messages).where(eq(messages.conversationId, convo.id)).orderBy(desc(messages.createdAt)).limit(1);
        const unreadMsgs = await db.select({ count: sql2`count(*)` }).from(messages).leftJoin(
          messageReads,
          and(
            eq(messageReads.messageId, messages.id),
            eq(messageReads.userId, userId)
          )
        ).where(
          and(
            eq(messages.conversationId, convo.id),
            sql2`${messages.receiverId} = ${userId}`,
            sql2`${messageReads.id} IS NULL`
          )
        );
        return {
          ...convo,
          otherUser,
          lastMessage: lastMsg || void 0,
          unreadCount: Number(unreadMsgs[0]?.count ?? 0)
        };
      })
    );
    return results;
  }
  async sendMessage(senderId, receiverId, content, imageUrl) {
    const conversation = await this.getOrCreateConversation(senderId, receiverId);
    const [message] = await db.insert(messages).values({
      conversationId: conversation.id,
      senderId,
      receiverId,
      content,
      imageUrl
    }).returning();
    await db.update(conversations).set({ lastMessageAt: /* @__PURE__ */ new Date() }).where(eq(conversations.id, conversation.id));
    return message;
  }
  async getMessageById(messageId) {
    const [message] = await db.select().from(messages).where(eq(messages.id, messageId));
    return message || void 0;
  }
  async getConversationMessages(conversationId, userId) {
    const msgs = await db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
    return msgs;
  }
  async markMessagesAsRead(conversationId, userId) {
    const unreadMessages = await db.select({ id: messages.id }).from(messages).leftJoin(
      messageReads,
      and(
        eq(messageReads.messageId, messages.id),
        eq(messageReads.userId, userId)
      )
    ).where(
      and(
        eq(messages.conversationId, conversationId),
        eq(messages.receiverId, userId),
        sql2`${messageReads.id} IS NULL`
      )
    );
    for (const msg of unreadMessages) {
      await db.insert(messageReads).values({
        messageId: msg.id,
        userId
      });
    }
  }
  async getUnreadMessageCount(userId) {
    const [result] = await db.select({ count: sql2`count(*)` }).from(messages).leftJoin(
      messageReads,
      and(
        eq(messageReads.messageId, messages.id),
        eq(messageReads.userId, userId)
      )
    ).where(
      and(
        eq(messages.receiverId, userId),
        sql2`${messageReads.id} IS NULL`
      )
    );
    return Number(result?.count ?? 0);
  }
  async deleteMessage(messageId, userId) {
    const [message] = await db.select().from(messages).where(eq(messages.id, messageId));
    if (!message || message.senderId !== userId) {
      return false;
    }
    await db.update(messages).set({ deleted: true }).where(eq(messages.id, messageId));
    return true;
  }
  async adminGetAllConversations() {
    const allConvos = await db.select().from(conversations).orderBy(desc(conversations.lastMessageAt));
    const results = await Promise.all(
      allConvos.map(async (convo) => {
        const [user1] = await db.select({ id: users.id, username: users.username, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, convo.user1Id));
        const [user2] = await db.select({ id: users.id, username: users.username, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, convo.user2Id));
        const [msgCount] = await db.select({ count: sql2`count(*)` }).from(messages).where(eq(messages.conversationId, convo.id));
        const [lastMsg] = await db.select({
          content: messages.content,
          senderId: messages.senderId,
          deleted: messages.deleted
        }).from(messages).where(eq(messages.conversationId, convo.id)).orderBy(desc(messages.createdAt)).limit(1);
        let lastMessageSenderUsername = null;
        if (lastMsg) {
          const [sender] = await db.select({ username: users.username }).from(users).where(eq(users.id, lastMsg.senderId));
          lastMessageSenderUsername = sender?.username || null;
        }
        return {
          id: convo.id,
          user1Id: convo.user1Id,
          user2Id: convo.user2Id,
          user1Username: user1?.username || "Unknown",
          user2Username: user2?.username || "Unknown",
          user1AvatarUrl: user1?.avatarUrl || null,
          user2AvatarUrl: user2?.avatarUrl || null,
          messageCount: Number(msgCount?.count ?? 0),
          lastMessageAt: convo.lastMessageAt,
          lastMessageContent: lastMsg?.content || null,
          lastMessageSenderUsername,
          lastMessageDeleted: lastMsg?.deleted || false
        };
      })
    );
    return results;
  }
  async adminGetConversationMessages(user1Id, user2Id) {
    const conversation = await this.getConversation(user1Id, user2Id);
    if (!conversation) return [];
    const msgs = await db.select({
      id: messages.id,
      conversationId: messages.conversationId,
      senderId: messages.senderId,
      receiverId: messages.receiverId,
      content: messages.content,
      imageUrl: messages.imageUrl,
      createdAt: messages.createdAt,
      deleted: messages.deleted,
      senderUsername: users.username
    }).from(messages).leftJoin(users, eq(messages.senderId, users.id)).where(eq(messages.conversationId, conversation.id)).orderBy(messages.createdAt);
    return msgs;
  }
  async adminDeleteMessage(messageId) {
    await db.update(messages).set({ deleted: true }).where(eq(messages.id, messageId));
    return true;
  }
  async adminLogConversationView(adminId, viewedUser1Id, viewedUser2Id) {
    await db.insert(adminMessageAudit).values({
      adminId,
      viewedUser1Id,
      viewedUser2Id
    });
  }
  async adminGetAuditLogs() {
    const logs = await db.select({
      id: adminMessageAudit.id,
      adminId: adminMessageAudit.adminId,
      viewedUser1Id: adminMessageAudit.viewedUser1Id,
      viewedUser2Id: adminMessageAudit.viewedUser2Id,
      viewedAt: adminMessageAudit.viewedAt
    }).from(adminMessageAudit).orderBy(desc(adminMessageAudit.viewedAt));
    const results = await Promise.all(
      logs.map(async (log2) => {
        const [admin] = await db.select({ username: users.username }).from(users).where(eq(users.id, log2.adminId));
        const [user1] = await db.select({ username: users.username }).from(users).where(eq(users.id, log2.viewedUser1Id));
        const [user2] = await db.select({ username: users.username }).from(users).where(eq(users.id, log2.viewedUser2Id));
        return {
          ...log2,
          adminUsername: admin?.username ?? "Unknown",
          user1Username: user1?.username ?? "Unknown",
          user2Username: user2?.username ?? "Unknown"
        };
      })
    );
    return results;
  }
  async adminExportConversation(user1Id, user2Id) {
    const [smallerId, largerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    const conversation = await db.select().from(conversations).where(
      and(
        eq(conversations.user1Id, smallerId),
        eq(conversations.user2Id, largerId)
      )
    ).limit(1);
    if (!conversation[0]) {
      throw new Error("Conversation not found");
    }
    const user1 = await db.select({ username: users.username }).from(users).where(eq(users.id, user1Id)).limit(1);
    const user2 = await db.select({ username: users.username }).from(users).where(eq(users.id, user2Id)).limit(1);
    if (!user1[0] || !user2[0]) {
      throw new Error("Users not found");
    }
    const msgs = await db.select().from(messages).where(eq(messages.conversationId, conversation[0].id)).orderBy(messages.createdAt);
    let txtContent = `Konverzacija izme\u0111u: ${user1[0].username} i ${user2[0].username}
`;
    txtContent += `Datum izvoza: ${(/* @__PURE__ */ new Date()).toLocaleString("sr-RS")}
`;
    txtContent += `Ukupno poruka: ${msgs.length}
`;
    txtContent += `
${"=".repeat(60)}

`;
    for (const msg of msgs) {
      const senderUsername = msg.senderId === user1Id ? user1[0].username : user2[0].username;
      const timestamp2 = new Date(msg.createdAt).toLocaleString("sr-RS");
      const deletedSuffix = msg.deleted ? " (OBRISANA)" : "";
      const content = msg.deleted ? "[Poruka obrisana]" : msg.content;
      txtContent += `[${timestamp2}] ${senderUsername}: ${content}${deletedSuffix}
`;
    }
    return txtContent;
  }
  async adminGetMessagingStats() {
    const [totalMessagesResult] = await db.select({ count: sql2`count(*)` }).from(messages);
    const [totalConversationsResult] = await db.select({ count: sql2`count(*)` }).from(conversations);
    const [deletedMessagesResult] = await db.select({ count: sql2`count(*)` }).from(messages).where(eq(messages.deleted, true));
    const thirtyDaysAgo = /* @__PURE__ */ new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const [activeConversationsResult] = await db.select({ count: sql2`count(*)` }).from(conversations).where(sql2`${conversations.lastMessageAt} >= ${thirtyDaysAgo}`);
    return {
      totalMessages: Number(totalMessagesResult?.count ?? 0),
      totalConversations: Number(totalConversationsResult?.count ?? 0),
      deletedMessages: Number(deletedMessagesResult?.count ?? 0),
      activeConversations: Number(activeConversationsResult?.count ?? 0)
    };
  }
  // Contracts
  async createContract(data) {
    const [contract] = await db.insert(contracts).values(data).returning();
    return contract;
  }
  async getAllContracts() {
    const result = await db.select({
      id: contracts.id,
      contractNumber: contracts.contractNumber,
      contractType: contracts.contractType,
      contractData: contracts.contractData,
      pdfPath: contracts.pdfPath,
      clientEmail: contracts.clientEmail,
      createdAt: contracts.createdAt,
      createdBy: contracts.createdBy,
      userId: contracts.userId,
      username: users.username
    }).from(contracts).leftJoin(users, eq(contracts.userId, users.id)).orderBy(desc(contracts.createdAt));
    return result;
  }
  async getContractById(id) {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract || void 0;
  }
  async getNextContractNumber() {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const yearSuffix = `${currentYear}`;
    const [latestContract] = await db.select().from(contracts).where(sql2`${contracts.contractNumber} LIKE ${"%/" + yearSuffix}`).orderBy(desc(contracts.contractNumber)).limit(1);
    if (!latestContract) {
      return `001/${yearSuffix}`;
    }
    const parts = latestContract.contractNumber.split("/");
    if (parts.length < 2 || !parts[0]) {
      return `001/${yearSuffix}`;
    }
    const lastNumber = parseInt(parts[0]);
    const nextNumber = lastNumber + 1;
    return `${nextNumber.toString().padStart(3, "0")}/${yearSuffix}`;
  }
  async updateContractUser(contractId, userId) {
    await db.update(contracts).set({ userId }).where(eq(contracts.id, contractId));
  }
  async deleteContract(id) {
    await db.delete(contracts).where(eq(contracts.id, id));
  }
  // Get next invoice number
  async getNextInvoiceNumber() {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const yearPrefix = `INV-${currentYear}`;
    const [latestInvoice] = await db.select().from(invoices).where(sql2`${invoices.invoiceNumber} LIKE ${yearPrefix + "-%"}`).orderBy(desc(invoices.invoiceNumber)).limit(1);
    if (!latestInvoice) {
      return `${yearPrefix}-001`;
    }
    const parts = latestInvoice.invoiceNumber.split("-");
    if (parts.length < 3 || !parts[2]) {
      return `${yearPrefix}-001`;
    }
    const lastNumber = parseInt(parts[2]);
    const nextNumber = lastNumber + 1;
    return `${yearPrefix}-${nextNumber.toString().padStart(3, "0")}`;
  }
  // Invoices
  async createInvoice(data) {
    const invoiceNumber = data.invoiceNumber || await this.getNextInvoiceNumber();
    const invoiceData = {
      ...data,
      invoiceNumber,
      amount: typeof data.amount === "number" ? data.amount.toString() : data.amount,
      dueDate: typeof data.dueDate === "string" ? new Date(data.dueDate) : data.dueDate,
      paidDate: data.paidDate ? typeof data.paidDate === "string" ? new Date(data.paidDate) : data.paidDate : null
    };
    const [invoice] = await db.insert(invoices).values([invoiceData]).returning();
    if (!invoice) throw new Error("Failed to create invoice");
    return invoice;
  }
  async getAllInvoices() {
    return await db.select().from(invoices).orderBy(desc(invoices.createdAt));
  }
  async getUserInvoices(userId) {
    const results = await db.select({
      id: invoices.id,
      userId: invoices.userId,
      contractId: invoices.contractId,
      invoiceNumber: invoices.invoiceNumber,
      amount: invoices.amount,
      currency: invoices.currency,
      status: invoices.status,
      description: invoices.description,
      notes: invoices.notes,
      issuedDate: invoices.issuedDate,
      dueDate: invoices.dueDate,
      paidDate: invoices.paidDate,
      createdAt: invoices.createdAt,
      createdBy: invoices.createdBy,
      contractNumber: contracts.contractNumber,
      contractType: contracts.contractType
    }).from(invoices).leftJoin(contracts, eq(invoices.contractId, contracts.id)).where(eq(invoices.userId, userId)).orderBy(desc(invoices.dueDate));
    return results.map((r) => ({
      id: r.id,
      userId: r.userId,
      contractId: r.contractId,
      invoiceNumber: r.invoiceNumber,
      amount: r.amount,
      currency: r.currency,
      status: r.status,
      description: r.description,
      notes: r.notes,
      issuedDate: r.issuedDate,
      dueDate: r.dueDate,
      paidDate: r.paidDate,
      createdAt: r.createdAt,
      createdBy: r.createdBy,
      contractNumber: r.contractNumber,
      contractType: r.contractType
    }));
  }
  async getInvoiceById(id) {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || void 0;
  }
  async updateInvoiceStatus(id, status, paidDate) {
    await db.update(invoices).set({ status, paidDate: paidDate || null }).where(eq(invoices.id, id));
  }
  async deleteInvoice(id) {
    await db.delete(invoices).where(eq(invoices.id, id));
  }
  // Dashboard
  async getUserProjects(userId) {
    const results = await db.select({
      id: projects.id,
      userId: projects.userId,
      title: projects.title,
      description: projects.description,
      genre: projects.genre,
      mp3Url: projects.mp3Url,
      uploadDate: projects.uploadDate,
      votesCount: projects.votesCount,
      currentMonth: projects.currentMonth,
      approved: projects.approved,
      status: projects.status,
      username: users.username
    }).from(projects).leftJoin(users, eq(projects.userId, users.id)).where(eq(projects.userId, userId)).orderBy(desc(projects.uploadDate));
    return results.map((r) => ({
      id: r.id,
      userId: r.userId,
      title: r.title,
      description: r.description,
      genre: r.genre,
      mp3Url: r.mp3Url,
      uploadDate: r.uploadDate,
      votesCount: r.votesCount,
      currentMonth: r.currentMonth,
      approved: r.approved,
      status: r.status,
      username: r.username || "Unknown"
    }));
  }
  async getUserContracts(userId) {
    const user = await this.getUser(userId);
    if (!user) return [];
    const results = await db.select({
      id: contracts.id,
      contractNumber: contracts.contractNumber,
      contractType: contracts.contractType,
      clientEmail: contracts.clientEmail,
      userId: contracts.userId,
      pdfPath: contracts.pdfPath,
      contractData: contracts.contractData,
      createdAt: contracts.createdAt,
      createdBy: contracts.createdBy,
      username: users.username
    }).from(contracts).leftJoin(users, eq(contracts.clientEmail, users.email)).where(
      or(
        eq(contracts.userId, userId),
        eq(contracts.clientEmail, user.email)
      )
    ).orderBy(desc(contracts.createdAt));
    return results.map((r) => ({
      id: r.id,
      contractNumber: r.contractNumber,
      contractType: r.contractType,
      clientEmail: r.clientEmail,
      userId: r.userId,
      pdfPath: r.pdfPath,
      contractData: r.contractData,
      createdAt: r.createdAt,
      createdBy: r.createdBy,
      username: r.username || "Unknown"
    }));
  }
  async getDashboardOverview(userId) {
    const userProjects = await this.getUserProjects(userId);
    const projectsByStatus = userProjects.reduce((acc, project) => {
      const status = project.status || "waiting";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    const userContracts = await this.getUserContracts(userId);
    const userInvoices = await db.select({
      id: invoices.id,
      status: invoices.status,
      amount: invoices.amount,
      dueDate: invoices.dueDate,
      isOverdue: sql2`${invoices.dueDate} < now() AND ${invoices.status} = 'pending'`
    }).from(invoices).where(eq(invoices.userId, userId));
    const pendingInvoices = userInvoices.filter(
      (inv) => inv.status === "pending" && !inv.isOverdue
    ).length;
    const overdueInvoices = userInvoices.filter((inv) => inv.isOverdue).length;
    const totalAmountPending = userInvoices.filter((inv) => inv.status === "pending" || inv.isOverdue).reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0).toFixed(2);
    const unreadMessages = await this.getUnreadMessageCount(userId);
    return {
      totalProjects: userProjects.length,
      projectsByStatus,
      totalContracts: userContracts.length,
      totalInvoices: userInvoices.length,
      pendingInvoices,
      overdueInvoices,
      totalAmountPending,
      unreadMessages
    };
  }
  async updateProjectStatus(projectId, status) {
    await db.update(projects).set({ status }).where(eq(projects.id, projectId));
  }
  // Analytics
  async getNewUsersCount(period) {
    const now = /* @__PURE__ */ new Date();
    let startDate;
    if (period === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "week") {
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(now.getTime() - diff * 24 * 60 * 60 * 1e3);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    const result = await db.select({ count: sql2`count(*)::int` }).from(users).where(sql2`${users.createdAt} >= ${startDate}`);
    return result[0]?.count || 0;
  }
  async getTopProjects(limit) {
    const result = await db.select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      genre: projects.genre,
      mp3Url: projects.mp3Url,
      userId: projects.userId,
      votesCount: projects.votesCount,
      currentMonth: projects.currentMonth,
      uploadDate: projects.uploadDate,
      approved: projects.approved,
      status: projects.status,
      username: users.username
    }).from(projects).leftJoin(users, eq(projects.userId, users.id)).orderBy(desc(projects.votesCount)).limit(limit);
    return result.map((r) => ({
      ...r,
      username: r.username || "Unknown"
    }));
  }
  async getApprovedSongsCount(period) {
    const now = /* @__PURE__ */ new Date();
    let startDate;
    if (period === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "week") {
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(now.getTime() - diff * 24 * 60 * 60 * 1e3);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    const result = await db.select({ count: sql2`count(*)::int` }).from(userSongs).where(and(
      eq(userSongs.approved, true),
      sql2`${userSongs.submittedAt} >= ${startDate}`
    ));
    return result[0]?.count || 0;
  }
  async getContractStats() {
    const allContracts = await db.select().from(contracts);
    const total = allContracts.length;
    const byType = {};
    allContracts.forEach((contract) => {
      const type = contract.contractType || "unknown";
      byType[type] = (byType[type] || 0) + 1;
    });
    return { total, byType };
  }
  async getUnreadConversationsCount() {
    const result = await db.select({ count: sql2`count(DISTINCT ${messages.conversationId})::int` }).from(messages).leftJoin(
      messageReads,
      and(
        eq(messages.id, messageReads.messageId),
        sql2`${messageReads.userId} = ${messages.receiverId}`
      )
    ).where(and(
      eq(messages.deleted, false),
      sql2`${messageReads.id} IS NULL`
    ));
    return result[0]?.count || 0;
  }
};
var storage = new DatabaseStorage();

// server/websocket-helpers.ts
var wsHelpers = {
  broadcastToUser: null,
  sendNotification: null,
  getOnlineUserIds: null
};
function setBroadcastFunction(fn) {
  wsHelpers.broadcastToUser = fn;
}
function setNotificationFunction(fn) {
  wsHelpers.sendNotification = fn;
}
function setOnlineUsersAccessor(fn) {
  wsHelpers.getOnlineUserIds = fn;
}
function notifyUser(userId, title, description, variant = "default") {
  if (wsHelpers.sendNotification) {
    wsHelpers.sendNotification(userId, title, description, variant);
  } else {
    console.warn("[WS] sendNotification not initialized yet, skipping notification");
  }
}
function getOnlineUsersSnapshot() {
  if (wsHelpers.getOnlineUserIds) {
    return wsHelpers.getOnlineUserIds();
  }
  return [];
}

// server/routes.ts
init_schema();

// server/resend-client.ts
import { Resend } from "resend";
var cachedCredentials = null;
var lastVerificationCode = null;
function getLastVerificationCode() {
  return lastVerificationCode;
}
async function getCredentials() {
  if (cachedCredentials) {
    console.log("[RESEND] Using cached credentials");
    return cachedCredentials;
  }
  const directApiKey = process.env.RESEND_API_KEY;
  if (directApiKey) {
    console.log("[RESEND] Using RESEND_API_KEY from environment variables");
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    if (!fromEmail) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[RESEND] RESEND_FROM_EMAIL not set, using test domain (development only)");
        cachedCredentials = {
          apiKey: directApiKey,
          fromEmail: "onboarding@resend.dev"
        };
        return cachedCredentials;
      }
      console.error("[RESEND] RESEND_FROM_EMAIL environment variable is required in production");
      throw new Error("RESEND_FROM_EMAIL is not configured. Add it to secrets with your verified domain email (e.g., no-reply@mail.studioleflow.com)");
    }
    cachedCredentials = {
      apiKey: directApiKey,
      fromEmail
    };
    return cachedCredentials;
  }
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY ? "repl " + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? "depl " + process.env.WEB_REPL_RENEWAL : null;
  if (!xReplitToken) {
    console.error("[RESEND] X_REPLIT_TOKEN not found and no direct API key");
    throw new Error("Resend API key not configured");
  }
  console.log("[RESEND] Fetching connection settings from:", hostname);
  const response = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=resend",
    {
      headers: {
        "Accept": "application/json",
        "X_REPLIT_TOKEN": xReplitToken
      }
    }
  );
  const data = await response.json();
  const connectionSettings = data.items?.[0];
  if (!connectionSettings || !connectionSettings.settings?.api_key) {
    console.error("[RESEND] Connection settings invalid:", connectionSettings);
    throw new Error("Resend not connected");
  }
  if (!connectionSettings.settings.from_email) {
    console.error("[RESEND] Missing from_email in connection settings");
    throw new Error("Resend from_email not configured");
  }
  console.log("[RESEND] Successfully retrieved API key from connector");
  cachedCredentials = {
    apiKey: connectionSettings.settings.api_key,
    fromEmail: connectionSettings.settings.from_email
  };
  return cachedCredentials;
}
async function getResendClient() {
  try {
    const credentials = await getCredentials();
    console.log("[RESEND] Creating Resend client with fromEmail:", credentials.fromEmail);
    return {
      client: new Resend(credentials.apiKey),
      fromEmail: credentials.fromEmail
    };
  } catch (error) {
    console.error("[RESEND] Error getting Resend client:", error);
    throw error;
  }
}
function extractVerificationCode(html) {
  const codeMatch = html.match(/\b(\d{6})\b/);
  return codeMatch?.[1] ?? null;
}
async function sendEmail({
  to,
  subject,
  html,
  attachments
}) {
  const isDevelopment = process.env.NODE_ENV === "development";
  console.log("[RESEND] Sending email to:", to);
  console.log("[RESEND] Subject:", subject);
  const { client, fromEmail } = await getResendClient();
  console.log("[RESEND] From email:", fromEmail);
  try {
    const { data, error } = await client.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      ...attachments && { attachments }
    });
    if (error) {
      const isTestModeError = error.message?.includes("only send testing emails") || error.message?.includes("verify a domain");
      if (isDevelopment && isTestModeError) {
        console.log("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501");
        console.log("\u{1F527} [RESEND] TEST MODE DETECTED - Using Development Fallback");
        console.log("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501");
        console.log("\u{1F4E7} Recipient:", to);
        console.log("\u{1F4E8} Subject:", subject);
        const code = extractVerificationCode(html);
        if (code) {
          console.log("\u{1F511} VERIFICATION CODE:", code);
          lastVerificationCode = {
            email: to,
            code,
            subject,
            timestamp: Date.now()
          };
          console.log("\u{1F4A1} Use GET /api/debug/verification-code to retrieve this code");
        } else {
          console.log("\u{1F4C4} Email content (first 200 chars):", html.substring(0, 200));
        }
        console.log("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501");
        console.log("\u2139\uFE0F  To enable real emails, verify your domain at resend.com/domains");
        console.log("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501");
        return {
          success: true,
          messageId: "dev-mode-" + Date.now(),
          data: { id: "dev-mode-" + Date.now() }
        };
      }
      console.error("[RESEND] Failed to send email:", error);
      throw new Error(error.message);
    }
    console.log("[RESEND] Email sent successfully. ID:", data?.id);
    return {
      success: true,
      messageId: data?.id,
      data
    };
  } catch (error) {
    console.error("[RESEND] Unexpected error sending email:", error);
    throw error;
  }
}

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session3 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    throw new Error("Invalid password format");
  }
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function generateVerificationCode() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore
  };
  app2.set("trust proxy", 1);
  app2.use(session3(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("[AUTH] Login attempt for username/email:", username);
        let user = await storage.getUserByUsername(username);
        if (!user) {
          user = await storage.getUserByEmail(username);
        }
        if (!user) {
          console.log("[AUTH] User not found:", username);
          return done(null, false, { message: "Pogre\u0161no korisni\u010Dko ime ili lozinka" });
        }
        const passwordMatch = await comparePasswords(password, user.password);
        console.log("[AUTH] Password match:", passwordMatch);
        if (!passwordMatch) {
          console.log("[AUTH] Password mismatch for user:", username);
          return done(null, false, { message: "Pogre\u0161no korisni\u010Dko ime ili lozinka" });
        }
        if (user.banned) {
          console.log("[AUTH] User is banned:", username);
          return done(null, false, { message: "Va\u0161 nalog je banovan" });
        }
        console.log("[AUTH] Login successful for user:", user.username);
        return done(null, user);
      } catch (error) {
        console.error("[AUTH] Login error:", error);
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress || "unknown";
      const userAgent = req.headers["user-agent"] || void 0;
      const recentAttempts = await storage.getRecentRegistrationAttempts(ipAddress, 15);
      if (recentAttempts.length >= 3) {
        console.log(`[AUTH] IP rate limit exceeded for ${ipAddress}: ${recentAttempts.length} attempts in last 15 minutes`);
        return res.status(429).json({
          error: "Previ\u0161e poku\u0161aja registracije. Molimo sa\u010Dekajte 15 minuta i poku\u0161ajte ponovo."
        });
      }
      const { insertUserSchema: insertUserSchema2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const validatedData = insertUserSchema2.parse(req.body);
      const normalizedEmail = validatedData.email.toLowerCase();
      const normalizedUsername = validatedData.username.toLowerCase();
      await storage.createRegistrationAttempt({
        ipAddress,
        email: normalizedEmail,
        userAgent
      });
      const existingUser = await storage.getUserByUsername(normalizedUsername);
      if (existingUser) {
        return res.status(400).send("Korisni\u010Dko ime ve\u0107 postoji");
      }
      const existingEmail = await storage.getUserByEmail(normalizedEmail);
      if (existingEmail) {
        return res.status(400).send("Email adresa ve\u0107 postoji");
      }
      const pendingUserByEmail = await storage.getPendingUserByEmail(normalizedEmail);
      if (pendingUserByEmail) {
        return res.status(400).json({
          error: "Email adresa ve\u0107 postoji. Molimo proverite va\u0161 inbox za verifikacioni kod ili sa\u010Dekajte da prethodni zahtev istekne."
        });
      }
      const pendingUserByUsername = await storage.getPendingUserByUsername(normalizedUsername);
      if (pendingUserByUsername) {
        return res.status(400).json({
          error: "Korisni\u010Dko ime ve\u0107 postoji. Molimo odaberite drugo korisni\u010Dko ime ili sa\u010Dekajte da prethodni zahtev istekne."
        });
      }
      const verificationCode = generateVerificationCode();
      const hashedPassword = await hashPassword(validatedData.password);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
      const pendingUser = await storage.createPendingUser({
        email: normalizedEmail,
        username: normalizedUsername,
        password: hashedPassword,
        // Already hashed
        verificationCode,
        ipAddress,
        userAgent,
        termsAccepted: validatedData.termsAccepted,
        expiresAt
      });
      console.log(`[AUTH] Created pending user (id: ${pendingUser.id}) for ${normalizedEmail}`);
      console.log(`[AUTH] Attempting to send verification email to: ${validatedData.email}`);
      console.log(`[AUTH] Verification code generated: ${verificationCode}`);
      try {
        const result = await sendEmail({
          to: validatedData.email,
          subject: "Potvrdite Va\u0161u Email Adresu - Studio LeFlow",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #7c3aed;">Studio LeFlow</h2>
              <h3>Dobrodo\u0161li u Studio LeFlow zajednicu!</h3>
              <p>Hvala \u0161to ste se registrovali. Da biste zavr\u0161ili registraciju, unesite slede\u0107i verifikacioni kod:</p>
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
                <h1 style="color: #7c3aed; font-size: 36px; letter-spacing: 8px; margin: 0;">${verificationCode}</h1>
              </div>
              <p>Ovaj kod isti\u010De za 24 sata.</p>
              <p>Ako niste kreirali nalog, ignori\u0161ite ovaj email.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; font-size: 12px;">Studio LeFlow - Profesionalna Muzi\u010Dka Produkcija</p>
            </div>
          `
        });
        console.log(`[AUTH] Verification email sent successfully to ${validatedData.email}. Message ID: ${result.messageId}`);
      } catch (emailError) {
        console.error("[AUTH] Failed to send verification email:", emailError);
        console.error("[AUTH] Email error details:", emailError.message);
        await storage.deletePendingUser(pendingUser.id);
        return res.status(500).json({
          error: "Gre\u0161ka pri slanju verifikacionog email-a. Molimo proverite da li je email adresa ispravna i poku\u0161ajte ponovo."
        });
      }
      res.status(201).json({
        message: "Registracija uspe\u0161na! Proverite va\u0161 email za verifikacioni kod.",
        email: normalizedEmail,
        username: normalizedUsername
      });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Validacija nije uspela", details: error.errors });
      }
      console.error("[AUTH] Registration error:", error);
      res.status(500).send(error.message);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.status(200).json(userWithoutPassword);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
  app2.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email je obavezan" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log(`[AUTH] Password reset requested for non-existent email: ${email}`);
        return res.json({ success: true, message: "Ako email postoji, kod za reset lozinke je poslat" });
      }
      const resetToken = generateVerificationCode();
      await storage.setPasswordResetToken(user.id, resetToken);
      console.log(`[AUTH] Password reset requested for: ${email}`);
      console.log(`[AUTH] Reset code generated: ${resetToken}`);
      try {
        await sendEmail({
          to: email,
          subject: "Resetovanje Lozinke - Studio LeFlow",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #7c3aed;">Studio LeFlow</h2>
              <h3>Zahtev za Resetovanje Lozinke</h3>
              <p>Primili smo zahtev za resetovanje va\u0161e lozinke. Unesite slede\u0107i kod da biste kreirali novu lozinku:</p>
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
                <h1 style="color: #7c3aed; font-size: 36px; letter-spacing: 8px; margin: 0;">${resetToken}</h1>
              </div>
              <p>Ovaj kod isti\u010De za 15 minuta.</p>
              <p>Ako niste zatra\u017Eili resetovanje lozinke, ignori\u0161ite ovaj email. Va\u0161a lozinka ne\u0107e biti promenjena.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; font-size: 12px;">Studio LeFlow - Profesionalna Muzi\u010Dka Produkcija</p>
            </div>
          `
        });
        console.log(`[AUTH] Password reset email sent successfully to ${email}`);
      } catch (emailError) {
        console.error("[AUTH] Failed to send password reset email:", emailError);
        return res.status(500).json({
          error: "Gre\u0161ka pri slanju email-a. Molimo poku\u0161ajte ponovo."
        });
      }
      res.json({ success: true, message: "Ako email postoji, kod za reset lozinke je poslat" });
    } catch (error) {
      console.error("[AUTH] Forgot password error:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/reset-password", async (req, res) => {
    try {
      const { email, token, newPassword } = req.body;
      if (!email || !token || !newPassword) {
        return res.status(400).json({ error: "Svi parametri su obavezni" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: "Lozinka mora imati najmanje 8 karaktera" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ili istekao kod za reset lozinke" });
      }
      const isValid = await storage.verifyPasswordResetToken(user.id, token);
      if (!isValid) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ili istekao kod za reset lozinke" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await storage.updatePassword(user.id, hashedPassword);
      await storage.clearPasswordResetToken(user.id);
      console.log(`[AUTH] Password successfully reset for user: ${email}`);
      res.json({ success: true, message: "Lozinka je uspe\u0161no promenjena" });
    } catch (error) {
      console.error("[AUTH] Reset password error:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
}

// server/routes.ts
import multer from "multer";
import fs from "fs";
import path2 from "path";
import { z as z2 } from "zod";
import { randomBytes as randomBytes2 } from "crypto";
import { createRouteHandler } from "uploadthing/express";

// server/uploadthing.ts
import { createUploadthing } from "uploadthing/express";
var f = createUploadthing();
var auth = (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    throw new Error("Neautorizovan pristup");
  }
  const user = req.user;
  if (!user.emailVerified) {
    throw new Error("Morate verifikovati email adresu");
  }
  return { userId: user.id, username: user.username };
};
var uploadRouter = {
  // Audio file uploader for giveaway submissions - Only MP3 files allowed
  audioUploader: f({
    "audio/mpeg": {
      maxFileSize: "16MB",
      maxFileCount: 1
    }
  }).middleware(async ({ req, res }) => {
    const userMetadata = auth(req, res);
    return userMetadata;
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("MP3 upload complete!");
    console.log("User ID:", metadata.userId);
    console.log("File URL:", file.url);
    console.log("File name:", file.name);
    console.log("File type:", file.type);
    if (file.type !== "audio/mpeg" && !file.name.toLowerCase().endsWith(".mp3")) {
      throw new Error("Dozvoljeni su samo MP3 fajlovi");
    }
    return {
      uploadedBy: metadata.userId,
      fileUrl: file.url,
      fileName: file.name
    };
  }),
  // Avatar image uploader - Only image files allowed
  avatarUploader: f({
    "image/png": { maxFileSize: "4MB", maxFileCount: 1 },
    "image/jpeg": { maxFileSize: "4MB", maxFileCount: 1 },
    "image/webp": { maxFileSize: "4MB", maxFileCount: 1 }
  }).middleware(async ({ req, res }) => {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      throw new Error("Neautorizovan pristup");
    }
    const user = req.user;
    return { userId: user.id, username: user.username };
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Avatar upload complete!");
    console.log("User ID:", metadata.userId);
    console.log("File URL:", file.url);
    return {
      uploadedBy: metadata.userId,
      fileUrl: file.url
    };
  })
};

// server/pdf-generators.ts
import PDFDocument from "pdfkit";
import path from "path";
function drawContractLogo(doc) {
  try {
    const logoPath = path.resolve(process.cwd(), "attached_assets", "logo", "studioleflow-transparent.png");
    const logoWidth = 85;
    const headerHeight = 100;
    const headerTop = doc.page.margins.top;
    const pageWidth = doc.page.width;
    const leftMargin = doc.page.margins.left;
    const rightMargin = doc.page.margins.right;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.image(logoPath, logoX, headerTop + 10, {
      width: logoWidth,
      align: "center"
    });
    doc.fontSize(9).font("DejaVuSans").fillColor("#666666");
    const infoY = headerTop + 95;
    doc.text("Studio LeFlow | Beograd, Srbija", leftMargin, infoY, {
      width: pageWidth - leftMargin - rightMargin,
      align: "center"
    });
    const lineY = headerTop + headerHeight - 10;
    doc.strokeColor("#cccccc").lineWidth(1).moveTo(leftMargin, lineY).lineTo(pageWidth - rightMargin, lineY).stroke();
    doc.fillColor("#000000");
    return headerTop + headerHeight + 10;
  } catch (error) {
    console.error("[PDF] Failed to load logo:", error);
    return doc.page.margins.top + 20;
  }
}
function generateMixMasterPDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 72, right: 72 }
    });
    doc.registerFont("DejaVuSans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf");
    doc.registerFont("DejaVuSans-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf");
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
    const bodyStartY = drawContractLogo(doc);
    doc.y = bodyStartY;
    doc.fontSize(14).font("DejaVuSans-Bold").text("UGOVOR O PRU\u017DANJU USLUGA MIXINGA I MASTERINGA", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(10).font("DejaVuSans").text(`Zaklju\u010Den dana ${data.contractDate} godine u ${data.contractPlace}, izme\u0111u slede\u0107ih ugovornih strana:`, { align: "left" });
    doc.moveDown();
    doc.fontSize(11).font("DejaVuSans-Bold").text("1. Pru\u017Ealac usluge (Studio)");
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Ime i prezime / poslovno ime: ${data.studioName}`);
    doc.text(`Adresa: ${data.studioAddress}`);
    doc.text(`Mati\u010Dni broj: ${data.studioMaticniBroj}`);
    doc.moveDown();
    doc.fontSize(11).font("DejaVuSans-Bold").text("2. Naru\u010Dilac usluge");
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Ime i prezime / poslovno ime: ${data.clientName}`);
    doc.text(`Adresa: ${data.clientAddress}`);
    doc.text(`Mati\u010Dni broj: ${data.clientMaticniBroj}`);
    doc.moveDown();
    doc.fontSize(10).text('(u daljem tekstu zajedni\u010Dki: "Ugovorne strane").');
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 1. Predmet ugovora", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Predmet ovog ugovora je pru\u017Eanje usluge profesionalnog miksanja i masteringa slede\u0107eg muzi\u010Dkog dela:");
    doc.moveDown(0.5);
    doc.text(`Naziv pesme / projekta: ${data.projectName}`);
    doc.text(`Broj kanala / stemova: ${data.channelCount}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 2. Obaveze Pru\u017Eaoca usluge", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Pru\u017Ealac usluge se obavezuje da:");
    doc.text("\u2013 izvr\u0161i tehni\u010Dku obradu materijala (mix i mastering) prema profesionalnim standardima;");
    doc.text(`\u2013 isporu\u010Di finalne fajlove u formatu: ${data.deliveryFormat}`);
    doc.text(`\u2013 isporuku izvr\u0161i najkasnije do ${data.deliveryDate}.`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 3. Obaveze Naru\u010Dioca", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Naru\u010Dilac se obavezuje da:");
    doc.text("\u2013 dostavi sve potrebne fajlove i informacije potrebne za rad na projektu;");
    doc.text("\u2013 blagovremeno odobri radne verzije ili dostavi primedbe;");
    doc.text("\u2013 isplati ugovorenu naknadu u predvi\u0111enom roku.");
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 4. Naknada i uslovi pla\u0107anja", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Ukupna naknada za izvr\u0161enje usluge iznosi: ${data.totalAmount} RSD / EUR.`);
    doc.moveDown(0.5);
    doc.text("Raspored pla\u0107anja:");
    doc.text(`\u2013 Avans (pre po\u010Detka rada): ${data.advancePayment} RSD / EUR`);
    doc.text(`\u2013 Ostatak (po zavr\u0161etku usluge, pre isporuke finalnih fajlova): ${data.remainingPayment} RSD / EUR`);
    doc.text(`Na\u010Din pla\u0107anja: ${data.paymentMethod}`);
    doc.moveDown();
    doc.text("U slu\u010Daju nepla\u0107anja u predvi\u0111enom roku, Pru\u017Ealac usluge zadr\u017Eava pravo da raskine ovaj ugovor i da snimke ponudi tre\u0107im licima ili koristi u druge svrhe, bez prava Naru\u010Dioca na naknadu \u0161tete.");
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 5. Odgovornost i reklamacije", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Pru\u017Ealac usluge garantuje kvalitet obrade prema profesionalnim standardima.");
    doc.text("Naru\u010Dilac ima pravo na do dve runde revizija finalne verzije.");
    doc.text("Naknadne izmene i dodatne revizije se napla\u0107uju po dogovoru.");
    doc.text("Reklamacije se prihvataju isklju\u010Divo u roku od 7 dana od dana isporuke finalnih fajlova.");
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 6. Autorska prava", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Ovim ugovorom Pru\u017Ealac usluge ne sti\u010De nikakva autorska prava na muzi\u010Dko delo koje je predmet obrade.");
    doc.text("Sva autorska prava na pesmu i originalne snimke ostaju u vlasni\u0161tvu Naru\u010Dioca.");
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 7. Snimanje vokala i prava na snimke", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Snimanje vokala je izvr\u0161eno u studiju LeFlow Studio: ${data.vocalRecording === "yes" ? "DA" : "NE"}`);
    doc.moveDown(0.5);
    if (data.vocalRecording === "yes") {
      doc.text("Ugovorne strane se sla\u017Eu da:");
      if (data.vocalRights === "client") {
        doc.text("\u2611 Sva prava na vokalne snimke i izvedbu prenose se isklju\u010Divo na Naru\u010Dioca.");
      } else if (data.vocalRights === "studio") {
        doc.text("\u2611 Pru\u017Ealac usluge zadr\u017Eava pravo da koristi snimke isklju\u010Divo u promotivne svrhe studija (portfolio, sajt, dru\u0161tvene mre\u017Ee), uz obavezu navo\u0111enja imena izvo\u0111a\u010Da.");
      } else {
        doc.text(`\u2611 Drugo: ${data.vocalRightsOther || ""}`);
      }
    }
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 8. Nadle\u017Enost", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Za re\u0161avanje eventualnih sporova nadle\u017Ean je sud u: ${data.jurisdiction}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 9. Zavr\u0161ne odredbe", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Ovaj ugovor je sa\u010Dinjen u ${data.copies} istovetnih primeraka, od kojih svaka ugovorna strana zadr\u017Eava po jedan.`);
    doc.moveDown();
    doc.text("Potpisivanjem ugovora, strane potvr\u0111uju da su saglasne sa svim odredbama i da ga zaklju\u010Duju slobodnom voljom.");
    doc.moveDown(3);
    doc.fontSize(10).font("DejaVuSans");
    doc.text("____________________________", 100, doc.y, { continued: true, width: 200 });
    doc.text("____________________________", 320, doc.y - doc.currentLineHeight(), { width: 200 });
    doc.moveDown(2);
    doc.text(`Datum: ${data.finalDate}`, { align: "center" });
    doc.end();
  });
}
function generateCopyrightTransferPDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 72, right: 72 }
    });
    doc.registerFont("DejaVuSans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf");
    doc.registerFont("DejaVuSans-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf");
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
    const bodyStartY = drawContractLogo(doc);
    doc.y = bodyStartY;
    doc.fontSize(14).font("DejaVuSans-Bold").text("UGOVOR O PRENOSU IMOVINSKIH AUTORSKIH PRAVA", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(10).font("DejaVuSans").text(`Zaklju\u010Den dana ${data.contractDate} godine u ${data.contractPlace}, izme\u0111u slede\u0107ih ugovornih strana:`, { align: "left" });
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("1. Autor/Prodavac", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Ime i prezime / poslovno ime: ${data.authorName}`);
    doc.text(`Adresa: ${data.authorAddress}`);
    doc.text(`Mati\u010Dni broj: ${data.authorMaticniBroj}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("2. Kupac", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Ime i prezime / poslovno ime: ${data.buyerName}`);
    doc.text(`Adresa: ${data.buyerAddress}`);
    doc.text(`Mati\u010Dni broj: ${data.buyerMaticniBroj}`);
    doc.moveDown();
    doc.fontSize(10).text('(u daljem tekstu zajedni\u010Dki: "Ugovorne strane").');
    doc.moveDown(3);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 1. Predmet ugovora", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Predmet ovog ugovora je prenos imovinskih autorskih prava na slede\u0107em autorskom delu:");
    doc.moveDown(0.5);
    doc.text(`Naziv pesme: ${data.songTitle}`);
    doc.moveDown();
    doc.text("Delo obuhvata slede\u0107e komponente:");
    if (data.components.text) doc.text("\u2611 Tekst");
    if (data.components.music) doc.text("\u2611 Muziku (instrumental)");
    if (data.components.vocals) doc.text("\u2611 Snimanje vokala");
    if (data.components.mixMaster) doc.text("\u2611 Miks i mastering");
    if (data.components.other) doc.text(`\u2611 Ostalo: ${data.components.otherText || ""}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 2. Vrsta prenosa prava", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Autor prenosi slede\u0107a imovinska autorska prava:");
    doc.text(data.rightsType === "exclusive" ? "\u2611 Isklju\u010Diva prava" : "\u2611 Neisklju\u010Diva prava");
    doc.moveDown();
    doc.text("Obuhvat prenosa prava:");
    if (data.rightsScope.reproduction) doc.text("\u2611 Reprodukovanje i umno\u017Eavanje dela");
    if (data.rightsScope.distribution) doc.text("\u2611 Distribucija i digitalna prodaja");
    if (data.rightsScope.performance) doc.text("\u2611 Javno izvo\u0111enje i emitovanje");
    if (data.rightsScope.adaptation) doc.text("\u2611 Prerada i adaptacija");
    if (data.rightsScope.other) doc.text(`\u2611 Ostalo: ${data.rightsScope.otherText || ""}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 3. Teritorija kori\u0161\u0107enja", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Prenos prava se odnosi na teritoriju: ${data.territory}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 4. Trajanje prenosa prava", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Prenos prava se zaklju\u010Duje na period: ${data.duration}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 5. Naknada i uslovi pla\u0107anja", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Kupac se obavezuje da Autor/Prodavcu isplati ukupan iznos naknade u visini od: ${data.totalAmount} RSD / EUR`);
    doc.moveDown();
    doc.text("Raspored pla\u0107anja:");
    doc.text(`\u2013 I rata u iznosu od ${data.firstPayment} RSD/EUR, do ${data.firstPaymentDate}`);
    doc.text(`\u2013 II rata u iznosu od ${data.secondPayment} RSD/EUR, do ${data.secondPaymentDate}`);
    doc.text("(U slu\u010Daju nepla\u0107anja u predvi\u0111enom roku, Autor zadr\u017Eava pravo da delo ponudi i proda tre\u0107im licima.)");
    doc.moveDown();
    doc.text(`Na\u010Din pla\u0107anja: ${data.paymentMethod}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 6. Podela prihoda od kori\u0161\u0107enja dela (Streaming servis)", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Ugovorne strane su saglasne da se prihod ostvaren od eksploatacije dela deli na slede\u0107i na\u010Din:");
    doc.text(`\u2013 Procenat prihoda koji pripada Autor/Prodavcu: ${data.authorPercentage}%`);
    doc.text(`\u2013 Procenat prihoda koji pripada Kupcu: ${data.buyerPercentage}%`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 7. Moralna prava", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Autor zadr\u017Eava moralna prava na delu, uklju\u010Duju\u0107i:");
    doc.text("\u2013 Pravo da bude priznat i ozna\u010Den kao autor dela;");
    doc.text("\u2013 Pravo da delo ne bude menjano, obra\u0111ivano ili prilago\u0111avano bez njegove prethodne pisane saglasnosti.");
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 8. Nadle\u017Enost", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Za tuma\u010Denje i sprovo\u0111enje ovog ugovora nadle\u017Ean je sud u: ${data.jurisdiction}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 9. Zavr\u0161ne odredbe", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Ovaj ugovor je sa\u010Dinjen u ${data.copies} istovetnih primeraka, od kojih svaka ugovorna strana zadr\u017Eava po jedan.`);
    doc.text("Potpisivanjem ugovora strane potvr\u0111uju da su saglasne sa svim odredbama i da ga zaklju\u010Duju slobodnom voljom.");
    doc.moveDown(3);
    doc.fontSize(10).font("DejaVuSans");
    doc.text("____________________________", { align: "left" });
    doc.text("Autor/Prodavac", { align: "left" });
    doc.moveDown(2);
    doc.text("____________________________", { align: "left" });
    doc.text("Kupac", { align: "left" });
    doc.moveDown(2);
    doc.text(`Datum: ${data.finalDate}`, { align: "center" });
    doc.end();
  });
}
function generateInstrumentalSalePDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 72, right: 72 }
    });
    doc.registerFont("DejaVuSans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf");
    doc.registerFont("DejaVuSans-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf");
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
    const bodyStartY = drawContractLogo(doc);
    doc.y = bodyStartY;
    doc.fontSize(14).font("DejaVuSans-Bold").text("LICENCA ZA KORI\u0160\u0106ENJE INSTRUMENTALA", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(10).font("DejaVuSans").text(`Izdata dana ${data.contractDate} godine u ${data.contractPlace}`, { align: "left" });
    doc.moveDown(2);
    doc.fontSize(11).font("DejaVuSans-Bold").text("Izdava\u010D licence (Studio)");
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Ime i prezime / poslovno ime: ${data.authorName}`);
    doc.text(`Adresa: ${data.authorAddress}`);
    doc.moveDown(2);
    doc.fontSize(11).font("DejaVuSans-Bold").text("Korisnik licence");
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Ime i prezime / poslovno ime: ${data.buyerName}`);
    doc.text(`Adresa: ${data.buyerAddress}`);
    doc.text(`Mati\u010Dni broj: ${data.buyerMaticniBroj}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 1. Predmet licence", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Predmet ove licence je kori\u0161\u0107enje slede\u0107eg muzi\u010Dkog instrumentala:");
    doc.moveDown(0.5);
    doc.text(`Naziv instrumentala: ${data.instrumentalName}`);
    doc.text(`Trajanje: ${data.duration}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 2. Vrsta licence", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Korisniku se izdaje slede\u0107a vrsta licence:");
    doc.moveDown();
    doc.text(data.rightsType === "exclusive" ? "\u2611 Isklju\u010Diva licenca" : "\u2611 Neisklju\u010Diva licenca");
    doc.moveDown();
    doc.text("Opseg dozvoljenog kori\u0161\u0107enja:");
    if (data.rightsScope.reproduction) doc.text("\u2611 Reprodukovanje i umno\u017Eavanje");
    if (data.rightsScope.distribution) doc.text("\u2611 Distribucija i digitalna prodaja");
    if (data.rightsScope.performance) doc.text("\u2611 Javno izvo\u0111enje i emitovanje");
    if (data.rightsScope.adaptation) doc.text("\u2611 Prerada i adaptacija");
    if (data.rightsScope.other) doc.text(`\u2611 Ostalo: ${data.rightsScope.otherText || ""}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 3. Teritorija kori\u0161\u0107enja", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Licenca se odnosi na teritoriju: ${data.territory}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 4. Trajanje licence", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Licenca se izdaje na period: ${data.durationPeriod}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 5. Naknada za licencu", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Ukupna naknada za licencu iznosi: ${data.totalAmount} RSD / EUR.`);
    doc.moveDown();
    doc.text("Raspored pla\u0107anja:");
    doc.text(`\u2013 Avans: ${data.advancePayment} RSD / EUR`);
    doc.text(`\u2013 Ostatak: ${data.remainingPayment} RSD / EUR`);
    doc.moveDown();
    doc.text(`Na\u010Din pla\u0107anja: ${data.paymentMethod}`);
    doc.moveDown();
    doc.text("U slu\u010Daju nepla\u0107anja u predvi\u0111enom roku, licenca postaje neva\u017Ee\u0107a.");
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 6. Podela prihoda od kori\u0161\u0107enja", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Prihod od kori\u0161\u0107enja instrumentala deli se na slede\u0107i na\u010Din:");
    doc.text(`\u2013 Procenat prihoda koji pripada Izdava\u010Du: ${data.authorPercentage}%`);
    doc.text(`\u2013 Procenat prihoda koji pripada Korisniku: ${data.buyerPercentage}%`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 7. Autorska prava", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text("Izdava\u010D zadr\u017Eava sva autorska i moralna prava na instrumentalu, uklju\u010Duju\u0107i:");
    doc.text("\u2013 Pravo da bude priznat i ozna\u010Den kao autor instrumentala.");
    doc.text("\u2013 Pravo da instrumental ne bude menjan bez prethodne pisane saglasnosti.");
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 8. Nadle\u017Enost", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Za re\u0161avanje eventualnih sporova nadle\u017Ean je sud u: ${data.jurisdiction}`);
    doc.moveDown(2);
    doc.fontSize(12).font("DejaVuSans-Bold").text("\u010Clan 9. Va\u017Enost licence", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("DejaVuSans");
    doc.text(`Ova licenca je izdata u ${data.copies} primerka i stupa na snagu danom pla\u0107anja naknade.`);
    doc.moveDown();
    doc.text("Kori\u0161\u0107enjem instrumentala, Korisnik potvr\u0111uje da prihvata sve uslove navedene u ovoj licenci.");
    doc.moveDown(3);
    doc.fontSize(10).font("DejaVuSans");
    doc.text("____________________________", 100, doc.y, { continued: true, width: 200 });
    doc.text("____________________________", 320, doc.y - doc.currentLineHeight(), { width: 200 });
    doc.moveDown(2);
    doc.text(`Datum izdavanja: ${data.finalDate}`, { align: "center" });
    doc.end();
  });
}

// server/routes.ts
var multerUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = path2.join(process.cwd(), "attached_assets", "temp");
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB max for images
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Samo slike su dozvoljene"));
    }
  }
});
function escapeHtml(text2) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text2.replace(/[&<>"']/g, (m) => map[m] || m);
}
var analyticsCache = /* @__PURE__ */ new Map();
var CACHE_TTL = 45e3;
function getCachedData(key) {
  const entry = analyticsCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    analyticsCache.delete(key);
    return null;
  }
  return entry.data;
}
function setCachedData(key, data) {
  analyticsCache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL
  });
}
function sanitizeUser(user) {
  const {
    password,
    verificationCode,
    passwordResetToken,
    passwordResetExpiry,
    adminLoginToken,
    adminLoginExpiry,
    ...sanitized
  } = user;
  return sanitized;
}
var contactRateLimits = /* @__PURE__ */ new Map();
var RATE_LIMIT_WINDOW = 60 * 60 * 1e3;
var MAX_REQUESTS_PER_HOUR = 3;
function getClientIp(req) {
  const ip = req.ip;
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip === "::ffff:127.0.0.1") {
    return null;
  }
  return ip;
}
function checkContactRateLimit(ip) {
  const now = Date.now();
  const timestamps = contactRateLimits.get(ip) || [];
  const recentTimestamps = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW);
  if (recentTimestamps.length >= MAX_REQUESTS_PER_HOUR) {
    const oldestTimestamp = Math.min(...recentTimestamps);
    const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - (now - oldestTimestamp)) / 6e4);
    return { allowed: false, remainingTime };
  }
  recentTimestamps.push(now);
  contactRateLimits.set(ip, recentTimestamps);
  return { allowed: true };
}
function requireAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  if (req.user.banned) {
    return res.status(403).json({
      error: "Va\u0161 nalog je suspendovan. Kontaktirajte administratora za vi\u0161e informacija.",
      banned: true
    });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Samo administratori mogu pristupiti ovoj funkcionalnosti" });
  }
  next();
}
function requireVerifiedEmail(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  if (req.user.banned) {
    return res.status(403).json({
      error: "Va\u0161 nalog je suspendovan. Kontaktirajte administratora za vi\u0161e informacija.",
      banned: true
    });
  }
  if (!req.user.emailVerified) {
    return res.status(403).json({
      error: "Morate verifikovati email adresu da biste pristupili ovoj funkcionalnosti",
      requiresVerification: true
    });
  }
  next();
}
async function checkMaintenanceMode(req, res, next) {
  const allowedPaths = [
    "/maintenance",
    "/login",
    "/logout",
    "/user",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/admin",
    "/admin-login-request",
    "/admin-login-verify"
  ];
  const isAllowedPath = allowedPaths.some((path6) => req.path.startsWith(path6));
  if (isAllowedPath) {
    return next();
  }
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  const isMaintenanceMode = await storage.getMaintenanceMode();
  if (isMaintenanceMode) {
    return res.status(503).json({
      error: "Sajt je trenutno u pripremi",
      maintenanceMode: true
    });
  }
  next();
}
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/maintenance", async (_req, res) => {
    try {
      const isActive = await storage.getMaintenanceMode();
      res.json({ maintenanceMode: isActive });
    } catch (error) {
      console.error("Error getting maintenance mode:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/maintenance", requireAdmin, async (req, res) => {
    try {
      const { maintenanceMode } = req.body;
      if (typeof maintenanceMode !== "boolean") {
        return res.status(400).json({ error: "maintenanceMode mora biti boolean" });
      }
      await storage.setMaintenanceMode(maintenanceMode);
      console.log(`[ADMIN] Maintenance mode ${maintenanceMode ? "aktiviran" : "deaktiviran"} od strane ${req.user.username}`);
      res.json({ success: true, maintenanceMode });
    } catch (error) {
      console.error("Error setting maintenance mode:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/debug/verification-code", (req, res) => {
    if (process.env.NODE_ENV !== "development") {
      return res.status(404).json({ error: "Not found" });
    }
    const lastCode = getLastVerificationCode();
    if (!lastCode) {
      return res.json({
        message: "No verification code available yet. Register a new user to generate one."
      });
    }
    return res.json({
      email: lastCode.email,
      code: lastCode.code,
      subject: lastCode.subject,
      timestamp: new Date(lastCode.timestamp).toISOString(),
      age: Math.round((Date.now() - lastCode.timestamp) / 1e3) + " seconds ago"
    });
  });
  app2.use(
    "/api/uploadthing",
    createRouteHandler({
      router: uploadRouter,
      config: {
        token: process.env.UPLOADTHING_SECRET || process.env.UPLOADTHING_TOKEN
      }
    })
  );
  app2.use("/api", checkMaintenanceMode);
  app2.post("/api/upload-image", requireAdmin, multerUpload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Fajl nije prilo\u017Een" });
      }
      const tempPath = req.file.path;
      const fileName = req.file.filename;
      const permanentDir = path2.join(process.cwd(), "attached_assets", "cms_images");
      fs.mkdirSync(permanentDir, { recursive: true });
      const permanentPath = path2.join(permanentDir, fileName);
      fs.renameSync(tempPath, permanentPath);
      const url = `/attached_assets/cms_images/${fileName}`;
      res.json({ url });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri upload-u slike" });
    }
  });
  app2.post("/api/verify-email", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Verifikacioni kod je obavezan" });
      }
      const pendingUser = await storage.getPendingUserByCode(code);
      if (!pendingUser) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i verifikacioni kod" });
      }
      if (/* @__PURE__ */ new Date() > new Date(pendingUser.expiresAt)) {
        await storage.deletePendingUser(pendingUser.id);
        return res.status(400).json({
          error: "Verifikacioni kod je istekao. Molimo registrujte se ponovo."
        });
      }
      let user;
      try {
        user = await storage.movePendingToUsers(pendingUser.id);
      } catch (moveError) {
        console.error("[VERIFY] Failed to move pending user to users:", moveError);
        if (moveError.message.includes("already")) {
          return res.status(400).json({ error: moveError.message });
        }
        return res.status(500).json({ error: "Gre\u0161ka pri kreiranju naloga" });
      }
      console.log(`[VERIFY] Successfully created and verified user ${user.username} (id: ${user.id})`);
      if (user.banned) {
        return res.status(403).json({ error: "Va\u0161 nalog je banovan" });
      }
      req.login(user, (err) => {
        if (err) {
          console.error("[VERIFY] Login error after verification:", err);
          return res.status(500).json({ error: "Gre\u0161ka pri prijavljivanju" });
        }
        const { password, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
      });
    } catch (error) {
      console.error("[VERIFY] Verification error:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email je obavezan" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "Korisnik sa ovim emailom nije prona\u0111en" });
      }
      if (user.emailVerified) {
        return res.status(400).json({ error: "Email je ve\u0107 verifikovan" });
      }
      const verificationCode = Math.floor(1e5 + Math.random() * 9e5).toString();
      await storage.setVerificationCode(user.id, verificationCode);
      try {
        await sendEmail({
          to: email,
          subject: "Novi Verifikacioni Kod - Studio LeFlow",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #7c3aed;">Studio LeFlow</h2>
              <h3>Novi Verifikacioni Kod</h3>
              <p>Ovde je Va\u0161 novi verifikacioni kod:</p>
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
                <h1 style="color: #7c3aed; font-size: 36px; letter-spacing: 8px; margin: 0;">${verificationCode}</h1>
              </div>
              <p>Ovaj kod isti\u010De za 15 minuta.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; font-size: 12px;">Studio LeFlow - Profesionalna Muzi\u010Dka Produkcija</p>
            </div>
          `
        });
        return res.json({ success: true, message: "Novi verifikacioni kod je poslat" });
      } catch (emailError) {
        console.error("Gre\u0161ka pri slanju emaila:", emailError);
        return res.status(500).json({ error: "Gre\u0161ka pri slanju emaila" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/admin-login-request", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Korisni\u010Dko ime ili email i lozinka su obavezni" });
      }
      const isEmail = username.includes("@");
      const user = isEmail ? await storage.getUserByEmail(username) : await storage.getUserByUsername(username);
      if (!user) {
        console.log(`[Admin Login] Failed: User not found (${username})`);
        return res.status(401).json({ error: "Neispravno korisni\u010Dko ime ili lozinka" });
      }
      const validPassword = await comparePasswords(password, user.password);
      if (!validPassword) {
        console.log(`[Admin Login] Failed: Invalid password for user ${user.username}`);
        return res.status(401).json({ error: "Neispravno korisni\u010Dko ime ili lozinka" });
      }
      if (user.role !== "admin") {
        console.log(`[Admin Login] Failed: User ${user.username} is not admin (role: ${user.role})`);
        return res.status(401).json({ error: "Neispravno korisni\u010Dko ime ili lozinka" });
      }
      if (user.banned) {
        console.log(`[Admin Login] Failed: User ${user.username} is banned`);
        return res.status(401).json({ error: "Neispravno korisni\u010Dko ime ili lozinka" });
      }
      const verificationCode = Math.floor(1e5 + Math.random() * 9e5).toString();
      await storage.setAdminLoginToken(user.id, verificationCode);
      try {
        await sendEmail({
          to: user.email,
          subject: "Verifikacioni Kod Za Admin Prijavu - Studio LeFlow",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #7c3aed;">Studio LeFlow - Admin Prijava</h2>
              <h3>Verifikacioni Kod</h3>
              <p>Poku\u0161aj prijave na admin panel. Ako ovo niste Vi, ignori\u0161ite ovaj email.</p>
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
                <h1 style="color: #7c3aed; font-size: 36px; letter-spacing: 8px; margin: 0;">${verificationCode}</h1>
              </div>
              <p>Ovaj kod isti\u010De za 15 minuta.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; font-size: 12px;">Studio LeFlow - Profesionalna Muzi\u010Dka Produkcija</p>
            </div>
          `
        });
        return res.json({
          success: true,
          message: "Verifikacioni kod je poslat na Va\u0161 email",
          userId: user.id
        });
      } catch (emailError) {
        console.error("Gre\u0161ka pri slanju emaila:", emailError);
        return res.status(500).json({ error: "Gre\u0161ka pri slanju emaila" });
      }
    } catch (error) {
      console.error("Admin login request error:", error);
      return res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/admin-login-verify", async (req, res) => {
    try {
      const { userId, code } = req.body;
      if (!userId || !code) {
        return res.status(400).json({ error: "Svi podaci su obavezni" });
      }
      const isValid = await storage.verifyAdminLoginToken(userId, code);
      if (!isValid) {
        return res.status(401).json({ error: "Neispravan ili istekao kod" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Korisnik nije prona\u0111en" });
      }
      if (user.role !== "admin") {
        return res.status(403).json({ error: "Nemate admin privilegije" });
      }
      if (user.banned) {
        return res.status(403).json({ error: "Va\u0161 nalog je banovan" });
      }
      await storage.clearAdminLoginToken(userId);
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ error: "Gre\u0161ka pri prijavljivanju" });
        }
        const { password, verificationCode, adminLoginToken, ...userWithoutSensitiveData } = user;
        res.json({ success: true, user: userWithoutSensitiveData });
      });
    } catch (error) {
      console.error("Admin login verify error:", error);
      return res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      if (clientIp) {
        const rateLimitCheck = checkContactRateLimit(clientIp);
        if (!rateLimitCheck.allowed) {
          return res.status(429).json({
            error: `Poslali ste previ\u0161e upita. Molimo poku\u0161ajte ponovo za ${rateLimitCheck.remainingTime} minuta.`
          });
        }
      }
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      try {
        await sendEmail({
          to: "business@studioleflow.com",
          subject: `Novi upit - ${escapeHtml(validatedData.service)}`,
          html: `
            <h2>Novi upit sa Studio LeFlow sajta</h2>
            <p><strong>Usluga:</strong> ${escapeHtml(validatedData.service)}</p>
            <p><strong>Ime:</strong> ${escapeHtml(validatedData.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(validatedData.email)}</p>
            <p><strong>Telefon:</strong> ${escapeHtml(validatedData.phone)}</p>
            ${validatedData.preferredDate ? `<p><strong>\u017Deljeni termin:</strong> ${escapeHtml(validatedData.preferredDate)}</p>` : ""}
            <p><strong>Poruka:</strong></p>
            <p>${escapeHtml(validatedData.message).replace(/\n/g, "<br>")}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Poslato automatski sa Studio LeFlow sajta</p>
          `
        });
      } catch (emailError) {
        console.error("Gre\u0161ka pri slanju email-a:", emailError);
      }
      res.json(submission);
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Validacija nije uspela", details: error.errors });
      } else {
        res.status(500).json({ error: "Gre\u0161ka na serveru" });
      }
    }
  });
  app2.get("/api/contact", async (_req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = insertNewsletterSubscriberSchema.parse(req.body);
      const existingSubscriber = await storage.getNewsletterSubscriberByEmail(email);
      if (existingSubscriber) {
        if (existingSubscriber.status === "confirmed") {
          return res.status(400).json({ error: "Email je ve\u0107 prijavljen na newsletter" });
        } else if (existingSubscriber.status === "pending") {
          return res.status(400).json({ error: "Email ve\u0107 postoji - proverite inbox za link za potvrdu" });
        } else if (existingSubscriber.status === "unsubscribed") {
          const confirmationToken2 = randomBytes2(32).toString("hex");
          await storage.createNewsletterSubscriber(email, confirmationToken2);
          try {
            const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS}` : "http://localhost:5000";
            const confirmUrl = `${baseUrl}/newsletter/potvrda/${confirmationToken2}`;
            await sendEmail({
              to: email,
              subject: "Potvrdite prijavu na Studio LeFlow newsletter",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background-color: #4542f5; padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Studio LeFlow</h1>
                  </div>
                  <div style="padding: 30px; background-color: #ffffff;">
                    <h2 style="color: #333;">Potvrdite svoju email adresu</h2>
                    <p>Hvala \u0161to ste se prijavili na Studio LeFlow newsletter!</p>
                    <p>Kliknite na dugme ispod da potvrdite svoju email adresu:</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${confirmUrl}" style="background-color: #4542f5; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Potvrdi email</a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Ili kopirajte i nalepite ovaj link u pretra\u017Eiva\u010D:</p>
                    <p style="color: #4542f5; word-break: break-all; font-size: 12px;">${confirmUrl}</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #666; font-size: 12px;">Ako niste zatra\u017Eili prijavu na newsletter, ignori\u0161ite ovaj email.</p>
                  </div>
                </div>
              `
            });
          } catch (emailError) {
            console.error("Gre\u0161ka pri slanju confirmation email-a:", emailError);
            return res.status(500).json({ error: "Gre\u0161ka pri slanju email-a za potvrdu" });
          }
          return res.json({ message: "Uspe\u0161no! Proverite email za link za potvrdu" });
        }
      }
      const confirmationToken = randomBytes2(32).toString("hex");
      await storage.createNewsletterSubscriber(email, confirmationToken);
      try {
        const baseUrl = process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS}` : "http://localhost:5000";
        const confirmUrl = `${baseUrl}/newsletter/potvrda/${confirmationToken}`;
        await sendEmail({
          to: email,
          subject: "Potvrdite prijavu na Studio LeFlow newsletter",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #4542f5; padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Studio LeFlow</h1>
              </div>
              <div style="padding: 30px; background-color: #ffffff;">
                <h2 style="color: #333;">Potvrdite svoju email adresu</h2>
                <p>Hvala \u0161to ste se prijavili na Studio LeFlow newsletter!</p>
                <p>Kliknite na dugme ispod da potvrdite svoju email adresu:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmUrl}" style="background-color: #4542f5; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Potvrdi email</a>
                </div>
                <p style="color: #666; font-size: 14px;">Ili kopirajte i nalepite ovaj link u pretra\u017Eiva\u010D:</p>
                <p style="color: #4542f5; word-break: break-all; font-size: 12px;">${confirmUrl}</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #666; font-size: 12px;">Ako niste zatra\u017Eili prijavu na newsletter, ignori\u0161ite ovaj email.</p>
              </div>
            </div>
          `
        });
      } catch (emailError) {
        console.error("Gre\u0161ka pri slanju confirmation email-a:", emailError);
        return res.status(500).json({ error: "Gre\u0161ka pri slanju email-a za potvrdu" });
      }
      res.json({ message: "Uspe\u0161no! Proverite email za link za potvrdu" });
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Unesite validnu email adresu" });
      } else {
        console.error("Newsletter subscribe error:", error);
        res.status(500).json({ error: "Gre\u0161ka na serveru" });
      }
    }
  });
  app2.get("/api/newsletter/confirm/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const success = await storage.confirmNewsletterSubscription(token);
      if (!success) {
        return res.status(400).json({ error: "Link za potvrdu je neva\u017Ee\u0107i ili je ve\u0107 iskori\u0161\u0107en" });
      }
      res.json({ message: "Email uspe\u0161no potvr\u0111en! Hvala \u0161to ste se prijavili na na\u0161 newsletter" });
    } catch (error) {
      console.error("Newsletter confirm error:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email je obavezan" });
      }
      const success = await storage.unsubscribeNewsletter(email);
      if (!success) {
        return res.status(400).json({ error: "Email nije prona\u0111en u listi pretplatnika" });
      }
      res.json({ message: "Uspe\u0161no ste se odjavili sa newslettera" });
    } catch (error) {
      console.error("Newsletter unsubscribe error:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/newsletter/subscribers", requireAdmin, async (_req, res) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Newsletter subscribers error:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/newsletter/stats", requireAdmin, async (_req, res) => {
    try {
      const stats = await storage.getNewsletterStats();
      res.json(stats);
    } catch (error) {
      console.error("Newsletter stats error:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.delete("/api/newsletter/subscribers/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID" });
      }
      const success = await storage.deleteNewsletterSubscriber(id);
      if (!success) {
        return res.status(404).json({ error: "Pretplatnik nije prona\u0111en" });
      }
      res.json({ message: "Pretplatnik je uspe\u0161no uklonjen" });
    } catch (error) {
      console.error("Delete newsletter subscriber error:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/newsletter/send", requireAdmin, async (req, res) => {
    try {
      const { subject, htmlContent } = req.body;
      if (!subject || !htmlContent) {
        return res.status(400).json({ error: "Subject i sadr\u017Eaj su obavezni" });
      }
      const subscribers = await storage.getConfirmedNewsletterSubscribers();
      if (subscribers.length === 0) {
        return res.status(400).json({ error: "Nema potvr\u0111enih pretplatnika" });
      }
      const emailPromises = subscribers.map(
        (subscriber) => sendEmail({
          to: subscriber.email,
          subject,
          html: htmlContent
        })
      );
      await Promise.all(emailPromises);
      res.json({
        message: `Newsletter uspe\u0161no poslat na ${subscribers.length} email adresa`,
        count: subscribers.length
      });
    } catch (error) {
      console.error("Send newsletter error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri slanju newslettera" });
    }
  });
  app2.post("/api/user/accept-terms", requireVerifiedEmail, async (req, res) => {
    try {
      await storage.acceptTerms(req.user.id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.put("/api/user/update-profile", requireVerifiedEmail, async (req, res) => {
    try {
      let { username, email } = req.body;
      const userId = req.user.id;
      if (email) email = email.toLowerCase();
      if (username) username = username.toLowerCase();
      if (username && username.trim().length < 3) {
        return res.status(400).json({ error: "Korisni\u010Dko ime mora imati najmanje 3 karaktera" });
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Unesite validnu email adresu" });
      }
      if (username && username !== req.user.username.toLowerCase()) {
        const user = await storage.getUser(userId);
        if (user?.usernameLastChanged) {
          const daysSinceLastChange = Math.floor(
            (Date.now() - new Date(user.usernameLastChanged).getTime()) / (1e3 * 60 * 60 * 24)
          );
          if (daysSinceLastChange < 30) {
            return res.status(400).json({
              error: `Mo\u017Eete promeniti korisni\u010Dko ime tek za ${30 - daysSinceLastChange} dana`
            });
          }
        }
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: "Korisni\u010Dko ime je ve\u0107 zauzeto" });
        }
      }
      if (email && email !== req.user.email.toLowerCase()) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: "Email adresa je ve\u0107 zauzeta" });
        }
      }
      await storage.updateUserProfile(userId, { username, email });
      const updatedUser = await storage.getUser(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "Korisnik nije prona\u0111en" });
      }
      res.json(sanitizeUser(updatedUser));
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: error.message || "Gre\u0161ka na serveru" });
    }
  });
  app2.put("/api/user/change-password", requireVerifiedEmail, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Trenutna i nova lozinka su obavezne" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Nova lozinka mora imati najmanje 6 karaktera" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Korisnik nije prona\u0111en" });
      }
      const isValidPassword = await comparePasswords(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Trenutna lozinka nije ta\u010Dna" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(userId, hashedPassword);
      res.json({ message: "Lozinka je uspe\u0161no promenjena" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: error.message || "Gre\u0161ka na serveru" });
    }
  });
  app2.put("/api/user/avatar", async (req, res) => {
    try {
      const { avatarUrl } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Neautorizovan pristup" });
      }
      if (!avatarUrl || typeof avatarUrl !== "string") {
        return res.status(400).json({ error: "Avatar URL je obavezan" });
      }
      await storage.updateUserAvatar(userId, avatarUrl);
      const updatedUser = await storage.getUser(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "Korisnik nije prona\u0111en" });
      }
      res.json(sanitizeUser(updatedUser));
    } catch (error) {
      console.error("Update avatar error:", error);
      res.status(500).json({ error: error.message || "Gre\u0161ka na serveru" });
    }
  });
  app2.delete("/api/user/avatar", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Neautorizovan pristup" });
      }
      await storage.updateUserAvatar(userId, null);
      const updatedUser = await storage.getUser(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "Korisnik nije prona\u0111en" });
      }
      res.json(sanitizeUser(updatedUser));
    } catch (error) {
      console.error("Remove avatar error:", error);
      res.status(500).json({ error: error.message || "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/giveaway/settings", async (_req, res) => {
    try {
      const settings2 = await storage.getGiveawaySettings();
      res.json(settings2);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/giveaway/projects", async (_req, res) => {
    try {
      const projects2 = await storage.getAllProjects();
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/giveaway/projects", requireVerifiedEmail, async (req, res) => {
    if (!req.user.termsAccepted) {
      return res.status(403).json({ error: "Morate prihvatiti pravila pre u\u010De\u0161\u0107a u giveaway-u" });
    }
    try {
      if (!req.body.mp3Url) {
        return res.status(400).json({ error: "MP3 URL je obavezan" });
      }
      const currentMonth = (/* @__PURE__ */ new Date()).toISOString().substring(0, 7);
      const userProjects = await storage.getUserProjectsForMonth(req.user.id, currentMonth);
      if (userProjects.length > 0) {
        return res.status(400).json({ error: "Ve\u0107 ste uploadovali projekat ovog meseca. Mo\u017Eete uploadovati samo 1 projekat mese\u010Dno." });
      }
      const { insertProjectSchema: insertProjectSchema2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const validatedData = insertProjectSchema2.parse({
        title: req.body.title,
        description: req.body.description || "",
        genre: req.body.genre,
        mp3Url: req.body.mp3Url
        // Use the URL from UploadThing
      });
      const project = await storage.createProject({
        ...validatedData,
        userId: req.user.id,
        currentMonth
      });
      notifyUser(
        req.user.id,
        "Projekat uploadovan! \u{1F389}",
        `Va\u0161 projekat "${project.title}" je uspe\u0161no poslat. Sada mo\u017Eete glasati za druge projekte.`
      );
      const admins = await storage.getAdminUsers();
      admins.forEach((admin) => {
        notifyUser(
          admin.id,
          "Novi projekat uploadovan",
          `${req.user.username} je uploadovao projekat "${project.title}"`
        );
      });
      res.status(201).json(project);
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Validacija nije uspela", details: error.errors });
      } else {
        console.error("Project upload error:", error);
        res.status(500).json({ error: error.message || "Gre\u0161ka na serveru" });
      }
    }
  });
  app2.post("/api/giveaway/vote", requireVerifiedEmail, async (req, res) => {
    if (!req.user.termsAccepted) {
      return res.status(403).json({ error: "Morate prihvatiti pravila pre glasanja" });
    }
    try {
      const { projectId } = req.body;
      if (!projectId || typeof projectId !== "number") {
        return res.status(400).json({ error: "ID projekta je obavezan" });
      }
      const ipAddress = req.socket.remoteAddress || "unknown";
      const userAlreadyVoted = await storage.hasUserVoted(req.user.id, projectId);
      if (userAlreadyVoted) {
        await storage.deleteVote(req.user.id, projectId);
        return res.json({ action: "removed" });
      } else {
        const votes2 = await storage.getProjectVotes(projectId);
        const ipVoteByDifferentUser = votes2.find(
          (vote) => vote.ipAddress === ipAddress && vote.userId !== req.user.id
        );
        if (ipVoteByDifferentUser) {
          return res.status(400).json({ error: "Sa ove IP adrese je ve\u0107 glasano za ovaj projekat (drugi korisnik)" });
        }
        await storage.createVote({
          userId: req.user.id,
          projectId,
          ipAddress
        });
        return res.json({ action: "added" });
      }
    } catch (error) {
      console.error("Vote toggle error:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/giveaway/projects/:id/comments", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID projekta" });
      }
      const comments2 = await storage.getProjectComments(projectId);
      res.json(comments2);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/giveaway/comments", requireVerifiedEmail, async (req, res) => {
    if (!req.user.termsAccepted) {
      return res.status(403).json({ error: "Morate prihvatiti pravila pre komentarisanja" });
    }
    try {
      const { insertCommentSchema: insertCommentSchema2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const validatedData = insertCommentSchema2.parse(req.body);
      const comment = await storage.createComment({
        ...validatedData,
        userId: req.user.id
      });
      res.status(201).json(comment);
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Validacija nije uspela", details: error.errors });
      } else {
        res.status(500).json({ error: "Gre\u0161ka na serveru" });
      }
    }
  });
  app2.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/admin/users", requireAdmin, async (_req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/admin/users/search", requireAdmin, async (req, res) => {
    try {
      const query = req.query.q;
      const limit = parseInt(req.query.limit) || 20;
      if (!query || query.trim().length === 0) {
        return res.json({ users: [] });
      }
      const users2 = await storage.adminSearchUsers(query.trim(), limit);
      res.json({ users: users2 });
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/admin/users/:id/ban", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID korisnika" });
      }
      await storage.banUser(userId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/admin/users/:id/unban", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID korisnika" });
      }
      await storage.unbanUser(userId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID korisnika" });
      }
      if (userId === req.user.id) {
        return res.status(400).json({ error: "Ne mo\u017Eete obrisati sami sebe" });
      }
      await storage.deleteUser(userId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/admin/users/:id/toggle-admin", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID korisnika" });
      }
      if (userId === req.user.id) {
        return res.status(400).json({ error: "Ne mo\u017Eete ukloniti sebi admin privilegije" });
      }
      await storage.toggleAdminRole(userId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/admin/all-projects", requireAdmin, async (_req, res) => {
    try {
      const projects2 = await storage.getAllProjectsForAdmin();
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/admin/pending-projects", requireAdmin, async (_req, res) => {
    try {
      const projects2 = await storage.getPendingProjects();
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/admin/projects/:id/approve", requireAdmin, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID projekta" });
      }
      await storage.approveProject(projectId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.delete("/api/admin/projects/:id", requireAdmin, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID projekta" });
      }
      await storage.deleteProject(projectId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/admin/comments", requireAdmin, async (_req, res) => {
    try {
      const comments2 = await storage.getAllComments();
      res.json(comments2);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.delete("/api/admin/comments/:id", requireAdmin, async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      if (isNaN(commentId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID komentara" });
      }
      await storage.deleteComment(commentId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/admin/giveaway/toggle", requireAdmin, async (req, res) => {
    try {
      const { isActive } = req.body;
      if (typeof isActive !== "boolean") {
        return res.status(400).json({ error: "isActive mora biti boolean" });
      }
      await storage.setSetting("giveaway_active", isActive.toString());
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/cms/content", async (req, res) => {
    try {
      const page = req.query.page;
      const content = await storage.listCmsContent(page);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/cms/content", requireAdmin, async (req, res) => {
    try {
      const schema = z2.array(insertCmsContentSchema);
      const validated = schema.parse(req.body);
      const results = [];
      for (const item of validated) {
        const result = await storage.upsertCmsContent(item);
        results.push(result);
      }
      res.json(results);
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Validacija nije uspela", details: error.errors });
      } else {
        res.status(500).json({ error: "Gre\u0161ka na serveru" });
      }
    }
  });
  app2.put("/api/cms/content/single", requireAdmin, async (req, res) => {
    try {
      const validated = insertCmsContentSchema.parse(req.body);
      const result = await storage.upsertCmsContent(validated);
      res.json(result);
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Validacija nije uspela", details: error.errors });
      } else {
        res.status(500).json({ error: "Gre\u0161ka na serveru" });
      }
    }
  });
  app2.delete("/api/cms/team-member/:memberIndex", requireAdmin, async (req, res) => {
    try {
      const memberIndex = parseInt(req.params.memberIndex);
      if (isNaN(memberIndex)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i member index" });
      }
      await storage.deleteCmsContentByPattern("team", "members", `member_${memberIndex}_`);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ error: "Gre\u0161ka pri brisanju \u010Dlana tima" });
    }
  });
  app2.get("/api/cms/media", async (req, res) => {
    try {
      const page = req.query.page;
      const media = await storage.listCmsMedia(page);
      res.json(media);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/cms/media", requireAdmin, multerUpload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const metadata = insertCmsMediaSchema.omit({ filePath: true }).parse({
        page: req.body.page,
        section: req.body.section,
        assetKey: req.body.assetKey
      });
      const cmsDir = path2.join(process.cwd(), "attached_assets", "cms", metadata.page);
      await fs.promises.mkdir(cmsDir, { recursive: true });
      const ext = path2.extname(req.file.originalname);
      const filename = `${metadata.page}-${metadata.section}-${metadata.assetKey}-${Date.now()}${ext}`;
      const filePath = `attached_assets/cms/${metadata.page}/${filename}`;
      const fullPath = path2.join(process.cwd(), filePath);
      await fs.promises.rename(req.file.path, fullPath);
      const mediaEntry = await storage.upsertCmsMedia({
        ...metadata,
        filePath
      });
      res.json(mediaEntry);
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Validacija nije uspela", details: error.errors });
      } else {
        res.status(500).json({ error: "Gre\u0161ka na serveru" });
      }
    }
  });
  app2.delete("/api/cms/media/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID" });
      }
      await storage.deleteCmsMedia(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/video-spots", async (_req, res) => {
    try {
      const spots = await storage.getVideoSpots();
      res.json(spots);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/video-spots", requireAdmin, async (req, res) => {
    try {
      const validated = insertVideoSpotSchema.parse(req.body);
      const newSpot = await storage.createVideoSpot(validated);
      res.json(newSpot);
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Validacija nije uspela", details: error.errors });
      } else {
        res.status(500).json({ error: "Gre\u0161ka na serveru" });
      }
    }
  });
  app2.put("/api/video-spots/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID" });
      }
      const validated = insertVideoSpotSchema.parse(req.body);
      const updated = await storage.updateVideoSpot(id, validated);
      res.json(updated);
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Validacija nije uspela", details: error.errors });
      } else {
        res.status(500).json({ error: "Gre\u0161ka na serveru" });
      }
    }
  });
  app2.delete("/api/video-spots/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID" });
      }
      await storage.deleteVideoSpot(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.put("/api/video-spots/:id/order", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { order } = req.body;
      if (isNaN(id) || typeof order !== "number") {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i parametri" });
      }
      const updated = await storage.updateVideoSpotOrder(id, order);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/user-songs", requireVerifiedEmail, async (req, res) => {
    try {
      const userId = req.user.id;
      const validated = insertUserSongSchema.parse(req.body);
      const lastSubmissionTime = await storage.getUserLastSongSubmissionTime(userId);
      if (lastSubmissionTime) {
        const hoursSinceLastSubmission = (Date.now() - lastSubmissionTime.getTime()) / (1e3 * 60 * 60);
        if (hoursSinceLastSubmission < 36) {
          const hoursRemaining = Math.ceil(36 - hoursSinceLastSubmission);
          return res.status(429).json({
            error: `Mo\u017Eete postaviti novu pesmu za ${hoursRemaining} ${hoursRemaining === 1 ? "sat" : hoursRemaining < 5 ? "sata" : "sati"}`,
            hoursRemaining
          });
        }
      }
      const newSong = await storage.createUserSong({
        userId,
        songTitle: validated.songTitle,
        artistName: validated.artistName,
        youtubeUrl: validated.youtubeUrl
      });
      const admins = await storage.getAdminUsers();
      admins.forEach((admin) => {
        notifyUser(
          admin.id,
          "Nova pesma za odobrenje",
          `${req.user.username} je poslao pesmu "${newSong.songTitle}" - ${newSong.artistName}`
        );
      });
      res.json(newSong);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Validacija nije uspela", details: error.errors });
      }
      if (error.message?.includes("duplicate") || error.code === "23505") {
        return res.status(409).json({ error: "Ova pesma je ve\u0107 postavljena" });
      }
      console.error("Error creating user song:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/user-songs", requireVerifiedEmail, async (req, res) => {
    try {
      const userId = req.user.id;
      const songs = await storage.getUserSongs(userId);
      res.json(songs);
    } catch (error) {
      console.error("Error fetching user songs:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/user-songs/all", requireAdmin, async (req, res) => {
    try {
      const songs = await storage.getAllUserSongs();
      res.json(songs);
    } catch (error) {
      console.error("Error fetching all user songs:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.delete("/api/user-songs/:id", requireVerifiedEmail, async (req, res) => {
    try {
      const songId = parseInt(req.params.id);
      const userId = req.user.id;
      const isAdmin = req.user.role === "admin";
      if (isNaN(songId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID" });
      }
      if (!isAdmin) {
        const song = await storage.getUserSongById(songId);
        if (!song) {
          return res.status(404).json({ error: "Pesma nije prona\u0111ena" });
        }
        if (song.userId !== userId) {
          return res.status(403).json({ error: "Nemate dozvolu da obri\u0161ete ovu pesmu" });
        }
      }
      await storage.deleteUserSong(songId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user song:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/user-songs/:id/approve", requireAdmin, async (req, res) => {
    try {
      const songId = parseInt(req.params.id);
      if (isNaN(songId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID" });
      }
      const song = await storage.getUserSongById(songId);
      if (!song) {
        return res.status(404).json({ error: "Pesma nije prona\u0111ena" });
      }
      await storage.approveUserSong(songId);
      notifyUser(
        song.userId,
        "Pesma odobrena! \u{1F3B5}",
        `Va\u0161a pesma "${song.songTitle}" je odobrena i sada je vidljiva svima.`
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Error approving user song:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/api/user-songs/public", async (req, res) => {
    try {
      const userId = req.user?.id;
      const songs = await storage.getApprovedUserSongs(userId);
      res.json(songs);
    } catch (error) {
      console.error("Error fetching public user songs:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.post("/api/user-songs/:id/vote", requireVerifiedEmail, async (req, res) => {
    try {
      const songId = parseInt(req.params.id);
      const userId = req.user.id;
      if (isNaN(songId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID" });
      }
      const result = await storage.toggleUserSongVote(userId, songId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling song vote:", error);
      res.status(500).json({ error: "Gre\u0161ka na serveru" });
    }
  });
  app2.get("/robots.txt", (req, res) => {
    const host = req.get("host") || "localhost:5000";
    const protocol = req.protocol || "https";
    const siteUrl = `${protocol}://${host}`;
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
    res.type("text/plain");
    res.send(robotsTxt);
  });
  app2.get("/sitemap.xml", (req, res) => {
    const host = req.get("host") || "localhost:5000";
    const protocol = req.protocol || "https";
    const siteUrl = `${protocol}://${host}`;
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/kontakt</loc>
    <lastmod>${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/tim</loc>
    <lastmod>${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/giveaway</loc>
    <lastmod>${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/pravila</loc>
    <lastmod>${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${siteUrl}/usluge</loc>
    <lastmod>${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
    res.type("application/xml");
    res.send(sitemap);
  });
  app2.get("/api/users/search", requireVerifiedEmail, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string" || q.trim().length < 2) {
        return res.status(400).json({ error: "Query mora imati najmanje 2 karaktera" });
      }
      const results = await storage.searchUsers(q.trim(), req.user.id);
      res.json(results);
    } catch (error) {
      console.error("[MESSAGING] User search error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri pretrazi korisnika" });
    }
  });
  app2.get("/api/users/:id", requireVerifiedEmail, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID korisnika" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Korisnik nije prona\u0111en" });
      }
      const sanitized = sanitizeUser(user);
      res.json(sanitized);
    } catch (error) {
      console.error("[MESSAGING] Get user error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju korisnika" });
    }
  });
  app2.get("/api/conversations", requireVerifiedEmail, async (req, res) => {
    try {
      const conversations2 = await storage.getUserConversations(req.user.id);
      res.json(conversations2);
    } catch (error) {
      console.error("[MESSAGING] Get conversations error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju konverzacija" });
    }
  });
  app2.get("/api/messages/conversation/:userId", requireVerifiedEmail, async (req, res) => {
    try {
      const otherUserId = parseInt(req.params.userId);
      if (isNaN(otherUserId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID korisnika" });
      }
      const conversation = await storage.getConversation(req.user.id, otherUserId);
      if (!conversation) {
        return res.json([]);
      }
      const messages2 = await storage.getConversationMessages(conversation.id, req.user.id);
      await storage.markMessagesAsRead(conversation.id, req.user.id);
      if (wsHelpers.broadcastToUser) {
        wsHelpers.broadcastToUser(otherUserId, {
          type: "message_read",
          conversationId: conversation.id,
          readBy: req.user.id
        });
      }
      res.json(messages2);
    } catch (error) {
      console.error("[MESSAGING] Get messages error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju poruka" });
    }
  });
  app2.post("/api/messages/send", requireVerifiedEmail, async (req, res) => {
    try {
      const { receiverId, content, imageUrl } = req.body;
      if (!receiverId || typeof receiverId !== "number") {
        return res.status(400).json({ error: "receiverId je obavezan" });
      }
      if (receiverId === req.user.id) {
        return res.status(400).json({ error: "Ne mo\u017Eete slati poruke samom sebi" });
      }
      if (!content || typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json({ error: "Poruka ne mo\u017Ee biti prazna" });
      }
      if (content.length > 5e3) {
        return res.status(400).json({ error: "Poruka mo\u017Ee imati najvi\u0161e 5000 karaktera" });
      }
      const receiver = await storage.getUser(receiverId);
      if (!receiver) {
        return res.status(404).json({ error: "Korisnik ne postoji" });
      }
      if (receiver.banned) {
        return res.status(403).json({ error: "Ne mo\u017Eete slati poruke banovanom korisniku" });
      }
      const message = await storage.sendMessage(
        req.user.id,
        receiverId,
        content.trim(),
        imageUrl
      );
      if (wsHelpers.broadcastToUser) {
        wsHelpers.broadcastToUser(receiverId, {
          type: "new_message",
          message
        });
        wsHelpers.broadcastToUser(req.user.id, {
          type: "new_message",
          message
        });
      }
      res.json(message);
    } catch (error) {
      console.error("[MESSAGING] Send message error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri slanju poruke" });
    }
  });
  app2.put("/api/messages/mark-read", requireVerifiedEmail, async (req, res) => {
    console.warn("[DEPRECATED] PUT /api/messages/mark-read called - browser cache issue! User needs hard refresh (Ctrl+F5)");
    res.json({
      success: true,
      deprecated: true,
      message: "Please perform a hard refresh of your browser (Ctrl+F5 or Ctrl+Shift+R)"
    });
  });
  app2.get("/api/messages/unread-count", requireVerifiedEmail, async (req, res) => {
    try {
      const count = await storage.getUnreadMessageCount(req.user.id);
      res.json({ count });
    } catch (error) {
      console.error("[MESSAGING] Get unread count error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju broja nepro\u010Ditanih poruka" });
    }
  });
  app2.delete("/api/messages/:id", requireVerifiedEmail, async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      if (isNaN(messageId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID poruke" });
      }
      const message = await storage.getMessageById(messageId);
      const success = await storage.deleteMessage(messageId, req.user.id);
      if (!success) {
        return res.status(403).json({ error: "Ne mo\u017Eete obrisati ovu poruku" });
      }
      if (message && wsHelpers.broadcastToUser) {
        const deletedMessageEvent = {
          type: "message_deleted",
          messageId
        };
        wsHelpers.broadcastToUser(message.senderId, deletedMessageEvent);
        wsHelpers.broadcastToUser(message.receiverId, deletedMessageEvent);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("[MESSAGING] Delete message error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri brisanju poruke" });
    }
  });
  app2.get("/api/dashboard/overview", requireVerifiedEmail, async (req, res) => {
    try {
      const overview = await storage.getDashboardOverview(req.user.id);
      res.json(overview);
    } catch (error) {
      console.error("[DASHBOARD] Get overview error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju dashboard pregleda" });
    }
  });
  app2.get("/api/user/projects", requireVerifiedEmail, async (req, res) => {
    try {
      const projects2 = await storage.getUserProjects(req.user.id);
      res.json(projects2);
    } catch (error) {
      console.error("[DASHBOARD] Get user projects error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju projekata" });
    }
  });
  app2.get("/api/user/contracts", requireVerifiedEmail, async (req, res) => {
    try {
      const contracts2 = await storage.getUserContracts(req.user.id);
      res.json(contracts2);
    } catch (error) {
      console.error("[DASHBOARD] Get user contracts error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju ugovora" });
    }
  });
  app2.get("/api/user/invoices", requireVerifiedEmail, async (req, res) => {
    try {
      const invoices2 = await storage.getUserInvoices(req.user.id);
      res.json(invoices2);
    } catch (error) {
      console.error("[DASHBOARD] Get user invoices error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju faktura" });
    }
  });
  app2.put("/api/admin/projects/:id/status", requireAdmin, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const { status } = req.body;
      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID projekta" });
      }
      if (!status || !["waiting", "in_progress", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i status. Dozvoljeni: waiting, in_progress, completed, cancelled" });
      }
      await storage.updateProjectStatus(projectId, status);
      const project = await storage.getProject(projectId);
      if (project) {
        notifyUser(
          project.userId,
          "Status projekta a\u017Euriran",
          `Status va\u0161eg projekta "${project.title}" je promenjen na: ${status}`
        );
      }
      res.json({ success: true });
    } catch (error) {
      console.error("[ADMIN] Update project status error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri a\u017Euriranju statusa projekta" });
    }
  });
  app2.get("/api/admin/messages/conversations", requireAdmin, async (req, res) => {
    try {
      const conversations2 = await storage.adminGetAllConversations();
      res.json(conversations2);
    } catch (error) {
      console.error("[ADMIN MESSAGING] Get all conversations error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju konverzacija" });
    }
  });
  app2.get("/api/admin/messages/conversation/:user1Id/:user2Id", requireAdmin, async (req, res) => {
    try {
      const user1Id = parseInt(req.params.user1Id);
      const user2Id = parseInt(req.params.user2Id);
      if (isNaN(user1Id) || isNaN(user2Id)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID korisnika" });
      }
      await storage.adminLogConversationView(req.user.id, user1Id, user2Id);
      const messages2 = await storage.adminGetConversationMessages(user1Id, user2Id);
      res.json(messages2);
    } catch (error) {
      console.error("[ADMIN MESSAGING] Get conversation messages error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju poruka" });
    }
  });
  app2.delete("/api/admin/messages/:id", requireAdmin, async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      if (isNaN(messageId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID poruke" });
      }
      await storage.adminDeleteMessage(messageId);
      res.json({ success: true });
    } catch (error) {
      console.error("[ADMIN MESSAGING] Delete message error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri brisanju poruke" });
    }
  });
  app2.get("/api/admin/messages/audit-logs", requireAdmin, async (req, res) => {
    try {
      const logs = await storage.adminGetAuditLogs();
      res.json(logs);
    } catch (error) {
      console.error("[ADMIN MESSAGING] Get audit logs error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju audit logova" });
    }
  });
  app2.get("/api/admin/messages/export/:user1Id/:user2Id", requireAdmin, async (req, res) => {
    try {
      const user1Id = parseInt(req.params.user1Id);
      const user2Id = parseInt(req.params.user2Id);
      if (isNaN(user1Id) || isNaN(user2Id)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID korisnika" });
      }
      const txtContent = await storage.adminExportConversation(user1Id, user2Id);
      const user1 = await storage.getUser(user1Id);
      const user2 = await storage.getUser(user2Id);
      const filename = `konverzacija_${user1?.username}_${user2?.username}_${Date.now()}.txt`;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(txtContent);
    } catch (error) {
      console.error("[ADMIN MESSAGING] Export conversation error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri izvozu konverzacije" });
    }
  });
  app2.get("/api/admin/messages/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.adminGetMessagingStats();
      res.json(stats);
    } catch (error) {
      console.error("[ADMIN MESSAGING] Get stats error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju statistike" });
    }
  });
  function sanitizeNameForFilename(name) {
    return name.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "").substring(0, 30);
  }
  app2.post("/api/admin/contracts/generate", requireAdmin, async (req, res) => {
    try {
      const { contractType, contractData } = req.body;
      if (!contractType || !contractData) {
        return res.status(400).json({ error: "Tip ugovora i podaci su obavezni" });
      }
      let validatedData;
      try {
        switch (contractType) {
          case "mix_master":
            validatedData = mixMasterContractDataSchema.parse(contractData);
            break;
          case "copyright_transfer":
            validatedData = copyrightTransferContractDataSchema.parse(contractData);
            break;
          case "instrumental_sale":
            validatedData = instrumentalSaleContractDataSchema.parse(contractData);
            break;
          default:
            return res.status(400).json({ error: "Neva\u017Ee\u0107i tip ugovora" });
        }
      } catch (validationError) {
        console.error("[CONTRACTS] Validation error:", validationError);
        return res.status(400).json({
          error: "Validacija podataka nije uspela",
          details: validationError.errors || validationError.message
        });
      }
      const contractNumber = await storage.getNextContractNumber();
      let pdfBuffer;
      switch (contractType) {
        case "mix_master":
          pdfBuffer = await generateMixMasterPDF(validatedData);
          break;
        case "copyright_transfer":
          pdfBuffer = await generateCopyrightTransferPDF(validatedData);
          break;
        case "instrumental_sale":
          pdfBuffer = await generateInstrumentalSalePDF(validatedData);
          break;
        default:
          return res.status(400).json({ error: "Neva\u017Ee\u0107i tip ugovora" });
      }
      const contractsDir = path2.join(process.cwd(), "attached_assets", "contracts");
      fs.mkdirSync(contractsDir, { recursive: true });
      let clientName = "";
      if (contractType === "mix_master") {
        clientName = validatedData.clientName || "";
      } else {
        clientName = validatedData.buyerName || "";
      }
      const sanitizedName = sanitizeNameForFilename(clientName);
      const filename = sanitizedName ? `ugovor_${contractNumber.replace("/", "_")}_${sanitizedName}.pdf` : `ugovor_${contractNumber.replace("/", "_")}.pdf`;
      const pdfPath = path2.join(contractsDir, filename);
      fs.writeFileSync(pdfPath, pdfBuffer);
      const contract = await storage.createContract({
        contractNumber,
        contractType,
        contractData,
        pdfPath: `attached_assets/contracts/${filename}`,
        clientEmail: contractData.clientEmail || null,
        createdBy: req.user.id
      });
      res.json({
        success: true,
        contract: {
          id: contract.id,
          contractNumber: contract.contractNumber,
          contractType: contract.contractType
        }
      });
    } catch (error) {
      console.error("[CONTRACTS] Generate error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri generisanju ugovora" });
    }
  });
  app2.get("/api/admin/contracts", requireAdmin, async (req, res) => {
    try {
      const contracts2 = await storage.getAllContracts();
      res.json(contracts2);
    } catch (error) {
      console.error("[CONTRACTS] Get all error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju ugovora" });
    }
  });
  app2.get("/api/admin/contracts/:id/download", requireAdmin, async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID ugovora" });
      }
      const contract = await storage.getContractById(contractId);
      if (!contract) {
        return res.status(404).json({ error: "Ugovor nije prona\u0111en" });
      }
      const pdfPath = path2.join(process.cwd(), contract.pdfPath);
      if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ error: "PDF fajl nije prona\u0111en" });
      }
      const downloadFilename = path2.basename(contract.pdfPath || `ugovor_${contract.contractNumber.replace("/", "_")}.pdf`);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${downloadFilename}"`);
      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("[CONTRACTS] Download error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri preuzimanju ugovora" });
    }
  });
  app2.post("/api/admin/contracts/:id/send-email", requireAdmin, async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const { email } = req.body;
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID ugovora" });
      }
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107a email adresa" });
      }
      const contract = await storage.getContractById(contractId);
      if (!contract) {
        return res.status(404).json({ error: "Ugovor nije prona\u0111en" });
      }
      const pdfPath = path2.join(process.cwd(), contract.pdfPath);
      if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ error: "PDF fajl nije prona\u0111en" });
      }
      const pdfBuffer = fs.readFileSync(pdfPath);
      const pdfBase64 = pdfBuffer.toString("base64");
      const emailHtml = `
<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f7;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f7;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Studio LeFlow
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                Profesionalna muzi\u010Dka produkcija
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 22px; font-weight: 600;">
                Po\u0161tovani,
              </h2>
              
              <p style="margin: 0 0 16px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                U prilogu Vam dostavljamo ugovor broj <strong>${contract.contractNumber}</strong>.
              </p>

              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Molimo Vas da pa\u017Eljivo pregledate dokument. Ukoliko imate bilo kakvih pitanja ili nedoumica, 
                slobodno nas kontaktirajte.
              </p>

              <!-- Contract Info Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          Broj ugovora:
                        </td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">
                          ${contract.contractNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          Tip:
                        </td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">
                          ${contract.contractType === "mix_master" ? "Mix & Master" : contract.contractType === "copyright_transfer" ? "Prenos autorskih prava" : "Prodaja instrumentala"}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          Datum:
                        </td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">
                          ${new Date(contract.createdAt).toLocaleDateString("sr-RS")}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 8px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Srda\u010Dan pozdrav,
              </p>
              <p style="margin: 0 0 24px; color: #667eea; font-size: 16px; font-weight: 600; line-height: 1.6;">
                Studio LeFlow tim
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                Studio LeFlow | Beograd, Srbija
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Ova poruka je automatski generisana. Molimo ne odgovarajte direktno na ovaj email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;
      const emailFilename = path2.basename(contract.pdfPath || `ugovor_${contract.contractNumber.replace("/", "_")}.pdf`);
      await sendEmail({
        to: email,
        subject: `Studio LeFlow - Ugovor ${contract.contractNumber}`,
        html: emailHtml,
        attachments: [{
          filename: emailFilename,
          content: pdfBase64,
          encoding: "base64",
          contentType: "application/pdf"
        }]
      });
      res.json({ success: true, message: "Email uspe\u0161no poslat" });
    } catch (error) {
      console.error("[CONTRACTS] Send email error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri slanju email-a" });
    }
  });
  app2.patch("/api/admin/contracts/:id/assign-user", requireAdmin, async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const { userId } = req.body;
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID ugovora" });
      }
      let parsedUserId = null;
      if (userId !== null && userId !== void 0) {
        parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
          return res.status(400).json({ error: "Neva\u017Ee\u0107i userId" });
        }
        const user = await storage.getUser(parsedUserId);
        if (!user) {
          return res.status(404).json({ error: "Korisnik nije prona\u0111en" });
        }
      }
      await storage.updateContractUser(contractId, parsedUserId);
      const message = parsedUserId === null ? "Dodela ugovora uspe\u0161no uklonjena" : "Ugovor uspe\u0161no dodeljen korisniku";
      res.json({ success: true, message });
    } catch (error) {
      console.error("[CONTRACTS] Assign user error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri dodeljivanju ugovora" });
    }
  });
  app2.delete("/api/admin/contracts/:id", requireAdmin, async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      if (isNaN(contractId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID ugovora" });
      }
      const contract = await storage.getContractById(contractId);
      if (!contract) {
        return res.status(404).json({ error: "Ugovor nije prona\u0111en" });
      }
      if (contract.pdfPath) {
        const pdfPath = path2.join(process.cwd(), contract.pdfPath);
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
        }
      }
      await storage.deleteContract(contractId);
      res.json({ success: true, message: "Ugovor uspe\u0161no obrisan" });
    } catch (error) {
      console.error("[CONTRACTS] Delete error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri brisanju ugovora" });
    }
  });
  app2.post("/api/admin/invoices", requireAdmin, async (req, res) => {
    try {
      const invoiceNumber = await storage.getNextInvoiceNumber();
      const invoiceData = insertInvoiceSchema.parse({
        ...req.body,
        invoiceNumber,
        createdBy: req.user.id,
        currency: req.body.currency || "RSD",
        status: req.body.status || "pending"
      });
      const invoice = await storage.createInvoice(invoiceData);
      res.json(invoice);
    } catch (error) {
      console.error("[INVOICES] Create error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i podaci", details: error.errors });
      }
      res.status(500).json({ error: "Gre\u0161ka pri kreiranju fakture" });
    }
  });
  app2.get("/api/admin/invoices", requireAdmin, async (req, res) => {
    try {
      const invoices2 = await storage.getAllInvoices();
      res.json(invoices2);
    } catch (error) {
      console.error("[INVOICES] Get all error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju faktura" });
    }
  });
  app2.patch("/api/admin/invoices/:id/status", requireAdmin, async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const { status } = req.body;
      if (isNaN(invoiceId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID fakture" });
      }
      if (!status || !["pending", "paid", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i status fakture" });
      }
      const paidDate = status === "paid" ? /* @__PURE__ */ new Date() : void 0;
      await storage.updateInvoiceStatus(invoiceId, status, paidDate);
      res.json({ success: true, message: "Status fakture a\u017Euriran" });
    } catch (error) {
      console.error("[INVOICES] Update status error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri a\u017Euriranju statusa fakture" });
    }
  });
  app2.delete("/api/admin/invoices/:id", requireAdmin, async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).json({ error: "Neva\u017Ee\u0107i ID fakture" });
      }
      await storage.deleteInvoice(invoiceId);
      res.json({ success: true, message: "Faktura uspe\u0161no obrisana" });
    } catch (error) {
      console.error("[INVOICES] Delete error:", error);
      res.status(500).json({ error: "Gre\u0161ka pri brisanju fakture" });
    }
  });
  app2.get("/api/admin/analytics/summary", requireAdmin, async (_req, res) => {
    try {
      const cacheKey = "analytics:summary";
      const cached = getCachedData(cacheKey);
      if (cached) {
        return res.json(cached);
      }
      const [
        newUsersToday,
        newUsersWeek,
        newUsersMonth,
        topProjects,
        approvedSongsToday,
        approvedSongsWeek,
        approvedSongsMonth,
        contractStats,
        unreadConversations
      ] = await Promise.all([
        storage.getNewUsersCount("today"),
        storage.getNewUsersCount("week"),
        storage.getNewUsersCount("month"),
        storage.getTopProjects(10),
        storage.getApprovedSongsCount("today"),
        storage.getApprovedSongsCount("week"),
        storage.getApprovedSongsCount("month"),
        storage.getContractStats(),
        storage.getUnreadConversationsCount()
      ]);
      const summary = {
        newUsers: {
          today: newUsersToday,
          week: newUsersWeek,
          month: newUsersMonth
        },
        approvedSongs: {
          today: approvedSongsToday,
          week: approvedSongsWeek,
          month: approvedSongsMonth
        },
        topProjects: topProjects.slice(0, 5),
        contracts: contractStats,
        unreadConversations,
        activeUsers: getOnlineUsersSnapshot().length
      };
      setCachedData(cacheKey, summary);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju analitike" });
    }
  });
  app2.get("/api/admin/analytics/active-users", requireAdmin, async (_req, res) => {
    try {
      const onlineUserIds = getOnlineUsersSnapshot();
      const onlineUsers = await Promise.all(
        onlineUserIds.map(async (userId) => {
          const user = await storage.getUser(userId);
          if (!user) return null;
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
            role: user.role
          };
        })
      );
      const validUsers = onlineUsers.filter((u) => u !== null);
      res.json({ count: validUsers.length, users: validUsers });
    } catch (error) {
      console.error("Error fetching active users:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju aktivnih korisnika" });
    }
  });
  app2.get("/api/admin/analytics/top-projects", requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const cacheKey = `analytics:top-projects:${limit}`;
      const cached = getCachedData(cacheKey);
      if (cached) {
        return res.json(cached);
      }
      const topProjects = await storage.getTopProjects(limit);
      setCachedData(cacheKey, topProjects);
      res.json(topProjects);
    } catch (error) {
      console.error("Error fetching top projects:", error);
      res.status(500).json({ error: "Gre\u0161ka pri u\u010Ditavanju top projekata" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger as createLogger2 } from "vite";

// vite.config.ts
import { defineConfig, createLogger } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
import { fileURLToPath } from "url";
import runtimeErrorModal from "@replit/vite-plugin-runtime-error-modal";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path3.dirname(__filename);
var logger = createLogger();
var originalWarning = logger.warn;
logger.warn = (msg, options) => {
  if (msg.includes("did not pass the `from` option")) return;
  originalWarning(msg, options);
};
var vite_config_default = defineConfig({
  customLogger: logger,
  plugins: [
    react(),
    runtimeErrorModal()
  ],
  optimizeDeps: {
    include: ["react", "react-dom"]
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  resolve: {
    alias: {
      "@": path3.resolve(__dirname, "client", "src"),
      "@shared": path3.resolve(__dirname, "shared"),
      "@assets": path3.resolve(__dirname, "attached_assets")
    },
    dedupe: ["react", "react-dom"]
  },
  root: path3.resolve(__dirname, "client"),
  build: {
    outDir: path3.resolve(__dirname, "dist", "public"),
    emptyOutDir: true,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    },
    cssMinify: "esbuild",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    chunkSizeWarningLimit: 600,
    reportCompressedSize: false,
    sourcemap: false
  },
  server: {
    host: "0.0.0.0",
    port: 5e3,
    strictPort: true,
    hmr: {
      clientPort: 443
    },
    allowedHosts: [
      ".replit.app",
      ".repl.co",
      "localhost"
    ]
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger2();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: {
      server,
      port: 5e3
    },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  log(`Looking for static files in: ${distPath}`, "express");
  if (!fs2.existsSync(distPath)) {
    log(`ERROR: Build directory not found at ${distPath}`, "express");
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  const indexPath = path4.resolve(distPath, "index.html");
  if (!fs2.existsSync(indexPath)) {
    log(`ERROR: index.html not found at ${indexPath}`, "express");
    throw new Error(
      `Could not find index.html in the build directory: ${indexPath}`
    );
  }
  log(`Serving static files from: ${distPath}`, "express");
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(indexPath);
  });
}

// server/seed.ts
init_schema();
import { sql as sql3 } from "drizzle-orm";
var defaultCmsContent = [
  // Hero section
  { page: "home", section: "hero", contentKey: "title", contentValue: "Studio LeFlow" },
  { page: "home", section: "hero", contentKey: "subtitle", contentValue: "Profesionalna Muzi\u010Dka Produkcija" },
  { page: "home", section: "hero", contentKey: "description", contentValue: "Mix \u2022 Master \u2022 Instrumentali \u2022 Video Produkcija" },
  // Services
  { page: "home", section: "services", contentKey: "service_1_title", contentValue: "Snimanje & Mix/Master" },
  { page: "home", section: "services", contentKey: "service_1_description", contentValue: "Profesionalno snimanje vokala i instrumenata u akusti\u010Dki tretiranom studiju" },
  { page: "home", section: "services", contentKey: "service_1_image", contentValue: "/client/src/assets/generated_images/Apollo_Twin_X_audio_interface_8905cd94.png" },
  { page: "home", section: "services", contentKey: "service_2_title", contentValue: "Instrumentali & Gotove Pesme" },
  { page: "home", section: "services", contentKey: "service_2_description", contentValue: "Kreiranje originalnih bitova i kompletna produkcija va\u0161ih pesama" },
  { page: "home", section: "services", contentKey: "service_2_image", contentValue: "/client/src/assets/generated_images/Synthesizer_keyboard_with_controls_c7b4f573.png" },
  { page: "home", section: "services", contentKey: "service_3_title", contentValue: "Video Produkcija" },
  { page: "home", section: "services", contentKey: "service_3_description", contentValue: "Snimanje i editing profesionalnih muzi\u010Dkih spotova" },
  { page: "home", section: "services", contentKey: "service_3_image", contentValue: "/client/src/assets/generated_images/Video_camera_production_setup_199f7c64.png" },
  // Equipment section
  { page: "home", section: "equipment", contentKey: "equipment_image", contentValue: "/client/src/assets/generated_images/Yamaha_HS8_studio_monitors_d1470a56.png" },
  // CTA section
  { page: "home", section: "cta", contentKey: "title", contentValue: "Spremni za Va\u0161u Slede\u0107u Produkciju?" },
  { page: "home", section: "cta", contentKey: "description", contentValue: "Zaka\u017Eite besplatnu konsultaciju i razgovarajmo o va\u0161oj muzi\u010Dkoj viziji" }
];
async function ensureMessagingTriggers() {
  try {
    console.log("\u{1F527} Ensuring messaging triggers...");
    await db.execute(sql3`
      CREATE OR REPLACE FUNCTION enforce_canonical_conversation_users()
      RETURNS TRIGGER AS $$
      DECLARE
        temp INT;
      BEGIN
        -- If user1_id > user2_id, swap them to enforce canonical ordering
        IF NEW.user1_id > NEW.user2_id THEN
          temp := NEW.user1_id;
          NEW.user1_id := NEW.user2_id;
          NEW.user2_id := temp;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    await db.execute(sql3`
      DROP TRIGGER IF EXISTS trigger_canonical_conversation_users ON conversations;
    `);
    await db.execute(sql3`
      CREATE TRIGGER trigger_canonical_conversation_users
      BEFORE INSERT OR UPDATE ON conversations
      FOR EACH ROW
      EXECUTE FUNCTION enforce_canonical_conversation_users();
    `);
    console.log("\u2705 Messaging triggers ensured");
  } catch (error) {
    console.error("\u274C Error ensuring messaging triggers:", error);
    throw error;
  }
}
async function seedCmsContent() {
  try {
    console.log("\u{1F331} Checking CMS content...");
    await ensureMessagingTriggers();
    const existingContent = await db.select().from(cmsContent).limit(1);
    if (existingContent.length > 0) {
      console.log("\u2705 CMS content already exists, skipping seed");
      return;
    }
    console.log("\u{1F4DD} Seeding CMS content...");
    await db.insert(cmsContent).values(defaultCmsContent);
    console.log(`\u2705 Successfully seeded ${defaultCmsContent.length} CMS content entries`);
  } catch (error) {
    console.error("\u274C Error seeding CMS content:", error);
    throw error;
  }
}

// server/index.ts
import { WebSocketServer, WebSocket } from "ws";
var app = express2();
app.use(compression({
  level: 9,
  // Maximum compression for production
  threshold: 512,
  // Compress responses larger than 512 bytes
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
app.use("/attached_assets", express2.static(path5.join(process.cwd(), "attached_assets"), {
  maxAge: "1y",
  immutable: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".webp") || filePath.endsWith(".jpg") || filePath.endsWith(".png")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
    if (filePath.endsWith(".js") || filePath.endsWith(".css")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  }
}));
app.use("/public", express2.static(path5.join(process.cwd(), "public"), {
  maxAge: "7d",
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".jpg") || filePath.endsWith(".png") || filePath.endsWith(".webp")) {
      res.setHeader("Cache-Control", "public, max-age=604800");
    }
  }
}));
app.set("trust proxy", 1);
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self' https://utfs.io https://*.uploadthing.com; connect-src 'self' https://*.uploadthing.com https://uploadthing-prod.s3.us-west-2.amazonaws.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none';"
  );
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path6 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path6.startsWith("/api")) {
      let logLine = `${req.method} ${path6} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    let broadcastToUser2 = function(userId, message) {
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        const messageStr = JSON.stringify(message);
        userSockets.forEach((socket) => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(messageStr);
          }
        });
      }
    }, sendNotification2 = function(userId, title, description, variant = "default") {
      broadcastToUser2(userId, {
        type: "notification",
        title,
        description,
        variant
      });
    }, getConversationKey2 = function(user1Id, user2Id) {
      const [id1, id2] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
      return `${id1}-${id2}`;
    };
    var broadcastToUser = broadcastToUser2, sendNotification = sendNotification2, getConversationKey = getConversationKey2;
    const env = app.get("env");
    log(`Starting server in ${env} mode`);
    log(`PORT: ${process.env.PORT || "5000"}`);
    const missingEnvVars = [];
    if (!process.env.DATABASE_URL) {
      missingEnvVars.push("DATABASE_URL");
    }
    if (!process.env.SESSION_SECRET) {
      missingEnvVars.push("SESSION_SECRET");
    }
    if (missingEnvVars.length > 0) {
      const errorMsg = `FATAL: Missing required environment variables: ${missingEnvVars.join(", ")}`;
      log(errorMsg, "express");
      console.error("\n" + "=".repeat(80));
      console.error("DEPLOYMENT CONFIGURATION ERROR");
      console.error("=".repeat(80));
      console.error("\nThe following environment variables are required but not set:");
      missingEnvVars.forEach((v) => console.error(`  - ${v}`));
      console.error("\nRequired for all environments:");
      console.error("  - DATABASE_URL: PostgreSQL connection string");
      console.error("  - SESSION_SECRET: Secret key for session encryption");
      console.error("\nOptional (for specific features):");
      console.error("  - UPLOADTHING_TOKEN: For file uploads (avatars, MP3 files)");
      console.error("  - RESEND_API_KEY: For email functionality");
      console.error("  - RESEND_FROM_EMAIL: Sender email address");
      console.error("\nPlease add these in Replit Deployment \u2192 Secrets");
      console.error("=".repeat(80) + "\n");
      process.exit(1);
    }
    log("All required environment variables present", "express");
    const optionalWarnings = [];
    const hasUploadThingToken = !!process.env.UPLOADTHING_TOKEN;
    const hasUploadThingSecret = !!process.env.UPLOADTHING_SECRET;
    if (!hasUploadThingToken && !hasUploadThingSecret) {
      optionalWarnings.push("UPLOADTHING_TOKEN and UPLOADTHING_SECRET not set - file upload features (avatars, MP3 files) will be completely disabled");
    } else if (!hasUploadThingToken) {
      optionalWarnings.push("UPLOADTHING_TOKEN not set - file upload features will NOT work (UPLOADTHING_SECRET alone is insufficient)");
    } else if (!hasUploadThingSecret) {
      optionalWarnings.push("UPLOADTHING_SECRET not set - file upload features will NOT work (UPLOADTHING_TOKEN alone is insufficient)");
    }
    if (!process.env.RESEND_API_KEY) {
      optionalWarnings.push("RESEND_API_KEY not set - email features (verification, password reset, contact form) will be disabled");
    }
    if (!process.env.RESEND_FROM_EMAIL) {
      optionalWarnings.push("RESEND_FROM_EMAIL not set - emails cannot be sent even if RESEND_API_KEY is configured");
    }
    if (optionalWarnings.length > 0 && env === "production") {
      console.warn("\n" + "-".repeat(80));
      console.warn("WARNING: Optional environment variables not configured:");
      console.warn("-".repeat(80));
      optionalWarnings.forEach((warning) => console.warn("  - " + warning));
      console.warn("\nThe application will start, but some features will be unavailable.");
      console.warn("Add these secrets in Replit Deployment \u2192 Secrets to enable all features.");
      console.warn("-".repeat(80) + "\n");
    }
    await seedCmsContent();
    const server = await registerRoutes(app);
    const onlineUsers = /* @__PURE__ */ new Map();
    const typingUsers = /* @__PURE__ */ new Map();
    setBroadcastFunction(broadcastToUser2);
    setNotificationFunction(sendNotification2);
    setOnlineUsersAccessor(() => Array.from(onlineUsers.keys()));
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`Error: ${message}`, "express");
      console.error("Full error details:", err);
      if (!res.headersSent) {
        res.status(status).json({ message });
      }
    });
    if (env === "development") {
      log("Setting up Vite dev server", "express");
      await setupVite(app, server);
    } else {
      log("Setting up production static file serving", "express");
      serveStatic(app);
    }
    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`Server successfully started on port ${port}`);
      log(`Environment: ${env}`);
    });
    server.on("error", (error) => {
      log(`Server error: ${error.message}`, "express");
      console.error("Full error:", error);
      process.exit(1);
    });
    const CLEANUP_INTERVAL = 60 * 60 * 1e3;
    const runCleanup = async () => {
      try {
        const expiredPending = await storage.cleanupExpiredPendingUsers();
        if (expiredPending > 0) {
          log(`[CLEANUP] Deleted ${expiredPending} expired pending users`);
        }
        const oldAttempts = await storage.cleanupOldRegistrationAttempts(1);
        if (oldAttempts > 0) {
          log(`[CLEANUP] Deleted ${oldAttempts} old registration attempts`);
        }
      } catch (error) {
        console.error("[CLEANUP] Error during cleanup job:", error);
      }
    };
    runCleanup();
    setInterval(runCleanup, CLEANUP_INTERVAL);
    log(`[CLEANUP] Scheduled cleanup job to run every ${CLEANUP_INTERVAL / 1e3 / 60} minutes`);
    const wss = new WebSocketServer({ server, path: "/api/ws" });
    wss.on("connection", async (ws, req) => {
      try {
        const cookieHeader = req.headers.cookie;
        if (!cookieHeader) {
          ws.close(1008, "No session cookie");
          return;
        }
        const sessionCookie = cookieHeader.split(";").find((c) => c.trim().startsWith("connect.sid="));
        if (!sessionCookie) {
          ws.close(1008, "Invalid session");
          return;
        }
        let userId = null;
        ws.on("message", async (data) => {
          try {
            const message = JSON.parse(data.toString());
            if (message.type === "auth" && !userId) {
              userId = message.userId;
              if (!userId) {
                ws.close(1008, "Authentication failed");
                return;
              }
              if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, /* @__PURE__ */ new Set());
              }
              onlineUsers.get(userId).add(ws);
              await storage.updateUserLastSeen(userId);
              broadcastToUser2(userId, {
                type: "online_status",
                userId,
                online: true
              });
              log(`[WebSocket] User ${userId} connected`);
              return;
            }
            if (!userId) {
              ws.close(1008, "Not authenticated");
              return;
            }
            if (message.type === "typing_start") {
              const { receiverId } = message;
              const conversationKey = getConversationKey2(userId, receiverId);
              const currentUserId = userId;
              if (!typingUsers.has(conversationKey)) {
                typingUsers.set(conversationKey, /* @__PURE__ */ new Set());
              }
              typingUsers.get(conversationKey).add(userId);
              broadcastToUser2(receiverId, {
                type: "typing_start",
                userId
              });
              setTimeout(() => {
                typingUsers.get(conversationKey)?.delete(currentUserId);
                broadcastToUser2(receiverId, {
                  type: "typing_stop",
                  userId: currentUserId
                });
              }, 5e3);
            }
            if (message.type === "typing_stop") {
              const { receiverId } = message;
              const conversationKey = getConversationKey2(userId, receiverId);
              typingUsers.get(conversationKey)?.delete(userId);
              broadcastToUser2(receiverId, {
                type: "typing_stop",
                userId
              });
            }
            if (message.type === "new_message") {
              const { receiverId, messageData } = message;
              broadcastToUser2(receiverId, {
                type: "new_message",
                message: messageData
              });
            }
            if (message.type === "message_read") {
              const { senderId, conversationId } = message;
              broadcastToUser2(senderId, {
                type: "message_read",
                conversationId,
                readBy: userId
              });
            }
          } catch (error) {
            log(`[WebSocket] Message parse error: ${error.message}`);
          }
        });
        ws.on("close", async () => {
          if (userId) {
            const userSockets = onlineUsers.get(userId);
            if (userSockets) {
              userSockets.delete(ws);
              if (userSockets.size === 0) {
                onlineUsers.delete(userId);
                await storage.updateUserLastSeen(userId);
                broadcastToUser2(userId, {
                  type: "online_status",
                  userId,
                  online: false
                });
              }
            }
            log(`[WebSocket] User ${userId} disconnected`);
          }
        });
        ws.on("error", (error) => {
          log(`[WebSocket] Socket error: ${error.message}`);
        });
      } catch (error) {
        log(`[WebSocket] Connection error: ${error.message}`);
        ws.close(1011, "Internal server error");
      }
    });
    log("[WebSocket] WebSocket server initialized on /api/ws");
  } catch (error) {
    log(`Failed to start server: ${error.message}`, "express");
    console.error("Full error:", error);
    process.exit(1);
  }
})();
