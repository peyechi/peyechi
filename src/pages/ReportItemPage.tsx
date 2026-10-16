import React, { useState } from 'react';
import {
  ShieldAlert,
  Upload,
  X,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { CATEGORIES, DIVISIONS, DISTRICTS } from '../data/bangladeshData.ts';
import { apiFetch } from '../lib/apiClient.ts';

interface ReportItemPageProps {
  defaultType?: 'LOST' | 'FOUND';
  onNavigate: (page: string, params?: any) => void;
  onOpenAuth: () => void;
}

export const ReportItemPage: React.FC<ReportItemPageProps> = ({
  defaultType = 'LOST',
  onNavigate,
  onOpenAuth,
}) => {
  const { user, token } = useAuth();
  const { language, t } = useLanguage();

  const [postType, setPostType] = useState<'LOST' | 'FOUND'>(defaultType);
  const [category, setCategory] = useState<string>('DOCUMENTS');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [division, setDivision] = useState<string>('dhaka');
  const [district, setDistrict] = useState<string>('dhaka');
  const [upazilaThana, setUpazilaThana] = useState('');
  const [generalLocation, setGeneralLocation] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [contactMethod, setContactMethod] = useState<'IN_APP' | 'EMAIL' | 'PHONE'>('IN_APP');
  const [privateContactInfo, setPrivateContactInfo] = useState(user?.email || '');
  const [consent, setConsent] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedPostId, setSubmittedPostId] = useState<string | null>(null);

  // Available districts for chosen division
  const availableDistricts = DISTRICTS.filter(
    (d) => d.divisionId === division.toLowerCase()
  );

  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const validDistricts = DISTRICTS.filter((d) => d.divisionId === newDiv);
    if (validDistricts.length > 0) {
      setDistrict(validDistricts[0].id);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(
        language === 'bn'
          ? 'শুধুমাত্র JPG, PNG বা WEBP ফরম্যাটের ছবি আপলোড করা যাবে।'
          : 'Only JPG, PNG or WEBP image formats are supported.'
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        language === 'bn'
          ? 'ছবির আকার সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে।'
          : 'Image size cannot exceed 5MB.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onOpenAuth();
      return;
    }

    if (!consent) {
      setError(
        language === 'bn'
          ? 'অনুগ্রহ করে প্ল্যাটফর্মের নীতিমালায় সম্মতি দিন।'
          : 'Please check the consent box to continue.'
      );
      return;
    }

    if (title.trim().length < 5) {
      setError(
        language === 'bn'
          ? 'শিরোনাম অন্তত ৫ অক্ষরের হতে হবে।'
          : 'Title must be at least 5 characters.'
      );
      return;
    }

    if (description.trim().length < 15) {
      setError(
        language === 'bn'
          ? 'বিবরণ অন্তত ১৫ অক্ষরের হতে হবে।'
          : 'Description must be at least 15 characters.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        post_type: postType,
        category,
        title: title.trim(),
        description: description.trim(),
        division,
        district,
        upazila_thana: upazilaThana.trim() || undefined,
        general_location: generalLocation.trim(),
        event_date: eventDate,
        preferred_contact_method: contactMethod,
        private_contact_info: privateContactInfo.trim(),
        images: imagePreview ? [{ storage_path: imagePreview }] : [],
      };

      const data = await apiFetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      setSubmittedPostId(data.post.id);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submittedPostId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <FileCheck2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {language === 'bn' ? 'বিজ্ঞপ্তিটি জমা নেওয়া হয়েছে!' : 'Listing Submitted Successfully!'}
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            {t.postSuccessNotice}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 max-w-md mx-auto text-left space-y-1">
          <p className="font-bold">
            {language === 'bn' ? '🔒 মডারেশন পলিসি:' : '🔒 Moderation Policy:'}
          </p>
          <p>
            {language === 'bn'
              ? 'নাগরিকদের সুরক্ষা ও জালিয়াতি রোধে মডারেটর যাচাই করার পর এটি প্রকাশ্যে প্রদর্শিত হবে। আপনি "আমার বিজ্ঞপ্তি" অপশনে এর অবস্থা পর্যবেক্ষণ করতে পারেন।'
              : 'To safeguard citizen privacy and prevent fraudulent reports, our moderators will review the post before public publication.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('my-posts')}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
          >
            {t.navMyPosts}
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-colors"
          >
            {t.navExplore}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
          <span>{language === 'bn' ? 'নাগরিক সেবা ফর্ম' : 'Citizen Reporting Form'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {postType === 'LOST' ? t.createPostTitleLost : t.createPostTitleFound}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {language === 'bn'
            ? 'সঠিক তথ্য দিয়ে বিবরণ পূরণ করুন। কোনো সংবেদনশীল ডকুমেন্ট নম্বর প্রকাশ করবেন না।'
            : 'Fill in genuine details. Never disclose sensitive full document numbers publicly.'}
        </p>
      </div>

      {/* Post Type Selector (LOST vs FOUND) */}
      <div className="bg-slate-100 p-1.5 rounded-xl grid grid-cols-2 gap-2 border border-slate-200">
        <button
          type="button"
          onClick={() => setPostType('LOST')}
          className={`py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            postType === 'LOST'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
        >
          <span>{language === 'bn' ? 'হারানো জিনিস (LOST)' : 'Lost Item (LOST)'}</span>
        </button>
        <button
          type="button"
          onClick={() => setPostType('FOUND')}
          className={`py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            postType === 'FOUND'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
        >
          <span>{language === 'bn' ? 'প্রাপ্ত জিনিস (FOUND)' : 'Found Item (FOUND)'}</span>
        </button>
      </div>

      {!user && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-700" />
            <span>
              {language === 'bn'
                ? 'বিজ্ঞপ্তি সাবমিট করার জন্য সাইন ইন থাকা আবশ্যক।'
                : 'You need to be signed in to submit a listing.'}
            </span>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 bg-amber-700 text-white rounded-lg font-bold hover:bg-amber-800 transition-colors shrink-0"
          >
            {t.navLogin}
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Category & Title */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              {t.postCategoryLabel} <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'bn' ? c.nameBn : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              {t.postTitleLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.postTitlePlaceholder}
              className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Location Cascade: Division -> District -> Upazila/Thana */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {language === 'bn' ? 'স্থানের বিবরণ' : 'Location Details'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                {t.postDivisionLabel} <span className="text-rose-500">*</span>
              </label>
              <select
                value={division}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {DIVISIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {language === 'bn' ? d.nameBn : d.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                {t.postDistrictLabel} <span className="text-rose-500">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {availableDistricts.map((dst) => (
                  <option key={dst.id} value={dst.id}>
                    {language === 'bn' ? dst.nameBn : dst.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                {t.postUpazilaLabel}
              </label>
              <input
                type="text"
                value={upazilaThana}
                onChange={(e) => setUpazilaThana(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: ধানমন্ডি, গুলশান, বা সদর' : 'e.g. Dhanmondi, Gulshan'}
                className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                {t.postDateLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              {t.postLocationLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={generalLocation}
              onChange={(e) => setGeneralLocation(e.target.value)}
              placeholder={t.postLocationPlaceholder}
              className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
            {t.postDescLabel} <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.postDescPlaceholder}
            className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Image Upload with Strict Warning */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            {t.imageUploadLabel}
          </label>

          {/* Mandated Warning Box */}
          <div className="p-3.5 bg-rose-50 border-l-4 border-rose-600 rounded-r-lg text-rose-950 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-800">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{language === 'bn' ? 'ছবি সংক্রান্ত সতর্কতা' : 'Document Image Security Notice'}</span>
            </div>
            <p className="leading-relaxed">
              {t.imageUploadWarning}
            </p>
          </div>

          {/* Upload input or preview */}
          {imagePreview ? (
            <div className="relative w-full max-w-sm h-48 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 group">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full shadow-md hover:bg-rose-700 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-700">
                {language === 'bn' ? 'ছবি আপলোড করতে ক্লিক করুন' : 'Click to upload photograph'}
              </span>
              <span className="text-3xs text-slate-400 mt-0.5">
                PNG, JPG, WEBP (Max 5MB)
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Preferred Contact & Privacy Protection */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {language === 'bn' ? 'যোগাযোগ ও গোপনীয়তা' : 'Private Contact Details'}
            </h3>
            <span className="text-3xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm font-semibold">
              {language === 'bn' ? 'সর্বসাধারণের জন্য গোপন থাকবে' : 'Kept Private'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                {t.contactPrefLabel}
              </label>
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value as any)}
                className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="IN_APP">{t.contactMethodInApp}</option>
                <option value="EMAIL">{t.contactMethodEmail}</option>
                <option value="PHONE">{t.contactMethodPhone}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                {t.contactValueLabel}
              </label>
              <input
                type="text"
                value={privateContactInfo}
                onChange={(e) => setPrivateContactInfo(e.target.value)}
                placeholder="name@email.com or 017xxxxxxxx"
                className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Consent and Submit */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="leading-snug">{t.termsConsent}</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FileCheck2 className="w-5 h-5" />
                <span>{t.submitPostBtn}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
