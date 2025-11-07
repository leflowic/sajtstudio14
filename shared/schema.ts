import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial, integer, boolean, unique, json, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session table - managed by connect-pg-simple for express-session
export const session = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  service: text("service").notNull(),
  preferredDate: text("preferred_date"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Unesite validnu email adresu"),
  phone: z.string().min(6, "Unesite validan broj telefona"),
  name: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  message: z.string().min(10, "Poruka mora imati najmanje 10 karaktera"),
  service: z.string().min(1, "Izaberite uslugu"),
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Users table - for authentication and user management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  username: text("username").notNull().unique(),
  role: text("role").notNull().default("user"), // "user" or "admin"
  banned: boolean("banned").notNull().default(false),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  emailVerified: boolean("email_verified").notNull().default(false),
  verificationCode: text("verification_code"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpiry: timestamp("password_reset_expiry"),
  adminLoginToken: text("admin_login_token"),
  adminLoginExpiry: timestamp("admin_login_expiry"),
  usernameLastChanged: timestamp("username_last_changed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects table - for uploaded MP3s
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  genre: text("genre").notNull(),
  mp3Url: text("mp3_url").notNull(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  uploadDate: timestamp("upload_date").defaultNow().notNull(),
  votesCount: integer("votes_count").notNull().default(0),
  currentMonth: text("current_month").notNull(), // e.g., "2025-01" to track monthly limit
  approved: boolean("approved").notNull().default(false), // Admin must approve before project is visible
});

// Votes table - for upvoting projects
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address").notNull(),
  votedAt: timestamp("voted_at").defaultNow().notNull(),
}, (table) => ({
  // Prevent duplicate votes: user can only vote once per project
  uniqueUserProject: unique().on(table.userId, table.projectId),
  // Also prevent same IP from voting multiple times on same project
  uniqueIpProject: unique().on(table.ipAddress, table.projectId),
}));

// Comments table - for project comments
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Settings table - for giveaway toggle and other settings
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// CMS Page and Section enums
export const cmsPages = ["home", "team"] as const;
export const cmsSections = ["hero", "services", "equipment", "cta", "members"] as const;
export const cmsContentTypes = ["text", "image", "html"] as const;

export type CmsPage = typeof cmsPages[number];
export type CmsSection = typeof cmsSections[number];
export type CmsContentType = typeof cmsContentTypes[number];

// CMS Content table - for editable text/html content on the site
export const cmsContent = pgTable("cms_content", {
  id: serial("id").primaryKey(),
  page: text("page").notNull(), // "home", "team"
  section: text("section").notNull(), // "hero", "services", "equipment", "cta", "members"
  contentKey: text("content_key").notNull(), // unique identifier e.g. "hero_title", "service_1_title"
  contentValue: text("content_value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one value per page+section+key combination
  uniquePageSectionKey: unique().on(table.page, table.section, table.contentKey),
}));

// CMS Media table - for uploaded images
export const cmsMedia = pgTable("cms_media", {
  id: serial("id").primaryKey(),
  page: text("page").notNull(), // "home", "team"
  section: text("section").notNull(), // "hero", "services", "equipment", "members"
  assetKey: text("asset_key").notNull(), // e.g., "hero_background", "team_member_1"
  filePath: text("file_path").notNull(), // relative path: "attached_assets/cms/home/hero_bg.png"
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one image per page+section+assetKey combination
  uniquePageSectionAsset: unique().on(table.page, table.section, table.assetKey),
}));

// Video Spots table - for studio music video portfolio
export const videoSpots = pgTable("video_spots", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  artist: text("artist").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
  order: integer("order").notNull().default(0), // for custom ordering
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Newsletter Subscribers table - for email subscriptions
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "unsubscribed"
  confirmationToken: text("confirmation_token"),
  confirmedAt: timestamp("confirmed_at"),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

// Conversations table - tracks message threads between users
// Database-level canonical ordering enforcement:
// - PostgreSQL TRIGGER automatically swaps user1_id/user2_id so user1_id < user2_id (BEFORE INSERT/UPDATE)
// - This guarantees unique constraint (user1_id, user2_id) prevents duplicates (A,B) and (B,A)
// - Application can optionally use normalizeConversationUsers() helper for consistency
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  user1Id: integer("user1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  user2Id: integer("user2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Ensure unique conversation between two users (works ONLY if application normalizes IDs)
  uniqueUsers: unique().on(table.user1Id, table.user2Id),
  // Performance index for sorting conversations by last message
  lastMessageIdx: index("conversations_last_message_idx").on(table.lastMessageAt),
}));

// Messages table - individual messages in conversations
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: integer("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverId: integer("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  imageUrl: text("image_url"), // Optional image attachment
  deleted: boolean("deleted").notNull().default(false), // Soft delete
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Performance indexes for fetching messages
  conversationIdx: index("messages_conversation_idx").on(table.conversationId),
  createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
  // Composite index for conversation + timestamp (most common query)
  conversationCreatedIdx: index("messages_conversation_created_idx").on(table.conversationId, table.createdAt),
}));

