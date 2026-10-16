import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Send, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { apiFetch } from '../lib/apiClient.ts';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  onSuccess: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  postId,
  postTitle,
  onSuccess,
}) => {
  const { token, user } = useAuth();
  const { language, t } = useLanguage();

  const [verificationDetails, setVerificationDetails] = useState('');
  const [contactMethod, setContactMethod] = useState<'IN_APP' | 'EMAIL' | 'PHONE'>('IN_APP');
  const [contactInfo, setContactInfo] = useState(user?.email || '');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError(
        language === 'bn'
          ? 'অনুগ্রহ করে নিরাপদ যোগাযোগ সম্মতিতে টিক দিন।'
          : 'Please accept the consent terms to proceed.'
      );
      return;
    }

    if (verificationDetails.trim().length < 10) {
      setError(
        language === 'bn'
          ? 'গোপন শনাক্তকরণ বিবরণ অন্তত ১০ অক্ষরের হতে হবে।'
          : 'Verification details must be at least 10 characters long.'
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await apiFetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: postId,
          private_verification_details: verificationDetails,
          contact_method: contactMethod,
          contact_info: contactInfo,
        }),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error submitting claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              {language === 'bn' ? 'গোপন ও সুরক্ষিত মালিকানা দাবি' : 'Encrypted Ownership Claim'}
            </span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white leading-snug">
            {t.submitClaimTitle}
          </h2>
          <p className="text-xs text-slate-300 mt-1 line-clamp-1">{postTitle}</p>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Privacy Reassurance Callout */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-emerald-950 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{language === 'bn' ? 'গোপনীয়তার নিশ্চয়তা' : 'Privacy Guarantee'}</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              {t.verificationDetailsHelp}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                {t.verificationDetailsLabel} <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={verificationDetails}
                onChange={(e) => setVerificationDetails(e.target.value)}
                placeholder={t.verificationDetailsPlaceholder}
                className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              />
              <p className="text-2xs text-slate-500 mt-1">
                {language === 'bn'
                  ? 'টিপস: এমন তথ্য দিন যা শুধু আপনিই জানেন (যেমন: কোনো নির্দিষ্ট চিহ্ন, কভারের রঙ, ভেতরের কোনো বিশেষ কাগজ)।'
                  : 'Tip: State unique proof only the real owner knows (e.g. inner compartment items, private scratches).'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  {t.contactMethodLabel}
                </label>
                <select
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value as any)}
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-white"
                >
                  <option value="IN_APP">{t.contactMethodInApp}</option>
                  <option value="EMAIL">{t.contactMethodEmail}</option>
                  <option value="PHONE">{t.contactMethodPhone}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  {t.contactValueLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="name@email.com or 017xxxxxxxx"
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="leading-snug">{t.contactConsent}</span>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.submitClaimBtn}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
