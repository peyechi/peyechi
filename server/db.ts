import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserProfile {
  id: string;
  email: string;
  password_hash: string;
  salt: string;
  display_name: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  preferred_language: 'bn' | 'en';
  created_at: string;
  updated_at: string;
}

export interface PostImage {
  id: string;
  storage_path: string;
  moderation_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  author_name: string;
  post_type: 'LOST' | 'FOUND';
  category: string;
  title: string;
  description: string;
  division: string;
  district: string;
  upazila_thana?: string;
  general_location: string;
  event_date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
  rejection_reason?: string;
  images: PostImage[];
  preferred_contact_method: 'IN_APP' | 'EMAIL' | 'PHONE';
  private_contact_info: string; // Stored securely, never returned in public queries
  views_count: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface Claim {
  id: string;
  post_id: string;
  claimant_user_id: string;
  claimant_name: string;
  private_verification_details: string; // Identifying features only true owner knows
  contact_method: 'IN_APP' | 'EMAIL' | 'PHONE';
  contact_info: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  moderator_notes?: string;
  finder_notes?: string;
  shared_contact_info?: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  post_id: string;
  post_title: string;
  reporter_user_id?: string;
  reporter_email?: string;
  reason: string;
  description: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  admin_notes?: string;
  created_at: string;
}

export interface ModerationLog {
  id: string;
  moderator_user_id: string;
  moderator_name: string;
  target_type: 'POST' | 'CLAIM' | 'REPORT' | 'USER';
  target_id: string;
  action: string;
  reason: string;
  created_at: string;
}

export interface Session {
  token: string;
  userId: string;
  createdAt: number;
}

export interface DatabaseSchema {
  users: UserProfile[];
  posts: Post[];
  claims: Claim[];
  reports: Report[];
  moderation_logs: ModerationLog[];
  sessions: Session[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const calculated = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(calculated, 'hex'), Buffer.from(hash, 'hex'));
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

function getInitialDatabase(): DatabaseSchema {
  const adminSalt = generateSalt();
  const userSalt1 = generateSalt();
  const userSalt2 = generateSalt();

  const adminId = 'usr-admin-01';
  const userId1 = 'usr-rahim-02';
  const userId2 = 'usr-tanvir-03';

  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();
  const threeDaysAgo = new Date(Date.now() - 259200000).toISOString();

  return {
    users: [
      {
        id: adminId,
        email: 'admin@lostfound.bd',
        password_hash: hashPassword('Admin@123456', adminSalt),
        salt: adminSalt,
        display_name: 'সুপার মডারেটর (Platform Admin)',
        role: 'ADMIN',
        status: 'ACTIVE',
        preferred_language: 'bn',
        created_at: threeDaysAgo,
        updated_at: threeDaysAgo,
      },
      {
        id: userId1,
        email: 'rahim@example.com',
        password_hash: hashPassword('User@123456', userSalt1),
        salt: userSalt1,
        display_name: 'আব্দুর রহিম',
        role: 'USER',
        status: 'ACTIVE',
        preferred_language: 'bn',
        created_at: twoDaysAgo,
        updated_at: twoDaysAgo,
      },
      {
        id: userId2,
        email: 'tanvir@example.com',
        password_hash: hashPassword('User@123456', userSalt2),
        salt: userSalt2,
        display_name: 'তানভীর আহমেদ',
        role: 'USER',
        status: 'ACTIVE',
        preferred_language: 'en',
        created_at: yesterday,
        updated_at: yesterday,
      },
    ],
    posts: [
      {
        id: 'post-doc-01',
        user_id: userId1,
        author_name: 'আব্দুর রহিম',
        post_type: 'FOUND',
        category: 'DOCUMENTS',
        title: 'ধানমন্ডি ২৭ নম্বরে পাওয়া একটি ড্রাইভিং লাইসেন্স ও স্টুডেন্ট আইডি',
        description: 'ধানমন্ডি ২৭ নম্বর বাস স্ট্যান্ডের পাশে একটি প্লাস্টিক কভারযুক্ত আইডি কার্ড পাওয়া গেছে। কার্ডের উপরিভাগে ঢাকা বিশ্ববিদ্যালয়ের একটি অনুষদের নাম রয়েছে। সংবেদনশীল নম্বরের অংশ গোপন রাখা হয়েছে। প্রকৃত মালিক গোপন তথ্য দিয়ে দাবি করুন।',
        division: 'dhaka',
        district: 'dhaka',
        upazila_thana: 'ধানমন্ডি',
        general_location: 'ধানমন্ডি ২৭ নম্বর বাস স্টপ সংলগ্ন ফুটপাত',
        event_date: '2026-10-14',
        status: 'APPROVED',
        images: [],
        preferred_contact_method: 'IN_APP',
        private_contact_info: '01711000000 (Private Finder Line)',
        views_count: 84,
        created_at: twoDaysAgo,
        updated_at: twoDaysAgo,
      },
      {
        id: 'post-elec-02',
        user_id: userId2,
        author_name: 'তানভীর আহমেদ',
        post_type: 'LOST',
        category: 'ELECTRONICS',
        title: 'কালো রঙের স্যামসাং গ্যালাক্সি স্মার্টফোন হারানো গেছে',
        description: 'মতিঝিল বাংলাদেশ ব্যাংক সংলগ্ন এলাকায় রিকশা থেকে নামার সময় স্যামসাং গ্যালাক্সি সিরিজের একটি কালো ফোন পড়ে গেছে। ব্যাক কভারে একটি স্বচ্ছ প্রটেক্টর রয়েছে। কেউ পেয়ে থাকলে অনুগ্রহ করে প্ল্যাটফর্মের মাধ্যমে যোগাযোগ করুন।',
        division: 'dhaka',
        district: 'dhaka',
        upazila_thana: 'মতিঝিল',
        general_location: 'মতিঝিল শাপলা চত্বর থেকে ব্যাংকপাড়া মোড়',
        event_date: '2026-10-15',
        status: 'APPROVED',
        images: [],
        preferred_contact_method: 'EMAIL',
        private_contact_info: 'tanvir@example.com',
        views_count: 142,
        created_at: yesterday,
        updated_at: yesterday,
      },
      {
        id: 'post-bag-03',
        user_id: userId1,
        author_name: 'আব্দুর রহিম',
        post_type: 'FOUND',
        category: 'BAGS_WALLETS',
        title: 'চট্টগ্রাম আগ্রাবাদ বাণিজ্যিক এলাকায় পাওয়া বাদামী রঙের লেদার ওয়ালেট',
        description: 'আগ্রাবাদ হোটেলের নিকটবর্তী এটিএম বুথের পাশে একটি বাদামী রঙের চামড়ার মানিব্যাগ পাওয়া গেছে। ভেতরে কিছু কাগজপত্র ও কার্ড রয়েছে। প্রকৃত মালিক ভেতরের নির্দিষ্ট নিদর্শন উল্লেখ করে দাবি পেশ করুন।',
        division: 'chattogram',
        district: 'chattogram',
        upazila_thana: 'আগ্রাবাদ',
        general_location: 'আগ্রাবাদ কমার্শিয়াল এরিয়া, এটিএম বুথ সংলগ্ন',
        event_date: '2026-10-13',
        status: 'APPROVED',
        images: [],
        preferred_contact_method: 'IN_APP',
        private_contact_info: 'finder_chattogram@relay.lostfound.bd',
        views_count: 98,
        created_at: twoDaysAgo,
        updated_at: twoDaysAgo,
      },
      {
        id: 'post-pet-04',
        user_id: userId2,
        author_name: 'তানভীর আহমেদ',
        post_type: 'FOUND',
        category: 'PETS',
        title: 'উত্তরা সেক্টর ৭ এ একটি সাদা ও বাদামী রঙের দেশি পোষা বিড়াল পাওয়া গেছে',
        description: 'উত্তরা ৭ নম্বর সেক্টরের লেক পার্কের কাছাকাছি গলায় লাল ফিতা পরিহিত একটি শান্ত স্বভাবের বিড়াল পাওয়া গেছে। বিড়ালটি খুব যত্ন নেওয়া হয়েছে বলে মনে হয়। প্রকৃত অভিভাবক গলায় থাকা লকেটের চিহ্ন জানিয়ে যোগাযোগ করুন।',
        division: 'dhaka',
        district: 'dhaka',
        upazila_thana: 'উত্তরা',
        general_location: 'উত্তরা সেক্টর ৭, লেক পার্ক রোড',
        event_date: '2026-10-12',
        status: 'RESOLVED',
        resolved_at: yesterday,
        images: [],
        preferred_contact_method: 'IN_APP',
        private_contact_info: 'cat_guardian@relay.lostfound.bd',
        views_count: 230,
        created_at: threeDaysAgo,
        updated_at: yesterday,
      },
      {
        id: 'post-pending-05',
        user_id: userId2,
        author_name: 'তানভীর আহমেদ',
        post_type: 'LOST',
        category: 'KEYS',
        title: 'সিলেট জিন্দাবাজার এলাকায় ইয়ামাহা মোটরসাইকেলের চাবি হারানো গেছে',
        description: 'জিন্দাবাজার সিটি সেন্টার মার্কেটের সামনে ইয়ামাহা এফজেড বাইকের দুটি চাবি একটি লেদার কি-রিং সহ হারিয়ে গেছে। কেউ পেলে দয়া করে জানান।',
        division: 'sylhet',
        district: 'sylhet',
        upazila_thana: 'কোতোয়ালী',
        general_location: 'জিন্দাবাজার সিটি সেন্টার মার্কেট পার্কিং',
        event_date: '2026-10-16',
        status: 'PENDING',
        images: [],
        preferred_contact_method: 'IN_APP',
        private_contact_info: 'bike_owner@relay.lostfound.bd',
        views_count: 5,
        created_at: now,
        updated_at: now,
      },
    ],
    claims: [
      {
        id: 'claim-01',
        post_id: 'post-bag-03',
        claimant_user_id: userId2,
        claimant_name: 'তানভীর আহমেদ',
        private_verification_details: 'মানিব্যাগের ভেতরের বাম পাশের কার্ড স্লটে একটি পুরনো বুয়েটের লাইব্রেরি কার্ড আছে এবং চেইনের ভেতর ১০ টাকার একটি পুরনো স্মারক নোট রয়েছে।',
        contact_method: 'EMAIL',
        contact_info: 'tanvir@example.com',
        status: 'UNDER_REVIEW',
        moderator_notes: 'Claimant provided very specific details. Waiting for finder confirmation.',
        created_at: yesterday,
        updated_at: yesterday,
      },
    ],
    reports: [
      {
        id: 'rep-01',
        post_id: 'post-doc-01',
        post_title: 'ধানমন্ডি ২৭ নম্বরে পাওয়া একটি ড্রাইভিং লাইসেন্স ও স্টুডেন্ট আইডি',
        reporter_user_id: userId2,
        reporter_email: 'tanvir@example.com',
        reason: 'EXPOSED_PII',
        description: 'পোস্টে নামের বিবরণ কিছুটা বিস্তারিত দেওয়া হয়েছে কিনা তা রিভিউ করার অনুরোধ।',
        status: 'PENDING',
        created_at: yesterday,
      },
    ],
    moderation_logs: [
      {
        id: 'log-01',
        moderator_user_id: adminId,
        moderator_name: 'সুপার মডারেটর (Platform Admin)',
        target_type: 'POST',
        target_id: 'post-doc-01',
        action: 'APPROVED_POST',
        reason: 'Post content verified, no sensitive document numbers exposed.',
        created_at: twoDaysAgo,
      },
      {
        id: 'log-02',
        moderator_user_id: adminId,
        moderator_name: 'সুপার মডারেটর (Platform Admin)',
        target_type: 'POST',
        target_id: 'post-pet-04',
        action: 'RESOLVED_POST',
        reason: 'Owner identified and verified through private locket marker.',
        created_at: yesterday,
      },
    ],
    sessions: [],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database.json, initializing fresh data:', err);
        this.data = getInitialDatabase();
        this.save();
      }
    } else {
      this.data = getInitialDatabase();
      this.save();
    }
  }

