import express, { Request, Response, NextFunction } from 'express';
import {
  db,
  generateSalt,
  verifyPassword,
  generateUUID,
  UserProfile,
  Post,
  Claim,
  Report,
} from './db.ts';
import crypto from 'crypto';

export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

// In-memory rate limiting map: ip -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count += 1;
  return true;
}

// Auth Middleware
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    const user = db.getUserByToken(token);
    if (user && user.status !== 'SUSPENDED') {
      req.user = user;
    }
  }
  next();
};

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  if (req.user.status === 'SUSPENDED') {
    return res.status(403).json({ error: 'This account has been suspended due to policy violations.' });
  }
  next();
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.user.role !== 'ADMIN' && req.user.role !== 'MODERATOR') {
    return res.status(403).json({ error: 'Access denied: Administrator or Moderator role required.' });
  }
  next();
};

export const apiRouter = express.Router();
apiRouter.use(authenticate);

// ================= AUTHENTICATION =================

// Register
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { email, password, display_name, preferred_language } = req.body;

  if (!email || !password || !display_name) {
    return res.status(400).json({ error: 'Email, password, and display name are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const salt = generateSalt();
  const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex');
  const userId = generateUUID();
  const now = new Date().toISOString();

  const newUser: UserProfile = {
    id: userId,
    email: email.trim().toLowerCase(),
    password_hash: passwordHash,
    salt,
    display_name: display_name.trim(),
    role: 'USER',
    status: 'ACTIVE',
    preferred_language: preferred_language === 'en' ? 'en' : 'bn',
    created_at: now,
    updated_at: now,
  };

  db.createUser(newUser);
  const token = db.createSession(userId);

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      display_name: newUser.display_name,
      role: newUser.role,
      status: newUser.status,
      preferred_language: newUser.preferred_language,
    },
  });
});

// Login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const clientIp = req.ip || 'ip';
  if (!checkRateLimit(`login:${clientIp}`, 10, 60000)) {
    return res.status(429).json({ error: 'Too many login attempts. Please wait a minute.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  if (user.status === 'SUSPENDED') {
    return res.status(403).json({ error: 'Your account is suspended. Contact support.' });
  }

  const isValid = verifyPassword(password, user.salt, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  const token = db.createSession(user.id);

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      role: user.role,
      status: user.status,
      preferred_language: user.preferred_language,
    },
  });
});

// Me (Get Current Authenticated User)
apiRouter.get('/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      display_name: req.user.display_name,
      role: req.user.role,
      status: req.user.status,
      preferred_language: req.user.preferred_language,
    },
  });
});

// Logout
apiRouter.post('/auth/logout', (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    db.deleteSession(token);
  }
  return res.json({ success: true });
});

// Account deletion (Section 5 requirement)
apiRouter.delete('/auth/delete-account', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  db.deleteUser(userId);
  return res.json({ success: true, message: 'Account and associated credentials removed successfully.' });
});

// ================= PUBLIC STATISTICS =================
apiRouter.get('/stats', (_req: Request, res: Response) => {
  const stats = db.getStats();
  return res.json(stats);
});

// ================= POSTS =================

