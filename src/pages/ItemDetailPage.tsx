import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Eye,
  ShieldAlert,
  Share2,
  AlertOctagon,
  CheckCircle2,
  ArrowLeft,
  Lock,
  UserCheck,
  Send,
  MessageSquare,
  Check,
  XCircle,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { CATEGORIES, DISTRICTS, DIVISIONS } from '../data/bangladeshData.ts';
import { CategoryIcon } from '../components/CategoryIcon.tsx';
import { AntiScamNotice } from '../components/AntiScamNotice.tsx';
import { ClaimModal } from '../components/ClaimModal.tsx';
import { ReportPostModal } from '../components/ReportPostModal.tsx';
import { apiFetch } from '../lib/apiClient.ts';

interface ItemDetailPageProps {
  id: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenAuth: () => void;
}

export const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ id, onNavigate, onOpenAuth }) => {
  const { user, token } = useAuth();
  const { language, t } = useLanguage();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Claims on this post (only for owner/finder or admin)
  const [claims, setClaims] = useState<any[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);

  // Modals
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchPostDetails = () => {
    setLoading(true);
    apiFetch(`/api/posts/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((data) => {
        setPost(data.post);
      })
      .catch((err) => {
        setError(err.message || 'Error fetching post details.');
      })
      .finally(() => setLoading(false));
  };

  const fetchClaimsForOwner = () => {
    if (!token || !id) return;
    setClaimsLoading(true);
    apiFetch(`/api/posts/${id}/claims`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setClaims(data.claims || []);
      })
      .catch((e) => console.error('Error fetching claims:', e))
      .finally(() => setClaimsLoading(false));
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id, token]);

  const isOwner = user && post && user.id === post.user_id;
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

  useEffect(() => {
    if (post && (isOwner || isAdmin) && post.post_type === 'FOUND') {
      fetchClaimsForOwner();
    }
  }, [post, isOwner, isAdmin]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleResolvePost = async () => {
    if (!token) return;
    try {
      await apiFetch(`/api/posts/${id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: 'Marked resolved by finder/owner' }),
      });
      fetchPostDetails();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = async () => {
    if (!token) return;
    if (!confirm(language === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই বিজ্ঞপ্তিটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this listing?')) {
      return;
    }
    try {
      await apiFetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      onNavigate('explore');
    } catch (e) {
      console.error(e);
    }
  };

  const handleClaimStatusUpdate = async (claimId: string, newStatus: string, notes?: string) => {
    if (!token) return;
    try {
      await apiFetch(`/api/claims/${claimId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          finder_notes: notes || `Finder marked claim as ${newStatus}`,
        }),
      });
      fetchClaimsForOwner();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          {language === 'bn' ? 'বিজ্ঞপ্তিটি পাওয়া যায়নি' : 'Listing Not Found'}
        </h2>
        <p className="text-xs text-slate-500">{error}</p>
        <button
          onClick={() => onNavigate('explore')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          {language === 'bn' ? 'অনুসন্ধান পাতায় ফিরে যান' : 'Back to Explore'}
        </button>
      </div>
    );
  }

  const categoryObj = CATEGORIES.find((c) => c.id === post.category);
  const categoryName = categoryObj
    ? language === 'bn'
      ? categoryObj.nameBn
      : categoryObj.nameEn
    : post.category;

  const districtObj = DISTRICTS.find((d) => d.id === post.district);
  const districtName = districtObj
    ? language === 'bn'
      ? districtObj.nameBn
      : districtObj.nameEn
    : post.district;

  const divisionObj = DIVISIONS.find((div) => div.id === post.division);
  const divisionName = divisionObj
    ? language === 'bn'
      ? divisionObj.nameBn
      : divisionObj.nameEn
    : post.division;

  const isLost = post.post_type === 'LOST';
  const isResolved = post.status === 'RESOLVED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => onNavigate('explore')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'bn' ? 'তালিকায় ফিরে যান' : 'Back to Listings'}</span>
      </button>

      {/* Main Post Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase shadow-2xs ${
                  isLost ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {isLost
                  ? language === 'bn'
                    ? 'হারানো বিজ্ঞপ্তি'
                    : 'LOST ITEM'
                  : language === 'bn'
                  ? 'প্রাপ্ত জিনিস'
                  : 'FOUND ITEM'}
              </span>

              {isResolved && (
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.itemResolvedBadge}</span>
                </span>
              )}

              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
                <CategoryIcon category={post.category} className="w-3.5 h-3.5" />
                <span>{categoryName}</span>
              </span>
            </div>

            {/* Share and Report Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Share Listing"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>
                  {copiedLink
                    ? language === 'bn'
                      ? 'লিংক কপি হয়েছে!'
                      : 'Link Copied!'
                    : language === 'bn'
                    ? 'শেয়ার'
                    : 'Share'}
                </span>
              </button>

              <button
                onClick={() => setReportModalOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Report Post"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'bn' ? 'রিপোর্ট' : 'Report'}</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {post.title}
          </h1>

          {/* Meta Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <div>
              <span className="text-3xs uppercase font-bold text-slate-400 block mb-0.5">
                {t.location}
              </span>
              <div className="flex items-center gap-1 font-semibold text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {post.upazila_thana ? `${post.upazila_thana}, ` : ''}
                  {districtName}
                </span>
              </div>
            </div>

            <div>
              <span className="text-3xs uppercase font-bold text-slate-400 block mb-0.5">
                {t.incidentDate}
              </span>
              <div className="flex items-center gap-1 font-semibold text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{post.event_date}</span>
              </div>
            </div>

            <div>
              <span className="text-3xs uppercase font-bold text-slate-400 block mb-0.5">
                {language === 'bn' ? 'সুনির্দিষ্ট এলাকা' : 'Specific Area'}
              </span>
              <span className="font-semibold text-slate-800 line-clamp-1">
                {post.general_location}
              </span>
            </div>

            <div>
              <span className="text-3xs uppercase font-bold text-slate-400 block mb-0.5">
                {language === 'bn' ? 'ভিউ সংখ্যা' : 'Views'}
              </span>
              <div className="flex items-center gap-1 font-semibold text-slate-800">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.views_count}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Images section */}
        {post.images && post.images.length > 0 && (
          <div className="px-6 sm:px-8 pb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {language === 'bn' ? 'সংযুক্ত ছবি (যাচাইকৃত)' : 'Attached Photos (Reviewed)'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.images.map((img: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-80"
                >
                  <img
                    src={img.storage_path}
                    alt={post.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description body */}
        <div className="p-6 sm:p-8 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.description}
          </h3>
          <p className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {post.description}
          </p>
        </div>

        {/* Anti-Scam Notice on Detail Page */}
        <div className="p-6 sm:p-8 bg-slate-50/70 border-t border-slate-200">
          <AntiScamNotice />
        </div>

        {/* Action Bar for Users */}
        <div className="p-6 sm:p-8 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 space-y-0.5 text-center sm:text-left">
            <p className="font-semibold text-slate-700">
              {t.privacyNoteOnPost}
            </p>
            <p className="text-3xs text-slate-400">
              {language === 'bn'
                ? 'আইটেম রেফারেন্স আইডি: ' + post.id
                : 'Listing ID: ' + post.id}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isLost && !isResolved && (
              <button
                onClick={() => {
                  if (!user) {
                    onOpenAuth();
                  } else {
                    setClaimModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{t.claimThisItem}</span>
              </button>
            )}

            {/* Owner Actions */}
            {(isOwner || isAdmin) && !isResolved && (
              <button
                onClick={handleResolvePost}
                className="w-full sm:w-auto px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'bn' ? 'ফেরত প্রদান সম্পন্ন ঘোষণা করুন' : 'Mark as Reconnected'}</span>
              </button>
            )}

            {(isOwner || isAdmin) && (
              <button
                onClick={handleDeletePost}
                className="p-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-xl transition-colors cursor-pointer"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Private Finder / Moderator Claims Review Section */}
      {(isOwner || isAdmin) && post.post_type === 'FOUND' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                {language === 'bn'
                  ? `মালিকানা দাবিসমূহ (${claims.length}) — একান্ত গোপনীয়`
                  : `Private Ownership Claims (${claims.length})`}
              </h2>
            </div>
            <span className="text-2xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-sm">
              {language === 'bn' ? 'কেবল প্রাপক ও মডারেটরের জন্য দৃশ্যমান' : 'Finder & Moderator Eyes Only'}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'দাবিদারদের দেওয়া গোপন প্রমাণের সাথে আপনার পাওয়া জিনিসের অমিল বা মিল যাচাই করুন। কোনো অবস্থাতেই গোপন বিবরণ সর্বসাধারণের কাছে প্রকাশ করবেন না।'
              : 'Cross-check the claimant’s secret verification details with the physical item. Never disclose verification answers.'}
          </p>

          {claimsLoading ? (
            <div className="py-6 flex justify-center">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : claims.length > 0 ? (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 text-sm">
                        {claim.claimant_name}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {new Date(claim.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span
                      className={`text-2xs font-bold px-2.5 py-0.5 rounded-full ${
                        claim.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : claim.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>

                  {/* Secret Verification Detail */}
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                    <span className="text-3xs uppercase font-bold text-slate-400 block">
                      {language === 'bn' ? 'গোপন শনাক্তকারী বিবরণ (Verification Answer):' : 'Secret Verification Proof:'}
                    </span>
                    <p className="text-xs text-slate-800 font-medium">
                      {claim.private_verification_details}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">
                        {language === 'bn' ? 'যোগাযোগ মাধ্যম: ' : 'Contact Method: '}
                      </span>
                      <span className="font-bold">{claim.contact_method}</span> ({claim.contact_info})
                    </div>

                    {/* Actions on claim */}
                    {claim.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleClaimStatusUpdate(claim.id, 'APPROVED')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'দাবি গ্রহণ করুন' : 'Accept Claim'}</span>
                        </button>
                        <button
                          onClick={() => handleClaimStatusUpdate(claim.id, 'REJECTED')}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'প্রত্যাখ্যান' : 'Reject'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
              {language === 'bn'
                ? 'এখনও এই আইটেমে কোনো মালিকানা দাবি জমা পড়েনি।'
                : 'No claims submitted for this item yet.'}
            </div>
          )}
        </div>
      )}

      {/* Claim Modal */}
      <ClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        postId={post.id}
        postTitle={post.title}
        onSuccess={() => {
          alert(
            language === 'bn'
              ? 'আপনার দাবিটি সফলভাবে জমা হয়েছে। প্রাপক ও মডারেটর এটি যাচাই করবেন।'
              : 'Your claim has been submitted safely for review!'
          );
        }}
      />

      {/* Report Modal */}
      <ReportPostModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        postId={post.id}
        postTitle={post.title}
      />
    </div>
  );
};