  public save() {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  // Users & Auth
  public getUserByEmail(email: string): UserProfile | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: UserProfile) {
    this.data.users.push(user);
    this.save();
  }

  public updateUser(id: string, updates: Partial<UserProfile>) {
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.data.users[index] = {
        ...this.data.users[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.save();
      return this.data.users[index];
    }
    return undefined;
  }

  public deleteUser(id: string) {
    this.data.users = this.data.users.filter((u) => u.id !== id);
    this.data.sessions = this.data.sessions.filter((s) => s.userId !== id);
    this.save();
  }

  public getAllUsers(): UserProfile[] {
    return this.data.users;
  }

  // Sessions
  public createSession(userId: string): string {
    const token = generateToken();
    this.data.sessions.push({
      token,
      userId,
      createdAt: Date.now(),
    });
    this.save();
    return token;
  }

  public getUserByToken(token: string): UserProfile | undefined {
    const session = this.data.sessions.find((s) => s.token === token);
    if (!session) return undefined;
    return this.getUserById(session.userId);
  }

  public deleteSession(token: string) {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  // Posts
  public getPublicPosts(filter?: {
    post_type?: string;
    category?: string;
    division?: string;
    district?: string;
    upazila_thana?: string;
    keyword?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Post[] {
    let results = this.data.posts.filter((p) => p.status === 'APPROVED' || p.status === 'RESOLVED');

    if (filter) {
      if (filter.post_type && filter.post_type !== 'ALL') {
        results = results.filter((p) => p.post_type.toUpperCase() === filter.post_type?.toUpperCase());
      }
      if (filter.category && filter.category !== 'ALL') {
        results = results.filter((p) => p.category === filter.category);
      }
      if (filter.division && filter.division !== 'ALL') {
        results = results.filter((p) => p.division.toLowerCase() === filter.division?.toLowerCase());
      }
      if (filter.district && filter.district !== 'ALL') {
        results = results.filter((p) => p.district.toLowerCase() === filter.district?.toLowerCase());
      }
      if (filter.status && filter.status !== 'ALL') {
        if (filter.status === 'ACTIVE') {
          results = results.filter((p) => p.status === 'APPROVED');
        } else if (filter.status === 'RESOLVED') {
          results = results.filter((p) => p.status === 'RESOLVED');
        }
      }
      if (filter.date_from) {
        results = results.filter((p) => p.event_date >= filter.date_from!);
      }
      if (filter.date_to) {
        results = results.filter((p) => p.event_date <= filter.date_to!);
      }
      if (filter.keyword && filter.keyword.trim()) {
        const kw = filter.keyword.trim().toLowerCase();
        results = results.filter(
          (p) =>
            p.title.toLowerCase().includes(kw) ||
            p.description.toLowerCase().includes(kw) ||
            p.general_location.toLowerCase().includes(kw) ||
            (p.upazila_thana && p.upazila_thana.toLowerCase().includes(kw))
        );
      }
    }

    return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getPostById(id: string): Post | undefined {
    return this.data.posts.find((p) => p.id === id);
  }

  public incrementPostView(id: string) {
    const post = this.getPostById(id);
    if (post) {
      post.views_count = (post.views_count || 0) + 1;
      this.save();
    }
  }

  public getPostsByUserId(userId: string): Post[] {
    return this.data.posts
      .filter((p) => p.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createPost(post: Post) {
    this.data.posts.unshift(post);
    this.save();
  }

  public updatePost(id: string, updates: Partial<Post>): Post | undefined {
    const index = this.data.posts.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.data.posts[index] = {
        ...this.data.posts[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.save();
      return this.data.posts[index];
    }
    return undefined;
  }

  public deletePost(id: string) {
    this.data.posts = this.data.posts.filter((p) => p.id !== id);
    this.data.claims = this.data.claims.filter((c) => c.post_id !== id);
    this.data.reports = this.data.reports.filter((r) => r.post_id !== id);
    this.save();
  }

  public getAllAdminPosts(status?: string): Post[] {
    let posts = [...this.data.posts];
    if (status && status !== 'ALL') {
      posts = posts.filter((p) => p.status === status);
    }
    return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Claims
  public createClaim(claim: Claim) {
    this.data.claims.unshift(claim);
    this.save();
  }

  public getClaimsByPostId(postId: string): Claim[] {
    return this.data.claims.filter((c) => c.post_id === postId);
  }

  public getClaimsByUserId(userId: string): Claim[] {
    return this.data.claims.filter((c) => c.claimant_user_id === userId);
  }

  public getClaimById(id: string): Claim | undefined {
    return this.data.claims.find((c) => c.id === id);
  }

  public updateClaim(id: string, updates: Partial<Claim>): Claim | undefined {
    const index = this.data.claims.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.data.claims[index] = {
        ...this.data.claims[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.save();
      return this.data.claims[index];
    }
    return undefined;
  }

  public getAllClaims(): Claim[] {
    return this.data.claims.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Reports
  public createReport(report: Report) {
    this.data.reports.unshift(report);
    this.save();
  }

  public getAllReports(): Report[] {
    return this.data.reports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public updateReport(id: string, updates: Partial<Report>): Report | undefined {
    const index = this.data.reports.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.data.reports[index] = {
        ...this.data.reports[index],
        ...updates,
      };
      this.save();
      return this.data.reports[index];
    }
    return undefined;
  }

  // Moderation Logs
  public addModerationLog(log: Omit<ModerationLog, 'id' | 'created_at'>) {
    const entry: ModerationLog = {
      ...log,
      id: generateUUID(),
      created_at: new Date().toISOString(),
    };
    this.data.moderation_logs.unshift(entry);
    this.save();
    return entry;
  }

  public getModerationLogs(): ModerationLog[] {
    return this.data.moderation_logs.slice(0, 50);
  }

  // Database Counts / Real Statistics
  public getStats() {
    const total = this.data.posts.length;
    const approved = this.data.posts.filter((p) => p.status === 'APPROVED').length;
    const resolved = this.data.posts.filter((p) => p.status === 'RESOLVED').length;
    const active = approved;
    const pending = this.data.posts.filter((p) => p.status === 'PENDING').length;
    const rejected = this.data.posts.filter((p) => p.status === 'REJECTED').length;
    const claimsCount = this.data.claims.length;
    const pendingClaims = this.data.claims.filter((c) => c.status === 'PENDING' || c.status === 'UNDER_REVIEW').length;
    const reportsCount = this.data.reports.filter((r) => r.status === 'PENDING').length;

    return {
      total,
      approved,
      resolved,
      active,
      pending,
      rejected,
      claimsCount,
      pendingClaims,
      reportsCount,
    };
  }
}

export const db = new Database();