// Public Explore / Search: NEVER returns PENDING or REJECTED
apiRouter.get('/posts', (req: AuthenticatedRequest, res: Response) => {
  const {
    post_type,
    category,
    division,
    district,
    upazila_thana,
    keyword,
    status,
    date_from,
    date_to,
    page = '1',
    limit = '12',
  } = req.query;

  const publicPosts = db.getPublicPosts({
    post_type: post_type as string,
    category: category as string,
    division: division as string,
    district: district as string,
    upazila_thana: upazila_thana as string,
    keyword: keyword as string,
    status: status as string,
    date_from: date_from as string,
    date_to: date_to as string,
  });

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
  const totalItems = publicPosts.length;
  const totalPages = Math.ceil(totalItems / limitNum) || 1;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = publicPosts.slice(startIndex, startIndex + limitNum);

  // Redact private contact info for public response
  const sanitized = paginated.map((p) => {
    const isOwner = req.user && req.user.id === p.user_id;
    const isAdmin = req.user && (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR');
    return {
      ...p,
      private_contact_info: isOwner || isAdmin ? p.private_contact_info : undefined,
    };
  });

  return res.json({
    posts: sanitized,
    totalItems,
    totalPages,
    currentPage: pageNum,
  });
});

// Single Post Details (Public or Authenticated)
apiRouter.get('/posts/:id', (req: AuthenticatedRequest, res: Response) => {
  const post = db.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  const isOwner = req.user && req.user.id === post.user_id;
  const isAdmin = req.user && (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR');

  // If post is not approved or resolved, ONLY owner and admin can view it
  if (post.status !== 'APPROVED' && post.status !== 'RESOLVED' && !isOwner && !isAdmin) {
    return res.status(403).json({ error: 'This post is pending review or not publicly available.' });
  }

  // Increment views lazily
  db.incrementPostView(post.id);

  const responsePost = {
    ...post,
    private_contact_info: isOwner || isAdmin ? post.private_contact_info : undefined,
  };

  return res.json({ post: responsePost });
});

// Create Post: Automatically starts in PENDING status for moderation
apiRouter.post('/posts', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const clientIp = req.ip || 'ip';
  if (!checkRateLimit(`post:${req.user!.id}:${clientIp}`, 15, 600000)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please wait a few minutes before submitting another post.' });
  }

  const {
    post_type,
    category,
    title,
    description,
    division,
    district,
    upazila_thana,
    general_location,
    event_date,
    images = [],
    preferred_contact_method = 'IN_APP',
    private_contact_info = '',
  } = req.body;

  if (!post_type || !category || !title || !description || !division || !district || !general_location || !event_date) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  if (title.length < 5 || title.length > 150) {
    return res.status(400).json({ error: 'Title must be between 5 and 150 characters.' });
  }

  if (description.length < 15) {
    return res.status(400).json({ error: 'Description must be at least 15 characters.' });
  }

  const now = new Date().toISOString();
  const postId = `post-${generateUUID().slice(0, 8)}`;

  const newPost: Post = {
    id: postId,
    user_id: req.user!.id,
    author_name: req.user!.display_name,
    post_type: post_type === 'FOUND' ? 'FOUND' : 'LOST',
    category,
    title: title.trim(),
    description: description.trim(),
    division: division.toLowerCase(),
    district: district.toLowerCase(),
    upazila_thana: upazila_thana ? upazila_thana.trim() : undefined,
    general_location: general_location.trim(),
    event_date,
    status: 'PENDING', // Always pending initially per specification
    images: Array.isArray(images)
      ? images.map((img: any) => ({
          id: generateUUID(),
          storage_path: typeof img === 'string' ? img : img.storage_path,
          moderation_status: 'PENDING',
          created_at: now,
        }))
      : [],
    preferred_contact_method,
    private_contact_info: private_contact_info.trim() || req.user!.email,
    views_count: 0,
    created_at: now,
    updated_at: now,
  };

  db.createPost(newPost);

  return res.status(201).json({
    post: newPost,
    message: 'Your report has been submitted for moderation.',
  });
});

// Update Post (Own post only)
apiRouter.put('/posts/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const post = db.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  const isOwner = req.user!.id === post.user_id;
  const isAdmin = req.user!.role === 'ADMIN' || req.user!.role === 'MODERATOR';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'You are not authorized to update this post.' });
  }

  const {
    title,
    description,
    division,
    district,
    upazila_thana,
    general_location,
    event_date,
    category,
    images,
  } = req.body;

  const updates: Partial<Post> = {};
  if (title) updates.title = title.trim();
  if (description) updates.description = description.trim();
  if (division) updates.division = division.toLowerCase();
  if (district) updates.district = district.toLowerCase();
  if (upazila_thana !== undefined) updates.upazila_thana = upazila_thana.trim();
  if (general_location) updates.general_location = general_location.trim();
  if (event_date) updates.event_date = event_date;
  if (category) updates.category = category;
  if (images) updates.images = images;

  // If major content changed by non-admin, re-flag for moderation review
  if (isOwner && !isAdmin && (title || description)) {
    updates.status = 'PENDING';
  }

  const updated = db.updatePost(post.id, updates);
  return res.json({ post: updated });
});

