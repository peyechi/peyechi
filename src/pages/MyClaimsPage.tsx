import React, { useState, useEffect } from 'react';
import {
  FileQuestion,
  Clock,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { apiFetch } from '../lib/apiClient.ts';

interface MyClaimsPageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenAuth: () => void;
}

export const MyClaimsPage: React.FC<MyClaimsPageProps> = ({ onNavigate, onOpenAuth }) => {
  const { user, token } = useAuth();
  const { language, t } = useLanguage();

  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch('/api/my-claims', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setClaims(data.claims || []);
      })
      .catch((e) => console.error('Failed to load my claims:', e))
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <FileQuestion className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">
          {language === 'bn' ? 'সাইন ইন প্রয়োজন' : 'Sign In Required'}
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'আপনার দাখিলকৃত দাবিসমূহ পর্যবেক্ষণ করতে অ্যাকাউন্টে প্রবেশ করুন।'
            : 'Please sign in to track your ownership claims.'}
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.navMyClaims}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'bn'
            ? 'প্রাপ্ত জিনিসসমূহের বিপরীতে আপনার দাখিলকৃত ব্যক্তিগত মালিকানা দাবিসমূহ'
            : 'Private ownership claims filed against reported found items'}
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : claims.length > 0 ? (
        <div className="space-y-4">
          {claims.map((claim) => {
            const isApproved = claim.status === 'APPROVED';
            const isPending = claim.status === 'PENDING' || claim.status === 'UNDER_REVIEW';
            const isRejected = claim.status === 'REJECTED';

            return (
              <div
                key={claim.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-sm text-slate-900 line-clamp-1">
                      {claim.post_title}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : isRejected
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {isPending && <Clock className="w-3 h-3 text-amber-700" />}
                    {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                    {isRejected && <XCircle className="w-3 h-3 text-rose-700" />}
                    <span>{claim.status}</span>
                  </span>
                </div>

                {/* Secret verification answer proof */}
                <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1">
                  <span className="text-3xs uppercase font-bold text-slate-400 block">
                    {language === 'bn'
                      ? 'আপনার দেওয়া গোপন শনাক্তকারী বিবরণ (অন্য কারো কাছে প্রকাশ করা হয় না):'
                      : 'Your secret verification proof (never publicly visible):'}
                  </span>
                  <p className="text-slate-800 font-medium">{claim.private_verification_details}</p>
                </div>

                {/* Approved state: Finder response / safe handover instructions */}
                {isApproved && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 text-xs text-emerald-950 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>
                        {language === 'bn'
                          ? 'দাবি সফলভাবে অনুমোদিত হয়েছে!'
                          : 'Claim Approved by Finder!'}
                      </span>
                    </div>
                    <p className="text-emerald-800 leading-relaxed">
                      {language === 'bn'
                        ? 'আপনার দেওয়া গোপন বিবরণ যাচাই করে প্রাপক আপনার দাবি মেনে নিয়েছেন। জিনিসটি হস্তান্তরের জন্য কোনো সুরক্ষিত জনসমাগম স্থানে দেখা করার পরামর্শ দেওয়া হলো।'
                        : 'The finder has verified your proof. Meet in a secure public place for handover.'}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>
                    {language === 'bn' ? 'জমা দেওয়ার তারিখ: ' : 'Filed: '}
                    {new Date(claim.created_at).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => onNavigate('item', { id: claim.post_id })}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>{language === 'bn' ? 'বিজ্ঞপ্তি দেখুন' : 'View Item'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <FileQuestion className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">
            {language === 'bn' ? 'কোনো দাবি দাখিল করা হয়নি' : 'No Ownership Claims Filed'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'bn'
              ? 'আপনি যদি কোনো প্রাপ্ত বিজ্ঞপ্তিতে আপনার হারানো জিনিস শনাক্ত করেন, তবে "দাবি পেশ করুন" বোতাম ব্যবহার করে গোপন প্রমাণের মাধ্যমে দাবি জমা দিতে পারেন।'
              : 'When you find a matching report, file a private claim with secret verification details.'}
          </p>
          <button
            onClick={() => onNavigate('explore')}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs mt-2"
          >
            {t.navExplore}
          </button>
        </div>
      )}
    </div>
  );
};
