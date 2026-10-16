import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  UserX,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface MyPostsPageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenAuth: () => void;
}

export const MyPostsPage: React.FC<MyPostsPageProps> = ({ onNavigate, onOpenAuth }) => {
  const { user, token, deleteAccount } = useAuth();
  const { language, t } = useLanguage();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchMyPosts = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/my-posts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
      })
      .catch((e) => console.error('Error fetching my posts:', e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) {
      fetchMyPosts();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleDeletePost = async (postId: string) => {
    if (!confirm(language === 'bn' ? 'বিজ্ঞপ্তিটি মুছে ফেলতে চান?' : 'Delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolvePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: 'Resolved by author' }),
      });
      if (res.ok) {
        fetchMyPosts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMyAccount = async () => {
    setDeleting(true);
    try {
      const res = await deleteAccount();
      if (res.success) {
        onNavigate('home');
      } else {
        alert(res.error || 'Failed to delete account');
      }
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <FileText className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">
          {language === 'bn' ? 'সাইন ইন প্রয়োজন' : 'Sign In Required'}
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'আপনার বিজ্ঞপ্তিগুলো দেখতে অনুগ্রহ করে অ্যাকাউন্টে প্রবেশ করুন।'
            : 'Please sign in to view and manage your reports.'}
        </p>
        <button
          onClick={onOpenAuth}
          className="px-5 py-2.5 bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs"
        >
          {t.navLogin}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.navMyPosts}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'আপনার দাখিলকৃত বিজ্ঞপ্তিসমূহ এবং সেগুলোর মডারেশন অবস্থা'
              : 'Your reported lost and found items and moderation status'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('report-lost')}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.reportLostBtn}</span>
          </button>
          <button
            onClick={() => onNavigate('report-found')}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.reportFoundBtn}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => {
            const isApproved = post.status === 'APPROVED';
            const isPending = post.status === 'PENDING';
            const isRejected = post.status === 'REJECTED';
            const isResolved = post.status === 'RESOLVED';

            return (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                        post.post_type === 'LOST'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {post.post_type}
                    </span>

                    {/* Status Pill */}
                    {isPending && (
                      <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>{language === 'bn' ? 'পর্যালোচনায় অপেক্ষমাণ (Pending)' : 'Under Moderation'}</span>
                      </span>
                    )}
                    {isApproved && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{language === 'bn' ? 'অনুমোদিত ও প্রকাশিত' : 'Approved & Live'}</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>{language === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected'}</span>
                      </span>
                    )}
                    {isResolved && (
                      <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                        <span>{language === 'bn' ? 'নিষ্পত্তিকৃত (Resolved)' : 'Resolved'}</span>
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3
                    onClick={() => isApproved || isResolved ? onNavigate('item', { id: post.id }) : null}
                    className={`font-bold text-base text-slate-900 ${
                      isApproved || isResolved ? 'cursor-pointer hover:text-emerald-700' : ''
                    }`}
                  >
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {post.description}
                  </p>
                </div>

                {/* If rejected, show reason given by moderator */}
                {isRejected && post.rejection_reason && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 space-y-1">
                    <span className="font-bold block">
                      {language === 'bn' ? 'মডারেটরের কারণ:' : 'Moderator Rejection Reason:'}
                    </span>
                    <p>{post.rejection_reason}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs gap-3">
                  <div className="flex items-center gap-3 text-slate-500">
                    <span>
                      {post.division}, {post.district}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.views_count || 0} {language === 'bn' ? 'ভিউ' : 'views'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(isApproved || isResolved) && (
                      <button
                        onClick={() => onNavigate('item', { id: post.id })}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Page'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {isApproved && (
                      <button
                        onClick={() => handleResolvePost(post.id)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold transition-colors"
                      >
                        {language === 'bn' ? 'ফেরত সম্পন্ন ঘোষণা করুন' : 'Mark Resolved'}
                      </button>
                    )}

                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">
            {language === 'bn' ? 'কোনো বিজ্ঞপ্তি পাওয়া যায়নি' : 'No Reports Submitted Yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'bn'
              ? 'আপনার কোনো হারানো জিনিস খুঁজতে অথবা কোনো পাওয়া জিনিস জমা দিতে ওপরের বোতাম ব্যবহার করুন।'
              : 'Submit a lost or found item report to begin tracking.'}
          </p>
        </div>
      )}

      {/* Account Privacy & Deletion Section (Section 5 Security Requirement) */}
      <div className="pt-8 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'bn' ? 'ব্যক্তিগত তথ্য ও অ্যাকাউন্ট মুছে ফেলা' : 'Account & Personal Data Removal'}
            </h4>
            <p className="text-2xs text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'গোপনীয়তা সুরক্ষা আইনের অধীনে আপনার অ্যাকাউন্ট ও সংশ্লিষ্ট ক্রেডেনশিয়াল স্থায়ীভাবে মুছে ফেলুন।'
                : 'Permanently remove your account profile and credentials under privacy rights.'}
            </p>
          </div>
          <button
            onClick={() => setShowDeleteAccountModal(true)}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <UserX className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অ্যাকাউন্ট ডিলিট' : 'Delete Account'}</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">
                {language === 'bn' ? 'অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলতে চান?' : 'Permanently Delete Account?'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'bn'
                  ? 'আপনার প্রোফাইল, সেশন ও ব্যক্তিগত যোগাযোগের রেকর্ড স্থায়ীভাবে মুছে যাবে। এই পদক্ষেপটি পরিবর্তনযোগ্য নয়।'
                  : 'This action is irreversible. Your profile, active sessions, and personal contact info will be permanently purged.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteAccountModal(false)}
                className="py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteMyAccount}
                className="py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : language === 'bn' ? 'মুছে ফেলুন' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