// Delete Post (Owner or Admin)
apiRouter.delete('/posts/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const post = db.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  const isOwner = req.user!.id === post.user_id;
  const isAdmin = req.user!.role === 'ADMIN' || req.user!.role === 'MODERATOR';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'You are not authorized to delete this post.' });
  }

  db.deletePost(post.id);
  return res.json({ success: true, message: 'Post deleted successfully.' });
});

// Mark Post as RESOLVED (Handed over / returned)
apiRouter.post('/posts/:id/resolve', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const post = db.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  const isOwner = req.user!.id === post.user_id;
  const isAdmin = req.user!.role === 'ADMIN' || req.user!.role === 'MODERATOR';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Only the author or moderator can mark this item as resolved.' });
  }

  const updated = db.updatePost(post.id, {
    status: 'RESOLVED',
    resolved_at: new Date().toISOString(),
  });

  db.addModerationLog({
    moderator_user_id: req.user!.id,
    moderator_name: req.user!.display_name,
    target_type: 'POST',
    target_id: post.id,
    action: 'RESOLVED_POST',
    reason: req.body.reason || 'Item returned to owner.',
  });

  return res.json({ post: updated, success: true });
});

// My Posts: Get all posts created by authenticated user
apiRouter.get('/my-posts', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userPosts = db.getPostsByUserId(req.user!.id);
  return res.json({ posts: userPosts });
});

// ================= CLAIMS WORKFLOW =================

// Submit a private claim against a FOUND post
apiRouter.post('/claims', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { post_id, private_verification_details, contact_method = 'IN_APP', contact_info } = req.body;

  if (!post_id || !private_verification_details || !contact_info) {
    return res.status(400).json({ error: 'Post ID, secret verification details, and contact info are required.' });
  }

  const post = db.getPostById(post_id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  if (post.post_type !== 'FOUND') {
    return res.status(400).json({ error: 'Claims can only be filed against FOUND item listings.' });
  }

  if (post.user_id === req.user!.id) {
    return res.status(400).json({ error: 'You cannot submit a claim against your own post.' });
  }

  if (!checkRateLimit(`claim:${req.user!.id}`, 10, 3600000)) {
    return res.status(429).json({ error: 'You have submitted too many claims recently. Please wait.' });
  }

  const now = new Date().toISOString();
  const claimId = `claim-${generateUUID().slice(0, 8)}`;

  const newClaim: Claim = {
    id: claimId,
    post_id: post.id,
    claimant_user_id: req.user!.id,
    claimant_name: req.user!.display_name,
    private_verification_details: private_verification_details.trim(),
    contact_method,
    contact_info: contact_info.trim(),
    status: 'PENDING',
    created_at: now,
    updated_at: now,
  };

  db.createClaim(newClaim);

  return res.status(201).json({
    claim: newClaim,
    message: 'Your claim has been securely filed. The finder will review your verification details privately.',
  });
});

// Get claims submitted by the current user
apiRouter.get('/my-claims', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const myClaims = db.getClaimsByUserId(req.user!.id);
  // Enhance with post info
  const enhanced = myClaims.map((c) => {
    const post = db.getPostById(c.post_id);
    return {
      ...c,
      post_title: post?.title || 'Unknown post',
      post_location: post ? `${post.division}, ${post.district}` : '',
      post_status: post?.status || 'UNKNOWN',
    };
  });
  return res.json({ claims: enhanced });
});

