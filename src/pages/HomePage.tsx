import React, { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  FileCheck2,
  Users,
  Compass,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { CATEGORIES, DISTRICTS } from '../data/bangladeshData.ts';
import { ItemCard, ItemCardData } from '../components/ItemCard.tsx';
import { AntiScamNotice } from '../components/AntiScamNotice.tsx';
import { CategoryIcon } from '../components/CategoryIcon.tsx';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  const [keyword, setKeyword] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    resolved: 0,
    active: 0,
  });
  const [recentPosts, setRecentPosts] = useState<ItemCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real statistics
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch((err) => console.error('Failed to load stats:', err));

    // Fetch recently approved posts
    fetch('/api/posts?limit=6')
      .then((res) => res.json())
      .then((data) => {
        setRecentPosts(data.posts || []);
      })
      .catch((err) => console.error('Failed to load posts:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('explore', { keyword: keyword.trim() });
  };

  const handleCategoryClick = (categoryId: string) => {
    onNavigate('explore', { category: categoryId });
  };

  const handleDistrictClick = (districtId: string) => {
    onNavigate('explore', { district: districtId });
  };

  const popularDistricts = [
    { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka' },
    { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram' },
    { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet' },
    { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi' },
    { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna' },
    { id: 'gazipur', nameBn: 'গাজীপুর', nameEn: 'Gazipur' },
    { id: 'cumilla', nameBn: 'কুমিল্লা', nameEn: 'Cumilla' },
    { id: 'bogura', nameBn: 'বগুড়া', nameEn: 'Bogura' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>
              {language === 'bn'
                ? 'বাংলাদেশের নির্ভরযোগ্য ডিজিটাল হারানো ও প্রাপ্তি রেজিস্ট্রি'
                : 'Bangladesh’s Trusted Citizen Lost & Found Network'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.siteTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.taglineSubtitle}
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 border border-slate-200"
          >
            <div className="flex-1 flex items-center px-3 gap-2">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{t.searchButton}</span>
            </button>
          </form>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('report-lost')}
              className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer group"
            >
              <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>{t.reportLostBtn}</span>
            </button>

            <button
              onClick={() => onNavigate('report-found')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer group"
            >
              <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>{t.reportFoundBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 -mt-10 relative z-20">
        {/* Anti-Scam Notice */}
        <AntiScamNotice />

        {/* Real Database Statistics Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-500 font-medium">{t.statTotal}</p>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-emerald-700">{stats.approved}</p>
            <p className="text-xs text-slate-500 font-medium">{t.statApproved}</p>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-indigo-700">{stats.resolved}</p>
            <p className="text-xs text-slate-500 font-medium">{t.statResolved}</p>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <Compass className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-amber-700">{stats.active}</p>
            <p className="text-xs text-slate-500 font-medium">{t.statActive}</p>
          </div>
        </div>

        {/* Popular Categories Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t.quickCategories}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'দ্রুত অনুসন্ধানের জন্য ক্যাটাগরি বেছে নিন'
                  : 'Select a category to browse listings directly'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="text-emerald-700 hover:text-emerald-800 text-xs font-bold flex items-center gap-1"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 flex items-center justify-center mb-2.5 transition-colors">
                  <CategoryIcon category={cat.id} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </h3>
                  <p className="text-3xs text-slate-500 line-clamp-1 mt-0.5">
                    {language === 'bn' ? cat.examplesBn : cat.examplesEn}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recently Approved Listings Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t.recentPosts}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'যাচাই ও অনুমোদনের পর সর্বজনীন প্রকাশিত সাম্প্রতিক আইটেম'
                  : 'Verified and approved items recently published by citizens'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="text-emerald-700 hover:text-emerald-800 text-xs font-bold flex items-center gap-1"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {recentPosts.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={(id) => onNavigate('item', { id })}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <p className="text-slate-500 text-sm">{t.noResults}</p>
            </div>
          )}
        </div>

        {/* District Search Shortcuts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {language === 'bn' ? 'জেলা ভিত্তিক অনুসন্ধান' : 'District-Based Search'}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'আপনার এলাকার হারানো বা পাওয়া জিনিসগুলো দ্রুত দেখতে সংশ্লিষ্ট জেলা নির্বাচন করুন:'
              : 'Select your district to quickly view listings reported near your area:'}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {popularDistricts.map((d) => (
              <button
                key={d.id}
                onClick={() => handleDistrictClick(d.id)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                {language === 'bn' ? d.nameBn : d.nameEn}
              </button>
            ))}
            <button
              onClick={() => onNavigate('explore')}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'সকল ৬৪ জেলা দেখুন →' : 'All 64 Districts →'}
            </button>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
              {language === 'bn' ? 'সহজ ও সুরক্ষিত পদ্ধতি' : 'Transparent & Secure Process'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              {t.howItWorksTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-black text-sm">
                ১
              </div>
              <h3 className="font-bold text-base text-white">{t.step1Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.step1Desc}</p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-black text-sm">
                ২
              </div>
              <h3 className="font-bold text-base text-white">{t.step2Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.step2Desc}</p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-black text-sm">
                ৩
              </div>
              <h3 className="font-bold text-base text-white">{t.step3Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
