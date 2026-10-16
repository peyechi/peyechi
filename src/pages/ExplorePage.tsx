import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { CATEGORIES, DIVISIONS, DISTRICTS } from '../data/bangladeshData.ts';
import { ItemCard, ItemCardData } from '../components/ItemCard.tsx';
import { apiFetch } from '../lib/apiClient.ts';

interface ExplorePageProps {
  initialFilters?: {
    keyword?: string;
    category?: string;
    division?: string;
    district?: string;
    post_type?: string;
  };
  onNavigate: (page: string, params?: any) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ initialFilters, onNavigate }) => {
  const { language, t } = useLanguage();

  const [postType, setPostType] = useState<string>(initialFilters?.post_type || 'ALL');
  const [category, setCategory] = useState<string>(initialFilters?.category || 'ALL');
  const [division, setDivision] = useState<string>(initialFilters?.division || 'ALL');
  const [district, setDistrict] = useState<string>(initialFilters?.district || 'ALL');
  const [keyword, setKeyword] = useState<string>(initialFilters?.keyword || '');
  const [status, setStatus] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const [posts, setPosts] = useState<ItemCardData[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Available districts filtered by selected division
  const availableDistricts =
    division === 'ALL'
      ? DISTRICTS
      : DISTRICTS.filter((d) => d.divisionId === division.toLowerCase());

  // Handle division change (reset district if no longer valid)
  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    if (newDiv !== 'ALL') {
      const match = DISTRICTS.find((d) => d.divisionId === newDiv && d.id === district);
      if (!match) {
        setDistrict('ALL');
      }
    }
    setPage(1);
  };

  const clearAllFilters = () => {
    setPostType('ALL');
    setCategory('ALL');
    setDivision('ALL');
    setDistrict('ALL');
    setKeyword('');
    setStatus('ALL');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const fetchItems = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (postType !== 'ALL') params.set('post_type', postType);
    if (category !== 'ALL') params.set('category', category);
    if (division !== 'ALL') params.set('division', division);
    if (district !== 'ALL') params.set('district', district);
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (status !== 'ALL') params.set('status', status);
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    params.set('page', page.toString());
    params.set('limit', '12');

    apiFetch(`/api/posts?${params.toString()}`)
      .then((data) => {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);
      })
      .catch((err) => console.error('Error fetching items:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [postType, category, division, district, status, dateFrom, dateTo, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  const hasActiveFilters =
    postType !== 'ALL' ||
    category !== 'ALL' ||
    division !== 'ALL' ||
    district !== 'ALL' ||
    status !== 'ALL' ||
    dateFrom !== '' ||
    dateTo !== '' ||
    keyword !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Title & Top Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.exploreTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? `মোট ${totalItems} টি যাচাইকৃত প্রকাশনা খুঁজে পাওয়া গেছে`
              : `Found ${totalItems} verified citizen listings`}
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="flex-1 py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? 'ফিল্টার নির্বাচন' : 'Filter Options'}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="py-2 px-3 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Filters Sidebar */}
        <div
          className={`${
            showFiltersMobile ? 'block' : 'hidden'
          } md:block md:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? 'অনুসন্ধান ফিল্টার' : 'Refine Search'}</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-2xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.clearFilters}</span>
              </button>
            )}
          </div>

          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {language === 'bn' ? 'কীওয়ার্ড' : 'Keyword'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={language === 'bn' ? 'নাম, বিবরণ বা স্থান...' : 'Name, model, area...'}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </form>

          {/* Type Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.filterType}
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => {
                  setPostType('ALL');
                  setPage(1);
                }}
                className={`py-1.5 text-xs rounded-md font-semibold transition-colors ${
                  postType === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {language === 'bn' ? 'সকল' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPostType('LOST');
                  setPage(1);
                }}
                className={`py-1.5 text-xs rounded-md font-semibold transition-colors ${
                  postType === 'LOST'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                {language === 'bn' ? 'হারানো' : 'Lost'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPostType('FOUND');
                  setPage(1);
                }}
                className={`py-1.5 text-xs rounded-md font-semibold transition-colors ${
                  postType === 'FOUND'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {language === 'bn' ? 'প্রাপ্ত' : 'Found'}
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.filterCategory}
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">
                {language === 'bn' ? '-- সকল ক্যাটাগরি --' : '-- All Categories --'}
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'bn' ? c.nameBn : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Division Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.filterDivision}
            </label>
            <select
              value={division}
              onChange={(e) => handleDivisionChange(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">
                {language === 'bn' ? '-- সকল বিভাগ --' : '-- All Divisions --'}
              </option>
              {DIVISIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {language === 'bn' ? d.nameBn : d.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter (Dynamic) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.filterDistrict}
            </label>
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">
                {language === 'bn' ? '-- সকল জেলা --' : '-- All Districts --'}
              </option>
              {availableDistricts.map((dst) => (
                <option key={dst.id} value={dst.id}>
                  {language === 'bn' ? dst.nameBn : dst.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.filterStatus}
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">{t.statusAll}</option>
              <option value="ACTIVE">{t.statusActive}</option>
              <option value="RESOLVED">{t.statusResolved}</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.dateRange}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-3xs text-slate-400 block mb-0.5">{t.dateFrom}</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-1.5 text-xs rounded-md border border-slate-200"
                />
              </div>
              <div>
                <span className="text-3xs text-slate-400 block mb-0.5">{t.dateTo}</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-1.5 text-xs rounded-md border border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'bn' ? 'তথ্য লোড হচ্ছে...' : 'Loading verified items...'}
              </p>
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={(id) => onNavigate('item', { id })}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-6 flex items-center justify-center gap-2 border-t border-slate-200">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-semibold text-slate-600 px-3">
                    {language === 'bn'
                      ? `পৃষ্ঠা ${page} এর ${totalPages}`
                      : `Page ${page} of ${totalPages}`}
                  </span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">{t.noResults}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">{t.noResultsDesc}</p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-lg transition-colors inline-block"
                >
                  {t.clearFilters}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
