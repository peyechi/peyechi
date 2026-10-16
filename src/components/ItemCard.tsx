import React from 'react';
import { MapPin, Calendar, Eye, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { CATEGORIES, DISTRICTS, DIVISIONS } from '../data/bangladeshData.ts';
import { CategoryIcon } from './CategoryIcon.tsx';

export interface ItemCardData {
  id: string;
  post_type: 'LOST' | 'FOUND';
  category: string;
  title: string;
  description: string;
  division: string;
  district: string;
  upazila_thana?: string;
  general_location: string;
  event_date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
  images?: { id: string; storage_path: string }[];
  views_count?: number;
  created_at: string;
}

interface ItemCardProps {
  item: ItemCardData;
  onClick: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const { language } = useLanguage();

  const categoryObj = CATEGORIES.find((c) => c.id === item.category);
  const categoryName = categoryObj
    ? language === 'bn'
      ? categoryObj.nameBn
      : categoryObj.nameEn
    : item.category;

  const districtObj = DISTRICTS.find((d) => d.id === item.district);
  const districtName = districtObj
    ? language === 'bn'
      ? districtObj.nameBn
      : districtObj.nameEn
    : item.district;

  const divisionObj = DIVISIONS.find((div) => div.id === item.division);
  const divisionName = divisionObj
    ? language === 'bn'
      ? divisionObj.nameBn
      : divisionObj.nameEn
    : item.division;

  const isLost = item.post_type === 'LOST';
  const isResolved = item.status === 'RESOLVED';

  // Format date
  const dateFormatted = new Date(item.event_date).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  return (
    <div
      onClick={() => onClick(item.id)}
      className="group bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col h-full hover:border-slate-300 relative"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(item.id);
        }
      }}
    >
      {/* Top Banner: Image or Category Header */}
      {item.images && item.images.length > 0 ? (
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
          <img
            src={item.images[0].storage_path}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase shadow-xs ${
                isLost ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {isLost ? (language === 'bn' ? 'হারানো' : 'LOST') : language === 'bn' ? 'প্রাপ্ত' : 'FOUND'}
            </span>
            {isResolved && (
              <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3 h-3" />
                {language === 'bn' ? 'ফেরত দেওয়া হয়েছে' : 'Resolved'}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`h-24 w-full p-3 flex flex-col justify-between border-b ${
            isLost ? 'bg-rose-50/60 border-rose-100' : 'bg-emerald-50/60 border-emerald-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                  isLost ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {isLost ? (language === 'bn' ? 'হারানো' : 'LOST') : language === 'bn' ? 'প্রাপ্ত' : 'FOUND'}
              </span>
              {isResolved && (
                <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {language === 'bn' ? 'ফেরত সম্পন্ন' : 'Resolved'}
                </span>
              )}
            </div>
            <div className="text-slate-500 bg-white/80 p-1.5 rounded-full shadow-2xs">
              <CategoryIcon category={item.category} className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          <span className="text-xs font-medium text-slate-600">
            {categoryName}
          </span>
        </div>
      )}

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 text-base leading-snug mb-2">
            {item.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {item.description}
          </p>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {item.upazila_thana ? `${item.upazila_thana}, ` : ''}
              {districtName}, {divisionName}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{dateFormatted}</span>
            </div>
            {item.views_count !== undefined && (
              <div className="flex items-center gap-1 text-slate-400 text-2xs">
                <Eye className="w-3 h-3" />
                <span>{item.views_count}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