// Message Reads table - tracks when messages are read (for seen checkmarks)
export const messageReads = pgTable("message_reads", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  readAt: timestamp("read_at").defaultNow().notNull(),
}, (table) => ({
  // One read record per user per message
  uniqueUserMessage: unique().on(table.userId, table.messageId),
  // Performance index for checking read status
  messageIdx: index("message_reads_message_idx").on(table.messageId),
}));

// Admin Message Audit table - logs when admins view conversations
export const adminMessageAudit = pgTable("admin_message_audit", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  viewedUser1Id: integer("viewed_user1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  viewedUser2Id: integer("viewed_user2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  votes: many(votes),
  comments: many(comments),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  messageReads: many(messageReads),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  votes: many(votes),
  comments: many(comments),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [votes.projectId],
    references: [projects.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  project: one(projects, {
    fields: [comments.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user1: one(users, {
    fields: [conversations.user1Id],
    references: [users.id],
  }),
  user2: one(users, {
    fields: [conversations.user2Id],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
  reads: many(messageReads),
}));

export const messageReadsRelations = relations(messageReads, ({ one }) => ({
  message: one(messages, {
    fields: [messageReads.messageId],
    references: [messages.id],
  }),
  user: one(users, {
    fields: [messageReads.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  termsAccepted: true,
  role: true,
  banned: true,
}).extend({
  email: z.string().email("Unesite validnu email adresu"),
  password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
  username: z.string().min(3, "Korisničko ime mora imati najmanje 3 karaktera"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  uploadDate: true,
  votesCount: true,
  userId: true,
  currentMonth: true,
}).extend({
  title: z.string().min(3, "Naslov mora imati najmanje 3 karaktera"),
  description: z.string(),
  genre: z.string().min(1, "Izaberite žanr"),
  mp3Url: z.string().url("Nevažeći URL"),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  userId: true,
}).extend({
  text: z.string().min(1, "Komentar ne može biti prazan"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type Vote = typeof votes.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type CmsContent = typeof cmsContent.$inferSelect;
export type CmsMedia = typeof cmsMedia.$inferSelect;

// CMS Insert schemas
export const insertCmsContentSchema = createInsertSchema(cmsContent).omit({
  id: true,
  updatedAt: true,
}).extend({
  page: z.enum(cmsPages),
  section: z.enum(cmsSections),
  contentKey: z.string().min(1, "Content key ne može biti prazan"),
  contentValue: z.string(),
});

export const insertCmsMediaSchema = createInsertSchema(cmsMedia).omit({
  id: true,
  updatedAt: true,
}).extend({
  page: z.enum(cmsPages),
  section: z.enum(cmsSections),
  assetKey: z.string().min(1, "Asset key ne može biti prazan"),
  filePath: z.string().min(1, "File path ne može biti prazan"),
});

export type InsertCmsContent = z.infer<typeof insertCmsContentSchema>;
export type InsertCmsMedia = z.infer<typeof insertCmsMediaSchema>;

// Video Spots schemas
export const insertVideoSpotSchema = createInsertSchema(videoSpots).omit({
  id: true,
  createdAt: true,
  order: true,
}).extend({
  title: z.string().min(3, "Naslov mora imati najmanje 3 karaktera"),
  description: z.string().min(10, "Opis mora imati najmanje 10 karaktera"),
  artist: z.string().min(2, "Ime izvođača mora imati najmanje 2 karaktera"),
  youtubeUrl: z.string().url("Unesite validan YouTube URL").regex(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//, "URL mora biti sa YouTube-a"),
});

export type InsertVideoSpot = z.infer<typeof insertVideoSpotSchema>;
export type VideoSpot = typeof videoSpots.$inferSelect;

// Newsletter Subscribers schemas
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  status: true,
  confirmationToken: true,
  confirmedAt: true,
  subscribedAt: true,
  unsubscribedAt: true,
}).extend({
  email: z.string().email("Unesite validnu email adresu"),
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Messaging types
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type MessageRead = typeof messageReads.$inferSelect;
export type AdminMessageAudit = typeof adminMessageAudit.$inferSelect;

// Messaging insert schemas
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  deleted: true,
}).extend({
  content: z.string().min(1, "Poruka ne može biti prazna").max(5000, "Poruka može imati najviše 5000 karaktera"),
  imageUrl: z.string().url("Nevažeći URL").optional().or(z.literal("")),
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Helper function to normalize conversation user IDs (canonical ordering)
// MUST be used before INSERT/SELECT to prevent duplicate conversations
export function normalizeConversationUsers(userId1: number, userId2: number): [number, number] {
  return userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
}
