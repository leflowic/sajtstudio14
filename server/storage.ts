// Blueprint reference: blueprint:javascript_database, blueprint:javascript_auth_all_persistance
import { 
  type ContactSubmission, 
  type InsertContactSubmission,
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type Comment,
  type InsertComment,
  type Vote,
  type Setting,
  type CmsContent,
  type InsertCmsContent,
  type CmsMedia,
  type InsertCmsMedia,
  type VideoSpot,
  type InsertVideoSpot,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type Conversation,
  type Message,
  type MessageRead,
  type AdminMessageAudit,
  contactSubmissions,
  users,
  projects,
  comments,
  votes,
  settings,
  cmsContent,
  cmsMedia,
  videoSpots,
  newsletterSubscribers,
  conversations,
  messages,
  messageReads,
  adminMessageAudit,
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Store } from "express-session";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmission(id: string): Promise<ContactSubmission | undefined>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUserRole(id: number, role: string): Promise<void>;
  banUser(id: number): Promise<void>;
  unbanUser(id: number): Promise<void>;
  acceptTerms(id: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
  setVerificationCode(userId: number, code: string): Promise<void>;
  verifyEmail(userId: number, code: string): Promise<boolean>;
  setPasswordResetToken(userId: number, token: string): Promise<void>;
  verifyPasswordResetToken(userId: number, token: string): Promise<boolean>;
  updatePassword(userId: number, newPassword: string): Promise<void>;
  clearPasswordResetToken(userId: number): Promise<void>;
  setAdminLoginToken(userId: number, token: string): Promise<void>;
  verifyAdminLoginToken(userId: number, token: string): Promise<boolean>;
  clearAdminLoginToken(userId: number): Promise<void>;
  updateUserProfile(userId: number, data: { username?: string; email?: string }): Promise<void>;
  updateUserPassword(userId: number, hashedPassword: string): Promise<void>;
  updateUserAvatar(userId: number, avatarUrl: string | null): Promise<void>;

  // Projects
  createProject(data: { title: string; description: string; genre: string; mp3Url: string; userId: number; currentMonth: string }): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Array<Project & { username: string }>>;
  getUserProjectsForMonth(userId: number, month: string): Promise<Project[]>;
  deleteProject(id: number): Promise<void>;
  incrementVoteCount(projectId: number): Promise<void>;

  // Votes
  createVote(data: { userId: number; projectId: number; ipAddress: string }): Promise<Vote>;
  deleteVote(userId: number, projectId: number): Promise<void>;
  hasUserVoted(userId: number, projectId: number): Promise<boolean>;
  getProjectVotes(projectId: number): Promise<Vote[]>;
  decrementVoteCount(projectId: number): Promise<void>;

  // Comments
  createComment(data: { text: string; projectId: number; userId: number }): Promise<Comment>;
  getProjectComments(projectId: number): Promise<Array<Comment & { username: string }>>;
  deleteComment(id: number): Promise<void>;
  getAllComments(): Promise<Array<Comment & { username: string; projectTitle: string }>>;

  // Settings
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(key: string, value: string): Promise<void>;
  getGiveawaySettings(): Promise<{ isActive: boolean }>;
  getMaintenanceMode(): Promise<boolean>;
  setMaintenanceMode(isActive: boolean): Promise<void>;

  // Newsletter
  createNewsletterSubscriber(email: string, confirmationToken: string): Promise<NewsletterSubscriber>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  getNewsletterSubscriberByToken(token: string): Promise<NewsletterSubscriber | undefined>;
  confirmNewsletterSubscription(token: string): Promise<boolean>;
  unsubscribeNewsletter(email: string): Promise<boolean>;
  deleteNewsletterSubscriber(id: number): Promise<boolean>;
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getConfirmedNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterStats(): Promise<{ total: number; confirmed: number; pending: number }>;

  // CMS Content
  getCmsContent(page: string, section: string, contentKey: string): Promise<CmsContent | undefined>;
  setCmsContent(page: string, section: string, contentType: string, contentKey: string, contentValue: string): Promise<void>;
  getAllCmsContent(): Promise<CmsContent[]>;
  listCmsContent(page?: string): Promise<CmsContent[]>;
  upsertCmsContent(data: InsertCmsContent): Promise<CmsContent>;
  deleteCmsContentByPattern(page: string, section: string, keyPattern: string): Promise<void>;

  // CMS Media
  listCmsMedia(page?: string): Promise<CmsMedia[]>;
  upsertCmsMedia(data: InsertCmsMedia): Promise<CmsMedia>;
  deleteCmsMedia(id: number): Promise<void>;

  // Video Spots
  getVideoSpots(): Promise<VideoSpot[]>;
  createVideoSpot(data: InsertVideoSpot): Promise<VideoSpot>;
  updateVideoSpot(id: number, data: InsertVideoSpot): Promise<VideoSpot>;
  deleteVideoSpot(id: number): Promise<void>;
  updateVideoSpotOrder(id: number, order: number): Promise<VideoSpot>;

  // Messaging
  searchUsers(query: string, currentUserId: number): Promise<Array<{ id: number; username: string; email: string }>>;
  getOrCreateConversation(user1Id: number, user2Id: number): Promise<Conversation>;
  getConversation(user1Id: number, user2Id: number): Promise<Conversation | undefined>;
  getUserConversations(userId: number): Promise<Array<Conversation & { otherUser: { id: number; username: string; avatarUrl: string | null }; lastMessage?: Message; unreadCount: number }>>;
  sendMessage(senderId: number, receiverId: number, content: string, imageUrl?: string): Promise<Message>;
  getConversationMessages(conversationId: number, userId: number): Promise<Message[]>;
  markMessagesAsRead(conversationId: number, userId: number): Promise<void>;
  getUnreadMessageCount(userId: number): Promise<number>;
  deleteMessage(messageId: number, userId: number): Promise<boolean>;
  adminGetAllConversations(): Promise<Array<{ user1: { id: number; username: string }; user2: { id: number; username: string }; messageCount: number; lastMessageAt: Date | null }>>;
  adminGetConversationMessages(user1Id: number, user2Id: number): Promise<Message[]>;
  adminDeleteMessage(messageId: number): Promise<boolean>;
  adminLogConversationView(adminId: number, viewedUser1Id: number, viewedUser2Id: number): Promise<void>;
  adminGetAuditLogs(): Promise<Array<AdminMessageAudit & { adminUsername: string; user1Username: string; user2Username: string }>>;

  // Session store
  sessionStore: Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ pool, createTableIfMissing: true });
  }

  // Contact Submissions
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(insertSubmission).returning();
    return submission!;
  }

  async getContactSubmission(id: string): Promise<ContactSubmission | undefined> {
    const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return submission || undefined;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    // Case-insensitive email lookup
    const [user] = await db.select().from(users).where(sql`LOWER(${users.email}) = LOWER(${email})`);
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Case-insensitive username lookup
    const [user] = await db.select().from(users).where(sql`LOWER(${users.username}) = LOWER(${username})`);
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user!;
  }

  async updateUserRole(id: number, role: string): Promise<void> {
    await db.update(users).set({ role }).where(eq(users.id, id));
  }

  async banUser(id: number): Promise<void> {
    await db.update(users).set({ banned: true }).where(eq(users.id, id));
  }

  async unbanUser(id: number): Promise<void> {
    await db.update(users).set({ banned: false }).where(eq(users.id, id));
  }

  async deleteUser(id: number): Promise<void> {
    // Get all user's projects to delete votes and comments on them
    const userProjects = await db.select({ id: projects.id }).from(projects).where(eq(projects.userId, id));
    const projectIds = userProjects.map(p => p.id);
    
    // Delete votes and comments on user's projects from other users
    if (projectIds.length > 0) {
      await db.delete(votes).where(sql`${votes.projectId} IN (${sql.join(projectIds.map(id => sql`${id}`), sql`, `)})`);
      await db.delete(comments).where(sql`${comments.projectId} IN (${sql.join(projectIds.map(id => sql`${id}`), sql`, `)})`);
    }
    
    // Delete user's own votes (on other projects)
    await db.delete(votes).where(eq(votes.userId, id));
    
    // Delete user's own comments (on other projects)
    await db.delete(comments).where(eq(comments.userId, id));
    
    // Delete user's projects (now safe - all votes and comments are gone)
    await db.delete(projects).where(eq(projects.userId, id));
    
    // Finally delete the user
    await db.delete(users).where(eq(users.id, id));
  }

  async acceptTerms(id: number): Promise<void> {
    await db.update(users).set({ termsAccepted: true }).where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async setVerificationCode(userId: number, code: string): Promise<void> {
    await db.update(users).set({ verificationCode: code }).where(eq(users.id, userId));
  }

  async verifyEmail(userId: number, code: string): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user || user.verificationCode !== code) {
      return false;
    }
    await db.update(users).set({ emailVerified: true, verificationCode: null }).where(eq(users.id, userId));
    return true;
  }

  async setPasswordResetToken(userId: number, token: string): Promise<void> {
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    await db.update(users).set({ 
      passwordResetToken: token, 
      passwordResetExpiry: expiry 
    }).where(eq(users.id, userId));
  }

  async verifyPasswordResetToken(userId: number, token: string): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user || user.passwordResetToken !== token) {
      return false;
    }
    // Check if token has expired
    if (!user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
      return false;
    }
    return true;
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    await db.update(users).set({ password: newPassword }).where(eq(users.id, userId));
  }

  async clearPasswordResetToken(userId: number): Promise<void> {
    await db.update(users).set({ 
      passwordResetToken: null, 
      passwordResetExpiry: null 
    }).where(eq(users.id, userId));
  }

  async setAdminLoginToken(userId: number, token: string): Promise<void> {
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await db.update(users).set({ 
      adminLoginToken: token,
      adminLoginExpiry: expiry
    }).where(eq(users.id, userId));
  }

  async verifyAdminLoginToken(userId: number, token: string): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!user || user.adminLoginToken !== token) {
      return false;
    }
    
    if (!user.adminLoginExpiry || user.adminLoginExpiry < new Date()) {
      return false;
    }
    
    return true;
  }

  async clearAdminLoginToken(userId: number): Promise<void> {
    await db.update(users).set({ 
      adminLoginToken: null, 
      adminLoginExpiry: null 
    }).where(eq(users.id, userId));
  }

  async updateUserProfile(userId: number, data: { username?: string; email?: string }): Promise<void> {
    const updateData: any = {};
    
    if (data.username) {
      updateData.username = data.username;
      updateData.usernameLastChanged = new Date();
    }
    
    if (data.email) {
      updateData.email = data.email;
    }
    
    if (Object.keys(updateData).length > 0) {
      await db.update(users).set(updateData).where(eq(users.id, userId));
    }
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
  }

  async updateUserAvatar(userId: number, avatarUrl: string | null): Promise<void> {
    await db.update(users).set({ avatarUrl }).where(eq(users.id, userId));
  }

  // Projects
  async createProject(data: { title: string; description: string; genre: string; mp3Url: string; userId: number; currentMonth: string }): Promise<Project> {
    const [project] = await db.insert(projects).values(data).returning();
    return project!;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getAllProjects(): Promise<Array<Project & { username: string }>> {
    const result = await db
      .select({
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
        username: users.username,
      })
      .from(projects)
      .leftJoin(users, eq(projects.userId, users.id))
      .where(eq(projects.approved, true)) // Only show approved projects to regular users
      .orderBy(desc(projects.uploadDate));
    
    return result as Array<Project & { username: string }>;
  }

  async getAllProjectsForAdmin(): Promise<Array<Project & { username: string }>> {
    const result = await db
      .select({
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
        username: users.username,
      })
      .from(projects)
      .leftJoin(users, eq(projects.userId, users.id))
      .orderBy(desc(projects.uploadDate));
    
    return result as Array<Project & { username: string }>;
  }

  async getPendingProjects(): Promise<Array<Project & { username: string }>> {
    const result = await db
      .select({
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
        username: users.username,
      })
      .from(projects)
      .leftJoin(users, eq(projects.userId, users.id))
      .where(eq(projects.approved, false)) // Only show pending (unapproved) projects
      .orderBy(desc(projects.uploadDate));
    
    return result as Array<Project & { username: string }>;
  }

  async approveProject(id: number): Promise<void> {
    await db.update(projects).set({ approved: true }).where(eq(projects.id, id));
  }

  async getUserProjectsForMonth(userId: number, month: string): Promise<Project[]> {
    return await db.select().from(projects).where(
      and(eq(projects.userId, userId), eq(projects.currentMonth, month))
    );
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async incrementVoteCount(projectId: number): Promise<void> {
    await db.update(projects).set({
      votesCount: sql`${projects.votesCount} + 1`
    }).where(eq(projects.id, projectId));
  }

  // Votes
  async createVote(data: { userId: number; projectId: number; ipAddress: string }): Promise<Vote> {
    const [vote] = await db.insert(votes).values(data).returning();
    
    // Increment vote count
    await this.incrementVoteCount(data.projectId);
    
    return vote!;
  }

  async hasUserVoted(userId: number, projectId: number): Promise<boolean> {
    const existingVotes = await db.select().from(votes).where(
      and(eq(votes.userId, userId), eq(votes.projectId, projectId))
    );
    return existingVotes.length > 0;
  }

  async hasIpVoted(ipAddress: string, projectId: number): Promise<boolean> {
    const existingVotes = await db.select().from(votes).where(
      and(eq(votes.ipAddress, ipAddress), eq(votes.projectId, projectId))
    );
    return existingVotes.length > 0;
  }

  async getProjectVotes(projectId: number): Promise<Vote[]> {
    return await db.select().from(votes).where(eq(votes.projectId, projectId));
  }

  async deleteVote(userId: number, projectId: number): Promise<void> {
    await db.delete(votes).where(
      and(eq(votes.userId, userId), eq(votes.projectId, projectId))
    );
    
    // Decrement vote count
    await this.decrementVoteCount(projectId);
  }

  async decrementVoteCount(projectId: number): Promise<void> {
    await db.update(projects).set({
      votesCount: sql`${projects.votesCount} - 1`
    }).where(eq(projects.id, projectId));
  }

  // Comments
  async createComment(data: { text: string; projectId: number; userId: number }): Promise<Comment> {
    const [comment] = await db.insert(comments).values(data).returning();
    return comment!;
  }

  async getProjectComments(projectId: number): Promise<Array<Comment & { username: string }>> {
    const result = await db
      .select({
        id: comments.id,
        projectId: comments.projectId,
        userId: comments.userId,
        text: comments.text,
        createdAt: comments.createdAt,
        username: users.username,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.projectId, projectId))
      .orderBy(desc(comments.createdAt));
    
    return result as Array<Comment & { username: string }>;
  }

  async deleteComment(id: number): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  async getAllComments(): Promise<Array<Comment & { username: string; projectTitle: string }>> {
    const result = await db
      .select({
        id: comments.id,
        projectId: comments.projectId,
        projectTitle: projects.title,
        userId: comments.userId,
        username: users.username,
        text: comments.text,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .leftJoin(projects, eq(comments.projectId, projects.id))
      .orderBy(desc(comments.createdAt));
    
    return result as Array<Comment & { username: string; projectTitle: string }>;
  }

  // Settings
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }

  async setSetting(key: string, value: string): Promise<void> {
    const existing = await this.getSetting(key);
    if (existing) {
      await db.update(settings).set({ value, updatedAt: new Date() }).where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }
  }

  // CMS Content
  async getCmsContent(page: string, section: string, contentKey: string): Promise<CmsContent | undefined> {
    const [content] = await db.select().from(cmsContent).where(
      and(
        eq(cmsContent.page, page),
        eq(cmsContent.section, section),
        eq(cmsContent.contentKey, contentKey)
      )
    );
    return content || undefined;
  }

  async setCmsContent(page: string, section: string, contentType: string, contentKey: string, contentValue: string): Promise<void> {
    const existing = await this.getCmsContent(page, section, contentKey);
    if (existing) {
      await db.update(cmsContent).set({ contentValue, updatedAt: new Date() }).where(
        and(
          eq(cmsContent.page, page),
          eq(cmsContent.section, section),
          eq(cmsContent.contentKey, contentKey)
        )
      );
    } else {
      await db.insert(cmsContent).values({ page, section, contentKey, contentValue } as any);
    }
  }

  async getAllCmsContent(): Promise<CmsContent[]> {
    return await db.select().from(cmsContent);
  }

  async listCmsContent(page?: string): Promise<CmsContent[]> {
    if (page) {
      return await db
        .select()
        .from(cmsContent)
        .where(eq(cmsContent.page, page))
        .orderBy(cmsContent.page, cmsContent.section, cmsContent.contentKey);
    }
    return await db
      .select()
      .from(cmsContent)
      .orderBy(cmsContent.page, cmsContent.section, cmsContent.contentKey);
  }

  async upsertCmsContent(data: InsertCmsContent): Promise<CmsContent> {
    const [result] = await db
      .insert(cmsContent)
      .values(data)
      .onConflictDoUpdate({
        target: [cmsContent.page, cmsContent.section, cmsContent.contentKey],
        set: {
          contentValue: sql`EXCLUDED.content_value`,
          updatedAt: sql`NOW()`,
        },
      })
      .returning();
    return result!;
  }

  async deleteCmsContentByPattern(page: string, section: string, keyPattern: string): Promise<void> {
    await db.delete(cmsContent).where(
      and(
        eq(cmsContent.page, page),
        eq(cmsContent.section, section),
        sql`${cmsContent.contentKey} LIKE ${keyPattern + '%'}`
      )
    );
  }

  async listCmsMedia(page?: string): Promise<CmsMedia[]> {
    if (page) {
      return await db
        .select()
        .from(cmsMedia)
        .where(eq(cmsMedia.page, page))
        .orderBy(cmsMedia.page, cmsMedia.section, cmsMedia.assetKey);
    }
    return await db
      .select()
      .from(cmsMedia)
      .orderBy(cmsMedia.page, cmsMedia.section, cmsMedia.assetKey);
  }

  async upsertCmsMedia(data: InsertCmsMedia): Promise<CmsMedia> {
    const [result] = await db
      .insert(cmsMedia)
      .values(data)
      .onConflictDoUpdate({
        target: [cmsMedia.page, cmsMedia.section, cmsMedia.assetKey],
        set: {
          filePath: sql`EXCLUDED.file_path`,
          updatedAt: sql`NOW()`,
        },
      })
      .returning();
    return result!;
  }

  async deleteCmsMedia(id: number): Promise<void> {
    await db.delete(cmsMedia).where(eq(cmsMedia.id, id));
  }

  async getGiveawaySettings(): Promise<{ isActive: boolean }> {
    const setting = await this.getSetting('giveaway_active');
    return { isActive: setting?.value === 'true' };
  }

  async getMaintenanceMode(): Promise<boolean> {
    const setting = await this.getSetting('maintenance_mode');
    return setting?.value === 'true';
  }

  async setMaintenanceMode(isActive: boolean): Promise<void> {
    await this.setSetting('maintenance_mode', isActive.toString());
  }

  // Newsletter functions
  async createNewsletterSubscriber(email: string, confirmationToken: string): Promise<NewsletterSubscriber> {
    const [subscriber] = await db.insert(newsletterSubscribers)
      .values({
        email: email.toLowerCase(),
        confirmationToken,
        status: 'pending',
      })
      .returning();
    return subscriber!;
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select()
      .from(newsletterSubscribers)
      .where(sql`LOWER(${newsletterSubscribers.email}) = LOWER(${email})`)
      .limit(1);
    return subscriber;
  }

  async getNewsletterSubscriberByToken(token: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.confirmationToken, token))
      .limit(1);
    return subscriber;
  }

  async confirmNewsletterSubscription(token: string): Promise<boolean> {
    const subscriber = await this.getNewsletterSubscriberByToken(token);
    
    if (!subscriber || subscriber.status === 'confirmed') {
      return false;
    }

    await db.update(newsletterSubscribers)
      .set({
        status: 'confirmed',
        confirmedAt: new Date(),
        confirmationToken: null,
      })
      .where(eq(newsletterSubscribers.id, subscriber.id));

    return true;
  }

  async unsubscribeNewsletter(email: string): Promise<boolean> {
    const subscriber = await this.getNewsletterSubscriberByEmail(email);
    
    if (!subscriber || subscriber.status === 'unsubscribed') {
      return false;
    }

    await db.update(newsletterSubscribers)
      .set({
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.id, subscriber.id));

    return true;
  }

  async deleteNewsletterSubscriber(id: number): Promise<boolean> {
    const result = await db.delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, id))
      .returning();
    
    return result.length > 0;
  }

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.subscribedAt));
  }

  async getConfirmedNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, 'confirmed'))
      .orderBy(desc(newsletterSubscribers.confirmedAt));
  }

  async getNewsletterStats(): Promise<{ total: number; confirmed: number; pending: number }> {
    const allSubscribers = await db.select()
      .from(newsletterSubscribers)
      .where(sql`${newsletterSubscribers.status} != 'unsubscribed'`);

    const total = allSubscribers.length;
    const confirmed = allSubscribers.filter(s => s.status === 'confirmed').length;
    const pending = allSubscribers.filter(s => s.status === 'pending').length;

    return { total, confirmed, pending };
  }

  // Video Spots
  async getVideoSpots(): Promise<VideoSpot[]> {
    return await db
      .select()
      .from(videoSpots)
      .orderBy(videoSpots.order, desc(videoSpots.createdAt));
  }

  async createVideoSpot(data: InsertVideoSpot): Promise<VideoSpot> {
    const [result] = await db
      .insert(videoSpots)
      .values(data)
      .returning();
    return result!;
  }

  async updateVideoSpot(id: number, data: InsertVideoSpot): Promise<VideoSpot> {
    const [result] = await db
      .update(videoSpots)
      .set(data)
      .where(eq(videoSpots.id, id))
      .returning();
    if (!result) throw new Error("Video spot not found");
    return result;
  }

  async deleteVideoSpot(id: number): Promise<void> {
    await db.delete(videoSpots).where(eq(videoSpots.id, id));
  }

  async updateVideoSpotOrder(id: number, order: number): Promise<VideoSpot> {
    const [result] = await db
      .update(videoSpots)
      .set({ order })
      .where(eq(videoSpots.id, id))
      .returning();
    if (!result) throw new Error("Video spot not found");
    return result;
  }

  // Admin methods
  async getAdminStats(): Promise<{
    totalUsers: number;
    totalProjects: number;
    totalVotes: number;
    totalComments: number;
  }> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [projectCount] = await db.select({ count: sql<number>`count(*)` }).from(projects);
    const [voteCount] = await db.select({ count: sql<number>`count(*)` }).from(votes);
    const [commentCount] = await db.select({ count: sql<number>`count(*)` }).from(comments);
    
    return {
      totalUsers: Number(userCount?.count ?? 0),
      totalProjects: Number(projectCount?.count ?? 0),
      totalVotes: Number(voteCount?.count ?? 0),
      totalComments: Number(commentCount?.count ?? 0),
    };
  }

  async toggleAdminRole(userId: number): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new Error("User not found");
    
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
  }

  // Messaging methods
  async searchUsers(query: string, currentUserId: number): Promise<Array<{ id: number; username: string; email: string }>> {
    const results = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(
        and(
          sql`LOWER(${users.username}) LIKE LOWER(${`%${query}%`})`,
          sql`${users.id} != ${currentUserId}`,
          eq(users.banned, false),
          eq(users.emailVerified, true)
        )
      )
      .limit(10);
    return results;
  }

  async getOrCreateConversation(user1Id: number, user2Id: number): Promise<Conversation> {
    const existing = await this.getConversation(user1Id, user2Id);
    if (existing) return existing;

    const [canonicalUser1, canonicalUser2] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    
    const [conversation] = await db
      .insert(conversations)
      .values({ user1Id: canonicalUser1, user2Id: canonicalUser2 })
      .returning();
    return conversation!;
  }

  async getConversation(user1Id: number, user2Id: number): Promise<Conversation | undefined> {
    const [canonicalUser1, canonicalUser2] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.user1Id, canonicalUser1),
          eq(conversations.user2Id, canonicalUser2)
        )
      );
    return conversation || undefined;
  }

  async getUserConversations(userId: number): Promise<Array<Conversation & { otherUser: { id: number; username: string; avatarUrl: string | null }; lastMessage?: Message; unreadCount: number }>> {
    const userConvos = await db
      .select()
      .from(conversations)
      .where(
        sql`${conversations.user1Id} = ${userId} OR ${conversations.user2Id} = ${userId}`
      )
      .orderBy(desc(conversations.lastMessageAt));

    const results = await Promise.all(
      userConvos.map(async (convo) => {
        const otherUserId = convo.user1Id === userId ? convo.user2Id : convo.user1Id;
        const [otherUser] = await db
          .select({ id: users.id, username: users.username, avatarUrl: users.avatarUrl })
          .from(users)
          .where(eq(users.id, otherUserId));

        const [lastMsg] = await db
          .select()
          .from(messages)
          .where(eq(messages.conversationId, convo.id))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        const unreadMsgs = await db
          .select({ count: sql<number>`count(*)` })
          .from(messages)
          .leftJoin(
            messageReads,
            and(
              eq(messageReads.messageId, messages.id),
              eq(messageReads.userId, userId)
            )
          )
          .where(
            and(
              eq(messages.conversationId, convo.id),
              sql`${messages.receiverId} = ${userId}`,
              sql`${messageReads.id} IS NULL`
            )
          );

        return {
          ...convo,
          otherUser: otherUser!,
          lastMessage: lastMsg || undefined,
          unreadCount: Number(unreadMsgs[0]?.count ?? 0),
        };
      })
    );

    return results;
  }

  async sendMessage(senderId: number, receiverId: number, content: string, imageUrl?: string): Promise<Message> {
    const conversation = await this.getOrCreateConversation(senderId, receiverId);

    const [message] = await db
      .insert(messages)
      .values({
        conversationId: conversation.id,
        senderId,
        receiverId,
        content,
        imageUrl,
      })
      .returning();

    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversation.id));

    return message!;
  }

  async getConversationMessages(conversationId: number, userId: number): Promise<Message[]> {
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    return msgs;
  }

  async markMessagesAsRead(conversationId: number, userId: number): Promise<void> {
    const unreadMessages = await db
      .select({ id: messages.id })
      .from(messages)
      .leftJoin(
        messageReads,
        and(
          eq(messageReads.messageId, messages.id),
          eq(messageReads.userId, userId)
        )
      )
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.receiverId, userId),
          sql`${messageReads.id} IS NULL`
        )
      );

    for (const msg of unreadMessages) {
      await db.insert(messageReads).values({
        messageId: msg.id,
        userId,
      });
    }
  }

  async getUnreadMessageCount(userId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .leftJoin(
        messageReads,
        and(
          eq(messageReads.messageId, messages.id),
          eq(messageReads.userId, userId)
        )
      )
      .where(
        and(
          eq(messages.receiverId, userId),
          sql`${messageReads.id} IS NULL`
        )
      );

    return Number(result?.count ?? 0);
  }

  async deleteMessage(messageId: number, userId: number): Promise<boolean> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId));

    if (!message || message.senderId !== userId) {
      return false;
    }

    await db
      .update(messages)
      .set({ deleted: true })
      .where(eq(messages.id, messageId));

    return true;
  }

  async adminGetAllConversations(): Promise<Array<{ user1: { id: number; username: string }; user2: { id: number; username: string }; messageCount: number; lastMessageAt: Date | null }>> {
    const allConvos = await db
      .select()
      .from(conversations)
      .orderBy(desc(conversations.lastMessageAt));

    const results = await Promise.all(
      allConvos.map(async (convo) => {
        const [user1] = await db
          .select({ id: users.id, username: users.username })
          .from(users)
          .where(eq(users.id, convo.user1Id));

        const [user2] = await db
          .select({ id: users.id, username: users.username })
          .from(users)
          .where(eq(users.id, convo.user2Id));

        const [msgCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(messages)
          .where(eq(messages.conversationId, convo.id));

        return {
          user1: user1!,
          user2: user2!,
          messageCount: Number(msgCount?.count ?? 0),
          lastMessageAt: convo.lastMessageAt,
        };
      })
    );

    return results;
  }

  async adminGetConversationMessages(user1Id: number, user2Id: number): Promise<Message[]> {
    const conversation = await this.getConversation(user1Id, user2Id);
    if (!conversation) return [];

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversation.id))
      .orderBy(messages.createdAt);

    return msgs;
  }

  async adminDeleteMessage(messageId: number): Promise<boolean> {
    await db
      .update(messages)
      .set({ deleted: true })
      .where(eq(messages.id, messageId));
    return true;
  }

  async adminLogConversationView(adminId: number, viewedUser1Id: number, viewedUser2Id: number): Promise<void> {
    await db.insert(adminMessageAudit).values({
      adminId,
      viewedUser1Id,
      viewedUser2Id,
    });
  }

  async adminGetAuditLogs(): Promise<Array<AdminMessageAudit & { adminUsername: string; user1Username: string; user2Username: string }>> {
    const logs = await db
      .select({
        id: adminMessageAudit.id,
        adminId: adminMessageAudit.adminId,
        viewedUser1Id: adminMessageAudit.viewedUser1Id,
        viewedUser2Id: adminMessageAudit.viewedUser2Id,
        viewedAt: adminMessageAudit.viewedAt,
      })
      .from(adminMessageAudit)
      .orderBy(desc(adminMessageAudit.viewedAt));

    const results = await Promise.all(
      logs.map(async (log) => {
        const [admin] = await db
          .select({ username: users.username })
          .from(users)
          .where(eq(users.id, log.adminId));

        const [user1] = await db
          .select({ username: users.username })
          .from(users)
          .where(eq(users.id, log.viewedUser1Id));

        const [user2] = await db
          .select({ username: users.username })
          .from(users)
          .where(eq(users.id, log.viewedUser2Id));

        return {
          ...log,
          adminUsername: admin?.username ?? 'Unknown',
          user1Username: user1?.username ?? 'Unknown',
          user2Username: user2?.username ?? 'Unknown',
        };
      })
    );

    return results;
  }
}

export const storage = new DatabaseStorage();
