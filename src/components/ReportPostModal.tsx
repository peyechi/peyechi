import React, { useState } from 'react';
import { X, AlertOctagon, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface ReportPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
}

export const ReportPostModal: React.FC<ReportPostModalProps> = ({
  isOpen,
  onClose,
  postId,
  postTitle,
}) => {
  const { token } = useAuth();
  const { language } = useLanguage();

  const [reason, setReason] = useState('SCAM_OR_FRAUD');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          post_id: postId,
          reason,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error reporting post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        <div className="p-5 bg-rose-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-rose-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <AlertOctagon className="w-5 h-5 text-rose-300" />
            <h3 className="font-bold text-base">
              {language === 'bn' ? 'বিজ্ঞপ্তিটি রিপোর্ট করুন' : 'Report Suspicious Post'}
            </h3>
          </div>
          <p className="text-xs text-rose-200 line-clamp-1">{postTitle}</p>
        </div>

        <div className="p-6">
          {success ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-800 text-base">
                {language === 'bn' ? 'রিপোর্ট গৃহীত হয়েছে' : 'Report Submitted'}
              </h4>
              <p className="text-xs text-slate-600">
                {language === 'bn'
                  ? 'আমাদের মডারেশন টিম দ্রুত পোস্টটি পর্যালোচনা করবে।'
                  : 'Our moderation team will review this listing shortly.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {language === 'bn' ? 'রিপোর্টের কারণ' : 'Reason for Reporting'}
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  <option value="SCAM_OR_FRAUD">
                    {language === 'bn' ? 'প্রতারণা / জালিয়াতির সন্দেহ (Scam / Fraud)' : 'Scam or Fraudulent Intent'}
                  </option>
                  <option value="EXPOSED_PII">
                    {language === 'bn' ? 'সংবেদনশীল NID বা ব্যক্তিগত তথ্য প্রকাশ (Exposed PII)' : 'Exposed NID or Private Info'}
                  </option>
                  <option value="FAKE_ITEM">
                    {language === 'bn' ? 'ভুয়া বা বানানো তথ্য (Fake Information)' : 'Fake or Fabricated Report'}
                  </option>
                  <option value="DUPLICATE">
                    {language === 'bn' ? 'একই পোস্টের পুনরাবৃত্তি (Duplicate Post)' : 'Duplicate Listing'}
                  </option>
                  <option value="INAPPROPRIATE">
                    {language === 'bn' ? 'অশোভন বা ক্ষতিকর বিষয়বস্তু (Inappropriate Content)' : 'Inappropriate Content'}
                  </option>
                  <option value="OTHER">
                    {language === 'bn' ? 'অন্যান্য বিষয় (Other)' : 'Other Reason'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {language === 'bn' ? 'সুনির্দিষ্ট বিবরণ (ঐচ্ছিক)' : 'Specific Details (Optional)'}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'মডারেটরের সুবিধার জন্য বিস্তারিত লিখুন...'
                      : 'Provide any helpful context for the moderator...'
                  }
                  className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-lg shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{language === 'bn' ? 'রিপোর্ট পাঠান' : 'Submit Report'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
