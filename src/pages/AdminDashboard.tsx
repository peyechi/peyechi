import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Users,
  Flag,
  FileQuestion,
  History,
  AlertTriangle,
  Eye,
  Check,
  Ban,
  RotateCcw,
  SlidersHorizontal,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user, token } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'pending' | 'posts' | 'claims' | 'reports' | 'users' | 'logs'
  >('pending');

  const [metrics, setMetrics] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reject Modal state
  const [rejectModalItem, setRejectModalItem] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('সংবেদনশীল ডকুমেন্টের নম্বর (NID/পাসপোর্ট) সম্পূর্ণ দৃশ্যমান।');

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

  const fetchMetrics = () => {
    fetch('/api/admin/metrics', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMetrics(data.stats))
      .catch((e) => console.error(e));
  };

  const fetchTabData = () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    if (activeTab === 'overview' || activeTab === 'pending') {
      fetch('/api/admin/posts?status=PENDING', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setPosts(data.posts || []))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else if (activeTab === 'posts') {
      fetch('/api/admin/posts?status=ALL', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setPosts(data.posts || []))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else if (activeTab === 'claims') {
      fetch('/api/admin/claims', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setClaims(data.claims || []))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else if (activeTab === 'reports') {
      fetch('/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setReports(data.reports || []))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else if (activeTab === 'users') {
      fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUsersList(data.users || []))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else if (activeTab === 'logs') {
      fetch('/api/admin/logs', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setLogs(data.logs || []))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
    fetchMetrics();
  };

  useEffect(() => {
    if (isAdmin) {
      fetchTabData();
    }
  }, [activeTab, isAdmin, token]);

  const handleModeratePost = async (postId: string, action: 'APPROVE' | 'REJECT', reason?: string) => {
    try {
      const res = await fetch(`/api/admin/posts/${postId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, reason }),
      });
      if (res.ok) {
        setRejectModalItem(null);
        fetchTabData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: 'Admin toggle status' }),
      });
      if (res.ok) {
        fetchTabData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveReport = async (reportId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, admin_notes: 'Reviewed by moderator' }),
      });
      if (res.ok) {
        fetchTabData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">
          {language === 'bn' ? 'অ্যাক্সেস সংরক্ষিত' : 'Unauthorized Access'}
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'এই পৃষ্ঠাটি কেবল অনুমোদিত মডারেটর এবং অ্যাডমিনিস্ট্রেটরদের জন্য প্রযোজ্য।'
            : 'This moderation portal is restricted to authorized moderators only.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">
              {language === 'bn' ? 'সার্ভার-ভেরিফাইড মডারেশন সিস্টেম' : 'Server-Verified Moderation Engine'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t.adminTitle}
          </h1>
        </div>

        {metrics && (
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-2xs">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>{metrics.pending} {language === 'bn' ? 'অপেক্ষমাণ' : 'Pending'}</span>
            </div>
            <div className="bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{metrics.approved} {language === 'bn' ? 'অনুমোদিত' : 'Approved'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t.adminPendingPosts}</span>
          {metrics?.pending > 0 && (
            <span className="bg-white/30 text-white text-3xs px-1.5 py-0.5 rounded-full ml-1">
              {metrics.pending}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সকল বিজ্ঞপ্তি' : 'All Listings'}</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'claims'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileQuestion className="w-3.5 h-3.5" />
          <span>{t.adminPendingClaims}</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>{t.adminReports}</span>
          {metrics?.reportsCount > 0 && (
            <span className="bg-white/30 text-white text-3xs px-1.5 py-0.5 rounded-full ml-1">
              {metrics.reportsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ব্যবহারকারী ব্যবস্থাপনা' : 'Users'}</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>{t.adminAuditLogs}</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div>
          {/* TAB: PENDING QUEUE */}
          {activeTab === 'pending' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold">
                    {language === 'bn' ? 'মডারেশন চেকলিস্ট:' : 'Moderator Verification Checklist:'}
                  </h4>
                  <p>
                    {language === 'bn'
                      ? '১. ছবিতে কোনো NID বা পাসপোর্টের সম্পূর্ণ নম্বর দৃশ্যমান কিনা পরীক্ষা করুন। ২. বিবরণীতে ফোন নম্বর থাকলে তা গোপন করার ব্যবস্থা নিন। ৩. বাণিজ্যিক বিজ্ঞাপন বা স্প্যাম থাকলে প্রত্যাখ্যান করুন।'
                      : '1. Check images for unredacted NID / passport / bank card numbers. 2. Verify no private phone leaks in text. 3. Reject commercial spam or vague reports.'}
                  </p>
                </div>
              </div>

              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase ${
                              post.post_type === 'LOST'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {post.post_type}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {post.category}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            {post.division}, {post.district}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(post.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{post.title}</h3>
                        <p className="text-sm text-slate-700 leading-relaxed mt-2 whitespace-pre-line">
                          {post.description}
                        </p>
                      </div>

                      {/* Attached images check */}
                      {post.images && post.images.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                            {language === 'bn' ? 'সংযুক্ত ছবি (যাচাই করুন):' : 'Attached Photo for Inspection:'}
                          </span>
                          <div className="max-w-xs rounded-lg overflow-hidden border border-slate-300 bg-slate-50">
                            <img
                              src={post.images[0].storage_path}
                              alt="Verification preview"
                              className="w-full h-44 object-contain"
                            />
                          </div>
                        </div>
                      )}

                      {/* Author and Private Contact info (Visible to Admin) */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                        <p>
                          <span className="font-bold text-slate-700">Author:</span> {post.author_name} ({post.user_id})
                        </p>
                        <p>
                          <span className="font-bold text-slate-700">Internal Contact:</span> {post.private_contact_info} ({post.preferred_contact_method})
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button
                          onClick={() => setRejectModalItem(post)}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>{t.adminActionReject}</span>
                        </button>
                        <button
                          onClick={() => handleModeratePost(post.id, 'APPROVE')}
                          className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>{t.adminActionApprove}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-base text-slate-800">
                    {language === 'bn' ? 'কোনো অপেক্ষমাণ বিজ্ঞপ্তি নেই' : 'Queue Empty'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'bn' ? 'সকল বিজ্ঞপ্তি যথারীতি পর্যালোচনা করা হয়েছে।' : 'All pending items have been reviewed.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: ALL POSTS */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Title</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Author</th>
                      <th className="p-3.5">District</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {posts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-bold text-slate-900 max-w-xs truncate">
                          {p.title}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-sm font-bold text-3xs uppercase ${
                              p.post_type === 'LOST'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.post_type}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">{p.author_name}</td>
                        <td className="p-3.5 text-slate-600">{p.district}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-sm font-bold text-3xs ${
                              p.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'RESOLVED'
                                ? 'bg-indigo-100 text-indigo-800'
                                : p.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => onNavigate('item', { id: p.id })}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-2xs"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CLAIMS REVIEW */}
          {activeTab === 'claims' && (
            <div className="space-y-4">
              {claims.length > 0 ? (
                <div className="space-y-3">
                  {claims.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-800 text-sm">
                          Item: {c.post_title}
                        </span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold text-3xs">
                          {c.status}
                        </span>
                      </div>
                      <p>
                        <span className="font-bold text-slate-600">Claimant:</span> {c.claimant_name} ({c.contact_info})
                      </p>
                      <div className="p-2.5 bg-slate-50 rounded-lg text-slate-800 font-medium border border-slate-200">
                        <span className="text-3xs uppercase font-bold text-slate-400 block mb-0.5">
                          Secret Proof Provided:
                        </span>
                        {c.private_verification_details}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-xs text-slate-500">
                  No claims submitted yet.
                </div>
              )}
            </div>
          )}

          {/* TAB: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <Flag className="w-4 h-4 text-rose-600" />
                          <span className="font-bold text-rose-800">{rep.reason}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-700 font-semibold">{rep.post_title}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-sm font-bold text-3xs ${
                            rep.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>

                      <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        {rep.description || 'No description provided.'}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-400">Reporter: {rep.reporter_email}</span>
                        {rep.status === 'PENDING' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleResolveReport(rep.id, 'RESOLVED')}
                              className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-md text-2xs hover:bg-emerald-700"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => handleResolveReport(rep.id, 'DISMISSED')}
                              className="px-3 py-1 bg-slate-200 text-slate-700 font-bold rounded-md text-2xs hover:bg-slate-300"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-xs text-slate-500">
                  No flagged reports.
                </div>
              )}
            </div>
          )}

          {/* TAB: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">{u.display_name}</td>
                      <td className="p-3.5 text-slate-600">{u.email}</td>
                      <td className="p-3.5 font-bold text-3xs uppercase">
                        <span className={u.role === 'ADMIN' ? 'text-purple-700' : 'text-slate-600'}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-sm font-bold text-3xs ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-2.5 py-1 rounded-md text-2xs font-bold transition-colors ${
                              u.status === 'ACTIVE'
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-400 text-3xs">
                    <span>{log.moderator_name}</span>
                    <span>{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <p className="font-bold text-slate-800">
                    <span className="text-emerald-700 uppercase tracking-wide mr-2">
                      [{log.action}]
                    </span>
                    Target: {log.target_type} ({log.target_id})
                  </p>
                  <p className="text-slate-600 italic">Reason: {log.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
              <XCircle className="w-5 h-5" />
              <span>বিজ্ঞপ্তি প্রত্যাখ্যানের কারণ</span>
            </div>
            <p className="text-xs text-slate-600">
              {rejectModalItem.title}
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                কারণ নির্বাচন বা লিখুন:
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="সংবেদনশীল ডকুমেন্টের নম্বর (NID/পাসপোর্ট) সম্পূর্ণ দৃশ্যমান।">
                  সংবেদনশীল ডকুমেন্টের নম্বর (NID/পাসপোর্ট) সম্পূর্ণ দৃশ্যমান
                </option>
                <option value="ছবিতে ব্যাংক কার্ড বা আর্থিক তথ্যের গোপনীয় নম্বর রয়েছে।">
                  ছবিতে ব্যাংক কার্ড বা আর্থিক তথ্যের গোপনীয় নম্বর রয়েছে
                </option>
                <option value="বিবরণ পর্যাপ্ত নয় বা অস্পষ্ট।">
                  বিবরণ পর্যাপ্ত নয় বা অস্পষ্ট
                </option>
                <option value="বাণিজ্যিক বিজ্ঞাপন বা স্প্যাম।">
                  বাণিজ্যিক বিজ্ঞাপন বা স্প্যাম
                </option>
                <option value="অন্যান্য নিয়ম লঙ্ঘন।">
                  অন্যান্য নিয়ম লঙ্ঘন
                </option>
              </select>

              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 mt-2"
                placeholder="প্রয়োজনে কারণ কাস্টমাইজ করুন..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => handleModeratePost(rejectModalItem.id, 'REJECT', rejectReason)}
                className="py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                প্রত্যাখ্যান সম্পন্ন করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