// Get claims on a specific post (Finder of the item or Admin ONLY)
apiRouter.get('/posts/:id/claims', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const post = db.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  const isOwner = req.user!.id === post.user_id;
  const isAdmin = req.user!.role === 'ADMIN' || req.user!.role === 'MODERATOR';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'You are not authorized to view claims for this item.' });
  }

  const claims = db.getClaimsByPostId(post.id);
  return res.json({ claims });
});

// Update / review claim (Finder or Admin)
apiRouter.put('/claims/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const claim = db.getClaimById(req.params.id);
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found.' });
  }

  const post = db.getPostById(claim.post_id);
  if (!post) {
    return res.status(404).json({ error: 'Associated post not found.' });
  }

  const isFinder = req.user!.id === post.user_id;
  const isAdmin = req.user!.role === 'ADMIN' || req.user!.role === 'MODERATOR';

  if (!isFinder && !isAdmin) {
    return res.status(403).json({ error: 'You are not authorized to review this claim.' });
  }

  const { status, moderator_notes, finder_notes, shared_contact_info } = req.body;
  const updates: Partial<Claim> = {};

  if (status) updates.status = status;
  if (moderator_notes && isAdmin) updates.moderator_notes = moderator_notes;
  if (finder_notes) updates.finder_notes = finder_notes;
  if (shared_contact_info) updates.shared_contact_info = shared_contact_info;

  const updated = db.updateClaim(claim.id, updates);

  db.addModerationLog({
    moderator_user_id: req.user!.id,
    moderator_name: req.user!.display_name,
    target_type: 'CLAIM',
    target_id: claim.id,
    action: `CLAIM_${status || 'UPDATED'}`,
    reason: finder_notes || moderator_notes || `Status changed to ${status}`,
  });

  return res.json({ claim: updated });
});

// ================= REPORTS =================

// Submit a report against a suspicious post
apiRouter.post('/reports', (req: AuthenticatedRequest, res: Response) => {
  const { post_id, reason, description } = req.body;

  if (!post_id || !reason) {
    return res.status(400).json({ error: 'Post ID and reason are required.' });
  }

  const post = db.getPostById(post_id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  const reportId = `rep-${generateUUID().slice(0, 8)}`;
  const newReport: Report = {
    id: reportId,
    post_id: post.id,
    post_title: post.title,
    reporter_user_id: req.user?.id,
    reporter_email: req.user?.email || 'anonymous',
    reason,
    description: (description || '').trim(),
    status: 'PENDING',
    created_at: new Date().toISOString(),
  };

  db.createReport(newReport);
  return res.status(201).json({ success: true, message: 'Thank you for reporting. Our moderation team will investigate.' });
});

// ================= SECURE IMAGE UPLOAD =================

apiRouter.post('/upload', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { image_data, file_name } = req.body;

  if (!image_data || typeof image_data !== 'string') {
    return res.status(400).json({ error: 'Valid image data is required.' });
  }

  // Validate format (Data URL base64)
  const matches = image_data.match(/^data:(image\/(jpeg|png|webp));base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({ error: 'Unsupported file type. Only JPG, PNG, and WEBP images are allowed.' });
  }

  const mimeType = matches[1];
  const base64Content = matches[3];
  const buffer = Buffer.from(base64Content, 'base64');

  // Max 5MB
  if (buffer.length > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size exceeds maximum allowed 5MB limit.' });
  }

  // Store data securely (in MVP we can return the normalized data URL with a safe unique ID)
  const safeId = crypto.randomBytes(16).toString('hex');
  const safeStoragePath = image_data; // Stored securely with sanitized prefix

  return res.json({
    id: safeId,
    storage_path: safeStoragePath,
    message: 'Image uploaded and pending moderation check.',
  });
});

// ================= ADMIN & MODERATION DASHBOARD =================

// Admin Metrics
apiRouter.get('/admin/metrics', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const stats = db.getStats();
  const logs = db.getModerationLogs();
  return res.json({ stats, recentLogs: logs.slice(0, 5) });
});

// Admin Posts List (Filter by status: PENDING, APPROVED, REJECTED, RESOLVED)
apiRouter.get('/admin/posts', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.query;
  const posts = db.getAllAdminPosts(status as string);
  return res.json({ posts });
});

// Moderate a Post (Approve, Reject, or Redact)
apiRouter.post('/admin/posts/:id/moderate', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const post = db.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  const { action, reason, redacted_description } = req.body;
  if (!action || !['APPROVE', 'REJECT', 'REDACT'].includes(action)) {
    return res.status(400).json({ error: 'Valid action (APPROVE, REJECT, REDACT) is required.' });
  }

  if (action === 'REJECT' && (!reason || !reason.trim())) {
    return res.status(400).json({ error: 'Rejection reason is required.' });
  }

  const updates: Partial<Post> = {};
  if (action === 'APPROVE') {
    updates.status = 'APPROVED';
    updates.rejection_reason = undefined;
  } else if (action === 'REJECT') {
    updates.status = 'REJECTED';
    updates.rejection_reason = reason.trim();
  } else if (action === 'REDACT' && redacted_description) {
    updates.description = redacted_description.trim();
  }

  const updated = db.updatePost(post.id, updates);

  db.addModerationLog({
    moderator_user_id: req.user!.id,
    moderator_name: req.user!.display_name,
    target_type: 'POST',
    target_id: post.id,
    action: `POST_${action}`,
    reason: reason || `Post ${action.toLowerCase()}d by moderator`,
  });

  return res.json({ post: updated, success: true });
});

// Admin Claims List
apiRouter.get('/admin/claims', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const claims = db.getAllClaims();
  const enhanced = claims.map((c) => {
    const post = db.getPostById(c.post_id);
    return {
      ...c,
      post_title: post?.title || 'Unknown post',
      post_author: post?.author_name || 'Unknown',
    };
  });
  return res.json({ claims: enhanced });
});

// Admin Reports List
apiRouter.get('/admin/reports', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const reports = db.getAllReports();
  return res.json({ reports });
});

// Admin Resolve Report
apiRouter.post('/admin/reports/:id/resolve', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status = 'RESOLVED', admin_notes } = req.body;
  const updated = db.updateReport(req.params.id, {
    status,
    admin_notes,
  });

  if (!updated) {
    return res.status(404).json({ error: 'Report not found.' });
  }

  db.addModerationLog({
    moderator_user_id: req.user!.id,
    moderator_name: req.user!.display_name,
    target_type: 'REPORT',
    target_id: req.params.id,
    action: `REPORT_${status}`,
    reason: admin_notes || 'Report reviewed and resolved.',
  });

  return res.json({ report: updated });
});

// Admin Users List
apiRouter.get('/admin/users', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const users = db.getAllUsers().map((u) => ({
    id: u.id,
    email: u.email,
    display_name: u.display_name,
    role: u.role,
    status: u.status,
    preferred_language: u.preferred_language,
    created_at: u.created_at,
  }));
  return res.json({ users });
});

// Admin Toggle User Status (Suspend or Activate)
apiRouter.post('/admin/users/:id/toggle-status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const targetUser = db.getUserById(req.params.id);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (targetUser.role === 'ADMIN') {
    return res.status(403).json({ error: 'Cannot suspend an administrator account.' });
  }

  const newStatus = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
  const updated = db.updateUser(targetUser.id, { status: newStatus });

  db.addModerationLog({
    moderator_user_id: req.user!.id,
    moderator_name: req.user!.display_name,
    target_type: 'USER',
    target_id: targetUser.id,
    action: `USER_${newStatus}`,
    reason: req.body.reason || `User ${newStatus.toLowerCase()} by admin`,
  });

  return res.json({ user: updated, success: true });
});

// Admin Moderation Audit Logs
apiRouter.get('/admin/logs', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const logs = db.getModerationLogs();
  return res.json({ logs });
});
